import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Calendar, Award, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface CheckInRecord {
  id: string
  time: string
  location: string  
  status: 'success' | 'failed'
  coordinates: { lat: number; lng: number }
}

interface StatisticsProps {
  records: CheckInRecord[]
}

export default function Statistics({ records }: StatisticsProps) {
  const [weeklyStats, setWeeklyStats] = useState<number[]>([])
  const [monthlyStats, setMonthlyStats] = useState<number[]>([])
  const [monthlySuccess, setMonthlySuccess] = useState(0)
  const [totalCheckIns, setTotalCheckIns] = useState(0)
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isMobile, setIsMobile] = useState(false)

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

  useEffect(() => {
    const now = new Date()
    
    // 计算本周每日签到统计
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - now.getDay())
    weekStart.setHours(0, 0, 0, 0)

    const dailyStats = Array(7).fill(0)
    
    records.forEach(record => {
      const recordDate = new Date(record.time)
      if (recordDate >= weekStart && record.status === 'success') {
        const dayIndex = recordDate.getDay()
        dailyStats[dayIndex]++
      }
    })

    setWeeklyStats(dailyStats)

    // 计算选定月份的每日签到统计
    const selectedYear = selectedDate.getFullYear()
    const selectedMonth = selectedDate.getMonth()
    const monthStart = new Date(selectedYear, selectedMonth, 1)
    const monthEnd = new Date(selectedYear, selectedMonth + 1, 0)
    const daysInMonth = monthEnd.getDate()
    
    const monthlyDailyStats = Array(daysInMonth).fill(0)
    
    records.forEach(record => {
      const recordDate = new Date(record.time)
      if (recordDate >= monthStart && recordDate <= monthEnd && record.status === 'success') {
        const dayOfMonth = recordDate.getDate() - 1 // 0-based index
        if (dayOfMonth >= 0 && dayOfMonth < daysInMonth) {
          monthlyDailyStats[dayOfMonth]++
        }
      }
    })

    setMonthlyStats(monthlyDailyStats)

    // 计算选定月份的成功签到率
    const monthRecords = records.filter(record => {
      const recordDate = new Date(record.time)
      return recordDate >= monthStart && recordDate <= monthEnd
    })
    const successCount = monthRecords.filter(record => record.status === 'success').length
    const successRate = monthRecords.length > 0 ? (successCount / monthRecords.length) * 100 : 0
    
    setMonthlySuccess(Math.round(successRate))
    setTotalCheckIns(records.length)
  }, [records, selectedDate])

  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const maxWeeklyCount = Math.max(...weeklyStats, 1)

  // 月份切换函数
  const goToPreviousMonth = () => {
    setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const goToCurrentMonth = () => {
    setSelectedDate(new Date())
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-effect rounded-2xl space-y-6 ${isMobile ? 'p-4' : 'p-6'}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <BarChart3 className={`text-blue-300 ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
          <h2 className={`font-bold text-white ${isMobile ? 'text-lg' : 'text-xl'}`}>签到统计</h2>
        </div>
        
        {/* 视图切换按钮 */}
        <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-1">
          <button
            onClick={() => setViewMode('week')}
            className={`rounded-md font-medium transition-all duration-200 ${
              isMobile ? 'px-3 py-2 text-sm' : 'px-3 py-1 text-xs'
            } ${
              viewMode === 'week' 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            周视图
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`rounded-md font-medium transition-all duration-200 ${
              isMobile ? 'px-3 py-2 text-sm' : 'px-3 py-1 text-xs'
            } ${
              viewMode === 'month' 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            月视图
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
        <div className={`glass-effect rounded-xl text-center ${isMobile ? 'p-6' : 'p-4'}`}>
          <Calendar className={`text-blue-400 mx-auto mb-2 ${isMobile ? 'w-8 h-8' : 'w-6 h-6'}`} />
          <div className={`font-bold text-white ${isMobile ? 'text-3xl' : 'text-2xl'}`}>{totalCheckIns}</div>
          <div className={`text-white/70 ${isMobile ? 'text-sm' : 'text-xs'}`}>总签到次数</div>
        </div>
        
        <div className={`glass-effect rounded-xl text-center ${isMobile ? 'p-6' : 'p-4'}`}>
          <TrendingUp className={`text-green-400 mx-auto mb-2 ${isMobile ? 'w-8 h-8' : 'w-6 h-6'}`} />
          <div className={`font-bold text-white ${isMobile ? 'text-3xl' : 'text-2xl'}`}>{monthlySuccess}%</div>
          <div className={`text-white/70 ${isMobile ? 'text-sm' : 'text-xs'}`}>本月成功率</div>
        </div>
        
        <div className={`glass-effect rounded-xl text-center ${isMobile ? 'p-6' : 'p-4'}`}>
          <Award className={`text-yellow-400 mx-auto mb-2 ${isMobile ? 'w-8 h-8' : 'w-6 h-6'}`} />
          <div className={`font-bold text-white ${isMobile ? 'text-3xl' : 'text-2xl'}`}>
            {viewMode === 'week' 
              ? weeklyStats.reduce((a, b) => a + b, 0)
              : monthlyStats.reduce((a, b) => a + b, 0)
            }
          </div>
          <div className={`text-white/70 ${isMobile ? 'text-sm' : 'text-xs'}`}>
            {viewMode === 'week' ? '本周签到' : '本月签到'}
          </div>
        </div>
      </div>

      {/* 签到图表 */}
      <div className="space-y-3">
        <h3 className="text-white font-semibold text-sm">
          {viewMode === 'week' ? '本周签到分布' : '本月签到日历'}
        </h3>
        
        {viewMode === 'week' ? (
          <div className="space-y-2">
            {weekDays.map((day, index) => (
              <div key={day} className="flex items-center space-x-3">
                <div className="w-8 text-xs text-white/70">{day}</div>
                <div className="flex-1 bg-white/10 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(weeklyStats[index] / maxWeeklyCount) * 100}%` }}
                    transition={{ delay: index * 0.1, duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                  />
                </div>
                <div className="w-6 text-xs text-white/70 text-right">{weeklyStats[index]}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {/* 月份导航 */}
            <div className="flex items-center justify-between">
              <button
                onClick={goToPreviousMonth}
                className="p-1 rounded-md hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-white/70" />
              </button>
              
              <button
                onClick={goToCurrentMonth}
                className="text-center text-white/90 font-medium text-sm hover:text-white transition-colors"
              >
                {selectedDate.getFullYear()}年{selectedDate.getMonth() + 1}月
              </button>
              
              <button
                onClick={goToNextMonth}
                className="p-1 rounded-md hover:bg-white/10 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-white/70" />
              </button>
            </div>
            
            {/* 星期标题 */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['日', '一', '二', '三', '四', '五', '六'].map(day => (
                <div key={day} className="text-center text-xs text-white/50 py-1">
                  {day}
                </div>
              ))}
            </div>
            
            {/* 日历网格 */}
            <div className="grid grid-cols-7 gap-1">
              {(() => {
                const now = new Date()
                const year = selectedDate.getFullYear()
                const month = selectedDate.getMonth()
                const today = now.getDate()
                const isCurrentMonth = year === now.getFullYear() && month === now.getMonth()
                
                // 获取本月第一天是星期几
                const firstDay = new Date(year, month, 1).getDay()
                // 获取本月天数
                const daysInMonth = new Date(year, month + 1, 0).getDate()
                
                const calendarDays = []
                
                // 添加空白格子（上个月的日期）
                for (let i = 0; i < firstDay; i++) {
                  calendarDays.push(
                    <div key={`empty-${i}`} className="h-8"></div>
                  )
                }
                
                // 添加本月的日期
                for (let day = 1; day <= daysInMonth; day++) {
                  const checkInCount = monthlyStats[day - 1] || 0
                  const isToday = isCurrentMonth && day === today
                  const hasCheckIn = checkInCount > 0
                  
                  // 根据签到次数确定颜色强度
                  const getIntensity = (count: number) => {
                    if (count === 0) return 'bg-white/10'
                    if (count === 1) return 'bg-green-400/40'
                    if (count === 2) return 'bg-green-400/70'
                    return 'bg-green-400'
                  }
                  
                  calendarDays.push(
                    <motion.div
                      key={day}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: day * 0.01, duration: 0.3 }}
                      className={`
                        h-8 rounded-md flex items-center justify-center text-xs relative
                        ${getIntensity(checkInCount)}
                        ${isToday ? 'ring-2 ring-blue-400 ring-opacity-60' : ''}
                        ${hasCheckIn ? 'text-white font-medium' : 'text-white/60'}
                        hover:scale-110 transition-transform cursor-pointer
                        group
                      `}
                      title={`${month + 1}月${day}日 - ${checkInCount}次签到`}
                    >
                      <div>
                        <span className="text-xs">{day}</span>
                        {checkInCount > 0 && (
                          <div className="absolute top-0 right-3 bg-yellow-400 text-black text-[8px] font-bold rounded-full w-3 h-3 flex items-center justify-center leading-none">
                            {checkInCount}
                          </div>
                        )}
                      </div>
                      
                      {/* 今天标识 */}
                      {isToday && (
                        <div className="absolute -bottom-0.5 w-1 h-1 bg-blue-400 rounded-full"></div>
                      )}
                      
                      {/* 悬停提示 */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border border-white/20">
                        {month + 1}月{day}日: {checkInCount}次签到
                      </div>
                    </motion.div>
                  )
                }
                
                return calendarDays
              })()}
            </div>
            
            {/* 图例 */}
            <div className="flex items-center justify-center space-x-3 mt-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-white/10 rounded"></div>
                <span className="text-white/60">无</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400/40 rounded"></div>
                <span className="text-white/60">1次</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400/70 rounded"></div>
                <span className="text-white/60">2次</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded"></div>
                <span className="text-white/60">3次+</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
