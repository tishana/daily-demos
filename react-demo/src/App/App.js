import React, { useReducer, useEffect, useRef } from "react";
import DailyIframe from "@daily-co/daily-js";
import Call from "../Call/Call";
import StartButton from "../StartButton/StartButton";
import {
  roomReducer,
  initialRoomState,
  CREATE_ROOM_START,
  CREATE_ROOM_FINISH
} from "./roomState";
import api from "../api";
import "./App.css";
import Tray from "../Tray/Tray";
import CallObjectContext from "../CallObjectContext";

function roomUrlFromQueryString() {
  const match = window.location.search.match(/roomUrl=([^&]+)/i);
  return match && match[1] ? decodeURIComponent(match[1]) : null;
}

function App() {
  const [roomState, dispatch] = useReducer(roomReducer, {
    ...initialRoomState,
    url: roomUrlFromQueryString()
  });
  const callObject = useRef(DailyIframe.createCallObject());

  // Update the page's URL to reflect the active call when room.url changes
  useEffect(() => {
    if (roomState.url) {
      const callUrl =
        window.location.href.split("?")[0] +
        `?roomUrl=${encodeURIComponent(roomState.url)}`;
      window.history.pushState(null, null, callUrl);
    }
  }, [roomState.url]);

  // Start createRoom API call when roomState.isCreating is set
  useEffect(() => {
    if (roomState.isCreating) {
      api
        .createRoom()
        .then(room => dispatch({ type: CREATE_ROOM_FINISH, url: room.url }))
        .catch(error => dispatch({ type: CREATE_ROOM_FINISH, error }));
    }
  }, [roomState.isCreating]);

  return (
    <CallObjectContext.Provider value={callObject.current}>
      <div className="app">
        {roomState.url ? (
          <>
            <Call roomUrl={roomState.url} />
            <Tray />
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
