import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { AddDecisionForm } from '@/components/AddDecisionForm';

export default async function AddDecisionPage() {
    async function addDecision(formData: FormData) {
        'use server';

        try {
            const supabase = await createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                redirect('/login');
            }

            const title = (formData.get('title') as string || '').trim();
            const category = formData.get('category') as string || 'General';
            const decision_taken = (formData.get('decision_taken') as string || '').trim();
            const reason = (formData.get('reason') as string || '').trim();
            const context = (formData.get('context') as string || '').trim();
            const constraints = (formData.get('constraints') as string || '').trim();

            if (!title || !decision_taken) {
                return { error: "Headline and Decision details are required." };
            }

            if (title.length > 200) {
                return { error: "Headline is too long (max 200 chars)." };
            }

            const { error } = await supabase.from('decisions').insert({
                user_id: user.id,
                title,
                category,
                decision_taken,
                reason,
                context,
                constraints,
            });

            if (error) {
                console.error('[AddDecision] DB Error:', error.message);
                return { error: "Database failed to save your decision. Please try again." };
            }
        } catch (e: any) {
            console.error('[AddDecision] Unhandled Error:', e.message);
            return { error: "An unexpected system error occurred." };
        }

        revalidatePath('/dashboard');
        redirect('/dashboard');
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Log a decision</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Document your reasoning to help the AI (and your future self) understand why this choice was made.
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <AddDecisionForm onSubmit={addDecision} />
            </div>
        </div>
    );
}
