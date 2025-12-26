import React, { useEffect } from 'react';
import { Routes, Route, BrowserRouter} from 'react-router-dom';
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
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
        <Route path='/login' element={<Login/>}></Route>
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route element={<MainLayout />}>
        <Route path="/transactions" element={<Transaction />} />
        <Route path="/recurring-transactions" element={<Recurring />} />
        </Route>
      </Routes>
      </BrowserRouter>
    </>
  );
}