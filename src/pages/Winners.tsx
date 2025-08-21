import { Link } from 'react-router-dom';

export default function Winners() {
  return (
    <>
      <Link
        to="/winners"
        className="inline-block bg-transparent p-4 mr-5 mb-11 text-red-500
            border-1 ring-3 ring-red-700 border-red-700 outline-2 outline-red-400 rounded-2xl"
      >
        TO WINNERS
      </Link>
      <Link
        to="/garage"
        className="inline-block bg-transparent p-4 text-blue-500
            border-2 border-blue-400 outline-2 outline-blue-700 rounded-2xl"
      >
        TO GARAGE
      </Link>
    </>
  );
}
