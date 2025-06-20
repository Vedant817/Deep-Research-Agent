import ReactMarkdown from 'react-markdown';
import { ScrollArea } from './ui/scroll-area';

export default function ResearchResult({ content }: { content: { message: string } }) {
    if (!content) {
        return (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="text-center py-8 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <h3 className="text-lg font-medium mb-2 text-gray-200">No Research Results Yet</h3>
                    <p className="text-gray-400">Enter a topic and start research, or select a previous report.</p>
                </div>
            </div>
        );
    }

    const messageContent: string = content.message

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-200">Research Results</h2>
            <div className="prose prose-invert max-w-none text-gray-100">
                <ScrollArea className="h-[400px]">
                    <ReactMarkdown>{messageContent}</ReactMarkdown>
                </ScrollArea>
            </div>
            <div className="mt-6 flex justify-end">
                <button
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
                >
                    Download Report
                </button>
            </div>
        </div>
    );
}