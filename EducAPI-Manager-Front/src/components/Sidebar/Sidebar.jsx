import React from 'react'
import { useNavigate } from "react-router-dom";
import {FaSignOutAlt, FaChartBar,FaTimes  } from "react-icons/fa";
import SidebarItem from '../SidebarItem/SidebarItem';
import "./Sidebar.css";
const Sidebar = ({ isOpen, setOpen, fixed }) => {

    const navigate = useNavigate()

    const closeSidebar = () => {
        if (setOpen) setOpen(false);
    }

    const goToHome = () => navigate("/home")

  return (
    <div className={`sidebar-container ${fixed ? "fixed" : ""} ${isOpen ? "active" : "" }`}>
        {!fixed && <FaTimes  className='close-icon' onClick={closeSidebar}/>}


       <div className="menu-toggle" onClick={goToHome}>
        <span> Apps 4 Society </span>
      </div>

      <div className="sidebar-content">
        <SidebarItem Icon={FaChartBar} text="Challenge" onClick={() => navigate("/challenge")} />
        <SidebarItem Icon={FaSignOutAlt} text="Sair" isLogout onClick={() => navigate("/")} />
      </div>
    </div>
  )
}

export default Sidebar

