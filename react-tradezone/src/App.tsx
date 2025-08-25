import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { initializeAuth } from './redux/slices/authSlice';
import type { AppDispatch, RootState } from './redux/store';
import Login from './components/Login';
import Dashboard from './pages/dashboard';
import LiveChart from './components/LiveChart';
import './index.css';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Debug: Check localStorage
    const testToken = localStorage.getItem('testToken');
    const userData = localStorage.getItem('user');
    console.log('🔍 Debug - localStorage check:', { testToken: !!testToken, userData: !!userData });
    
    // Initialize authentication from localStorage on app start
    dispatch(initializeAuth());
  }, [dispatch]);

  // Debug: Log authentication state
  useEffect(() => {
    console.log('🔍 Debug - Auth state:', { isAuthenticated, user });
  }, [isAuthenticated, user]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/chart" 
            element={
              <ProtectedRoute>
                <LiveChart />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
