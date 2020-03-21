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
  containsScreenShare
} from "./callState";

/**
 * Props
 * - roomUrl: String
 */
function Call(props) {
  const callObject = useContext(CallObjectContext);
  const [callState, dispatch] = useReducer(callReducer, initialCallState);

  /**
   * Join the call when the roomUrl is set (e.g. when the component mounts).
   */
  useEffect(() => {
    if (props.roomUrl) {
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
      callObject.join({ url: props.roomUrl });
      setTimeout(() => {
        dispatch({ type: CLICK_ALLOW_TIMEOUT });
      }, 2500);
    }
  }, [props.roomUrl, callObject]);

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

  function getMessage() {
    let message = "";
    if (callState.showClickAllow) {
      message = 'Click "Allow" to enable camera and mic access';
    } else if (Object.keys(callState.callItems).length === 1) {
      message = "Copy and share this page's URL to invite others";
    }
    return message;
  }

  const [largeTiles, smallTiles] = getTiles();
  const message = getMessage();
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
