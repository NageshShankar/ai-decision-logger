import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { callHuggingFace } from '@/lib/ai-service'

export async function POST() {
    try {
        const cookieStore = await cookies()

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { cookies: { getAll() { return cookieStore.getAll() } } }
        )

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        // Fetch last 20 decisions for pattern analysis
        const { data: history, error: dbError } = await supabase
            .from('decisions')
            .select('title, category, decision_taken, constraints, outcome, success_rating')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(20)

        if (dbError) {
            console.error('[AnalyzePatterns] DB Error:', dbError.message);
            return NextResponse.json({ error: "Failed to fetch history for analysis." }, { status: 500 });
        }

        if (!history || history.length === 0) {
            return NextResponse.json({ error: 'No decisions found to analyze. Please log at least one decision first.' }, { status: 404 })
        }

        const historyText = history.map(d =>
            `- [${d.category || 'General'}] ${d.title}: ${d.decision_taken} (Constraints: ${d.constraints || 'None'}) (Rating: ${d.success_rating ?? 'N/A'})`
        ).join('\n')

        const prompt = `System Instruction: "You are a behavioral psychologist and strategic coach."

Analyze these decisions for patterns:
${historyText}

Provide:
1. Category Distribution: Where is the focus?
2. Common Constraints: What usually holds them back?
3. Risk Tendencies: Are they cautious or bold?
4. Strategic Biases: Any recurring logical fallacies?
5. Consistency Score: (0-100)
6. Summary Insights: One powerful sentence for growth.

Answer concisely and strategically.`;

        const analysis = await callHuggingFace(prompt, 600);

        return NextResponse.json({ analysis })

    } catch (error: any) {
        console.error('[AnalyzePatterns] Root Error:', error.message);
        return NextResponse.json(
            { error: "Analysis service encountered an error." },
            { status: 500 }
        );
    }
}
