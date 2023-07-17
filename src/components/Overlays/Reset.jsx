import React, { useState } from "react";
import { database } from "../../FirebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  writeBatch,
} from "firebase/firestore";
import "../../css/reset.css";
import { useLists } from "../../contexts/ListsContext";
import { useAuth } from "../../contexts/AuthContext";

export default function Reset({  resetOpen, setResetOpen  }) {
  const { setLists, lists, setUserOrder, activeListSize, inactiveListSize, maxListId, deleteFromDB } = useLists()
  const { currentUser } = useAuth()

  const handleReset = () => {
    if(currentUser) {
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
    }
    else{
      setLists([{name: "miscellaneous", color: 2, id: 2, items: []},{name: "inactive", color: 1, id: 1, items: []}]);
      activeListSize.current = 0;
      inactiveListSize.current = 0;
    }
    
  };
  const handleCloseOverlay = () => {
    setResetOpen(false);
  };
  const handleResetConfirm = () => {
    handleReset();
    setResetOpen(false);
  };
  return (
    <>
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
    </>
  );
}
