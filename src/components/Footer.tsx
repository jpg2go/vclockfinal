import React from 'react';

const Footer: React.FC = React.memo(() => {
  return (
    <footer className="text-white py-3 sm:py-4 px-3 sm:px-6" style={{ backgroundColor: '#1A1A1A' }}>
      <div className="flex items-center justify-center text-xs sm:text-sm">
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-center">
          <a href="#" className="hover:text-gray-300 transition-colors">Contacts</a>
          <span className="hidden sm:inline">|</span>
          <a href="#" className="hover:text-gray-300 transition-colors">Terms of use</a>
          <span className="hidden sm:inline">|</span>
          <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
          <span className="hidden sm:inline">|</span>
          <span>© 2025 vClock.com</span>
        </div>
      </div>
    </footer>
  );
});

export default React.memo(Footer);