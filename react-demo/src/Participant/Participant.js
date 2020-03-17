import React, { useEffect, useRef } from "react";
import "./Participant.css";

function Participant(props) {
  const videoEl = useRef(null);
  const audioEl = useRef(null);

  // When video track changes, update video srcObject
  useEffect(() => {
    videoEl.current &&
      (videoEl.current.srcObject = new MediaStream([props.videoTrack]));
  }, [props.videoTrack]);

  // When audio track changes, update audio srcObject
  useEffect(() => {
    audioEl.current &&
      (audioEl.current.srcObject = new MediaStream([props.audioTrack]));
  }, [props.audioTrack]);

  // Render video
  function videoComponent() {
    function isVideoMaximized() {
      return props.totalParticipantCount === 1 || !props.isLocal;
    }

    function videoClassNames() {
      let classNames = "video";
      classNames += isVideoMaximized() ? " max" : " min";
      props.isLocal && (classNames += " local");
      return classNames;
    }

    return (
      props.videoTrack && (
        <video
          className={videoClassNames()}
          autoPlay
          muted
          playsInline
          ref={videoEl}
        />
      )
    );
  }

  // Render audio
  function audioComponent() {
    return props.audioTrack && <audio autoPlay playsInline ref={audioEl} />;
  }

  return (
    <>
      {videoComponent()}
      {audioComponent()}
    </>
  );
}

export default Participant;
