import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useLists } from "../../contexts/ListsContext";
import "../../css/login-signup.css";

const LogoutButton = () => {
  const { logout } = useAuth();
  const { setLists, activeListSize, inactiveListSize } = useLists()
  const handleLogout = async () => {
    const listsString = localStorage.getItem('localLists');
    //this isnt needed
    if (listsString === null){
      const listsLocal = [{name: "miscellaneous", color: 2, id: 2, items: []},{name: "inactive", color: 1, id: 1, items: []}]
      const listsString = JSON.stringify(listsLocal);
      localStorage.setItem('localLists', listsString);
      setLists(listsLocal);
      activeListSize.current = 0;
      inactiveListSize.current = 0;
      // console.log('no data')
    }
    else{
      const listsData = JSON.parse(listsString);
      setLists(listsData);
      console.log('lists data', listsData)
      activeListSize.current = 0;
      inactiveListSize.current = 0;
      listsData.forEach((listsData) => {
        if(listsData.name === 'inactive') inactiveListSize.current += listsData.items.length
        else activeListSize.current += listsData.items.length
        // console.log('found data')
    })
    }
    
    try {
      await logout();
    } catch (error) {
      console.log("Error logging out", error);
    }
  };

  return (
    <button onClick={handleLogout} className="menu-button">
      Logout
    </button>
  );
};

export default LogoutButton;
