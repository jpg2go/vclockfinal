import React, { useState, useRef, useEffect } from 'react';
import { Share2, Plus, Maximize2, Minimize2, ZoomIn, ZoomOut, X } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

const presetTimers = [
  { label: '1 Minute', value: 60 },
  { label: '2 Minutes', value: 120 },
  { label: '3 Minutes', value: 180 },
  { label: '4 Minutes', value: 240 },
  { label: '5 Minutes', value: 300 },
  { label: '6 Minutes', value: 360 },
  { label: '7 Minutes', value: 420 },
  { label: '8 Minutes', value: 480 },
  { label: '9 Minutes', value: 540 },
  { label: '10 Minutes', value: 600 },
  { label: '11 Minutes', value: 660 },
  { label: '12 Minutes', value: 720 },
  { label: '13 Minutes', value: 780 },
  { label: '14 Minutes', value: 840 },
  { label: '15 Minutes', value: 900 },
  { label: '16 Minutes', value: 960 },
  { label: '20 Minutes', value: 1200 },
  { label: '25 Minutes', value: 1500 },
  { label: '30 Minutes', value: 1800 },
  { label: '35 Minutes', value: 2100 },
  { label: '40 Minutes', value: 2400 },
  { label: '45 Minutes', value: 2700 },
  { label: '50 Minutes', value: 3000 },
  { label: '60 Minutes', value: 3600 },
  { label: '90 Minutes', value: 5400 },
  { label: '1 Second', value: 1 },
  { label: '2 Seconds', value: 2 },
  { label: '3 Seconds', value: 3 },
  { label: '5 Seconds', value: 5 },
  { label: '10 Seconds', value: 10 },
  { label: '15 Seconds', value: 15 },
  { label: '20 Seconds', value: 20 },
  { label: '21 Seconds', value: 21 },
  { label: '22 Seconds', value: 22 },
  { label: '23 Seconds', value: 23 },
  { label: '24 Seconds', value: 24 },
  { label: '25 Seconds', value: 25 },
  { label: '26 Seconds', value: 26 },
  { label: '27 Seconds', value: 27 },
  { label: '28 Seconds', value: 28 },
  { label: '29 Seconds', value: 29 },
  { label: '30 Seconds', value: 30 },
  { label: '31 Seconds', value: 31 },
  { label: '32 Seconds', value: 32 },
  { label: '33 Seconds', value: 33 },
  { label: '34 Seconds', value: 34 },
  { label: '35 Seconds', value: 35 },
  { label: '40 Seconds', value: 40 },
  { label: '45 Seconds', value: 45 },
  { label: '50 Seconds', value: 50 },
  { label: '90 Seconds', value: 90 },
  { label: '1 Hour', value: 3600 },
  { label: '2 Hours', value: 7200 },
  { label: '3 Hours', value: 10800 },
  { label: '4 Hours', value: 14400 },
  { label: '5 Hours', value: 18000 },
  { label: '6 Hours', value: 21600 },
  { label: '7 Hours', value: 25200 },
  { label: '8 Hours', value: 28800 },
  { label: '9 Hours', value: 32400 },
  { label: '10 Hours', value: 36000 },
  { label: '12 Hours', value: 43200 },
  { label: '18 Hours', value: 64800 },
  { label: '24 Hours', value: 86400 },
  { label: '48 Hours', value: 172800 },
  { label: '72 Hours', value: 259200 },
];

const recentlyUsed = [
  { label: '3 Minute Timer', value: 180 },
  { label: '8 Minute Timer', value: 480 },
  { label: '20 Minute Timer', value: 1200 },
];

function getTodayDateString() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).toUpperCase();
}

const Timer: React.FC = () => {
  console.log('Timer component rendering');
  const [selected, setSelected] = useState<number | null>(null);
  const [fontSize, setFontSize] = useState(144);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [timerHour, setTimerHour] = useState(0);
  const [timerMinute, setTimerMinute] = useState(1);
  const [timerSecond, setTimerSecond] = useState(0);
  // Add this array and function near the top of the component
  const soundFiles = [
    "Alarm_Clock_Bell.mp3",
    "Alarm_Clock.mp3",
    "Alarm_Fairee_Soiree.mp3",
    "Alarm_In_Camp.mp3",
    "Alarm_Soft.mp3",
    "Alarm_Tone.mp3",
    "Alarm.mp3",
    "Alarming.mp3",
    "Bach_Cello_Courante.mp3",
    "Beautiful_Piano.mp3",
    "Buzzer_Alarm_Clock_2.mp3",
    "Car_Alarm.mp3",
    "Cherry.mp3",
    "Classic_Alarm_Lg_78.mp3",
    "Classic_Alarm.mp3",
    "Classic_Bell.mp3",
    "Classicalarm.mp3",
    "Clock_Alert.mp3",
    "Cr7_Bom_Dia_Br.mp3",
    "Daybreak_Iphone_Alarm.mp3",
    "Dxd_Help_Me_Doctor.mp3",
    "Dxd_Morning_Wood.mp3",
    "Esser_Feueralarm.mp3",
    "File.mp3",
    "Fresh_Start_Pixel.mp3",
    "Funny_Car_Alarm.mp3",
    "Get_Up_And_Don_T_Tur.mp3",
    "Goodmorning_Alarm.mp3",
    "Har_Du_Vaknat.mp3",
    "Hop_Da_Electro.mp3",
    "Htc_Progressive.mp3",
    "Iphone_Alarm_Sound.mp3",
    "Kamen_Rider.mp3",
    "Kanye_West_Alarm.mp3",
    "La_Cucaracha.mp3",
    "Love_Connects_Alarm.mp3",
    "Lumia_Clock_Bells.mp3",
    "Mornig_Alarm_Piano.mp3",
    "Morning_Alarm.mp3",
    "Morning_Alarm_1.mp3",
    "Morning_Alarm_2.mp3",
    "Morning_Alert_Clock.mp3",
    "Motivation.mp3",
    "Multo_Cup_Of_Joe.mp3",
    "New_Lumia_Alarm.mp3",
    "Nice_Morning_Alarm.mp3",
    "Otter_Me_Alarm.mp3",
    "Polish_Army_Alarm.mp3",
    "Predator_Alarm.mp3",
    "Rain_Dance.mp3",
    "Romantic.mp3",
    "Seiya_Levantate.mp3",
    "Sica_Sweet_Delight.mp3",
    "Soft_Piano_Alarm.mp3",
    "Standart.mp3",
    "Transiberian_Orchestra.mp3",
    "Violin.mp3",
    "Wake_Up_Alarm.mp3",
    "Wake_Up_Sid.mp3",
    "Xperia_Seasons_Alarm.mp3"
  ];
  function getDisplayName(fileName: string) {
    return fileName
      .replace('.mp3', '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }
  // Set a valid default sound
  const [timerSound, setTimerSound] = useState("Alarm_Clock_Bell.mp3");
  const [timerRepeat, setTimerRepeat] = useState(false);
  const [timerLabel, setTimerLabel] = useState('');
  const timerDisplayRef = useRef<HTMLDivElement>(null);
  // Add currentTime state for live clock
  const [currentTime, setCurrentTime] = useState(new Date());
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const timersPerPage = 20;
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const increaseFontSize = () => setFontSize(f => Math.min(f + 16, 256));
  const decreaseFontSize = () => setFontSize(f => Math.max(f - 16, 64));

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        const el = document.getElementById('timer-display');
        if (el) await el.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (e) { console.error(e); }
  };

  const openTimerModal = () => {
    setShowTimerModal(true);
    setTimerHour(0);
    setTimerMinute(1);
    setTimerSecond(0);
    setTimerLabel('');
  };

  // Add formatTime and formatDate if not present
  const formatTime = (date: Date) => {
    const full = date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    const [time, ampm] = full.split(' ');
    return `${time.replace(/^0/, '')} ${ampm}`;
  };
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    }).toUpperCase();
  };

  // Timer countdown state and logic
  const [remaining, setRemaining] = useState(0); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  // Add these refs and state at the top of the component
  const beepIntervalRef = useRef<number | null>(null);
  const beepTimeoutRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isBeeping, setIsBeeping] = useState(false);
  // Add isFinished state at the top
  const [isFinished, setIsFinished] = useState(false);
  // Add this state at the top of the component
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);

  // Start timer
  const startTimer = () => {
    if (remaining > 0 && !isRunning) {
      setIsFinished(false);
      setIsRunning(true);
    } else if (remaining === 0) {
      // If no timer is set, open the modal to set one
      openTimerModal();
    }
  };
  // Pause timer
  const pauseTimer = () => {
    setIsRunning(false);
  };
  // Reset timer
  const resetTimer = () => {
    setIsRunning(false);
    setIsFinished(false);
    setRemaining(0);
  };
  // Set timer from modal or preset, with option to start immediately
  const setTimer = (seconds: number, start: boolean = false) => {
    setRemaining(seconds);
    setIsRunning(start);
  };

  // Countdown effect
  useEffect(() => {
    if (isRunning && remaining > 0) {
      intervalRef.current = window.setInterval(() => {
        setRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, remaining]);

  // When timer finishes, start beeping and notification
  useEffect(() => {
    if (isFinished) {
      if (timerSound) {
        startBeeping();
      }
      showNotification(); // Always call, let it handle permission logic
    }
    return () => {
      stopBeeping();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished]);

  // Format remaining time as HH:MM:SS (24-hour, no AM/PM)
  const formatCountdown = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return [h, m, s]
      .map((v, i) => (i === 0 ? v : String(v).padStart(2, '0')))
      .join(':');
  };

  const navigate = useNavigate();

  // Helper to convert seconds to slug (e.g., 60 -> '1-minute', 30 -> '30-seconds')
  const secondsToSlug = (seconds: number): string => {
    if (seconds % 3600 === 0) {
      const hours = seconds / 3600;
      return `${hours}-${hours === 1 ? 'hour' : 'hours'}`;
    }
    if (seconds % 60 === 0) {
      const minutes = seconds / 60;
      return `${minutes}-${minutes === 1 ? 'minute' : 'minutes'}`;
    }
    return `${seconds}-${seconds === 1 ? 'second' : 'seconds'}`;
  };

  // Handler for preset timer button click
  const handlePresetClick = (timer: { label: string; value: number }) => {
    const slug = secondsToSlug(timer.value);
    const path = `/set-timer-for-${slug}`; // Use hyphens for the slug format
    console.log('Navigating to:', path);
    navigate(path);
  };

  // Pagination logic
  const totalPages = Math.ceil(presetTimers.length / timersPerPage);
  const startIndex = (currentPage - 1) * timersPerPage;
  const endIndex = startIndex + timersPerPage;
  const currentTimers = presetTimers.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Helper to play the selected sound
  const playBeep = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    const src = `/sounds/${timerSound}`;
    const audio = new Audio(src);
    audioRef.current = audio;
    audio.volume = 1.0;
    audio.muted = false;
    audio.play();
  };

  // Stop beeping
  const stopBeeping = () => {
    setIsBeeping(false);
    if (beepIntervalRef.current) {
      clearInterval(beepIntervalRef.current);
      beepIntervalRef.current = null;
    }
    if (beepTimeoutRef.current) {
      clearTimeout(beepTimeoutRef.current);
      beepTimeoutRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  };

  // Start beeping for 1 minute
  const startBeeping = () => {
    setIsBeeping(true);
    playBeep();
    beepIntervalRef.current = window.setInterval(() => {
      playBeep();
    }, 2000); // Play every 2 seconds
    beepTimeoutRef.current = window.setTimeout(() => {
      stopBeeping();
    }, 60000); // Stop after 1 minute
  };

  // Show notification
  const showNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('Timer Finished!', {
        body: timerLabel ? timerLabel : 'Your timer has finished.',
        icon: '/vite.svg'
      });
    } else if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        setNotificationPermission(permission);
        if (permission === 'granted') {
          new Notification('Timer Finished!', {
            body: timerLabel ? timerLabel : 'Your timer has finished.',
            icon: '/vite.svg'
          });
        }
      });
    }
  };

  // Add this function to request permission
  const requestNotificationPermission = () => {
    Notification.requestPermission().then((permission) => {
      setNotificationPermission(permission);
    });
  };

  // Add this function inside the component
  const testAudioRef = useRef<HTMLAudioElement | null>(null);
  const testSound = () => {
    // Stop any currently playing test sound
    if (testAudioRef.current) {
      testAudioRef.current.pause();
      testAudioRef.current.currentTime = 0;
      testAudioRef.current = null;
    }
    const src = `/sounds/${timerSound}`;
    const audio = new Audio(src);
    testAudioRef.current = audio;
    audio.volume = 1.0;
    audio.muted = false;
    audio.play();
  };

  const stopTestSound = () => {
    if (testAudioRef.current) {
      testAudioRef.current.pause();
      testAudioRef.current.currentTime = 0;
      testAudioRef.current = null;
    }
  };

  return (
    <>
      <Helmet>
        <title>66 Free Timer Presets | Kitchen, Workout & Study Timers | VClock</title>
        <meta name="description" content="Your ultimate timer hub with 66 presets from 1 second to 72 hours. Perfect for cooking, workouts, study sessions, and productivity. No signup, works everywhere." />
        <link rel="canonical" href="https://vclock.app/timer" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="66 Free Timer Presets | Kitchen, Workout & Study Timers | VClock" />
        <meta property="og:description" content="Your ultimate timer hub with 66 presets from 1 second to 72 hours. Perfect for cooking, workouts, study sessions, and productivity. No signup, works everywhere." />
        <meta property="og:url" content="https://vclock.app/timer" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="66 Free Timer Presets | Kitchen, Workout & Study Timers | VClock" />
        <meta name="twitter:description" content="Your ultimate timer hub with 66 presets from 1 second to 72 hours. Perfect for cooking, workouts, study sessions, and productivity. No signup, works everywhere." />
      </Helmet>
      {/* Timer Modal */}
      {showTimerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-40 p-4">
          <div className="bg-white dark:bg-black rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="px-6 py-4 relative overflow-hidden" style={{ backgroundColor: '#0090DD' }}>
              <div className="absolute inset-0 bg-black bg-opacity-10"></div>
              <div className="relative flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-white">Set Timer</h2>
                  <p className="text-blue-100 text-sm">Create your perfect timer</p>
                </div>
              <button
                  onClick={() => { stopTestSound(); setShowTimerModal(false); }}
                  className="text-white hover:text-blue-100 transition-colors p-2 rounded-full hover:bg-white hover:bg-opacity-20"
              >
                  <X className="w-5 h-5" />
              </button>
              </div>
            </div>
            
            {/* Body */}
            <div className="p-6 space-y-4 bg-white dark:bg-black">
              {/* Time Display with Animation */}
              <div className="text-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
                <div className="text-3xl font-bold text-gray-800 dark:text-white mb-1 font-mono">
                  {timerHour.toString().padStart(2, '0')}:{timerMinute.toString().padStart(2, '0')}:{timerSecond.toString().padStart(2, '0')}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300">Total: {Math.floor((timerHour * 3600 + timerMinute * 60 + timerSecond) / 60)} minutes</p>
              </div>

              {/* Quick Presets */}
                <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-2 uppercase tracking-wide">Quick Presets</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { time: '1 Min', hours: 0, minutes: 1, seconds: 0, color: 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800' },
                    { time: '5 Min', hours: 0, minutes: 5, seconds: 0, color: 'bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-800' },
                    { time: '10 Min', hours: 0, minutes: 10, seconds: 0, color: 'bg-purple-50 dark:bg-purple-900 text-purple-600 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800' },
                    { time: '25 Min', hours: 0, minutes: 25, seconds: 0, color: 'bg-orange-50 dark:bg-orange-900 text-orange-600 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-800' }
                  ].map((preset) => (
                    <button 
                      key={preset.time}
                      onClick={() => { 
                        setTimerHour(preset.hours); 
                        setTimerMinute(preset.minutes); 
                        setTimerSecond(preset.seconds); 
                      }}
                      className={`py-2 px-1 text-xs font-medium rounded-lg transition-all hover:scale-105 shadow-sm ${preset.color}`}
                    >
                      {preset.time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Controls */}
              <div className="grid grid-cols-3 gap-3">
                {/* Hours */}
                <div className="text-center">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 uppercase tracking-wide">Hours</label>
                  <div className="flex items-center justify-center space-x-1">
                    <button 
                      onClick={() => setTimerHour(h => h === 0 ? 23 : h - 1)}
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-all shadow-sm hover:shadow-md"
                    >
                      <span className="text-sm font-bold">−</span>
                    </button>
                    <div className="w-12 h-10 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg flex items-center justify-center border border-blue-200 dark:border-blue-700 shadow-sm">
                      <span className="text-lg font-bold text-gray-800 dark:text-white">{timerHour.toString().padStart(2, '0')}</span>
                    </div>
                    <button 
                      onClick={() => setTimerHour(h => h === 23 ? 0 : h + 1)}
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-all shadow-sm hover:shadow-md"
                    >
                      <span className="text-sm font-bold">+</span>
                    </button>
                  </div>
                </div>

                {/* Minutes */}
                <div className="text-center">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 uppercase tracking-wide">Minutes</label>
                  <div className="flex items-center justify-center space-x-1">
                    <button 
                      onClick={() => setTimerMinute(m => m === 0 ? 59 : m - 1)}
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-all shadow-sm hover:shadow-md"
                    >
                      <span className="text-sm font-bold">−</span>
                    </button>
                    <div className="w-12 h-10 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg flex items-center justify-center border border-blue-200 dark:border-blue-700 shadow-sm">
                      <span className="text-lg font-bold text-gray-800 dark:text-white">{timerMinute.toString().padStart(2, '0')}</span>
                    </div>
                    <button 
                      onClick={() => setTimerMinute(m => m === 59 ? 0 : m + 1)}
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-all shadow-sm hover:shadow-md"
                    >
                      <span className="text-sm font-bold">+</span>
                    </button>
                  </div>
                </div>

                {/* Seconds */}
                <div className="text-center">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 uppercase tracking-wide">Seconds</label>
                  <div className="flex items-center justify-center space-x-1">
                    <button 
                      onClick={() => setTimerSecond(s => s === 0 ? 59 : s - 1)}
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-all shadow-sm hover:shadow-md"
                    >
                      <span className="text-sm font-bold">−</span>
                    </button>
                    <div className="w-12 h-10 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg flex items-center justify-center border border-blue-200 dark:border-blue-700 shadow-sm">
                      <span className="text-lg font-bold text-gray-800 dark:text-white">{timerSecond.toString().padStart(2, '0')}</span>
                    </div>
                    <button 
                      onClick={() => setTimerSecond(s => s === 59 ? 0 : s + 1)}
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-all shadow-sm hover:shadow-md"
                    >
                      <span className="text-sm font-bold">+</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Timer Label */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 uppercase tracking-wide">Timer Label (Optional)</label>
                <input
                  type="text"
                  value={timerLabel}
                  onChange={(e) => setTimerLabel(e.target.value)}
                  placeholder="Enter timer name..."
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              {/* Sound Selection */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-2 uppercase tracking-wide">Sound</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  <div className="w-full sm:flex-1 flex items-center border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800 h-10 sm:h-12">
                    <select value={timerSound} onChange={e => setTimerSound(e.target.value)} className="flex-1 h-full px-2 sm:px-4 text-sm sm:text-base font-normal border-0 focus:ring-2 focus:ring-blue-400 focus:outline-none appearance-none bg-white dark:bg-gray-800">
                      {soundFiles.map(file => (
                        <option key={file} value={file}>
                          {getDisplayName(file)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={testSound}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    Test Sound
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900 px-6 py-4 flex gap-3 border-t border-gray-100 dark:border-gray-700">
                <button
                onClick={() => { stopTestSound(); setShowTimerModal(false); }}
                className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow-md"
                >
                  Cancel
                </button>
                <button
                onClick={() => {
                  const totalSeconds = timerHour * 3600 + timerMinute * 60 + timerSecond;
                  setTimer(totalSeconds, true);
                  setShowTimerModal(false);
                }}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-600 hover:via-green-700 hover:to-green-800 transition-all shadow-sm hover:shadow-lg transform hover:scale-105"
                >
                Start Timer
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Timer Display (matches AlarmClock) */}
      <div 
        id="timer-display"
        className={
          isFullscreen
            ? 'fixed inset-0 z-50 flex flex-col justify-center items-center bg-black text-white border-0 text-center'
            : 'bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700 text-center relative p-4 sm:p-8 lg:p-12'
        }
      >
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex space-x-1 sm:space-x-2">
          <button 
            onClick={decreaseFontSize}
            className={`p-2 rounded transition-colors ${
              isFullscreen 
                ? 'hover:bg-gray-800 text-white' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
            }`}
            title="Decrease font size"
          >
            <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button 
            onClick={increaseFontSize}
            className={`p-2 rounded transition-colors ${
              isFullscreen 
                ? 'hover:bg-gray-800 text-white' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
            }`}
            title="Increase font size"
          >
            <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button className={`p-2 rounded transition-colors ${
            isFullscreen 
              ? 'hover:bg-gray-800 text-white' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
          }`}>
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button 
            onClick={toggleFullscreen}
            className={`p-2 rounded transition-colors ${
              isFullscreen 
                ? 'hover:bg-gray-800 text-white' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
            }`}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>
        <div className={isFullscreen ? '' : 'mt-4'}>
          <div 
            className={`font-light mb-4 tracking-tight leading-none flex items-baseline justify-center font-nunito ${
              isFullscreen ? 'text-white' : 'text-gray-800 dark:text-white'
            }`}
            style={{ 
              fontSize: `${Math.round(isFullscreen ? fontSize * 1.5 : Math.min(fontSize, window.innerWidth * 0.15))}px`,
              fontWeight: 900,
              letterSpacing: '0.04em',
              textAlign: 'center',
            }}
          >
            <span>{formatCountdown(remaining)}</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-4">
            <button onClick={startTimer} className="px-4 sm:px-8 py-2 sm:py-3 rounded-md font-medium text-white transition-colors shadow-sm bg-green-500 hover:bg-green-600 text-sm sm:text-base" disabled={isRunning}>Start</button>
            <button onClick={pauseTimer} className="px-4 sm:px-8 py-2 sm:py-3 rounded-md font-medium bg-yellow-400 hover:bg-yellow-500 text-white transition-colors shadow-sm text-sm sm:text-base" disabled={!isRunning}>Pause</button>
            <button onClick={resetTimer} className="px-4 sm:px-8 py-2 sm:py-3 rounded-md font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors shadow-sm text-sm sm:text-base">Reset</button>
          </div>
        </div>
      </div>

      {/* Grid for Preset Timers and Recently Used */}
      <div className="p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Preset Timers */}
        <div className="bg-white dark:bg-black rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-medium text-gray-800 dark:text-white">Quick Timer Presets - Pick Your Duration</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {currentTimers.map((timer, index) => (
              <button
                key={startIndex + index}
                onClick={() => handlePresetClick(timer)}
                className="px-2 sm:px-3 py-2 text-xs sm:text-sm rounded transition-colors bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700"
              >
                {timer.label}
              </button>
            ))}
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-4 space-x-2">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="px-3 py-1 text-xs rounded transition-colors bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {/* Page Numbers */}
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      currentPage === page
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-xs rounded transition-colors bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
        {/* Recently Used */}
        <div className="bg-white dark:bg-black rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-medium text-gray-800 dark:text-white">Your Recent Timers</h3>
            <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          <div className="space-y-2">
            {recentlyUsed.map((timer, index) => (
              <div key={index} className="flex items-center justify-between py-1">
                <span className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer text-xs sm:text-sm">
                  {timer.label}
                </span>
                <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">{Math.floor(timer.value / 60)}:{(timer.value % 60).toString().padStart(2, '0')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instructions Card */}
      <div className="p-4 sm:p-6 bg-white dark:bg-black mx-3 sm:mx-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-base sm:text-lg font-medium text-gray-800 dark:text-white mb-3 sm:mb-4">
          Your Personal Timer Hub - From Quick Breaks to Long Sessions
        </h3>
        <div className="space-y-2 sm:space-y-3 text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
          <p>
            Ever found yourself staring at the microwave, waiting for that perfect moment to check if your food is done? Or maybe you're trying to stay focused during a work session but keep getting distracted? That's exactly why we built this timer - it's like having a personal timekeeper that actually listens to what you need.
          </p>
          <p>
            Think of it as your digital kitchen timer, workout buddy, and productivity partner all rolled into one. Whether you're brewing the perfect cup of tea (3 minutes, anyone?), doing a quick meditation session, or trying to stay on track during a marathon study session, we've got you covered with timers ranging from just 1 second to a full 3 days.
          </p>
          <ul className="list-disc pl-4 sm:pl-6 space-y-1">
            <li><strong>No account needed:</strong> Seriously, just open the page and start timing. We're not here to collect your data or make you jump through hoops.</li>
            <li><strong>Works on anything with a screen:</strong> Phone dying? Switch to your laptop. Need to move around? Your tablet works too.</li>
            <li><strong>Perfect for real life:</strong> Cooking pasta? Set it for 8 minutes. Need a power nap? 20 minutes should do it. Working out? We've got intervals from 30 seconds to full hours.</li>
            <li><strong>Customize everything:</strong> Want a specific duration? Use the modal to set exact hours, minutes, and seconds. Need a label? Add one so you remember what you're timing.</li>
            <li><strong>Share with friends:</strong> Found the perfect workout timer? Share the link and let your workout buddy use it too.</li>
          </ul>
          <p>
            The best part? When your time is up, you'll get a clear notification and a sound alert (no more burnt food or missed workout intervals). Plus, if you need to adjust anything mid-timer, just pause, reset, or start over - no judgment here.
          </p>
          <p>
            So go ahead, pick a timer that fits your vibe and start making the most of your time. Whether it's a 30-second plank hold or a 2-hour study session, we've got your back.
          </p>
        </div>
      </div>

      {/* Connect & Share Section */}
      <div className="p-4 sm:p-6 mx-3 sm:mx-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 rounded-lg mt-4 border border-green-200 dark:border-green-700">
        <div className="text-center">
          <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">Love This Timer? Share the Love!</h4>
          <p className="text-xs text-green-600 dark:text-green-300 mb-3">Help others discover the perfect timing tool</p>
          <div className="text-green-500 dark:text-green-400 text-xs sm:text-sm mb-3 font-mono">https://vclock.com/timer</div>
          <div className="flex flex-wrap justify-center gap-2">
            <button className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 text-white rounded flex items-center justify-center hover:bg-blue-700 text-xs sm:text-sm transition-colors" title="Share on Facebook">f</button>
            <button className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-400 text-white rounded flex items-center justify-center hover:bg-blue-500 text-xs sm:text-sm transition-colors" title="Share on Twitter">t</button>
            <button className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 text-white rounded flex items-center justify-center hover:bg-green-600 text-xs sm:text-sm transition-colors" title="Share on WhatsApp">W</button>
            <button className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 text-white rounded flex items-center justify-center hover:bg-orange-600 text-xs sm:text-sm transition-colors" title="Share on Reddit">B</button>
            <button className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-600 text-white rounded flex items-center justify-center hover:bg-orange-700 text-xs sm:text-sm transition-colors" title="Share on Reddit">r</button>
            <button className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-800 text-white rounded flex items-center justify-center hover:bg-blue-900 text-xs sm:text-sm transition-colors" title="Share on Telegram">t</button>
            <button className="w-6 h-6 sm:w-8 sm:h-8 bg-red-600 text-white rounded flex items-center justify-center hover:bg-red-700 text-xs sm:text-sm transition-colors" title="Share on Pinterest">P</button>
            <button className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-700 text-white rounded flex items-center justify-center hover:bg-blue-800 text-xs sm:text-sm transition-colors" title="Share on LinkedIn">in</button>
            <button className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-600 text-white rounded flex items-center justify-center hover:bg-gray-700 text-xs sm:text-sm transition-colors" title="Copy Link">⧉</button>
            <button className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 text-white rounded flex items-center justify-center hover:bg-blue-600 text-xs sm:text-sm transition-colors" title="Embed Timer">Embed</button>
          </div>
        </div>
      </div>

      {/* Timer Finished Modal */}
      {isFinished && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-black rounded-lg p-8 max-w-md w-full mx-4 text-center animate-alarm-modal-in border border-gray-200 dark:border-gray-700">
            <div className="text-6xl mb-4">⏰</div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Time's Up!</h2>
            <p className="text-lg mb-2 text-gray-800 dark:text-white">{timerLabel || 'Timer'}</p>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Your timer has finished.</p>
            <div className="flex gap-3 justify-center">
              {isBeeping && (
                <button
                  onClick={stopBeeping}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium"
                >
                  Stop Sound
                </button>
              )}
              <button
                onClick={() => { setIsFinished(false); stopBeeping(); }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium"
              >
                Dismiss
              </button>
              <button
                onClick={() => { setIsFinished(false); stopBeeping(); resetTimer(); startTimer(); }}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium"
              >
                Restart
              </button>
            </div>
          </div>
        </div>
      )}
      {showTimerModal && notificationPermission !== 'granted' && notificationPermission !== 'denied' && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-40 p-4">
          <div className="bg-white dark:bg-black rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 relative overflow-hidden" style={{ backgroundColor: '#0090DD' }}>
              <div className="absolute inset-0 bg-black bg-opacity-10"></div>
              <div className="relative flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-white">Notification Settings</h2>
                  <p className="text-blue-100 text-sm">Please enable desktop notifications for better timer experience.</p>
                </div>
                <button
                  onClick={() => setShowTimerModal(false)}
                  className="text-white hover:text-blue-100 transition-colors p-2 rounded-full hover:bg-white hover:bg-opacity-20"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4 bg-white dark:bg-black">
              <p className="text-gray-600 dark:text-gray-300">
                To receive timely notifications when your timer finishes, please enable desktop notifications.
                This will ensure you don't miss your scheduled breaks or important tasks.
              </p>
              <button
                type="button"
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                onClick={requestNotificationPermission}
              >
                Enable Desktop Notifications
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Timer; 