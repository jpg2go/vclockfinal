import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AlarmClock from './components/AlarmClock';
import Footer from './components/Footer';
import Timer from './components/Timer';
import Stopwatch from './components/Stopwatch';
import WorldClock from './components/WorldClock';
import CustomTimer from './components/CustomTimer';
import CustomWorldClock from './components/CustomWorldClock';
import { HelmetProvider } from 'react-helmet-async';

// Debug component to log current route
const RouteDebugger = () => {
  const location = useLocation();
  console.log('Current route:', location.pathname);
  return null;
};

function App() {
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <HelmetProvider>
      <Router>
        <RouteDebugger />
        <div className={`min-h-screen flex flex-col bg-gray-100${darkMode ? ' dark' : ''} overflow-x-hidden`}>
          <Header darkMode={darkMode} toggleDarkMode={() => setDarkMode(dm => !dm)} />
          <div className="flex flex-1 flex-row">
            <Sidebar />
            <main className="flex-1 px-1 sm:px-2 md:px-4 lg:px-8 pt-2 md:pt-8">
              <Suspense fallback={<div className="flex justify-center items-center h-full text-lg">Loading...</div>}>
                <Routes>
                  <Route path="/" element={<AlarmClock />} />
                  <Route path="/alarm" element={<AlarmClock />} />
                  <Route path="/timer" element={<Timer />} />
                  <Route path="/stopwatch" element={<Stopwatch />} />
                  <Route path="/time" element={<WorldClock />} />
                  <Route path="/time/:city" element={<CustomWorldClock />} />
                  <Route path="/time/:city/:region" element={<CustomWorldClock />} />
                  <Route path="/test-timer" element={<CustomTimer />} />
                  <Route path="*" element={<CustomTimer />} />
                </Routes>
              </Suspense>
            </main>
          </div>
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;