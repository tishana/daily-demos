import React from "react";
import "./TrayButton.css";

function TrayButton(props) {
  return (
    <button
      className={"tray-button" + (props.newButtonGroup ? " new-group" : "")}
    />
  );
}

export default TrayButton;
