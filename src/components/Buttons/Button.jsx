import React from "react";

const Button = ({ actionFunction, buttonName }) => {
  const handleClick = () => {
    actionFunction();
  };

  return (
    <button className="menu-button" onClick={handleClick}>
      {buttonName}
    </button>
  );
};

export default Button;
