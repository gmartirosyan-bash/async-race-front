import { createPortal } from 'react-dom';
import { Crown } from 'lucide-react';
import type { CurrentWinner } from '../../types/types';

export default function WinnerMsg({ winner }: { winner: CurrentWinner }) {
  const MS_IN_SECOND = 1000;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-red-800/90 text-black font-bold text-5xl px-8 py-4 rounded-lg shadow-lg/80 shadow-amber-200 text-center space-y-6">
        <p className="text-yellow-400 flex justify-center gap-5 items-center">
          WINNER! <Crown size={60} />
        </p>
        <p className="text-black">{winner.name}</p>
        <p className="text-black">TIME: {Math.floor(winner.time) / MS_IN_SECOND} s</p>
      </div>
    </div>,
    document.body,
  );
}
