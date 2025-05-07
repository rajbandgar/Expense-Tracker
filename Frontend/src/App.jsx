import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Login from './pages/auth/login'
import SignUp from './pages/auth/SignUp'
import Home from './pages/Dashboard/Home'
import Income from './pages/Dashboard/Income'
import Expense from './pages/Dashboard/Expense'
import UserProvider from './context/UserContext'
import {Toaster} from "react-hot-toast"

const Root = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};

const App = () => {
  return (
    <UserProvider>
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expense" element={<Expense />} />
        </Routes>
      </BrowserRouter>
    </div>

    <Toaster 
      toastOptions = {{
        className :"",
         style : {
          fontSize :"13px"
        },
      }} />
    </UserProvider>
  );
};

export default App;
