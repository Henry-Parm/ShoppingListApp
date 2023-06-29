import React from "react";
import AddFoodItemButton from "./AddFoodItemButton";
import MoveItemButton from "./MoveItemButton";
import { database } from "../FirebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  writeBatch,
} from "firebase/firestore";

export default function DashboardLeft({
  setLists,
  lists,
  selectedItems,
  setSelectedItems,
  activeListSize,
  inactiveListSize,
  maxColor
}) {
  const deletedSelected = () => {
    setLists((oldLists) => {
      const toDelete = [];
      const updatedLists = oldLists.map((list) => {
        const [listName, listItems, color] = list;
        let newListItems = [...listItems]
        newListItems.forEach((item) => {
          if (selectedItems.includes(item)) {
            if (item.isActive) activeListSize.current -= 1
            else inactiveListSize.current -= 1;
            toDelete.push(item);
          }
        });
        newListItems = newListItems.filter(
          (item) => !selectedItems.includes(item)
        );
        return [listName, newListItems, color];
      });
      deleteFromDB(toDelete);
      return updatedLists;
    });
    setSelectedItems([]);
  };

  const moveToInactiveListInverse = () => {
    setLists((oldLists) => {
      let toInactive = [];
      const updatedLists = oldLists.map((list) => {
        const listName = list[0];
        let listItems = [...list[1]];
        const color = list[2]
        if (listName === "inactive") {
          toInactive.forEach((item) => listItems.push(item));
          toInactive = toInactive.map((item) => {
            activeListSize.current -= 1;
            inactiveListSize.current += 1;
            return {
              ...item,
              isActive: false,
            };
          });
          modifyActiveDBStatus(toInactive);
          return [listName, listItems];
        } else {
          listItems.forEach((item) => {
            if (!selectedItems.includes(item)) {
              toInactive.push(item);
            }
            listItems = listItems.filter((item) =>
              selectedItems.includes(item)
            );
          });
          return [listName, listItems, color];
        }
      });
      return updatedLists;
    });
    setSelectedItems([]);
  };

  const moveToInactiveList = () => {
    const toDatabase = [];
    setLists((prevLists) => {
      const updatedLists = prevLists.map((list) => {
        const listName = list[0];
        let listItems = [...list[1]];
        const color = list[2]
        if (listName === "inactive") {
          // Store inactive items to make sure items arent duplcated later
          const inactiveItemIds = listItems.map((item) => item.id);

          selectedItems.forEach((item) => {
            if (!inactiveItemIds.includes(item.id)) {
              activeListSize.current -= 1;
              inactiveListSize.current += 1;
              listItems.push(item);
              item.isActive = false;
              toDatabase.push(item);
            }
          });
        } else {
          listItems = listItems.filter(
            (listItem) =>
              !selectedItems.some(
                (selectedItem) => selectedItem.id === listItem.id
              )
          );
        }
        return [listName, listItems, color];
      });
      modifyActiveDBStatus(toDatabase);
      return updatedLists;
    });
    setSelectedItems([]);
  };

  const moveToActiveList = async () => {
    setLists((prevLists) => {
      const toDatabase = [];
      let updatedLists = prevLists.map((list) => {
        const listName = list[0];
        let listItems = list[1];
        const color = list[2]
        const listItemIds = listItems.map((item) => item.id);
        if (listName === "inactive") {
          listItems = listItems.filter(
            (item) =>
              !selectedItems.some((selectedItem) => selectedItem.id === item.id)
          );
        } else {
          selectedItems.forEach((item) => {
            if (!listItemIds.includes(item.id) && item.type === listName) {
              activeListSize.current += 1;
              inactiveListSize.current -= 1;
              listItems.push(item);
              item.isActive = true;
              toDatabase.push(item);
            }
          });
        }
        return [listName, listItems, color];
      });
      modifyActiveDBStatus(toDatabase);
      return updatedLists;
    });
    setSelectedItems([]);
  };

  const modifyActiveDBStatus = async (itemsToUpdate) => {
    try {
      const itemsRef = collection(database, "foodItems");
      const batch = writeBatch(database);
      for (const item of itemsToUpdate) {
        const itemQuery = query(itemsRef, where("id", "==", item.id));
        const itemDocs = await getDocs(itemQuery);
        if (!itemDocs.empty) {
          const itemDoc = itemDocs.docs[0];
          const itemRef = doc(itemsRef, itemDoc.id);

          const updatedItem = {
            ...itemDoc.data(),
            isActive: item.isActive,
          };

          batch.set(itemRef, updatedItem, { merge: true });
        }
      }

      await batch.commit();
      console.log("Database updated successfully");
    } catch (error) {
      console.error("Error updating database:", error);
    }
  };

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

  return (
    <div className="left">
      <AddFoodItemButton
        setLists={setLists}
        lists={lists}
        activeListSize={activeListSize}
        maxColor={maxColor}
      />
      <MoveItemButton
        checkedItems={selectedItems}
        actionFunction={moveToInactiveList}
        buttonName="Set Inactive"
      />
      <MoveItemButton
        checkedItems={selectedItems}
        actionFunction={moveToActiveList}
        buttonName="Set Active"
      />
      <MoveItemButton
        checkedItems={selectedItems}
        actionFunction={moveToInactiveListInverse}
        buttonName="Deactivate all but selected"
      />
      <MoveItemButton
        checkedItems={selectedItems}
        actionFunction={deletedSelected}
        buttonName="Delete Selected"
      />
    </div>
  );
}
