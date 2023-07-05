import React, { useContext, useState, useEffect } from "react";
import { auth } from "../FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { database } from "../FirebaseConfig";

const ListsContext = React.createContext();

export const useLists = () => {
  return useContext(ListsContext);
};

export const ListsProvider = ({ children }) => {

const value = {
    
    };
  
  return (
    <ListsContext.Provider value={value}>
      {children}
    </ListsContext.Provider>
  );
};
