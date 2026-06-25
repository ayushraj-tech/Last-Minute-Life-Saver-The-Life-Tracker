import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, Search, Mic, CloudSun, Calendar, Check, Trash2, Globe, ArrowUpRight, ChevronDown, CheckCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VoiceWidget } from './VoiceWidget';

export const Navbar: React.FC = () => {
  const { 
    setIsSearchOpen, notifications, markNotificationAsRead, clearNotifications, currentView, user
  } = useApp();

  const [time, setTime] = useState(new Date());
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [weather, setWeather] = useState<{
    temp: number;
    condition: string;
    city: string;
    loading: boolean;
  }>({
    temp: 22,
    condition: 'Sunny ☀️',
    city: 'San Francisco',
    loading: true
  });

  // Fetch local weather based on geolocation or IP fallback
  useEffect(() => {
    let active = true;

    const mapWeatherCode = (code: number): string => {
      if (code === 0) return 'Clear Sky ☀️';
      if ([1, 2, 3].includes(code)) return 'Partly Cloudy ⛅';
      if ([45, 48].includes(code)) return 'Foggy 🌫️';
      if ([51, 53, 55].includes(code)) return 'Drizzle 🌧️';
      if ([61, 63, 65].includes(code)) return 'Heavy Rain 🌧️';
      if ([71, 73, 75].includes(code)) return 'Snowy ❄️';
      if ([80, 81, 82].includes(code)) return 'Rain Showers 🌦️';
      if ([95, 96, 99].includes(code)) return 'Thunderstorm ⛈️';
      return 'Cloudy ☁️';
    };

    const fetchWeather = async (latitude: number, longitude: number, cityName?: string) => {
      try {
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=celsius`
        );
        const weatherData = await weatherRes.json();
        if (!active) return;

        const current = weatherData.current_weather;
        const condition = current ? mapWeatherCode(current.weathercode) : 'Sunny ☀️';
        const temp = current ? Math.round(current.temperature) : 22;

        let finalCity = cityName || 'Local Region';
        if (!cityName) {
          try {
            const geocodeRes = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const geocodeData = await geocodeRes.json();
            finalCity = geocodeData.city || geocodeData.locality || geocodeData.principalSubdivision || 'Local Region';
          } catch (err) {
            console.error('Reverse geocoding failed', err);
          }
        }

        if (active) {
          setWeather({
            temp,
            condition,
            city: finalCity,
            loading: false
          });
        }
      } catch (err) {
        console.error('Weather fetch error', err);
      }
    };

    const fallbackToIp = async () => {
      try {
        const ipRes = await fetch('https://ipapi.co/json/');
        const ipData = await ipRes.json();
        if (!active) return;
        if (ipData.latitude && ipData.longitude) {
          fetchWeather(ipData.latitude, ipData.longitude, ipData.city);
        } else {
          setWeather(prev => ({ ...prev, loading: false }));
        }
      } catch (err) {
        console.error('IP geolocation fallback failed', err);
        if (active) {
          setWeather(prev => ({ ...prev, loading: false }));
        }
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (active) {
            fetchWeather(position.coords.latitude, position.coords.longitude);
          }
        },
        (error) => {
          console.warn('Geolocation denied, falling back to IP:', error.message);
          fallbackToIp();
        },
        { timeout: 5000 }
      );
    } else {
      fallbackToIp();
    }

    return () => {
      active = false;
    };
  }, []);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close notifications dropdown on clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifPanel(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format Date beautifully
  const formatTime = () => {
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = () => {
    return time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 border-b border-slate-100 bg-white flex items-center justify-between px-6 select-none shrink-0 sticky top-0 z-40">
      {/* Search Input Bar (Shortcut trigger) */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100/50 rounded-xl text-slate-400 text-xs font-semibold shadow-xs transition-all w-60 text-left cursor-pointer"
        >
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="flex-1">Search or Ctrl + K...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 border border-slate-200 bg-white rounded-md text-[9px] font-bold text-slate-400 shadow-xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Center Widgets: Date, Clock, Weather */}
      <div className="hidden md:flex items-center gap-4 border-x border-slate-100 px-6 h-full">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Calendar className="w-4 h-4 text-blue-500" />
          <span>{formatDate()}</span>
        </div>
        <div className="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 font-mono">
          {formatTime()}
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500" title={`Live weather in ${weather.city}`}>
          <CloudSun className="w-4 h-4 text-amber-500 animate-spin-slow" />
          <span>{weather.loading ? 'Fetching Weather...' : `${weather.temp}°C, ${weather.condition} (${weather.city})`}</span>
        </div>
      </div>

      {/* Right Actions: Voice, Notification Panel, Profile dropdown */}
      <div className="flex items-center gap-3">
        {/* Active AI Coaching Assistant floating indicator */}
        <button
          onClick={() => setIsVoiceOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/10 cursor-pointer hover:scale-103 transition-transform"
        >
          <Mic className="w-3.5 h-3.5 animate-pulse" />
          <span className="hidden sm:inline">Voice Commander</span>
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifPanel(!showNotifPanel)}
            className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-500 hover:text-slate-700 relative border border-slate-100 cursor-pointer transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            )}
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {/* Notification dropdown panel */}
          {showNotifPanel && (
            <div className="absolute right-0 mt-2.5 w-80 bg-white border border-slate-100 shadow-2xl rounded-2xl p-4 overflow-hidden animate-fade-in z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded-full text-[9px]">
                      {unreadCount} unread
                    </span>
                  )}
                </h4>
                {notifications.length > 0 && (
                  <button
                    onClick={clearNotifications}
                    className="text-[10px] text-red-500 hover:text-red-600 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Clear all
                  </button>
                )}
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`p-3 rounded-xl border transition-all text-left relative group cursor-pointer ${
                        notif.read 
                          ? 'bg-white border-slate-100 text-slate-500 opacity-70' 
                          : 'bg-blue-50/20 border-blue-50 text-slate-700 hover:bg-blue-50/30'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold block">{notif.title}</span>
                        {!notif.read && (
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                        )}
                      </div>
                      <p className="text-[11px] leading-relaxed mb-1.5">{notif.message}</p>
                      <span className="text-[9px] text-slate-400 font-medium block">{notif.timestamp}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-xs font-semibold text-slate-400">All caught up!</p>
                    <p className="text-[10px] text-slate-400 mt-1">You have zero alerts right now.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Minimal User Profile Info */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-100">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full border border-slate-200"
          />
          <div className="hidden lg:block text-left">
            <span className="block text-xs font-bold text-slate-700 leading-none">{user.name}</span>
            <span className="text-[10px] font-bold text-blue-500">Lvl {user.level} Hero</span>
          </div>
        </div>
      </div>

      <VoiceWidget isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />
    </header>
  );
};
