import React from 'react'
import { useParams } from 'react-router-dom'
function Store() {
  const {id}=useParams();

  return (
    <div>
            <h1>Store Page</h1>
      <p>You've selected item with ID: {id}</p>
    </div>
  )
}

export default Store
