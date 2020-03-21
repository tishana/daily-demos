import React, { useEffect, useState, useContext, useRef } from "react";
import "./Call.css";
import Tile from "../Tile/Tile";
import Invite from "../CallMessage/CallMessage";
import CallObjectContext from "../CallObjectContext";
import CallMessage from "../CallMessage/CallMessage";

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

function isLocalPerson(id) {
  return id === "local";
}

function isScreenShare(id) {
  return id.endsWith("-screen");
}

function containsScreenShare(callItems) {
  return Object.keys(callItems).some(id => isScreenShare(id));
}

function localPerson(callItems) {
  return callItems["local"];
}

// Props
// - roomUrl: String
function Call(props) {
  const callObject = useContext(CallObjectContext);
  const [callItems, setCallItems] = useState(initialCallItems);
  const [showClickAllow, setShowClickAllow] = useState(false);

  // Unfortunately the below two lines are a bit of weird complexity due to being a stateful functional component.
  // We need access to the *latest* callItems when showClickAllowMessageIfNeeded() is called on a timeout.
  // TODO: this is wonky. This will go away when we have a CallState object (then we can update using setState(() => {}))
  const callItemsRef = useRef(callItems);
  callItemsRef.current = callItems; // Updates references every render

  function showClickAllowMessageIfNeeded() {
    const callItems = callItemsRef.current;
    const localPersonCallItem = localPerson(callItems);
    if (!(localPersonCallItem && !localPersonCallItem.isLoading)) {
      setShowClickAllow(true);
    }
  }

  function handleParticipantsChanged(e) {
    console.log("[daily.co event]", e.action);
    const participants = callObject.participants();
    setCallItems(prevCallItems => {
      const newCallItems = getCallItems(participants, prevCallItems);
      if (localPerson(newCallItems) && !localPerson(newCallItems).isLoading) {
        setShowClickAllow(false); // TODO: this is wonky. This will go away when we have a CallState object.
      }
      return newCallItems;
    });
  }

  // Join the call when the roomUrl is set (e.g. when the component mounts).
  useEffect(() => {
    if (props.roomUrl) {
      callObject.on("participant-joined", handleParticipantsChanged);
      callObject.on("participant-updated", handleParticipantsChanged);
      callObject.on("participant-left", handleParticipantsChanged);
      callObject.join({ url: props.roomUrl });
      setTimeout(showClickAllowMessageIfNeeded, 2500);
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

  let message = "";
  if (showClickAllow) {
    message = 'Click "Allow" to enable camera and mic access';
  } else if (Object.keys(callItems).length === 1) {
    message = "Copy and share this page's URL to invite others";
  }

  // Render call
  return (
    <div className="call">
      {message && <CallMessage message={message} />}
      <div className="large-tiles">
        {!message
          ? largeTiles
          : null /* Avoid showing large tiles to make room for the message */}
      </div>
      <div className="small-tiles">{smallTiles}</div>
    </div>
  );
}

export default Call;
