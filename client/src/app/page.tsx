"use client";
import { useState } from 'react';
import Head from 'next/head';
import ResearchForm from '@/components/ResearchForm';
import ResearchResult from '@/components/ResearchResult';
import ResearchProgress from '@/components/ResearchProgress';

type ResearchStage = 'planning' | 'researching' | 'finalizing' | null;

interface ResearchResponse {
  data: {
    outputs: Array<{
      outputs: Array<{
        artifacts: {
          message: string;
        };
      }>;
    }>;
  };
  status: string;
  session_id: string;
}

export default function Home() {
  const [researchResult, setResearchResult] = useState<ResearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState<ResearchStage>(null);
  const [error, setError] = useState('');
  const [researchTopic, setResearchTopic] = useState('');

  const handleResearchComplete = (result: ResearchResponse) => {
    setResearchResult(result);
    setIsLoading(false);
    setCurrentStage(null);
  };

  const handleResearchStart = () => {
    setResearchResult(null);
    setIsLoading(true);
    setCurrentStage('planning');
  };

  const handleStageChange = (stage: ResearchStage) => {
    setCurrentStage(stage);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setIsLoading(false);
    setCurrentStage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Head>
        <title>Deep Research Agent</title>
        <meta name="description" content="AI-powered deep research assistant" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-indigo-700">
            Deep Research Agent
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Powered by advanced AI to conduct thorough research on any topic. Get comprehensive,
            well-structured reports with verified sources and expert analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <ResearchForm
              onResearchStart={handleResearchStart}
              onResearchComplete={handleResearchComplete}
              onStageChange={handleStageChange}
              onError={handleError}
              isLoading={isLoading}
              topic={researchTopic}
              onTopicChange={setResearchTopic}
            />

            {!isLoading && researchResult && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Research Summary
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Topic: {researchTopic}
                </p>
                <button
                  onClick={() => {
                    const message = researchResult.data.outputs[0].outputs[0].artifacts.message;
                    const blob = new Blob([message], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `research-${researchTopic.slice(0, 30).toLowerCase().replace(/\s+/g, '-')}.md`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Report
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            {isLoading ? (
              <ResearchProgress currentStage={currentStage} />
            ) : (
              <ResearchResult content={researchResult!} />
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
