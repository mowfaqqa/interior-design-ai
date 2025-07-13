'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
import { preprocessImage } from '@/libs/utils'

interface ImageUploadProps {
  onComplete: (file: File, analysis: string) => void
  onError: (error: string) => void
  // disabled?: boolean
}

export default function ImageUpload({ onComplete, onError }: ImageUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
      onError('') // Clear previous errors
    }
  }, [onError])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB (slightly larger for better quality)
    disabled: isProcessing
  })

  const handleSubmit = async () => {
    if (!file) return

    setIsProcessing(true)
    setUploadProgress(0)

    try {
      // Step 1: Preprocess image
      const processedFile = await preprocessImage(file)
      setUploadProgress(10)

      // Step 2: Upload and analyze
      const formData = new FormData()
      formData.append('file', processedFile)

      const response = await axios.post('/api/analyze-room', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 90) / (progressEvent.total || 1)
          );
          setUploadProgress(10 + percentCompleted); // 10-100% range
        }
      })

      if (response.data.error) {
        throw new Error(response.data.error)
      }

      // Pass both file and analysis data to parent
      onComplete(processedFile, response.data.analysis)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Image analysis failed'
      onError(errorMessage)
      console.error('Upload error:', err)
    } finally {
      setIsProcessing(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        } ${(isProcessing) ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-600">Drop the image here...</p>
        ) : (
          <p>Drag & drop a room image here, or click to select</p>
        )}
        <p className="text-sm text-gray-500 mt-2">
          JPEG, PNG, or WEBP (max 5MB)
        </p>
      </div>

      {file && (
        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-600">
            Selected: <span className="font-medium">{file.name}</span>
            <span className="float-right text-gray-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </p>
          <div className="relative">
            <img
              src={URL.createObjectURL(file)}
              alt="Room preview"
              className="w-full h-auto rounded-lg border"
            />
            {isProcessing && (
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-lg">
                <div className="text-white text-center">
                  <p>Processing... {uploadProgress}%</p>
                  <div className="w-full bg-gray-300 h-2 mt-2 rounded-full">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isProcessing || !file}
        className={`w-full py-3 px-4 rounded-lg transition-colors flex items-center justify-center ${
          isProcessing || !file
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing ({uploadProgress}%)
          </>
        ) : (
          'Get Design Suggestions'
        )}
      </button>
    </div>
  )
}