import React, { useEffect } from 'react';
import { Routes, Route} from 'react-router-dom';
import './App.css';

import Login from './components/Login';
import MainLayout from './components/MainLayout';
import Dashboard from './components/Pages/Dashboard';
import Recurring from './components/Pages/Recurring';
import Transaction from './components/Pages/Transaction';
import ProtectedRoute from './components/ProtectedRoute';
import { useDispatch } from 'react-redux';
import { restoreSession } from './components/slice/loginSlice';

export default function App() {
  const dispatch=useDispatch();
  useEffect(()=>{dispatch(restoreSession())},[dispatch])
  return (
    <>
      <Routes>
        <Route path='/login' element={<Login/>}></Route>
        <Route element={<MainLayout />}>
          <Route path='/' element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> 
        <Route path="/transactions" element={<ProtectedRoute><Transaction /></ProtectedRoute>} />
        <Route path="/recurring-transactions" element={<ProtectedRoute><Recurring /></ProtectedRoute>} />
        </Route>
      </Routes>
    
    </>
  );
}