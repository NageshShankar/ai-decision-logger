import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { callHuggingFace } from '@/lib/ai-service'

export async function POST(request: Request) {
    try {
        const { title, decision_taken, reason, context, constraints } = await request.json()
        const cookieStore = await cookies()

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { cookies: { getAll() { return cookieStore.getAll() } } }
        )

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const prompt = `Role: Senior Product Strategist.
Analyze this decision:
Title: ${title}
Decision: ${decision_taken}
Reason: ${reason}
Context: ${context}
Constraints: ${constraints}

STRICT OUTPUT FORMAT: Return ONLY a JSON object. No markdown. No commentary. No greetings.
{
  "risk": "One clear critical risk (max 20 words)",
  "missing_factor": "One important missing consideration (max 20 words)",
  "improvement": "One strong improvement suggestion (max 20 words)",
  "alternative": "One alternative approach (max 20 words)"
}`;

        const content = await callHuggingFace(prompt, 300);

        let parsedContent;
        try {
            // Support models that might wrap JSON in backticks
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                parsedContent = JSON.parse(jsonMatch[0]);
            } else {
                parsedContent = JSON.parse(content);
            }
        } catch (e) {
            console.error('Failed to parse AI JSON:', content);
            return NextResponse.json({
                error: 'AI failed to provide structured data.'
            }, { status: 500 });
        }

        return NextResponse.json({ analysis: parsedContent })

    } catch (error: any) {
        console.error('[ImproveDecision] Root Error:', error.message);
        return NextResponse.json(
            { error: error.message || "AI service encountered an error." },
            { status: 500 }
        );
    }
}
