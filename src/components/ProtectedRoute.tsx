import React, { ReactElement } from 'react'
import { useAppSelector } from '../components/hooks'
import { Navigate } from 'react-router-dom'


function ProtectedRoute({children}:{children:ReactElement}) {
  const {users,restoring}=useAppSelector((state)=>state.auth);
  if(restoring) return <div>Loading...</div>

  if(!users) return <Navigate to="/login" replace></Navigate>
  return children;
}

export default ProtectedRoute;  