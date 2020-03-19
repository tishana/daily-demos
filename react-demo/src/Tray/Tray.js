import React from "react";
import "./Tray.css";
import TrayButton from "../TrayButton/TrayButton";

function Tray() {
  return (
    <div className="tray">
      <TrayButton />
      <TrayButton />
      <TrayButton />
      <TrayButton newButtonGroup={true} />
    </div>
  );
}

export default Tray;
