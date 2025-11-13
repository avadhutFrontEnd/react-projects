/**
 * Script to add movies that match hero images to the database
 * Hero images: Extraction (action), Unbreakable (drama), Jojo Rabbit (featured)
 */

const axios = require('axios');

const API_URL = 'http://localhost:3900/api';
const MOVIES_ENDPOINT = `${API_URL}/movies`;
const AUTH_ENDPOINT = `${API_URL}/auth`;
const REGISTER_ENDPOINT = `${API_URL}/users`;

// Movies that match hero images
const heroMovies = [
  {
    title: "Extraction",
    genreId: "6777fb0eef2e9cc3d45406da", // Action
    numberInStock: 12,
    dailyRentalRate: 4.5,
    heroImage: "hero-action.jpg",
    description: "A hardened mercenary's mission becomes a soul-searching race to survive when he's sent into Bangladesh to rescue a drug lord's kidnapped son."
  },
  {
    title: "Unbreakable",
    genreId: "6777fb0eef2e9cc3d45406ec", // Thriller (closest to drama)
    numberInStock: 8,
    dailyRentalRate: 4.0,
    heroImage: "hero-drama.jpeg",
    description: "A suspense thriller that follows David Dunn, a man who becomes the sole survivor of a devastating train crash and discovers he may have superhuman abilities."
  },
  {
    title: "Jojo Rabbit",
    genreId: "6777fb0eef2e9cc3d45406d1", // Comedy
    numberInStock: 10,
    dailyRentalRate: 4.5,
    heroImage: "hero-featured.png",
    description: "A World War II satire that follows a lonely German boy whose world view is turned upside down when he discovers his single mother is hiding a young Jewish girl in their attic."
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
    
    authToken = response.data;
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
    const existing = await checkMovieExists(movie.title);
    if (existing) {
      console.log(`- "${movie.title}" already exists in database`);
      return false;
    }

    // Remove heroImage as API doesn't accept it
    const movieData = { ...movie };
    delete movieData.heroImage;
    delete movieData.description;

    const response = await axios.post(MOVIES_ENDPOINT, movieData, {
      headers: {
        'x-auth-token': token
      }
    });
    
    console.log(`✓ Added "${movie.title}" (hero image: ${movie.heroImage})`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to add "${movie.title}":`, error.response?.data || error.message);
    return false;
  }
}

async function addHeroMovies() {
  try {
    await registerUser();
    
    if (!authToken) {
      throw new Error('Failed to get authentication token');
    }

    console.log(`\nAdding ${heroMovies.length} hero movies to database...\n`);
    let added = 0;
    let skipped = 0;
    let failed = 0;

    for (const movie of heroMovies) {
      const result = await addMovie(movie, authToken);
      if (result === true) added++;
      else if (result === false && await checkMovieExists(movie.title)) skipped++;
      else failed++;
      
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

addHeroMovies();

