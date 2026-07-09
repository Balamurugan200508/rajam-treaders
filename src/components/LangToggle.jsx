import React from 'react';

export default function LangToggle({ currentLang, setLang }) {
  return (
    <div className="flex items-center bg-[#1a221b]/80 backdrop-blur-md border border-[#2e4030] rounded-full p-0.5 shadow-lg shadow-emerald-950/20 select-none">
      <button
        onClick={() => setLang('en')}
        className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
          currentLang === 'en'
            ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-[#0d130e] shadow-md shadow-emerald-500/20 font-bold scale-105'
            : 'text-gray-400 hover:text-emerald-400'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang('ta')}
        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
          currentLang === 'ta'
            ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-[#0d130e] shadow-md shadow-emerald-500/20 font-bold scale-105'
            : 'text-gray-400 hover:text-emerald-400'
        }`}
      >
        தமிழ்
      </button>
    </div>
  );
}
