import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/index.css'
import MainRoutes from './routes/MainRoutes'
import Login from './pages/Login/Login'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <MainRoutes/>
    </BrowserRouter>

  </StrictMode>,
)
