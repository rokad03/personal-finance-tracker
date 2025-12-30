import React, { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { RootState } from './store/store'

function ProtectedRoute({children}:{children:ReactElement}) {

  const {users,restoring}=useSelector((state:RootState)=>state.auth);
  if(restoring) return <div>Loading...</div>
  console.log("USers from ProtectedRoute",users)
  if(!users) return <Navigate to="/login" replace></Navigate>
  return children;
}

export default ProtectedRoute;  