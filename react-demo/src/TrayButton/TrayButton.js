import React from "react";
import "./TrayButton.css";
import Icon, {
  TYPE_MUTE_CAMERA,
  TYPE_MUTE_MIC,
  TYPE_SCREEN,
  TYPE_LEAVE
} from "../Icon/Icon";

// Props:
// - type
// - highlighted
// - onClick
// - newButtonGroup
function TrayButton(props) {
  return (
    <button
      className={"tray-button" + (props.newButtonGroup ? " new-group" : "")}
    >
      <Icon type={props.type} />
    </button>
  );
}

export default TrayButton;

export { TYPE_MUTE_CAMERA, TYPE_MUTE_MIC, TYPE_SCREEN, TYPE_LEAVE };
