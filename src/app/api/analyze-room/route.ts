// app/api/analyze-room/route.ts
import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { tmpdir } from 'os'
import { join } from 'path'
import { writeFile, unlink } from 'fs/promises'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const runtime = 'nodejs' 

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Create temporary file path
    const tempFilePath = join(tmpdir(), file.name)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Write file using Node.js fs
    await writeFile(tempFilePath, buffer)

    // Analyze the image with OpenAI
    const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
  store: true,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this room image and provide design suggestions. Include:
  - Room type (living room, bedroom, kitchen, etc.)
  - Estimated dimensions
  - Current style (if any)
  - Lighting conditions
  - 3 design suggestions with styles (e.g., "Modern Scandinavian with light wood tones")
  - Color palette recommendations
  - Furniture placement ideas`,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${file.type};base64,${buffer.toString('base64')}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    })

    // Clean up the temporary file
    await unlink(tempFilePath)

    const analysis = response.choices[0]?.message?.content
    if (!analysis) {
      throw new Error('No analysis returned from OpenAI')
    }

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('Error analyzing room:', error)
    return NextResponse.json(
      { error: 'Failed to analyze room' },
      { status: 500 }
    )
  }
}