import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import DashboardLayout from './components/DashboardLayout';
import Billing from './pages/Billing';
import Sites from './pages/Sites';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <ThemeProvider>
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route
          path="/*"
          element={
            <>
              <Sidebar 
                isMobileMenuOpen={isMobileMenuOpen} 
                onClose={() => setIsMobileMenuOpen(false)} 
              />
              <Navbar onMenuClick={toggleMobileMenu} />
              <DashboardLayout>
                <Routes>
                  <Route path="/billing" element={<Billing />} />
                  <Route path="/sites" element={<Sites />} />
                </Routes>
              </DashboardLayout>
            </>
          }
        />
      </Routes>
    </div>
    </ThemeProvider>
  );
}

export default App;