import React, { useState, useEffect } from 'react';
import { Share2, Plus, Maximize2, Minimize2, ZoomIn, ZoomOut, X } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface Alarm {
  id: string;
  time: string;
  label: string;
  isActive: boolean;
  sound: string;
  repeat: boolean;
  // days?: string[];
}

// Persistent AudioContext for the whole component
let persistentAudioCtx: AudioContext | null = null;
if (typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
  persistentAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
}
// Resume AudioContext on first user gesture
if (typeof window !== 'undefined' && persistentAudioCtx) {
  window.addEventListener('click', () => {
    if (persistentAudioCtx && persistentAudioCtx.state === 'suspended') {
      persistentAudioCtx.resume().then(() => {
        console.log('Persistent AudioContext resumed');
      });
    }
  }, { once: true });
}

const AlarmClock: React.FC = () => {
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [fontSize, setFontSize] = useState(144);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [showAlarmModal, setShowAlarmModal] = useState(false);
  const [customTime, setCustomTime] = useState('');
  const [alarmLabel, setAlarmLabel] = useState('');
  const [activeAlarm, setActiveAlarm] = useState<Alarm | null>(null);
  const [alarmHour, setAlarmHour] = useState(11);
  const [alarmMinute, setAlarmMinute] = useState(24);
  const [alarmAMPM, setAlarmAMPM] = useState('AM');
  const [alarmSound, setAlarmSound] = useState('Bells');
  const [alarmRepeat, setAlarmRepeat] = useState(true);
  const [audioError, setAudioError] = useState<string | null>(null);
  // Add this state at the top of the component
  const [isPlaying, setIsPlaying] = useState(false);

  // Add this ref at the top of the component
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Load alarms from localStorage
  useEffect(() => {
    const savedAlarms = localStorage.getItem('vclock-alarms');
    if (savedAlarms) {
      setAlarms(JSON.parse(savedAlarms));
    }
  }, []);

  // Save alarms to localStorage
  useEffect(() => {
    localStorage.setItem('vclock-alarms', JSON.stringify(alarms));
  }, [alarms]);

  // Check for alarm triggers
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentTimeString = now.toLocaleTimeString('en-US', {
        hour12: true,
        hour: 'numeric',
        minute: '2-digit'
      });

      alarms.forEach(alarm => {
        if (alarm.isActive && alarm.time === currentTimeString) {
          triggerAlarm(alarm);
        }
      });
    };

    const interval = setInterval(checkAlarms, 1000);
    return () => clearInterval(interval);
  }, [alarms]);

  // Add this utility function at the top or near the dropdown
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

  // Helper to format time string for alarm
  const getAlarmTimeString = () => {
    const hour = alarmHour;
    const minute = alarmMinute.toString().padStart(2, '0');
    return `${hour}:${minute} ${alarmAMPM}`;
  };

  const triggerAlarm = (alarm: Alarm) => {
    setActiveAlarm(alarm);
    playSound(alarm.sound, alarm.repeat);
    if (Notification.permission === 'granted') {
      new Notification('Alarm', {
        body: `${alarm.label} - ${alarm.time}`,
        icon: '/vite.svg'
      });
    }
  };

  // Update formatTime to return the time with AM/PM inline
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

  // Add a function to get AM/PM
  const getAMPM = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour12: true }).split(' ')[1];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    }).toUpperCase();
  };

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 16, 256));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 16, 64));
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        const clockElement = document.getElementById('clock-display');
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

  const openAlarmModal = () => {
    setShowAlarmModal(true);
    setCustomTime('');
    setAlarmLabel('');
    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const addAlarm = () => {
    const timeToUse = getAlarmTimeString();
    if (!timeToUse) return;

    const newAlarm: Alarm = {
      id: Date.now().toString(),
      time: timeToUse,
      label: alarmLabel || `Alarm ${timeToUse}`,
      isActive: true,
      sound: alarmSound,
      repeat: alarmRepeat,
    };

    setAlarms(prev => [...prev, newAlarm]);
    setShowAlarmModal(false);
    setSelectedTime('');
    setCustomTime('');
    setAlarmLabel('');
  };

  // Play sound helper
  const playSound = (sound: string, repeat: boolean) => {
    setAudioError(null);
    // Stop any currently playing sound
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      setIsPlaying(false);
    }
    console.log('playSound called with', sound, repeat);
    const src = `/sounds/${sound}`;
    try {
      const audio = new Audio(src);
      audioRef.current = audio;
      audio.volume = 1.0;
      audio.muted = false;
      audio.play().then(() => {
        setIsPlaying(true);
        console.log('Audio element played');
      }).catch((e) => {
        setAudioError('Audio play error: ' + e.message);
        setIsPlaying(false);
        console.error('Audio play error:', e);
      });
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        if (repeat) {
          playSound(sound, repeat);
        }
      }, { once: true });
    } catch (err: any) {
      setAudioError('Audio object error: ' + err.message);
      setIsPlaying(false);
      console.error('Audio object error:', err);
    }
  };

  // Test button handler
  const handleTestSound = () => {
    if (isPlaying) {
      stopSound();
    } else {
      playSound(alarmSound, alarmRepeat);
    }
  };

  const toggleAlarm = (id: string) => {
    setAlarms(prev => prev.map(alarm => 
      alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm
    ));
  };

  const deleteAlarm = (id: string) => {
    setAlarms(prev => prev.filter(alarm => alarm.id !== id));
  };

  const dismissActiveAlarm = () => {
    setActiveAlarm(null);
  };

  const timeSlots = [
    '4:00 AM', '4:30 AM', '5:30 AM', '5:45 AM',
    '5:00 AM', '5:15 AM', '6:30 AM', '6:45 AM',
    '6:00 AM', '6:15 AM', '7:30 AM', '7:45 AM',
    '7:00 AM', '7:15 AM', '8:30 AM', '8:45 AM',
    '8:00 AM', '8:15 AM', '9:00 AM', '10:00 AM',
    '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM'
  ];

  const recentlyUsed = [
    { label: 'Alarm 6:00 AM', time: '6:00 AM' },
    { label: 'Alarm 7:00 AM', time: '7:00 AM' },
    { label: 'Alarm 8:00 AM', time: '8:00 AM' },
    { label: 'Alarm 9:00 AM', time: '9:00 AM' },
    { label: 'Alarm 10:00 AM', time: '10:00 AM' },
    { label: 'Alarm 12:00 PM', time: '12:00 PM' },
    { label: 'Alarm 1:00 PM', time: '1:00 PM' },
    { label: 'Alarm 2:00 PM', time: '2:00 PM' },
    { label: 'Alarm 5:00 PM', time: '5:00 PM' },
    { label: 'Alarm 6:00 PM', time: '6:00 PM' }
  ];

  // Add this function inside the component
  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      setIsPlaying(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Free Online Alarm Clock | Set Multiple Alarms Instantly</title>
        <meta name="description" content="Free online alarm clock with multiple alarms, custom sounds, and repeat options. Perfect for waking up, reminders, and daily routines. Works on all devices." />
        <link rel="canonical" href={location.pathname === '/' ? "https://vclock.app/" : "https://vclock.app/alarm"} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Free Online Alarm Clock | Set Multiple Alarms Instantly" />
        <meta property="og:description" content="Free online alarm clock with multiple alarms, custom sounds, and repeat options. Perfect for waking up, reminders, and daily routines. Works on all devices." />
        <meta property="og:url" content={location.pathname === '/' ? "https://vclock.app/" : "https://vclock.app/alarm"} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Online Alarm Clock | Set Multiple Alarms Instantly" />
        <meta name="twitter:description" content="Free online alarm clock with multiple alarms, custom sounds, and repeat options. Perfect for waking up, reminders, and daily routines. Works on all devices." />
      </Helmet>
      {/* Active Alarm Notification */}
      {activeAlarm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
            <div className="text-6xl mb-4">⏰</div>
            <h2 className="text-2xl font-bold mb-2">Alarm</h2>
            <p className="text-lg mb-2">{activeAlarm.label}</p>
            <p className="text-xl font-mono mb-6">{activeAlarm.time}</p>
            <button
              onClick={dismissActiveAlarm}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Alarm Modal */}
      {showAlarmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-40 p-4">
          <div className="bg-white dark:bg-black rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="px-6 py-4 relative overflow-hidden" style={{ background: 'linear-gradient(90deg, #0090DD 60%, #00C6FB 100%)' }}>
              <div className="absolute inset-0 bg-black bg-opacity-10"></div>
              <div className="relative flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-white text-2xl">⏰</span>
                  <h2 className="text-xl font-semibold text-white">Set Alarm</h2>
                </div>
                <button
                  onClick={() => setShowAlarmModal(false)}
                  className="text-white hover:text-blue-100 transition-colors p-2 rounded-full hover:bg-white hover:bg-opacity-20"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            {/* Body */}
            <div className="p-6 space-y-4 bg-white dark:bg-black">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Hours Picker */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-2 uppercase tracking-wide">Hours</label>
                  <div className="flex items-center justify-center space-x-1">
                    <button onClick={() => setAlarmHour(h => h === 1 ? 12 : h - 1)} className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-all shadow-sm hover:shadow-md"><span className="text-sm font-bold">−</span></button>
                    <div className="w-12 h-10 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg flex items-center justify-center border border-blue-200 dark:border-blue-700 shadow-sm">
                      <span className="text-lg font-bold text-gray-800 dark:text-white">{alarmHour.toString().padStart(2, '0')}</span>
                    </div>
                    <button onClick={() => setAlarmHour(h => h === 12 ? 1 : h + 1)} className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-all shadow-sm hover:shadow-md"><span className="text-sm font-bold">+</span></button>
                  </div>
                </div>
                {/* Minutes Picker */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-2 uppercase tracking-wide">Minutes</label>
                  <div className="flex items-center justify-center space-x-1">
                    <button onClick={() => setAlarmMinute(m => m === 0 ? 59 : m - 1)} className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-all shadow-sm hover:shadow-md"><span className="text-sm font-bold">−</span></button>
                    <div className="w-12 h-10 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg flex items-center justify-center border border-blue-200 dark:border-blue-700 shadow-sm">
                      <span className="text-lg font-bold text-gray-800 dark:text-white">{alarmMinute.toString().padStart(2, '0')}</span>
                    </div>
                    <button onClick={() => setAlarmMinute(m => m === 59 ? 0 : m + 1)} className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-all shadow-sm hover:shadow-md"><span className="text-sm font-bold">+</span></button>
                  </div>
                </div>
              </div>
              {/* AM/PM Picker */}
              <div className="flex items-center justify-center gap-4">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 uppercase tracking-wide">AM/PM</label>
                <select value={alarmAMPM} onChange={e => setAlarmAMPM(e.target.value)} className="w-24 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
                  <option>AM</option>
                  <option>PM</option>
                </select>
              </div>
              {/* Sound and Repeat */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <div className="w-full sm:flex-1 flex items-center border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800 h-10 sm:h-12">
                  <select value={alarmSound} onChange={e => setAlarmSound(e.target.value)} className="flex-1 h-full px-2 sm:px-4 text-sm sm:text-base font-normal border-0 focus:ring-2 focus:ring-blue-400 focus:outline-none appearance-none bg-white dark:bg-gray-800">
                    {soundFiles.map(file => (
                      <option key={file} value={file}>
                        {getDisplayName(file)}
                      </option>
                    ))}
                  </select>
                  <button onClick={handleTestSound} className="w-10 sm:w-12 h-full flex items-center justify-center text-sm sm:text-lg text-gray-500 bg-gray-100 hover:bg-gray-200 border-l border-gray-200 dark:border-gray-600" title={isPlaying ? 'Stop Sound' : 'Play Sound'}>
                    {isPlaying ? (
                      // Stop icon
                      <svg width="16" height="16" className="sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="8" height="8" /></svg>
                    ) : (
                      // Play icon
                      <svg width="16" height="16" className="sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                    )}
                  </button>
                </div>
                {audioError && (
                  <div className="text-red-600 text-sm mt-2">{audioError}</div>
                )}
                <div className="flex items-center w-full sm:w-auto">
                  <input type="checkbox" id="repeatSound" className="peer hidden" checked={alarmRepeat} onChange={e => setAlarmRepeat(e.target.checked)} />
                  <label htmlFor="repeatSound" className="w-6 h-6 flex items-center justify-center border-2 border-blue-500 bg-white cursor-pointer mr-2">
                    {alarmRepeat && (
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#0090DD" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 11 8 15 16 6" /></svg>
                    )}
                  </label>
                  <span className="text-gray-700 dark:text-gray-300 text-base font-normal select-none">Repeat sound</span>
                </div>
              </div>
              {/* Title */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 uppercase tracking-wide">Title</label>
                <input
                  type="text"
                  value={alarmLabel}
                  onChange={(e) => setAlarmLabel(e.target.value)}
                  placeholder="Alarm"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>
            {/* Footer */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900 px-6 py-4 flex gap-3 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={handleTestSound}
                className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow-md"
              >
                Test
              </button>
              <button
                onClick={() => { stopSound(); setShowAlarmModal(false); }}
                className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow-md"
              >
                Cancel
              </button>
              <button
                onClick={addAlarm}
                disabled={false /* TODO: disable if invalid */}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-600 hover:via-green-700 hover:to-green-800 transition-all shadow-sm hover:shadow-lg transform hover:scale-105"
              >
                Start
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Clock Display */}
      <div 
        id="clock-display"
        className={
          isFullscreen
            ? 'fixed inset-0 z-50 flex flex-col justify-center items-center bg-black text-white border-0 text-center'
            : 'bg-white dark:bg-black border-b border-gray-200 text-center relative p-4 sm:p-8 lg:p-12'
        }
      >
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex space-x-1 sm:space-x-2">
          <button 
            onClick={decreaseFontSize}
            className={`p-2 rounded transition-colors ${
              isFullscreen 
                ? 'hover:bg-gray-800 text-white' 
                : 'hover:bg-gray-100 text-gray-600'
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
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Increase font size"
          >
            <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button className={`p-2 rounded transition-colors ${
            isFullscreen 
              ? 'hover:bg-gray-800 text-white' 
              : 'hover:bg-gray-100 text-gray-600'
          }`}>
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button 
            onClick={toggleFullscreen}
            className={`p-2 rounded transition-colors ${
              isFullscreen 
                ? 'hover:bg-gray-800 text-white' 
                : 'hover:bg-gray-100 text-gray-600'
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
              isFullscreen ? 'text-white' : 'text-black'
            }`}
            style={{ 
              fontSize: `${Math.round(isFullscreen ? fontSize * 1.5 : Math.min(fontSize, window.innerWidth * 0.15))}px`,
              fontWeight: 900,
              color: isFullscreen ? '#fff' : '#555555',
              letterSpacing: '0.04em',
              textAlign: 'center',
            }}
          >
            {/* Split time and AM/PM for styling */}
            <span>{formatTime(currentTime).replace(/\s?(AM|PM)$/i, '')}</span>
            <span style={{ fontSize: '0.35em', marginLeft: '0.25em', fontWeight: 400, letterSpacing: '0.08em', verticalAlign: 'baseline' }}>
              {formatTime(currentTime).match(/(AM|PM)$/i)?.[0]}
            </span>
          </div>
          <div className={`tracking-wide font-medium font-bold mt-2 sm:mt-0 ${
            isFullscreen 
              ? 'text-gray-300 text-2xl sm:text-3xl' 
              : 'text-gray-500 text-sm sm:text-base lg:text-xl'
          } font-nunito`} style={{
            color: '#555555',
            letterSpacing: '0.18em',
            textAlign: 'center',
            textTransform: 'uppercase',
            fontWeight: 900,
            fontSize: isFullscreen ? '3rem' : 'clamp(1rem, 4vw, 2rem)',
          }}>
            {formatDate(currentTime)}
          </div>
        </div>
        
        {!isFullscreen && (
          <button 
            onClick={openAlarmModal}
            className="mt-4 sm:mt-6 bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-2 text-sm sm:text-base rounded-md font-medium transition-colors shadow-sm"
          >
            Set Alarm
          </button>
        )}
      </div>

      {/* Active Alarms List */}
      {!isFullscreen && alarms.length > 0 && (
        <div className="p-3 sm:p-6">
          <div className="bg-white dark:bg-black rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-3 sm:mb-4">Active Alarms</h3>
            <div className="space-y-2 sm:space-y-3">
              {alarms.map((alarm) => (
                <div key={alarm.id} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <button
                      onClick={() => toggleAlarm(alarm.id)}
                      className={`w-10 sm:w-12 h-5 sm:h-6 rounded-full transition-colors ${
                        alarm.isActive ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-4 sm:w-5 h-4 sm:h-5 bg-white rounded-full transition-transform ${
                        alarm.isActive ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                    <div>
                      <div className="text-sm sm:text-base font-medium">{alarm.time}</div>
                      <div className="text-xs sm:text-sm text-gray-600">{alarm.label}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteAlarm(alarm.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Alarm Settings Section */}
      {!isFullscreen && (
      <div className="p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Set Alarm Times */}
        <div className="bg-white dark:bg-black rounded-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-3 sm:mb-4">
            Set the alarm for the specified time
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {timeSlots.map((time, index) => (
              <button
                key={index}
                onClick={() => setSelectedTime(time)}
                className="px-2 sm:px-3 py-2 text-xs sm:text-sm rounded transition-colors bg-[#00A1F7] text-white hover:bg-[#0086c3]"
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Recently Used */}
        <div className="bg-white dark:bg-black rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-medium text-gray-800">Recently used</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-2">
            {recentlyUsed.map((alarm, index) => (
              <div key={index} className="flex items-center justify-between py-1">
                <span 
                  className="text-blue-500 hover:text-blue-700 cursor-pointer text-xs sm:text-sm"
                  onClick={() => setSelectedTime(alarm.time)}
                >
                  {alarm.label}
                </span>
                <span className="text-gray-600 text-xs sm:text-sm">{alarm.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}

      {/* Instructions */}
      {!isFullscreen && (
      <div className="p-4 sm:p-6 bg-white dark:bg-black mx-3 sm:mx-6 rounded-lg">
        <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-3 sm:mb-4">
          How to Use the Online Alarm Clock
        </h3>
        
        <div className="space-y-2 sm:space-y-3 text-gray-600 text-xs sm:text-sm">
          <p>
            Need a reliable alarm clock right in your browser? You’re in the perfect spot. Setting an alarm here is quick and easy—just pick your time, choose a sound, and add a label if you want. When your alarm goes off, you’ll see a message and hear your chosen sound, even if you’re working in another tab.
          </p>
          <ul className="list-disc pl-4 sm:pl-6 space-y-1">
            <li><strong>Set your alarm:</strong> Select the hour and minute, pick a sound you like, and add a label to remember what it’s for.</li>
            <li><strong>Test before you trust:</strong> Hit the “Test” button to make sure the alert and volume are just right.</li>
            <li><strong>Personalize it:</strong> Change the look and feel—adjust the text color, style, and size. Your preferences are saved for next time.</li>
            <li><strong>Works offline:</strong> The alarm will ring even if you lose your internet connection (just don’t close your browser or shut down your computer).</li>
            <li><strong>Easy access:</strong> Bookmark your favorite alarm settings or share a link to set the alarm instantly next time.</li>
          </ul>
          <p>
            When your alarm time arrives, you’ll get a clear notification and your chosen sound will play. If you want to change or delete an alarm, it’s just a click away. Your alarms and settings stay private—nothing is stored on our servers.
          </p>
          <p>
            Try it out and never miss an important moment again!
          </p>
        </div>
      </div>
      )}

      {/* Social Share Section */}
      {!isFullscreen && (
      <div className="p-4 sm:p-6 mx-3 sm:mx-6 bg-gray-50 dark:bg-black rounded-lg mt-4">
        <div className="text-center">
          <div className="text-gray-600 text-xs sm:text-sm mb-3">https://vclock.com/</div>
          <div className="flex flex-wrap justify-center gap-2">
            <button className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 text-white rounded flex items-center justify-center hover:bg-blue-700 text-xs sm:text-sm">
              f
            </button>
            <button className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-400 text-white rounded flex items-center justify-center hover:bg-blue-500 text-xs sm:text-sm">
              t
            </button>
            <button className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 text-white rounded flex items-center justify-center hover:bg-green-600 text-xs sm:text-sm">
              W
            </button>
            <button className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 text-white rounded flex items-center justify-center hover:bg-orange-600 text-xs sm:text-sm">
              B
            </button>
            <button className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-600 text-white rounded flex items-center justify-center hover:bg-orange-700 text-xs sm:text-sm">
              r
            </button>
            <button className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-800 text-white rounded flex items-center justify-center hover:bg-blue-900 text-xs sm:text-sm">
              t
            </button>
            <button className="w-6 h-6 sm:w-8 sm:h-8 bg-red-600 text-white rounded flex items-center justify-center hover:bg-red-700 text-xs sm:text-sm">
              P
            </button>
            <button className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-700 text-white rounded flex items-center justify-center hover:bg-blue-800 text-xs sm:text-sm">
              in
            </button>
            <button className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-600 text-white rounded flex items-center justify-center hover:bg-gray-700 text-xs sm:text-sm">
              ⧉
            </button>
            <button className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 text-white rounded flex items-center justify-center hover:bg-blue-600 text-xs sm:text-sm">
              Embed
            </button>
          </div>
        </div>
      </div>
      )}
    </>
  );
};

export default AlarmClock;