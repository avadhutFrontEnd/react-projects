# Quick Start: Download Movie Posters

## 🚀 Fast Setup (3 Steps)

### Step 1: Get TMDB API Key (Free)
1. Visit: https://www.themoviedb.org/
2. Sign up (free account)
3. Go to: **Settings > API**
4. Click: **Request an API Key**
5. Copy your API key

### Step 2: Set API Key

**Windows (CMD):**
```cmd
set TMDB_API_KEY=your_api_key_here
```

**Windows (PowerShell):**
```powershell
$env:TMDB_API_KEY="your_api_key_here"
```

**Linux/Mac:**
```bash
export TMDB_API_KEY=your_api_key_here
```

**OR create `.env` file in project root:**
```
TMDB_API_KEY=your_api_key_here
```
Then install dotenv:
```bash
npm install dotenv
```

### Step 3: Run Script
```bash
# Make sure your backend API is running on localhost:3900
node scripts/download-movie-posters.js
```

## ✅ That's it!

The script will:
- ✅ Fetch all movies from your API
- ✅ Find movies without posters
- ✅ Download posters from TMDB
- ✅ Save them to `public/images/movies/`
- ✅ Name them correctly (e.g., `the-hangover.jpg`)

## 📋 Movies That Will Get Posters

The script will download posters for:
- The Hangover+
- Wedding Crashers
- Die Hard
- Terminator
- The Notebook
- When Harry Met Sally
- Pretty Woman
- The Sixth Sense
- Gone Girl
- The Others
- Avadhut's Movie
- Last Movie 8 Chapter

(All movies that don't already have posters)

## 🎬 After Download

Refresh your React app and all movies will show their posters automatically!

