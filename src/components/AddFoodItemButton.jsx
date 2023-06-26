import React, { useState } from "react";
import AddFoodItemsForm from "./AddFoodItemsForm";

const AddFoodItemButton = ({ setLists, lists, activeListSize }) => {
  const [showOverlay, setShowOverlay] = useState(false);

  const handleClick = () => {
    setShowOverlay(true);
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  const handleSaveItem = () => {
    setShowOverlay(false);
  };

  return (
    <div>
      <button className="menu-button" onClick={handleClick}>
        Add Item
      </button>
      {showOverlay && (
        <div className="input-overlay">
          <div className="overlay-content">
            <button className="close-button" onClick={handleCloseOverlay}>
              X
            </button>
            <AddFoodItemsForm
              onSave={handleSaveItem}
              setLists={setLists}
              lists={lists}
              activeListSize={activeListSize}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddFoodItemButton;
