// Utilidades para el sistema de notificaciones

/**
 * Muestra una notificación
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de notificación (success, error, warning, info)
 * @param {number} duration - Duración en milisegundos (0 = sin auto-cierre)
 */
export const showNotification = (message, type = 'info', duration = 5000) => {
  if (typeof window !== 'undefined' && window.showNotification) {
    window.showNotification(message, type, duration)
  } else {
    // Fallback para cuando el sistema de notificaciones no está disponible
    console.log(`[${type.toUpperCase()}] ${message}`)
  }
}

/**
 * Notificación de éxito
 */
export const showSuccess = (message, duration = 5000) => {
  showNotification(message, 'success', duration)
}

/**
 * Notificación de error
 */
export const showError = (message, duration = 8000) => {
  showNotification(message, 'error', duration)
}

/**
 * Notificación de advertencia
 */
export const showWarning = (message, duration = 6000) => {
  showNotification(message, 'warning', duration)
}

/**
 * Notificación informativa
 */
export const showInfo = (message, duration = 5000) => {
  showNotification(message, 'info', duration)
}

/**
 * Notificación persistente (sin auto-cierre)
 */
export const showPersistent = (message, type = 'info') => {
  showNotification(message, type, 0)
}
