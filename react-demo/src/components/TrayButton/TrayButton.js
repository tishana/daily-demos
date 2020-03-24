import React from "react";
import "./TrayButton.css";
import Icon, {
  TYPE_MUTE_CAMERA,
  TYPE_MUTE_MIC,
  TYPE_SCREEN,
  TYPE_LEAVE
} from "../Icon/Icon";

/**
 * Props:
 * - type: string
 * - highlighted: boolean
 * - onClick: () => ()
 * - newButtonGroup: boolean
 */
function TrayButton(props) {
  return (
    <button
      onClick={props.onClick}
      className={"tray-button" + (props.newButtonGroup ? " new-group" : "")}
    >
      <Icon type={props.type} highlighted={props.highlighted} />
    </button>
  );
}

export default TrayButton;

export { TYPE_MUTE_CAMERA, TYPE_MUTE_MIC, TYPE_SCREEN, TYPE_LEAVE };
