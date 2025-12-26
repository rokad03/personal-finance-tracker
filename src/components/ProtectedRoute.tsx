import React, { ReactElement } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { RootState } from './store/store'

function ProtectedRoute({children}:{children:ReactElement}) {

  const {users}=useSelector((state:RootState)=>state.auth);
//   if(restoring) return null
  if(!users) return <Navigate to="/login" replace></Navigate>
  return children;
}

export default ProtectedRoute