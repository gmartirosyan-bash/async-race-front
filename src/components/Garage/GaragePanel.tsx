import { Link } from 'react-router-dom';

interface GaragePanelProps {
  handleAddCar: (e: React.FormEvent) => void;
  setName: (val: string) => void;
  setColor: (val: string) => void;
  name: string;
  color: string;
}

export default function GaragePanel({
  handleAddCar,
  setName,
  setColor,
  name,
  color,
}: GaragePanelProps) {
  return (
    <div className="mt-10 bg-[url('/Async-race.png')]  bg-center bg-no-repeat bg-contain h-70">
      <div className="ml-10">
        <Link
          to="/winners"
          className="inline-block bg-transparent p-4 mr-5 mb-5 text-red-500
            border-2 border-red-400 outline-2 outline-red-700 rounded-2xl"
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
        <div className="mb-5">
          <button className="py-1 px-2 mr-6 rounded-md">Race</button>
          <button className="py-1 px-2 mr-6 rounded-md">Reset</button>
          <button className="py-1 px-2 mr-6 rounded-md">Generate Cars</button>
        </div>
        <div className="">
          <form onSubmit={handleAddCar}>
            <label htmlFor="car-name" className="sr-only">
              Car Name
            </label>
            <input
              className="mr-2 w-35 rounded px-2 py-1"
              id="car-name"
              placeholder="Enter car name"
              type="text"
              maxLength={20}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="car-color" className="sr-only">
              Car Color
            </label>
            <input
              className="w-6 h-6 mr-2 rounded cursor-pointer"
              id="car-color"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
            <button className="px-2 py-1 rounded-md" type="submit">
              Add Car
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
