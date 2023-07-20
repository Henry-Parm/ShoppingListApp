import React, {  useEffect, useState } from "react";
import { useLists } from "../../contexts/ListsContext";
import { useAuth } from "../../contexts/AuthContext";
import "../../css/dashboard.css";
import "../../css/dashboard-left.css";
import "../../css/addFoodItemsForm.css";
import "../../css/foodList.css";
import DashboardMiddle from "./DashboardMiddle";
import FoodItemList from "../ListComponents/FoodItemList";
import DashboardLeft from "./DashboardLeft";
import Reset from "../Overlays/Reset";
import NavBar from "../Navbar"
import ManageLists from "../Overlays/ManageLists";

const Dashboard = () => {
  const [resetOpen, setResetOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false)
  const [manageOverlay, setManageOverlay] = useState(false);
  const {lists,
    listsReady, inactiveListSize} = useLists()
  // console.log(lists)
  

  useEffect(() => {
    const hamburgerButton = document.querySelector('.hamburger');
    const dropdownMenu = document.querySelector('.menu-button');
    const overLayContent = document.querySelector('.overlay-content');

    const closeMenu = (event) => {
      if (!dropdownMenu.contains(event.target) && !hamburgerButton.contains(event.target) /*&& !overLayContent.contains(event.target)*/) {
        // console.log('went')
        setIsOpen(false)
      }
    }
    document.addEventListener('click', closeMenu);
    return () => {
      document.removeEventListener('click', closeMenu);
    }
  }, [])
  
  return (
    <div>
      <ManageLists manageOverlay={manageOverlay}/>
      <Reset
        setResetOpen={setResetOpen}
        resetOpen={resetOpen}
      />
      <NavBar
        setResetOpen={setResetOpen}
        setManageOverlay={setManageOverlay}
        manageOverlay={manageOverlay}
        resetOpen={resetOpen}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      ></NavBar>
      <div className="container">
        
        <DashboardLeft
          setManageOverlay={setManageOverlay}
          manageOverlay={manageOverlay}
          resetOpen={resetOpen}
          setResetOpen={setResetOpen}
        />
        <DashboardMiddle
        />
        <div className="right">
          <ul className="food-list inactive">
            <div className="inactive-list-title">Inactive Items</div>
            {listsReady && inactiveListSize.current > 0 ? (
              <FoodItemList
                foodItems={lists[lists.length - 1].items}
                listTitle="Inactive Items"
                isSorted={true}
              />
            ) : <div style={{padding: "1em", textAlign: "center"}}>You have no inactive items</div>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
