//Add Food items form
import React, { useState, useEffect } from "react";
import {
  collection,
  serverTimestamp,
  doc,
  writeBatch,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { database } from "../FirebaseConfig";
import FormElements from "./FormElements";
import axios from "axios";

const AddFoodItemsForm = ({ onSave, setLists, lists, activeListSize, maxColor }) => {
  const [autofillOptions, setAutofillOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeInputId, setActiveInputId] = useState(null);
  const { currentUser } = useAuth();
  const [inputSets, setInputSets] = useState([
    {
      id: Date.now(),
      name: "",
      type: "",
      duration: "",
      canAutoActivate: false,
    },
  ]);
  // console.log(lists)
  const spoonacularApiKey = import.meta.env.VITE_SPOONACULAR_API_KEY;

  const fetchFoodItemNames = async (query) => {
    //lowers api calls. Modify as needed
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
  const handleSelect = (option, setId) => {
    //Logic to add new list to the array if it doesnt already exist. 
    if(option && getListIndex(option.value, lists) === -1){
      setLists((prevLists) => {
        let lists = [...prevLists];
        const newList = [option.value.toLowerCase(), [], ++maxColor.current]; //heres the other spot that needs to be changed for colors
        lists.splice(lists.length - 1, 0, newList);
        return lists;
      })
    }
    setInputSets((prevInputSets) =>
      prevInputSets.map((set) => {
        if (set.id === setId) {
          return { ...set, type: option };
        }
        return set;
      })
    );
  };

  const handleInputChange = (e, setId) => {
    const { name, value } = e.target;
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
      type: "",
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
        let lowerCaseType = "";
        // console.log(inputSet.type.value)
        if (inputSet.type)
          lowerCaseType = inputSet.type.value.toLowerCase();
        // else lowerCaseType = 'miscellaneous'
        const newItem = {
          name: inputSet.name,
          type: lowerCaseType || "miscellaneous",
          duration: inputSet.canAutoActivate ? Number(inputSet.duration) : 0,
          initialDuration: inputSet.canAutoActivate ? inputSet.duration : 0,
          isActive: true,
          canAutoActivate: inputSet.canAutoActivate,
          userId: currentUser.uid,
          createdAt: serverTimestamp(),
        };
        newItems.push(newItem);
        activeListSize.current += 1;
        const listToUpdate = lists.find((list) => list[0] === newItem.type);
        listToUpdate[1].push(newItem);
       
        return lists;
      },
      [...lists]
    );

    setLists(updatedLists);
    //reset inputs
    setInputSets([
      {
        id: Date.now(),
        name: "",
        type: "",
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
  function getListIndex(type, newLists) {
    let i = 0;
    for (const list of newLists) {
      if (list[0] === type) {
        return i;
      }
      i++;
    }
    return -1;
  }

  return (
    <form onSubmit={handleSubmit} className="outer-div">
      {inputSets.map((inputSet) => (
        <FormElements
          key={inputSet.id}
          formInputs={inputSet}
          id={inputSet.id}
          handleChange={handleChange}
          autofillOptions={autofillOptions}
          setAutofillOptions={setAutofillOptions}
          handleAutofillOptionClick={handleAutofillOptionClick}
          handleInputChange={handleInputChange}
          showDropdown={showDropdown}
          fetchFoodItemNames={fetchFoodItemNames}
          activeInputId={activeInputId}
          handleSelect={handleSelect}
          lists={lists}
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
