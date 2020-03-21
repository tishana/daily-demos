import React from "react";
import "./CallMessage.css";

/**
 * Props:
 * - message
 */
function CallMessage(props) {
  return <p className="call-message">{props.message}</p>;
}

export default CallMessage;
