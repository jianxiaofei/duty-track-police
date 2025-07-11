import { MapPin, Navigation, CheckCircle, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'

interface LocationMapProps {
  currentLocation?: { lat: number; lng: number }
  isValid?: boolean
}

const VALID_LOCATIONS = [
  { name: '上海监狱东门', lat: 31.23, lng: 121.47, range: 0.01 },
  { name: '上海监狱西门', lat: 31.22, lng: 121.46, range: 0.01 },
  { name: '监狱办公楼', lat: 31.235, lng: 121.475, range: 0.005 }
]

export default function LocationMap({ currentLocation, isValid }: LocationMapProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-effect rounded-2xl p-6"
    >
      <div className="flex items-center space-x-3 mb-4">
        <Navigation className="w-6 h-6 text-green-400" />
        <h2 className="text-xl font-bold text-white">位置信息</h2>
      </div>

      {/* 当前位置显示 */}
      {currentLocation && (
        <div className="glass-effect rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80 text-sm">当前位置</span>
            {isValid !== undefined && (
              <div className="flex items-center space-x-1">
                {isValid ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-xs">有效位置</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 text-xs">位置异常</span>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="text-white font-mono text-sm">
            经度: {currentLocation.lng.toFixed(6)}°<br />
            纬度: {currentLocation.lat.toFixed(6)}°
          </div>
        </div>
      )}

      {/* 有效位置列表 */}
      <div className="space-y-3">
        <h3 className="text-white font-semibold text-sm">授权签到区域</h3>
        {VALID_LOCATIONS.map((location, index) => (
          <motion.div
            key={location.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-effect rounded-lg p-3 border border-white/10"
          >
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-white font-medium text-sm">{location.name}</div>
                <div className="text-white/60 text-xs font-mono">
                  {location.lng.toFixed(3)}°, {location.lat.toFixed(3)}°
                </div>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 简化地图示意图 */}
      <div className="mt-6 glass-effect rounded-xl p-4 bg-gradient-to-br from-blue-900/20 to-purple-900/20">
        <div className="text-center text-white/80 text-xs mb-3">位置示意图</div>
        <div className="relative h-32 bg-gradient-to-br from-green-900/30 to-blue-900/30 rounded-lg overflow-hidden">
          {/* 背景网格 */}
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="absolute border-white/10" 
                style={{ 
                  left: `${i * 12.5}%`, 
                  top: 0, 
                  width: '1px', 
                  height: '100%',
                  borderLeft: '1px solid currentColor'
                }} 
              />
            ))}
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="absolute border-white/10" 
                style={{ 
                  top: `${i * 16.67}%`, 
                  left: 0, 
                  height: '1px', 
                  width: '100%',
                  borderTop: '1px solid currentColor'
                }} 
              />
            ))}
          </div>
          
          {/* 有效位置点 */}
          {VALID_LOCATIONS.map((location, index) => {
            const x = ((location.lng - 121.45) / 0.04) * 100
            const y = ((31.25 - location.lat) / 0.04) * 100
            
            return (
              <motion.div
                key={location.name}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.2 }}
                className="absolute w-3 h-3 bg-green-400 rounded-full shadow-lg"
                style={{ 
                  left: `${Math.max(0, Math.min(94, x))}%`, 
                  top: `${Math.max(0, Math.min(88, y))}%`,
                  boxShadow: '0 0 10px rgba(34, 197, 94, 0.6)'
                }}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-white/80 whitespace-nowrap">
                  {location.name.split('监狱')[1] || location.name}
                </div>
              </motion.div>
            )
          })}
          
          {/* 当前位置 */}
          {currentLocation && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`absolute w-4 h-4 rounded-full ${
                isValid ? 'bg-blue-400' : 'bg-red-400'
              } shadow-lg`}
              style={{ 
                left: `${Math.max(0, Math.min(92, ((currentLocation.lng - 121.45) / 0.04) * 100))}%`, 
                top: `${Math.max(0, Math.min(84, ((31.25 - currentLocation.lat) / 0.04) * 100))}%`,
                boxShadow: `0 0 15px ${isValid ? 'rgba(59, 130, 246, 0.8)' : 'rgba(239, 68, 68, 0.8)'}`
              }}
            >
              <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 text-xs text-white font-medium whitespace-nowrap">
                当前位置
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
