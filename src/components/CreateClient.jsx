import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getApiEndpoint } from '../config/api'

function CreateClient() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [formData, setFormData] = useState({
    client_id: 'CL_TEST_001',
    nombre: '',
    apellidos: '',
    email: '',
    phone: '+573212777381',
    ciudad: '',
    direccion: '',
    fecha_nacimiento: '',
    tipo_identificacion: '',
    numero_identificacion: '',
    ocupacion: '',
    ingresos_mensuales: '',
    patrimonio_liquido: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(getApiEndpoint('CREATE_CLIENT'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: 'Cliente creado exitosamente!' })
        setTimeout(() => {
        navigate('/clients')
        }, 2000)
      } else {
        setMessage({ type: 'error', text: 'Error: ' + (data.message || 'Error al crear cliente') })
      }
    } catch (error) {
      console.error('Error creating client:', error)
      setMessage({ type: 'error', text: 'Error al crear cliente' })
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

  return (
    <div className="create-client-container">
      <div className="create-client-header">
        <div className="header-icon">👤</div>
        <div className="header-content">
          <h1>Crear Nuevo Cliente</h1>
          <p>Completa la información del cliente para registrarlo en el sistema</p>
        </div>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <div className="create-client-form-container">
        <form onSubmit={handleSubmit} className="create-client-form">
          <div className="form-section">
            <h3>Información Básica</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="client_id">
                  <span className="label-icon">🆔</span>
                  ID del Cliente
                </label>
                <input
                  id="client_id"
                  type="text"
                  name="client_id"
                  value={formData.client_id}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Ej: CL_TEST_001"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="nombre">
                  <span className="label-icon">👤</span>
                  Nombre
                </label>
                <input
                  id="nombre"
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Ingresa el nombre"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="apellidos">
                  <span className="label-icon">👥</span>
                  Apellidos
                </label>
          <input
                  id="apellidos"
            type="text"
                  name="apellidos"
                  value={formData.apellidos}
            onChange={handleChange}
                  className="form-input"
                  placeholder="Ingresa los apellidos"
            required
          />
        </div>

              <div className="form-group">
                <label htmlFor="ciudad">
                  <span className="label-icon">🏙️</span>
                  Ciudad
                </label>
                <input
                  id="ciudad"
                  type="text"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Ingresa la ciudad"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Información de Contacto</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="email">
                  <span className="label-icon">📧</span>
                  Email
                </label>
          <input
                  id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
                  className="form-input"
                  placeholder="ejemplo@email.com"
            required
          />
        </div>

              <div className="form-group">
                <label htmlFor="phone">
                  <span className="label-icon">📱</span>
                  Teléfono
                </label>
          <input
                  id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
                  className="form-input"
                  placeholder="+573212777381"
                  required
          />
              </div>
            </div>
        </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => navigate('/clients')}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner-small"></span>
                  Creando...
                </>
              ) : (
                <>
                  <span className="btn-icon">✓</span>
                  Crear Cliente
                </>
              )}
        </button>
          </div>
      </form>
      </div>
    </div>
  )
}

export default CreateClient
