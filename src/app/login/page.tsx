"use client";
import { useState } from "react";
import { login, signInWithGoogle } from "./actions";
import Link from "next/link";
import { SubmitButton } from "@/components/SubmitButton";

export default function Login() {
    const [error, setError] = useState<string | null>(null);

    async function handleLogin(formData: FormData) {
        setError(null);
        const result = await login(formData);
        if (result?.error) {
            setError(result.error);
        }
    }

    async function handleGoogleLogin() {
        const result = await signInWithGoogle();
        if (result?.error) {
            setError(result.error);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                            create a new account
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" action={handleLogin}>
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded text-sm text-red-700">
                            {error}
                        </div>
                    )}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <input
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div>
                        <SubmitButton
                            className="w-full py-3 px-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition"
                            loadingText="Signing in..."
                        >
                            Sign in
                        </SubmitButton>
                    </div>

                    <div className="relative my-6 text-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <span className="relative px-4 text-xs font-bold text-gray-400 uppercase tracking-widest bg-white">
                            Or continue with
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-100 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 1.1.16z"
                                fill="#EA4335"
                            />
                        </svg>
                        Google
                    </button>
                </form>
            </div>
        </div>
    );
}

