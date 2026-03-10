'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
    {
        name: 'Log a decision',
        href: '/dashboard/add-decision',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
        ),
    },
    {
        name: 'Ask AI',
        href: '/dashboard/ask-ai',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
        ),
    },
    {
        name: 'My Trends',
        href: '/dashboard/patterns',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
    },
];

export function Sidebar({ userEmail }: { userEmail?: string }) {
    const pathname = usePathname();

    return (
        <div className="flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen">
            <div className="flex items-center justify-center h-16 border-b border-gray-200">
                <Link href="/dashboard" className="text-xl font-bold text-blue-600">
                    AI Decision Logger
                </Link>
            </div>
            <div className="flex flex-col flex-1 overflow-y-auto">
                <nav className="flex-1 px-4 py-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <span className={`mr-3 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                                    {item.icon}
                                </span>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                            {userEmail?.[0].toUpperCase() || 'U'}
                        </div>
                    </div>
                    <div className="ml-3 overflow-hidden">
                        <p className="text-sm font-medium text-gray-700 truncate">{userEmail}</p>
                    </div>
                </div>
                <form action="/auth/signout" method="post">
                    <button
                        type="submit"
                        className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
                    >
                        <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                    </button>
                </form>
            </div>
        </div>
    );
}
