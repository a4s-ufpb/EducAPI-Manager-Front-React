import React from 'react'
import "./AuthLayout.css"
const AuthLayout = ({ children, title, text }) => {
  return (
    <div className='container-layout'>
      {/* Lado Esquerdo: Banner/Imagem */}
      <div className='side-banner'>
        <img src="/logotipofinal_prancheta2.png" alt="logotipo" />
      </div>

      {/* Lado Direito: Área de Conteúdo */}
      <div className='side-content'>
        <div className='card-layout'>
          {title && <h1 className='title-layout'>{title}</h1>}
          {text && <p className='title-layout'>{text}</p>}
          {children}
        </div>
      </div>
    </div>
  );
};
export default AuthLayout
