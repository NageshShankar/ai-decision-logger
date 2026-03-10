import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-black text-white">
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
          AI Decision Logger
        </div>
        <div className="space-x-4">
          <Link href="/login" className="px-4 py-2 hover:text-blue-300 transition">
            Login
          </Link>
          <Link
            href="/signup"
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-full font-medium transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
          Master Your Decisions <br />
          <span className="text-indigo-400">Powered by Clarity</span>
        </h1>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Log, track, and analyze your critical choices. Built for high-performers who want to eliminate decision fatigue and document their growth.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/signup"
            className="px-8 py-4 bg-white text-indigo-900 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-xl"
          >
            Start Logging Free
          </Link>

        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Secure Storage', desc: 'Protected by Supabase RLS policies.' },
            { title: 'Contextual Logs', desc: 'Capture constraints, reasons, and context.' },
            { title: 'Historical Audit', desc: 'Review past decisions to improve future outcomes.' },
          ].map((feature) => (
            <div key={feature.title} className="p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
