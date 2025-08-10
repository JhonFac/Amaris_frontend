import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getApiEndpoint } from '../config/api'

function Funds() {
  const [funds, setFunds] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFund, setSelectedFund] = useState(null)

  useEffect(() => {
    fetchFunds()
  }, [])

  const fetchFunds = async () => {
    try {
      setLoading(true)
      const response = await fetch(getApiEndpoint('FUNDS'))
      const data = await response.json()
      setFunds(data.funds || [])
    } catch (error) {
      console.error('Error fetching funds:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFundClick = (fund) => {
    setSelectedFund(fund)
  }

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(parseFloat(amount))
  }

  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toUpperCase()) {
      case 'BAJO': return '#10b981'
      case 'MEDIO': return '#f59e0b'
      case 'ALTO': return '#ef4444'
      default: return '#6c757d'
    }
  }

  const getFundTypeLabel = (type) => {
    switch (type) {
      case 'FIC': return 'Fondo de Inversión Colectiva'
      case 'FPV': return 'Fondo de Pensión Voluntaria'
      default: return type
    }
  }

  const getFundTypeColor = (type) => {
    switch (type) {
      case 'FIC': return '#6366f1'
      case 'FPV': return '#059669'
      default: return '#6c757d'
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando fondos de inversión...</p>
      </div>
    )
  }

  return (
    <div className="funds-container-modern">
      <div className="funds-header-modern">
        <div className="header-content">
          <h1>Fondos de Inversión</h1>
          <p>Gestiona y visualiza los fondos disponibles para tus clientes</p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <span className="stat-number">{funds.length}</span>
            <span className="stat-label">Fondos Disponibles</span>
          </div>
        </div>
      </div>

      <div className="funds-content-modern">
        <div className="funds-grid-modern-full">
        {funds.map((fund) => (
            <div 
              key={fund.fund_id} 
              className={`fund-card-modern-full ${selectedFund?.fund_id === fund.fund_id ? 'selected' : ''}`}
              onClick={() => handleFundClick(fund)}
            >
              <div className="fund-card-header-modern-full">
                <div className="fund-icon-modern-full">
                  {fund.type === 'FIC' ? '📈' : '🏦'}
                </div>
                <div className="fund-badges-full">
                  <span 
                    className="fund-type-badge-modern-full"
                    style={{ backgroundColor: getFundTypeColor(fund.type) }}
                  >
                    {fund.type}
                  </span>
                  <span 
                    className="fund-risk-badge-modern-full"
                    style={{ backgroundColor: getRiskColor(fund.risk_level) }}
                  >
                    {fund.risk_level}
                  </span>
                </div>
              </div>
              
              <div className="fund-card-content-modern-full">
                <h3 className="fund-name-modern-full">{fund.name}</h3>
                <p className="fund-description-modern-full">{fund.description}</p>
                
                <div className="fund-stats-modern-full">
                  <div className="fund-stat-item-full">
                    <span className="stat-label-full">Inversión Mínima</span>
                    <span className="stat-value-full">{formatAmount(fund.min_amount)}</span>
                  </div>
                  
                  <div className="fund-stat-item-full">
                    <span className="stat-label-full">Inversión Máxima</span>
                    <span className="stat-value-full">{formatAmount(fund.max_amount)}</span>
                  </div>
                  
                  <div className="fund-stat-item-full">
                    <span className="stat-label-full">ID del Fondo</span>
                    <span className="stat-value-full">{fund.fund_id}</span>
                  </div>
                  
                  <div className="fund-stat-item-full">
                    <span className="stat-label-full">Fecha de Creación</span>
                    <span className="stat-value-full">
                      {new Date(fund.created_at).toLocaleDateString('es-CO')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="fund-card-footer-modern-full">
                <Link 
                  to={`/operations?fund=${fund.fund_id}`} 
                  className="fund-action-button-modern-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>Suscribir</span>
                  <svg className="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
          </div>
        ))}
        </div>

        {selectedFund && (
          <div className="fund-sidebar-modern">
            <div className="sidebar-header">
              <h3>Detalles del Fondo</h3>
              <button 
                className="close-sidebar"
                onClick={() => setSelectedFund(null)}
              >
                ×
              </button>
            </div>
            
            <div className="fund-details-modern">
              <div className="detail-section">
                <h4>Información General</h4>
                <div className="detail-grid">
                  <div className="detail-item-modern">
                    <span className="detail-label">Nombre</span>
                    <span className="detail-value">{selectedFund.name}</span>
                  </div>
                  <div className="detail-item-modern">
                    <span className="detail-label">Tipo</span>
                    <span className="detail-value">{getFundTypeLabel(selectedFund.type)}</span>
                  </div>
                  <div className="detail-item-modern">
                    <span className="detail-label">Nivel de Riesgo</span>
                    <span className="detail-value risk-value" style={{ color: getRiskColor(selectedFund.risk_level) }}>
                      {selectedFund.risk_level}
                    </span>
                  </div>
                  <div className="detail-item-modern">
                    <span className="detail-label">ID del Fondo</span>
                    <span className="detail-value">{selectedFund.fund_id}</span>
                  </div>
                </div>
              </div>
              
              <div className="detail-section">
                <h4>Montos de Inversión</h4>
                <div className="detail-grid">
                  <div className="detail-item-modern">
                    <span className="detail-label">Monto Mínimo</span>
                    <span className="detail-value amount-value">{formatAmount(selectedFund.min_amount)}</span>
                  </div>
                  <div className="detail-item-modern">
                    <span className="detail-label">Monto Máximo</span>
                    <span className="detail-value amount-value">{formatAmount(selectedFund.max_amount)}</span>
                  </div>
                </div>
              </div>
              
              <div className="detail-section">
                <h4>Descripción</h4>
                <p className="detail-description">{selectedFund.description}</p>
              </div>
              
              <div className="detail-section">
                <h4>Información Técnica</h4>
                <div className="detail-grid">
                  <div className="detail-item-modern">
                    <span className="detail-label">Fecha de Creación</span>
                    <span className="detail-value">
                      {new Date(selectedFund.created_at).toLocaleDateString('es-CO', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="sidebar-actions">
                <Link 
                  to={`/operations?fund=${selectedFund.fund_id}`} 
                  className="sidebar-action-button"
                >
                  Suscribir Cliente
                </Link>
                <button 
                  className="sidebar-action-button secondary"
                  onClick={() => setSelectedFund(null)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {funds.length === 0 && (
        <div className="empty-state-modern">
          <div className="empty-icon">💰</div>
          <h3>No hay fondos disponibles</h3>
          <p>No se han configurado fondos de inversión en el sistema.</p>
        </div>
      )}
    </div>
  )
}

export default Funds
