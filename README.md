# BrainWorm Dashboard

A beautiful, containerized tile-based dashboard optimized for iPad viewing. Displays real-time data from various public APIs in an elegant, responsive interface.

## Features

- **Weather Tile**: Current weather conditions, temperature, humidity, and wind speed
- **Cryptocurrency Prices**: Real-time prices for Bitcoin, Ethereum, and Cardano with 24h change
- **News Feed**: Latest world news headlines from BBC
- **Quote of the Day**: Daily inspirational quotes
- **ISS Location**: Real-time position of the International Space Station
- **Cat Facts**: Random cat facts for entertainment
- **Current Time**: Live clock and date display
- **Dashboard Info**: System status and quick refresh button

## Technologies Used

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Node.js, Express
- **APIs**: Open-Meteo (weather), CoinGecko (crypto), RSS2JSON (news), ZenQuotes, CatFact.ninja, Open-Notify (ISS)
- **Containerization**: Docker & Docker Compose

## Prerequisites

- Docker
- Docker Compose

## Quick Start

### Using Docker Compose (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd brainworm
```

2. Build and start the container:
```bash
docker-compose up -d
```

3. Access the dashboard:
```
http://localhost:3000
```

### Using Docker

1. Build the image:
```bash
docker build -t brainworm-dashboard .
```

2. Run the container:
```bash
docker run -d -p 3000:3000 --name brainworm brainworm-dashboard
```

3. Access the dashboard:
```
http://localhost:3000
```

## Development Mode

If you want to run the application without Docker:

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Access the dashboard:
```
http://localhost:3000
```

## iPad Setup

For the best iPad experience:

1. Open Safari on your iPad
2. Navigate to `http://<your-server-ip>:3000`
3. Tap the Share button
4. Select "Add to Home Screen"
5. Name it "BrainWorm Dashboard"
6. Open the app from your home screen

The dashboard will run in full-screen mode with an app-like experience.

## API Endpoints

The backend provides the following API endpoints:

- `GET /api/weather` - Current weather data
- `GET /api/crypto` - Cryptocurrency prices
- `GET /api/news` - Latest news headlines
- `GET /api/quote` - Quote of the day
- `GET /api/iss` - ISS location
- `GET /api/catfact` - Random cat fact

## Configuration

### Weather Location

By default, the weather shows data for New York City (40.7128, -74.0060). To change the location, modify the default coordinates in `server.js`:

```javascript
const { lat = 'YOUR_LATITUDE', lon = 'YOUR_LONGITUDE' } = req.query;
```

Or pass coordinates as query parameters:
```
http://localhost:3000/api/weather?lat=51.5074&lon=-0.1278
```

### Auto-Refresh Interval

The dashboard auto-refreshes every 5 minutes. To change this, modify the interval in `public/app.js`:

```javascript
setInterval(refreshAll, 5 * 60 * 1000); // Change 5 to desired minutes
```

## Docker Commands

### Stop the container:
```bash
docker-compose down
```

### View logs:
```bash
docker-compose logs -f
```

### Rebuild after changes:
```bash
docker-compose up -d --build
```

### Remove container and image:
```bash
docker-compose down
docker rmi brainworm-dashboard
```

## Project Structure

```
brainworm/
├── public/
│   ├── index.html      # Main HTML file
│   ├── styles.css      # Styling and responsive design
│   └── app.js          # Frontend JavaScript logic
├── server.js           # Express backend server
├── package.json        # Node.js dependencies
├── Dockerfile          # Docker configuration
├── docker-compose.yml  # Docker Compose configuration
├── .dockerignore       # Docker ignore rules
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## Features in Detail

### Responsive Design
- Optimized for iPad (landscape and portrait)
- Works on desktop browsers
- Mobile-friendly layout
- Touch-optimized interactions

### Real-time Updates
- Live clock updates every second
- All data tiles refresh every 5 minutes
- Manual refresh option available for each tile
- "Refresh All" button for immediate updates

### Visual Design
- Modern gradient background
- Glassmorphism effects
- Smooth animations and transitions
- Color-coded data (positive/negative changes, etc.)
- Emoji icons for visual appeal

## Browser Support

- Safari (iOS/iPadOS) - Recommended for iPad
- Chrome
- Firefox
- Edge

## API Rate Limits

All APIs used are free and public. Be mindful of rate limits:

- Open-Meteo: No strict limits
- CoinGecko: 10-50 calls/minute (free tier)
- RSS2JSON: 10,000 calls/day (free tier)
- ZenQuotes: No strict limits
- CatFact.ninja: No strict limits
- Open-Notify: No strict limits

## Troubleshooting

### Container won't start
- Check if port 3000 is already in use: `lsof -i :3000`
- Check Docker logs: `docker-compose logs`

### API data not loading
- Check your internet connection
- Some APIs may have temporary outages
- Check browser console for errors

### Dashboard not responsive on iPad
- Clear Safari cache
- Make sure you're using the latest iOS version
- Try adding to home screen for best experience

## License

MIT

## Contributing

Feel free to open issues or submit pull requests for improvements!

## Acknowledgments

- Weather data from [Open-Meteo](https://open-meteo.com/)
- Cryptocurrency data from [CoinGecko](https://www.coingecko.com/)
- News from BBC via [RSS2JSON](https://rss2json.com/)
- Quotes from [ZenQuotes](https://zenquotes.io/)
- Cat facts from [CatFact.ninja](https://catfact.ninja/)
- ISS location from [Open-Notify](http://open-notify.org/)
