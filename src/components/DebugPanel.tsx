import { useState, useEffect, useMemo } from 'react'
import { useRecipeContext } from '../context/RecipeContext'
import { logger, LogLevel } from '../utils/logger'
import { ChevronDown, Trash2, Download, Search } from 'lucide-react'

interface DebugPanelProps {
  isVisible: boolean
  onToggle: () => void
}

const DebugPanel: React.FC<DebugPanelProps> = ({ isVisible, onToggle }) => {
  const { state } = useRecipeContext()
  const [activeTab, setActiveTab] = useState<'logs' | 'state' | 'performance'>('logs')
  const [logLevel, setLogLevel] = useState<LogLevel>(LogLevel.DEBUG)
  const [searchQuery, setSearchQuery] = useState('')
  const [showTimestamps, setShowTimestamps] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Auto-refresh logs
  useEffect(() => {
    if (!autoRefresh || !isVisible) return

    const interval = setInterval(() => {
      // Force re-render för att visa nya loggar
      setSearchQuery(prev => prev)
    }, 1000)

    return () => clearInterval(interval)
  }, [autoRefresh, isVisible])

  // Filtrera loggar baserat på nivå och sökfråga
  const filteredLogs = useMemo(() => {
    let logs = logger.getLogsByLevel(logLevel)
    
    if (searchQuery.trim()) {
      logs = logger.searchLogs(searchQuery)
    }
    
    return logs.slice(-100) // Visa endast de senaste 100 loggarna
  }, [logLevel, searchQuery, autoRefresh])

  // Prestanda-statistik
  const performanceStats = useMemo(() => {
    const logs = logger.getLogsByContext('Performance')
    const totalOperations = logs.length
    const avgDuration = logs.length > 0 
      ? logs.reduce((sum, log) => sum + (log.data?.duration || 0), 0) / logs.length 
      : 0
    
    return { totalOperations, avgDuration: Math.round(avgDuration) }
  }, [autoRefresh])

  const handleClearLogs = () => {
    logger.clearLogs()
    setSearchQuery('')
  }

  const handleExportLogs = () => {
    const logs = logger.exportLogs()
    const blob = new Blob([logs], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mealwise-logs-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('sv-SE', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getLogLevelColor = (level: LogLevel) => {
    switch (level) {
      case LogLevel.DEBUG: return 'text-blue-600 bg-blue-100'
      case LogLevel.INFO: return 'text-green-600 bg-green-100'
      case LogLevel.WARN: return 'text-yellow-600 bg-yellow-100'
      case LogLevel.ERROR: return 'text-red-600 bg-red-100'
      case LogLevel.FATAL: return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getLogLevelLabel = (level: LogLevel) => {
    switch (level) {
      case LogLevel.DEBUG: return 'DEBUG'
      case LogLevel.INFO: return 'INFO'
      case LogLevel.WARN: return 'WARN'
      case LogLevel.ERROR: return 'ERROR'
      case LogLevel.FATAL: return 'FATAL'
      default: return 'UNKNOWN'
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white border-t border-gray-700 max-h-80 sm:max-h-96 overflow-hidden z-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-3 bg-gray-800 border-b border-gray-700 gap-2 sm:gap-0">
        <div className="flex items-center gap-2 sm:gap-4">
          <h3 className="font-semibold text-xs sm:text-sm">Debug Panel</h3>
          
          {/* Tabs */}
          <div className="flex gap-1">
            {[
              { id: 'logs', label: 'Logs' },
              { id: 'state', label: 'App State' },
              { id: 'performance', label: 'Performance' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-2 sm:px-3 py-1 text-xs rounded ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Auto-refresh toggle */}
          <label className="flex items-center gap-1 sm:gap-2 text-xs">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-3 h-3"
            />
            <span className="hidden sm:inline">Auto-refresh</span>
            <span className="sm:hidden">Auto</span>
          </label>

          {/* Close button */}
          <button
            onClick={onToggle}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-2 sm:p-3 overflow-auto max-h-60 sm:max-h-80">
        {activeTab === 'logs' && (
          <div className="space-y-2 sm:space-y-3">
            {/* Log controls */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span>Log Level:</span>
                <select
                  value={logLevel}
                  onChange={(e) => setLogLevel(Number(e.target.value))}
                  className="bg-gray-800 border border-gray-600 rounded px-2 py-1"
                >
                  <option value={LogLevel.DEBUG}>DEBUG</option>
                  <option value={LogLevel.INFO}>INFO</option>
                  <option value={LogLevel.WARN}>WARN</option>
                  <option value={LogLevel.ERROR}>ERROR</option>
                  <option value={LogLevel.FATAL}>FATAL</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Sök i loggar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-800 border border-gray-600 rounded px-2 py-1 w-32 sm:w-48"
                />
                <Search className="w-3 h-3 text-gray-400" />
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={showTimestamps}
                    onChange={(e) => setShowTimestamps(e.target.checked)}
                    className="w-3 h-3"
                  />
                  <span className="hidden sm:inline">Timestamps</span>
                  <span className="sm:hidden">Time</span>
                </label>

                <button
                  onClick={handleClearLogs}
                  className="flex items-center gap-1 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-3 h-3" />
                  <span className="hidden sm:inline">Rensa</span>
                </button>

                <button
                  onClick={handleExportLogs}
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                >
                  <Download className="w-3 h-3" />
                  <span className="hidden sm:inline">Exportera</span>
                </button>
              </div>
            </div>

            {/* Logs */}
            <div className="space-y-1 max-h-48 sm:max-h-60 overflow-y-auto">
              {filteredLogs.length === 0 ? (
                <p className="text-gray-400 text-center py-4">Inga loggar att visa</p>
              ) : (
                filteredLogs.map((log, index) => (
                  <div key={index} className="bg-gray-800 rounded p-2 text-xs font-mono">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${getLogLevelColor(log.level)}`}>
                        {getLogLevelLabel(log.level)}
                      </span>
                      
                      {showTimestamps && (
                        <span className="text-gray-400">
                          {formatTimestamp(log.timestamp)}
                        </span>
                      )}
                      
                      {log.context && (
                        <span className="text-blue-400">[{log.context}]</span>
                      )}
                    </div>
                    
                    <div className="text-gray-200 mb-1">{log.message}</div>
                    
                    {log.data && (
                      <details className="text-gray-400">
                        <summary className="cursor-pointer hover:text-gray-300">Data</summary>
                        <pre className="mt-1 text-xs overflow-x-auto">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      </details>
                    )}
                    
                    {log.error && (
                      <details className="text-red-400">
                        <summary className="cursor-pointer hover:text-red-300">Error</summary>
                        <pre className="mt-1 text-xs overflow-x-auto">
                          {log.error.stack || log.error.message}
                        </pre>
                      </details>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'state' && (
          <div className="space-y-2 sm:space-y-3">
            <h4 className="font-semibold text-xs sm:text-sm">Application State</h4>
            
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <div className="bg-gray-800 rounded p-2 sm:p-3">
                <h5 className="font-medium text-xs sm:text-sm mb-2">Week Plan</h5>
                <div className="text-xs space-y-1">
                  <div>Total days: {state.weekPlan.length}</div>
                  <div>Total recipes: {state.weekPlan.reduce((sum, day) => sum + day.recipes.length, 0)}</div>
                  {state.weekPlan.map(day => (
                    <div key={day.day} className="text-gray-400">
                      {day.day}: {day.recipes.length} recept
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800 rounded p-2 sm:p-3">
                <h5 className="font-medium text-xs sm:text-sm mb-2">Recipe Library</h5>
                <div className="text-xs space-y-1">
                  <div>Total recipes: {state.recipeLibrary.length}</div>
                  <div>Suggestions: {state.suggestions.length}</div>
                </div>
              </div>
            </div>

            <details className="bg-gray-800 rounded p-2 sm:p-3">
              <summary className="cursor-pointer font-medium text-xs sm:text-sm">Raw State JSON</summary>
              <pre className="mt-2 text-xs overflow-x-auto text-gray-300">
                {JSON.stringify(state, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-2 sm:space-y-3">
            <h4 className="font-semibold text-xs sm:text-sm">Performance Metrics</h4>
            
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-gray-800 rounded p-2 sm:p-3">
                <h5 className="font-medium text-xs sm:text-sm mb-2">Operations</h5>
                <div className="text-xl sm:text-2xl font-bold text-blue-400">
                  {performanceStats.totalOperations}
                </div>
                <div className="text-xs text-gray-400">Total tracked</div>
              </div>

              <div className="bg-gray-800 rounded p-2 sm:p-3">
                <h5 className="font-medium text-xs sm:text-sm mb-2">Avg Duration</h5>
                <div className="text-xl sm:text-2xl font-bold text-green-400">
                  {performanceStats.avgDuration}ms
                </div>
                <div className="text-xs text-gray-400">Per operation</div>
              </div>
            </div>

            <div className="bg-gray-800 rounded p-2 sm:p-3">
              <h5 className="font-medium text-xs sm:text-sm mb-2">Recent Performance Logs</h5>
              <div className="space-y-1 max-h-24 sm:max-h-32 overflow-y-auto">
                {logger.getLogsByContext('Performance').slice(-10).map((log, index) => (
                  <div key={index} className="text-xs text-gray-300">
                    {log.message} - {log.data?.duration}ms
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DebugPanel
