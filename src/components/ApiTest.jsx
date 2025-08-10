import { useState, useRef } from 'react'
import { getApiEndpoint } from '../config/api'

function ApiTest() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState({})
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    clientId: 'CL_TEST_001',
    clientEmail: 'jhonfredyaya04@gmail.com',
    clientPhone: '+573212777381',
    fundId: '4',
    amount: '200000'
  })
  
  const resultsRef = useRef(null)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const clearResults = () => {
    setResults({})
    setErrors({})
  }

  const scrollToResults = () => {
    if (resultsRef.current) {
      // Agregar un pequeño delay para asegurar que el DOM se haya actualizado
      setTimeout(() => {
        resultsRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        })
        
        // Agregar una clase temporal para el efecto de highlight
        resultsRef.current.classList.add('highlight-results')
        setTimeout(() => {
          resultsRef.current.classList.remove('highlight-results')
        }, 2000)
      }, 200)
    }
  }

  const makeApiCall = async (endpoint, method = 'GET', body = null, testName, param = null) => {
    // Limpiar resultados anteriores automáticamente
    setResults({})
    setErrors({})
    
    setLoading(true)

    try {
      console.log(`🔄 ${testName}: Iniciando...`)
      
      let url
      if (param && endpoint === 'FUND_BY_ID') {
        url = getApiEndpoint('FUND_BY_ID', param)
      } else if (param && endpoint === 'CLIENT_BY_ID') {
        url = getApiEndpoint('CLIENT_BY_ID', param)
      } else if (param && endpoint === 'CLIENT_BALANCE') {
        url = getApiEndpoint('CLIENT_BALANCE', param)
      } else if (param && endpoint === 'CLIENT_SUBSCRIPTIONS') {
        url = getApiEndpoint('CLIENT_SUBSCRIPTIONS', param)
      } else if (param && endpoint === 'CLIENT_TRANSACTIONS') {
        url = getApiEndpoint('CLIENT_TRANSACTIONS', param)
      } else {
        url = getApiEndpoint(endpoint)
      }

      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        }
      }

      if (body) {
        options.body = JSON.stringify(body)
      }

      console.log(`📡 ${testName}: ${method} ${url}`)
      if (body) console.log(`📦 Body:`, body)

      const response = await fetch(url, options)
      console.log(`📡 ${testName}: Status ${response.status}`)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log(`✅ ${testName}: Respuesta exitosa:`, data)
      setResults(prev => ({ ...prev, [testName]: data }))
      
      // Scroll automático hacia los resultados después de un pequeño delay
      setTimeout(() => {
        scrollToResults()
      }, 100)
      
    } catch (error) {
      console.error(`💥 ${testName}: Error:`, error)
      setErrors(prev => ({ ...prev, [testName]: error.message }))
      
      // Scroll automático hacia los resultados incluso si hay error
      setTimeout(() => {
        scrollToResults()
      }, 100)
    } finally {
      setLoading(false)
    }
  }

  const testEndpoints = {
    health: () => makeApiCall('HEALTH', 'GET', null, 'Health Check'),
    initialize: () => makeApiCall('INITIALIZE', 'POST', null, 'Initialize System'),
    listFunds: () => makeApiCall('FUNDS', 'GET', null, 'List Funds'),
    getFundById: () => {
      const fundId = formData.fundId || '1'
      makeApiCall('FUND_BY_ID', 'GET', null, 'Get Fund by ID', fundId)
    },
    createClient: () => {
      const body = {
        client_id: formData.clientId,
        nombre: "Jhon",
        apellidos: "Aya",
        ciudad: "Bogota",
        email: formData.clientEmail,
        phone: formData.clientPhone
      }
      makeApiCall('CREATE_CLIENT', 'POST', body, 'Create Client')
    },
    listClients: () => makeApiCall('CLIENTS', 'GET', null, 'List Clients'),
    getClientById: () => {
      const clientId = formData.clientId || 'CL_TEST_001'
      makeApiCall('CLIENT_BY_ID', 'GET', null, 'Get Client by ID', clientId)
    },
    getClientBalance: () => {
      const clientId = formData.clientId || 'CL_TEST_001'
      makeApiCall('CLIENT_BALANCE', 'GET', null, 'Get Client Balance', clientId)
    },
    deposit: () => {
      const body = {
        client_id: formData.clientId,
        amount: parseInt(formData.amount)
      }
      makeApiCall('DEPOSIT', 'POST', body, 'Deposit to Client')
    },
    subscribe: () => {
      const body = {
        client_id: formData.clientId,
        fund_id: formData.fundId
      }
      makeApiCall('SUBSCRIBE', 'POST', body, 'Subscribe to Fund')
    },
    getSubscriptions: () => {
      const clientId = formData.clientId || 'CL_TEST_001'
      makeApiCall('CLIENT_SUBSCRIPTIONS', 'GET', null, 'Get Client Subscriptions', clientId)
    },
    getTransactions: () => {
      const clientId = formData.clientId || 'CL_TEST_001'
      makeApiCall('CLIENT_TRANSACTIONS', 'GET', null, 'Get Client Transactions', clientId)
    },
    cancelSubscription: () => {
      const body = {
        client_id: formData.clientId,
        fund_id: formData.fundId
      }
      makeApiCall('CANCEL', 'POST', body, 'Cancel Subscription')
    }
  }

  const getEndpointUrl = (endpoint) => {
    return getApiEndpoint(endpoint)
  }

  return (
    <div className="api-test-container">
      <div className="api-test-header">
        <div className="header-icon">🧪</div>
        <div className="header-content">
          <h1>Panel de Pruebas de API</h1>
          <p>Prueba todas las funcionalidades de la API directamente desde la interfaz</p>
        </div>
      </div>

      <div className="api-test-content">
        <div className="config-panel">
          <h3>⚙️ Configuración de Pruebas</h3>
          <div className="config-grid">
            <div className="config-group">
              <label htmlFor="clientId">ID del Cliente:</label>
              <input
                id="clientId"
                name="clientId"
                type="text"
                value={formData.clientId}
                onChange={handleInputChange}
                className="config-input"
                placeholder="CL_TEST_001"
              />
            </div>
            <div className="config-group">
              <label htmlFor="clientEmail">Email del Cliente:</label>
              <input
                id="clientEmail"
                name="clientEmail"
                type="email"
                value={formData.clientEmail}
                onChange={handleInputChange}
                className="config-input"
                placeholder="jhonfredyaya04@gmail.com"
              />
            </div>
            <div className="config-group">
              <label htmlFor="clientPhone">Teléfono del Cliente:</label>
              <input
                id="clientPhone"
                name="clientPhone"
                type="tel"
                value={formData.clientPhone}
                onChange={handleInputChange}
                className="config-input"
                placeholder="+573212777381"
              />
            </div>
            <div className="config-group">
              <label htmlFor="fundId">ID del Fondo:</label>
              <input
                id="fundId"
                name="fundId"
                type="text"
                value={formData.fundId}
                onChange={handleInputChange}
                className="config-input"
                placeholder="4"
              />
            </div>
            <div className="config-group">
              <label htmlFor="amount">Monto (COP):</label>
              <input
                id="amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleInputChange}
                className="config-input"
                placeholder="200000"
              />
            </div>
          </div>
        </div>

        <div className="actions-panel">
          <div className="actions-header">
            <h3>🚀 Acciones de Prueba</h3>
            <button onClick={clearResults} className="btn-clear">
              🗑️ Limpiar Resultados
            </button>
          </div>
          
          <div className="test-categories">
            <div className="test-category">
              <h4>🔍 Verificación del Sistema</h4>
              <div className="test-buttons">
                <button 
                  onClick={testEndpoints.health}
                  disabled={loading}
                  className="test-btn health"
                >
                  Health Check
                </button>
                <button 
                  onClick={testEndpoints.initialize}
                  disabled={loading}
                  className="test-btn initialize"
                >
                  Initialize System
                </button>
              </div>
            </div>

            <div className="test-category">
              <h4>💰 Gestión de Fondos</h4>
              <div className="test-buttons">
                <button 
                  onClick={testEndpoints.listFunds}
                  disabled={loading}
                  className="test-btn funds"
                >
                  Listar Fondos
                </button>
                <button 
                  onClick={testEndpoints.getFundById}
                  disabled={loading}
                  className="test-btn fund-detail"
                >
                  Obtener Fondo por ID
                </button>
              </div>
            </div>

            <div className="test-category">
              <h4>👥 Gestión de Clientes</h4>
              <div className="test-buttons">
                <button 
                  onClick={testEndpoints.createClient}
                  disabled={loading}
                  className="test-btn create-client"
                >
                  Crear Cliente
                </button>
                <button 
                  onClick={testEndpoints.listClients}
                  disabled={loading}
                  className="test-btn list-clients"
                >
                  Listar Clientes
                </button>
                <button 
                  onClick={testEndpoints.getClientById}
                  disabled={loading}
                  className="test-btn client-detail"
                >
                  Obtener Cliente por ID
                </button>
              </div>
            </div>

            <div className="test-category">
              <h4>💳 Operaciones Financieras</h4>
              <div className="test-buttons">
                <button 
                  onClick={testEndpoints.deposit}
                  disabled={loading}
                  className="test-btn deposit"
                >
                  Depositar a Cliente
                </button>
                <button 
                  onClick={testEndpoints.subscribe}
                  disabled={loading}
                  className="test-btn subscribe"
                >
                  Suscribir a Fondo
                </button>
                <button 
                  onClick={testEndpoints.cancelSubscription}
                  disabled={loading}
                  className="test-btn cancel"
                >
                  Cancelar Suscripción
                </button>
              </div>
            </div>

            <div className="test-category">
              <h4>📊 Consultas y Reportes</h4>
              <div className="test-buttons">
                <button 
                  onClick={testEndpoints.getClientBalance}
                  disabled={loading}
                  className="test-btn balance"
                >
                  Balance del Cliente
                </button>
                <button 
                  onClick={testEndpoints.getSubscriptions}
                  disabled={loading}
                  className="test-btn subscriptions"
                >
                  Suscripciones del Cliente
                </button>
                <button 
                  onClick={testEndpoints.getTransactions}
                  disabled={loading}
                  className="test-btn transactions"
                >
                  Transacciones del Cliente
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="results-panel" ref={resultsRef}>
          <h3>📋 Resultados de las Pruebas</h3>
          
          {loading && (
            <div className="loading-indicator">
              <div className="loading-spinner"></div>
              <p>🔄 Ejecutando prueba de API...</p>
              <p className="loading-subtitle">Redirigiendo automáticamente a los resultados</p>
            </div>
          )}
          
          {!loading && Object.keys(results).length === 0 && Object.keys(errors).length === 0 && (
            <div className="no-results">
              <p>👆 Haz clic en cualquier botón de prueba para ver los resultados aquí</p>
            </div>
          )}

          {Object.entries(results).map(([testName, result]) => (
            <div key={testName} className="result-item success">
              <div className="result-header">
                <h4>✅ {testName}</h4>
                <span className="result-status">Éxito</span>
              </div>
              <div className="result-content">
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>
            </div>
          ))}

          {Object.entries(errors).map(([testName, error]) => (
            <div key={testName} className="result-item error">
              <div className="result-header">
                <h4>❌ {testName}</h4>
                <span className="result-status">Error</span>
              </div>
              <div className="result-content">
                <p className="error-message">{error}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="info-panel">
          <h3>ℹ️ Información de la API</h3>
          <div className="info-grid">
            <div className="info-item">
              <strong>Base URL:</strong>
              <code>{getApiEndpoint('HEALTH').replace('/api/health/', '')}</code>
            </div>
            <div className="info-item">
              <strong>Cliente de Prueba:</strong>
              <code>{formData.clientId}</code>
            </div>
            <div className="info-item">
              <strong>Fondo de Prueba:</strong>
              <code>{formData.fundId}</code>
            </div>
            <div className="info-item">
              <strong>Monto de Prueba:</strong>
              <code>${parseInt(formData.amount).toLocaleString('es-CO')} COP</code>
            </div>
            <div className="info-item full-width">
              <strong>Endpoints Disponibles:</strong>
              <ul>
                <li><code>/api/health/</code> - Verificación del sistema</li>
                <li><code>/api/initialize/</code> - Inicialización del sistema</li>
                <li><code>/api/funds/</code> - Gestión de fondos</li>
                <li><code>/api/clients/</code> - Gestión de clientes</li>
                <li><code>/api/subscribe/</code> - Suscripciones</li>
                <li><code>/api/cancel/</code> - Cancelaciones</li>
                <li><code>/api/deposit/</code> - Depósitos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApiTest
