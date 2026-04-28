import React,{useState} from 'react'
import './AppLayout.css'
import ResponsiveSidebar from '../../components/ResponsiveSidebar/ResponsiveSidebar';
import HeaderTitle from '../../components/HeaderTitle/HeaderTitle';
import { Outlet, useLocation } from "react-router-dom";
import { useWindowSize } from '../../hooks/useWindowSize';

const AppLayout = () => {
 const location = useLocation();
  const [open, setOpen] = useState(false);
  const isMobile = useWindowSize();

  const toggleSidebar = () => setOpen(!open);
  
  // Lista de páginas que NÃO devem ter menu nem cabeçalho
  const publicRoutes = ["/login", "/cadastro", "/"];
  const isPublicPage = publicRoutes.includes(location.pathname);

  return (
    <div className="main-container">
      {!isPublicPage && <ResponsiveSidebar 
      open={open} setOpen={setOpen} isMobile={isMobile} />}
      
      <div className="content-wrapper">
        {/* HeaderTitle (gerencia o botão e o texto) */}
        {!isPublicPage && 
        <HeaderTitle 
          isMobile={isMobile} 
          onMenuClick={toggleSidebar} 
        />}
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout
