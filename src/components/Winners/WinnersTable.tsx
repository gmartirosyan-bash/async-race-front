import { useAppSelector } from '../../redux/hooks';

export default function WinnersTable() {
  const cars = useAppSelector((state) => state.garage.cars);

  return (
    <div className="overflow-x-auto mt-20">
      <table className="min-w-full border-collapse border border-neutral-700 text-neutral-200">
        <thead className="bg-neutral-800 text-left">
          <tr>
            <th className="border border-neutral-700 px-4 py-2">ID</th>
            <th className="border border-neutral-700 px-4 py-2">Name</th>
            <th className="border border-neutral-700 px-4 py-2">Color</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car.id} className="hover:bg-neutral-900">
              <td className="border border-neutral-700 px-4 py-2">{car.id}</td>
              <td className="border border-neutral-700 px-4 py-2">{car.name}</td>
              <td className="border border-neutral-700 px-4 py-2">
                <span
                  className="inline-block w-5 h-5 rounded-full mr-2"
                  style={{ backgroundColor: car.color }}
                />
                {car.color}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
