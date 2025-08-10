import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getApiEndpoint } from '../config/api'

function Clients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClient, setSelectedClient] = useState(null)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      setLoading(true)
      const response = await fetch(getApiEndpoint('CLIENTS'))
      const data = await response.json()
      setClients(data.clients || [])
    } catch (error) {
      console.error('Error fetching clients:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredClients = clients.filter(client => 
    client.client_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleClientSelect = (client) => {
    setSelectedClient(selectedClient?.client_id === client.client_id ? null : client)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando clientes...</p>
      </div>
    )
  }

  return (
    <div className="clients-container">
      <div className="clients-header">
        <h2>Gestión de Clientes</h2>
        <div className="header-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar por ID, nombre, apellidos o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <Link to="/create-client" className="create-button">
            + Nuevo Cliente
            </Link>
          </div>
      </div>

      <div className="clients-content">
        <div className="clients-list">
          <div className="list-header">
            <h3>Clientes ({filteredClients.length})</h3>
      </div>

          {filteredClients.length === 0 ? (
            <div className="empty-state">
              <p>No se encontraron clientes</p>
          <Link to="/create-client" className="button">
            Crear Primer Cliente
          </Link>
            </div>
          ) : (
            <div className="clients-grid">
              {filteredClients.map((client) => (
                <div className="client-card" key={client.client_id}>
                  <div className="client-avatar">
                    {client.nombre?.charAt(0)}{client.apellidos?.charAt(0)}
                  </div>
                  <div className="client-info">
                    <h3 className="client-name">{client.nombre} {client.apellidos}</h3>
                    <p className="client-id">ID: {client.client_id}</p>
                    <p className="client-email">{client.email}</p>
                    <p className="client-city">{client.ciudad}</p>
                    <p className="client-phone">{client.phone}</p>
                  </div>
                  <div className="client-actions">
                    <Link 
                      to={`/client/${client.client_id}`} 
                      className="button primary"
                    >
                      Ver Detalles
                    </Link>
                    <Link 
                      to={`/operations?client=${client.client_id}`} 
                      className="button secondary"
                    >
                      Operaciones
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedClient && (
          <div className="client-sidebar">
            <div className="sidebar-header">
              <h3>Cliente Seleccionado</h3>
              <button 
                className="close-button"
                onClick={() => setSelectedClient(null)}
              >
                ×
              </button>
            </div>
            
            <div className="selected-client-info">
              <div className="client-avatar-large">
                {selectedClient.nombre?.charAt(0)}{selectedClient.apellidos?.charAt(0)}
              </div>
              <h4>{selectedClient.nombre} {selectedClient.apellidos}</h4>
              <p className="client-id">{selectedClient.client_id}</p>
              
              <div className="info-section">
                <h5>Información de Contacto</h5>
                <div className="info-item">
                  <span className="label">Email:</span>
                  <span className="value">{selectedClient.email}</span>
                </div>
                <div className="info-item">
                  <span className="label">Teléfono:</span>
                  <span className="value">{selectedClient.phone || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Ciudad:</span>
                  <span className="value">{selectedClient.ciudad || 'N/A'}</span>
                </div>
              </div>

              <div className="action-buttons">
                <Link 
                  to={`/client/${selectedClient.client_id}`} 
                  className="button primary"
                >
                  Ver Detalles Completos
                </Link>
                <Link 
                  to={`/operations?client=${selectedClient.client_id}`} 
                  className="button secondary"
                >
                  Operaciones
                </Link>
              </div>
            </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default Clients
