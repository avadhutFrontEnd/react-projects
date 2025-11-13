# Movie Poster Download Script

## Overview
This script downloads movie posters from TMDB (The Movie Database) for movies in your database that don't have posters.

## Prerequisites

1. **Get a free TMDB API key:**
   - Go to https://www.themoviedb.org/
   - Sign up for a free account
   - Go to Settings > API
   - Request an API key (it's free and instant)

2. **Set the API key:**
   
   **Option 1: Environment Variable (Recommended)**
   ```bash
   # Windows (CMD)
   set TMDB_API_KEY=your_api_key_here
   
   # Windows (PowerShell)
   $env:TMDB_API_KEY="your_api_key_here"
   
   # Linux/Mac
   export TMDB_API_KEY=your_api_key_here
   ```

   **Option 2: Using .env file**
   ```bash
   # Install dotenv
   npm install dotenv
   
   # Create .env file in project root
   echo TMDB_API_KEY=your_api_key_here > .env
   ```
   Then modify the script to load dotenv at the top:
   ```javascript
   require('dotenv').config();
   ```

## Usage

```bash
# Make sure your backend API is running
# Then run:
node scripts/download-movie-posters.js
```

## What it does:

1. ✅ Fetches all movies from your API (`http://localhost:3900/api/movies`)
2. ✅ Checks which movies already have posters
3. ✅ Searches TMDB for each movie without a poster
4. ✅ Downloads the poster image (500px width)
5. ✅ Saves it to `public/images/movies/` with correct filename format
6. ✅ Skips movies that already have posters

## Output:

The script will:
- Show progress for each movie
- Download posters as `.jpg` files
- Name them using the format: `movie-title.jpg` (lowercase, hyphens)
- Skip movies that already have posters

## Example Output:

```
Fetching movies from API...
Found 27 movies in database

Starting poster downloads...

✓ "The Hangover+" - Downloaded: the-hangover.jpg
✓ "Wedding Crashers" - Downloaded: wedding-crashers.jpg
✗ "Die Hard" - Not found on TMDB
...
```

## Notes:

- **Rate Limiting**: Script includes 250ms delay between requests to avoid rate limiting
- **Image Size**: Downloads 500px width posters (good quality, reasonable file size)
- **File Format**: All images saved as `.jpg`
- **Naming**: Converts titles to lowercase with hyphens (e.g., "Die Hard" → "die-hard.jpg")
- **Existing Files**: Won't overwrite existing posters

## Troubleshooting:

1. **"TMDB API key not set"**
   - Make sure you've set the environment variable correctly
   - Check that the API key is valid

2. **"Not found on TMDB"**
   - Some movies might not be in TMDB database
   - Try searching manually on https://www.themoviedb.org/
   - You can manually download and add those posters

3. **"Failed to download"**
   - Check your internet connection
   - TMDB might be temporarily unavailable
   - Try again later

4. **"Error fetching movies from API"**
   - Make sure your backend API is running on `http://localhost:3900`
   - Check that the API endpoint is accessible

## After Downloading:

Once posters are downloaded, refresh your React app and the movies should automatically display their posters!

The frontend `imageHelper.js` will automatically map movie titles to the downloaded poster filenames.

