import React from 'react'
import { database } from "../FirebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  writeBatch,
} from "firebase/firestore";

export default function Reset({setLists, lists, setUserOrder}) {
   
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
        const allItems = []
        lists.forEach(list => {
            list[1].forEach(item => allItems.push(item))
        });
        deleteFromDB(allItems)
        setLists([
            ['inactive', []]
        ])
        setUserOrder(['inactive'])
    }
  return (
    <li onClick={handleReset}>Reset</li>
  )
}
