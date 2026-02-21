import React, { useState, useEffect } from 'react';
import Weather from '../Weather';

const GlobalClockWeather = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const formattedDate = currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });

    return (
        <div className="flex items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-lg px-3 py-1.5 shadow-sm transition-all hover:bg-white/10 pointer-events-auto cursor-default">
            <div className="flex flex-col items-end pr-3 border-r border-white/10">
                <span className="text-xs font-bold text-white tracking-tight leading-tight">{formattedTime}</span>
                <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wide leading-tight mt-0.5">{formattedDate}</span>
            </div>
            <div className="flex items-center pl-3 text-white text-xs font-medium">
                <Weather />
            </div>
        </div>
    );
};

export default GlobalClockWeather;
