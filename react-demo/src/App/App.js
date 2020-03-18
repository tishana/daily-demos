import React, { useReducer, useEffect } from "react";
import Call from "../Call/Call";
import Startbutton from "../StartButton/StartButton";
import {
  roomReducer,
  initialRoomState,
  CREATE_ROOM_START,
  CREATE_ROOM_FINISH
} from "./room";
import api from "../api";
import "./App.css";

function roomUrlFromQueryString() {
  const match = window.location.search.match(/roomUrl=([^&]+)/i);
  return match && match[1] ? decodeURIComponent(match[1]) : null;
}

function App() {
  const [room, dispatch] = useReducer(roomReducer, {
    ...initialRoomState,
    url: roomUrlFromQueryString()
  });

  // Update the page's URL to reflect the active call when room.url changes
  useEffect(() => {
    if (room.url) {
      const callUrl =
        window.location.href.split("?")[0] +
        `?roomUrl=${encodeURIComponent(room.url)}`;
      window.history.pushState(null, null, callUrl);
    }
  }, [room.url]);

  // Start createRoom API call when room.isCreating is set
  useEffect(() => {
    if (room.isCreating) {
      api
        .createRoom()
        .then(room => dispatch({ type: CREATE_ROOM_FINISH, url: room.url }))
        .catch(error => dispatch({ type: CREATE_ROOM_FINISH, error }));
    }
  }, [room.isCreating]);

  if (room.url) {
    return <Call roomUrl={room.url} />;
  } else {
    return (
      <Startbutton
        disabled={room.isCreating}
        onClick={() => {
          dispatch({ type: CREATE_ROOM_START });
        }}
      />
    );
  }
}

export default App;
