import React, { useEffect, useContext, useReducer } from "react";
import "./Call.css";
import Tile from "../Tile/Tile";
import CallObjectContext from "../../CallObjectContext";
import CallMessage from "../CallMessage/CallMessage";
import {
  initialCallState,
  CLICK_ALLOW_TIMEOUT,
  PARTICIPANTS_CHANGE,
  CAM_OR_MIC_ERROR,
  FATAL_ERROR,
  callReducer,
  isLocal,
  isScreenShare,
  containsScreenShare,
  getMessage
} from "./callState";
import { logDailyEvent } from "../../logUtils";

export default function Call() {
  const callObject = useContext(CallObjectContext);
  const [callState, dispatch] = useReducer(callReducer, initialCallState);

  /**
   * Start listening for participant changes, when the callObject is set.
   *
   * NOTE: typically you'd specify an effect cleanup function (like the one
   * commented out below), but since it'd fire while callObject.destroy() is
   * occurring, it'd trigger an error (and callObject.destroy() cleans up
   * event listeners).
   */
  useEffect(() => {
    if (!callObject) return;

    const events = [
      "participant-joined",
      "participant-updated",
      "participant-left"
    ];

    function handleParticipantChangeEvent(e) {
      logDailyEvent(e);
      dispatch({
        type: PARTICIPANTS_CHANGE,
        participants: callObject.participants()
      });
    }

    for (const event of events) {
      callObject.on(event, handleParticipantChangeEvent);
    }

    // return function cleanup() {
    // for (const event of events) {
    //   callObject && callObject.off(event, handleParticipantChangeEvent);
    // }
    // };
  }, [callObject]);

  /**
   * Start listening for call errors, when the callObject is set.
   *
   * NOTE: typically you'd specify an effect cleanup function (like the one
   * commented out below), but since it'd fire while callObject.destroy() is
   * occurring, it'd trigger an error (and callObject.destroy() cleans up
   * event listeners).
   */
  useEffect(() => {
    if (!callObject) return;

    function handleCameraErrorEvent(e) {
      logDailyEvent(e);
      dispatch({
        type: CAM_OR_MIC_ERROR,
        message: (e && e.errorMsg && e.errorMsg.errorMsg) || "Unknown"
      });
    }

    callObject.on("camera-error", handleCameraErrorEvent);

    // return function cleanup() {
    // callObject.off("camera-error", handleCameraErrorEvent);
    // };
  }, [callObject]);

  /**
   * Start listening for fatal errors, when the callObject is set.
   *
   * NOTE: typically you'd specify an effect cleanup function (like the one
   * commented out below), but since it'd fire while callObject.destroy() is
   * occurring, it'd trigger an error (and callObject.destroy() cleans up
   * event listeners).
   */
  useEffect(() => {
    if (!callObject) return;

    function handleErrorEvent(e) {
      logDailyEvent(e);
      dispatch({
        type: FATAL_ERROR,
        message: (e && e.errorMsg) || "Unknown"
      });
    }

    callObject.on("error", handleErrorEvent);

    // return function cleanup() {
    // callObject.off(handleErrorEvent);
    // };
  }, [callObject]);

  /**
   * Start a timer to show the "click allow" message, when the component mounts.
   */
  useEffect(() => {
    const t = setTimeout(() => {
      dispatch({ type: CLICK_ALLOW_TIMEOUT });
    }, 2500);

    return function cleanup() {
      clearTimeout(t);
    };
  }, []);

  function getTiles() {
    let largeTiles = [];
    let smallTiles = [];
    Object.entries(callState.callItems).forEach(([id, callItem]) => {
      const isLarge =
        isScreenShare(id) ||
        (!isLocal(id) && !containsScreenShare(callState.callItems));
      const tile = (
        <Tile
          key={id}
          videoTrack={callItem.videoTrack}
          audioTrack={callItem.audioTrack}
          isLocalPerson={isLocal(id)}
          isLarge={isLarge}
          isLoading={callItem.isLoading}
        />
      );
      if (isLarge) {
        largeTiles.push(tile);
      } else {
        smallTiles.push(tile);
      }
    });
    return [largeTiles, smallTiles];
  }

  const [largeTiles, smallTiles] = getTiles();
  const message = getMessage(callState);
  return (
    <div className="call">
      {message && (
        <CallMessage
          header={message.header}
          detail={message.detail}
          isError={message.isError}
        />
      )}
      <div className="large-tiles">
        {!message
          ? largeTiles
          : null /* Avoid showing large tiles to make room for the message */}
      </div>
      <div className="small-tiles">{smallTiles}</div>
    </div>
  );
}
