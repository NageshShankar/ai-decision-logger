'use client';

import { useState, useEffect } from 'react';

export default function PatternsPage() {
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPatterns() {
            try {
                const res = await fetch('/api/analyze-patterns', { method: 'POST' });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Failed to fetch');
                setAnalysis(data.analysis);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchPatterns();
    }, []);

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-outfit">Decision Trends</h1>
            <p className="text-gray-500 mb-10">Advanced AI analysis of your decision history and behavioral patterns.</p>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-500 font-medium">Analyzing patterns in your history...</p>
                </div>
            ) : error ? (
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-8 text-center">
                    <p className="text-amber-700 font-medium mb-4">{error}</p>
                    {error.includes('No decisions') && (
                        <a href="/dashboard/add-decision" className="inline-block bg-amber-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-amber-700 transition">
                            Log your first decision
                        </a>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-in fade-in duration-500">
                    <div className="prose prose-blue max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {analysis}
                    </div>
                </div>
            )}
        </div>
    );
}
