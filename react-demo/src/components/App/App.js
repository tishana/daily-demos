import React, { useReducer, useEffect } from "react";
import Call from "../Call/Call";
import StartButton from "../StartButton/StartButton";
import {
  appReducer,
  initialAppState,
  CREATE_ROOM_START,
  CREATE_ROOM_FINISH,
  LEAVE_ROOM
} from "./appState";
import api from "../../api";
import "./App.css";
import Tray from "../Tray/Tray";
import CallObjectContext from "../../CallObjectContext";
import { roomUrlFromPageUrl, pageUrlFromRoomUrl } from "../../urlUtils";

function App() {
  const [appState, dispatch] = useReducer(appReducer, initialAppState);

  /**
   * Check if room already specified in page URL, when component mounts.
   */
  useEffect(() => {
    const roomUrl = roomUrlFromPageUrl();
    roomUrl && dispatch({ type: CREATE_ROOM_FINISH, url: roomUrl });
  }, []);

  /**
   * Update the page's URL to reflect the active call when appState.roomUrl changes
   */
  useEffect(() => {
    const pageUrl = pageUrlFromRoomUrl(appState.roomUrl);
    if (pageUrl === window.location.href) return;
    window.history.pushState(null, null, pageUrl);
  }, [appState.roomUrl]);

  /**
   * Start createRoom API call when appState.isCreating is set
   */
  useEffect(() => {
    if (!appState.isCreatingRoom) return;
    api
      .createRoom()
      .then(room => dispatch({ type: CREATE_ROOM_FINISH, url: room.url }))
      .catch(error => dispatch({ type: CREATE_ROOM_FINISH, error }));
  }, [appState.isCreatingRoom]);

  return (
    <CallObjectContext.Provider value={appState.callObject}>
      <div className="app">
        {appState.roomUrl ? (
          <>
            <Call roomUrl={appState.roomUrl} />
            <Tray onClickLeaveCall={() => dispatch({ type: LEAVE_ROOM })} />
          </>
        ) : (
          <StartButton
            disabled={appState.isCreatingRoom}
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
