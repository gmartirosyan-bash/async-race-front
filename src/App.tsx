import { Routes, Route, Navigate } from 'react-router-dom';
import Garage from './pages/Garage';
import Winners from './pages/Winners';
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="garage" />} />

      <Route element={<MainLayout />}>
        <Route path="garage" element={<Garage />} />
        <Route path="winners" element={<Winners />} />
      </Route>
    </Routes>
  );
}

export default App;
