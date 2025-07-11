import React, { useState, useRef, useEffect } from 'react';
import { Share2, Plus, Maximize2, Minimize2, ZoomIn, ZoomOut, X } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Stopwatch: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [laps, setLaps] = useState<{ time: number; label: string }[]>([]);
  const [fontSize, setFontSize] = useState(144);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLapModal, setShowLapModal] = useState(false);
  const [lapLabel, setLapLabel] = useState('');
  const [lapTime, setLapTime] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setElapsed((prev) => prev + 100);
      }, 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const centiseconds = Math.floor((ms % 1000) / 10);
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 60000) % 60);
    const hours = Math.floor(ms / 3600000);
    return `${hours > 0 ? String(hours).padStart(2, '0') + ':' : ''}${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
  };
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    }).toUpperCase();
  };
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLap = () => {
    setLapTime(elapsed);
    setLapLabel('');
    setShowLapModal(true);
  };

  const saveLap = () => {
    setLaps((prev) => [
      { time: lapTime, label: lapLabel || `Lap ${prev.length + 1}` },
      ...prev,
    ]);
    setShowLapModal(false);
  };

  const reset = () => {
    setIsRunning(false);
    setElapsed(0);
    setLaps([]);
  };

  const increaseFontSize = () => setFontSize((f) => Math.min(f + 16, 256));
  const decreaseFontSize = () => setFontSize((f) => Math.max(f - 16, 64));

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        const clockElement = document.getElementById('stopwatch-display');
        if (clockElement) {
          await clockElement.requestFullscreen();
        }
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Free Online Stopwatch with Lap Timer | Track Time Instantly</title>
        <meta name="description" content="Free online stopwatch with lap recording. Perfect for workouts, sports timing, study sessions, and productivity tracking. Works on all devices, no signup needed." />
        <link rel="canonical" href="https://vclock.app/stopwatch" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Free Online Stopwatch with Lap Timer | Track Time Instantly" />
        <meta property="og:description" content="Free online stopwatch with lap recording. Perfect for workouts, sports timing, study sessions, and productivity tracking. Works on all devices, no signup needed." />
        <meta property="og:url" content="https://vclock.app/stopwatch" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Online Stopwatch with Lap Timer | Track Time Instantly" />
        <meta name="twitter:description" content="Free online stopwatch with lap recording. Perfect for workouts, sports timing, study sessions, and productivity tracking. Works on all devices, no signup needed." />
      </Helmet>
      {/* Lap Modal */}
      {showLapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 transition-opacity duration-300 p-2 sm:p-4">
          <div className="bg-white rounded-xl max-w-md w-full mx-2 sm:mx-4 shadow-2xl border border-gray-200 transform transition-all duration-300 scale-100 opacity-100 animate-alarm-modal-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-4 sm:px-8 py-3 sm:py-5 rounded-t-xl" style={{ backgroundColor: '#0090DD' }}>
              <h2 className="text-xl sm:text-2xl font-light text-white">Lap Name</h2>
              <button onClick={() => setShowLapModal(false)} className="text-white hover:text-blue-100 text-xl sm:text-2xl flex items-center justify-center w-8 h-8 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-white" aria-label="Close">
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="px-4 sm:px-8 pt-4 sm:pt-8 pb-0 space-y-4 sm:space-y-8">
              <input
                type="text"
                value={lapLabel}
                onChange={(e) => setLapLabel(e.target.value)}
                placeholder="Lap label"
                className="w-full h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base font-normal border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-end px-4 sm:px-8 py-3 sm:py-5 border-t bg-gray-50 rounded-b-xl mt-2 gap-3 sm:gap-0">
              <button onClick={() => setShowLapModal(false)} className="w-full sm:w-24 h-10 border border-gray-300 rounded bg-white text-sm sm:text-base font-normal hover:bg-gray-100 sm:mr-4">Cancel</button>
              <button onClick={saveLap} className="w-full sm:w-24 h-10 bg-green-500 text-white text-sm sm:text-base font-normal rounded hover:bg-green-600">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Stopwatch Display */}
      <div 
        id="stopwatch-display"
        className={
          isFullscreen
            ? 'fixed inset-0 z-50 flex flex-col justify-center items-center bg-black text-white border-0 text-center'
            : 'bg-white dark:bg-black border-b border-gray-200 text-center relative p-4 sm:p-8 lg:p-12'
        }
      >
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex space-x-1 sm:space-x-2">
          <button onClick={decreaseFontSize} className={`p-2 rounded transition-colors ${isFullscreen ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-100 text-gray-600'}`} title="Decrease font size">
            <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button onClick={increaseFontSize} className={`p-2 rounded transition-colors ${isFullscreen ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-100 text-gray-600'}`} title="Increase font size">
            <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button className={`p-2 rounded transition-colors ${isFullscreen ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-100 text-gray-600'}`}><Share2 className="w-4 h-4 sm:w-5 sm:h-5" /></button>
          <button onClick={toggleFullscreen} className={`p-2 rounded transition-colors ${isFullscreen ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-100 text-gray-600'}`} title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
            {isFullscreen ? <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
        <div className={isFullscreen ? '' : 'mt-4'}>
          <div 
            className={`font-light mb-4 tracking-tight leading-none flex items-baseline justify-center font-nunito ${
              isFullscreen ? 'text-gray-600' : 'text-gray-600'
            }`}
            style={{ 
              fontSize: `${Math.round(isFullscreen ? fontSize * 1.5 : Math.min(fontSize, window.innerWidth * 0.15))}px`,
              fontWeight: 900,
              color: isFullscreen ? '#fff' : '#555555',
              letterSpacing: '0.04em',
              textAlign: 'center',
            }}
          >
            <span>{formatTime(elapsed)}</span>
          </div>
          <div className="tracking-wide font-medium font-bold mt-4 sm:mt-6 font-nunito" style={{
            fontSize: isFullscreen ? '1.5rem' : 'clamp(0.875rem, 3vw, 1rem)',
            color: '#555555',
            letterSpacing: '0.18em',
            textAlign: 'center',
            textTransform: 'uppercase',
            fontWeight: 900,
          }}>
            {formatDate(currentTime)}
          </div>
        </div>
        {!isFullscreen && (
          <div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-2 sm:gap-4">
            <button onClick={() => setIsRunning((r) => !r)} className={`px-4 sm:px-8 py-2 sm:py-3 rounded-md font-medium text-white transition-colors shadow-sm text-sm sm:text-base ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>{isRunning ? 'Stop' : 'Start'}</button>
            <button onClick={reset} className="px-4 sm:px-8 py-2 sm:py-3 rounded-md font-medium bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors shadow-sm text-sm sm:text-base">Reset</button>
            <button onClick={handleLap} className="px-4 sm:px-8 py-2 sm:py-3 rounded-md font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors shadow-sm text-sm sm:text-base">Lap</button>
          </div>
        )}
      </div>

      {/* Laps List */}
      {!isFullscreen && laps.length > 0 && (
        <div className="p-3 sm:p-6">
          <div className="bg-white dark:bg-black rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-3 sm:mb-4">Laps</h3>
            <div className="space-y-2 sm:space-y-3">
              {laps.map((lap, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="text-sm sm:text-base font-medium">{lap.label}</div>
                  </div>
                  <div className="text-mono text-gray-700 text-sm sm:text-base">{formatTime(lap.time)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!isFullscreen && (
        <div className="p-4 sm:p-6 bg-white dark:bg-black mx-3 sm:mx-6 rounded-lg mt-6 sm:mt-12">
          <div className="space-y-2 sm:space-y-3 text-gray-600 text-xs sm:text-sm">
            <p>Looking for a fast, easy-to-use <strong>online stopwatch</strong>? You're in the right place. Our stopwatch tool is designed to be simple, accurate, and completely free. Whether you're timing a workout, tracking productivity, or just need a quick way to measure time, our digital stopwatch gets the job done — no downloads, no sign-ups.</p>
            <h2 className="text-sm sm:text-base font-semibold mt-4 sm:mt-6 mb-2">✅ Why Use Our Stopwatch Tool?</h2>
            <ul className="list-disc pl-4 sm:pl-6 space-y-1">
              <li><strong>Instant Start</strong> – Just press <strong>Start</strong> and you're timing in seconds.</li>
              <li><strong>User-Friendly Design</strong> – Clean layout that works on any device.</li>
              <li><strong>Pause & Reset Anytime</strong> – Full control with just a click.</li>
              <li><strong>Runs in Background</strong> – Switch tabs, we'll keep counting.</li>
              <li><strong>100% Free & Ad-Lite</strong> – No clutter, just what you need.</li>
            </ul>
            <h3 className="text-sm sm:text-base font-semibold mt-4 sm:mt-6 mb-2">🔍 What Can You Use This Stopwatch For?</h3>
            <p>Our stopwatch is perfect for all kinds of tasks:</p>
            <ul className="list-disc pl-4 sm:pl-6 space-y-1">
              <li><strong>Workouts & Fitness</strong> – Track intervals, rest times, or total workout duration.</li>
              <li><strong>Study Sessions</strong> – Stay focused with timed study blocks.</li>
              <li><strong>Games & Challenges</strong> – Time races, puzzles, or speed rounds.</li>
              <li><strong>Cooking & Baking</strong> – Keep an eye on exact prep or cook times.</li>
              <li><strong>Productivity</strong> – Use it with the Pomodoro technique or time blocking.</li>
            </ul>
            <h3 className="text-sm sm:text-base font-semibold mt-4 sm:mt-6 mb-2">🖥️ Works on Any Device</h3>
            <p>Whether you're on a desktop, tablet, or smartphone, our stopwatch adjusts to fit your screen. It's fully responsive and designed to work in all modern browsers—no app required.</p>
            <h3 className="text-sm sm:text-base font-semibold mt-4 sm:mt-6 mb-2">🔒 Private & Secure</h3>
            <p>Your time data stays on your device. We don't store your usage history, and there are no unnecessary permissions. Just open and go.</p>
            <h3 className="text-sm sm:text-base font-semibold mt-4 sm:mt-6 mb-2">⏱️ How to Use the Stopwatch</h3>
            <ol className="list-decimal pl-4 sm:pl-6 space-y-1">
              <li><strong>Click "Start"</strong> to begin timing.</li>
              <li><strong>Click "Pause"</strong> to stop the clock without resetting.</li>
              <li><strong>Click "Reset"</strong> to clear the timer.</li>
            </ol>
          </div>
        </div>
      )}
    </>
  );
};

export default Stopwatch;