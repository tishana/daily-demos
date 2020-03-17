import React, { useState, useEffect } from "react";
import DailyIframe from "@daily-co/daily-js";
import "./App.css";
import Participant from "./Participant";

function App(props) {
  // Participants state, mapping sessionIds to objects with these properties:
  // - audioTrack: MediaStreamTrack
  // - videoTrack: MediaStreamTrack
  // - isLocal: Boolean
  const [participants, setParticipants] = useState({});

  // Update participant state when a track starts
  function trackStarted(e) {
    const sessionId = e.participant.session_id;
    const isLocal = e.participant.local;

    setParticipants(prevParticipants => {
      // Add track to participant state
      const prevParticipant = prevParticipants[sessionId] || {};
      let updatedParticipant = { ...prevParticipant, isLocal: isLocal };
      switch (e.track.kind) {
        case "video":
          updatedParticipant.videoTrack = e.track;
          break;
        case "audio":
          updatedParticipant.audioTrack = e.track;
          break;
        default:
          break;
      }

      // Update participant in overall participants state
      let updatedParticipants = { ...prevParticipants };
      updatedParticipants[sessionId] = updatedParticipant;
      return updatedParticipants;
    });
  }

  // Update participant state when a track ends
  function trackStopped(e) {
    const trackId = e.track.id;

    setParticipants(prevParticipants => {
      // Remove track from participant state
      let sessionId, prevParticipant, updatedParticipant;
      switch (e.track.kind) {
        case "video":
          [sessionId, prevParticipant] = Object.entries(prevParticipants).find(
            ([s, p]) => {
              return p.videoTrack && p.videoTrack.id === trackId;
            }
          );
          updatedParticipant = { ...prevParticipant };
          delete updatedParticipant.videoTrack;
          break;
        case "audio":
          [sessionId, prevParticipant] = Object.entries(prevParticipants).find(
            ([s, p]) => {
              return p.audioTrack && p.audioTrack.id === trackId;
            }
          );
          updatedParticipant = { ...prevParticipant };
          delete updatedParticipant.audioTrack;
          break;
        default:
          break;
      }
      console.log("updatedParticipant", updatedParticipant);

      // Update or delete participant from overall participants state
      let updatedParticipants = { ...prevParticipants };
      if (!(updatedParticipant.audioTrack || updatedParticipant.videoTrack)) {
        delete updatedParticipants[sessionId];
      } else {
        updatedParticipants[sessionId] = updatedParticipant;
      }
      return updatedParticipants;
    });
  }

  // Initialize the call object when the roomUrl is set (e.g. when the component mounts)
  useEffect(() => {
    const callObject = DailyIframe.createCallObject();
    callObject.join({ url: props.roomUrl });
    callObject.on("track-started", trackStarted);
    callObject.on("track-stopped", trackStopped);
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
            videoTrack={participant.videoTrack}
            audioTrack={participant.audioTrack}
            isLocal={participant.isLocal}
            totalParticipantCount={participantCount}
          />
        );
      })}
    </>
  );
}

export default App;
