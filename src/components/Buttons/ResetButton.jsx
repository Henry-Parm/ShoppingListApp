import React from 'react'

export default function ResetButton() {

  const resetOpenHandler = () => {
    setResetOpen(true)
  }

  return (
    <div className='' onClick={resetOpenHandler}>ResetButton</div>
  )
}
