import React, { ReactElement, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './store/store'
import { Navigate } from 'react-router-dom'
import { restoreSession } from './slice/loginSlice';


function ProtectedRoute({children}:{children:ReactElement}) {
  const {users,restoring}=useAppSelector((state)=>state.auth);
  const dispatch=useAppDispatch();
  useEffect(() => {
    if (users && users.expiresAt) {
      // Check token validity on every render
      if (Date.now() >= users.expiresAt) {
        // Token expired, try refresh or logout
        dispatch(restoreSession()); // This will trigger refresh attempt
      }
    }
  }, [users, dispatch]);
  if(restoring) return <div>Loading...</div>
  
  if(!users) return <Navigate to="/login" replace></Navigate>
  return children;
}

export default ProtectedRoute;  