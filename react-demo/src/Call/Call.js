import React, { useEffect, useState, useContext } from "react";
import "./Call.css";
import Participant from "../Participant/Participant";
import Invite from "../Invite/Invite";
import CallObjectContext from "../CallObjectContext";

// Participants state structure:
// {
//   local: {
//     isLoading: ...,
//     audioTrack: ...,
//     videoTrack: ...
//   },
//   <participantSessionId1>: {
//     isLoading: ...,
//     audioTrack: ...,
//     videoTrack: ...
//   },
//   <participantSessionId2>: { ... },
// }
const initialParticipants = {
  local: { isLoading: true }
};

// Props
// - roomUrl: String
function Call(props) {
  const callObject = useContext(CallObjectContext);
  const [participants, setParticipants] = useState(initialParticipants);

  function updateParticipants(e) {
    function toParticipants(prevParticipants, callObjectParticipants) {
      let participants = {};
      for (const [id, callObjectParticipant] of Object.entries(
        callObjectParticipants
      )) {
        // Show loading if there's no audio or video track and we weren't already loaded
        // (in which case it could be that the mic and camera were simply turned off).
        // TODO: is this reasoning correct? How can we detect if other person starts with mic and camera off?
        const previouslyLoaded =
          prevParticipants[id] && !prevParticipants[id].isLoading;
        const missingTracks = !(
          callObjectParticipant.audioTrack || callObjectParticipant.videoTrack
        );
        participants[id] = {
          isLoading: !previouslyLoaded && missingTracks,
          audioTrack: callObjectParticipant.audioTrack,
          videoTrack: callObjectParticipant.videoTrack
        };
      }
      return participants;
    }

    console.log("[daily.co event]", e.action);
    const callObjectParticipants = callObject.participants();
    setParticipants(prevParticipants => {
      return toParticipants(prevParticipants, callObjectParticipants);
    });
  }

  // Join the call when the roomUrl is set (e.g. when the component mounts).
  useEffect(() => {
    if (props.roomUrl) {
      callObject.on("participant-joined", updateParticipants);
      callObject.on("participant-updated", updateParticipants);
      callObject.on("participant-left", updateParticipants);
      callObject.join({ url: props.roomUrl });
    }
  }, [props.roomUrl]);

  const participantCount = Object.keys(participants).length;
  return (
    <div className="call">
      {Object.entries(participants).map(([id, participant]) => {
        return (
          <Participant
            key={id}
            videoTrack={participant.videoTrack}
            audioTrack={participant.audioTrack}
            isLocal={id === "local"}
            totalParticipantCount={participantCount}
            isLoading={participant.isLoading}
          />
        );
      })}
      {participantCount === 1 && <Invite />}
    </div>
  );
}

export default Call;
