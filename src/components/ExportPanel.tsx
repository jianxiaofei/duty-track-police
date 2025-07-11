import { Download, FileText, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'

interface CheckInRecord {
  id: string
  time: string
  location: string
  status: 'success' | 'failed'
  coordinates: { lat: number; lng: number }
}

interface ExportPanelProps {
  records: CheckInRecord[]
}

export default function ExportPanel({ records }: ExportPanelProps) {
  // 导出为CSV格式
  const exportToCSV = () => {
    if (records.length === 0) {
      alert('暂无签到记录可导出')
      return
    }

    const headers = ['序号', '签到时间', '签到位置', '签到状态', '经度', '纬度']
    const csvContent = [
      headers.join(','),
      ...records.map((record, index) => [
        index + 1,
        `"${record.time}"`,
        `"${record.location}"`,
        record.status === 'success' ? '成功' : '失败',
        record.coordinates.lng,
        record.coordinates.lat
      ].join(','))
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `狱警签到记录_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  // 导出今日记录
  const exportTodayRecords = () => {
    const today = new Date().toDateString()
    const todayRecords = records.filter(record => 
      new Date(record.time).toDateString() === today
    )

    if (todayRecords.length === 0) {
      alert('今日暂无签到记录')
      return
    }

    const headers = ['序号', '签到时间', '签到位置', '签到状态', '经度', '纬度']
    const csvContent = [
      headers.join(','),
      ...todayRecords.map((record, index) => [
        index + 1,
        `"${record.time}"`,
        `"${record.location}"`,
        record.status === 'success' ? '成功' : '失败',
        record.coordinates.lng,
        record.coordinates.lat
      ].join(','))
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `今日签到记录_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  // 生成统计报告
  const exportReport = () => {
    const totalRecords = records.length
    const successCount = records.filter(r => r.status === 'success').length
    const failedCount = totalRecords - successCount
    const successRate = totalRecords > 0 ? ((successCount / totalRecords) * 100).toFixed(1) : '0'

    // 按日期统计
    const dailyStats: { [key: string]: { success: number; failed: number } } = {}
    records.forEach(record => {
      const date = new Date(record.time).toDateString()
      if (!dailyStats[date]) {
        dailyStats[date] = { success: 0, failed: 0 }
      }
      dailyStats[date][record.status]++
    })

    const reportContent = `
狱警值班签到统计报告
生成时间：${new Date().toLocaleString('zh-CN')}

=== 总体统计 ===
总签到次数：${totalRecords}
成功签到：${successCount} 次
失败签到：${failedCount} 次
成功率：${successRate}%

=== 按日期统计 ===
${Object.entries(dailyStats)
  .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
  .map(([date, stats]) => 
    `${new Date(date).toLocaleDateString('zh-CN')}：成功 ${stats.success} 次，失败 ${stats.failed} 次`
  ).join('\n')}

=== 详细记录 ===
${records
  .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
  .map((record, index) => 
    `${index + 1}. ${record.time} - ${record.location} - ${record.status === 'success' ? '成功' : '失败'}`
  ).join('\n')}
    `.trim()

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `签到统计报告_${new Date().toISOString().split('T')[0]}.txt`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-2xl p-6"
    >
      <div className="flex items-center space-x-3 mb-4">
        <Download className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-bold text-white">数据导出</h2>
      </div>

      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={exportTodayRecords}
          className="w-full glass-effect rounded-xl p-4 border border-white/10 hover:border-blue-400/30 transition-all duration-300 group"
        >
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
            <div className="text-left flex-1">
              <div className="text-white font-medium">导出今日记录</div>
              <div className="text-white/60 text-sm">CSV格式，包含今日所有签到记录</div>
            </div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={exportToCSV}
          className="w-full glass-effect rounded-xl p-4 border border-white/10 hover:border-green-400/30 transition-all duration-300 group"
        >
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-green-400 group-hover:text-green-300" />
            <div className="text-left flex-1">
              <div className="text-white font-medium">导出全部记录</div>
              <div className="text-white/60 text-sm">CSV格式，包含所有历史签到记录</div>
            </div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={exportReport}
          className="w-full glass-effect rounded-xl p-4 border border-white/10 hover:border-purple-400/30 transition-all duration-300 group"
        >
          <div className="flex items-center space-x-3">
            <Download className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
            <div className="text-left flex-1">
              <div className="text-white font-medium">生成统计报告</div>
              <div className="text-white/60 text-sm">文本格式，包含详细统计信息</div>
            </div>
          </div>
        </motion.button>
      </div>

      <div className="mt-4 p-3 glass-effect rounded-lg border border-yellow-400/20 bg-yellow-400/5">
        <div className="text-yellow-300 text-sm">
          <div className="font-medium mb-1">📊 导出说明</div>
          <div className="text-xs text-yellow-300/80 space-y-1">
            <div>• CSV文件可在Excel中打开查看</div>
            <div>• 报告文件包含详细统计分析</div>
            <div>• 支持导出今日或全部记录</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
