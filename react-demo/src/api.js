const newRoomEndpoint =
  "https://fu6720epic.execute-api.us-west-2.amazonaws.com/default/dailyWwwApiDemoNewCall";

/**
 * Create a short-lived room for demo purposes.
 * To use the API to create your own rooms, see https://docs.daily.co/reference.
 */
async function createRoom() {
  let response = await fetch(newRoomEndpoint),
    room = await response.json();
  return room;
}

export default { createRoom };
