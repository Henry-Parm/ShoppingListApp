import React from "react";
import AddFoodItemButton from "./../Buttons/AddFoodItemButton";
import Button from "../Buttons/Button";
import DashboardLogic from "./DashboardLogic";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DashboardLeft({
  setManageOverlay,
  manageOverlay,
  resetOpen,
  setResetOpen
}) {
  const { currentUser } = useAuth()
  const {deleteSelected,
    moveToInactiveListInverse,
    moveToInactiveList,
    moveToActiveList,
    addList} = DashboardLogic({})
    const navigate = useNavigate();

    const handleSetManageOverlay = () =>{
      setManageOverlay(!manageOverlay)
    }
    const resetOpenHandler = () => {
      setResetOpen(!resetOpen)
    }
    const handleLoginNav = () => {
      navigate('/login')
    }

  return (
    <div className="left">
      <div className="info-tab">
        <div>My Shopping List</div>
        {currentUser ? <div>currentUser.email</div> : <div>something</div>}
      </div>
      <AddFoodItemButton
        addList={addList}
      />
      <Button
        actionFunction={moveToInactiveList}
        buttonName="Set Inactive"
      />
      <Button
        actionFunction={moveToActiveList}
        buttonName="Set Active"
      />
      <Button
        actionFunction={moveToInactiveListInverse}
        buttonName="Deactivate Unselected"
      />
      <Button
        actionFunction={deleteSelected}
        buttonName="Delete Selected"
      />
      <Button
        actionFunction={handleSetManageOverlay}
        buttonName='Manage Lists'
        />
        <Button
          actionFunction={resetOpenHandler}
          buttonName='Reset'
        />
        {currentUser ? null : 
        <Button
          actionFunction={handleLoginNav}
          buttonName='Login'
        />}
        
    </div>
  )
}
