import React, { useEffect, useState } from 'react';
import { Share2, Maximize2, Minimize2, ZoomIn, ZoomOut, Settings, X } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const defaultCities = [
  { name: 'New York', tz: 'America/New_York' },
  { name: 'Chicago, Illinois', tz: 'America/Chicago' },
  { name: 'Denver, Colorado', tz: 'America/Denver' },
  { name: 'Los Angeles, California', tz: 'America/Los_Angeles' },
  { name: 'Phoenix, Arizona', tz: 'America/Phoenix' },
  { name: 'Anchorage, Alaska', tz: 'America/Anchorage' },
  { name: 'Honolulu, Hawaii', tz: 'Pacific/Honolulu' },
  { name: 'Toronto, Canada', tz: 'America/Toronto' },
  { name: 'London, United Kingdom', tz: 'Europe/London' },
  { name: 'Sydney, Australia', tz: 'Australia/Sydney' },
  { name: 'Manila, Philippines', tz: 'Asia/Manila' },
  { name: 'Singapore, Singapore', tz: 'Asia/Singapore' },
  { name: 'Tokyo, Japan', tz: 'Asia/Tokyo' },
  { name: 'Beijing, China', tz: 'Asia/Shanghai' },
  { name: 'Berlin, Germany', tz: 'Europe/Berlin' },
  { name: 'Mexico City, Mexico', tz: 'America/Mexico_City' },
  { name: 'Buenos Aires, Argentina', tz: 'America/Argentina/Buenos_Aires' },
  { name: 'Dubai, United Arab Emirates', tz: 'Asia/Dubai' },
];

const allCities = [
  ...defaultCities,
  { name: 'Paris, France', tz: 'Europe/Paris' },
  { name: 'Moscow, Russia', tz: 'Europe/Moscow' },
  { name: 'San Francisco, California', tz: 'America/Los_Angeles' },
  { name: 'Seoul, Korea', tz: 'Asia/Seoul' },
  { name: 'Istanbul, Turkey', tz: 'Europe/Istanbul' },
  { name: 'Bangkok, Thailand', tz: 'Asia/Bangkok' },
  { name: 'Wellington, New Zealand', tz: 'Pacific/Auckland' },
  // ...add more as needed
];

function getTimeInZone(tz: string, opts: Intl.DateTimeFormatOptions = {}) {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: tz,
    ...opts,
  });
}

function getDateInZone(tz: string) {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    timeZone: tz,
  });
}

function getTimeDiff(localTz: string, cityTz: string) {
  const now = new Date();
  const local = new Date(now.toLocaleString('en-US', { timeZone: localTz }));
  const city = new Date(now.toLocaleString('en-US', { timeZone: cityTz }));
  const diff = (city.getTime() - local.getTime()) / 60000; // in minutes
  if (diff === 0) return '';
  const sign = diff > 0 ? '+' : '-';
  const abs = Math.abs(diff);
  const h = Math.floor(abs / 60);
  const m = Math.abs(abs % 60);
  return `${sign}${h}:${m.toString().padStart(2, '0')}`;
}

const popularCities = [
  [
    'New York', 'Philadelphia, Pennsylvania', 'Chicago, Illinois', 'Houston, Texas', 'San Antonio, Texas', 'Dallas, Texas', 'Denver, Colorado', 'Los Angeles, California', 'San Diego, California', 'San Jose, California', 'Phoenix, Arizona', 'Anchorage, Alaska', 'Honolulu, Hawaii', 'Toronto, Canada', 'Montreal, Canada',
  ],
  [
    'Winnipeg, Canada', 'Calgary, Canada', 'Vancouver, Canada', 'London, United Kingdom', 'Dublin, Ireland', 'Sydney, Australia', 'Melbourne, Australia', 'Brisbane, Australia', 'Perth, Australia', 'Adelaide, Australia', 'Wellington, New Zealand', 'Manila, Philippines', 'Singapore, Singapore', 'Tokyo, Japan', 'Seoul, Korea', 'Taipei, Taiwan',
  ],
  [
    'Beijing, China', 'Shanghai, China', 'Urumqi, China', 'Berlin, Germany', 'Paris, France', 'Copenhagen, Denmark', 'Rome, Italy', 'Madrid, Spain', 'Ceuta, Africa, Spain', 'Canary Islands, Spain', 'Stockholm, Sweden', 'Lisbon, Portugal', 'Madeira, Portugal', 'Azores, Portugal', 'Helsinki, Finland', 'Athens, Greece',
  ],
  [
    'Istanbul, Turkey', 'Warsaw, Poland', 'Kiev, Ukraine', 'Moscow, Russia', 'Jerusalem, Israel', 'New Delhi, India', 'Kolkata, India', 'Noronha, Brazil', 'Sao Paulo, Brazil', 'Rio de Janeiro, Brazil', 'Manaus, Brazil', 'Rio Branco, Brazil', 'Mexico City, Mexico', 'Santiago, Chile', 'Buenos Aires, Argentina', 'Dubai, United Arab Emirates',
  ],
];

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}
function getAMPM(date: Date) {
  return date.toLocaleTimeString('en-US', { hour12: true }).split(' ')[1];
}
function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).toUpperCase();
}

// Fix: Add City type
interface City {
  name: string;
  tz: string;
}

const getCountries = (cities: City[]): Record<string, City[]> => {
  const countryMap: Record<string, City[]> = {};
  cities.forEach((city) => {
    const country = city.name.split(',').pop()?.trim() || '';
    if (!countryMap[country]) countryMap[country] = [];
    countryMap[country].push(city);
  });
  return countryMap;
};

const WorldClock: React.FC = () => {
  const [cities, setCities] = useState(defaultCities);
  const [search, setSearch] = useState('');
  const [times, setTimes] = useState<{ [tz: string]: string }>({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [fontSize, setFontSize] = useState(144);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const addCityInputRef = React.useRef<HTMLInputElement>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedTz, setSelectedTz] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const countryMap = getCountries(allCities as City[]);
  const countryList = Object.keys(countryMap);

  useEffect(() => {
    // Update all city times every second
    const updateTimes = () => {
      setTimes(
        Object.fromEntries(
          cities.map(city => [city.tz, getTimeInZone(city.tz)])
        )
      );
      setCurrentTime(new Date());
    };
    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, [cities, localTz]);

  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 16, 256));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 16, 64));
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        const clockElement = document.getElementById('main-clock-display');
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
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const addCity = (city: { name: string; tz: string }) => {
    if (!cities.find(c => c.tz === city.tz)) {
      setCities([...cities, city]);
    }
    setSearch('');
  };

  const removeCity = (tz: string) => {
    setCities(cities.filter(city => city.tz !== tz));
  };

  const filteredCities = allCities.filter(
    city =>
      city.name.toLowerCase().includes(search.toLowerCase()) &&
      !cities.find(c => c.tz === city.tz)
  );

  return (
    <>
      <Helmet>
        <title>Free World Clock | Current Time in Cities Worldwide</title>
        <meta name="description" content="Free world clock showing current time in cities worldwide. Add cities, compare time zones, and track global time differences. Perfect for travel and international meetings." />
        <link rel="canonical" href="https://vclock.app/time" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Free World Clock | Current Time in Cities Worldwide" />
        <meta property="og:description" content="Free world clock showing current time in cities worldwide. Add cities, compare time zones, and track global time differences. Perfect for travel and international meetings." />
        <meta property="og:url" content="https://vclock.app/time" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free World Clock | Current Time in Cities Worldwide" />
        <meta name="twitter:description" content="Free world clock showing current time in cities worldwide. Add cities, compare time zones, and track global time differences. Perfect for travel and international meetings." />
      </Helmet>
      <div className="bg-gray-100 min-h-screen pb-6 sm:pb-10">
        {/* Main Clock - styled exactly like AlarmClock, now full width */}
        <div 
          id="main-clock-display"
          className={
            isFullscreen
              ? 'fixed inset-0 z-50 flex flex-col justify-center items-center bg-black text-white border-0 text-center'
              : 'bg-white dark:bg-black border-b border-gray-200 text-center relative p-4 sm:p-8 lg:p-12'
          }
          style={!isFullscreen ? { minHeight: '280px' } : {}}
        >
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex space-x-1 sm:space-x-2">
            <button 
              onClick={decreaseFontSize}
              aria-label="Decrease font size"
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
              aria-label="Increase font size"
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
            }`} title="Share" aria-label="Share">
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button 
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
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
            <button className="p-2 rounded transition-colors hover:bg-gray-100 text-gray-600" title="Settings" aria-label="Settings">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          <div className="w-full flex flex-col items-center justify-center py-4 sm:py-8">
            <div className="flex flex-col items-center justify-center">
              <div 
                className="font-nunito text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-gray-700" style={{
                  color: '#555555',
                  letterSpacing: '0.04em',
                  fontWeight: 900,
                  textAlign: 'center',
                }}>
                {/* Always show 12-hour format with AM/PM */}
                {(() => {
                  const time12 = currentTime.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
                  const [time, ampm] = time12.split(' ');
                  return <>
                    <span>{time.replace(/^0/, '')}</span>
                    <span style={{ fontSize: '0.35em', marginLeft: '0.25em', fontWeight: 400, letterSpacing: '0.08em', verticalAlign: 'baseline' }}>{ampm}</span>
                  </>;
                })()}
              </div>
              <div className="font-nunito text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 mt-2 font-bold" style={{
                color: '#555555',
                letterSpacing: '0.18em',
                fontWeight: 900,
                textAlign: 'center',
              }}>
                {formatDate(currentTime)}
              </div>
            </div>
          </div>
        </div>

        {/* City Clocks Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-10 px-3 sm:px-0" style={{paddingTop: 20}}>
          {cities.map(city => {
            const diff = getTimeDiff(localTz, city.tz);
            const time12 = getTimeInZone(city.tz, { hour12: true });
            const [time, ampm] = time12.split(' ');
            return (
              <div key={city.tz} className="bg-white rounded-lg shadow p-3 sm:p-6 flex flex-col items-center relative">
                <button
                  onClick={() => removeCity(city.tz)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-lg"
                  title="Remove city"
                  aria-label={`Remove ${city.name}`}
                >×</button>
                <div className="text-sm sm:text-base font-medium mb-2 text-center">{city.name}</div>
                <div className="font-nunito text-xl sm:text-3xl mb-1" style={{
                  color: '#555555',
                  fontWeight: 900,
                  letterSpacing: '0.04em',
                  textAlign: 'center',
                }}>
                  {time} <span style={{ fontSize: '0.5em', marginLeft: '0.25em', fontWeight: 400, letterSpacing: '0.08em', verticalAlign: 'baseline' }}>{ampm}</span>
                </div>
                <div className="text-gray-500 text-xs mb-1">Today{diff ? `, ${diff}` : ''}</div>
              </div>
            );
          })}
          {/* Add City Card */}
          <div className="flex flex-col items-center justify-center min-h-[100px] sm:min-h-[120px] border-2 border-dashed border-blue-400 bg-blue-50 rounded-xl transition-shadow hover:shadow-lg cursor-pointer group">
            <button
              className="flex flex-col items-center justify-center gap-2 text-blue-600 bg-white border-2 border-blue-400 rounded-full w-12 h-12 sm:w-16 sm:h-16 text-2xl sm:text-4xl font-bold shadow-sm group-hover:bg-blue-100 transition-colors"
              style={{ outline: 'none' }}
              onClick={() => setShowAddModal(true)}
              aria-label="Add city"
            >
              <svg width="24" height="24" className="sm:w-8 sm:h-8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="16" y1="6" x2="16" y2="26" /><line x1="6" y1="16" x2="26" y2="16" /></svg>
            </button>
            <span className="mt-2 sm:mt-3 text-blue-700 font-medium text-sm sm:text-lg group-hover:text-blue-900 transition-colors">Add City</span>
          </div>
        </div>

        {/* Optimized Instructions Section */}
        <div className="max-w-6xl mx-auto mb-4 sm:mb-6 bg-white rounded-lg p-4 sm:p-6 mx-3 sm:mx-0">
          <h4 className="text-base sm:text-lg font-medium text-gray-800 mb-2">How to Use the World Clock</h4>
          <div className="text-gray-600 text-xs sm:text-sm space-y-2">
            <p>
              Instantly check the current time and date in any city or time zone around the world. Our online world clock makes it easy to compare times, plan meetings, and stay in sync—no matter where you are.
            </p>
            <ul className="list-disc pl-4 sm:pl-6">
              <li>
                <strong>See your local time:</strong> The main clock shows your current time and date.
              </li>
              <li>
                <strong>Add city clocks:</strong> Search for any city and add it to your grid for quick reference.
              </li>
              <li>
                <strong>Compare time zones:</strong> Instantly view the time difference between your location and other cities.
              </li>
              <li>
                <strong>Customize your view:</strong> Adjust the clock size, go fullscreen, or share your setup with friends.
              </li>
            </ul>
            <p>
              Your city list and settings are saved in your browser for next time. No sign-up needed—just bookmark and go!
            </p>
          </div>
        </div>

        {/* Modernized Popular Cities Section */}
        <div className="max-w-6xl mx-auto mb-6 sm:mb-10 mx-3 sm:mx-0 rounded-2xl shadow-lg bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6 sm:p-10 border border-blue-100">
          <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>
            Popular Cities & Time Zones
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularCities.map((col, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-3 border border-blue-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 0 20" /></svg>
                  <span className="text-blue-700 font-semibold text-base">Cities</span>
                </div>
                <div className="flex flex-wrap gap-2">
                {col.map(city => (
                    <span key={city} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium shadow-sm hover:bg-blue-200 transition-colors cursor-pointer border border-blue-200">{city}</span>
                ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Optimized Share/Embed Section */}
        <div className="max-w-6xl mx-auto bg-white rounded-lg p-4 sm:p-6 flex flex-col items-center mx-3 sm:mx-0">
          <input
            type="text"
            value="https://vclock.com/time/"
            readOnly
            className="w-full max-w-md px-3 sm:px-4 py-2 rounded border border-gray-300 mb-3 text-center text-gray-700 text-sm sm:text-base"
          />
          <div className="flex flex-wrap justify-center gap-2 mb-2">
            {/* Social icons (stubbed as colored circles) */}
            <span className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs sm:text-sm">f</span>
            <span className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-400 rounded flex items-center justify-center text-white text-xs sm:text-sm">t</span>
            <span className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded flex items-center justify-center text-white text-xs sm:text-sm">W</span>
            <span className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 rounded flex items-center justify-center text-white text-xs sm:text-sm">B</span>
            <span className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-600 rounded flex items-center justify-center text-white text-xs sm:text-sm">r</span>
            <span className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-800 rounded flex items-center justify-center text-white text-xs sm:text-sm">t</span>
            <span className="w-6 h-6 sm:w-8 sm:h-8 bg-red-600 rounded flex items-center justify-center text-white text-xs sm:text-sm">P</span>
            <span className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-700 rounded flex items-center justify-center text-white text-xs sm:text-sm">in</span>
            <span className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-600 rounded flex items-center justify-center text-white text-xs sm:text-sm">⧉</span>
            <span className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs sm:text-sm">Embed</span>
          </div>
          <div className="text-gray-500 text-xs mt-2 text-center">
            Share this world clock with friends or embed it on your website!
          </div>
        </div>
        {/* Add City Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-2 sm:p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between px-4 sm:px-8 py-3 sm:py-5 rounded-t-lg" style={{ backgroundColor: '#0090DD' }}>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-normal text-white">Add</h2>
                <button onClick={() => setShowAddModal(false)} className="text-white hover:text-blue-100 text-xl sm:text-2xl lg:text-3xl"><X className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" /></button>
              </div>
              <div className="px-4 sm:px-8 pt-4 sm:pt-8 pb-0 space-y-4 sm:space-y-7">
                <div>
                  <label className="block text-sm sm:text-base font-normal text-gray-700 mb-2">Country</label>
                  <select
                    className="w-full h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white"
                    value={selectedCountry}
                    onChange={e => {
                      setSelectedCountry(e.target.value);
                      setSelectedTz('');
                      setCustomTitle('');
                    }}
                  >
                    <option value="">Select country</option>
                    {countryList.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm sm:text-base font-normal text-gray-700 mb-2">Time zone</label>
                  <select
                    className="w-full h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white"
                    value={selectedTz}
                    onChange={e => {
                      setSelectedTz(e.target.value);
                      const city = (countryMap[selectedCountry] as City[])?.find(c => c.tz === e.target.value);
                      setCustomTitle(city ? city.name : '');
                    }}
                    disabled={!selectedCountry}
                  >
                    <option value="">Select time zone</option>
                    {selectedCountry && (countryMap[selectedCountry] as City[])?.map((city) => (
                      <option key={city.tz} value={city.tz}>
                        (UTC {new Date().toLocaleTimeString('en-US', { timeZone: city.tz, hour12: false, hour: '2-digit', minute: '2-digit' })}) {city.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm sm:text-base font-normal text-gray-700 mb-2">Title</label>
                  <input
                    className="w-full h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white"
                    value={customTitle}
                    onChange={e => setCustomTitle(e.target.value)}
                    placeholder="City name"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 px-4 sm:px-8 py-3 sm:py-5 border-t bg-gray-50 rounded-b-lg mt-2">
                <button onClick={() => setShowAddModal(false)} className="w-full sm:w-24 h-10 border border-gray-300 rounded bg-white text-sm sm:text-base font-normal hover:bg-gray-100">Cancel</button>
                <button
                  className="w-full sm:w-24 h-10 bg-green-500 text-white text-sm sm:text-base font-normal rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={!selectedCountry || !selectedTz || !customTitle}
                  onClick={() => {
                    if (selectedCountry && selectedTz && customTitle) {
                      const city = (countryMap[selectedCountry] as City[])?.find((c) => c.tz === selectedTz);
                      if (city && !cities.find(c => c.tz === city.tz)) {
                        setCities([...cities, { ...city, name: customTitle }]);
                      }
                      setShowAddModal(false);
                      setSelectedCountry('');
                      setSelectedTz('');
                      setCustomTitle('');
                    }
                  }}
                >OK</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default WorldClock;