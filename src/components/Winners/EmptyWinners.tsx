export default function EmptyWinners() {
  return (
    <div className="flex items-center justify-center my-40 font-bitcount ">
      <div className="text-center">
        <h1
          className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800 
          drop-shadow-lg animate-pulse text-5xl md:text-6xl"
        >
          NO WINNERS YET
        </h1>
        <p className="mt-4 text-gray-300 text-lg">Race some cars and watch the leaderboard grow!</p>
      </div>
    </div>
  );
}
