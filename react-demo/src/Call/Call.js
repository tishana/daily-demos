import React, { useEffect, useReducer } from "react";
import DailyIframe from "@daily-co/daily-js";
import "./Call.css";
import Participant from "../Participant/Participant";
import Invite from "../Invite/Invite";
import {
  initialParticipantsState,
  ADD_PARTICIPANT,
  REMOVE_PARTICIPANT,
  ADD_TRACK,
  REMOVE_TRACK,
  participantsReducer
} from "./participantsState";

// Props
// - roomUrl: String
function Call(props) {
  const [participantsState, dispatch] = useReducer(
    participantsReducer,
    initialParticipantsState
  );

  function participantJoined(e) {
    dispatch({ type: ADD_PARTICIPANT, sessionId: e.participant.session_id });
  }

  function participantLeft(e) {
    dispatch({ type: REMOVE_PARTICIPANT, sessionId: e.participant.session_id });
  }

  function trackStarted(e) {
    dispatch({
      type: ADD_TRACK,
      sessionId: e.participant.session_id,
      track: e.track,
      isLocal: e.participant.local
    });
  }

  function trackStopped(e) {
    dispatch({ type: REMOVE_TRACK, track: e.track });
  }

  // Initialize the call object when the roomUrl is set (e.g. when the component mounts)
  useEffect(() => {
    const callObject = DailyIframe.createCallObject();
    callObject.join({ url: props.roomUrl });
    callObject.on("track-started", trackStarted);
    callObject.on("track-stopped", trackStopped);
    callObject.on("participant-joined", participantJoined);
    callObject.on("participant-left", participantLeft);
  }, [props.roomUrl]);

  const participantCount = Object.keys(participantsState).length;
  return (
    <>
      {Object.entries(participantsState).map(([sessionId, participant]) => {
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
      {participantCount === 1 && <Invite />}
    </>
  );
}

export default Call;
