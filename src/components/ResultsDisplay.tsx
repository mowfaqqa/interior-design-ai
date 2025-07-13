/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { pollJobStatus } from "@/libs/polling";
import DownloadButton from "./DownloadButton";

export default function ResultsDisplay({ sessionId }: { sessionId: string }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<
    "pending" | "processing" | "completed" | "failed"
  >("pending");
  const [results, setResults] = useState<{
    analysis?: string;
    generatedImages?: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await pollJobStatus(sessionId, {
          onProgress: setProgress,
          timeout: 120000, // 2 minutes
        });

        setStatus(result.status as any);
        if (result.status === "completed") {
          setResults({
            analysis: result.analysis,
            generatedImages: result.generatedImages,
          });
        } else if (result.status === "failed") {
          setError(result.error || "Processing failed");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    };

    fetchData();
  }, [sessionId]);

  if (status === "pending" || status === "processing") {
    return (
      <div className="text-center py-12">
        <p>Generating your design ({progress}%)...</p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (status === "completed" && results) {
    return (
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Design Analysis</h2>
          <div className="whitespace-pre-wrap">{results.analysis}</div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Generated Designs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {results.generatedImages?.map((img, i) => (
              <div key={i} className="relative group">
                <img
                  src={img}
                  alt={`Design ${i + 1}`}
                  className="w-full h-auto rounded-lg"
                />
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DownloadButton imageUrl={img} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <div className="text-center py-12">No results found</div>;
}
