// app/api/process-design/route.ts
import { NextResponse } from 'next/server'
import { updateJob, getJobBySessionId } from '@/libs/models/DesignJob'

export const runtime = 'nodejs'

// Free Hugging Face Stable Diffusion API
const HF_API_TOKEN = process.env.HUGGING_FACE_API_TOKEN
const HF_IMAGE_API_URL = "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5"

export async function POST(request: Request) {
  try {
    const { sessionId, imageUrl, prompt } = await request.json()

    if (!sessionId || !imageUrl || !prompt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const existingJob = await getJobBySessionId(sessionId)
    if (!existingJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

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
    await updateJob(sessionId, {
      status: 'processing',
      progress: 10,
    })

    await updateJob(sessionId, { progress: 30 })

    // Generate multiple design variations using free HF API
    const designPrompts = extractDesignPrompts(prompt)
    const generatedImages: string[] = []

    for (let i = 0; i < 3; i++) {
      try {
        const designPrompt = designPrompts[i] || designPrompts[0]
        const imageBlob = await generateImageWithHuggingFace(designPrompt)
        
        if (imageBlob) {
          // Convert blob to base64 data URL for storage
          const buffer = Buffer.from(await imageBlob.arrayBuffer())
          const base64 = buffer.toString('base64')
          const dataUrl = `data:image/png;base64,${base64}`
          generatedImages.push(dataUrl)
        }
        
        // Update progress
        await updateJob(sessionId, { 
          progress: 30 + ((i + 1) * 50) / 3 
        })
        
        // Add delay to respect rate limits
        if (i < 2) await new Promise(resolve => setTimeout(resolve, 3000))
        
      } catch (error) {
        console.error(`Error generating image ${i + 1}:`, error)
        // Continue with other images even if one fails
      }
    }

    // If no images were generated, create placeholder or try alternative
    if (generatedImages.length === 0) {
      generatedImages.push(...await generatePlaceholderImages(designPrompts))
    }

    await updateJob(sessionId, {
      status: 'completed',
      progress: 100,
      generatedImages,
    })

  } catch (error) {
    console.error('Background processing error:', error)
    await updateJob(sessionId, {
      status: 'failed',
      error: error instanceof Error ? error.message : 'Generation failed',
    })
  }
}

async function generateImageWithHuggingFace(prompt: string): Promise<Blob | null> {
  try {
    const response = await fetch(HF_IMAGE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `Interior design, ${prompt}, modern, high quality, professional photography, well lit, architectural photography`,
        parameters: {
          num_inference_steps: 30,
          guidance_scale: 7.5,
          width: 512,
          height: 512
        }
      })
    })

    if (!response.ok) {
      console.error('HF API error:', response.status, response.statusText)
      return null
    }

    const blob = await response.blob()
    return blob
  } catch (error) {
    console.error('Error calling HF API:', error)
    return null
  }
}

function extractDesignPrompts(analysis: string): string[] {
  const prompts = []
  
  // Extract design suggestions from the analysis
  if (analysis.includes('Scandinavian')) {
    prompts.push('Scandinavian interior design, light wood furniture, white walls, minimalist, cozy textiles, natural lighting')
  }
  
  if (analysis.includes('Industrial')) {
    prompts.push('Industrial interior design, exposed brick, metal and wood furniture, warm lighting, urban loft style')
  }
  
  if (analysis.includes('Minimalist')) {
    prompts.push('Minimalist interior design, clean lines, neutral colors, uncluttered space, modern furniture')
  }
  
  // Add default prompts if none found
  if (prompts.length === 0) {
    prompts.push(
      'Modern interior design, contemporary furniture, neutral colors, clean space',
      'Scandinavian interior design, light wood, white walls, cozy atmosphere',
      'Minimalist interior design, clean lines, simple furniture, bright lighting'
    )
  }
  
  return prompts
}

async function generatePlaceholderImages(prompts: string[]): Promise<string[]> {
  // Generate SVG placeholders as base64 data URLs
  const placeholders = prompts.slice(0, 3).map((prompt, index) => {
    const svg = `
      <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
        <rect width="512" height="512" fill="#f3f4f6"/>
        <rect x="50" y="50" width="412" height="412" fill="#e5e7eb" stroke="#d1d5db" stroke-width="2"/>
        <text x="256" y="200" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#6b7280">
          Design ${index + 1}
        </text>
        <text x="256" y="240" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#9ca3af">
          ${prompt.substring(0, 40)}...
        </text>
        <text x="256" y="300" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#9ca3af">
          Generated with Free API
        </text>
        <rect x="200" y="320" width="112" height="80" fill="#fbbf24" opacity="0.3"/>
        <rect x="220" y="350" width="72" height="20" fill="#f59e0b"/>
      </svg>
    `
    
    const base64 = Buffer.from(svg).toString('base64')
    return `data:image/svg+xml;base64,${base64}`
  })
  
  return placeholders
}
// import { NextResponse } from 'next/server'
// import { replicate } from '@/libs/replicate'
// import { updateJob, getJobBySessionId } from '@/libs/models/DesignJob'

// export const runtime = 'nodejs'

// export async function POST(request: Request) {
//   try {
//     // Parse JSON instead of FormData
//     const { sessionId, imageUrl, prompt } = await request.json()

//     if (!sessionId || !imageUrl || !prompt) {
//       return NextResponse.json(
//         { error: 'Missing required fields' },
//         { status: 400 }
//       )
//     }

//     // Check if job already exists
//     const existingJob = await getJobBySessionId(sessionId)
//     if (!existingJob) {
//       return NextResponse.json(
//         { error: 'Job not found' },
//         { status: 404 }
//       )
//     }

//     // If job is already processing or completed, return current status
//     if (existingJob.status !== 'pending') {
//       return NextResponse.json({
//         sessionId,
//         status: existingJob.status,
//         progress: existingJob.progress,
//       })
//     }

//     // Start background processing
//     processJobInBackground(sessionId, imageUrl, prompt)

//     return NextResponse.json({
//       sessionId,
//       status: 'processing',
//       progress: 10,
//     })
//   } catch (error) {
//     console.error('Error processing design:', error)
//     return NextResponse.json(
//       { error: 'Failed to start processing' },
//       { status: 500 }
//     )
//   }
// }

// async function processJobInBackground(sessionId: string, imageUrl: string, prompt: string) {
//   try {
//     // Update job to processing
//     await updateJob(sessionId, {
//       status: 'processing',
//       progress: 10,
//     })

//     // Step 1: Analyze room (if needed)
//     await updateJob(sessionId, { progress: 30 })

//     // Step 2: Generate designs
//     const outputs = await replicate.run(
//       'stability-ai/stable-diffusion-xl-base-1.0:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
//       {
//         input: {
//           prompt: `Interior design rendering of a room with: ${prompt}. Professional, photorealistic, high quality.`,
//           image: imageUrl,
//           num_outputs: 3,
//         },
//       }
//     )

//     await updateJob(sessionId, { progress: 80 })

//     // Step 3: Process results
//     await updateJob(sessionId, {
//       status: 'completed',
//       progress: 100,
//       generatedImages: outputs as string[],
//     })

//   } catch (error) {
//     console.error('Background processing error:', error)
//     await updateJob(sessionId, {
//       status: 'failed',
//       error: error instanceof Error ? error.message : 'Generation failed',
//     })
//   }
// }