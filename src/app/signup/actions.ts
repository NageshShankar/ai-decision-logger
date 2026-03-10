'use server'

import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'

export async function signup(formData: FormData) {
    try {
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        if (!email || !password) {
            return { error: "Email and password are required." }
        }

        if (password.length < 6) {
            return { error: "Password must be at least 6 characters long." }
        }

        const supabase = await createClient()
        const origin = (await headers()).get('origin')

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${origin}/auth/callback`,
            },
        })

        if (error) {
            console.error('Signup error:', error.message)
            return { error: error.message }
        }

        // If identities is an empty array, it means the user already exists 
        // (security feature of Supabase to prevent email enumeration)
        if (data.user && data.user.identities && data.user.identities.length === 0) {
            return { error: "An account with this email already exists." }
        }

        return { success: true }
    } catch (e: any) {
        console.error('Unhandled signup error:', e)
        return { error: "A system error occurred. Please try again later." }
    }
}
