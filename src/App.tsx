import { Routes, Route, Navigate } from 'react-router-dom';
import Garage from './pages/Garage';
import Winners from './pages/Winners';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="garage" />} />
        <Route path="/garage" element={<Garage />} />
        <Route path="/winners" element={<Winners />} />
      </Routes>
    </>
  );
}

export default App;
