import React, { useContext, useState, useEffect, useRef } from "react";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { database } from "../FirebaseConfig";
import { useAuth } from "./AuthContext";
// console.log('rerender')
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
  // console.log(activeListSize.current)
  // console.log(inactiveListSize.current)
  // console.log(userOrder)
  // console.log(lists)


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
    //condition for logged in user. 
    if (userOrder.length > 0) {
      const updatedLists = [];
      userOrder.forEach((orderObject) => {
        const newOrderObject = { ...orderObject, items: [] };
        updatedLists.push(newOrderObject);
        maxListId.current += 1;
        if (orderObject.listId > maxListId.current)
          maxListId.current = orderObject.listId;
      });
      fetchData(updatedLists);
    }
    //condition for logged OUT user
    else{
      const listsString = localStorage.getItem('localLists');
      const listsData = JSON.parse(listsString);
      if (listsData === null){
        console.log('empty lists set')
        const listsLocal = [{name: "miscellaneous", color: 2, id: 2, items: []},{name: "inactive", color: 1, id: 1, items: []}]
        const listsString = JSON.stringify(listsLocal);
        localStorage.setItem('localLists', listsString);
        setLists(listsLocal)
        setIsLoading(false)
      } 
      else {
        // console.log('there were lists')
        setLists(listsData);
        listsData.forEach((list) => {
          maxListId.current += 1;
          if(list.name === 'inactive') inactiveListSize.current += list.items.length
          else activeListSize.current += list.items.length
        })
        setListsReady(true)
        setIsLoading(false);
      }
    }
  }, [userOrder]);

  const fetchData = async (updatedLists) => {
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
          // setUserOrder(newUserOrder);
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
  window.addEventListener('beforeunload', () => {
    localStorage.setItem('localLists', JSON.stringify(lists));
  });

  const deleteFromDB = async (itemsToDelete) => {
    try {
      const itemsRef = collection(database, "foodItems");
      const batch = writeBatch(database);
      for (const item of itemsToDelete) {
        const itemQuery = query(itemsRef, where("id", "==", item.id));
        const itemDocs = await getDocs(itemQuery);
        if (!itemDocs.empty) {
          const itemDoc = itemDocs.docs[0];
          const itemRef = doc(itemsRef, itemDoc.id);
  
          batch.delete(itemRef);
        }
      }
      await batch.commit();
      console.log("Items deleted successfully from the database");
    } catch (error) {
      console.error("Error deleting items from the database:", error);
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
    setUserOrder,
    deleteFromDB
    };
  
  return (
    <ListsContext.Provider value={value}>
      {children}
    </ListsContext.Provider>
  );
};
