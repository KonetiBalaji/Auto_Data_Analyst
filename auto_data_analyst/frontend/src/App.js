import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AppProvider } from './context/AppContext';
import theme from './theme';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Notifications from './components/Notifications';
import Loading from './components/Loading';
import ErrorBoundary from './components/ErrorBoundary';
import Dashboard from './pages/Dashboard';
import DataUpload from './pages/DataUpload';
import Analysis from './pages/Analysis';
import Models from './pages/Models';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <div style={{ display: 'flex' }}>
              <Navbar />
              <Sidebar />
              <main
                style={{
                  flexGrow: 1,
                  padding: '24px',
                  marginTop: '64px',
                  marginLeft: '240px',
                }}
              >
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/data" element={<DataUpload />} />
                  <Route path="/analysis" element={<Analysis />} />
                  <Route path="/models" element={<Models />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </main>
            </div>
            <Notifications />
            <Loading />
          </Router>
        </ThemeProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App; 