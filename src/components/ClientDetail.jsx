import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getApiEndpoint } from '../config/api'

function ClientDetail() {
  const { id } = useParams()
  const [client, setClient] = useState(null)
  const [balance, setBalance] = useState(null)
  const [subscriptions, setSubscriptions] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchClientData()
  }, [id])

  const fetchClientData = async () => {
    try {
      setLoading(true)
      const [clientRes, balanceRes, subscriptionsRes, transactionsRes] = await Promise.all([
        fetch(getApiEndpoint('CLIENTS') + id + '/'),
        fetch(getApiEndpoint('CLIENT_BALANCE', id)),
        fetch(getApiEndpoint('CLIENT_SUBSCRIPTIONS', id)),
        fetch(getApiEndpoint('CLIENT_TRANSACTIONS', id))
      ])
      
      const clientData = await clientRes.json()
      const balanceData = await balanceRes.json()
      const subscriptionsData = await subscriptionsRes.json()
      const transactionsData = await transactionsRes.json()
      
      setClient(clientData.client)
      setBalance(balanceData)
      setSubscriptions(subscriptionsData.subscriptions || [])
      setTransactions(transactionsData.transactions || [])
    } catch (error) {
      console.error('Error fetching client data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando información del cliente...</p>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="error-container">
        <h2>Cliente no encontrado</h2>
        <p>El cliente con ID {id} no existe en el sistema.</p>
        <Link to="/clients" className="button">Volver a Clientes</Link>
      </div>
    )
  }

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(parseFloat(amount))
  }

  const getTransactionTypeLabel = (type) => {
    switch (type) {
      case 'subscription': return 'Suscripción'
      case 'cancellation': return 'Cancelación'
      case 'deposit': return 'Depósito'
      case 'SALDO_INICIAL': return 'Saldo Inicial'
      default: return type
    }
  }

  const getTransactionStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#28a745'
      case 'pending': return '#ffc107'
      case 'failed': return '#dc3545'
      default: return '#6c757d'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="client-detail-container">
      <div className="client-header">
        <div className="client-info-main">
          <div className="client-avatar-large">
            {client.nombre?.charAt(0)}{client.apellidos?.charAt(0)}
          </div>
          <div className="client-details-main">
            <h1>{client.nombre} {client.apellidos}</h1>
            <p className="client-id">{client.client_id}</p>
            <div className="client-meta">
              <span className="meta-item">
                <span className="meta-label">Ciudad:</span>
                <span className="meta-value">{client.ciudad || 'N/A'}</span>
              </span>
              <span className="meta-item">
                <span className="meta-label">Email:</span>
                <span className="meta-value">{client.email}</span>
              </span>
              <span className="meta-item">
                <span className="meta-label">Teléfono:</span>
                <span className="meta-value">{client.phone || 'N/A'}</span>
              </span>
            </div>
          </div>
        </div>
        
        <div className="client-actions">
          <Link to="/operations" className="button primary">
            Nueva Operación
          </Link>
          <Link to="/clients" className="button secondary">
            Volver a Clientes
          </Link>
        </div>
      </div>

      <div className="client-stats">
        <div className="stat-item">
          <div className="stat-value">{formatAmount(balance?.balance?.balance || 0)}</div>
          <div className="stat-label">Balance Actual</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{balance?.total_subscribed_funds || 0}</div>
          <div className="stat-label">Fondos Suscritos</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{transactions?.length || 0}</div>
          <div className="stat-label">Total Transacciones</div>
        </div>
      </div>

      <div className="client-tabs">
        <div className="tab-buttons">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Resumen
          </button>
          <button 
            className={`tab-button ${activeTab === 'subscriptions' ? 'active' : ''}`}
            onClick={() => setActiveTab('subscriptions')}
          >
            Suscripciones
          </button>
          <button 
            className={`tab-button ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            Transacciones
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="overview-section">
                <h3>Información Personal</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">ID del Cliente:</span>
                    <span className="value">{client.client_id}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Nombre Completo:</span>
                    <span className="value">{client.nombre} {client.apellidos}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Ciudad:</span>
                    <span className="value">{client.ciudad || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Email:</span>
                    <span className="value">{client.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Teléfono:</span>
                    <span className="value">{client.phone || 'N/A'}</span>
                  </div>
                </div>
      </div>

              <div className="overview-section">
                <h3>Estado Financiero</h3>
                <div className="balance-overview">
                  <div className="balance-card">
                    <h4>Balance Disponible</h4>
                    <div className="balance-amount">{formatAmount(balance?.balance?.balance || 0)}</div>
                  </div>
                  <div className="balance-card">
                    <h4>Total Invertido</h4>
                    <div className="balance-amount">
                      {formatAmount(
                        balance?.subscribed_funds?.reduce((total, sub) => 
                          total + parseFloat(sub.subscribed_amount), 0
                        ) || 0
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'subscriptions' && (
            <div className="subscriptions-tab">
              <h3>Fondos Suscritos</h3>
              {balance?.subscribed_funds?.length > 0 ? (
                <div className="subscriptions-list">
                  {balance?.subscribed_funds?.map((subscription, index) => (
                    <div key={index} className="subscription-item">
                      <div className="subscription-header">
                        <h4>{subscription.fund_name}</h4>
                        <span className="fund-type">{subscription.fund_type}</span>
                      </div>
                      <div className="subscription-details">
                        <p><strong>Monto Suscrito:</strong> {formatAmount(subscription.subscribed_amount)}</p>
                        <p><strong>Fecha de Suscripción:</strong> {formatDate(subscription.subscription_date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>El cliente no tiene suscripciones activas</p>
                  <Link to="/operations" className="button">Suscribir a un Fondo</Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="transactions-tab">
              <h3>Historial de Transacciones</h3>
              {transactions.length > 0 ? (
                <div className="transactions-list">
                  {transactions?.map((transaction, index) => (
                    <div key={transaction.transaction_id || index} className="transaction-item">
                      <div className="transaction-header">
                        <div className="transaction-info">
                          <h4>Transacción {transaction.transaction_id?.slice(0, 8)}</h4>
                          <span className="transaction-date">{formatDate(transaction.created_at)}</span>
                        </div>
                        <span 
                          className="transaction-status"
                          style={{ backgroundColor: getTransactionStatusColor(transaction.status) }}
                        >
                          {transaction.status}
                        </span>
                      </div>
                      <div className="transaction-details">
                        <div className="transaction-type">
                          {getTransactionTypeLabel(transaction.transaction_type)}
                        </div>
                        <div className="transaction-amount">
                          {transaction.transaction_type === 'deposit' ? '+' : ''}{formatAmount(transaction.amount)}
                        </div>
                      </div>
                      <div className="transaction-meta">
                        <span className="fund-id">Fondo: {transaction.fund_id}</span>
                        <span className="transaction-id">ID: {transaction.transaction_id?.slice(0, 8)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No hay transacciones registradas</p>
            </div>
          )}
        </div>
      )}
        </div>
      </div>
    </div>
  )
}

export default ClientDetail
