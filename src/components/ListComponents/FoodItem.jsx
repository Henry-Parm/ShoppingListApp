import React from "react";

const FoodItem = ({
  item,
  onCheckboxChange,
  isSelected,
  handleMouseDown,
  isDragging,
}) => {
  const handleCheckboxChange = () => {
    //prevent warning?
  };
  const handleDrag = () => {
    if (isDragging) {
      onCheckboxChange(item);
    }
  };
  const handleDown = () => {
    onCheckboxChange(item);
    handleMouseDown();
  };

  return (
    <div className="food-item">
      <div className="checkbox-container">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
          onMouseDown={handleDown}
          onMouseEnter={handleDrag}
          className="checkbox-input"
        />
      </div>
      <div className="food-details">
        <div className="food-name">{item.name}</div>
        {item.canAutoActivate && item.duration !== 0 ? (
          <div className="food-duration">
            Return Duration: {item.duration} days
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default FoodItem;
