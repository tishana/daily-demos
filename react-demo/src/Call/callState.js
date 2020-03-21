/**
 * Call state is comprised of:
 * - "Call items" (inputs to the call, i.e. participants or shared screens)
 * - UI state that depends on call items
 *
 * Call items are keyed by id:
 * - "local" for the current participant
 * - A session id for each remote participant
 * - "<id>-screen" for each shared screen
 */
const initialCallState = {
  callItems: {
    local: {
      isLoading: true,
      audioTrack: null,
      videoTrack: null
    }
  },
  showClickAllow: false
};

// --- Actions ---

/**
 * CLICK_ALLOW_TIMEOUT action structure:
 * - type: String
 */
const CLICK_ALLOW_TIMEOUT = "CLICK_ALLOW_TIMEOUT";

/**
 * PARTICIPANTS_CHANGE action structure:
 * - type: String
 * - participants: Object (from Daily.co callObject.participants())
 */
const PARTICIPANTS_CHANGE = "PARTICIPANTS_CHANGE";

// --- Reducer and helpers --

function callReducer(callState, action) {
  switch (action.type) {
    case CLICK_ALLOW_TIMEOUT:
      return {
        ...callState,
        showClickAllow: getShowClickAllow(callState.callItems)
      };
    case PARTICIPANTS_CHANGE:
      const callItems = getCallItems(action.participants, callState.callItems);
      return {
        callItems,
        showClickAllow: getShowClickAllow(callItems)
      };
    default:
      throw new Error();
  }
}

function getShowClickAllow(callItems) {
  const hasLoaded =
    localCallItem(callItems) && !localCallItem(callItems).isLoading;
  return !hasLoaded;
}

function localCallItem(callItems) {
  return callItems["local"];
}

function getCallItems(participants, prevCallItems) {
  let callItems = {};
  for (const [id, participant] of Object.entries(participants)) {
    // Here we assume that a participant will join with audio/video enabled.
    // This assumption lets us show a "loading" state before we receive audio/video tracks.
    // This may not be true for all apps, but the call object doesn't yet support distinguishing
    // between cases where audio/video are missing because they're still loading or muted.
    const hasLoaded = prevCallItems[id] && !prevCallItems[id].isLoading;
    const missingTracks = !(participant.audioTrack || participant.videoTrack);
    callItems[id] = {
      isLoading: !hasLoaded && missingTracks,
      audioTrack: participant.audioTrack,
      videoTrack: participant.videoTrack
    };
    if (participant.screenVideoTrack) {
      callItems[id + "-screen"] = {
        isLoading: false,
        videoTrack: participant.screenVideoTrack
      };
    }
  }
  return callItems;
}

// --- Derived data ---

// True if id corresponds to local participant (*not* their screen share)
function isLocal(id) {
  return id === "local";
}

function isScreenShare(id) {
  return id.endsWith("-screen");
}

function containsScreenShare(callItems) {
  return Object.keys(callItems).some(id => isScreenShare(id));
}

export {
  initialCallState,
  CLICK_ALLOW_TIMEOUT,
  PARTICIPANTS_CHANGE,
  callReducer,
  isLocal,
  isScreenShare,
  containsScreenShare
};
