import React from "react";
import CreatableSelect, { useCreatable } from "react-select/creatable";
import { useLists } from "../contexts/ListsContext";

export default function FormElements({
  formInputs,
  id,
  handleChange,
  autofillOptions,
  setAutofillOptions,
  handleAutofillOptionClick,
  handleNameChange,
  showDropdown,
  activeInputId,
  handleSelect,
  lists,
  handleCreateOption,

}) {
  // console.log(lists)
  const foodTypes = lists
    .slice(0, lists.length - 1)
    .filter((list) => list.name !== 'miscellaneous')
    .map((list) => ({
      value: list.id,
      label: list.name.charAt(0).toUpperCase() + list.name.slice(1),
    }));
    const handleBlur = () => {
      setTimeout(() => {
        setAutofillOptions([]);
      }, 100);
    };

    let formatCreateLabel = inputValue => (
      <span><span style={{ color: "blue" }}>Add List:  </span><span>{inputValue}</span></span>
    );
    

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
            onBlur={handleBlur}
            onChange={(e) => handleNameChange(e, id)}
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
                  // onTouchStart={() => handleAutofillOptionClick(option, id)}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* {index === 0 && <div className="tooltip">
                SOMETHING
          </div>} */}
        <div className="type-container">
          <label htmlFor={`type-${id}`}>List:</label>
          <CreatableSelect
            isClearable
            options={foodTypes}
            id={`type-${id}`}
            name="type"
            className="list-field"
            onCreateOption={(value) => handleCreateOption(value, id)}
            formatCreateLabel={formatCreateLabel}
            value={formInputs.option}
            onChange={(e, action) => handleSelect(e, id, action)}
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
