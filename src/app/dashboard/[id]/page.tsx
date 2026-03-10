import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { deleteDecision } from './actions';
import { OutcomeForm } from './OutcomeForm';

export default async function DecisionPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: decision } = await supabase
        .from('decisions')
        .select('*')
        .eq('id', id)
        .single();

    if (!decision) {
        notFound();
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <Link
                href="/dashboard"
                className="inline-flex items-center text-xs font-bold text-gray-400 hover:text-gray-600 transition uppercase tracking-widest mb-10 group"
            >
                <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
            </Link>

            {/* Header Section */}
            <header className="mb-10">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${getCategoryStyles(decision.category)}`}>
                        {decision.category || 'General'}
                    </span>
                    <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                        Logged on {new Date(decision.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{decision.title}</h1>
            </header>

            <div className="space-y-12">
                {/* Main Details Card */}
                <section className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Choice made</h2>
                                    <p className="text-base text-gray-800 leading-relaxed font-medium bg-gray-50 p-6 rounded-lg border border-gray-100">
                                        {decision.decision_taken}
                                    </p>
                                </div>
                                {decision.reason && (
                                    <div>
                                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Why this choice?</h2>
                                        <p className="text-sm text-gray-600 leading-relaxed font-normal">{decision.reason}</p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-8">
                                {decision.context && (
                                    <div>
                                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Background</h2>
                                        <p className="text-sm text-gray-600 leading-relaxed font-normal">{decision.context}</p>
                                    </div>
                                )}
                                {decision.constraints && (
                                    <div>
                                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Rules or limits</h2>
                                        <p className="text-sm text-gray-600 leading-relaxed font-normal">{decision.constraints}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Footer */}
                        <div className="mt-12 pt-8 border-t border-gray-100 flex justify-end gap-6">
                            <form action={async () => {
                                'use server';
                                await deleteDecision(decision.id);
                            }}>
                                <button className="text-xs font-bold text-red-400 hover:text-red-500 transition uppercase tracking-widest underline underline-offset-4">
                                    Remove Log
                                </button>
                            </form>
                        </div>
                    </div>
                </section>

                {/* AI Tools Section */}
                <section>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-px bg-gray-200 flex-1"></div>
                        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">AI Support</h2>
                        <div className="h-px bg-gray-200 flex-1"></div>
                    </div>
                    <OutcomeForm
                        decisionId={decision.id}
                        initialOutcome={decision.outcome}
                        initialRating={decision.success_rating}
                    />
                </section>
            </div>
        </div>
    );
}

function getCategoryStyles(category: string) {
    switch (category) {
        case 'Strategic': return 'bg-blue-600 text-white border-transparent';
        case 'Technical': return 'bg-white border-gray-200 text-gray-600';
        case 'Financial': return 'bg-white border-gray-200 text-gray-600';
        case 'Personal': return 'bg-white border-gray-200 text-gray-600';
        default: return 'bg-white border-gray-200 text-gray-400';
    }
}
