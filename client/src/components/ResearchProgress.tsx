import { useEffect, useState, useMemo } from 'react';

type ResearchStage = 'planning' | 'researching' | 'finalizing' | null;

interface ResearchProgressProps {
    currentStage: ResearchStage;
}

interface Stage {
    id: ResearchStage;
    name: string;
    description: string;
    steps: string[];
}

export default function ResearchProgress({ currentStage }: ResearchProgressProps) {
    const [completedStages, setCompletedStages] = useState<ResearchStage[]>([]);
    
    const stages = useMemo<Stage[]>(() => [
        {
            id: 'planning',
            name: 'Planning Research',
            description: 'Creating a focused research strategy',
            steps: [
                'Analyzing research objective',
                'Identifying key search areas',
                'Planning search strategy'
            ]
        },
        {
            id: 'researching',
            name: 'Deep Research',
            description: 'Gathering and analyzing information',
            steps: [
                'Searching academic sources',
                'Analyzing findings',
                'Verifying information',
                'Extracting key insights'
            ]
        },
        {
            id: 'finalizing',
            name: 'Synthesizing Results',
            description: 'Creating comprehensive research report',
            steps: [
                'Organizing findings',
                'Creating executive summary',
                'Formatting final report',
                'Adding source citations'
            ]
        },
    ], []);

    useEffect(() => {
        if (currentStage) {
            const currentIndex = stages.findIndex(stage => stage.id === currentStage);
            const newCompletedStages = stages
                .slice(0, currentIndex)
                .map(stage => stage.id);
            setCompletedStages(newCompletedStages);
        }
    }, [currentStage, stages]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            className={`p-4 rounded-lg border ${isActive ? 'border-indigo-500 bg-indigo-50' : isComplete ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}
                        >
                            <div className="flex items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-4
                                        ${isComplete
                                            ? 'bg-green-500'
                                            : isActive
                                                ? 'bg-indigo-500'
                                                : 'bg-gray-200'
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
                                        <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-500'}`}>
                                            {stages.indexOf(stage) + 1}
                                        </span>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h3
                                        className={`text-lg font-medium ${isActive ? 'text-indigo-700' : isComplete ? 'text-green-700' : 'text-gray-900'}`}
                                    >
                                        {stage.name}
                                    </h3>
                                    <p className={`text-sm ${isActive ? 'text-indigo-600' : isComplete ? 'text-green-600' : 'text-gray-500'}`}>
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
                                                <p className="text-sm text-indigo-600">{step}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4">
                                        <div className="w-full h-2 bg-indigo-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500 rounded-full animate-progress"></div>
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
