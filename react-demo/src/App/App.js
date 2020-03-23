import React, { useReducer, useEffect } from "react";
import Call from "../Call/Call";
import StartButton from "../StartButton/StartButton";
import {
  roomReducer,
  initialRoomState,
  CREATE_ROOM_START,
  CREATE_ROOM_FINISH,
  LEAVE_ROOM
} from "./roomState";
import api from "../api";
import "./App.css";
import Tray from "../Tray/Tray";
import CallObjectContext from "../CallObjectContext";
import { roomUrlFromPageUrl, pageUrlFromRoomUrl } from "./urlUtils";

function App() {
  const [roomState, dispatch] = useReducer(roomReducer, initialRoomState);

  /**
   * Check if room already specified in page URL, when component mounts.
   */
  useEffect(() => {
    const roomUrl = roomUrlFromPageUrl();
    roomUrl && dispatch({ type: CREATE_ROOM_FINISH, url: roomUrl });
  }, []);

  /**
   * Update the page's URL to reflect the active call when roomState.url changes
   */
  useEffect(() => {
    const pageUrl = pageUrlFromRoomUrl(roomState.url);
    if (pageUrl === window.location.href) return;
    window.history.pushState(null, null, pageUrl);
  }, [roomState.url]);

  /**
   * Start createRoom API call when roomState.isCreating is set
   */
  useEffect(() => {
    if (!roomState.isCreating) return;
    api
      .createRoom()
      .then(room => dispatch({ type: CREATE_ROOM_FINISH, url: room.url }))
      .catch(error => dispatch({ type: CREATE_ROOM_FINISH, error }));
  }, [roomState.isCreating]);

  return (
    <CallObjectContext.Provider value={roomState.callObject}>
      <div className="app">
        {roomState.url ? (
          <>
            <Call roomUrl={roomState.url} />
            <Tray onClickLeaveCall={() => dispatch({ type: LEAVE_ROOM })} />
          </>
        ) : (
          <StartButton
            disabled={roomState.isCreating}
            onClick={() => {
              dispatch({ type: CREATE_ROOM_START });
            }}
          />
        )}
      </div>
    </CallObjectContext.Provider>
  );
}

export default App;
