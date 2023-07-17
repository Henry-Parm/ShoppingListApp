import React, { useState, useEffect } from "react";
import FoodItem from "./FoodItem";
import { useLists } from "../../contexts/ListsContext";

const FoodItemList = ({
  foodItems,
  isSorted,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const {  handleItemSelection, selectedItems, lists } = useLists()

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
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);
  if (isSorted) {
    foodItems = [...foodItems].sort((a, b) => a.listId - b.listId);
  }
  let previousListName = "";

  return (
    <div className="food-list">
      {foodItems.map((item, index) => {
        const { listId } = item;
        const list = lists.find((list) => list.id === listId);
        const listName = list ? list.name : '';
        const shouldRenderType = listName !== previousListName;
        previousListName = listName;

        return (
          <div key={index}>
            {shouldRenderType && isSorted && (
              <div className="inactive-list-titles">{listName}</div>
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
          </div>
        );
      })}
    </div>
  );
};

export default FoodItemList;
