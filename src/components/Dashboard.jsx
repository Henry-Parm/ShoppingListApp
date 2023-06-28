import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { database } from "../FirebaseConfig";
import "../css/dashboard.css";
import "../css/addFoodItemsForm.css";
import "../css/foodList.css";
import DashboardMiddle from "./DashboardMiddle";
import NavBar from "./Navbar";
import FoodItemList from "./FoodItemList";
import DashboardLeft from "./DashboardLeft";
import Reset from "./Reset";
//npm run format

const Dashboard = () => {
  const { currentUser, userOrder } = useAuth();
  const [selectedItems, setSelectedItems] = useState([]);
  const [listsReady, setListsReady] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [listsDragged, setListsDragged] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const activeListSize = useRef(0);
  const inactiveListSize = useRef(0);
  const [lists, setLists] = useState([]);
  const [isLoading, setIsLoading] = useState(false)

  // console.log('activeListSize', activeListSize)
  // console.log('inactiveListSize', inactiveListSize)

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
  //Populate lists
  useEffect(() => {
    setIsLoading(true)
    const updatedLists = [];
    if (userOrder.length > 0) {
      userOrder.forEach((listName) => {
        updatedLists.push([listName, []]);
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
    items.forEach((item) => {
      const inactiveList = updatedLists.length - 1;
      const itemType = item.type;
      if (item.isActive) {
        // console.log(item)
        activeListSize.current += 1;
        const listIndex = getListIndex(itemType, updatedLists);
        //if the list exists, push the item into it
        if (listIndex !== -1) {
          updatedLists[listIndex][1].push(item);
        } else {
          const newList = [itemType, [item]];
          updatedLists.splice(inactiveList, 0, newList);
        }
      } else {
        // console.log('inactive', item)
        inactiveListSize.current += 1;
        if (getListIndex(itemType, updatedLists) === -1) {
          const newList = [itemType, []];
          updatedLists.splice(inactiveList, 0, newList);
          updatedLists[inactiveList][1].push(item);
        } else {
          updatedLists[inactiveList][1].push(item);
        }
      }
    });
    setIsLoading(false)
    setListsReady(true);
    setLists(updatedLists);
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

  const isInitialRender = useRef(0);

  //Saving order of items
  useEffect(() => {
    const newUserOrder = lists.map((list) => list[0]);
    // Check if it's not the initial render
    if (isInitialRender.current >= 1) {
      // Call setUserOrder after a delay of 5 seconds if not currently dragging
      if (!isDragging) {
        const delay = 5000; // 5 seconds
        const timeoutId = setTimeout(() => {
          setUserOrder(newUserOrder);
          setIsDragging(true);
          // console.log('database write')
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

  return (
    <div>
      <Reset
        setResetOpen={setResetOpen}
        resetOpen={resetOpen}
        lists={lists}
        setLists={setLists}
        setUserOrder={setUserOrder}
        activeListSize={activeListSize}
        inactiveListSize={inactiveListSize}
      />
      <NavBar
        email={currentUser?.email}
        lists={lists}
        setLists={setLists}
        setUserOrder={setUserOrder}
        setResetOpen={setResetOpen}
      ></NavBar>
      <div className="container">
        <DashboardLeft
          lists={lists}
          setLists={setLists}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          activeListSize={activeListSize}
          inactiveListSize={inactiveListSize}
        />
        <DashboardMiddle
          lists={lists}
          setLists={setLists}
          handleItemSelection={handleItemSelection}
          selectedItems={selectedItems}
          listsDragged={listsDragged}
          setListsDragged={setListsDragged}
          activeListSize={activeListSize}
          inactiveListSize={inactiveListSize}
          isLoading={isLoading}
        />
        {/* Inactive Items Bar */}
        <div className="right">
          <ul className="food-list inactive">
            <div className="list-title">Inactive Items</div>
            {listsReady ? (
              <FoodItemList
                foodItems={lists[lists.length - 1][1]}
                handleItemSelection={handleItemSelection}
                selectedItems={selectedItems}
                listTitle="Inactive Items"
                isSorted={true}
              />
            ) : null}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
