# Scripts Directory

This directory contains utility scripts for managing the Vidly application.

## Available Scripts

### 1. `add-movies-with-images.js`
Adds movies to the database that have matching posters in `public/images/movies/`.

**Usage:**
```bash
node scripts/add-movies-with-images.js
```

**What it does:**
- Registers/logs in to get authentication
- Adds 14 movies with matching posters to the database
- Movies include: The Shawshank Redemption, The Godfather, Pulp Fiction, etc.

---

### 2. `download-movie-posters.js` ⭐ NEW
Downloads movie posters from TMDB (The Movie Database) for movies that don't have posters.

**Prerequisites:**
- Get a free TMDB API key from https://www.themoviedb.org/settings/api
- Set environment variable: `TMDB_API_KEY=your_key_here`

**Usage:**
```bash
# Set API key first
set TMDB_API_KEY=your_key_here  # Windows CMD
# or
$env:TMDB_API_KEY="your_key_here"  # Windows PowerShell
# or
export TMDB_API_KEY=your_key_here  # Linux/Mac

# Then run
node scripts/download-movie-posters.js
```

**What it does:**
- Fetches all movies from your API
- Finds movies without posters
- Searches TMDB for each movie
- Downloads poster images (500px width)
- Saves them to `public/images/movies/` with correct filenames
- Skips movies that already have posters

**See:** `README_POSTER_DOWNLOAD.md` for detailed instructions

---

### 3. `add-images-to-movies.js`
Adds `image` properties to existing movies in the database (requires authentication).

**Note:** This script may not work if the API doesn't accept `image` property. The frontend handles image mapping automatically.

---

## Quick Start

### To add movies with existing posters:
```bash
node scripts/add-movies-with-images.js
```

### To download missing posters:
1. Get TMDB API key (free): https://www.themoviedb.org/settings/api
2. Set it: `set TMDB_API_KEY=your_key_here`
3. Run: `node scripts/download-movie-posters.js`

---

## Notes

- All scripts require your backend API to be running on `http://localhost:3900`
- The frontend automatically maps movie titles to image filenames
- Posters are saved to `public/images/movies/`
- Image filenames are automatically generated from movie titles (lowercase, hyphens)
