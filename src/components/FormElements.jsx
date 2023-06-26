import React from "react";
import CreatableSelect, { useCreatable } from "react-select/creatable";

export default function FormElements({
  formInputs,
  id,
  handleChange,
  autofillOptions,
  handleAutofillOptionClick,
  handleInputChange,
  showDropdown,
  activeInputId,
  handleSelect,
  lists,
}) {
  const foodTypes = lists.slice(0, lists.length - 1).map((list) => {
    return {
      value: list[0],
      label: list[0].charAt(0).toUpperCase() + list[0].slice(1),
    };
  });

  return (
    <div>
      <div className="add-food-form">
        <div className="name-container">
          <label htmlFor={`name-${id}`}>Name:</label>
          <input
            type="text"
            id={`name-${id}`}
            name="name"
            value={formInputs.name}
            onChange={(e) => handleInputChange(e, id)}
            className="input-field"
            autoComplete="off"
          />
          {showDropdown && activeInputId === formInputs.id && (
              <ul className="dropdown-menu">
                {autofillOptions.map((option, index) => (
                  <li
                    key={index}
                    className={"autofill-options"}
                    onClick={() => handleAutofillOptionClick(option, id)}
                  >
                    {option}
                  </li>
                ))}
              </ul>

          )}
        </div>
        <div className="type-container">
          <label htmlFor={`type-${id}`}>List:</label>
          <CreatableSelect
            isClearable
            options={foodTypes}
            id={`type-${id}`}
            name="type"
            value={formInputs.type}
            onChange={(e) => handleSelect(e, id)}
            className="select-field"
          />
        </div>
        <div className="checkbox-container">
          <div className="checkboxText">Auto Return</div>
          <input
            type="checkbox"
            id={`canAutoActivate-${id}`}
            name="canAutoActivate"
            checked={formInputs.canAutoActivate}
            onChange={(e) => handleChange(e, id)}
            className="checkbox-field"
          />
        </div>
      </div>
      {formInputs.canAutoActivate && (
        <div className="duration-container">
          <label htmlFor="duration">Duration (days):</label>
          <input
            type="number"
            id={`duration-${id}`}
            name="duration"
            value={formInputs.duration}
            onChange={(e) => handleChange(e, id)}
            className="input-number-field"
          />
        </div>
      )}
    </div>
  );
}
