import React from 'react';
import { Question, Submission } from '../types';
import { DownloadIcon } from './icons';

interface ReportsViewProps {
    questions: Question[];
    submissions: Submission[];
}

const ReportsView: React.FC<ReportsViewProps> = ({ questions, submissions }) => {

    const handleExportCSV = () => {
        if (submissions.length === 0) return;

        const headers = ['Submitted At', ...questions.map(q => q.title)];
        const rows = submissions.map(sub => [
            new Date(sub.submittedAt).toLocaleString(),
            ...questions.map(q => {
                const answer = sub.data[q.id] || '';
                // Escape commas in the answer to prevent CSV corruption
                return `"${String(answer).replace(/"/g, '""')}"`;
            })
        ]);

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += headers.join(",") + "\r\n";
        rows.forEach(rowArray => {
            let row = rowArray.join(",");
            csvContent += row + "\r\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `submissions_${new Date().toISOString()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">Submissions</h2>
                <button
                    onClick={handleExportCSV}
                    disabled={submissions.length === 0}
                    className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    <DownloadIcon className="h-5 w-5 mr-2" />
                    Export to CSV
                </button>
            </div>
            {submissions.length > 0 ? (
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Submitted At
                                </th>
                                {questions.map(q => (
                                    <th key={q.id} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {q.title}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {submissions.map(sub => (
                                <tr key={sub.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(sub.submittedAt).toLocaleString()}
                                    </td>
                                    {questions.map(q => (
                                        <td key={q.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                            {String(sub.data[q.id] || '-')}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center p-10 border-2 border-dashed rounded-lg text-gray-500">
                    <h3 className="text-xl font-medium">No Submissions Yet</h3>
                    <p>Once users submit this form, the data will appear here.</p>
                </div>
            )}
        </div>
    );
};

export default ReportsView;
