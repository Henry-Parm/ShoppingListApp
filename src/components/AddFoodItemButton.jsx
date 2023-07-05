import React, { useState } from "react";
import AddFoodItemsForm from "./AddFoodItemsForm";

const AddFoodItemButton = ({
  setLists,
  lists,
  activeListSize,
  addList,
  getListIndex,
  maxListId,
}) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [showElement, setShowElement] = useState(false);

  const handleClick = () => {
    setShowElement(true);
    setShowOverlay(true);
  };

  const handleCloseOverlay = () => {
    setShowElement(false);
    setTimeout(() => {
      setShowOverlay(false);
    }, 300);
  };

  return (
    <div>
      <button className="menu-button" onClick={handleClick}>
        Add Item
      </button>
      {showOverlay && (
        <div className={`input-overlay${showElement ? "" : " fade-out"}`}>
          <div className="overlay-content">
            <button className="close-button" onClick={handleCloseOverlay}>
              X
            </button>
            <AddFoodItemsForm
              onSave={handleCloseOverlay}
              setLists={setLists}
              lists={lists}
              activeListSize={activeListSize}
              addList={addList}
              getListIndex={getListIndex}
              maxListId={maxListId}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddFoodItemButton;
