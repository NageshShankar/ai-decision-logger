'use client';
import { useState } from 'react';
import { SubmitButton } from '@/components/SubmitButton';

interface OutcomeFormProps {
    decisionId: string;
    initialOutcome?: string;
    initialRating?: number;
}

export function OutcomeForm({ decisionId, initialOutcome, initialRating }: OutcomeFormProps) {
    const [status, setStatus] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [rating, setRating] = useState(initialRating || 5);

    async function handleUpdate(formData: FormData) {
        setStatus(null);
        setErrorMsg(null);

        const outcome = (formData.get('outcome') as string || '').trim();
        const success_rating = parseInt(formData.get('success_rating') as string) || 5;

        if (!outcome) {
            setErrorMsg('Please describe the outcome before saving.');
            setStatus('error');
            return;
        }

        try {
            const res = await fetch(`/api/decisions/${decisionId}/outcome`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ outcome, success_rating }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to update');

            setStatus('success');
            setTimeout(() => setStatus(null), 3000);
        } catch (e: any) {
            setErrorMsg(e.message || 'System error. Please try again.');
            setStatus('error');
        }
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                How did it go?
            </h3>

            <form action={handleUpdate} className="space-y-6">
                <div>
                    <label htmlFor="success_rating" className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                        How successful was it? ({rating}/10)
                    </label>
                    <input
                        type="range"
                        id="success_rating"
                        name="success_rating"
                        min="1"
                        max="10"
                        value={rating}
                        onChange={(e) => setRating(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>

                <div>
                    <label htmlFor="outcome" className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                        What happened?
                    </label>
                    <textarea
                        id="outcome"
                        name="outcome"
                        rows={4}
                        defaultValue={initialOutcome || ''}
                        placeholder="Describe what happened..."
                        className="w-full border border-gray-200 rounded-lg p-4 text-sm text-gray-700 bg-gray-50/50 focus:bg-white focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all placeholder:text-gray-300"
                    ></textarea>
                </div>

                <SubmitButton
                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all active:scale-[0.98]"
                    loadingText="Saving..."
                >
                    Save review
                </SubmitButton>

                {status === 'success' && (
                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest text-center animate-in fade-in duration-300">
                        Entry Updated Successfully
                    </p>
                )}
                {status === 'error' && (
                    <p className="text-[10px] text-red-600 font-bold uppercase tracking-widest text-center animate-in fade-in duration-300">
                        {errorMsg || 'System Error: Update Failed'}
                    </p>
                )}
            </form>
        </div>
    );
}
