import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Login from '../pages/Login/Login'
import Register from '../pages/Register/Register'

const MainRoutes = () => {
  return (
   
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/cadastrar' element={<Register/>} />
      </Routes>
   
    
  )
}

export default MainRoutes
