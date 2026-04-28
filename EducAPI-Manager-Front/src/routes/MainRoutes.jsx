import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from '../pages/Login/Login'
import Register from '../pages/Register/Register'
import ResetPassword from '../pages/ResetPassword/ResetPassword'
import Home from "../pages/Home/Home"
import Challege from "../pages/Challenge/Challenge"

import AppLayout from '../layouts/AppLayout/AppLayout'
const MainRoutes = () => {
  return (

    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/login' element={<Login />} />
      <Route path='/cadastrar' element={<Register />} />
      <Route path='/redefinir-senha' element={<ResetPassword />} />
      <Route element={<AppLayout />}>
        <Route path='/home' element={<Home />} />
        <Route path='/challenge' element={<Challege />} />
      </Route >



    </Routes>


  )
}

export default MainRoutes
