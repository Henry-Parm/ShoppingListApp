import React, { useState, useEffect } from "react";
import FoodItem from "./FoodItem";

const FoodItemList = ({
  foodItems,
  handleItemSelection,
  selectedItems,
  isSorted,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleCheckboxChange = (item) => {
    handleItemSelection(item);
  };
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };
  useEffect(() => {
    // Add event listener for 'mouseup' at the document level
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      // Clean up the event listener when the component unmounts
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);
  if (isSorted) {
    foodItems = [...foodItems].sort((a, b) => a.name.localeCompare(b.name));
  }
  let previousType = "";

  return (
    <div className="food-list">
      {foodItems.map((item, index) => {
        const { type } = item;
        const shouldRenderType = type !== previousType;
        previousType = type;

        return (
          <React.Fragment key={index}>
            {shouldRenderType && isSorted && (
              <div className="inactive-list-titles">{type}</div>
            )}
            <FoodItem
              item={item}
              onCheckboxChange={handleCheckboxChange}
              isSelected={selectedItems.includes(item)}
              // dragging stuff
              isDragging={isDragging}
              handleMouseDown={handleMouseDown}
              handleMouseUp={handleMouseUp}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default FoodItemList;
