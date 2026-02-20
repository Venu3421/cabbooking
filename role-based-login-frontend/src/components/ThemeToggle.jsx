import React, { useEffect, useState } from 'react';

const ThemeToggle = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Initialize theme from local storage or OS preference
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme === 'dark') {
            setIsDarkMode(true);
            document.body.classList.add('dark-mode');
        } else {
            setIsDarkMode(false);
            document.body.classList.remove('dark-mode');
        }
    }, []);

    const toggleTheme = () => {
        if (isDarkMode) {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
            setIsDarkMode(false);
        } else {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            setIsDarkMode(true);
        }
    };

    return (
        <div className="theme-switch-wrapper" title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <label className="theme-switch">
                <input
                    type="checkbox"
                    checked={isDarkMode}
                    onChange={toggleTheme}
                />
                <div className="slider round">
                    <div className="slider-thumb"></div>
                </div>
            </label>
        </div>
    );
};

export default ThemeToggle;
