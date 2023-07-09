import React, { useState } from "react";
import { database } from "../FirebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  writeBatch,
} from "firebase/firestore";
import "../css/reset.css";
import { useLists } from "../contexts/ListsContext";

export default function Reset({  resetOpen, setResetOpen  }) {
  const { setLists, lists, setUserOrder, activeListSize, inactiveListSize, maxListId } = useLists()
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

  const handleReset = () => {
    const allItems = [];
    lists.forEach((list) => {
      list.items.forEach((item) => allItems.push(item));
    });
    deleteFromDB(allItems);
    setLists([{name: "miscellaneous", color: 2, id: 2, items: []},{name: "inactive", color: 1, id: 1, items: []}]);
    setUserOrder([{name: "miscellaneous", color: 2, id: 2},{name: "inactive", color: 1, id: 1}]);
    activeListSize.current = 0;
    inactiveListSize.current = 0;
    maxListId.current = 0;
  };
  const handleCloseOverlay = () => {
    setResetOpen(false);
  };
  const handleResetConfirm = () => {
    handleReset();
    setResetOpen(false);
  };
  return (
    <React.Fragment>
      {resetOpen ? (
        <div className="reset-warning">
          <p className="reset-text">Are you sure you want to reset?</p>
          <p className="reset-message">
            (All of your items and lists will be deleted)
          </p>
          <div className="warning-buttons">
            <button className="login-button" onClick={handleResetConfirm}>
              Reset
            </button>
            <button className="login-button" onClick={handleCloseOverlay}>
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
}
