import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

interface Report {
    filename: string;
    topic: string;
    created: number;
}

interface ReportsListProps {
    onSelectReport: (content: string) => void;
}

interface ReportsResponse {
    status: string;
    reports?: Report[];
    message?: string;
}

interface ReportContentResponse {
    status: string;
    content?: string;
    message?: string;
}

interface ErrorResponse {
    message?: string;
}

export default function ReportsList({ onSelectReport }: ReportsListProps) {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await axios.get<ReportsResponse>(`${process.env.NEXT_PUBLIC_API_URL}/reports`);

            if (response.data.status === 'success' && response.data.reports) {
                setReports(response.data.reports);
            } else {
                setError(response.data.message || 'Failed to load reports');
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
            const axiosError = error as AxiosError<ErrorResponse>;
            setError(axiosError.response?.data?.message || 'Failed to connect to the research service');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectReport = async (filename: string) => {
        try {
            const response = await axios.get<ReportContentResponse>(`http://localhost:5000/reports/${filename}`);

            if (response.data.status === 'success' && response.data.content) {
                onSelectReport(response.data.content);
            } else {
                setError(response.data.message || 'Failed to load report');
            }
        } catch (error) {
            console.error('Error loading report:', error);
            const axiosError = error as AxiosError<ErrorResponse>;
            setError(axiosError.response?.data?.message || 'Failed to load the selected report');
        }
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleString();
    };

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Previous Reports</h2>
                <div className="text-center py-4 text-gray-500">Loading reports...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Previous Reports</h2>
                <div className="text-center py-4 text-red-500">{error}</div>
            </div>
        );
    }

    if (reports.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Previous Reports</h2>
                <div className="text-center py-4 text-gray-500">No previous reports found</div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Previous Reports</h2>

            <div className="overflow-hidden bg-white shadow sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {reports.map((report) => (
                        <li key={report.filename}>
                            <button
                                onClick={() => handleSelectReport(report.filename)}
                                className="block hover:bg-gray-50 w-full text-left"
                            >
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <p className="truncate text-sm font-medium text-indigo-600">
                                            {report.topic}
                                        </p>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                {formatDate(report.created)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
