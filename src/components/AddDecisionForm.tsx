'use client';

import { useState } from 'react';
import { SubmitButton } from '@/components/SubmitButton';

interface AddDecisionFormProps {
    onSubmit: (formData: FormData) => Promise<{ error?: string } | void>;
}

export function AddDecisionForm({ onSubmit }: AddDecisionFormProps) {
    const [error, setError] = useState<string | null>(null);

    async function clientAction(formData: FormData) {
        setError(null);
        try {
            const result = await onSubmit(formData);
            if (result && result.error) {
                setError(result.error);
            }
        } catch (e: any) {
            setError(e.message || "Something went wrong. Please try again.");
        }
    }

    return (
        <form action={clientAction} className="space-y-8">
            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-xl animate-in fade-in slide-in-from-left-2">
                    <div className="flex">
                        <div className="flex-shrink-0 text-red-400">
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3 text-sm text-red-700 font-medium">{error}</div>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                <div>
                    <label htmlFor="category" className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                        Category
                    </label>
                    <select
                        name="category"
                        id="category"
                        className="block w-full border-2 border-gray-100 rounded-2xl p-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-gray-900 bg-gray-50/50 appearance-none font-medium"
                    >
                        <option value="Technical">Technical Implementation</option>
                        <option value="Strategic">Strategic Vision</option>
                        <option value="Financial">Financial Investment</option>
                        <option value="Personal">Personal Growth</option>
                        <option value="General">General Decision</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="title" className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                        Headline
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        placeholder="e.g. Migrate to Next.js 15"
                        required
                        className="block w-full border-2 border-gray-100 rounded-2xl p-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-300 font-medium"
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label htmlFor="decision_taken" className="block text-xs font-black text-gray-400 uppercase tracking-widest">
                            What did you decide?
                        </label>
                    </div>
                    <textarea
                        name="decision_taken"
                        id="decision_taken"
                        required
                        rows={4}
                        placeholder="Explain the technical or strategic path chosen..."
                        className="block w-full border-2 border-gray-100 rounded-2xl p-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-300 leading-relaxed font-medium"
                    ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="reason" className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                            Why this choice?
                        </label>
                        <textarea
                            name="reason"
                            id="reason"
                            rows={3}
                            placeholder="What's the main driver behind this?"
                            className="block w-full border-2 border-gray-100 rounded-2xl p-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-300 text-sm font-medium"
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="context" className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                            What was happening?
                        </label>
                        <textarea
                            name="context"
                            id="context"
                            rows={3}
                            placeholder="What led to this specific moment?"
                            className="block w-full border-2 border-gray-100 rounded-2xl p-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-300 text-sm font-medium"
                        ></textarea>
                    </div>
                </div>

                <div>
                    <label htmlFor="constraints" className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                        Any limits or rules?
                    </label>
                    <textarea
                        name="constraints"
                        id="constraints"
                        rows={2}
                        placeholder="Any non-negotiables or trade-offs?"
                        className="block w-full border-2 border-gray-100 rounded-2xl p-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-300 text-sm font-medium"
                    ></textarea>
                </div>
            </div>

            <div className="flex justify-end pt-6">
                <SubmitButton
                    className="w-full md:w-auto bg-blue-600 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 shadow-2xl shadow-blue-200 transition-all active:scale-[0.98]"
                    loadingText="Saving..."
                >
                    Save decision
                </SubmitButton>
            </div>
        </form>
    );
}
