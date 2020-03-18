const initialParticipantsState = {};

// ADD_TRACK action structure:
// - type: String
// - track: MediaStreamTrack
// - sessionId: String
// - isLocal: Boolean
const ADD_TRACK = "ADD_TRACK";

// REMOVE_TRACK action structure:
// - type
// - track
const REMOVE_TRACK = "REMOVE_TRACK";

function removeProperty(prop, obj) {
  const { [prop]: _, ...newObj } = obj;
  return newObj;
}

// Participant state structure:
// - audio: MediaStreamTrack
// - video: MediaStreamTrack
// - isLocal: Boolean
function participantReducer(participant, action) {
  switch (action.type) {
    case ADD_TRACK:
      return { ...participant, [action.track.kind]: action.track };
    case REMOVE_TRACK:
      return removeProperty(action.track.kind, participant);
    default:
      throw new Error();
  }
}

// Participants state structure:
// { [sessionId]: [participant state] }
function participantsReducer(participants, action) {
  // Returns [sessionId, participant] pair
  function findByTrack(track) {
    return Object.entries(participants).find(([_, p]) => {
      return p[track.kind] && p[track.kind].id === track.id;
    });
  }

  switch (action.type) {
    case ADD_TRACK: {
      const participant = participants[action.sessionId] || {
        isLocal: action.isLocal
      };
      return {
        ...participants,
        [action.sessionId]: participantReducer(participant, action)
      };
    }
    case REMOVE_TRACK: {
      const [sessionId, participant] = findByTrack(action.track);
      const updatedParticipant = participantReducer(participant, action);
      if (!(updatedParticipant.audio || updatedParticipant.video)) {
        return removeProperty(sessionId, participants);
      }
      return { ...participants, [sessionId]: updatedParticipant };
    }
    default:
      throw new Error();
  }
}

export {
  initialParticipantsState,
  ADD_TRACK,
  REMOVE_TRACK,
  participantsReducer
};
