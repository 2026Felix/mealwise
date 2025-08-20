import React, { useState, useEffect } from 'react'

interface GitHubIssue {
  id: number
  number: number
  title: string
  body: string
  state: 'open' | 'closed'
  created_at: string
  updated_at: string
  labels: Array<{ name: string; color: string }>
  user: {
    login: string
    avatar_url: string
  }
}

const Admin: React.FC = () => {
  const [issues, setIssues] = useState<GitHubIssue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all')

  useEffect(() => {
    fetchIssues()
  }, [])

  const fetchIssues = async () => {
    try {
      setLoading(true)
      const response = await fetch('https://api.github.com/repos/Felix2026/FoodApp/issues?state=all&labels=feedback,website', {
        headers: {
          'Authorization': `token ${import.meta.env.VITE_GITHUB_TOKEN || ''}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      })

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }

      const data = await response.json()
      setIssues(data)
    } catch (err) {
      console.error('Error fetching issues:', err)
      setError('Kunde inte hämta feedback. Kontrollera GitHub-token.')
    } finally {
      setLoading(false)
    }
  }

  const closeIssue = async (issueNumber: number) => {
    try {
      const response = await fetch(`https://api.github.com/repos/Felix2026/FoodApp/issues/${issueNumber}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `token ${import.meta.env.VITE_GITHUB_TOKEN || ''}`,
          'Accept': 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({ state: 'closed' }),
      })

      if (response.ok) {
        setIssues(prev => prev.map(issue => 
          issue.number === issueNumber 
            ? { ...issue, state: 'closed' as const }
            : issue
        ))
      }
    } catch (err) {
      console.error('Error closing issue:', err)
    }
  }

  const reopenIssue = async (issueNumber: number) => {
    try {
      const response = await fetch(`https://api.github.com/repos/Felix2026/FoodApp/issues/${issueNumber}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `token ${import.meta.env.VITE_GITHUB_TOKEN || ''}`,
          'Accept': 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({ state: 'open' }),
      })

      if (response.ok) {
        setIssues(prev => prev.map(issue => 
          issue.number === issueNumber 
            ? { ...issue, state: 'open' as const }
            : issue
        ))
      }
    } catch (err) {
      console.error('Error reopening issue:', err)
    }
  }

  const filteredIssues = issues.filter(issue => {
    if (filter === 'all') return true
    return issue.state === filter
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('sv-SE')
  }

  if (loading) {
    return (
      <main className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] mx-auto p-3 sm:p-4 md:p-6 mt-8 sm:mt-12 md:mt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-text mx-auto"></div>
          <p className="mt-4 text-text/70">Hämtar feedback...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] mx-auto p-3 sm:p-4 md:p-6 mt-8 sm:mt-12 md:mt-16">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchIssues}
            className="bg-text text-background px-4 py-2 rounded-md font-semibold hover:bg-text/90"
          >
            Försök igen
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] mx-auto p-3 sm:p-4 md:p-6 mt-8 sm:mt-12 md:mt-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-text mb-4 sm:mb-0">
            Feedback Admin
          </h1>
          <div className="flex items-center gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'open' | 'closed')}
              className="px-3 py-2 border border-text/20 rounded-md bg-background text-text"
            >
              <option value="all">Alla ({issues.length})</option>
              <option value="open">Öppna ({issues.filter(i => i.state === 'open').length})</option>
              <option value="closed">Stängda ({issues.filter(i => i.state === 'closed').length})</option>
            </select>
            <button 
              onClick={fetchIssues}
              className="bg-text text-background px-4 py-2 rounded-md font-semibold hover:bg-text/90"
            >
              Uppdatera
            </button>
          </div>
        </div>

        {filteredIssues.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text/70">Ingen feedback hittades.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredIssues.map((issue) => (
              <div 
                key={issue.id} 
                className={`border rounded-lg p-4 ${
                  issue.state === 'open' 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-text">
                        #{issue.number} {issue.title}
                      </h3>
                      <span 
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          issue.state === 'open' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {issue.state === 'open' ? 'Öppen' : 'Stängd'}
                      </span>
                    </div>
                    
                    <div className="text-sm text-text/70 mb-3">
                      <p>Skapad: {formatDate(issue.created_at)}</p>
                      <p>Senast uppdaterad: {formatDate(issue.updated_at)}</p>
                    </div>

                    <div className="prose prose-sm max-w-none">
                      <div 
                        className="text-text/80"
                        dangerouslySetInnerHTML={{ 
                          __html: issue.body.replace(/\n/g, '<br>') 
                        }} 
                      />
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {issue.labels.map((label) => (
                        <span
                          key={label.name}
                          className="px-2 py-1 text-xs font-medium rounded-full"
                          style={{ 
                            backgroundColor: `#${label.color}`,
                            color: parseInt(label.color, 16) > 0x888888 ? '#000' : '#fff'
                          }}
                        >
                          {label.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {issue.state === 'open' ? (
                      <button
                        onClick={() => closeIssue(issue.number)}
                        className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600"
                      >
                        Stäng
                      </button>
                    ) : (
                      <button
                        onClick={() => reopenIssue(issue.number)}
                        className="bg-green-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600"
                      >
                        Öppna igen
                      </button>
                    )}
                    
                    <a
                      href={`https://github.com/Felix2026/FoodApp/issues/${issue.number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-text text-background px-3 py-2 rounded-md text-sm font-medium hover:bg-text/90 text-center"
                    >
                      Visa på GitHub
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default Admin
