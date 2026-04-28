import React from 'react'
import "./SidebarItem.css";
const SidebarItem = ({Icon,text,isLogout, onClick}) => {
  return (
    <button className={`sidebar-item ${isLogout ? "logout": ""}`}
    onClick={onClick}
    >
        <Icon aria-hidden= "true"/>
         <span>{text}</span>
    </button>
  )
}

export default SidebarItem
