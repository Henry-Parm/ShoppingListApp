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
import ManageButton from "./ManageButton";
import { useLists } from "../contexts/ListsContext";

export default function DashboardLeft({
  setLists,
  lists,
  selectedItems,
  setSelectedItems,
  activeListSize,
  inactiveListSize,
  maxListId,
  setManageOverlay,
  manageOverlay,
  getListIndex,
  listsDragged,
  setListsDragged
}) {
  // const {number} = useLists()

  const deletedSelected = () => {
    setLists((oldLists) => {
      const toDelete = [];
      const updatedLists = oldLists.map((list) => {
        const {items} = list;
        let newListItems = [...items]
        newListItems.forEach((item) => {
          if (selectedItems.includes(item)) {
            // console.log("active?", item.isActive)
            if (item.isActive) activeListSize.current -= 1
            else inactiveListSize.current -= 1;
            toDelete.push(item);
          }
        });
        newListItems = newListItems.filter(
          (item) => !selectedItems.includes(item)
        );
        return {...list, items: newListItems};
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
        const listName = list.name;
        let listItems = [...list.items];
        const color = list.color
        if (listName === "inactive") {
          toInactive = toInactive.map((item) => {
            activeListSize.current -= 1;
            inactiveListSize.current += 1;
            return {
              ...item,
              isActive: false,
            };
          });
          toInactive.forEach((item) => listItems.push(item));
          modifyActiveDBStatus(toInactive);
          return {...list, name: listName, items: listItems};
        } else {
          listItems.forEach((item) => {
            if (!selectedItems.includes(item)) {
              toInactive.push(item);
            }
            listItems = listItems.filter((item) =>
              selectedItems.includes(item)
            );
          });
          return {...list, items: listItems};
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
        const listName = list.name;
        let listItems = [...list.items];
        if (listName === "inactive") {
          // Store inactive items to make sure items arent duplcated later
          
          const inactiveItems = listItems.map((item) => {
            // console.log('item', item.id)
            return item
          });
          // console.log(inactiveItemIds)
          selectedItems.forEach((item) => {
            if (!inactiveItems.includes(item)) {
              // console.log(item)
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
                (selectedItem) => selectedItem === listItem
              )
          );
        }
        return {...list, items: listItems};
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
        const listName = list.name;
        let listItems = list.items;
        const listItemIds = listItems.map((item) => item.id);
        if (listName === "inactive") {
          listItems = listItems.filter(
            (item) =>
              !selectedItems.some((selectedItem) => selectedItem.id === item.id)
          );
        } else {
          selectedItems.forEach((item) => {
            if (!listItemIds.includes(item.id) && item.listId === list.id) {
              activeListSize.current += 1;
              inactiveListSize.current -= 1;
              listItems.push(item);
              item.isActive = true;
              toDatabase.push(item);
            }
          });
        }
        return {...list, items: listItems};
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
  const addList= (listName) => {
    maxListId.current += 1
    const newList = {name: listName, color: maxListId.current, id: maxListId.current, items: []}
    setLists((oldLists => {
      let oldListsCopy = [...oldLists]
      oldListsCopy.splice(oldListsCopy.length - 1, 0, newList);
      return oldListsCopy
    }))
    setListsDragged(!listsDragged);
  }

  return (
    <div className="left">
      <AddFoodItemButton
        setLists={setLists}
        lists={lists}
        activeListSize={activeListSize}
        addList={addList}
        getListIndex={getListIndex}
        maxListId={maxListId}
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
        buttonName="Deactivate Unselected"
      />
      <MoveItemButton
        checkedItems={selectedItems}
        actionFunction={deletedSelected}
        buttonName="Delete Selected"
      />
      <ManageButton
        setManageOverlay={setManageOverlay}
        manageOverlay={manageOverlay}
        lists={lists}
        setLists={setLists}
        />
    </div>
  )
}
