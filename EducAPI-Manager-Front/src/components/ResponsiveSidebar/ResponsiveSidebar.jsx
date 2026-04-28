import React, {  useState } from 'react'
import Sidebar from '../Sidebar/Sidebar';
import './ResponsiveSidebar.css'


const ResponsiveSidebar = ({ open, setOpen, isMobile }) => {

  return (
    <div className='reponsive-sidebar-container'>
      {!isMobile && <Sidebar fixed />}

      {isMobile && open && <Sidebar isOpen={open} setOpen={setOpen} />}

    </div>

  )
}

export default ResponsiveSidebar
