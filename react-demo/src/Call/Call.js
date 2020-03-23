import React, { useEffect, useContext, useReducer } from "react";
import "./Call.css";
import Tile from "../Tile/Tile";
import CallObjectContext from "../CallObjectContext";
import CallMessage from "../CallMessage/CallMessage";
import {
  initialCallState,
  CLICK_ALLOW_TIMEOUT,
  PARTICIPANTS_CHANGE,
  callReducer,
  isLocal,
  isScreenShare,
  containsScreenShare,
  getUIMessage
} from "./callState";

/**
 * Props
 * - roomUrl: String
 */
function Call(props) {
  const callObject = useContext(CallObjectContext);
  const [callState, dispatch] = useReducer(callReducer, initialCallState);

  /**
   * Start listening for participant changes, when the roomUrl and callObject are set.
   */
  useEffect(() => {
    if (!callObject) return;

    for (const event of [
      "participant-joined",
      "participant-updated",
      "participant-left"
    ]) {
      callObject.on(event, e => {
        console.log("[daily.co event]", e.action);
        dispatch({
          type: PARTICIPANTS_CHANGE,
          participants: callObject.participants()
        });
      });
    }
  }, [callObject]);

  /**
   * Join the call when the roomUrl and callObject are set.
   */
  useEffect(() => {
    if (!(props.roomUrl && callObject)) return;
    callObject.join({ url: props.roomUrl });
  }, [callObject, props.roomUrl]);

  /**
   * Start a timer to show the "click allow" message, when the component mounts.
   */
  useEffect(() => {
    setTimeout(() => {
      dispatch({ type: CLICK_ALLOW_TIMEOUT });
    }, 2500);
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
  const message = getUIMessage(callState);
  return (
    <div className="call">
      {message && <CallMessage message={message} />}
      <div className="large-tiles">
        {!message
          ? largeTiles
          : null /* Avoid showing large tiles to make room for the message */}
      </div>
      <div className="small-tiles">{smallTiles}</div>
    </div>
  );
}

export default Call;
