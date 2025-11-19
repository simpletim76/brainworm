# CLAUDE.md - AI Assistant Guide for BrainWorm Dashboard

This document provides comprehensive guidance for AI assistants working on the BrainWorm Dashboard codebase. It covers architecture, conventions, development workflows, and best practices.

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture & Technology Stack](#architecture--technology-stack)
- [Project Structure](#project-structure)
- [Key Files & Their Purposes](#key-files--their-purposes)
- [Code Conventions & Patterns](#code-conventions--patterns)
- [Development Workflows](#development-workflows)
- [API Integration Pattern](#api-integration-pattern)
- [Styling & Design System](#styling--design-system)
- [Deployment Options](#deployment-options)
- [Common Tasks & Modifications](#common-tasks--modifications)
- [Testing & Debugging](#testing--debugging)
- [Best Practices for AI Assistants](#best-practices-for-ai-assistants)

---

## Project Overview

**BrainWorm Dashboard** is a containerized, tile-based dashboard application optimized for iPad viewing. It displays real-time data from various free public APIs in a sci-fi themed interface.

### Purpose
- Provide an at-a-glance view of various data sources (weather, news, quotes, etc.)
- Optimized for iPad home screen web app experience
- Support both Docker containerization and native Raspberry Pi deployment

### Key Features
- 7 interactive tiles: Weather, News, Quote of the Day, ISS Location, Cat Facts, Current Time, Dashboard Info
- Auto-refresh every 5 minutes with manual refresh capability per tile
- Sci-fi themed design with cyan/green glowing effects
- Responsive layout (iPad, desktop, mobile)
- No API keys required - all public APIs

### Target Users
- iPad users wanting a custom dashboard
- Raspberry Pi enthusiasts (including Pi Zero W users)
- Self-hosters preferring containerized applications

---

## Architecture & Technology Stack

### Backend
- **Runtime**: Node.js 18 (LTS)
- **Framework**: Express.js v4.18.2
- **HTTP Client**: node-fetch v2.7.0
- **Middleware**: CORS enabled for cross-origin requests
- **Server Port**: 3000 (configurable via PORT env var)

### Frontend
- **Framework**: Vanilla JavaScript (no frameworks)
- **Styling**: Pure CSS3 with animations
- **HTML**: Semantic HTML5
- **Build Process**: None (static files served directly)

### Infrastructure
- **Container**: Docker with Node.js 18 Alpine base image
- **Orchestration**: Docker Compose
- **Deployment**: Supports both containerized and native deployments

### External APIs Used
- **Weather**: Open-Meteo (no auth required)
- **News**: RSS2JSON with BBC World News RSS feed
- **Quotes**: ZenQuotes API
- **ISS Location**: Open-Notify API
- **Cat Facts**: CatFact.ninja API

---

## Project Structure

```
brainworm/
├── public/                  # Frontend static files
│   ├── index.html          # Main HTML structure (7 tiles)
│   ├── styles.css          # Sci-fi themed CSS (~520 lines)
│   └── app.js              # Frontend JavaScript logic (~229 lines)
├── server.js               # Express backend (~89 lines)
├── package.json            # Dependencies and scripts
├── Dockerfile              # Container configuration
├── docker-compose.yml      # Docker orchestration
├── setup-pi.sh             # Raspberry Pi automated setup script
├── .dockerignore           # Docker build exclusions
├── .gitignore              # Git exclusions
├── README.md               # User-facing documentation
├── RASPBERRY_PI_SETUP.md   # Raspberry Pi specific guide
└── CLAUDE.md               # This file (AI assistant guide)
```

---

## Key Files & Their Purposes

### `server.js` (Backend)
**Purpose**: Express server providing API proxy endpoints

**Key Responsibilities**:
- Serve static files from `public/` directory
- Proxy API calls to external services (avoids CORS issues)
- Error handling for failed API requests
- CORS middleware enabled for all origins

**API Endpoints**:
- `GET /` - Serves index.html
- `GET /api/weather?lat=<lat>&lon=<lon>` - Weather data (defaults to NYC)
- `GET /api/news` - BBC World News headlines
- `GET /api/quote` - Daily inspirational quote
- `GET /api/iss` - ISS real-time position
- `GET /api/catfact` - Random cat fact

**Port Binding**: Listens on `0.0.0.0:3000` to accept connections from any interface

### `public/index.html` (Frontend Structure)
**Purpose**: Main HTML structure defining the dashboard layout

**Key Elements**:
- Responsive meta tags for iPad optimization
- Apple web app meta tags for home screen support
- 7 tile containers with unique IDs
- Manual refresh buttons per tile (except Time tile)
- Header with title and last updated timestamp

**Design Pattern**: Each tile follows this structure:
```html
<div class="tile [tile-type]-tile" id="[tileName]Tile">
    <div class="tile-header">
        <h2>[Title]</h2>
        <button class="refresh-btn" onclick="load[TileName]()">↻</button>
    </div>
    <div class="tile-content">
        <div class="loading">Loading...</div>
    </div>
</div>
```

### `public/app.js` (Frontend Logic)
**Purpose**: Client-side JavaScript handling data fetching and UI updates

**Key Functions**:
- **`loadWeather()`**: Fetches and displays weather data with emoji icons
- **`loadNews()`**: Fetches and displays top 5 news headlines
- **`loadQuote()`**: Fetches and displays daily quote
- **`loadISS()`**: Fetches and displays ISS coordinates
- **`loadCatFact()`**: Fetches and displays random cat fact
- **`updateTime()`**: Updates clock every second
- **`refreshAll()`**: Refreshes all data tiles
- **`init()`**: Initializes dashboard on page load

**Auto-refresh Pattern**: `setInterval(refreshAll, 5 * 60 * 1000)` - every 5 minutes

**Error Handling**: Try-catch blocks with fallback error messages displayed in tiles

### `public/styles.css` (Styling)
**Purpose**: Sci-fi themed CSS with cyan/green glowing effects

**Design Theme**:
- **Background**: Dark blue (#0a0e27) with animated star field effect
- **Primary Color**: Cyan (#00ffff) for text and borders
- **Secondary Color**: Green (#00ff00) for accents and status indicators
- **Typography**: Monospace fonts (Courier New, Consolas)
- **Effects**: Glows, text shadows, border animations, glassmorphism

**Key CSS Features**:
- Grid-based responsive layout
- Hover animations (transform, glow effects)
- Loading pulse animation
- Touch-optimized styles for iPad
- Custom scrollbar styling
- Keyframe animations (stars, headerGlow, timePulse, etc.)

**Responsive Breakpoints**:
- Mobile: `< 768px` - Single column
- iPad: `768px - 1024px` - 2 columns
- Desktop: `> 1024px` - 3 columns

### `Dockerfile`
**Purpose**: Container image definition using multi-stage best practices

**Base Image**: `node:18-alpine` (minimal size, security-focused)

**Build Steps**:
1. Set working directory to `/app`
2. Copy `package*.json` and install production dependencies
3. Copy application files (`server.js` and `public/`)
4. Expose port 3000
5. Configure health check (HTTP GET to localhost:3000)
6. Set CMD to `node server.js`

**Environment Variables**:
- `NODE_ENV=production`
- `PORT=3000`

**Health Check**: Runs every 30s to ensure server responsiveness

### `docker-compose.yml`
**Purpose**: Orchestration configuration for easy deployment

**Service Definition**:
- Service name: `brainworm-dashboard`
- Port mapping: `3000:3000`
- Restart policy: `unless-stopped`
- Custom bridge network: `brainworm-network`
- Health check configured

### `setup-pi.sh`
**Purpose**: Automated Raspberry Pi setup script

**Actions**:
1. Checks for Node.js installation
2. Installs Node.js 18 from NodeSource if missing
3. Verifies npm availability
4. Runs `npm install`
5. Displays startup instructions and IP address

**Usage**: `chmod +x setup-pi.sh && ./setup-pi.sh`

---

## Code Conventions & Patterns

### JavaScript Conventions

#### Async/Await Pattern
All API calls use async/await for clean asynchronous code:
```javascript
async function loadWeather() {
    try {
        const response = await fetch(`${API_BASE}/api/weather`);
        const data = await response.json();
        // Process data
    } catch (error) {
        console.error('Error loading weather:', error);
        // Display error in UI
    }
}
```

#### Error Handling
- Always wrap API calls in try-catch blocks
- Log errors to console for debugging
- Display user-friendly error messages in tiles
- Use red color (#ef4444) for error states

#### Tile Update Pattern
Standard pattern for updating tile content:
1. Set loading state: `tile.innerHTML = '<div class="loading">Loading...</div>'`
2. Fetch data from backend API
3. Build HTML string with data
4. Update tile: `tile.innerHTML = html`
5. Call `updateLastUpdatedTime()`

#### Function Naming
- **Load functions**: `load[TileName]()` - e.g., `loadWeather()`, `loadISS()`
- **Update functions**: `update[Something]()` - e.g., `updateTime()`, `updateLastUpdatedTime()`
- **Utility functions**: Descriptive camelCase - e.g., `refreshAll()`, `init()`

### CSS Conventions

#### Class Naming
- **Tiles**: `.tile` (base), `.[type]-tile` (specific) - e.g., `.weather-tile`, `.news-tile`
- **Content**: `.[type]-content` - e.g., `.weather-info`, `.quote-content`
- **Components**: `.[element]-[descriptor]` - e.g., `.weather-detail`, `.news-item`

#### Color Variables (Implicit - Consider Extracting)
While not using CSS variables currently, these colors are consistently used:
- Primary: `#00ffff` (cyan)
- Secondary: `#00ff00` (green)
- Background: `#0a0e27` (dark blue)
- Text: `#a0e0ff` (light cyan)
- Error: `#ef4444` (red)

#### Animation Pattern
- Use `@keyframes` for reusable animations
- Apply `animation` property with duration and easing
- Common pattern: `animation: [name] [duration] [easing] infinite`

### Backend Conventions

#### Route Pattern
Each API route follows this structure:
```javascript
app.get('/api/[endpoint]', async (req, res) => {
  try {
    const { param = 'default' } = req.query;
    const response = await fetch('[EXTERNAL_API_URL]');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('[Context] error:', error);
    res.status(500).json({ error: 'Failed to fetch [resource]' });
  }
});
```

#### Error Responses
- Always return status 500 for server errors
- Include descriptive error message in JSON
- Log error details to console for debugging

---

## Development Workflows

### Local Development Setup

1. **Clone Repository**:
   ```bash
   git clone <repository-url>
   cd brainworm
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev  # Uses nodemon for auto-restart
   # OR
   npm start    # Standard Node.js execution
   ```

4. **Access Dashboard**:
   - Open browser to `http://localhost:3000`

### Docker Development Workflow

1. **Build Image**:
   ```bash
   docker-compose build
   ```

2. **Start Container**:
   ```bash
   docker-compose up -d
   ```

3. **View Logs**:
   ```bash
   docker-compose logs -f
   ```

4. **Rebuild After Changes**:
   ```bash
   docker-compose up -d --build
   ```

5. **Stop Container**:
   ```bash
   docker-compose down
   ```

### Git Workflow

**Branch**: `claude/claude-md-mi6cnwvk6a042cwh-01RQZYgqa4ZfXF5yDdh3BtLT`

**Standard Workflow**:
1. Make changes to files
2. Test locally
3. Stage changes: `git add [files]`
4. Commit with descriptive message
5. Push to branch: `git push -u origin [branch-name]`

**Commit Message Conventions**:
- Use imperative mood ("Add feature" not "Added feature")
- Be descriptive but concise
- Reference issue/PR numbers if applicable
- Examples:
  - "Add weather tile with temperature display"
  - "Fix ISS coordinate formatting issue"
  - "Update README with Raspberry Pi instructions"

---

## API Integration Pattern

### Adding a New API Integration

To add a new tile with external API integration:

#### 1. Backend (server.js)
Add a new route:
```javascript
app.get('/api/newtile', async (req, res) => {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('New tile API error:', error);
    res.status(500).json({ error: 'Failed to fetch new tile data' });
  }
});
```

#### 2. Frontend HTML (public/index.html)
Add tile structure:
```html
<div class="tile newtile-tile" id="newtileTile">
    <div class="tile-header">
        <h2>New Tile</h2>
        <button class="refresh-btn" onclick="loadNewTile()">↻</button>
    </div>
    <div class="tile-content">
        <div class="loading">Loading...</div>
    </div>
</div>
```

#### 3. Frontend JavaScript (public/app.js)
Add load function:
```javascript
async function loadNewTile() {
    const tile = document.querySelector('#newtileTile .tile-content');
    tile.innerHTML = '<div class="loading">Loading...</div>';

    try {
        const response = await fetch(`${API_BASE}/api/newtile`);
        const data = await response.json();

        tile.innerHTML = `
            <div class="newtile-content">
                <div>${data.someField}</div>
            </div>
        `;
        updateLastUpdatedTime();
    } catch (error) {
        console.error('Error loading new tile:', error);
        tile.innerHTML = '<div style="color: #ef4444; text-align: center;">Failed to load data</div>';
    }
}
```

#### 4. Update refreshAll()
Add to the `refreshAll()` function:
```javascript
function refreshAll() {
    loadWeather();
    loadNews();
    loadQuote();
    loadISS();
    loadCatFact();
    loadNewTile(); // Add this line
    updateLastUpdatedTime();
}
```

#### 5. Styling (public/styles.css)
Add tile-specific styles:
```css
.newtile-tile .newtile-content {
    text-align: center;
    padding: 20px;
}
```

#### 6. Update Dashboard Info
Modify `public/index.html` line 93 to increment tile count:
```html
<p><strong>Tiles Active:</strong> 8</p>
```

---

## Styling & Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Cyan | `#00ffff` | Primary text, borders, glows |
| Green | `#00ff00` | Secondary accents, status indicators |
| Dark Blue | `#0a0e27` | Background base |
| Light Cyan | `#a0e0ff` | Body text |
| Red | `#ef4444` | Error states |
| Gray | `#666` | Muted text |

### Typography

- **Primary Font**: `'Courier New', 'Consolas', monospace`
- **Header Size**: `2.8rem` (h1), `1.4rem` (h2)
- **Body Text**: `1rem` base
- **Small Text**: `0.9rem` - `0.75rem`

### Spacing

- **Tile Padding**: `25px`
- **Grid Gap**: `20px`
- **Element Margins**: `10px`, `15px`, `20px` (consistent increments)

### Effects

#### Glow Effect Pattern
```css
box-shadow: 0 0 [spread]px rgba(0, 255, 255, [opacity]);
text-shadow: 0 0 [spread]px rgba(0, 255, 255, [opacity]);
```

#### Hover Transition Pattern
```css
transition: all 0.3s ease;

.element:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 25px rgba(0, 255, 255, 0.5);
}
```

### Responsive Design

- Use `grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))` for automatic responsiveness
- Override with media queries for specific devices
- Touch optimization: Disable hover effects on touch devices using `@media (hover: none)`

---

## Deployment Options

### Option 1: Docker (Recommended for Desktop/Server)

**Pros**: Isolated environment, easy to manage, consistent across platforms
**Cons**: Overhead on low-resource devices

```bash
docker-compose up -d
```

Access at: `http://localhost:3000`

### Option 2: Native Node.js (Recommended for Raspberry Pi)

**Pros**: Better performance on limited hardware, lower memory usage
**Cons**: Requires Node.js installation

```bash
npm install
npm start
```

### Option 3: PM2 Process Manager (Production)

**Pros**: Auto-restart, process monitoring, log management, startup on boot
**Cons**: Additional dependency

```bash
sudo npm install -g pm2
pm2 start server.js --name brainworm
pm2 startup systemd
pm2 save
```

**Useful PM2 Commands**:
- `pm2 status` - Check status
- `pm2 logs brainworm` - View logs
- `pm2 restart brainworm` - Restart
- `pm2 stop brainworm` - Stop

### Option 4: systemd Service (Linux Production)

**Pros**: Native Linux service management, boot integration
**Cons**: Linux-specific, requires root privileges

See `RASPBERRY_PI_SETUP.md` for full systemd setup instructions.

### Deployment Considerations

- **Port Configuration**: Default is 3000, can be changed via `PORT` environment variable
- **Network**: Server binds to `0.0.0.0` to accept connections from any interface
- **Health Checks**: Docker includes health check endpoint (GET /)
- **Logs**: Check logs for API failures or performance issues
- **Firewall**: Ensure port 3000 is open if accessing from other devices

---

## Common Tasks & Modifications

### Change Weather Location

**Default**: New York City (40.7128, -74.0060)

**Method 1: Modify Default in Backend**
Edit `server.js` line 19:
```javascript
const { lat = '51.5074', lon = '-0.1278' } = req.query; // London
```

**Method 2: Query Parameters**
No code change needed, call API with parameters:
```
http://localhost:3000/api/weather?lat=51.5074&lon=-0.1278
```

### Change Auto-Refresh Interval

**Default**: 5 minutes

Edit `public/app.js` line 220:
```javascript
setInterval(refreshAll, 10 * 60 * 1000); // Change to 10 minutes
```

### Add New Tile

Follow the [API Integration Pattern](#api-integration-pattern) section above.

### Modify Tile Appearance

Edit tile-specific CSS in `public/styles.css`:
- Weather: `.weather-tile` (line 240+)
- News: `.news-tile` (line 285+)
- Quote: `.quote-tile` (line 323+)
- ISS: `.iss-tile` (line 345+)
- Cat Fact: `.catfact-tile` (line 380+)
- Time: `.time-tile` (line 392+)
- Info: `.info-tile` (line 429+)

### Change Color Theme

Replace color values throughout `public/styles.css`:
- Find: `#00ffff` (cyan) → Replace with new primary color
- Find: `#00ff00` (green) → Replace with new secondary color
- Find: `#0a0e27` (dark blue) → Replace with new background color

**Tip**: Consider extracting to CSS custom properties for easier theme management.

### Remove a Tile

1. Remove tile HTML from `public/index.html`
2. Remove load function from `public/app.js`
3. Remove from `refreshAll()` function
4. Remove tile-specific CSS from `public/styles.css`
5. Update tile count in Dashboard Info tile

### Change Port

**Method 1: Environment Variable**
```bash
PORT=8080 npm start
```

**Method 2: Docker Compose**
Edit `docker-compose.yml`:
```yaml
ports:
  - "8080:3000"  # External:Internal
```

---

## Testing & Debugging

### Manual Testing Checklist

- [ ] All 7 tiles load without errors
- [ ] Weather displays temperature, humidity, wind speed
- [ ] News shows 5 recent headlines
- [ ] Quote displays text and author
- [ ] ISS shows latitude and longitude
- [ ] Cat fact displays random fact
- [ ] Time updates every second
- [ ] Dashboard info shows correct status
- [ ] Manual refresh buttons work for each tile
- [ ] "Refresh All" button works
- [ ] Auto-refresh works after 5 minutes
- [ ] Last updated timestamp updates correctly
- [ ] Responsive layout works on different screen sizes
- [ ] Hover effects work (desktop)
- [ ] Touch interactions work (iPad/mobile)

### Browser Console Debugging

Open browser DevTools (F12) and check:
- **Console Tab**: Look for JavaScript errors or API failures
- **Network Tab**: Verify API calls return 200 status codes
- **Elements Tab**: Inspect HTML structure and CSS styles

### Common Issues & Solutions

#### Tile Shows "Failed to load" Error

**Cause**: API endpoint is down or network issue

**Debug**:
1. Check browser console for specific error
2. Test API endpoint directly: `curl http://localhost:3000/api/weather`
3. Verify external API is accessible: `curl https://api.open-meteo.com/...`

**Solution**:
- Wait for API to recover
- Check internet connection
- Verify API URL is correct in `server.js`

#### Time Not Updating

**Cause**: JavaScript error preventing interval execution

**Debug**:
1. Check browser console for errors
2. Verify `setInterval(updateTime, 1000)` is called in `init()`

**Solution**: Fix any JavaScript syntax errors

#### Auto-Refresh Not Working

**Cause**: `setInterval(refreshAll, 5 * 60 * 1000)` not executing

**Debug**:
1. Check if `init()` function completed successfully
2. Look for JavaScript errors in console

**Solution**: Ensure no errors prevent interval setup

#### Styles Not Loading

**Cause**: CSS file not found or syntax error

**Debug**:
1. Check Network tab for 404 on `styles.css`
2. Verify `public/` directory structure
3. Check CSS syntax for errors

**Solution**: Ensure file path is correct and CSS is valid

#### Docker Container Won't Start

**Debug**:
```bash
docker-compose logs
```

**Common Causes**:
- Port 3000 already in use: `lsof -i :3000`
- Build failure: Check Dockerfile syntax
- Missing dependencies: Verify package.json

#### Raspberry Pi Performance Issues

**Causes**: Limited RAM, CPU constraints

**Solutions**:
- Use native deployment (not Docker)
- Increase swap size (see RASPBERRY_PI_SETUP.md)
- Increase auto-refresh interval to reduce CPU usage
- Close unnecessary services

---

## Best Practices for AI Assistants

### When Making Changes

1. **Read Before Writing**: Always read the file you're modifying first
2. **Preserve Styling**: Maintain consistent indentation and formatting
3. **Test Mentally**: Think through the impact of changes
4. **Check Dependencies**: Ensure changes don't break related functionality
5. **Update Documentation**: If adding major features, update README.md

### Code Modification Guidelines

#### DO:
- Maintain existing code style and conventions
- Add proper error handling for new API integrations
- Update tile count in Dashboard Info when adding/removing tiles
- Test changes locally before committing
- Use descriptive variable and function names
- Follow existing naming patterns (e.g., `load[TileName]()`)
- Keep CSS class naming consistent
- Add comments for complex logic

#### DON'T:
- Change the overall architecture without discussion
- Remove error handling or try-catch blocks
- Introduce external dependencies without good reason
- Break existing tile functionality
- Ignore responsive design considerations
- Hardcode values that should be configurable
- Remove health checks or monitoring features

### Security Considerations

#### API Proxy Pattern
The backend acts as a proxy to external APIs. This:
- Prevents CORS issues
- Hides API implementation details from client
- Allows for request/response transformation
- Enables caching (not implemented but possible)

**Important**: Never expose API keys in frontend code. If an API requires authentication, handle it in `server.js`.

#### Input Validation
Currently minimal since APIs are public and read-only. If adding user input:
- Validate and sanitize all inputs
- Use parameterized queries for any database operations
- Escape HTML to prevent XSS
- Validate query parameters in backend routes

### Performance Considerations

#### Frontend:
- Avoid unnecessary re-renders
- Use `innerHTML` updates for tile content (current pattern)
- Consider debouncing rapid refresh actions
- Minimize DOM queries (cache selectors if reused)

#### Backend:
- Current design has no caching (stateless)
- Consider adding response caching for slow APIs
- Set reasonable timeouts for external API calls
- Use connection pooling if adding database

#### Network:
- 5-minute auto-refresh is reasonable for current APIs
- Consider increasing interval if APIs have rate limits
- Backend proxying avoids CORS preflight requests

### Accessibility Improvements

Current state: Basic HTML semantics, could be improved

**Potential Enhancements**:
- Add ARIA labels to interactive elements
- Ensure keyboard navigation works for all buttons
- Add skip links for screen readers
- Ensure color contrast meets WCAG guidelines
- Add alt text to emoji icons or use proper icon system

### Future Enhancement Ideas

Based on current architecture, good additions would be:

1. **API Response Caching**: Reduce external API calls
2. **User Configuration**: Allow users to customize tiles, location, intervals
3. **Additional Tiles**: GitHub activity, calendar events, stock prices
4. **Dark/Light Mode Toggle**: Already dark, could add light theme
5. **Tile Rearrangement**: Drag-and-drop tile ordering
6. **Error Recovery**: Retry failed API calls automatically
7. **Offline Mode**: Show last successful data when offline
8. **Mobile App**: React Native or PWA version
9. **Backend Caching**: Redis for API response caching
10. **User Authentication**: Multi-user support with saved preferences

### Working with This Codebase

#### Quick Reference Locations

- Add new API route: `server.js` (around line 80)
- Add new tile HTML: `public/index.html` (around line 99)
- Add new load function: `public/app.js` (around line 210)
- Add new tile styles: `public/styles.css` (around line 500)
- Modify auto-refresh: `public/app.js` line 220
- Change weather location: `server.js` line 19
- Update tile count: `public/index.html` line 93

#### Common File Modification Scenarios

| Task | Files to Modify |
|------|----------------|
| Add new tile | `index.html`, `app.js`, `styles.css`, `server.js` |
| Change colors | `styles.css` (global find/replace) |
| Modify API endpoint | `server.js` |
| Change refresh rate | `app.js` line 220 |
| Update weather location | `server.js` line 19 |
| Add new dependency | `package.json`, then run `npm install` |
| Modify Docker config | `Dockerfile` or `docker-compose.yml` |
| Update documentation | `README.md` or `RASPBERRY_PI_SETUP.md` |

### Git Commit Guidelines

When committing changes:

1. **Stage Selectively**: Only stage related changes
2. **Write Clear Messages**: Describe what and why
3. **Keep Commits Atomic**: One logical change per commit
4. **Test Before Committing**: Ensure code works
5. **Push to Correct Branch**: Always push to the designated Claude branch

**Example Good Commits**:
```
Add cryptocurrency price tile with real-time updates
Fix weather API error handling for network timeouts
Update README with new tile documentation
Refactor CSS to use custom properties for theme colors
```

**Example Bad Commits**:
```
Fixed stuff
Updates
WIP
asdf
Changed things
```

### Questions to Ask Before Making Changes

1. Does this change align with the project's goals?
2. Will this break existing functionality?
3. Is this the right place for this code?
4. Are there existing patterns I should follow?
5. Do I need to update documentation?
6. Should I add error handling?
7. Is this responsive/accessible?
8. Will this work on Raspberry Pi (performance)?
9. Do I need to update the Docker configuration?
10. Should I add this to the README?

---

## Conclusion

This document should serve as your primary reference when working on the BrainWorm Dashboard. The codebase is intentionally simple and well-structured, making it easy to understand and modify.

**Key Takeaways**:
- Simple Node.js + Express + Vanilla JS architecture
- Proxy pattern for API integration
- Sci-fi themed CSS with consistent patterns
- Multiple deployment options (Docker, native, PM2, systemd)
- Optimized for iPad but works everywhere
- No build process - static files served directly

When in doubt, follow existing patterns and conventions. The code is self-documenting through clear naming and structure.

**Happy coding! 🚀**

---

*Last Updated: 2025-11-19*
*Repository: brainworm*
*Branch: claude/claude-md-mi6cnwvk6a042cwh-01RQZYgqa4ZfXF5yDdh3BtLT*
