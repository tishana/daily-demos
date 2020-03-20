import React, { useContext, useEffect, useState } from "react";
import "./Tray.css";
import TrayButton, {
  TYPE_MUTE_CAMERA,
  TYPE_MUTE_MIC,
  TYPE_SCREEN,
  TYPE_LEAVE
} from "../TrayButton/TrayButton";
import CallObjectContext from "../CallObjectContext";

function Tray() {
  const callObject = useContext(CallObjectContext);
  const [isCameraMuted, setCameraMuted] = useState(getIsCameraMuted());
  const [isMicMuted, setMicMuted] = useState(getIsMicMuted());

  // - Camera methods

  function getIsCameraMuted() {
    return (
      callObject.participants() &&
      callObject.participants().local &&
      !callObject.participants().local.video
    );
  }

  function toggleCamera() {
    callObject.setLocalVideo(isCameraMuted);
  }

  // - Mic methods

  function getIsMicMuted() {
    return (
      callObject.participants() &&
      callObject.participants().local &&
      !callObject.participants().local.audio
    );
  }

  function toggleMic() {
    callObject.setLocalAudio(isMicMuted);
  }

  // Start listening for participant changes on component mount.
  // This event will capture any changes to your audio/video mute state.
  useEffect(() => {
    callObject.on("participant-updated", () => {
      setCameraMuted(getIsCameraMuted());
      setMicMuted(getIsMicMuted());
    });
  }, []);

  return (
    <div className="tray">
      <TrayButton
        type={TYPE_MUTE_CAMERA}
        highlighted={isCameraMuted}
        onClick={toggleCamera}
      />
      <TrayButton
        type={TYPE_MUTE_MIC}
        highlighted={isMicMuted}
        onClick={toggleMic}
      />
      <TrayButton type={TYPE_SCREEN} />
      <TrayButton type={TYPE_LEAVE} newButtonGroup={true} highlighted={true} />
    </div>
  );
}

export default Tray;
