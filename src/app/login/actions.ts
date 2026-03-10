'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { headers } from 'next/headers'

export async function login(formData: FormData) {
    try {
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        if (!email || !password) {
            return { error: "Email and password are required." }
        }

        const supabase = await createClient()

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            console.error('Login error:', error.message)
            return { error: error.message }
        }
    } catch (e: any) {
        console.error('Unhandled login error:', e)
        return { error: "Login failed. Please verify your credentials." }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signInWithGoogle() {
    const supabase = await createClient()
    const origin = (await headers()).get('origin')

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${origin}/auth/callback`,
        },
    })

    if (error) {
        console.error('Google Sign-in error:', error.message)
        return { error: error.message }
    }

    if (data.url) {
        redirect(data.url)
    }
}
