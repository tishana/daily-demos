import React, { useEffect, useRef } from "react";
import "./Tile.css";

// Props
// - videoTrack: MediaStreamTrack?
// - audioTrack: MediaStreamTrack?
// - isLocal: Boolean
// - isLoading: Boolean
function Tile(props) {
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

  // Render loading placeholder
  function loadingComponent() {
    return props.isLoading && <p className="loading">Loading...</p>;
  }

  // Render video
  function videoComponent() {
    return (
      props.videoTrack && <video autoPlay muted playsInline ref={videoEl} />
    );
  }

  // Render audio
  function audioComponent() {
    return (
      !props.isLocal &&
      props.audioTrack && <audio autoPlay playsInline ref={audioEl} />
    );
  }

  function classNames() {
    function isVideoMinimized() {
      return props.isLocal;
    }
    let classNames = "tile";
    classNames += isVideoMinimized() ? " small" : " large";
    props.isLocal && (classNames += " local");
    return classNames;
  }

  return (
    <div className={classNames()}>
      <div className="background" />
      {loadingComponent()}
      {videoComponent()}
      {audioComponent()}
    </div>
  );
}

export default Tile;
