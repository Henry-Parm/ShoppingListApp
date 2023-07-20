import React from 'react'
import { useLists } from '../../contexts/ListsContext'
import '../../css/ManageLists.css'

export default function ManageLists({manageOverlay}) {
  const {lists, setLists} = useLists();

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
      {manageOverlay ? (<div className='manage-overlay'>
            {lists.map((list, index) => 
                  list.name !== 'inactive' && list.name !== 'miscellaneous'  ? (
                      <div key={index} className='manage-list-item'>
                          <div className='manage-list-text'>{list.name}</div>
                          <button className="delete-button" onClick={() => deleteList(list[0])}>Remove</button>
                      </div>
                  ) :  ( list.name === 'miscellaneous' ?
                    <div key={index} className='manage-list-item'>
                          <div className='manage-list-text'>{list.name}</div>
                          <button className="delete-button" onClick={() => deleteList(list[0])}>Clear List</button>
                      </div>
                  : null)
            )}
        </div>) : null}
      </>
  )
}
