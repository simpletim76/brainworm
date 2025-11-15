// API Base URL
const API_BASE = window.location.origin;

// Update last updated time
function updateLastUpdatedTime() {
    const now = new Date();
    document.getElementById('lastUpdate').textContent = now.toLocaleTimeString();
}

// Weather functions
async function loadWeather() {
    const tile = document.querySelector('#weatherTile .tile-content');
    tile.innerHTML = '<div class="loading">Loading...</div>';

    try {
        const response = await fetch(`${API_BASE}/api/weather`);
        const data = await response.json();

        const weatherCodes = {
            0: '☀️ Clear',
            1: '🌤️ Mainly Clear',
            2: '⛅ Partly Cloudy',
            3: '☁️ Overcast',
            45: '🌫️ Foggy',
            48: '🌫️ Foggy',
            51: '🌧️ Light Drizzle',
            61: '🌧️ Light Rain',
            63: '🌧️ Rain',
            65: '🌧️ Heavy Rain',
            71: '🌨️ Light Snow',
            73: '🌨️ Snow',
            75: '🌨️ Heavy Snow',
            95: '⛈️ Thunderstorm'
        };

        const current = data.current;
        const weatherDesc = weatherCodes[current.weather_code] || '🌈 Unknown';

        tile.innerHTML = `
            <div class="weather-info">
                <div style="font-size: 3rem; margin-bottom: 10px;">${weatherDesc.split(' ')[0]}</div>
                <div class="temperature">${Math.round(current.temperature_2m)}°F</div>
                <div style="font-size: 1.1rem; color: #666; margin-bottom: 20px;">${weatherDesc.split(' ').slice(1).join(' ')}</div>
                <div class="weather-details">
                    <div class="weather-detail">
                        <div class="weather-detail-label">Humidity</div>
                        <div class="weather-detail-value">${current.relative_humidity_2m}%</div>
                    </div>
                    <div class="weather-detail">
                        <div class="weather-detail-label">Wind Speed</div>
                        <div class="weather-detail-value">${Math.round(current.wind_speed_10m)} mph</div>
                    </div>
                </div>
            </div>
        `;
        updateLastUpdatedTime();
    } catch (error) {
        console.error('Error loading weather:', error);
        tile.innerHTML = '<div style="color: #ef4444; text-align: center;">Failed to load weather data</div>';
    }
}

// Crypto functions
async function loadCrypto() {
    const tile = document.querySelector('#cryptoTile .tile-content');
    tile.innerHTML = '<div class="loading">Loading...</div>';

    try {
        const response = await fetch(`${API_BASE}/api/crypto`);
        const data = await response.json();

        const cryptoNames = {
            bitcoin: '₿ Bitcoin',
            ethereum: 'Ξ Ethereum',
            cardano: '₳ Cardano'
        };

        let html = '<div class="crypto-list">';

        for (const [key, value] of Object.entries(data)) {
            const change = value.usd_24h_change || 0;
            const changeClass = change >= 0 ? 'positive' : 'negative';
            const changeSymbol = change >= 0 ? '▲' : '▼';

            html += `
                <div class="crypto-item">
                    <div>
                        <div class="crypto-name">${cryptoNames[key]}</div>
                        <div class="crypto-change ${changeClass}">
                            ${changeSymbol} ${Math.abs(change).toFixed(2)}%
                        </div>
                    </div>
                    <div class="crypto-price">$${value.usd.toLocaleString()}</div>
                </div>
            `;
        }

        html += '</div>';
        tile.innerHTML = html;
        updateLastUpdatedTime();
    } catch (error) {
        console.error('Error loading crypto:', error);
        tile.innerHTML = '<div style="color: #ef4444; text-align: center;">Failed to load crypto data</div>';
    }
}

// News functions
async function loadNews() {
    const tile = document.querySelector('#newsTile .tile-content');
    tile.innerHTML = '<div class="loading">Loading...</div>';

    try {
        const response = await fetch(`${API_BASE}/api/news`);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            let html = '<div class="news-list">';

            data.items.slice(0, 5).forEach(item => {
                const date = new Date(item.pubDate);
                html += `
                    <div class="news-item" onclick="window.open('${item.link}', '_blank')">
                        <div class="news-title">${item.title}</div>
                        <div class="news-date">${date.toLocaleDateString()} ${date.toLocaleTimeString()}</div>
                    </div>
                `;
            });

            html += '</div>';
            tile.innerHTML = html;
        } else {
            tile.innerHTML = '<div style="color: #666; text-align: center;">No news available</div>';
        }
        updateLastUpdatedTime();
    } catch (error) {
        console.error('Error loading news:', error);
        tile.innerHTML = '<div style="color: #ef4444; text-align: center;">Failed to load news</div>';
    }
}

// Quote functions
async function loadQuote() {
    const tile = document.querySelector('#quoteTile .tile-content');
    tile.innerHTML = '<div class="loading">Loading...</div>';

    try {
        const response = await fetch(`${API_BASE}/api/quote`);
        const data = await response.json();

        tile.innerHTML = `
            <div class="quote-content">
                <div class="quote-text">"${data.q}"</div>
                <div class="quote-author">— ${data.a}</div>
            </div>
        `;
        updateLastUpdatedTime();
    } catch (error) {
        console.error('Error loading quote:', error);
        tile.innerHTML = '<div style="color: #ef4444; text-align: center;">Failed to load quote</div>';
    }
}

// ISS functions
async function loadISS() {
    const tile = document.querySelector('#issTile .tile-content');
    tile.innerHTML = '<div class="loading">Loading...</div>';

    try {
        const response = await fetch(`${API_BASE}/api/iss`);
        const data = await response.json();

        if (data.iss_position) {
            tile.innerHTML = `
                <div class="iss-info">
                    <div style="font-size: 3rem; margin-bottom: 20px;">🛰️</div>
                    <div class="coordinates">
                        <div class="coordinate">
                            <div class="coord-label">Latitude</div>
                            <div class="coord-value">${parseFloat(data.iss_position.latitude).toFixed(2)}°</div>
                        </div>
                        <div class="coordinate">
                            <div class="coord-label">Longitude</div>
                            <div class="coord-value">${parseFloat(data.iss_position.longitude).toFixed(2)}°</div>
                        </div>
                    </div>
                    <div style="margin-top: 15px; font-size: 0.9rem; color: #666;">
                        Timestamp: ${new Date(data.timestamp * 1000).toLocaleTimeString()}
                    </div>
                </div>
            `;
        } else {
            tile.innerHTML = '<div style="color: #666; text-align: center;">ISS location unavailable</div>';
        }
        updateLastUpdatedTime();
    } catch (error) {
        console.error('Error loading ISS location:', error);
        tile.innerHTML = '<div style="color: #ef4444; text-align: center;">Failed to load ISS location</div>';
    }
}

// Cat Fact functions
async function loadCatFact() {
    const tile = document.querySelector('#catfactTile .tile-content');
    tile.innerHTML = '<div class="loading">Loading...</div>';

    try {
        const response = await fetch(`${API_BASE}/api/catfact`);
        const data = await response.json();

        tile.innerHTML = `
            <div class="catfact-content">
                <div style="font-size: 3rem; margin-bottom: 20px;">🐱</div>
                <div class="catfact-text">${data.fact}</div>
            </div>
        `;
        updateLastUpdatedTime();
    } catch (error) {
        console.error('Error loading cat fact:', error);
        tile.innerHTML = '<div style="color: #ef4444; text-align: center;">Failed to load cat fact</div>';
    }
}

// Time functions
function updateTime() {
    const now = new Date();

    const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    const dateString = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    document.getElementById('currentTime').textContent = timeString;
    document.getElementById('currentDate').textContent = dateString;
}

// Refresh all tiles
function refreshAll() {
    loadWeather();
    loadCrypto();
    loadNews();
    loadQuote();
    loadISS();
    loadCatFact();
    updateLastUpdatedTime();
}

// Initialize dashboard
function init() {
    // Load all data
    refreshAll();

    // Update time every second
    updateTime();
    setInterval(updateTime, 1000);

    // Auto-refresh data every 5 minutes
    setInterval(refreshAll, 5 * 60 * 1000);
}

// Start when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
