
import { useLists } from "../../contexts/ListsContext";
import { useAuth } from "../../contexts/AuthContext";
import { database } from "../../FirebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  writeBatch,
} from "firebase/firestore";

export default function DashboardLogic({}) {
    const {activeListSize,
        inactiveListSize,
        maxListId,
        setLists,
        lists,
        selectedItems,
        setSelectedItems,
        listsDragged,
        setListsDragged,} = useLists()

  const { currentUser } = useAuth();

//  console.log(lists)

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

  const deleteSelected = () => {
    setLists((oldLists) => {
      const toDelete = [];
      const updatedLists = oldLists.map((list) => {
        const { items } = list;
        let newListItems = [...items];
        newListItems.forEach((item) => {
          if (selectedItems.includes(item)) {
            if (item.isActive) activeListSize.current -= 1;
            else inactiveListSize.current -= 1;
            toDelete.push(item);
          }
        });
        newListItems = newListItems.filter(
          (item) => !selectedItems.includes(item)
        );
        return { ...list, items: newListItems };
      });
      if (currentUser) {
        deleteFromDB(toDelete);
      }
      return updatedLists;
    });
    setSelectedItems([]);
    // console.log(activeListSize.current)
  };

  const moveToInactiveListInverse = () => {
    setLists((oldLists) => {
      let toInactive = [];
      const updatedLists = oldLists.map((list) => {
        const listName = list.name;
        let listItems = [...list.items];
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
          if (currentUser) {
            modifyActiveDBStatus(toInactive);
          }
          return { ...list, name: listName, items: listItems };
        } else {
          listItems.forEach((item) => {
            if (!selectedItems.includes(item)) {
              toInactive.push(item);
            }
            listItems = listItems.filter((item) =>
              selectedItems.includes(item)
            );
          });
          return { ...list, items: listItems };
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
          const inactiveItems = listItems.map((item) => {
            return item;
          });
          selectedItems.forEach((item) => {
            if (!inactiveItems.includes(item)) {
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
        return { ...list, items: listItems };
      });
      if (currentUser) {
        modifyActiveDBStatus(toDatabase);
      }
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
        return { ...list, items: listItems };
      });
      if (currentUser) {
        modifyActiveDBStatus(toDatabase);
      }
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

  return {
    deleteSelected,
    moveToInactiveListInverse,
    moveToInactiveList,
    moveToActiveList,
    addList,
  };
}