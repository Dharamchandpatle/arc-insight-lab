import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { interviewsAPI, reportsAPI } from '@/lib/api'
import { Calendar, Clock, User, FileText, TrendingUp, RefreshCw } from 'lucide-react'

interface Interview {
  _id: string
  interviewId: string
  livekitRoomName: string
  status: string
  completedAt?: string
  createdAt: string
  transcripts?: Array<{ role: string; text: string; timestamp: string }>
  qaPairs?: Array<{
    question: string
    candidateAnswer?: string
    idealAnswer?: string
    score?: number
  }>
}

interface Report {
  _id: string
  interviewId: string
  overallScore: number
  aiSummaryHR?: string
  aiSummaryCandidate?: string
  qaBreakdown?: Array<{
    question: string
    candidateAnswer: string
    idealAnswer: string
    score: number
    justification: string
  }>
  generatedAt: string
}

interface InterviewHistoryListProps {
  role?: 'hr' | 'candidate' | 'company'
}

const InterviewHistoryList: React.FC<InterviewHistoryListProps> = ({ role = 'hr' }) => {
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [reports, setReports] = useState<Record<string, Report>>({})
  const [loading, setLoading] = useState(true)
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)

  useEffect(() => {
    loadInterviews()
  }, [])

  const loadInterviews = async () => {
    try {
      setLoading(true)
      
      // Load from localStorage (primary source for spike interviews)
      const savedInterviews = localStorage.getItem('saved_interviews')
      let interviewsList: Interview[] = []
      
      console.log('📂 Loading interviews from localStorage...')
      if (savedInterviews) {
        try {
          interviewsList = JSON.parse(savedInterviews)
          console.log(`✅ Loaded ${interviewsList.length} interviews from localStorage`)
        } catch (parseError) {
          console.error('❌ Error parsing saved interviews:', parseError)
        }
      } else {
        console.log('⚠️ No saved interviews found in localStorage')
      }
      
      // Also try to load from backend API (for authenticated interviews)
      try {
        const backendInterviews = await interviewsAPI.getAll()
        if (Array.isArray(backendInterviews)) {
          console.log(`✅ Loaded ${backendInterviews.length} interviews from backend`)
          // Merge with localStorage interviews, avoiding duplicates
          const existingIds = new Set(interviewsList.map(i => i.interviewId))
          backendInterviews.forEach((bi: any) => {
            if (!existingIds.has(bi.interviewId)) {
              interviewsList.push(bi)
            }
          })
        }
      } catch (e) {
        console.warn('⚠️ Could not load interviews from backend:', e)
      }
      
      console.log(`📊 Total interviews loaded: ${interviewsList.length}`)
      setInterviews(interviewsList)
      
      // Load reports from localStorage and backend
      const savedReports = localStorage.getItem('saved_reports')
      const reportsMap: Record<string, Report> = {}
      
      if (savedReports) {
        try {
          Object.assign(reportsMap, JSON.parse(savedReports))
          console.log(`✅ Loaded ${Object.keys(reportsMap).length} reports from localStorage`)
        } catch (parseError) {
          console.error('❌ Error parsing saved reports:', parseError)
        }
      }
      
      // Try to load reports from backend
      for (const interview of interviewsList) {
        if (!reportsMap[interview.interviewId]) {
          try {
            const report = await reportsAPI.getByInterviewId(interview.interviewId).catch(() => null)
            if (report) {
              reportsMap[interview.interviewId] = report
              console.log(`✅ Loaded report for interview ${interview.interviewId}`)
            }
          } catch (e) {
            // Report not found, skip
          }
        }
      }
      setReports(reportsMap)
    } catch (error) {
      console.error('❌ Error loading interviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Format markdown-like text for better readability
  const formatReportText = (text: string) => {
    if (!text) return []
    
    // Check if text has markdown headers
    const hasHeaders = text.includes('###')
    
    if (hasHeaders) {
      // Split by markdown headers (###)
      const sections = text.split(/###\s+/).filter(s => s.trim())
      
      return sections.map((section, idx) => {
        const lines = section.split('\n').filter(l => l.trim())
        const title = lines[0]?.trim() || ''
        const content = lines.slice(1).join('\n').trim()
        
        // Clean up markdown formatting
        const cleanContent = content
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/\*\s+/g, '• ')
          .replace(/\n\n+/g, '\n\n')
          .trim()
        
        return { title, content: cleanContent, key: idx }
      })
    } else {
      // No headers, treat entire text as one section
      const cleanContent = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\*\s+/g, '• ')
        .replace(/\n\n+/g, '\n\n')
        .trim()
      
      return [{ title: '', content: cleanContent, key: 0 }]
    }
  }

  const calculateAverageScore = (interview: Interview) => {
    if (!interview.qaPairs || interview.qaPairs.length === 0) return null
    const scoredPairs = interview.qaPairs.filter(qa => qa.score !== undefined)
    if (scoredPairs.length === 0) return null
    const avg = scoredPairs.reduce((sum, qa) => sum + (qa.score || 0), 0) / scoredPairs.length
    return Math.round(avg * 10)
  }

  if (loading) {
    return (
      <Card className="glass">
        <CardHeader>
          <CardTitle>Interview History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading interviews...</p>
        </CardContent>
      </Card>
    )
  }

  if (interviews.length === 0) {
    return (
      <Card className="glass">
        <CardHeader>
          <CardTitle>Interview History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No interviews found. Complete an interview to see it here.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Interview History
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={loadInterviews}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {interviews.map((interview) => {
              const report = reports[interview.interviewId]
              const avgScore = calculateAverageScore(interview)
              const reportScore = report?.overallScore

              return (
                <div
                  key={interview._id || interview.interviewId}
                  className="glass p-4 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedInterview(interview)
                    setSelectedReport(report || null)
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">
                          Interview - {interview.livekitRoomName || interview.interviewId}
                        </h3>
                        <span className={`px-2 py-1 rounded text-xs ${
                          interview.status === 'completed' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {interview.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(interview.completedAt || interview.createdAt)}
                        </div>
                        {interview.transcripts && (
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {interview.transcripts.length} transcripts
                          </div>
                        )}
                        {interview.qaPairs && interview.qaPairs.length > 0 && (
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            {interview.qaPairs.length} Q&A pairs
                          </div>
                        )}
                      </div>
                    </div>
                    {(avgScore !== null || reportScore !== undefined) && (
                      <div className="ml-4 text-right">
                        <div className="text-2xl font-bold text-primary">
                          {reportScore !== undefined ? reportScore : avgScore}%
                        </div>
                        <div className="text-xs text-muted-foreground">Score</div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Interview Detail Modal */}
      {selectedInterview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="glass max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Interview Details</CardTitle>
                <Button variant="ghost" onClick={() => {
                  setSelectedInterview(null)
                  setSelectedReport(null)
                }}>
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Report Summary */}
              {selectedReport && (
                <div className="space-y-6">
                  {/* Overall Score - Prominent Display */}
                  <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-xl p-6 border border-primary/30">
                    <div className="text-center">
                      <div className="text-sm font-medium text-primary/80 mb-2">Overall Score</div>
                      <div className="text-5xl font-bold text-primary mb-2">
                        {selectedReport.overallScore}%
                      </div>
                      <div className="text-sm text-white/60">
                        {selectedReport.overallScore >= 80 ? 'Excellent Performance' : 
                         selectedReport.overallScore >= 60 ? 'Good Performance' : 
                         selectedReport.overallScore >= 40 ? 'Average Performance' : 'Needs Improvement'}
                      </div>
                    </div>
                  </div>

                  {/* AI Summary - Formatted */}
                  {role === 'hr' && selectedReport.aiSummaryHR && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white border-b border-primary/30 pb-2">
                        HR Summary
                      </h3>
                      <div className="bg-white/5 rounded-lg p-6 space-y-4">
                        {formatReportText(selectedReport.aiSummaryHR).map((section) => (
                          <div key={section.key} className="space-y-3">
                            {section.title && (
                              <h4 className="text-lg font-semibold text-primary">
                                {section.title}
                              </h4>
                            )}
                            <div 
                              className="text-white/90 leading-relaxed whitespace-pre-wrap"
                              dangerouslySetInnerHTML={{ __html: section.content }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {role === 'candidate' && selectedReport.aiSummaryCandidate && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white border-b border-primary/30 pb-2">
                        Your Feedback
                      </h3>
                      <div className="bg-white/5 rounded-lg p-6 space-y-4">
                        {formatReportText(selectedReport.aiSummaryCandidate).map((section) => (
                          <div key={section.key} className="space-y-3">
                            {section.title && (
                              <h4 className="text-lg font-semibold text-primary">
                                {section.title}
                              </h4>
                            )}
                            <div 
                              className="text-white/90 leading-relaxed whitespace-pre-wrap"
                              dangerouslySetInnerHTML={{ __html: section.content }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {role === 'company' && (
                    <>
                      {selectedReport.aiSummaryHR && (
                        <div className="space-y-4">
                          <h3 className="text-xl font-bold text-white border-b border-primary/30 pb-2">
                            HR Summary
                          </h3>
                          <div className="bg-white/5 rounded-lg p-6 space-y-4">
                            {formatReportText(selectedReport.aiSummaryHR).map((section) => (
                              <div key={section.key} className="space-y-3">
                                {section.title && (
                                  <h4 className="text-lg font-semibold text-primary">
                                    {section.title}
                                  </h4>
                                )}
                                <div 
                                  className="text-white/90 leading-relaxed whitespace-pre-wrap"
                                  dangerouslySetInnerHTML={{ __html: section.content }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedReport.aiSummaryCandidate && (
                        <div className="space-y-4">
                          <h3 className="text-xl font-bold text-white border-b border-primary/30 pb-2">
                            Candidate Feedback
                          </h3>
                          <div className="bg-white/5 rounded-lg p-6 space-y-4">
                            {formatReportText(selectedReport.aiSummaryCandidate).map((section) => (
                              <div key={section.key} className="space-y-3">
                                {section.title && (
                                  <h4 className="text-lg font-semibold text-primary">
                                    {section.title}
                                  </h4>
                                )}
                                <div 
                                  className="text-white/90 leading-relaxed whitespace-pre-wrap"
                                  dangerouslySetInnerHTML={{ __html: section.content }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Q&A Breakdown */}
                  {selectedReport.qaBreakdown && selectedReport.qaBreakdown.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white border-b border-primary/30 pb-2">
                        Q&A Breakdown
                      </h3>
                      <div className="space-y-4">
                        {selectedReport.qaBreakdown.map((qa, idx) => (
                          <div key={idx} className="bg-white/5 rounded-lg p-5 border border-primary/20 hover:border-primary/40 transition-colors">
                            <div className="flex items-start justify-between mb-4">
                              <h4 className="text-lg font-semibold text-white flex-1 pr-4">
                                {idx + 1}. {qa.question}
                              </h4>
                              <div className="flex-shrink-0">
                                <div className="bg-primary/20 rounded-lg px-4 py-2 border border-primary/30">
                                  <div className="text-2xl font-bold text-primary">{qa.score}/10</div>
                                  <div className="text-xs text-primary/70 text-center">Score</div>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div className="bg-white/5 rounded p-4">
                                <div className="text-sm font-semibold text-primary/80 mb-2">Your Answer:</div>
                                <p className="text-white/90 leading-relaxed">{qa.candidateAnswer || 'No answer provided'}</p>
                              </div>
                              {(role === 'hr' || role === 'company') && qa.idealAnswer && (
                                <div className="bg-green-500/10 rounded p-4 border border-green-500/20">
                                  <div className="text-sm font-semibold text-green-400 mb-2">Ideal Answer:</div>
                                  <p className="text-white/90 leading-relaxed">{qa.idealAnswer}</p>
                                </div>
                              )}
                              {qa.justification && (
                                <div className="bg-blue-500/10 rounded p-4 border border-blue-500/20">
                                  <div className="text-sm font-semibold text-blue-400 mb-2">Feedback:</div>
                                  <p className="text-white/90 leading-relaxed">{qa.justification}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Transcripts */}
              {selectedInterview.transcripts && selectedInterview.transcripts.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white border-b border-primary/30 pb-2">
                    Full Transcript
                  </h3>
                  <div className="bg-white/5 rounded-lg p-4 max-h-96 overflow-y-auto space-y-3">
                    {selectedInterview.transcripts.map((transcript, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg ${
                          transcript.role === 'hr'
                            ? 'bg-primary/10 border-l-4 border-primary'
                            : 'bg-secondary/10 border-l-4 border-secondary'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`text-xs font-bold uppercase px-2 py-1 rounded ${
                            transcript.role === 'hr'
                              ? 'bg-primary/20 text-primary'
                              : 'bg-secondary/20 text-secondary'
                          }`}>
                            {transcript.role === 'hr' ? 'HR' : 'Candidate'}
                          </div>
                          {transcript.timestamp && (
                            <div className="text-xs text-white/50">
                              {new Date(transcript.timestamp).toLocaleTimeString()}
                            </div>
                          )}
                        </div>
                        <div className="text-white/90 leading-relaxed">{transcript.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default InterviewHistoryList

