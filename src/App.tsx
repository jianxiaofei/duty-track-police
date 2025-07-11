import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Clock, MapPin, CheckCircle, XCircle, Calendar, AlertTriangle, BarChart3, Download, Home, Settings } from 'lucide-react'
import Statistics from './components/Statistics'
import LocationMap from './components/LocationMap'
import ExportPanel from './components/ExportPanel'
import NotificationSystem from './components/NotificationSystem'
import SettingsPanel from './components/SettingsPanel'
import { themes, getTheme, applyTheme, type Theme } from './themes'

// 签到记录接口
interface CheckInRecord {
  id: string
  time: string
  location: string
  status: 'success' | 'failed'
  coordinates: { lat: number; lng: number }
}

// 通知接口
interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  duration?: number
}

// 模拟位置数据
const VALID_LOCATIONS = [
  { name: '上海监狱东门', lat: 31.23, lng: 121.47, range: 0.01 },
  { name: '上海监狱西门', lat: 31.22, lng: 121.46, range: 0.01 },
  { name: '监狱办公楼', lat: 31.235, lng: 121.475, range: 0.005 }
]

// 获取模拟GPS坐标
const getMockGPSLocation = (): { lat: number; lng: number } => {
  const isValid = Math.random() > 0.3
  
  if (isValid) {
    const validLocation = VALID_LOCATIONS[Math.floor(Math.random() * VALID_LOCATIONS.length)]
    return {
      lat: validLocation.lat + (Math.random() - 0.5) * validLocation.range,
      lng: validLocation.lng + (Math.random() - 0.5) * validLocation.range
    }
  } else {
    return {
      lat: 31.23 + (Math.random() - 0.5) * 0.1,
      lng: 121.47 + (Math.random() - 0.5) * 0.1
    }
  }
}

// 验证位置是否有效
const validateLocation = (coordinates: { lat: number; lng: number }): { isValid: boolean; locationName: string } => {
  for (const location of VALID_LOCATIONS) {
    const distance = Math.sqrt(
      Math.pow(coordinates.lat - location.lat, 2) + 
      Math.pow(coordinates.lng - location.lng, 2)
    )
    
    if (distance <= location.range) {
      return { isValid: true, locationName: location.name }
    }
  }
  
  return { isValid: false, locationName: '位置异常' }
}

// 格式化时间
const formatTime = (date: Date): string => {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

export default function App() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [checkInRecords, setCheckInRecords] = useState<CheckInRecord[]>([])
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  const [lastCheckInStatus, setLastCheckInStatus] = useState<'success' | 'failed' | null>(null)
  const [todayCheckInCount, setTodayCheckInCount] = useState(0)
  const [activeTab, setActiveTab] = useState<'home' | 'stats' | 'map' | 'export' | 'settings'>('home')
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isLocationValid, setIsLocationValid] = useState<boolean | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [autoCheckIn, setAutoCheckIn] = useState(false)
  const [checkInInterval, setCheckInInterval] = useState(4)
  const [currentTheme, setCurrentTheme] = useState<string>('prison-dark')

  // 实时更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // 从本地存储加载签到记录
  useEffect(() => {
    const savedRecords = localStorage.getItem('checkInRecords')
    if (savedRecords) {
      const records = JSON.parse(savedRecords)
      setCheckInRecords(records)
      
      const today = new Date().toDateString()
      const todayCount = records.filter((record: CheckInRecord) =>
        new Date(record.time).toDateString() === today && record.status === 'success'
      ).length
      setTodayCheckInCount(todayCount)
    }

    const savedSettings = localStorage.getItem('userSettings')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      setSoundEnabled(settings.soundEnabled ?? true)
      setDarkMode(settings.darkMode ?? true)
      setAutoCheckIn(settings.autoCheckIn ?? false)
      setCheckInInterval(settings.checkInInterval ?? 4)
      setCurrentTheme(settings.currentTheme ?? 'prison-dark')
    }
  }, [])

  // 初始化主题
  useEffect(() => {
    const theme = getTheme(currentTheme)
    applyTheme(theme)
  }, [currentTheme])

  // 添加通知
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString()
    }
    setNotifications(prev => [...prev, newNotification])
  }

  // 移除通知
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  // 播放声音
  const playSound = (type: 'success' | 'error' | 'warning') => {
    if (!soundEnabled) return
    
    try {
      const audioContext = new AudioContext()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      switch (type) {
        case 'success':
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
          oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1)
          break
        case 'error':
          oscillator.frequency.setValueAtTime(300, audioContext.currentTime)
          oscillator.frequency.setValueAtTime(200, audioContext.currentTime + 0.1)
          break
        case 'warning':
          oscillator.frequency.setValueAtTime(600, audioContext.currentTime)
          break
      }
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.2)
    } catch (error) {
      console.log('音频播放失败:', error)
    }
  }

  // 保存签到记录到本地存储
  const saveRecordsToStorage = (records: CheckInRecord[]) => {
    localStorage.setItem('checkInRecords', JSON.stringify(records))
  }

  // 执行签到
  const handleCheckIn = async () => {
    if (isCheckingIn) return

    setIsCheckingIn(true)
    setLastCheckInStatus(null)

    await new Promise(resolve => setTimeout(resolve, 1500))

    const now = new Date()
    const coordinates = getMockGPSLocation()
    const { isValid, locationName } = validateLocation(coordinates)

    setCurrentLocation(coordinates)
    setIsLocationValid(isValid)

    const newRecord: CheckInRecord = {
      id: Date.now().toString(),
      time: formatTime(now),
      location: locationName,
      status: isValid ? 'success' : 'failed',
      coordinates
    }

    const updatedRecords = [newRecord, ...checkInRecords]
    setCheckInRecords(updatedRecords)
    saveRecordsToStorage(updatedRecords)
    
    setLastCheckInStatus(newRecord.status)
    setIsCheckingIn(false)

    if (newRecord.status === 'success') {
      setTodayCheckInCount(prev => prev + 1)
    }

    // 添加通知和声音反馈
    if (isValid) {
      playSound('success')
      addNotification({
        type: 'success',
        title: '签到成功',
        message: `已在${locationName}成功签到`,
        duration: 5000
      })
    } else {
      playSound('error')
      addNotification({
        type: 'error',
        title: '签到失败',
        message: `位置异常，请在指定区域内签到`,
        duration: 5000
      })
    }

    setTimeout(() => {
      setLastCheckInStatus(null)
    }, 3000)
  }

  // 获取今日签到记录
  const getTodayRecords = () => {
    const today = new Date().toDateString()
    return checkInRecords.filter(record => 
      new Date(record.time).toDateString() === today
    )
  }

  const todayRecords = getTodayRecords()

  // 防重复签到逻辑
  const canCheckIn = () => {
    const now = new Date()
    const lastRecord = checkInRecords.find(record => 
      new Date(record.time).toDateString() === now.toDateString() &&
      record.status === 'success'
    )
    
    if (!lastRecord) return true
    
    const lastCheckInTime = new Date(lastRecord.time)
    const timeDiff = now.getTime() - lastCheckInTime.getTime()
    const hoursDiff = timeDiff / (1000 * 60 * 60)
    
    return hoursDiff >= checkInInterval
  }

  // 清除签到记录
  const handleClearRecords = () => {
    setCheckInRecords([])
    setTodayCheckInCount(0)
    localStorage.removeItem('checkInRecords')
    addNotification({
      type: 'info',
      title: '记录已清除',
      message: '所有签到记录已成功清除',
      duration: 3000
    })
  }

  // 导出设置
  const handleExportSettings = () => {
    addNotification({
      type: 'success',
      title: '设置已导出',
      message: '用户设置已成功导出到文件',
      duration: 3000
    })
  }

  // 导入设置
  const handleImportSettings = (settings: any) => {
    setSoundEnabled(settings.soundEnabled ?? true)
    setDarkMode(settings.darkMode ?? true)
    setAutoCheckIn(settings.autoCheckIn ?? false)
    setCheckInInterval(settings.checkInInterval ?? 4)
    localStorage.setItem('userSettings', JSON.stringify(settings))
    addNotification({
      type: 'success',
      title: '设置已导入',
      message: '用户设置已成功导入并应用',
      duration: 3000
    })
  }

  // 保存设置到本地存储
  const saveSettingsToStorage = () => {
    const settings = {
      soundEnabled,
      darkMode,
      autoCheckIn,
      checkInInterval,
      currentTheme
    }
    localStorage.setItem('userSettings', JSON.stringify(settings))
  }

  // 监听设置变化并保存
  useEffect(() => {
    saveSettingsToStorage()
  }, [soundEnabled, darkMode, autoCheckIn, checkInInterval, currentTheme])

  // 监听主题变化并提供反馈
  useEffect(() => {
    if (darkMode !== undefined) {
      // 只在非初始加载时显示通知
      const isInitialLoad = checkInRecords.length === 0 && notifications.length === 0
      if (!isInitialLoad) {
        addNotification({
          type: 'info',
          title: '主题已切换',
          message: `已切换到${darkMode ? '深色' : '浅色'}主题`,
          duration: 3000
        })
        
        if (soundEnabled) {
          playSound('warning')
        }
      }
    }
  }, [darkMode])

  // 渲染首页内容
  const renderHome = () => (
    <div className="space-y-4">
      {/* 实时时钟 */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-effect rounded-2xl p-4 text-center"
      >
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Clock className="w-4 h-4 text-blue-300" />
          <span className="text-blue-200 text-sm">当前时间</span>
        </div>
        <div className="text-xl font-mono text-white tracking-wide">
          {formatTime(currentTime)}
        </div>
      </motion.div>

      {/* 签到状态反馈 */}
      <AnimatePresence mode="wait">
        {lastCheckInStatus && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className={`glass-effect rounded-2xl p-3 ${
              lastCheckInStatus === 'success' ? 'ring-2 ring-green-400/50' : 'ring-2 ring-red-400/50'
            }`}
          >
            <div className="flex items-center space-x-3">
              {lastCheckInStatus === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-400 animate-pulse" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
              <div>
                <p className={`font-medium text-sm ${
                  lastCheckInStatus === 'success' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {lastCheckInStatus === 'success' ? '签到成功！' : '签到失败！'}
                </p>
                <p className="text-white/60 text-xs">
                  {lastCheckInStatus === 'success' ? '已记录本次签到' : '位置验证失败'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 签到按钮 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-2xl p-4"
      >
        <div className="text-center mb-3">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <MapPin className="w-4 h-4 text-purple-300" />
            <span className="text-purple-200 text-sm">今日签到状态</span>
          </div>
          <span className="text-lg font-semibold text-white">
            已签到 {todayCheckInCount} 次
          </span>
        </div>

        {!canCheckIn() && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-3 p-2 bg-yellow-500/20 rounded-lg border border-yellow-400/30"
          >
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-200 text-xs">
                签到冷却中，请{checkInInterval}小时后再试
              </span>
            </div>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: canCheckIn() ? 1.02 : 1 }}
          whileTap={{ scale: canCheckIn() ? 0.98 : 1 }}
          onClick={handleCheckIn}
          disabled={!canCheckIn() || isCheckingIn}
          className={`w-full py-3 rounded-xl font-semibold text-base transition-all duration-300 ${
            canCheckIn() && !isCheckingIn
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            {isCheckingIn ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                <span>正在签到...</span>
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4" />
                <span>立即签到</span>
              </>
            )}
          </div>
        </motion.button>
      </motion.div>

      {/* 今日签到记录 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-effect rounded-2xl p-4"
      >
        <div className="flex items-center space-x-2 mb-3">
          <Calendar className="w-4 h-4 text-green-300" />
          <span className="text-green-200 text-sm font-medium">今日签到记录</span>
        </div>
        
        {todayRecords.length === 0 ? (
          <p className="text-white/60 text-center py-3 text-sm">暂无签到记录</p>
        ) : (
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {todayRecords.slice(0, 3).map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-2 rounded-lg ${
                  record.status === 'success' 
                    ? 'bg-green-500/20 border border-green-400/30' 
                    : 'bg-red-500/20 border border-red-400/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {record.status === 'success' ? (
                      <CheckCircle className="w-3 h-3 text-green-400" />
                    ) : (
                      <XCircle className="w-3 h-3 text-red-400" />
                    )}
                    <span className={`text-xs font-medium ${
                      record.status === 'success' ? 'text-green-200' : 'text-red-200'
                    }`}>
                      {record.status === 'success' ? '签到成功' : '签到失败'}
                    </span>
                  </div>
                  <span className="text-white/60 text-xs">
                    {record.time.split(' ')[1]}
                  </span>
                </div>
                <p className="text-white/60 text-xs mt-1">{record.location}</p>
              </motion.div>
            ))}
            {todayRecords.length > 3 && (
              <p className="text-white/60 text-xs text-center">
                还有 {todayRecords.length - 3} 条记录...
              </p>
            )}
          </div>
        )}
      </motion.div>

      {/* 系统说明 */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-white/60 text-xs"
      >
        <p>系统会自动验证签到位置的有效性</p>
        <p className="mt-1">有效签到区域：监狱东门、西门、办公楼</p>
        <p className="mt-1 text-yellow-400/60">注：每{checkInInterval}小时可签到一次</p>
      </motion.div>
    </div>
  )

  return (
    <div className="device-container">
      <div className="device-frame">
        <div className="device-brand">POLICE SYSTEM v2.0</div>
        <div className="device-indicator"></div>
        <div className="device-ports">
          <div className="device-port"></div>
          <div className="device-port"></div>
          <div className="device-port"></div>
        </div>
        
        <div className="device-screen">
          <div className={`device-app-content theme-transition ${darkMode ? '' : 'light-theme'} h-full flex flex-col overflow-hidden relative`}>
            <div className="w-full h-full flex flex-col">
              {/* 导航栏 */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-effect rounded-2xl p-4 m-4 mb-0 flex-shrink-0"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-6 h-6 text-yellow-400" />
                    <span className="text-white font-bold hidden sm:block">狱警值班系统</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    {[
                      { key: 'home', icon: Home, label: '首页' },
                      { key: 'stats', icon: BarChart3, label: '统计' },
                      { key: 'map', icon: MapPin, label: '位置' },
                      { key: 'export', icon: Download, label: '导出' },
                      { key: 'settings', icon: Settings, label: '设置' }
                    ].map(({ key, icon: Icon, label }) => (
                      <motion.button
                        key={key}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab(key as typeof activeTab)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          activeTab === key 
                            ? 'bg-blue-500 text-white shadow-lg' 
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center space-x-1">
                          <Icon className="w-4 h-4" />
                          <span className="hidden sm:block">{label}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* 主要内容区域 */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 overflow-hidden p-4 pt-4"
              >
                <div className="h-full overflow-y-auto">
                  {activeTab === 'home' && (
                    <div className="max-w-md mx-auto">
                      {renderHome()}
                    </div>
                  )}
                  
                  {activeTab === 'stats' && (
                    <div className="max-w-2xl mx-auto">
                      <Statistics records={checkInRecords} />
                    </div>
                  )}
                  
                  {activeTab === 'map' && (
                    <div className="max-w-2xl mx-auto">
                      <LocationMap 
                        currentLocation={currentLocation ?? undefined} 
                        isValid={isLocationValid ?? undefined} 
                      />
                    </div>
                  )}
                  
                  {activeTab === 'export' && (
                    <div className="max-w-2xl mx-auto">
                      <ExportPanel records={checkInRecords} />
                    </div>
                  )}

                  {activeTab === 'settings' && (
                    <div className="max-w-2xl mx-auto">
                      <SettingsPanel 
                        soundEnabled={soundEnabled}
                        setSoundEnabled={setSoundEnabled}
                        darkMode={darkMode}
                        setDarkMode={setDarkMode}
                        autoCheckIn={autoCheckIn}
                        setAutoCheckIn={setAutoCheckIn}
                        checkInInterval={checkInInterval}
                        setCheckInInterval={setCheckInInterval}
                        currentTheme={currentTheme}
                        setCurrentTheme={setCurrentTheme}
                        onClearRecords={handleClearRecords}
                        onExportSettings={handleExportSettings}
                        onImportSettings={handleImportSettings}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* 通知系统 */}
            <NotificationSystem 
              notifications={notifications}
              onRemove={removeNotification}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
