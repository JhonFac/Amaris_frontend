import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Funds from './components/Funds'
import Clients from './components/Clients'
import CreateClient from './components/CreateClient'
import ClientDetail from './components/ClientDetail'
import Operations from './components/Operations'
import ApiTest from './components/ApiTest'
import NotificationContainer from './components/NotificationContainer'
import './App.css'

// Componente para el Navbar con navegación activa
function Navbar() {
  const location = useLocation()
  
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="navbar-logo">
            <span>F</span>
          </div>
          <h1 className="navbar-title">Fondos de Inversión</h1>
        </div>
        
        <div className="navbar-menu">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Dashboard
          </Link>
          <Link to="/funds" className={`nav-link ${isActive('/funds') ? 'active' : ''}`}>
            Fondos
          </Link>
          <Link to="/clients" className={`nav-link ${isActive('/clients') ? 'active' : ''}`}>
            Clientes
          </Link>
          <Link to="/create-client" className={`nav-link ${isActive('/create-client') ? 'active' : ''}`}>
            Crear Cliente
          </Link>
          <Link to="/operations" className={`nav-link ${isActive('/operations') ? 'active' : ''}`}>
            Operaciones
          </Link>
          <Link to="/api-test" className={`nav-link ${isActive('/api-test') ? 'active' : ''}`}>
            Prueba API
          </Link>
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <Router>
      <div className="app">
        {/* Navbar Moderno */}
        <Navbar />

        {/* Contenido Principal */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/funds" element={<Funds />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/create-client" element={<CreateClient />} />
            <Route path="/client/:id" element={<ClientDetail />} />
            <Route path="/operations" element={<Operations />} />
            <Route path="/api-test" element={<ApiTest />} />
          </Routes>
        </main>

        {/* Contenedor de Notificaciones */}
        <NotificationContainer />
      </div>
    </Router>
  )
}

export default App
