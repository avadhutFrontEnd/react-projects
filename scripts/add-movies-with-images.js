/**
 * Script to add movies with matching images to the database
 * This script will:
 * 1. Register a new user (or login if exists)
 * 2. Get authentication token
 * 3. Add movies that have matching posters in public/images/movies/
 */

const axios = require('axios');

const API_URL = 'http://localhost:3900/api';
const MOVIES_ENDPOINT = `${API_URL}/movies`;
const AUTH_ENDPOINT = `${API_URL}/auth`;
const REGISTER_ENDPOINT = `${API_URL}/users`;

// Movies that have matching images in public/images/movies/
// Note: API doesn't accept 'image' property, so frontend will map by title
const moviesToAdd = [
  {
    title: "The Shawshank Redemption",
    genreId: "6777fb0eef2e9cc3d45406ec", // Thriller
    numberInStock: 10,
    dailyRentalRate: 4.5
  },
  {
    title: "The Godfather",
    genreId: "6777fb0eef2e9cc3d45406ec", // Thriller
    numberInStock: 8,
    dailyRentalRate: 4.5
  },
  {
    title: "Pulp Fiction",
    genreId: "6777fb0eef2e9cc3d45406ec", // Thriller
    numberInStock: 12,
    dailyRentalRate: 4.0
  },
  {
    title: "The Dark Knight",
    genreId: "6777fb0eef2e9cc3d45406da", // Action
    numberInStock: 15,
    dailyRentalRate: 4.5
  },
  {
    title: "Inception",
    genreId: "6777fb0eef2e9cc3d45406da", // Action
    numberInStock: 10,
    dailyRentalRate: 4.0
  },
  {
    title: "Fight Club",
    genreId: "6777fb0eef2e9cc3d45406ec", // Thriller
    numberInStock: 9,
    dailyRentalRate: 3.5
  },
  {
    title: "The Matrix",
    genreId: "6777fb0eef2e9cc3d45406da", // Action
    numberInStock: 11,
    dailyRentalRate: 4.0
  },
  {
    title: "Interstellar",
    genreId: "6777fb0eef2e9cc3d45406da", // Action
    numberInStock: 7,
    dailyRentalRate: 4.5
  },
  {
    title: "Forrest Gump",
    genreId: "6777fb0eef2e9cc3d45406e3", // Romance
    numberInStock: 13,
    dailyRentalRate: 3.5
  },
  {
    title: "Gladiator",
    genreId: "6777fb0eef2e9cc3d45406da", // Action
    numberInStock: 10,
    dailyRentalRate: 3.5
  },
  {
    title: "Goodfellas",
    genreId: "6777fb0eef2e9cc3d45406ec", // Thriller
    numberInStock: 8,
    dailyRentalRate: 4.0
  },
  {
    title: "Titanic",
    genreId: "6777fb0eef2e9cc3d45406e3", // Romance
    numberInStock: 14,
    dailyRentalRate: 3.5
  },
  {
    title: "Avatar",
    genreId: "6777fb0eef2e9cc3d45406da", // Action
    numberInStock: 16,
    dailyRentalRate: 4.0
  },
  {
    title: "The Lord of the Rings",
    genreId: "6777fb0eef2e9cc3d45406da", // Action
    numberInStock: 9,
    dailyRentalRate: 4.5
  }
];

let authToken = null;

async function registerUser() {
  try {
    console.log('Registering new user...');
    const response = await axios.post(REGISTER_ENDPOINT, {
      name: "Script User",
      email: "script@vidly.com",
      password: "script12345"
    });
    
    authToken = response.headers['x-auth-token'];
    console.log('✓ User registered successfully\n');
    return authToken;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      // User might already exist, try to login
      console.log('User might already exist, trying to login...');
      return await loginUser();
    }
    throw error;
  }
}

async function loginUser() {
  try {
    console.log('Logging in...');
    const response = await axios.post(AUTH_ENDPOINT, {
      email: "script@vidly.com",
      password: "script12345"
    });
    
    authToken = response.data; // JWT token is in response body
    console.log('✓ Logged in successfully\n');
    return authToken;
  } catch (error) {
    throw new Error(`Login failed: ${error.response?.data || error.message}`);
  }
}

async function checkMovieExists(title) {
  try {
    const response = await axios.get(MOVIES_ENDPOINT);
    const movies = response.data;
    return movies.find(m => m.title.toLowerCase() === title.toLowerCase());
  } catch (error) {
    return null;
  }
}

async function addMovie(movie, token) {
  try {
    // Check if movie already exists
    const existing = await checkMovieExists(movie.title);
    if (existing) {
      console.log(`- "${movie.title}" already exists in database`);
      return false;
    }

    const response = await axios.post(MOVIES_ENDPOINT, movie, {
      headers: {
        'x-auth-token': token
      }
    });
    
    console.log(`✓ Added "${movie.title}" (image will be mapped by frontend)`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to add "${movie.title}":`, error.response?.data || error.message);
    return false;
  }
}

async function addAllMovies() {
  try {
    // Step 1: Register or Login
    await registerUser();
    
    if (!authToken) {
      throw new Error('Failed to get authentication token');
    }

    // Step 2: Add movies
    console.log(`\nAdding ${moviesToAdd.length} movies to database...\n`);
    let added = 0;
    let skipped = 0;
    let failed = 0;

    for (const movie of moviesToAdd) {
      const result = await addMovie(movie, authToken);
      if (result === true) added++;
      else if (result === false && await checkMovieExists(movie.title)) skipped++;
      else failed++;
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\n✅ Complete!`);
    console.log(`   Added: ${added} movies`);
    console.log(`   Skipped (already exist): ${skipped} movies`);
    console.log(`   Failed: ${failed} movies`);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    process.exit(1);
  }
}

// Run the script
addAllMovies();

