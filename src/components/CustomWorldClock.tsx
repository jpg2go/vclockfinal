import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ZoomIn, ZoomOut, Maximize2, Minimize2, Share2, Settings, X } from 'lucide-react';

// City type and city list (copied from WorldClock)
type City = { name: string; tz: string };
const allCities: City[] = [
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
  { name: 'Paris, France', tz: 'Europe/Paris' },
  { name: 'Moscow, Russia', tz: 'Europe/Moscow' },
  { name: 'San Francisco, California', tz: 'America/Los_Angeles' },
  { name: 'Seoul, Korea', tz: 'Asia/Seoul' },
  { name: 'Istanbul, Turkey', tz: 'Europe/Istanbul' },
  { name: 'Bangkok, Thailand', tz: 'Asia/Bangkok' },
  { name: 'Wellington, New Zealand', tz: 'Pacific/Auckland' },
];

function normalize(str: string) {
  return str.replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
}

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

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

// Add popularCities array for the popular cities section
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

const CustomWorldClock: React.FC = () => {
  const { city, region } = useParams();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [fontSize, setFontSize] = useState(144);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  let citiesToShow: City[] = [];
  if (city && !region) {
    const match = allCities.find(c => normalize(c.name).includes(normalize(city)));
    if (match) citiesToShow = [match];
  } else if (city && region) {
    const match1 = allCities.find(c => normalize(c.name).includes(normalize(city)));
    const match2 = allCities.find(c => normalize(c.name).includes(normalize(region)) && (!match1 || c.name !== match1.name));
    if (match1) citiesToShow.push(match1);
    if (match2) citiesToShow.push(match2);
  }

  if (citiesToShow.length === 0) {
    return <div className="text-center mt-10 text-xl text-gray-500">City not found.</div>;
  }

  // Determine which timezone to use for the main clock
  let mainTz = undefined;
  if (citiesToShow.length > 0) {
    mainTz = citiesToShow[0].tz;
  }

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Hide share dropdown when clicking outside
  useEffect(() => {
    if (!showShare) return;
    function handleClick(e: MouseEvent) {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setShowShare(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showShare]);

  return (
    <div className="bg-gray-100 pb-4 sm:pb-6 px-4 md:px-8">
      <Helmet>
        <title>{citiesToShow.map(c => c.name).join(' / ')} - World Clock</title>
        <meta name="description" content={`Current time in ${citiesToShow.map(c => c.name).join(' and ')}`} />
      </Helmet>
      {/* Main Clock - match WorldClock layout */}
      <div 
        id="main-clock-display"
        className={
          isFullscreen
            ? 'fixed inset-0 z-50 flex flex-col justify-center items-center bg-black text-white border-0 text-center'
            : 'bg-white dark:bg-black border-b border-gray-200 text-center relative p-4 sm:p-8 lg:p-12 rounded-2xl shadow-lg border border-blue-100 mx-auto'
        }
        style={!isFullscreen ? { minWidth: '1278px', maxWidth: '1278px' } : {}}
      >
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex space-x-1 sm:space-x-2">
            <button onClick={() => setFontSize(f => Math.max(f - 16, 64))} aria-label="Decrease font size" className={`p-2 rounded transition-colors ${isFullscreen ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-100 text-gray-600'}`} title="Decrease font size"><ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" /></button>
            <button onClick={() => setFontSize(f => Math.min(f + 16, 256))} aria-label="Increase font size" className={`p-2 rounded transition-colors ${isFullscreen ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-100 text-gray-600'}`} title="Increase font size"><ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" /></button>
            <div className="relative" ref={shareRef}>
              <button
                className={`p-2 rounded transition-colors ${isFullscreen ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-100 text-gray-600'}`}
                title="Share"
                aria-label="Share"
                onClick={() => setShowShare(s => !s)}
              >
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              {showShare && (
                <>
                  {/* Caret Arrow */}
                  <div className="absolute right-6 -top-2 z-50">
                    <svg width="24" height="12" viewBox="0 0 24 12"><polygon points="12,0 24,12 0,12" fill="#fff" style={{filter:'drop-shadow(0 2px 4px rgba(0,0,0,0.08))'}} /></svg>
                  </div>
                  <div className="absolute right-0 mt-3 z-50 animate-fade-in-scale bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-2xl p-4 flex flex-col gap-3 min-w-[220px]" style={{boxShadow:'0 8px 32px 0 rgba(31,38,135,0.15)'}}>
                    {/* Close Button */}
                    <button onClick={()=>setShowShare(false)} className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors" aria-label="Close"><X className="w-4 h-4" /></button>
                    <span className="text-xs text-gray-500 mb-1 pl-1">Share this page:</span>
                    <div className="flex gap-3 justify-center mt-1 mb-2">
                      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1877f2] hover:bg-[#145db2] shadow text-white transition-transform hover:scale-110" title="Share on Facebook"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5 3.657 9.127 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.632.771-1.632 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.127 22 17 22 12"/></svg></a>
                      <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1da1f2] hover:bg-[#0d8ddb] shadow text-white transition-transform hover:scale-110" title="Share on Twitter"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.59-2.47.69a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.38 1.64 4.7c-.37.64-.58 1.38-.58 2.17 0 1.5.76 2.82 1.92 3.6-.71-.02-1.38-.22-1.97-.54v.05c0 2.1 1.5 3.85 3.5 4.25-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.12 2.94 3.99 2.97A8.6 8.6 0 0 1 2 19.54a12.13 12.13 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.39-.01-.58A8.72 8.72 0 0 0 24 4.59a8.5 8.5 0 0 1-2.54.7z"/></svg></a>
                      <a href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-[#25d366] hover:bg-[#1da851] shadow text-white transition-transform hover:scale-110" title="Share on WhatsApp"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.18-1.62A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.85 0-3.68-.5-5.25-1.44l-.38-.22-3.67.96.98-3.58-.25-.37A9.94 9.94 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.6c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.62-.47-.16-.01-.35-.01-.54-.01-.19 0-.5.07-.76.34-.26.27-1 1-.97 2.43.03 1.43 1.03 2.81 1.18 3 .15.19 2.03 3.1 4.93 4.23.69.3 1.23.48 1.65.61.69.22 1.32.19 1.81.12.55-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z"/></svg></a>
                      <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-[#0077b5] hover:bg-[#005983] shadow text-white transition-transform hover:scale-110" title="Share on LinkedIn"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.327-.027-3.037-1.849-3.037-1.851 0-2.132 1.445-2.132 2.939v5.667H9.358V9h3.414v1.561h.049c.476-.899 1.637-1.849 3.37-1.849 3.602 0 4.267 2.369 4.267 5.455v6.285zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zm1.777 13.019H3.56V9h3.554v11.452zM22.225 0H1.771C.792 0 0 .771 0 1.723v20.549C0 23.229.792 24 1.771 24h20.451C23.2 24 24 23.229 24 22.271V1.723C24 .771 23.2 0 22.225 0z"/></svg></a>
                    </div>
                  </div>
                </>
              )}
            </div>
            <button onClick={() => setIsFullscreen(f => !f)} aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} className={`p-2 rounded transition-colors ${isFullscreen ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-100 text-gray-600'}`} title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>{isFullscreen ? <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />}</button>
            <button className="p-2 rounded transition-colors hover:bg-gray-100 text-gray-600" title="Settings" aria-label="Settings"><Settings className="w-4 h-4 sm:w-5 sm:h-5" /></button>
          </div>
          <div className="w-full flex flex-col items-center justify-center py-4 sm:py-8">
            <div className="flex flex-col items-center justify-center">
              <div
                className={`font-nunito ${isFullscreen ? 'text-white' : 'text-gray-700'}`}
                style={{
                  color: isFullscreen ? '#fff' : '#555555',
                  letterSpacing: '0.04em',
                  fontWeight: 900,
                  textAlign: 'center',
                  fontSize: `${fontSize}px`,
                  lineHeight: 1.1,
                }}
              >
                {/* Show main clock in the selected city's timezone */}
                {(() => {
                  const time12 = mainTz
                    ? new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: mainTz })
                    : currentTime.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
                  const [time, ampm] = time12.split(' ');
                  return <><span>{time.replace(/^0/, '')}</span><span style={{ fontSize: `${Math.round(fontSize * 0.35)}px`, marginLeft: '0.25em', fontWeight: 400, letterSpacing: '0.08em', verticalAlign: 'baseline', color: isFullscreen ? '#fff' : undefined }}>{ampm}</span></>;
                })()}
              </div>
              <div
                className={`font-nunito text-sm sm:text-base md:text-lg lg:text-xl font-bold mt-2 ${isFullscreen ? 'text-white' : 'text-gray-500'}`}
                style={{
                  color: isFullscreen ? '#fff' : '#555555',
                  letterSpacing: '0.18em',
                  fontWeight: 900,
                  textAlign: 'center',
                }}
              >
                {mainTz
                  ? new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit', timeZone: mainTz })
                  : formatDate(currentTime)}
              </div>
            </div>
          </div>
      </div>
      {/* City Clocks Grid - only show if multiple cities */}
      {citiesToShow.length > 1 && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-12 mt-8 px-3 sm:px-0" style={{paddingTop: 20}}>
          {citiesToShow.map(city => {
            const time12 = getTimeInZone(city.tz, { hour12: true });
            const [time, ampm] = time12.split(' ');
            return (
              <div key={city.tz} className="bg-white rounded-lg shadow p-3 sm:py-6 sm:px-6 flex flex-col items-center relative">
                <div className="text-sm sm:text-base font-medium mb-2 text-center">{city.name}</div>
                <div className="font-nunito text-xl sm:text-3xl mb-1" style={{ color: '#555555', fontWeight: 900, letterSpacing: '0.04em', textAlign: 'center' }}>{time} <span style={{ fontSize: '0.5em', marginLeft: '0.25em', fontWeight: 400, letterSpacing: '0.08em', verticalAlign: 'baseline' }}>{ampm}</span></div>
                <div className="text-gray-500 text-xs mb-1">Today</div>
              </div>
            );
          })}
        </div>
      )}
      {/* Instructions Section */}
      <div className="mb-8 sm:mb-12 mt-8 mx-3 sm:mx-0 rounded-2xl shadow-lg bg-white p-6 sm:p-10 border border-blue-100">
        <h4 className="text-base sm:text-lg font-medium text-gray-800 mb-2">How to Use the World Clock</h4>
        <div className="text-gray-600 text-xs sm:text-sm space-y-2">
          <p>
            Instantly check the current time and date in any city or time zone around the world. Our online world clock makes it easy to compare times, plan meetings, and stay in sync—no matter where you are.
          </p>
          <ul className="list-disc pl-4 sm:pl-6">
            <li>
              <strong>See your local time:</strong> The main clock shows your selected city's current time and date.
            </li>
            <li>
              <strong>Compare time zones:</strong> Instantly view the time difference between your location and other cities.
            </li>
            <li>
              <strong>Customize your view:</strong> Adjust the clock size, go fullscreen, or share your setup with friends.
            </li>
          </ul>
          <p>
            No sign-up needed—just bookmark and go!
          </p>
        </div>
      </div>
      {/* Popular Cities Section */}
      <div className="mb-10 sm:mb-16 mt-8 mx-3 sm:mx-0 rounded-2xl shadow-lg bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6 sm:p-10 border border-blue-100">
        <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>
          Popular Cities & Time Zones
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {popularCities.map((col, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md py-6 px-4 flex flex-col gap-3 border border-blue-100 hover:shadow-xl transition-shadow">
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
    </div>
  );
};

export default CustomWorldClock; 