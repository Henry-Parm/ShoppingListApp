import React, { useState, useEffect } from "react";
import { collection, serverTimestamp, doc, writeBatch } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { useLists } from "../contexts/ListsContext";
import { database } from "../FirebaseConfig";
import FormElements from "./FormElements";
import axios from "axios";

const AddFoodItemsForm = ({ onSave, addList }) => {
  const [autofillOptions, setAutofillOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeInputId, setActiveInputId] = useState(null);
  const { currentUser } = useAuth();
  const [inputSets, setInputSets] = useState([
    {
      id: Date.now(),
      name: "",
      option: "",
      listId: null,
      duration: "",
      canAutoActivate: false,
    },
  ]);
  const {activeListSize,
    maxListId,
    lists,
    setLists} = useLists()

  const spoonacularApiKey = import.meta.env.VITE_SPOONACULAR_API_KEY;

  const fetchFoodItemNames = async (query) => {
    // lowers api calls. Modify as needed
    if (query.length > 1 && query.length % 2 !== 0) {
      try {
        const response = await axios.get(
          "https://api.spoonacular.com/food/ingredients/autocomplete",
          {
            params: {
              query: query,
              number: 5,
              sortDirection: "desc",
              apiKey: spoonacularApiKey,
            },
          }
        );
        const foodItemNames = response.data.map((item) => item.name);
        console.log("api called");
        setAutofillOptions(foodItemNames);
      } catch (error) {
        // Handle error scenarios
        setAutofillOptions([]);
        console.error("Error fetching food item names:", error);
      }
    } else if (query.length < 1) {
      setAutofillOptions([]);
    }
  };

  const handleAutofillOptionClick = (option, setId) => {
    console.log("clicked");
    setInputSets((prevInputSets) =>
      prevInputSets.map((set) => {
        if (set.id === setId) {
          return { ...set, name: option };
        }
        return set;
      })
    );
    setShowDropdown(false);
  };

  const handleSelect = (option, setId, action) => {
    if (action.action === "clear") {
      setInputSets((prevInputSets) =>
        prevInputSets.map((set) => {
          if (set.id === setId) {
            return { ...set, listId: null, option: "" };
          }
          return set;
        })
      );
    } else if (option) {
      setInputSets((prevInputSets) =>
        prevInputSets.map((set) => {
          if (set.id === setId) {

            return { ...set, listId: option.value, option: option };
          }
          return set;
        })
      );
    }
  };

  const handleCreateOption = (inputValue, setId) => {
    addList(inputValue);
    setInputSets((prevInputSets) =>
      prevInputSets.map((set) => {
        if (set.id === setId) {
          return { ...set, listId: maxListId.current, option: { value: maxListId.current, label: inputValue } };
        }
        return set;
      })
    );
  };

  const handleNameChange = (e, setId) => {
    const { value } = e.target;
    setActiveInputId(setId);
    handleChange(e, setId);
    fetchFoodItemNames(value);
  };

  useEffect(() => {
    setShowDropdown(autofillOptions.length > 0);
  }, [autofillOptions]);

  const handleChange = (e, setId) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setInputSets((prevInputSets) =>
      prevInputSets.map((set) => {
        if (set.id === setId) {
          return { ...set, [name]: newValue };
        }
        return set;
      })
    );
  };

  const handleAddInputSet = () => {
    const newInputSet = {
      id: Date.now(),
      name: "",
      option: "",
      listId: null,
      duration: "",
      canAutoActivate: false,
    };
    setInputSets((prevInputSets) => [...prevInputSets, newInputSet]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Loop through each input set and validate the form inputs
    for (const inputSet of inputSets) {
      if (!inputSet.name) {
        alert("Please provide a name for the item");
        return;
      }
      if (inputSet.canAutoActivate && inputSet.duration <= 0) {
        alert("Please enter a valid return duration");
        return;
      }
    }
    const newItems = [];
    const updatedLists = inputSets.reduce(
      (lists, inputSet) => {
        const newItem = {
          name: inputSet.name,
          listId: inputSet.listId || 2,
          duration: inputSet.canAutoActivate ? Number(inputSet.duration) : 0,
          initialDuration: inputSet.canAutoActivate ? inputSet.duration : 0,
          isActive: true,
          canAutoActivate: inputSet.canAutoActivate,
          userId: currentUser.uid,
          createdAt: serverTimestamp(),
        };
        newItems.push(newItem);
        activeListSize.current += 1;
        const listToUpdate = lists.find((list) => list.id === newItem.listId);
        // console.log(listToUpdate)
        listToUpdate.items.push(newItem);

        return lists;
      },
      [...lists]
    );

    setLists(updatedLists);
    // reset inputs
    setInputSets([
      {
        id: Date.now(),
        name: "",
        option: "",
        listId: null,
        duration: "",
        canAutoActivate: false,
      },
    ]);
    addToDb(newItems);
    onSave();
  };

  const addToDb = async (newItems) => {
    try {
      const collectionRef = collection(database, "foodItems");
      const batch = writeBatch(database);

      newItems.forEach((newItem) => {
        const docRef = doc(collectionRef);
        newItem.id = docRef.id;
        batch.set(docRef, newItem);
      });

      await batch.commit();
    } catch (error) {
      console.error("Error adding food items:", error);
    }
  };
  const addToLocalStorage = (newItems) => {
    try {
      // Get existing food items from local storage (if any)
      const existingItems = localStorage.getItem("foodItems");
      const existingItemsArray = existingItems ? JSON.parse(existingItems) : [];
  
      // Generate IDs for new items and add them to the existing items array
      newItems.forEach((newItem) => {
        const newItemWithId = { ...newItem, id: generateUniqueId() };
        existingItemsArray.push(newItemWithId);
      });
  
      // Save the updated items array back to local storage
      localStorage.setItem("foodItems", JSON.stringify(existingItemsArray));
    } catch (error) {
      console.error("Error adding food items:", error);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="outer-div">
      {inputSets.map((inputSet, index) => (
        <FormElements
          key={inputSet.id}
          formInputs={inputSet}
          index={index}
          id={inputSet.id}
          handleChange={handleChange}
          autofillOptions={autofillOptions}
          setAutofillOptions={setAutofillOptions}
          handleAutofillOptionClick={handleAutofillOptionClick}
          handleNameChange={handleNameChange}
          showDropdown={showDropdown}
          fetchFoodItemNames={fetchFoodItemNames}
          activeInputId={activeInputId}
          handleSelect={handleSelect}
          handleCreateOption={handleCreateOption}
        />
      ))}
      <div>
        <button type="submit" className="submit-food-button">
          Save
        </button>
        <button
          type="button"
          className="submit-food-button"
          onClick={handleAddInputSet}
        >
          Add Another
        </button>
      </div>
    </form>
  );
};

export default AddFoodItemsForm;