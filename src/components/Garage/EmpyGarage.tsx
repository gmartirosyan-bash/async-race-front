export default function EmptyGarage() {
  return (
    <div className="flex items-center justify-center my-40 font-bitcount ">
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl  text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800 drop-shadow-lg animate-pulse">
          GARAGE IS EMPTY
        </h1>
        <p className="mt-4 text-gray-300 text-lg">Start adding some cars to fill it up!</p>
      </div>
    </div>
  );
}
