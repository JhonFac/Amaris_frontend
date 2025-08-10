import { useEffect } from 'react'

function Notification({ message, type, onClose, duration = 5000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      case 'info':
        return 'ℹ️'
      default:
        return '📢'
    }
  }

  const getTypeClass = () => {
    switch (type) {
      case 'success':
        return 'notification-success'
      case 'error':
        return 'notification-error'
      case 'warning':
        return 'notification-warning'
      case 'info':
        return 'notification-info'
      default:
        return 'notification-default'
    }
  }

  return (
    <div className={`notification ${getTypeClass()}`}>
      <div className="notification-content">
        <span className="notification-icon">{getIcon()}</span>
        <span className="notification-message">{message}</span>
      </div>
      <button className="notification-close" onClick={onClose}>
        ✕
      </button>
    </div>
  )
}

export default Notification
