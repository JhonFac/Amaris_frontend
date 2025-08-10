// Configuración centralizada de la API
export const API_CONFIG = {
  BASE_URL: 'http://52.90.248.152:8080',
  ENDPOINTS: {
    HEALTH: '/api/health/',
    INITIALIZE: '/api/initialize/',
    FUNDS: '/api/funds/',
    FUND_BY_ID: (fundId = '1') => `/api/funds/${fundId}/`,
    CLIENTS: '/api/clients/',
    CLIENT_BY_ID: (clientId) => `/api/clients/${clientId}/`,
    CREATE_CLIENT: '/api/clients/create/',
    CLIENT_BALANCE: (clientId) => `/api/clients/${clientId}/balance/`,
    CLIENT_SUBSCRIPTIONS: (clientId) => `/api/clients/${clientId}/subscriptions/`,
    CLIENT_TRANSACTIONS: (clientId) => `/api/clients/${clientId}/transactions/`,
    SUBSCRIBE: '/api/subscribe/',
    CANCEL: '/api/cancel/',
    DEPOSIT: '/api/deposit/'
  }
}

// Función helper para construir URLs completas
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

// Función helper para obtener endpoint específico
export const getApiEndpoint = (key, ...params) => {
  const endpoint = API_CONFIG.ENDPOINTS[key]
  if (typeof endpoint === 'function') {
    return buildApiUrl(endpoint(...params))
  }
  return buildApiUrl(endpoint)
}
