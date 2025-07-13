// app/api/process-design/route.ts
import { NextResponse } from 'next/server'
import { replicate } from '@/libs/replicate'
import { updateJob, getJobBySessionId } from '@/libs/models/DesignJob'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    // Parse JSON instead of FormData
    const { sessionId, imageUrl, prompt } = await request.json()

    if (!sessionId || !imageUrl || !prompt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if job already exists
    const existingJob = await getJobBySessionId(sessionId)
    if (!existingJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // If job is already processing or completed, return current status
    if (existingJob.status !== 'pending') {
      return NextResponse.json({
        sessionId,
        status: existingJob.status,
        progress: existingJob.progress,
      })
    }

    // Start background processing
    processJobInBackground(sessionId, imageUrl, prompt)

    return NextResponse.json({
      sessionId,
      status: 'processing',
      progress: 10,
    })
  } catch (error) {
    console.error('Error processing design:', error)
    return NextResponse.json(
      { error: 'Failed to start processing' },
      { status: 500 }
    )
  }
}

async function processJobInBackground(sessionId: string, imageUrl: string, prompt: string) {
  try {
    // Update job to processing
    await updateJob(sessionId, {
      status: 'processing',
      progress: 10,
    })

    // Step 1: Analyze room (if needed)
    await updateJob(sessionId, { progress: 30 })

    // Step 2: Generate designs
    const outputs = await replicate.run(
      'stability-ai/stable-diffusion-xl-base-1.0:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
      {
        input: {
          prompt: `Interior design rendering of a room with: ${prompt}. Professional, photorealistic, high quality.`,
          image: imageUrl,
          num_outputs: 3,
        },
      }
    )

    await updateJob(sessionId, { progress: 80 })

    // Step 3: Process results
    await updateJob(sessionId, {
      status: 'completed',
      progress: 100,
      generatedImages: outputs as string[],
    })

  } catch (error) {
    console.error('Background processing error:', error)
    await updateJob(sessionId, {
      status: 'failed',
      error: error instanceof Error ? error.message : 'Generation failed',
    })
  }
}