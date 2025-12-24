import React from 'react';
import { Routes, Route, BrowserRouter, Link } from 'react-router-dom';
import './App.css';

import Login from './components/Login';
import MainLayout from './components/MainLayout';
import Dashboard from './components/Pages/Dashboard';
import Recurring from './components/Pages/Recurring';
import Transaction from './components/Pages/Transaction';

export default function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Recurring />} />
        <Route path="/recurring-transactions" element={<Transaction />} />
        </Route>
      </Routes>
      </BrowserRouter>
    </>
  );
}