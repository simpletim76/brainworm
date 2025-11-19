// ========================================
// NEURAL NEXUS - DASHBOARD CONTROLLER
// ========================================

const API_BASE = window.location.origin;
let startTime = Date.now();

// ========================================
// UTILITY FUNCTIONS
// ========================================

function updateLastUpdatedTime() {
    const now = new Date();
    document.getElementById('lastUpdate').textContent = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

function updateUptime() {
    const uptimeEl = document.getElementById('uptime');
    if (!uptimeEl) return;

    const elapsed = Date.now() - startTime;
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
        uptimeEl.textContent = `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
        uptimeEl.textContent = `${minutes}m ${seconds % 60}s`;
    } else {
        uptimeEl.textContent = `${seconds}s`;
    }
}

function showError(tile, message) {
    tile.innerHTML = `
        <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 15px;
            min-height: 150px;
            color: var(--color-danger);
            text-align: center;
        ">
            <div style="font-size: 2rem;">⚠️</div>
            <div style="font-size: 0.9rem; letter-spacing: 1px;">${message}</div>
        </div>
    `;
}

function showLoading(tile, message = 'LOADING...') {
    tile.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <div>${message}</div>
        </div>
    `;
}

// ========================================
// WEATHER MODULE
// ========================================

async function loadWeather() {
    const tile = document.querySelector('#weatherTile .tile-content');
    showLoading(tile, 'INITIALIZING...');

    try {
        const response = await fetch(`${API_BASE}/api/weather`);
        if (!response.ok) throw new Error('Network response failed');

        const data = await response.json();

        const weatherCodes = {
            0: { icon: '☀️', desc: 'CLEAR SKY' },
            1: { icon: '🌤️', desc: 'MAINLY CLEAR' },
            2: { icon: '⛅', desc: 'PARTLY CLOUDY' },
            3: { icon: '☁️', desc: 'OVERCAST' },
            45: { icon: '🌫️', desc: 'FOGGY' },
            48: { icon: '🌫️', desc: 'RIME FOG' },
            51: { icon: '🌧️', desc: 'LIGHT DRIZZLE' },
            61: { icon: '🌧️', desc: 'LIGHT RAIN' },
            63: { icon: '🌧️', desc: 'MODERATE RAIN' },
            65: { icon: '🌧️', desc: 'HEAVY RAIN' },
            71: { icon: '🌨️', desc: 'LIGHT SNOW' },
            73: { icon: '🌨️', desc: 'SNOW' },
            75: { icon: '🌨️', desc: 'HEAVY SNOW' },
            95: { icon: '⛈️', desc: 'THUNDERSTORM' }
        };

        const current = data.current;
        const weather = weatherCodes[current.weather_code] || { icon: '🌈', desc: 'UNKNOWN' };

        tile.innerHTML = `
            <div class="weather-info">
                <div style="font-size: 4rem; margin-bottom: 15px; animation: iconFloat 3s ease-in-out infinite;">
                    ${weather.icon}
                </div>
                <div class="temperature">${Math.round(current.temperature_2m)}°F</div>
                <div style="
                    font-size: 1rem;
                    color: var(--color-accent);
                    margin-bottom: 25px;
                    letter-spacing: 2px;
                    text-shadow: 0 0 10px rgba(0, 255, 136, 0.3);
                ">
                    ${weather.desc}
                </div>
                <div class="weather-details">
                    <div class="weather-detail">
                        <div class="weather-detail-label">💧 HUMIDITY</div>
                        <div class="weather-detail-value">${current.relative_humidity_2m}%</div>
                    </div>
                    <div class="weather-detail">
                        <div class="weather-detail-label">💨 WIND</div>
                        <div class="weather-detail-value">${Math.round(current.wind_speed_10m)} MPH</div>
                    </div>
                </div>
            </div>
        `;
        updateLastUpdatedTime();
    } catch (error) {
        console.error('Weather error:', error);
        showError(tile, 'SENSOR MALFUNCTION<br>UNABLE TO RETRIEVE DATA');
    }
}

// ========================================
// NEWS MODULE
// ========================================

async function loadNews() {
    const tile = document.querySelector('#newsTile .tile-content');
    showLoading(tile, 'SCANNING...');

    try {
        const response = await fetch(`${API_BASE}/api/news`);
        if (!response.ok) throw new Error('Network response failed');

        const data = await response.json();

        if (data.items && data.items.length > 0) {
            let html = '<div class="news-list">';

            data.items.slice(0, 5).forEach(item => {
                const date = new Date(item.pubDate);
                const timeStr = date.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                const dateStr = date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                });

                html += `
                    <div class="news-item" onclick="window.open('${item.link.replace(/'/g, "\\'")}', '_blank')">
                        <div class="news-title">${item.title}</div>
                        <div class="news-date">${dateStr} • ${timeStr}</div>
                    </div>
                `;
            });

            html += '</div>';
            tile.innerHTML = html;
        } else {
            tile.innerHTML = '<div style="text-align: center; color: var(--color-text-dim);">NO INTEL AVAILABLE</div>';
        }
        updateLastUpdatedTime();
    } catch (error) {
        console.error('News error:', error);
        showError(tile, 'FEED INTERRUPTED<br>CONNECTION LOST');
    }
}

// ========================================
// QUOTE MODULE
// ========================================

async function loadQuote() {
    const tile = document.querySelector('#quoteTile .tile-content');
    showLoading(tile, 'PROCESSING...');

    try {
        const response = await fetch(`${API_BASE}/api/quote`);
        if (!response.ok) throw new Error('Network response failed');

        const data = await response.json();

        tile.innerHTML = `
            <div class="quote-content">
                <div class="quote-text">${data.q}</div>
                <div class="quote-author">— ${data.a}</div>
            </div>
        `;
        updateLastUpdatedTime();
    } catch (error) {
        console.error('Quote error:', error);
        showError(tile, 'WISDOM CORE OFFLINE<br>RETRY LATER');
    }
}

// ========================================
// ISS TRACKER MODULE
// ========================================

async function loadISS() {
    const tile = document.querySelector('#issTile .tile-content');
    showLoading(tile, 'TRACKING...');

    try {
        const response = await fetch(`${API_BASE}/api/iss`);
        if (!response.ok) throw new Error('Network response failed');

        const data = await response.json();

        if (data.iss_position) {
            const lat = parseFloat(data.iss_position.latitude).toFixed(2);
            const lon = parseFloat(data.iss_position.longitude).toFixed(2);
            const timestamp = new Date(data.timestamp * 1000).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });

            tile.innerHTML = `
                <div class="iss-info">
                    <div style="
                        font-size: 4rem;
                        margin-bottom: 25px;
                        animation: iconFloat 3s ease-in-out infinite;
                    ">🛸</div>
                    <div class="coordinates">
                        <div class="coordinate">
                            <div class="coord-label">📍 LATITUDE</div>
                            <div class="coord-value">${lat}°</div>
                        </div>
                        <div class="coordinate">
                            <div class="coord-label">📍 LONGITUDE</div>
                            <div class="coord-value">${lon}°</div>
                        </div>
                    </div>
                    <div style="
                        margin-top: 20px;
                        font-size: 0.8rem;
                        color: var(--color-text-dim);
                        letter-spacing: 1px;
                    ">
                        LAST PING: ${timestamp}
                    </div>
                </div>
            `;
        } else {
            tile.innerHTML = '<div style="text-align: center; color: var(--color-text-dim);">SIGNAL LOST</div>';
        }
        updateLastUpdatedTime();
    } catch (error) {
        console.error('ISS error:', error);
        showError(tile, 'TRACKING FAILURE<br>SATELLITE OFFLINE');
    }
}

// ========================================
// CAT FACT ARCHIVE MODULE
// ========================================

async function loadCatFact() {
    const tile = document.querySelector('#catfactTile .tile-content');
    showLoading(tile, 'RETRIEVING...');

    try {
        const response = await fetch(`${API_BASE}/api/catfact`);
        if (!response.ok) throw new Error('Network response failed');

        const data = await response.json();

        tile.innerHTML = `
            <div class="catfact-content">
                <div style="
                    font-size: 4rem;
                    margin-bottom: 25px;
                    animation: iconFloat 3s ease-in-out infinite;
                ">🐱</div>
                <div class="catfact-text">${data.fact}</div>
            </div>
        `;
        updateLastUpdatedTime();
    } catch (error) {
        console.error('Cat fact error:', error);
        showError(tile, 'ARCHIVE ACCESS DENIED<br>DATABASE ERROR');
    }
}

// ========================================
// TIME DISPLAY MODULE
// ========================================

function updateTime() {
    const now = new Date();

    const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    const dateString = now.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).toUpperCase();

    const timeEl = document.getElementById('currentTime');
    const dateEl = document.getElementById('currentDate');

    if (timeEl) timeEl.textContent = timeString;
    if (dateEl) dateEl.textContent = dateString;
}

// ========================================
// REFRESH CONTROL
// ========================================

function refreshAll() {
    console.log('Refreshing all modules...');

    // Visual feedback
    const refreshBtn = event?.target;
    if (refreshBtn) {
        refreshBtn.style.transform = 'rotate(360deg) scale(0.9)';
        setTimeout(() => {
            refreshBtn.style.transform = '';
        }, 500);
    }

    // Refresh all data modules
    loadWeather();
    loadNews();
    loadQuote();
    loadISS();
    loadCatFact();
    updateLastUpdatedTime();
}

// ========================================
// INITIALIZATION
// ========================================

function init() {
    console.log('Initializing Neural Nexus Dashboard...');

    // Initial data load
    refreshAll();

    // Update time every second
    updateTime();
    setInterval(updateTime, 1000);

    // Update uptime every second
    updateUptime();
    setInterval(updateUptime, 1000);

    // Auto-refresh data every 5 minutes
    setInterval(refreshAll, 5 * 60 * 1000);

    console.log('Dashboard initialized successfully');
}

// ========================================
// EVENT LISTENERS
// ========================================

// Start when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Handle visibility changes (pause updates when tab is hidden)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        console.log('Dashboard visible, refreshing data...');
        refreshAll();
    }
});

// Log console startup message
console.log(`
%c╔═══════════════════════════════════════╗
║   NEURAL NEXUS DASHBOARD v2.0.47    ║
║   SYSTEM STATUS: OPERATIONAL         ║
║   ALL MODULES: ONLINE                ║
╚═══════════════════════════════════════╝`,
'color: #00ffff; font-family: monospace; font-size: 12px; text-shadow: 0 0 10px #00ffff;'
);
