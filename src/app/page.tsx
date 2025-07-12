import ImageUpload from '@/components/ImageUpload'

export default function Home() {
  return (
       <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Interior Design AI</h1>
        <p className="text-center mb-8">Upload a photo of your room and get AI-powered design suggestions</p>
        <ImageUpload />
      </div>
    </main>
  );
}
