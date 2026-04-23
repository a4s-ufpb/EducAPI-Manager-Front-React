import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Login from '../pages/Login/Login'
import Register from '../pages/Register/Register'
import ResetPassword from '../pages/ResetPassword/ResetPassword'

const MainRoutes = () => {
  return (
   
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/cadastrar' element={<Register/>} />
        <Route path='/redefinir-senha' element={<ResetPassword/>} />
      </Routes>
   
    
  )
}

export default MainRoutes
