import React from "react";
import "./CallMessage.css";

/**
 * Props:
 * - header: string
 * - detail: string
 */
function CallMessage(props) {
  return (
    <div className="call-message">
      <p className="call-message-header">{props.header}</p>
      <p>{props.detail}</p>
    </div>
  );
}

export default CallMessage;
