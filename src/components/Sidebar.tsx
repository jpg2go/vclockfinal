import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AlarmClock, Timer, Watch as Stopwatch, Clock, X } from 'lucide-react';

const Sidebar: React.FC = React.memo(() => {
  const location = useLocation();
  const menuItems = [
    { id: 'alarm', icon: AlarmClock, label: 'Alarm Clock', path: '/alarm' },
    { id: 'timer', icon: Timer, label: 'Timer', path: '/timer' },
    { id: 'stopwatch', icon: Stopwatch, label: 'Stopwatch', path: '/stopwatch' },
    { id: 'time', icon: Clock, label: 'Time', path: '/time' },
  ];

  return (
    <aside className="w-20 sm:w-24 md:w-32 flex flex-col" style={{ backgroundColor: '#3D3C3C' }}>
      {menuItems.map((item, index) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.id}
            to={item.path}
            className={`flex flex-col items-center justify-center py-4 sm:py-6 px-1 sm:px-3 transition-all duration-200 ${
              isActive 
                ? 'bg-gray-300 text-black' 
                : 'text-white hover:bg-gray-600'
            } ${index > 0 ? 'border-t border-gray-500' : ''}`}
            style={{ textDecoration: 'none' }}
          >
            <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mb-2 sm:mb-3" strokeWidth={1.5} />
            <span className="text-xs sm:text-sm font-medium text-center leading-tight">
              {item.label}
            </span>
          </Link>
        );
      })}
    </aside>
  );
});

export default React.memo(Sidebar);