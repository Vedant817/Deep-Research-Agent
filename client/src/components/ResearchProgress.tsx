"use client";
import { useState, useEffect } from 'react';
import { stages, Stage } from '@/lib/stages';

interface ResearchProgressProps {
    currentStage: Stage | null;
}

export default function ResearchProgress({ currentStage }: ResearchProgressProps) {
    const [completedStages, setCompletedStages] = useState<Stage[]>([]);

    useEffect(() => {
        if (currentStage) {
            const currentIndex = stages.findIndex(stage => stage.id === currentStage);
            const newCompletedStages = stages
                .slice(0, currentIndex)
                .map(stage => stage.id);
            setCompletedStages(newCompletedStages);
        }
    }, [currentStage]);

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-gray-200 flex items-center">
                <svg className="w-6 h-6 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Research in Progress
            </h2>

            <div className="space-y-6">
                {stages.map((stage) => {
                    const isActive = currentStage === stage.id;
                    const isComplete = completedStages.includes(stage.id);

                    return (
                        <div
                            key={stage.id}
                            className={`p-4 rounded-lg border ${isActive
                                    ? 'border-indigo-500 bg-indigo-900/50'
                                    : isComplete
                                        ? 'border-green-700 bg-green-900/50'
                                        : 'border-gray-600'
                                }`}
                        >
                            <div className="flex items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${isComplete
                                            ? 'bg-green-600'
                                            : isActive
                                                ? 'bg-indigo-600'
                                                : 'bg-gray-600'
                                        }`}
                                >
                                    {isComplete ? (
                                        <svg
                                            className="w-6 h-6 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    ) : (
                                        <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-400'}`}>
                                            {stages.indexOf(stage) + 1}
                                        </span>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h3
                                        className={`text-lg font-medium ${isActive
                                                ? 'text-indigo-400'
                                                : isComplete
                                                    ? 'text-green-400'
                                                    : 'text-gray-200'
                                            }`}
                                    >
                                        {stage.name}
                                    </h3>
                                    <p className={`text-sm ${isActive
                                            ? 'text-indigo-300'
                                            : isComplete
                                                ? 'text-green-300'
                                                : 'text-gray-400'
                                        }`}>
                                        {stage.description}
                                    </p>
                                </div>
                            </div>

                            {isActive && (
                                <div className="mt-4 ml-14">
                                    <div className="space-y-3">
                                        {stage.steps.map((step, index) => (
                                            <div key={index} className="flex items-center space-x-3">
                                                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                                <p className="text-sm text-indigo-300">{step}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4">
                                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500 rounded-full animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}