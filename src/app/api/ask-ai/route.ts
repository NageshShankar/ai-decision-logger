import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { callHuggingFace } from '@/lib/ai-service'

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({}));
        const { question, mode } = body;

        if (!question?.trim()) {
            return NextResponse.json({ error: 'Question is required' }, { status: 400 });
        }

        const cookieStore = await cookies()

        // 1. Authenticate user session
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { cookies: { getAll() { return cookieStore.getAll() } } }
        )
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let prompt = "";

        if (mode === 'general') {
            prompt = `System Instruction: "You are a helpful assistant answering general knowledge questions concisely."\n\nQuestion: ${question}`;
        } else {
            // DECISION MODE: Fetch relevant decisions (Limit 5 for better context)
            const supabaseAdmin = createServerClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!,
                { cookies: { getAll() { return [] }, setAll() { } } }
            )

            const { data: decisions, error: dbError } = await supabaseAdmin
                .from('decisions')
                .select('title, created_at, decision_taken, reason, context, constraints, outcome, success_rating')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(5);

            if (dbError) {
                console.error('[AskAI] DB Error:', dbError.message);
                return NextResponse.json({ error: "Could not retrieve your decision history." }, { status: 500 });
            }

            if (!decisions || decisions.length === 0) {
                return NextResponse.json({
                    answer: "You haven't logged any decisions yet. Once you log a choice, I can help you analyze your reasoning patterns and outcomes!"
                });
            }

            // Format Decision Data
            const decisionContext = decisions.map(d => ({
                title: d.title,
                date: d.created_at ? new Date(d.created_at).toLocaleDateString() : 'N/A',
                decision_taken: d.decision_taken,
                reason: d.reason || 'N/A',
                context: d.context || 'N/A',
                constraints: d.constraints || 'N/A',
                outcome: d.outcome || 'Pending',
                success_rating: d.success_rating ?? 'N/A'
            }));

            prompt = `System Instruction:
"You are a strategic decision analyst. Use the provided decision history to answer the user's question. 
If the question is unrelated to the data, answer based on general wisdom but mention you are doing so.
Keep answers concise, objective, and insightful."

Decision Data:
${JSON.stringify(decisionContext, null, 2)}

Question:
${question}`;
        }

        const finalAnswer = await callHuggingFace(prompt);

        // Persistent chat history
        try {
            const supabaseAdmin = createServerClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!,
                { cookies: { getAll() { return [] }, setAll() { } } }
            )
            await supabaseAdmin.from('decision_chats').insert([
                { user_id: user.id, message: question, role: 'user' },
                { user_id: user.id, message: finalAnswer, role: 'assistant' }
            ]);
        } catch (chatError) {
            console.error("[AskAI] Chat history save failed (non-critical):", chatError);
        }

        return NextResponse.json({ answer: finalAnswer });

    } catch (error: any) {
        console.error('[AskAI] Root Error:', error.message);
        return NextResponse.json(
            { error: error.message || "An unexpected error occurred." },
            { status: 500 }
        );
    }
}
