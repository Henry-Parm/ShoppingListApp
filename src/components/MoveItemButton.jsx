import React from "react";

const MoveItemButton = ({ actionFunction, buttonName }) => {
  const handleClick = () => {
    actionFunction();
  };

  return (
    <button className="menu-button" onClick={handleClick}>
      {buttonName}
    </button>
  );
};

export default MoveItemButton;
