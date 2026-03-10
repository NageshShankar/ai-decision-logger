import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json().catch(() => ({}));
        const { outcome, success_rating } = body

        if (!id) {
            return NextResponse.json({ error: 'Decision ID is required' }, { status: 400 })
        }

        const cookieStore = await cookies()

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { cookies: { getAll() { return cookieStore.getAll() } } }
        )

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { error } = await supabase
            .from('decisions')
            .update({
                outcome: outcome?.trim() || 'No outcome documented',
                success_rating: Number(success_rating) || 5
            })
            .eq('id', id)
            .eq('user_id', user.id)

        if (error) {
            console.error('[OutcomeUpdate] DB Error:', error.message);
            return NextResponse.json({ error: "Failed to update decision outcome." }, { status: 500 });
        }

        return NextResponse.json({ success: true })

    } catch (error: any) {
        console.error('[OutcomeUpdate] Root Error:', error.message);
        return NextResponse.json({ error: "System error during update." }, { status: 500 })
    }
}
