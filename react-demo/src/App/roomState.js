const initialRoomState = { isCreating: false, url: null, error: null };

// CREATE_ROOM_START action structure:
// - type: String
const CREATE_ROOM_START = "CREATE_ROOM_START";

// CREATE_ROOM_FINISH action structure:
// - type: String
// - url: String?
// - error: Error?
const CREATE_ROOM_FINISH = "CREATE_ROOM_FINISH";

function roomReducer(room, action) {
  switch (action.type) {
    case CREATE_ROOM_START:
      return { isCreating: true, url: null, error: null };
    case CREATE_ROOM_FINISH:
      return { isCreating: false, url: action.url, error: action.error };
    default:
      throw new Error();
  }
}

export { initialRoomState, CREATE_ROOM_START, CREATE_ROOM_FINISH, roomReducer };
