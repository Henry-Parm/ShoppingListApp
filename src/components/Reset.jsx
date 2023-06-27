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

export default function Reset({ setLists, lists, setUserOrder }) {
  const [showOverlay, setShowOverlay] = useState(false);
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
      list[1].forEach((item) => allItems.push(item));
    });
    deleteFromDB(allItems);
    setLists([["inactive", []]]);
    setUserOrder(["inactive"]);
  };
  const handleShowOverlay = () => {
    setShowOverlay(true);
  };
  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };
  const handleResetConfirm = () => {
    handleReset();
    setShowOverlay(false);
  };
  return (
    <React.Fragment>
      {showOverlay ? (
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
      <li onClick={handleShowOverlay}>Reset</li>
    </React.Fragment>
  );
}
