import React, { useEffect, useReducer } from "react";
import DailyIframe from "@daily-co/daily-js";
import "./App.css";
import Participant from "../Participant/Participant";

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

function App(props) {
  const [participants, dispatch] = useReducer(participantsReducer, {});

  // Initialize the call object when the roomUrl is set (e.g. when the component mounts)
  useEffect(() => {
    const callObject = DailyIframe.createCallObject();
    callObject.join({ url: props.roomUrl });
    callObject.on("track-started", e =>
      dispatch({
        type: ADD_TRACK,
        sessionId: e.participant.session_id,
        track: e.track,
        isLocal: e.participant.local
      })
    );
    callObject.on("track-stopped", e =>
      dispatch({ type: REMOVE_TRACK, track: e.track })
    );
  }, [props.roomUrl]);

  // Render participant components
  const participantCount = Object.keys(participants).length;
  return (
    <>
      {Object.entries(participants).map(([sessionId, participant]) => {
        return (
          <Participant
            key={sessionId}
            sessionId={sessionId}
            videoTrack={participant.video}
            audioTrack={participant.audio}
            isLocal={participant.isLocal}
            totalParticipantCount={participantCount}
          />
        );
      })}
    </>
  );
}

export default App;
