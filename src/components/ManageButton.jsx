import React from 'react'
import '../css/ManageLists.css'
export default function ManageButton({setManageOverlay, manageOverlay, lists, setLists}) {
    const handleClick = () =>{
        setManageOverlay(true)
    }
    const deleteList = (listName) =>{
        setLists((oldLists) => {
            let modifiedLists = [...oldLists]
            console.log('listName', listName)
           modifiedLists = modifiedLists.filter((list) => {
           return list[0] !== listName
           })
           console.log(modifiedLists)
           return modifiedLists
        })
    }
  return (
    <>
        <button className="menu-button" onClick={handleClick}>Manage Lists</button>
        {manageOverlay ? (<div className='manage-overlay'>
           {lists.map((list, index) => 
                list[0] !== 'inactive' && list[0] !== 'miscellaneous' ? (
                    <div key={index} className='manage-list-item'>
                        <div className='manage-list-text'>{list[0]}</div>
                        <button className="delete-button" onClick={() => deleteList(list[0])}>Remove</button>
                    </div>
                ) :  null
           )}
        </div>) : null}
    </>
        
  )
}
