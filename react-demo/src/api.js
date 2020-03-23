const newRoomEndpoint =
  "https://fu6720epic.execute-api.us-west-2.amazonaws.com/default/dailyWwwApiDemoNewCall";

/**
 * Create a short-lived room for demo purposes.
 *
 * IMPORTANT: when calling the real REST API, it's a good idea to pass an
 * "exp" (expiration) parameter so you don't end up with a huge number of live
 * rooms.
 *
 * See https://docs.daily.co/reference#create-room for details.
 */
async function createRoom() {
  let response = await fetch(newRoomEndpoint),
    room = await response.json();
  return room;
}

export default { createRoom };
