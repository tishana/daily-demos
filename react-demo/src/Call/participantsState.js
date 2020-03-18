const initialParticipantsState = {};

const initialRemoteParticipantState = {
  audio: null,
  video: null,
  isLocal: false
};
const initialLocalParticipantState = {
  audio: null,
  video: null,
  isLocal: true
};

// ADD_PARTICIPANT action structure:
// - type: String
// - sessionId: String
const ADD_PARTICIPANT = "ADD_PARTICIPANT";

// REMOVE_PARTICIPANT action structure:
// - type: String
// - sessionId: String
const REMOVE_PARTICIPANT = "REMOVE_PARTICIPANT";

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
// - audio: MediaStreamTrack?
// - video: MediaStreamTrack?
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
    case ADD_PARTICIPANT:
      // Add an entry for a new remote participant
      if (!participants[action.sessionId]) {
        return {
          ...participants,
          [action.sessionId]: initialRemoteParticipantState
        };
      }
      return participants;
    case REMOVE_PARTICIPANT:
      // Remove the entry for the remote participant if it exists
      return removeProperty(action.sessionId, participants);
    case ADD_TRACK: {
      // Add a track to an existing participant.
      // If the participant doesn't exist, create one just to be safe.
      const participant = participants[action.sessionId] || {
        isLocal: action.isLocal
      };
      return {
        ...participants,
        [action.sessionId]: participantReducer(participant, action)
      };
    }
    case REMOVE_TRACK: {
      // Remove a track from an existing participant.
      const [sessionId, participant] = findByTrack(action.track);
      const updatedParticipant = participantReducer(participant, action);
      return { ...participants, [sessionId]: updatedParticipant };
    }
    default:
      throw new Error();
  }
}

export {
  initialParticipantsState,
  ADD_PARTICIPANT,
  REMOVE_PARTICIPANT,
  ADD_TRACK,
  REMOVE_TRACK,
  participantsReducer
};
