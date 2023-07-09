import React, {  useState } from "react";
import { useLists } from "../contexts/ListsContext";
import "../css/dashboard.css";
import "../css/addFoodItemsForm.css";
import "../css/foodList.css";
import DashboardMiddle from "./DashboardMiddle";
import NavBar from "./Navbar";
import FoodItemList from "./FoodItemList";
import DashboardLeft from "./DashboardLeft";
import Reset from "./Reset";

const Dashboard = () => {
  const [resetOpen, setResetOpen] = useState(false);
  const [manageOverlay, setManageOverlay] = useState(false);
  const {lists,
    listsReady} = useLists()
  // console.log(lists)

  return (
    <div>
      <Reset
        setResetOpen={setResetOpen}
        resetOpen={resetOpen}
      />
      <NavBar
        setResetOpen={setResetOpen}
      ></NavBar>
      <div className="container">
        <DashboardLeft
          setManageOverlay={setManageOverlay}
          manageOverlay={manageOverlay}
        />
        <DashboardMiddle
        />
        <div className="right">
          <ul className="food-list inactive">
            <div className="list-title">Inactive Items</div>
            {listsReady && (
              <FoodItemList
                foodItems={lists[lists.length - 1].items}
                listTitle="Inactive Items"
                isSorted={true}
              />
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
