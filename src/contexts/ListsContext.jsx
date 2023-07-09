import React, { useContext, useState, useEffect, useRef } from "react";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { database } from "../FirebaseConfig";
import { useAuth } from "./AuthContext";

const ListsContext = React.createContext();

export const useLists = () => {
  return useContext(ListsContext);
};

export const ListsProvider = ({ children }) => {

  const { currentUser, userOrder } = useAuth();
  const number = 10;
  const activeListSize = useRef(0);
  const inactiveListSize = useRef(0);
  const maxListId = useRef(0);
  const [lists, setLists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [listsReady, setListsReady] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [listsDragged, setListsDragged] = useState(false);

  const handleItemSelection = (item) => {
    setSelectedItems((prevSelectedItems) => {
      const isItemSelected = prevSelectedItems.includes(item);
      if (isItemSelected) {
        return prevSelectedItems.filter(
          (selectedItem) => selectedItem !== item
        );
      } else {
        return [...prevSelectedItems, item];
      }
    });
  };

  useEffect(() => {
    setIsLoading(true);
    const updatedLists = [];
    if (userOrder.length > 0) {
      userOrder.forEach((orderObject) => {
        const newOrderObject = { ...orderObject, items: [] };
        updatedLists.push(newOrderObject);
        maxListId.current += 1;
        if (orderObject.listId > maxListId.current)
          maxListId.current = orderObject.listId;
      });

      const fetchData = async () => {
        try {
          const queryItems = await getDocs(
            query(
              collection(database, "foodItems"),
              where("userId", "==", currentUser?.uid)
            )
          );
          const items = [];
          queryItems.forEach((doc) => {
            items.push(doc.data());
          });
          separateItemsByType(items, updatedLists);
        } catch (error) {
          console.error("Error fetching data from database:", error);
        }
      };
      fetchData();
    }
  }, [userOrder]);

  const separateItemsByType = (items, updatedLists) => {
    // console.log(items)
    items.forEach((item) => {
      const listId = item.listId;
      // console.log(listId)
      if (item.isActive) {
        activeListSize.current += 1;
        const listIndex = updatedLists.findIndex((list) => list.id === listId);
        // console.log(listIndex)
        if (listIndex !== -1) {
          updatedLists[listIndex].items.push(item);
        }
      } else {
        updatedLists[updatedLists.length - 1].items.push(item);
      }
    });
    // console.log(updatedLists)
    setIsLoading(false);
    setListsReady(true);
    setLists(updatedLists);
  }; 

  const isInitialRender = useRef(0);

  useEffect(() => {
    const newUserOrder = lists.map((list) => {
      return {name: list.name, color: list.color, id: list.id}
      
    });
    // Check if it's not the initial render
    if (isInitialRender.current >= 1) {
      // Call setUserOrder after a delay of 5 seconds if not currently dragging
      if (!isDragging) {
        const delay = 5000; // 5 seconds
        const timeoutId = setTimeout(() => {
          setUserOrder(newUserOrder);
          setIsDragging(true);
          setIsDragging(false);
        }, delay);
        // Cleanup function to cancel the timeout if component unmounts or the order changes
        return () => {
          clearTimeout(timeoutId);
        };
      }
    } else {
      isInitialRender.current += 1;
    }
  }, [listsDragged]);

  const setUserOrder = async (order) => {
    try {
      const userQuery = query(
        collection(database, "users"),
        where("email", "==", currentUser.email)
      );
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userRef = doc(database, "users", userDoc.id);

        await updateDoc(userRef, { order: order });

        console.log("User order successfully updated in the database");
      } else {
        console.log("No user found with the specified email");
      }
    } catch (error) {
      console.log("Error updating user order in the database", error);
    }
  };

  const value = {
    number,
    activeListSize,
    inactiveListSize,
    maxListId,
    lists,
    setLists,
    isLoading,
    setIsLoading,
    selectedItems,
    setSelectedItems,
    listsReady,
    setListsReady,
    isDragging,
    setIsDragging,
    listsDragged,
    setListsDragged,
    handleItemSelection,
    setUserOrder
    };
  
  return (
    <ListsContext.Provider value={value}>
      {children}
    </ListsContext.Provider>
  );
};
