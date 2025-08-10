import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { getApiEndpoint } from '../config/api'
import { showSuccess, showError } from '../utils/notifications'

function Operations() {
  const [searchParams] = useSearchParams()
  const [clients, setClients] = useState([])
  const [funds, setFunds] = useState([])
  const [selectedClient, setSelectedClient] = useState(null)
  const [operation, setOperation] = useState('subscribe')
  const [formData, setFormData] = useState({
    client_id: '',
    fund_id: '',
    amount: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchData()
    // Si hay un cliente en la URL, seleccionarlo
    const clientId = searchParams.get('client')
    if (clientId) {
      setFormData(prev => ({ ...prev, client_id: clientId }))
    }
  }, [searchParams])

  const fetchData = async () => {
    try {
      const [clientsRes, fundsRes] = await Promise.all([
        fetch(getApiEndpoint('CLIENTS')),
        fetch(getApiEndpoint('FUNDS'))
      ])
      
      const clientsData = await clientsRes.json()
      const fundsData = await fundsRes.json()
      
      setClients(clientsData.clients || [])
      setFunds(fundsData.funds || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      showError('Error al cargar datos')
    }
  }

  const handleClientSelect = (clientId) => {
    const client = clients.find(c => c.client_id === clientId)
    setSelectedClient(client)
    setFormData(prev => ({ ...prev, client_id: clientId }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let endpoint, payload
      
      switch (operation) {
        case 'subscribe':
          endpoint = getApiEndpoint('SUBSCRIBE')
          payload = {
            client_id: formData.client_id,
            fund_id: formData.fund_id
          }
          break
        case 'cancel':
          endpoint = getApiEndpoint('CANCEL')
          payload = {
            client_id: formData.client_id,
            fund_id: formData.fund_id
          }
          break
        case 'deposit':
          endpoint = getApiEndpoint('DEPOSIT')
          payload = {
            client_id: formData.client_id,
            amount: parseInt(formData.amount)
          }
          break
        default:
          throw new Error('Operación no válida')
      }
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (data.success) {
        showSuccess(`Operación realizada exitosamente! ${data.message || ''}`)
        setFormData({ client_id: '', fund_id: '', amount: '' })
        setSelectedClient(null)
      } else {
        showError(data.message || 'Error en la operación')
      }
    } catch (error) {
      console.error('Error performing operation:', error)
      showError('Error en la operación: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const getOperationDescription = () => {
    switch (operation) {
      case 'subscribe':
        return 'Suscribir a un fondo de inversión'
      case 'cancel':
        return 'Cancelar suscripción a un fondo'
      case 'deposit':
        return 'Realizar depósito a la cuenta del cliente'
      default:
        return ''
    }
  }

  const getOperationIcon = () => {
    switch (operation) {
      case 'subscribe':
        return '📈'
      case 'cancel':
        return '❌'
      case 'deposit':
        return '💰'
      default:
        return '⚡'
    }
  }

  return (
    <div className="operations-container">
      <div className="operations-header">
        <h2>Gestión de Operaciones</h2>
        <p>Realiza operaciones financieras para tus clientes</p>
      </div>

      {/* Removed message display as per edit hint */}

      <div className="operations-content">
        <div className="client-selection">
          <h3>Seleccionar Cliente</h3>
          <div className="client-search">
            <select
              value={formData.client_id}
              onChange={(e) => handleClientSelect(e.target.value)}
              className="client-select"
            >
              <option value="">Buscar cliente...</option>
              {clients.map((client) => (
                <option key={client.client_id} value={client.client_id}>
                  {client.client_id} - {client.nombre} {client.apellidos}
                </option>
              ))}
            </select>
          </div>

          {selectedClient && (
            <div className="selected-client-card">
              <div className="client-avatar">
                {selectedClient.nombre?.charAt(0)}{selectedClient.apellidos?.charAt(0)}
              </div>
              <div className="client-info">
                <h4>{selectedClient.nombre} {selectedClient.apellidos}</h4>
                <p className="client-id">{selectedClient.client_id}</p>
                <p className="client-email">{selectedClient.email}</p>
              </div>
              <Link 
                to={`/client/${selectedClient.client_id}`} 
                className="view-client-link"
              >
                Ver Cliente
              </Link>
            </div>
          )}
        </div>

        {selectedClient && (
          <div className="operation-form">
            <div className="operation-type-selector">
              <h3>Tipo de Operación</h3>
              <div className="operation-options">
                <label className={`operation-option ${operation === 'subscribe' ? 'active' : ''}`}>
            <input
              type="radio"
              value="subscribe"
              checked={operation === 'subscribe'}
              onChange={(e) => setOperation(e.target.value)}
            />
                  <div className="option-content">
                    <span className="option-icon">📈</span>
                    <span className="option-text">Suscribir a Fondo</span>
                  </div>
                </label>
                
                <label className={`operation-option ${operation === 'deposit' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    value="deposit"
                    checked={operation === 'deposit'}
                    onChange={(e) => setOperation(e.target.value)}
                  />
                  <div className="option-content">
                    <span className="option-icon">💰</span>
                    <span className="option-text">Realizar Depósito</span>
                  </div>
          </label>
                
                <label className={`operation-option ${operation === 'cancel' ? 'active' : ''}`}>
            <input
              type="radio"
              value="cancel"
              checked={operation === 'cancel'}
              onChange={(e) => setOperation(e.target.value)}
            />
                  <div className="option-content">
                    <span className="option-icon">❌</span>
                    <span className="option-text">Cancelar Suscripción</span>
                  </div>
          </label>
              </div>
        </div>

            <div className="operation-details">
              <div className="operation-header">
                <span className="operation-icon">{getOperationIcon()}</span>
          <div>
                  <h4>{getOperationDescription()}</h4>
                  <p>Cliente: {selectedClient.nombre} {selectedClient.apellidos}</p>
                </div>
          </div>

              <form onSubmit={handleSubmit} className="form">
          {operation !== 'deposit' && (
                  <div className="form-group">
                    <label>Fondo de Inversión:</label>
              <select
                name="fund_id"
                value={formData.fund_id}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Seleccionar fondo</option>
                {funds.map((fund) => (
                        <option key={fund.fund_id} value={fund.fund_id}>
                          {fund.name} - Mínimo: {new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            minimumFractionDigits: 0
                          }).format(parseFloat(fund.min_amount))}
                  </option>
                ))}
              </select>
            </div>
          )}

                {operation === 'deposit' && (
                  <div className="form-group">
                    <label>Monto del Depósito (COP):</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="input"
              required
                      min="1000"
                      step="1000"
                      placeholder="Ej: 100000"
            />
                    <small>Monto mínimo: $1,000 COP</small>
          </div>
                )}

                <button type="submit" className="button primary" disabled={loading}>
            {loading ? 'Procesando...' : 'Ejecutar Operación'}
          </button>
        </form>
            </div>
          </div>
        )}

        {!selectedClient && (
          <div className="no-client-selected">
            <div className="empty-state">
              <div className="empty-icon">👤</div>
              <h3>Selecciona un Cliente</h3>
              <p>Para realizar operaciones, primero debes seleccionar un cliente del sistema.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Operations
