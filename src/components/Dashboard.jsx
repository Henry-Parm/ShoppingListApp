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

const Dashboard = () => {
  const { currentUser, userOrder } = useAuth();
  const [selectedItems, setSelectedItems] = useState([]);
  const [listsReady, setListsReady] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [listsDragged, setListsDragged] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [manageOverlay, setManageOverlay] = useState(false);
  const activeListSize = useRef(0);
  const inactiveListSize = useRef(0);
  const maxListId = useRef(0);
  const [lists, setLists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  console.log(lists)

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
    items.forEach((item) => {
      const listId = item.listId;
      if (item.isActive) {
        activeListSize.current += 1;
        const listIndex = getListIndex(listId);
        if (listIndex !== -1) {
          updatedLists[listIndex].items.push(item);
        }
      } else {
        updatedLists[updatedLists.length - 1].items.push(item);
      }
    });
    setIsLoading(false);
    setListsReady(true);
    setLists(updatedLists);
  };

  const getListIndex = (listId) => {
    let i = 0;
    for (const list of lists) {
      if (list.id === listId) {
        return i;
      }
      i++;
    }
    return -1;
  };

  const isInitialRender = useRef(0);

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
        maxListId={maxListId}
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
          maxListId={maxListId}
          setManageOverlay={setManageOverlay}
          manageOverlay={manageOverlay}
          getListIndex={getListIndex}
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
        <div className="right">
          <ul className="food-list inactive">
            <div className="list-title">Inactive Items</div>
            {listsReady && (
              <FoodItemList foodItems={lists[lists.length - 1].items} />
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
