/**
 * Script to download movie posters for specific hero movies
 * Downloads posters for: Jojo Rabbit, Extraction, Unbreakable
 * 
 * Usage: node scripts/download-hero-posters.js
 * 
 * Note: You'll need a free TMDB API key from https://www.themoviedb.org/settings/api
 * Set it as environment variable: TMDB_API_KEY=your_key_here
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Try to load .env file if dotenv is installed
try {
  require('dotenv').config();
} catch (e) {
  // dotenv not installed, that's okay
}

// Configuration
const TMDB_API_KEY = process.env.TMDB_API_KEY || 'YOUR_TMDB_API_KEY_HERE';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'; // w500 = 500px width
const POSTERS_DIR = path.join(__dirname, '..', 'public', 'images', 'movies');

// Movies to download
const moviesToDownload = [
  { title: "Jojo Rabbit", year: 2019 },
  { title: "Extraction", year: 2020 },
  { title: "Unbreakable", year: 2000 }
];

/**
 * Convert movie title to filename format
 */
function titleToFilename(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Search for movie on TMDB
 */
async function searchMovieOnTMDB(title, year = null) {
  try {
    const params = {
      api_key: TMDB_API_KEY,
      query: title,
      language: 'en-US'
    };
    
    if (year) {
      params.year = year;
    }

    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, { params });

    if (response.data.results && response.data.results.length > 0) {
      // If year is provided, try to find exact match first
      if (year) {
        const exactMatch = response.data.results.find(
          movie => movie.release_date && movie.release_date.startsWith(year.toString())
        );
        if (exactMatch) return exactMatch;
      }
      // Return the first result (most popular match)
      return response.data.results[0];
    }
    return null;
  } catch (error) {
    console.error(`Error searching TMDB for "${title}":`, error.message);
    return null;
  }
}

/**
 * Download image from URL and save to file
 */
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
        fileStream.on('error', reject);
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirect
        downloadImage(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
      } else {
        reject(new Error(`Failed to download: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

/**
 * Download poster for a movie
 */
async function downloadPoster(movie) {
  const filename = `${titleToFilename(movie.title)}.jpg`;
  const filepath = path.join(POSTERS_DIR, filename);

  // Check if poster already exists
  if (fs.existsSync(filepath)) {
    console.log(`✓ "${movie.title}" - Poster already exists: ${filename}`);
    return true;
  }

  try {
    console.log(`\nSearching TMDB for "${movie.title}" (${movie.year || 'N/A'})...`);
    
    // Search for movie on TMDB
    const tmdbMovie = await searchMovieOnTMDB(movie.title, movie.year);
    
    if (!tmdbMovie) {
      console.log(`✗ "${movie.title}" - Not found on TMDB`);
      return false;
    }

    if (!tmdbMovie.poster_path) {
      console.log(`✗ "${movie.title}" - No poster available on TMDB`);
      return false;
    }

    // Construct full image URL
    const imageUrl = `${TMDB_IMAGE_BASE_URL}${tmdbMovie.poster_path}`;
    
    console.log(`  Found: "${tmdbMovie.title}" (${tmdbMovie.release_date || 'N/A'})`);
    console.log(`  Downloading poster...`);

    // Download the image
    await downloadImage(imageUrl, filepath);
    
    console.log(`✓ "${movie.title}" - Downloaded: ${filename}`);
    return true;
  } catch (error) {
    console.error(`✗ "${movie.title}" - Error: ${error.message}`);
    return false;
  }
}

/**
 * Main function
 */
async function downloadHeroPosters() {
  // Check if TMDB API key is set
  if (TMDB_API_KEY === 'YOUR_TMDB_API_KEY_HERE') {
    console.error('\n❌ Error: TMDB API key not set!');
    console.log('\nTo get a free API key:');
    console.log('1. Go to https://www.themoviedb.org/');
    console.log('2. Sign up for a free account');
    console.log('3. Go to Settings > API');
    console.log('4. Request an API key (it\'s free and instant)');
    console.log('5. Set it as environment variable:');
    console.log('   Windows (CMD): set TMDB_API_KEY=your_key_here');
    console.log('   Windows (PowerShell): $env:TMDB_API_KEY="your_key_here"');
    console.log('   Linux/Mac: export TMDB_API_KEY=your_key_here');
    console.log('\nOr create a .env file in project root with: TMDB_API_KEY=your_key_here');
    console.log('Then install dotenv: npm install dotenv');
    process.exit(1);
  }

  // Ensure posters directory exists
  if (!fs.existsSync(POSTERS_DIR)) {
    fs.mkdirSync(POSTERS_DIR, { recursive: true });
    console.log(`Created directory: ${POSTERS_DIR}`);
  }

  console.log('='.repeat(50));
  console.log('Downloading Hero Movie Posters');
  console.log('='.repeat(50));
  console.log(`\nMovies to download:`);
  moviesToDownload.forEach(m => console.log(`  - ${m.title} (${m.year})`));
  console.log('\nStarting downloads...\n');

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const movie of moviesToDownload) {
    const result = await downloadPoster(movie);
    if (result === true) downloaded++;
    else if (result === false) {
      const filename = `${titleToFilename(movie.title)}.jpg`;
      if (fs.existsSync(path.join(POSTERS_DIR, filename))) {
        skipped++;
      } else {
        failed++;
      }
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ Download Complete!');
  console.log(`   Downloaded: ${downloaded} posters`);
  console.log(`   Skipped (already exist): ${skipped} movies`);
  console.log(`   Failed/Not found: ${failed} movies`);
  console.log('='.repeat(50));
}

// Run the script
downloadHeroPosters().catch(error => {
  console.error('\n❌ Fatal error:', error.message);
  process.exit(1);
});

