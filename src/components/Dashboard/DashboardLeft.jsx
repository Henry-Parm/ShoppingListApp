import React from "react";
import Button from "../Buttons/Button";
import Logout from "../AuthComponents/Logout"
import DashboardLogic from "./DashboardLogic";
import { useAuth } from "../../contexts/AuthContext";
import logo from '../../assets/images/logo.svg'

export default function DashboardLeft({
  setManageOverlay,
  manageOverlay,
  resetOpen,
  setResetOpen,
  setShowItemOverlay,
  addItemClick
}) {
  const { currentUser } = useAuth()
  const {deleteSelected,
    moveToInactiveListInverse,
    moveToInactiveList,
    moveToActiveList,
    addList,
    handleLoginNav,
    handleResetOverlay,
    handleManageOverlay} = DashboardLogic({setManageOverlay,
      manageOverlay,
      resetOpen,
      setResetOpen})

    

  return (
    <div className="left">
      <div className="info-tab">
        <div className="logo-div"><img src={logo} alt="" /></div>
        {currentUser ? <div className="user-div">{currentUser.email}</div> : null}
      </div>
      <Button
        setShowItemOverlay={setShowItemOverlay}
        actionFunction={addItemClick}
        addList={addList}
        buttonName="Add Item"
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
        actionFunction={handleManageOverlay}
        buttonName='Manage Lists'
        />
        <Button
          actionFunction={handleResetOverlay}
          buttonName='Reset'
        />
        {currentUser ? <Logout/> : 
        <Button
          actionFunction={handleLoginNav}
          buttonName='Login'
        />}
        
    </div>
  )
}
