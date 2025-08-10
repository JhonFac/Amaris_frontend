import { useState, useCallback } from 'react'
import Notification from './Notification'

function NotificationContainer() {
  const [notifications, setNotifications] = useState([])

  const addNotification = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random()
    const newNotification = { id, message, type, duration }
    
    setNotifications(prev => [...prev, newNotification])
    
    return id
  }, [])

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  // Exponer la función para que otros componentes puedan usarla
  if (typeof window !== 'undefined') {
    window.showNotification = addNotification
  }

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  )
}

export default NotificationContainer
