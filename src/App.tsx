import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Garage from './pages/Garage';
import Winners from './pages/Winners';
import NotFound from './components/UI/NotFound';
import MainLayout from './layouts/MainLayout';
import LoadingIndicator from './components/UI/LoadingIndicator';

function App() {
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (showLoading) return <LoadingIndicator />;

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/garage" />} />

      <Route element={<MainLayout />}>
        <Route path="garage" element={<Garage />} />
        <Route path="winners" element={<Winners />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
