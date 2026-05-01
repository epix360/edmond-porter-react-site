import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-6xl font-serif text-white mb-4">404</h1>
      <h2 className="text-2xl text-orange-400 mb-8">Page Not Found</h2>
      <p className="text-gray-300 mb-8 max-w-md">
        We couldn't find the page you were looking for. It may have been moved, or the URL might be incorrect.
      </p>
      <Link 
        href="/"
        className="px-6 py-3 bg-orange-700 hover:bg-orange-600 text-white rounded transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
