import React from 'react'
import { useLocation, Link } from "react-router-dom";
import "./HeaderTitle.css"
import { FaBars } from "react-icons/fa";
const HeaderTitle = ({ isMobile, onMenuClick }) => {

    const location = useLocation()
    const path = location.pathname;

    let title = " "

    if(path === "/home"){
        title = "Menu Inicial"
    }
    else if (path.startsWith("/challenge")){
      title = "Desafios"

    }
        
    else{
      title = ""
    }


  return (
    <div className='header-container'>
      {/* Só mostra o ícone se for mobile */}
      {isMobile && (
        <div className='MenuToggle' onClick={onMenuClick}>
          <FaBars />
        </div>
      )}
            <span>{title}</span>
    </div>
    
  )
}

export default HeaderTitle
