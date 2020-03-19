import React, { useReducer, useEffect } from "react";
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

function roomUrlFromQueryString() {
  const match = window.location.search.match(/roomUrl=([^&]+)/i);
  return match && match[1] ? decodeURIComponent(match[1]) : null;
}

function App() {
  const [roomState, dispatch] = useReducer(roomReducer, {
    ...initialRoomState,
    url: roomUrlFromQueryString()
  });

  // Update the page's URL to reflect the active call when room.url changes
  useEffect(() => {
    if (roomState.url) {
      const callUrl =
        window.location.href.split("?")[0] +
        `?roomUrl=${encodeURIComponent(roomState.url)}`;
      window.history.pushState(null, null, callUrl);
    }
  }, [roomState.url]);

  // Start createRoom API call when room.isCreating is set
  useEffect(() => {
    if (roomState.isCreating) {
      api
        .createRoom()
        .then(room => dispatch({ type: CREATE_ROOM_FINISH, url: room.url }))
        .catch(error => dispatch({ type: CREATE_ROOM_FINISH, error }));
    }
  }, [roomState.isCreating]);

  return (
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
  );
}

export default App;
