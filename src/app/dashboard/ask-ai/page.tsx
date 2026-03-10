'use client';

import { useState } from 'react';

export default function AskAIPage() {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const trimmedQuestion = question.trim();
        if (!trimmedQuestion) return;

        setLoading(true);
        setError(null);
        setAnswer('');

        try {
            const res = await fetch('/api/ask-ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: trimmedQuestion, mode: 'decision' }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'System was unable to process your request.');
            }

            setAnswer(data.answer);
        } catch (err: any) {
            setError(err.message || 'Connection lost. Please check your internet or try again later.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 font-outfit">Consult the AI Strategist</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ask anything about your past decisions (e.g., 'What patterns do you see in my technical choices?')"
                        className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-gray-700"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
                    >
                        {loading ? 'AI is thinking...' : 'Ask AI'}
                    </button>
                </form>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-8 text-red-700 font-medium">
                    {error}
                </div>
            )}

            {answer && (
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 animate-in fade-in slide-in-from-bottom-2">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">AI Analysis</h2>
                    <div className="prose prose-blue max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {answer}
                    </div>
                </div>
            )}
        </div>
    );
}
