import React, { useEffect, useState, useContext } from "react";
import "./Call.css";
import Tile from "../Tile/Tile";
import Invite from "../Invite/Invite";
import CallObjectContext from "../CallObjectContext";

// Call items here are representations of logical "inputs" into the call.
// Each is represented visually as a tile, and may have accompanying audio.
// Each participant's audio and video is bundled into a call item.
// Each shared screen is its own call item.
// Call items structure:
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
//   <participantSessionId1>-screen: { ... }
// }
const initialCallItems = {
  local: { isLoading: true }
};

function getCallItems(participants, prevCallItems) {
  let callItems = {};
  for (const [id, participant] of Object.entries(participants)) {
    // Here we assume that a participant will join with audio/video enabled.
    // This assumption lets us show a "loading" state before we receive audio/video tracks.
    // This may not be true for all apps, but the call object doesn't yet support distinguishing
    // between cases where audio/video are missing because they're still loading or muted.
    const previouslyLoaded = prevCallItems[id] && !prevCallItems[id].isLoading;
    const missingTracks = !(participants.audioTrack || participants.videoTrack);
    callItems[id] = {
      isLoading: !previouslyLoaded && missingTracks,
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

function isLocalPerson(id) {
  return id === "local";
}

function isScreenShare(id) {
  return id.endsWith("-screen");
}

function containsScreenShare(callItems) {
  return Object.keys(callItems).some(id => isScreenShare(id));
}

// Props
// - roomUrl: String
function Call(props) {
  const callObject = useContext(CallObjectContext);
  const [callItems, setCallItems] = useState(initialCallItems);

  function handleParticipantsChanged(e) {
    console.log("[daily.co event]", e.action);
    const participants = callObject.participants();
    setCallItems(prevCallItems => getCallItems(participants, prevCallItems));
  }

  // Join the call when the roomUrl is set (e.g. when the component mounts).
  useEffect(() => {
    if (props.roomUrl) {
      callObject.on("participant-joined", handleParticipantsChanged);
      callObject.on("participant-updated", handleParticipantsChanged);
      callObject.on("participant-left", handleParticipantsChanged);
      callObject.join({ url: props.roomUrl });
    }
  }, [props.roomUrl]);

  // Render either a large or small tile for each participant
  let largeTiles = [];
  let smallTiles = [];
  Object.entries(callItems).forEach(([id, callItem]) => {
    const isLarge =
      isScreenShare(id) ||
      (!isLocalPerson(id) && !containsScreenShare(callItems));
    const tile = (
      <Tile
        key={id}
        videoTrack={callItem.videoTrack}
        audioTrack={callItem.audioTrack}
        isLocalPerson={isLocalPerson(id)}
        isLarge={isLarge}
        isLoading={callItem.isLoading}
      />
    );
    if (isLarge) {
      largeTiles.push(tile);
    } else {
      smallTiles.push(tile);
    }
  });

  // Render call
  return (
    <div className="call">
      {Object.keys(callItems).length === 1 && <Invite />}
      <div className="large-tiles">{largeTiles}</div>
      <div className="small-tiles">{smallTiles}</div>
    </div>
  );
}

export default Call;
