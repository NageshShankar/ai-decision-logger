"use client";
import { useState } from "react";
import { signup } from "./actions";
import Link from "next/link";
import { SubmitButton } from "@/components/SubmitButton";

export default function Signup() {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    async function handleSignup(formData: FormData) {
        setError(null);
        const result = await signup(formData);

        if (result?.error) {
            setError(result.error);
        } else {
            setSuccess(true);
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl text-center">
                    <div className="bg-green-50 rounded-full p-4 inline-block mb-4">
                        <svg className="h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">Check your email</h2>
                    <p className="mt-4 text-gray-600">
                        We've sent a confirmation link to your email address. Please verify your account to continue.
                    </p>
                    <div className="mt-8">
                        <Link href="/login" className="text-indigo-600 font-bold hover:text-indigo-500">
                            Go to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Sign in instead
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" action={handleSignup}>
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
                            loadingText="Creating account..."
                        >
                            Create Account
                        </SubmitButton>
                    </div>
                </form>
            </div>
        </div>
    );
}

