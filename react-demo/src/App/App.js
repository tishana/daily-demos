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

function App() {
  const [room, dispatch] = useReducer(roomReducer, initialRoomState);

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
