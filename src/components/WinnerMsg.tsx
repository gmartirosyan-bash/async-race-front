import type { Winner } from '../types/car';

export default function WinnerMsg({ winner }: { winner: Winner }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50 pointer-events-none">
      <div className="bg-white/70 text-black font-bold text-5xl px-8 py-4 rounded-lg shadow-lg text-center space-y-6">
        <p className="text-red-700">WINNER!</p>
        <p className="text-black">{winner.name}!</p>
        <p className="text-black">TIME: {Math.floor(winner.duration / 10)} s</p>
      </div>
    </div>
  );
}
