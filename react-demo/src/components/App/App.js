import React, { useEffect, useState, useCallback } from "react";
import Call from "../Call/Call";
import StartButton from "../StartButton/StartButton";
import api from "../../api";
import "./App.css";
import Tray from "../Tray/Tray";
import CallObjectContext from "../../CallObjectContext";
import { roomUrlFromPageUrl, pageUrlFromRoomUrl } from "../../urlUtils";
import DailyIframe from "@daily-co/daily-js";
import { logDailyEvent } from "../../logUtils";

const STATE_IDLE = "STATE_IDLE";
const STATE_CREATING = "STATE_CREATING";
const STATE_JOINING = "STATE_JOINING";
const STATE_JOINED = "STATE_JOINED";
const STATE_ERROR = "STATE_ERROR";
const STATE_TEARING_DOWN = "STATE_TEARING_DOWN";

export default function App() {
  const [appState, setAppState] = useState(STATE_IDLE);
  const [roomUrl, setRoomUrl] = useState(null);
  const [callObject, setCallObject] = useState(null);

  const joinCall = useCallback(url => {
    const callObject = DailyIframe.createCallObject();
    callObject.join({ url });
    setRoomUrl(url);
    setCallObject(callObject);
    setAppState(STATE_JOINING);
  }, []);

  const startCall = useCallback(() => {
    setAppState(STATE_CREATING);
    api
      .createRoom()
      .then(room => {
        joinCall(room.url);
      })
      .catch(error => {
        console.log("Error creating room", error);
        setRoomUrl(null);
        setAppState(STATE_IDLE);
      });
  }, [joinCall]);

  const leaveCall = useCallback(() => {
    setAppState(STATE_TEARING_DOWN);
    callObject &&
      callObject.destroy().then(() => {
        setRoomUrl(null);
        setCallObject(null);
        setAppState(STATE_IDLE);
      });
  }, [callObject]);

  /**
   * If a room's already specified in the page's URL when the component mounts,
   * join the room.
   */
  useEffect(() => {
    const url = roomUrlFromPageUrl();
    url && joinCall(url);
  }, [joinCall]);

  /**
   * Update the page's URL to reflect the active call when roomUrl changes.
   *
   * This demo uses replaceState rather than pushState in order to avoid a bit
   * of state-management complexity. See the comments around enableCallButtons
   * and enableStartButton for more information.
   */
  useEffect(() => {
    const pageUrl = pageUrlFromRoomUrl(roomUrl);
    if (pageUrl === window.location.href) return;
    window.history.replaceState(null, null, pageUrl);
  }, [roomUrl]);

  /**
   * Uncomment to attach call object to window for debugging purposes.
   */
  // useEffect(() => {
  //   window.callObject = appState.callObject;
  // }, [appState.callObject]);

  /**
   * Update app state based on reported meeting state changes.
   *
   * NOTE: typically you'd specify an effect cleanup function (like the one
   * commented out below), but since it'd fire while callObject.destroy() is
   * occurring, it'd trigger an error (and callObject.destroy() cleans up
   * event listeners).
   */
  useEffect(() => {
    if (!callObject) return;

    const events = ["joined-meeting", "left-meeting", "error"];

    function handleMeetingStateChange(e) {
      logDailyEvent(e);
      switch (callObject.meetingState()) {
        case "joined-meeting":
          setAppState(STATE_JOINED);
          break;
        case "left-meeting":
          leaveCall();
          break;
        case "error":
          setAppState(STATE_ERROR);
          break;
        default:
          break;
      }
    }

    for (const event of events) {
      callObject.on(event, handleMeetingStateChange);
    }

    // return function cleanup() {
    // for (const event of events) {
    // callObject.off(event, handleMeetingStateChange);
    // }
    // };
  }, [callObject, leaveCall]);

  /**
   * Show the call UI if we're either joining, already joined, or are showing
   * an error.
   */
  const showCall = [STATE_JOINING, STATE_JOINED, STATE_ERROR].includes(
    appState
  );

  /**
   * Only enable the call buttons (camera toggle, leave call, etc.) if we're joined
   * of if we've errored out.
   *
   * !!!
   * IMPORTANT: calling callObject.destroy() *before* we get the "joined-meeting"
   * can result in unexpected behavior. Disabling the leave call button
   * until then avoids this scenario.
   * !!!
   */
  const enableCallButtons = [STATE_JOINED, STATE_ERROR].includes(appState);

  /**
   * Only enable the start button if we're in an idle state (i.e. not creating,
   * joining, etc.).
   *
   * !!!
   * IMPORTANT: only one call object is meant to be used at a time. Creating a
   * new call object with DailyIframe.createCallObject() *before* your previous
   * callObject.destroy() completely finishes can result in unexpected behavior.
   * Disabling the start button until then avoids that scenario.
   * !!!
   */
  const enableStartButton = appState === STATE_IDLE;

  return (
    <div className="app">
      {showCall ? (
        <CallObjectContext.Provider value={callObject}>
          <Call roomUrl={roomUrl} />
          <Tray disabled={!enableCallButtons} onClickLeaveCall={leaveCall} />
        </CallObjectContext.Provider>
      ) : (
        <StartButton disabled={!enableStartButton} onClick={startCall} />
      )}
    </div>
  );
}
