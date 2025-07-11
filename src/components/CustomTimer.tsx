import React, { useState, useRef, useEffect } from 'react';
import { Share2, Maximize2, Minimize2, ZoomIn, ZoomOut, Play, Pause, RotateCcw } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface CustomTimerProps {
  duration?: number; // in seconds
  title?: string;
}

const CustomTimer: React.FC<CustomTimerProps> = () => {
  console.log('CustomTimer component rendering');
  const location = useLocation();
  
  console.log('Current URL:', location.pathname);
  
  // Extract duration from URL path
  const pathMatch = location.pathname.match(/\/set-timer-for-(.+)/);
  const finalDuration = pathMatch ? pathMatch[1] : '1-minute';
  
  console.log('Path match:', pathMatch);
  console.log('Final duration:', finalDuration);

  // Comprehensive timer presets (same as Timer component)
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const timersPerPage = 20;
  
  // Parse duration from slug (e.g., "1-minute" -> 60 seconds)
  const parseDuration = (durationStr?: string): number => {
    if (!durationStr) return 60; // default 1 minute
    
    const match = durationStr.match(/(\d+)-(second|minute|hour)s?/);
    if (!match) return 60;
    const [, num, unit] = match;
    const value = parseInt(num);
    switch (unit) {
      case 'second': return value;
      case 'minute': return value * 60;
      case 'hour': return value * 3600;
      default: return 60;
    }
  };

  const formatDurationTitle = (seconds: number): string => {
    if (seconds < 60) return `${seconds} Second${seconds !== 1 ? 's' : ''}`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} Minute${Math.floor(seconds / 60) !== 1 ? 's' : ''}`;
    return `${Math.floor(seconds / 3600)} Hour${Math.floor(seconds / 3600) !== 1 ? 's' : ''}`;
  };

  const initialDuration = parseDuration(finalDuration);
  const pageTitle = formatDurationTitle(initialDuration);

  const [remaining, setRemaining] = useState(initialDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [fontSize, setFontSize] = useState(144);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const beepIntervalRef = useRef<number | null>(null);
  const beepTimeoutRef = useRef<number | null>(null);
  const [isBeeping, setIsBeeping] = useState(false);

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
  const [timerSound, setTimerSound] = useState("Alarm_Clock_Bell.mp3");
  const testAudioRef = useRef<HTMLAudioElement | null>(null);
  const testSound = () => {
    // Stop timer beep if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
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
  useEffect(() => {
    return () => {
      stopTestSound();
    };
  }, []);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Countdown logic
  useEffect(() => {
    if (isRunning && remaining > 0) {
      intervalRef.current = window.setInterval(() => {
        setRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            playAlarmSound();
            showNotification();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, remaining]);

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const playAlarmSound = () => {
    try {
      // Create a simple beep sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
      
      // Repeat the beep 3 times
      setTimeout(() => {
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        osc2.frequency.setValueAtTime(800, audioContext.currentTime);
        gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
        osc2.start();
        osc2.stop(audioContext.currentTime + 0.5);
      }, 600);
      
      setTimeout(() => {
        const osc3 = audioContext.createOscillator();
        const gain3 = audioContext.createGain();
        osc3.connect(gain3);
        gain3.connect(audioContext.destination);
        osc3.frequency.setValueAtTime(800, audioContext.currentTime);
        gain3.gain.setValueAtTime(0.3, audioContext.currentTime);
        osc3.start();
        osc3.stop(audioContext.currentTime + 0.5);
      }, 1200);
    } catch (error) {
      console.error('Error playing alarm sound:', error);
    }
  };

  const showNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('Timer Finished!', {
        body: `Your ${pageTitle} timer has finished.`,
        icon: '/vite.svg'
      });
    } else if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Timer Finished!', {
            body: `Your ${pageTitle} timer has finished.`,
            icon: '/vite.svg'
          });
        }
      });
    }
  };

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    }).toUpperCase();
  };

  // In the main timer display, add the sound selection and Test Sound button above the timer controls
  const startTimer = () => {
    stopTestSound();
    if (isFinished) {
      setRemaining(initialDuration);
      setIsFinished(false);
    }
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    stopTestSound();
    setIsRunning(false);
    setIsFinished(false);
    setRemaining(initialDuration);
  };

  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 16, 256));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 16, 64));

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

  // Helper function to convert seconds to slug (same as Timer component)
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

  // Function to generate unique content based on timer duration
  const getTimerContent = (seconds: number) => {
    // Always use the same title format for SEO
    const baseTitle = `${pageTitle} Timer | Online Countdown Timer`;
    // Very short timers (1-30 seconds)
    if (seconds <= 30) {
      return {
        title: baseTitle,
        intro: `Need to time something really quick? This ${pageTitle.toLowerCase()} timer is your go-to for those moments when every second counts. Whether you're doing a quick breathing exercise, timing a sprint, or just need a brief pause, this timer gets you started instantly.`,
        description: `Think of it as your digital stopwatch with a personality. Perfect for those "just a few seconds" moments that happen throughout your day. No setup, no fuss - just pure, instant timing.`,
        metaDescription: `Free ${pageTitle.toLowerCase()} timer for quick tasks. Perfect for breathing exercises, sprints, and instant timing. Start immediately, no signup required.`,
        features: [
          "Instant start: Literally one click and you're timing",
          "Crystal clear display: See every second tick by",
          "Quick controls: Pause, reset, restart in a flash",
          "Perfect for sprints: Great for quick workouts or tasks",
          "No distractions: Clean, minimal interface"
        ],
        conclusion: `Ready for a quick ${pageTitle.toLowerCase()}? Hit start and make every second count. Perfect for those moments when you need precision timing without any complications.`
      };
    }
    
    // Short timers (31 seconds - 5 minutes)
    else if (seconds <= 300) {
      return {
        title: baseTitle,
        intro: `Welcome to your ${pageTitle.toLowerCase()} precision timer - designed for those focused bursts of activity that make a real difference. Whether you're doing a quick workout, timing a meditation session, or need a short break, this timer keeps you on track.`,
        description: `This isn't just a countdown; it's your personal focus assistant. Perfect for Pomodoro technique, quick workouts, or any activity where you need to stay engaged for a specific duration.`,
        metaDescription: `Free ${pageTitle.toLowerCase()} timer for focused sessions. Perfect for workouts, meditation, and Pomodoro technique. Clean interface, instant start.`,
        features: [
          "Focus mode: Distraction-free timing experience",
          "Visual progress: Watch your time count down clearly",
          "Smart alerts: Get notified when your session ends",
          "Perfect for intervals: Great for workout timing",
          "Quick restart: Ready for your next session immediately"
        ],
        conclusion: `Time to focus for ${pageTitle.toLowerCase()}. Start your session and make the most of every moment. Your productivity partner is ready when you are.`
      };
    }
    
    // Medium timers (6-30 minutes)
    else if (seconds <= 1800) {
      return {
        title: baseTitle,
        intro: `You've found your ${pageTitle.toLowerCase()} productivity timer - the perfect companion for focused work sessions, study periods, or any activity that deserves your full attention. This timer is designed to help you stay productive and on track.`,
        description: `Whether you're diving into a work project, studying for an exam, or doing a focused workout, this timer creates the perfect environment for sustained concentration. It's like having a personal productivity coach that keeps you accountable.`,
        metaDescription: `Free ${pageTitle.toLowerCase()} timer for productivity. Perfect for work sessions, study periods, and focused activities. Boost your concentration today.`,
        features: [
          "Work session ready: Perfect for focused productivity",
          "Progress tracking: Visual countdown keeps you motivated",
          "Break reminders: Know exactly when to take a pause",
          "Study companion: Ideal for learning sessions",
          "Workout timing: Great for structured exercise routines"
        ],
        conclusion: `Ready for a productive ${pageTitle.toLowerCase()} session? Start your timer and dive into focused work. Your productivity journey begins now.`
      };
    }
    
    // Long timers (31-60 minutes)
    else if (seconds <= 3600) {
      return {
        title: baseTitle,
        intro: `This ${pageTitle.toLowerCase()} timer is your gateway to deep, uninterrupted work sessions. Whether you're tackling a complex project, doing intensive study, or need an extended focus period, this timer supports your long-form productivity.`,
        description: `Longer sessions require a different kind of timer - one that understands the rhythm of deep work. This timer is designed for those times when you need to immerse yourself in a task without constant interruptions.`,
        metaDescription: `Free ${pageTitle.toLowerCase()} timer for deep work. Perfect for extended focus sessions, intensive study, and complex projects. Master long-form productivity.`,
        features: [
          "Deep work mode: Designed for extended focus sessions",
          "Session management: Perfect for long study periods",
          "Progress visibility: Track your extended session progress",
          "Workflow integration: Fits into your productivity system",
          "Break planning: Structure your longer work sessions"
        ],
        conclusion: `Prepare for a deep ${pageTitle.toLowerCase()} work session. This timer is your partner for extended focus and meaningful progress.`
      };
    }
    
    // Very long timers (1+ hours)
    else {
      return {
        title: baseTitle,
        intro: `You're looking at a ${pageTitle.toLowerCase()} marathon timer - designed for those extended sessions that require serious commitment. Whether you're working on a major project, doing intensive study, or need to track long-duration activities, this timer has you covered.`,
        description: `Long-duration timing is a different beast entirely. This timer understands that extended sessions need special handling - clear progress indicators, reliable notifications, and the ability to handle interruptions gracefully.`,
        metaDescription: `Free ${pageTitle.toLowerCase()} timer for marathon sessions. Perfect for major projects, intensive study, and long-duration activities. Built for serious commitment.`,
        features: [
          "Marathon mode: Built for extended sessions",
          "Progress tracking: Visual indicators for long sessions",
          "Reliable alerts: Never miss your session end",
          "Session recovery: Handle interruptions gracefully",
          "Long-term focus: Support for extended concentration"
        ],
        conclusion: `Ready for your ${pageTitle.toLowerCase()} marathon session? This timer is built for the long haul and will support you through extended work periods.`
      };
    }
  };

  const timerContent = getTimerContent(initialDuration);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        const element = document.getElementById('custom-timer-display');
        if (element) await element.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  // Helper to play the selected sound
  const playBeep = () => {
    // Stop test sound if playing
    if (testAudioRef.current) {
      testAudioRef.current.pause();
      testAudioRef.current.currentTime = 0;
      testAudioRef.current = null;
    }
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

  // When timer finishes, start beeping
  useEffect(() => {
    if (isFinished) {
      startBeeping();
    } else {
      stopBeeping();
    }
    return () => {
      stopBeeping();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished]);

  return (
    <>
      <Helmet>
        <title>{`${timerContent.title} | VClock`}</title>
        <meta name="description" content={timerContent.metaDescription} />
        <link rel="canonical" href={`https://vclock.app/set-timer-for-${finalDuration || '1-minute'}`} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={`${timerContent.title} | VClock`} />
        <meta property="og:description" content={timerContent.metaDescription} />
        <meta property="og:url" content={`https://vclock.app/set-timer-for-${finalDuration || '1-minute'}`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${timerContent.title} | VClock`} />
        <meta name="twitter:description" content={timerContent.metaDescription} />
      </Helmet>

      {/* Timer Finished Modal */}
      {isFinished && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-black rounded-lg p-8 max-w-md w-full mx-4 text-center animate-alarm-modal-in border border-gray-200 dark:border-gray-700">
            <div className="text-6xl mb-4">⏰</div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Time's Up!</h2>
            <p className="text-lg mb-2 text-gray-800 dark:text-white">{pageTitle} Timer</p>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Your timer has finished.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => { stopBeeping(); setIsFinished(false); }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium"
              >
                Dismiss / Stop Sound
              </button>
              <button
                onClick={() => {
                  stopBeeping();
                  setIsFinished(false);
                  resetTimer();
                  startTimer();
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium"
              >
                Restart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Timer Display - matches Timer page style */}
      <div 
        id="custom-timer-display"
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
          {/* Timer Title */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-white">
            {pageTitle} Timer
          </h1>
          
          {/* Timer Display - matches Timer page style */}
          <div 
            className={`font-light mb-4 tracking-tight leading-none flex items-baseline justify-center font-nunito ${
              isFinished ? 'text-red-500' : isFullscreen ? 'text-white' : 'text-gray-800 dark:text-white'
            }`}
            style={{ 
              fontSize: `${Math.round(isFullscreen ? fontSize * 1.5 : Math.min(fontSize, window.innerWidth * 0.15))}px`,
              fontWeight: 900,
              letterSpacing: '0.04em',
              textAlign: 'center',
            }}
          >
            <span>{formatTime(remaining)}</span>
          </div>

          {/* Control Buttons - matches Timer page style */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-4">
            {!isRunning ? (
              <button 
                onClick={startTimer}
                className="px-4 sm:px-8 py-2 sm:py-3 rounded-md font-medium text-white transition-colors shadow-sm bg-green-500 hover:bg-green-600 text-sm sm:text-base"
              >
                {isFinished ? 'Restart' : 'Start'}
              </button>
            ) : (
              <button 
                onClick={pauseTimer}
                className="px-4 sm:px-8 py-2 sm:py-3 rounded-md font-medium bg-yellow-400 hover:bg-yellow-500 text-white transition-colors shadow-sm text-sm sm:text-base"
              >
                Pause
              </button>
            )}
            <button 
              onClick={resetTimer}
              className="px-4 sm:px-8 py-2 sm:py-3 rounded-md font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors shadow-sm text-sm sm:text-base"
            >
              Reset
            </button>
          </div>
          {/* Move the sound selection and Test Sound button after the timer control buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mt-4 mb-4">
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

      {/* Grid for Preset Timers and Recently Used */}
      {!isFullscreen && (
        <div className="p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Preset Timers */}
          <div className="bg-white dark:bg-black rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-medium text-gray-800 dark:text-white">More Timer Options - Explore Other Durations</h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {currentTimers.map((timer, index) => (
                <button
                  key={startIndex + index}
                  onClick={() => {
                    const slug = secondsToSlug(timer.value);
                    window.location.href = `/set-timer-for-${slug}`;
                  }}
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
              <h3 className="text-base sm:text-lg font-medium text-gray-800 dark:text-white">Popular Timer Choices</h3>
              <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <div className="space-y-2">
              {[
                { label: '15 Minute Timer', value: 900 },
                { label: '25 Minute Timer', value: 1500 },
                { label: '45 Minute Timer', value: 2700 },
              ].map((timer, index) => (
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
      )}

      {/* Instructions Card */}
      {!isFullscreen && (
        <div className="p-4 sm:p-6 bg-white dark:bg-black mx-3 sm:mx-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-base sm:text-lg font-medium text-gray-800 dark:text-white mb-3 sm:mb-4">
            {timerContent.title}
          </h3>
          <div className="space-y-2 sm:space-y-3 text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
            <p>
              {timerContent.intro}
            </p>
            <p>
              {timerContent.description}
            </p>
            <ul className="list-disc pl-4 sm:pl-6 space-y-1">
              {timerContent.features.map((feature, index) => (
                <li key={index}><strong>{feature.split(':')[0]}:</strong> {feature.split(':')[1]}</li>
              ))}
            </ul>
            <p>
              {timerContent.conclusion}
            </p>
          </div>
        </div>
      )}

      {/* Share This Timer Section */}
      {!isFullscreen && (
        <div className="p-4 sm:p-6 mx-3 sm:mx-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-lg mt-4 border border-blue-200 dark:border-blue-700">
          <div className="text-center">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Share This {pageTitle} Timer</h4>
            <p className="text-xs text-blue-600 dark:text-blue-300 mb-3">Found the perfect timing? Share it with friends!</p>
            <div className="text-blue-500 dark:text-blue-400 text-xs sm:text-sm mb-3 font-mono">https://vclock.com{location.pathname}</div>
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
      )}
    </>
  );
};

export default CustomTimer;