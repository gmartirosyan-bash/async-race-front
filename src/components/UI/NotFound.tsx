import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-8xl font-bold text-red-800 mb-4">404</h1>
        <h2 className="text-4xl md:text-3xl font-semibold text-red-700 mb-2">Page Not Found</h2>
        <p className="text-white text-2xl my-8">
          Sorry, the page you’re looking for doesn’t exist.
        </p>
        <Link
          to="/"
          className="font-semibold text-2xl mt-4 bg-red-800 px-4 pt-2 pb-3 active:scale-95 rounded hover:bg-red-900 hover:cursor-pointer active:bg-red-700"
        >
          Go Home
        </Link>
      </div>
    </>
  );
}
