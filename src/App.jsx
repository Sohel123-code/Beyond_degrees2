import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CareerPathsHome from './pages/CareerPaths/CareerPathsHome';
import StreamCareers from './pages/CareerPaths/StreamCareers';
import CareerDetail from './pages/CareerPaths/CareerDetail';
import ConceptHub from './pages/ConceptHub/ConceptHub';
import ConceptCategory from './pages/ConceptHub/ConceptCategory';
import GradBuddy from './pages/GradBuddy/GradBuddy';
import MockInterviewPage from './pages/MockInterviewPage';
import FloatingBuddy from './components/FloatingBuddy';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Recommendations from './pages/Recommendations/Recommendations';
import CareerAdviceDetail from './pages/Recommendations/CareerDetail';
import ProtectedRoute from './components/ProtectedRoute';
import useAnimations from './hooks/useAnimations';
import './App.css';

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const { initAnimations, animatePageIn } = useAnimations();

  useEffect(() => {
    animatePageIn();
    initAnimations(); // Re-scan for elements on new page
    window.scrollTo(0, 0);
  }, [location.pathname, initAnimations, animatePageIn]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<HomePage />} />

        {/* Protected Routes */}
        <Route path="/career-paths" element={
          <ProtectedRoute>
            <CareerPathsHome />
          </ProtectedRoute>
        } />
        <Route path="/career-paths/:stream" element={
          <ProtectedRoute>
            <StreamCareers />
          </ProtectedRoute>
        } />
        <Route path="/career-paths/:stream/:careerId" element={
          <ProtectedRoute>
            <CareerDetail />
          </ProtectedRoute>
        } />
        <Route path="/concept-hub" element={
          <ProtectedRoute>
            <ConceptHub />
          </ProtectedRoute>
        } />
        <Route path="/concept-hub/:categoryId" element={
          <ProtectedRoute>
            <ConceptCategory />
          </ProtectedRoute>
        } />
        <Route path="/gradbuddy" element={
          <ProtectedRoute>
            <GradBuddy />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/recommendations" element={
          <ProtectedRoute>
            <Recommendations />
          </ProtectedRoute>
        } />
        <Route path="/career-advice/:careerTitle" element={
          <ProtectedRoute>
            <CareerAdviceDetail />
          </ProtectedRoute>
        } />
        <Route path="/mock-interview" element={
          <ProtectedRoute>
            <MockInterviewPage />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <FloatingBuddy />
    </div>
  );
}

export default App;
