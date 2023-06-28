import React, { useContext, useState, useEffect } from "react";
import { auth } from "../FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { database } from "../FirebaseConfig";
//google imports
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const AuthContext = React.createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userOrder, setUserOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const collectionRef = collection(database, "users");
  const defaultOrder = ["miscellaneous","inactive"];

  const signup = async (email, firstName, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created successfully");
      navigate("/dashboard");
      await addDoc(collectionRef, {
        email: email,
        order: defaultOrder,
        name: firstName,
      });
    } catch (error) {
      // Handle errors
      if (error.code === "auth/email-already-in-use") {
        alert("This email is already registered");
      } else {
        alert(error.message);
      }
    }
  };

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Logged in successfully");
      navigate("/dashboard");
    } catch (error) {
      let errorMessage = "";
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "User not found. Please check your email.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password. Please try again.";
          break;
        default:
          errorMessage = "An unknown error occurred. Please try again later.";
      }
      throw new Error(errorMessage);
    }
  };

  const googleProvider = new GoogleAuthProvider();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Signed in with Google successfully!");
      // Check if the user's email already exists in the database
      const emailQuery = query(
        collectionRef,
        where("email", "==", result.user.email)
      );
      const querySnapshot = await getDocs(emailQuery);
      if (querySnapshot.docs.length === 0) {
        // Add the email to the database if it doesn't already exist
        addDoc(collectionRef, {
          email: result.user.email,
          order: defaultOrder,
          name: result.user.displayName,
        });
      }
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  const getOrder = async (user) => {
    if (user) {
      const userQuery = query(
        collection(database, "users"),
        where("email", "==", user.email)
      );
      try {
        const querySnapshot = await getDocs(userQuery);
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setUserOrder(userData.order);
        } else {
          console.log("No user found with the specified email");
        }
      } catch (error) {
        console.log("Error fetching order from the database", error);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      getOrder(user);
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userOrder,
    signup,
    login,
    logout,
    handleGoogleSignIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
