import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getApiEndpoint } from '../config/api'

function Dashboard() {
  const [stats, setStats] = useState({
    totalFunds: 0,
    totalClients: 0,
    totalBalance: 0,
    funds: [],
    recentClients: [],
    systemHealth: 'unknown'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Verificar salud del sistema
      const healthRes = await fetch(getApiEndpoint('HEALTH'))
      const healthData = await healthRes.json()
      
      // Cargar fondos
      const fundsRes = await fetch(getApiEndpoint('FUNDS'))
      const fundsData = await fundsRes.json()
      
      // Cargar clientes
      const clientsRes = await fetch(getApiEndpoint('CLIENTS'))
      const clientsData = await clientsRes.json()
      
      // Calcular balance total sumando todos los clientes
      let totalBalance = 0
      if (clientsData.clients) {
        for (const client of clientsData.clients) {
          try {
            const balanceRes = await fetch(getApiEndpoint('CLIENT_BALANCE', client.client_id))
            const balanceData = await balanceRes.json()
            if (balanceData.success && balanceData.balance) {
              totalBalance += parseFloat(balanceData.balance.balance)
            }
          } catch (error) {
            console.error(`Error fetching balance for client ${client.client_id}:`, error)
          }
        }
      }
      
      setStats({
        totalFunds: fundsData.funds?.length || 0,
        totalClients: clientsData.clients?.length || 0,
        totalBalance: totalBalance,
        funds: fundsData.funds || [],
        recentClients: clientsData.clients?.slice(0, 5) || [], // Solo los últimos 5
        systemHealth: healthData.status || 'unknown'
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getHealthStatusColor = (status) => {
    switch (status) {
      case 'healthy': return '#27ae60'
      case 'degraded': return '#f39c12'
      case 'unhealthy': return '#e74c3c'
      default: return '#95a5a6'
    }
  }

  const getHealthStatusText = (status) => {
    switch (status) {
      case 'healthy': return 'Sistema Operativo'
      case 'degraded': return 'Rendimiento Reducido'
      case 'unhealthy': return 'Problemas Detectados'
      default: return 'Estado Desconocido'
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Panel de Control</h2>
        <div className="system-status">
          <span 
            className="status-indicator" 
            style={{ backgroundColor: getHealthStatusColor(stats.systemHealth) }}
          ></span>
          <span className="status-text">{getHealthStatusText(stats.systemHealth)}</span>
        </div>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <h3>Fondos Disponibles</h3>
          <p className="stat-number">{stats.totalFunds}</p>
          <p className="stat-description">Fondos de inversión activos</p>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <h3>Clientes Registrados</h3>
          <p className="stat-number">{stats.totalClients}</p>
          <p className="stat-description">Clientes en el sistema</p>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <h3>Balance Total</h3>
          <p className="stat-number">${stats.totalBalance.toLocaleString()}</p>
          <p className="stat-description">Capital total gestionado</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <h3>Estado del Sistema</h3>
          <p className="stat-number" style={{ color: getHealthStatusColor(stats.systemHealth) }}>
            {stats.systemHealth === 'healthy' ? '✓' : '⚠'}
          </p>
          <p className="stat-description">{getHealthStatusText(stats.systemHealth)}</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-section">
          <div className="funds-overview">
            <div className="section-header">
              <h3>Fondos de Inversión</h3>
              <Link to="/funds" className="view-all-link">Ver Todos →</Link>
            </div>
            <div className="funds-grid-modern">
              {stats.funds.slice(0, 4).map((fund) => (
                <div key={fund.fund_id} className="fund-card-modern">
                  <div className="fund-card-header-modern">
                    <div className="fund-icon-modern">
                      {fund.type === 'FIC' ? '📈' : '🏦'}
                    </div>
                    <div className="fund-badges">
                      <span className="fund-type-badge-modern" style={{
                        backgroundColor: fund.type === 'FIC' ? '#6366f1' : '#059669'
                      }}>
                        {fund.type}
                      </span>
                      <span className="fund-risk-badge-modern" style={{
                        backgroundColor: fund.risk_level === 'BAJO' ? '#10b981' : 
                                       fund.risk_level === 'MEDIO' ? '#f59e0b' : '#ef4444'
                      }}>
                        {fund.risk_level}
                      </span>
                    </div>
                  </div>
                  
                  <div className="fund-card-content-modern">
                    <h4 className="fund-name-modern">{fund.name}</h4>
                    <p className="fund-description-modern">{fund.description}</p>
                    
                    <div className="fund-stats-modern">
                      <div className="fund-stat-item">
                        <span className="stat-label">Inversión Mínima</span>
                        <span className="stat-value">
                          {new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            minimumFractionDigits: 0
                          }).format(parseFloat(fund.min_amount))}
                        </span>
                      </div>
                      
                      <div className="fund-stat-item">
                        <span className="stat-label">Inversión Máxima</span>
                        <span className="stat-value">
                          {new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            minimumFractionDigits: 0
                          }).format(parseFloat(fund.max_amount))}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="fund-card-footer-modern">
                    <Link to={`/funds`} className="fund-action-button-modern">
                      <span>Ver Detalles</span>
                      <svg className="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="content-section">
          {stats.recentClients.length > 0 ? (
            <div className="recent-clients">
              <div className="section-header">
                <h3>Clientes Recientes</h3>
                <Link to="/clients" className="view-all-link">Ver Todos →</Link>
              </div>
              <div className="clients-grid-modern">
                {stats.recentClients.map((client) => (
                  <div key={client.client_id} className="client-card-modern">
                    <div className="client-card-header-modern">
                      <div className="client-avatar-modern">
                        {client.nombre?.charAt(0)}{client.apellidos?.charAt(0)}
                      </div>
                      <div className="client-status-badge">
                        <span className="status-indicator-modern"></span>
                        <span className="status-text">Activo</span>
                      </div>
                    </div>
                    
                    <div className="client-card-content-modern">
                      <h4 className="client-name-modern">{client.nombre} {client.apellidos}</h4>
                      <p className="client-email-modern">{client.email}</p>
                      
                      <div className="client-stats-modern">
                        <div className="client-stat-item">
                          <span className="stat-label">Ciudad</span>
                          <span className="stat-value">{client.ciudad || 'No especificada'}</span>
                        </div>
                        
                        <div className="client-stat-item">
                          <span className="stat-label">Teléfono</span>
                          <span className="stat-value">{client.phone || 'No especificado'}</span>
                        </div>
        </div>
      </div>

                    <div className="client-card-footer-modern">
                      <Link to={`/client/${client.client_id}`} className="client-action-button-modern">
                        <span>Ver Perfil</span>
                        <svg className="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <p>No hay clientes registrados</p>
              <Link to="/create-client" className="button">Crear Primer Cliente</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
