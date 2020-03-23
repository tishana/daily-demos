import DailyIframe from "@daily-co/daily-js";

const initialRoomState = {
  isCreating: false,
  url: null,
  error: null,
  callObject: null
};

// --- Actions ---

/**
 * CREATE_ROOM_START action structure:
 * - type: String
 */
const CREATE_ROOM_START = "CREATE_ROOM_START";

/**
 * CREATE_ROOM_FINISH action structure:
 * - type: String
 * - url: String?
 * - error: Error?
 */
const CREATE_ROOM_FINISH = "CREATE_ROOM_FINISH";

// --- Reducer ---

/**
 * NOTE: we *could* just keep the same call object around for the lifetime
 * of the app and simply join() and leave() rooms, but we're doing it
 * this way (tying a call object to a room, destroying and re-creating it
 * when the room changes) to illustrate proper cleanup if you wanted to free up
 * resources while not in a call.
 */
function roomReducer(room, action) {
  switch (action.type) {
    case CREATE_ROOM_START:
      room.callObject && room.callObject.destroy();
      return { isCreating: true, url: null, error: null, callObject: null };
    case CREATE_ROOM_FINISH:
      return {
        isCreating: false,
        url: action.url,
        error: action.error,
        callObject: DailyIframe.createCallObject()
      };
    default:
      throw new Error();
  }
}

export { initialRoomState, CREATE_ROOM_START, CREATE_ROOM_FINISH, roomReducer };
