export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          OpenBudget.ID
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Making every public fund traceable, auditable, and transparent
        </p>
        <p className="text-md text-gray-500">
          Powered by Solana • Built for Indonesian Transparency
        </p>
        <div className="mt-12 space-x-4">
          <a
            href="/projects"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            View Projects
          </a>
          <a
            href="/admin"
            className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition"
          >
            Ministry Login
          </a>
        </div>
      </div>
    </div>
  );
}
