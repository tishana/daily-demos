import React from "react";
import "./Tray.css";
import TrayButton, {
  TYPE_MUTE_CAMERA,
  TYPE_MUTE_MIC,
  TYPE_SCREEN,
  TYPE_LEAVE
} from "../TrayButton/TrayButton";

function Tray() {
  return (
    <div className="tray">
      <TrayButton type={TYPE_MUTE_CAMERA} />
      <TrayButton type={TYPE_MUTE_MIC} />
      <TrayButton type={TYPE_SCREEN} />
      <TrayButton type={TYPE_LEAVE} newButtonGroup={true} />
    </div>
  );
}

export default Tray;
