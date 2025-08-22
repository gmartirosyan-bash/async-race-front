import { createPortal } from 'react-dom';
import type { Winner } from '../types/types';

export default function WinnerMsg({ winner }: { winner: Winner }) {
  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white/60 text-black font-bold text-5xl px-8 py-4 rounded-lg shadow-lg text-center space-y-6">
        <p className="text-red-700">WINNER!</p>
        <p className="text-black">{winner.name}</p>
        <p className="text-black">TIME: {Math.floor(winner.duration / 10) / 100} s</p>
      </div>
    </div>,
    document.body,
  );
}
