import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { formatDate } from '@/utils/format';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: decisions, error } = await supabase
    .from('decisions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching decisions:', error);
    return (
      <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center">
        <h2 className="text-xl font-bold text-red-800 mb-2">Sync Error</h2>
        <p className="text-red-600">We couldn't load your decisions. Please check your connection and try refreshing the page.</p>
        <a
          href="/dashboard"
          className="mt-4 inline-block px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition"
        >
          Retry Sync
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Your Decisions</h1>
          <p className="mt-1 text-sm text-gray-600">
            A history of your documented reasoning and choices.
          </p>
        </div>
        <Link
          href="/dashboard/add-decision"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-bold rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Decision
        </Link>
      </div>

      {decisions && decisions.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {decisions.map((decision) => (
            <Link
              key={decision.id}
              href={`/dashboard/${decision.id}`}
              className="group relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
            >
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col gap-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 uppercase tracking-wider w-fit">
                      {formatDate(decision.created_at)}
                    </span>
                    {decision.category && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-widest w-fit">
                        {decision.category}
                      </span>
                    )}
                  </div>
                  <svg className="h-5 w-5 text-gray-300 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {decision.title}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                  {decision.decision_taken}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-50 flex items-center text-xs text-gray-400 font-medium">
                <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Last updated {formatDate(decision.created_at)}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <div className="bg-blue-50 rounded-full p-6 mb-4">
            <svg className="h-12 w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No decisions yet</h3>
          <p className="text-gray-500 max-w-xs text-center mb-8 text-sm">
            Start logging your important choices today to build a library of reasoning that the AI can help you analyze.
          </p>
          <Link
            href="/dashboard/add-decision"
            className="inline-flex items-center px-6 py-3 text-base font-bold rounded-xl text-blue-600 bg-blue-50 hover:bg-blue-100 transition"
          >
            Create your first entry
          </Link>
        </div>
      )}
    </div>
  );
}

