import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CareerPathsHome from './pages/CareerPaths/CareerPathsHome';
import StreamCareers from './pages/CareerPaths/StreamCareers';
import CareerDetail from './pages/CareerPaths/CareerDetail';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/career-paths" element={<CareerPathsHome />} />
        <Route path="/career-paths/:stream" element={<StreamCareers />} />
        <Route path="/career-paths/:stream/:careerId" element={<CareerDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
