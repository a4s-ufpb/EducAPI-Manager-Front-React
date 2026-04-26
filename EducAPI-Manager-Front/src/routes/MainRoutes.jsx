import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Login from '../pages/Login/Login'
import Register from '../pages/Register/Register'
import ResetPassword from '../pages/ResetPassword/ResetPassword'
import Home from "../pages/Home/Home"
import Challege from "../pages/Challenge/Challenge"
const MainRoutes = () => {
  return (
   
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/cadastrar' element={<Register/>} />
        <Route path='/redefinir-senha' element={<ResetPassword/>} />

        <Route path='/home' element={<Home/>} />
        <Route path='/chalege' element={<Challege/>} />



      </Routes>
   
    
  )
}

export default MainRoutes
