import { FormEvent } from 'react';
import axios, { AxiosError } from 'axios';

type ResearchStage = 'planning' | 'researching' | 'finalizing';

interface ResearchFormProps {
    onResearchStart: () => void;
    onResearchComplete: (result: ResearchResponse) => void;
    onStageChange: (stage: ResearchStage) => void;
    onError: (errorMessage: string) => void;
    isLoading: boolean;
    topic: string;
    onTopicChange: (topic: string) => void;
}

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

interface ErrorResponse {
    message?: string;
}

export default function ResearchForm({ 
    onResearchStart, 
    onResearchComplete, 
    onStageChange, 
    onError, 
    isLoading,
    topic,
    onTopicChange
}: ResearchFormProps) {

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!topic.trim()) {
            return;
        }

        onResearchStart();

        try {
            // Stage 1: Planning
            onStageChange('planning');

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
                query: topic.trim()
            });

            if (response.data.status === 'success') {
                onResearchComplete(response.data);
            } else {
                onError(response.data.message || 'An error occurred during research');
            }
        } catch (error) {
            console.error('Research error:', error);
            const axiosError = error as AxiosError<ErrorResponse>;
            onError(axiosError.response?.data?.message || 'Failed to connect to the research service');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Start New Research</h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                        Research Topic
                    </label>
                    <input
                        type="text"
                        id="topic"
                        value={topic}
                        onChange={(e) => onTopicChange(e.target.value)}
                        placeholder="Enter a research topic or question"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-black"
                        disabled={isLoading}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-2 px-4 rounded-md text-white font-medium ${isLoading
                            ? 'bg-indigo-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                >
                    {isLoading ? 'Researching...' : 'Start Deep Research'}
                </button>
            </form>
        </div>
    );
}
