import React, { useState, useEffect, useRef } from "react";
import "./Participant.css";

function Participant(props) {
  const videoEl = useRef(null);
  const audioEl = useRef(null);

  useEffect(() => {
    videoEl.current &&
      (videoEl.current.srcObject = new MediaStream([props.videoTrack]));
  }, [props.videoTrack]);

  useEffect(() => {
    audioEl.current &&
      (audioEl.current.srcObject = new MediaStream([props.audioTrack]));
  }, [props.audioTrack]);

  function isVideoMaximized() {
    return props.totalParticipantCount === 1 || !props.isLocal;
  }

  function videoClassNames() {
    let classNames = "video";
    classNames += isVideoMaximized() ? " max" : " min";
    props.isLocal && (classNames += " local");
    return classNames;
  }

  function videoComponent() {
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
