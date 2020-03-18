import React from "react";
import "./Invite.css";

// Props
// - roomUrl: String
function Invite(props) {
  return (
    <>
      <p className="invite">
        Copy and share this URL to invite others:
        <br />
        {props.roomUrl}
      </p>
    </>
  );
}

export default Invite;
