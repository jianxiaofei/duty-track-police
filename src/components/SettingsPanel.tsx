import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings, Trash2, RefreshCw, Save, Volume2, VolumeX, Moon, Sun, Clock, Palette } from 'lucide-react'
import { themes, type Theme } from '../themes'

interface SettingsPanelProps {
  soundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
  darkMode: boolean
  setDarkMode: (enabled: boolean) => void
  autoCheckIn: boolean
  setAutoCheckIn: (enabled: boolean) => void
  checkInInterval: number
  setCheckInInterval: (interval: number) => void
  currentTheme: string
  setCurrentTheme: (themeId: string) => void
  onClearRecords: () => void
  onExportSettings: () => void
  onImportSettings: (settings: any) => void
}

export default function SettingsPanel({ 
  soundEnabled, setSoundEnabled,
  darkMode, setDarkMode,
  autoCheckIn, setAutoCheckIn,
  checkInInterval, setCheckInInterval,
  currentTheme, setCurrentTheme,
  onClearRecords, onExportSettings, onImportSettings 
}: SettingsPanelProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // 检测移动端设备
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      setIsMobile(isMobileDevice)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    window.addEventListener('orientationchange', () => {
      setTimeout(checkMobile, 100)
    })
    
    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('orientationchange', checkMobile)
    }
  }, [])

  const handleClearRecords = () => {
    if (showConfirmDialog) {
      onClearRecords()
      setShowConfirmDialog(false)
    } else {
      setShowConfirmDialog(true)
      setTimeout(() => setShowConfirmDialog(false), 3000)
    }
  }

  const handleExportSettings = () => {
    const settings = {
      soundEnabled,
      darkMode,
      autoCheckIn,
      checkInInterval,
      currentTheme
    }
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'duty-tracker-settings.json'
    link.click()
    URL.revokeObjectURL(url)
    onExportSettings()
  }

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string)
          setSoundEnabled(importedSettings.soundEnabled ?? true)
          setDarkMode(importedSettings.darkMode ?? true)
          setAutoCheckIn(importedSettings.autoCheckIn ?? false)
          setCheckInInterval(importedSettings.checkInInterval ?? 4)
          onImportSettings(importedSettings)
        } catch (error) {
          console.error('Failed to import settings:', error)
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: {
          type: "spring",
          damping: 20,
          stiffness: 300,
          staggerChildren: 0.1
        }
      }}
      className="glass-effect rounded-2xl p-6 space-y-6 settings-panel"
    >
      <div className="flex items-center space-x-3 mb-6">
        <Settings className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-bold text-white">系统设置</h2>
      </div>

      {/* 基础设置 */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-white mb-3">基础设置</h3>
        
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between glass-effect rounded-xl p-4 hover:scale-102 transition-transform"
          >
            <div className="flex items-center space-x-3">
              {soundEnabled ? <Volume2 className="w-5 h-5 text-blue-400" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
              <div>
                <div className="text-white font-medium">声音提醒</div>
                <div className="text-white/60 text-sm">签到成功或失败时播放提示音</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="sr-only peer toggle-switch"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between glass-effect rounded-xl p-4 hover:scale-102 transition-transform"
          >
            <div className="flex items-center space-x-3">
              {darkMode ? <Moon className="w-5 h-5 text-blue-400" /> : <Sun className="w-5 h-5 text-yellow-400" />}
              <div>
                <div className="text-white font-medium">深色模式</div>
                <div className="text-white/60 text-sm">使用深色主题界面</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="sr-only peer toggle-switch"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-effect rounded-xl p-4 hover:scale-102 transition-transform"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <RefreshCw className="w-5 h-5 text-green-400" />
                <div>
                  <div className="text-white font-medium">自动签到提醒</div>
                  <div className="text-white/60 text-sm">到达指定时间自动提醒签到</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoCheckIn}
                  onChange={(e) => setAutoCheckIn(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            {autoCheckIn && (
              <div className="mt-4">
                <div className="text-center text-white/60 text-sm">
                  每 {checkInInterval} 小时提醒一次
                </div>
              </div>
            )}
          </motion.div>

          {/* 签到间隔设置 */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
            className="glass-effect rounded-xl p-4 hover:scale-102 transition-transform"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-white font-medium">签到间隔设置</div>
                <div className="text-white/60 text-sm">设置成功签到后的冷却时间</div>
              </div>
            </div>
            
            <div>
              <label className="block text-white/80 text-sm mb-2">冷却时间 (小时)</label>
              <input
                type="range"
                min="1"
                max="12"
                value={checkInInterval}
                onChange={(e) => setCheckInInterval(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="text-center text-white/60 text-sm mt-2">
                当前设置：每 {checkInInterval} 小时可签到一次
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* 主题设置 */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.35 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-white mb-3">主题设置</h3>
        
        <div className="glass-effect rounded-xl p-4">
          <div className="flex items-center space-x-3 mb-4">
            <Palette className="w-5 h-5 text-purple-400" />
            <div>
              <div className="text-white font-medium">界面主题</div>
              <div className="text-white/60 text-sm">选择适合的界面风格</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {themes.map((theme) => (
              <motion.button
                key={theme.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentTheme(theme.id)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  currentTheme === theme.id
                    ? 'border-purple-400 bg-purple-400/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-6 h-6 rounded-full"
                    style={{ 
                      background: `linear-gradient(45deg, ${theme.colors.primary}, ${theme.colors.secondary})` 
                    }}
                  />
                  <div className="flex-1">
                    <div className="text-white font-medium text-sm">{theme.name}</div>
                    <div className="text-white/60 text-xs">{theme.description}</div>
                  </div>
                  {currentTheme === theme.id && (
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 数据管理 */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-white mb-3">数据管理</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportSettings}
            className="glass-effect rounded-xl p-4 border border-white/10 hover:border-blue-400/30 transition-all duration-300 group"
          >
            <div className="flex items-center space-x-3">
              <Save className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
              <div className="text-left">
                <div className="text-white font-medium text-sm">导出设置</div>
                <div className="text-white/60 text-xs">备份当前设置</div>
              </div>
            </div>
          </motion.button>

          <motion.label
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass-effect rounded-xl p-4 border border-white/10 hover:border-green-400/30 transition-all duration-300 group cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <RefreshCw className="w-5 h-5 text-green-400 group-hover:text-green-300" />
              <div className="text-left">
                <div className="text-white font-medium text-sm">导入设置</div>
                <div className="text-white/60 text-xs">恢复备份设置</div>
              </div>
            </div>
            <input
              type="file"
              accept=".json"
              onChange={handleImportSettings}
              className="hidden"
            />
          </motion.label>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleClearRecords}
          className={`w-full glass-effect rounded-xl p-4 border transition-all duration-300 ${
            showConfirmDialog 
              ? 'border-red-400/50 bg-red-500/20' 
              : 'border-white/10 hover:border-red-400/30'
          }`}
        >
          <div className="flex items-center justify-center space-x-3">
            <Trash2 className={`w-5 h-5 ${showConfirmDialog ? 'text-red-300' : 'text-red-400'}`} />
            <div className="text-left">
              <div className={`font-medium text-sm ${showConfirmDialog ? 'text-red-300' : 'text-white'}`}>
                {showConfirmDialog ? '确认删除所有记录？' : '清空签到记录'}
              </div>
              <div className="text-white/60 text-xs">
                {showConfirmDialog ? '再次点击确认删除' : '删除所有历史签到记录'}
              </div>
            </div>
          </div>
        </motion.button>
      </motion.div>

      {/* 版本信息 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-effect rounded-xl p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20"
      >
        <div className="text-center">
          <div className="text-white font-medium text-sm mb-1">狱警值班签到系统</div>
          <div className="text-white/60 text-xs">版本 1.0.0</div>
          <div className="text-white/60 text-xs mt-2">© 2025 监狱管理系统</div>
        </div>
      </motion.div>
    </motion.div>
  )
}
