import React from "react";
import "./StartButton.css";

// Props:
// - disabled
// - onClick
function StartButton(props) {
  return (
    <button
      className="start-button"
      disabled={props.disabled}
      onClick={props.onClick}
    >
      Click to start a call
    </button>
  );
}

export default StartButton;
