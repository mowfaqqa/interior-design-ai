'use client'

import { useState } from 'react'
import ImageUpload from '@/components/ImageUpload'
import ResultsDisplay from '@/components/ResultsDisplay'

export default function HomePage() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalysisComplete = async (file: File, analysis: string) => {
    try {
      setError(null)
      
      // 1. Upload image to storage
      const formData = new FormData()
      formData.append('file', file)
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!uploadResponse.ok) throw new Error('Image upload failed')
      const { url: imageUrl } = await uploadResponse.json()

      // 2. Create database job record via API
      const jobSessionId = `session-${Date.now()}`
      const jobResponse = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: jobSessionId,
          originalImageUrl: imageUrl,
          status: 'pending',
          progress: 0,
          analysis
        })
      })

      if (!jobResponse.ok) throw new Error('Failed to create job')
      const job = await jobResponse.json()

      // 3. Start processing
      const processResponse = await fetch('/api/process-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: job.sessionId,
          imageUrl,
          prompt: analysis
        })
      })

      if (!processResponse.ok) throw new Error('Failed to start processing')

      // 4. Set the session ID
      setSessionId(job.sessionId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Processing failed')
      console.error('Processing error:', err)
    }
  }

  if (sessionId) {
    return <ResultsDisplay sessionId={sessionId} />
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Interior Design AI</h1>
        <p className="text-center mb-8">Upload a photo of your room and get AI-powered design suggestions</p>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button 
              onClick={() => setError(null)} 
              className="float-right font-bold"
            >
              ×
            </button>
          </div>
        )}

        <ImageUpload 
          onComplete={handleAnalysisComplete} 
          onError={setError}
        />
      </div>
    </main>
  )
}