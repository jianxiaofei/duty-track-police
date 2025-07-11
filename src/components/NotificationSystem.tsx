import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  duration?: number
}

interface NotificationSystemProps {
  notifications: Notification[]
  onRemove: (id: string) => void
}

const NotificationItem = ({ notification, onRemove }: { notification: Notification; onRemove: (id: string) => void }) => {
  const { id, type, title, message, duration = 5000 } = notification
  const [isMobile, setIsMobile] = useState(false)

  const handleRemove = useCallback(() => {
    onRemove(id)
  }, [id, onRemove])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(handleRemove, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, handleRemove])

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />
      case 'error': return <XCircle className="w-5 h-5 text-red-400" />
      default: return <Info className="w-5 h-5 text-blue-400" />
    }
  }

  const getColors = () => {
    switch (type) {
      case 'success': return 'bg-green-500/20 border-green-400/30'
      case 'warning': return 'bg-yellow-500/20 border-yellow-400/30'
      case 'error': return 'bg-red-500/20 border-red-400/30'
      default: return 'bg-blue-500/20 border-blue-400/30'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        x: 0, 
        scale: 1,
        transition: {
          type: "spring",
          damping: 25,
          stiffness: 400,
          duration: 0.4
        }
      }}
      exit={{ 
        opacity: 0, 
        x: 300, 
        scale: 0.95,
        transition: { 
          duration: 0.2,
          ease: "easeIn"
        } 
      }}
      className={`glass-effect rounded-lg border ${getColors()} w-full shadow-lg notification-enter ${
        isMobile ? 'p-4' : 'p-3'
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold text-white ${isMobile ? 'text-base' : 'text-sm'}`}>{title}</h4>
          <p className={`text-white/70 mt-1 break-words ${isMobile ? 'text-sm' : 'text-xs'}`}>{message}</p>
        </div>
        <button
          onClick={handleRemove}
          className={`flex-shrink-0 text-white/50 hover:text-white transition-colors ${
            isMobile ? 'p-1' : ''
          }`}
        >
          <X className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
        </button>
      </div>
    </motion.div>
  )
}

export default function NotificationSystem({ notifications, onRemove }: NotificationSystemProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className={`absolute z-50 space-y-2 ${
      isMobile 
        ? 'top-2 left-2 right-2 max-w-none' 
        : 'top-4 right-4 max-w-xs'
    }`}>
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRemove={onRemove}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Hook for managing notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString()
    setNotifications(prev => [...prev, { ...notification, id }])
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const showSuccess = (title: string, message: string) => {
    addNotification({ type: 'success', title, message })
  }

  const showError = (title: string, message: string) => {
    addNotification({ type: 'error', title, message })
  }

  const showWarning = (title: string, message: string) => {
    addNotification({ type: 'warning', title, message })
  }

  const showInfo = (title: string, message: string) => {
    addNotification({ type: 'info', title, message })
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}
