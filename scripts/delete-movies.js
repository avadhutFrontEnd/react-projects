/**
 * Script to delete specific movies from the database
 * Usage: node scripts/delete-movies.js
 */

const axios = require('axios');

const API_URL = 'http://localhost:3900/api';
const MOVIES_ENDPOINT = `${API_URL}/movies`;
const AUTH_ENDPOINT = `${API_URL}/auth`;
const REGISTER_ENDPOINT = `${API_URL}/users`;

// Movies to delete
const moviesToDelete = [
  "Last Movie 8 Chapter",
  "Avadhut's Movie"
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

async function loginUser(email = "script@vidly.com", password = "script12345") {
  try {
    console.log(`Logging in as ${email}...`);
    const response = await axios.post(AUTH_ENDPOINT, {
      email: email,
      password: password
    });
    
    authToken = response.data; // JWT token is in response body
    console.log('✓ Logged in successfully\n');
    return authToken;
  } catch (error) {
    throw new Error(`Login failed: ${error.response?.data || error.message}`);
  }
}

// Try to login with admin credentials if provided
async function loginAsAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (adminEmail && adminPassword) {
    try {
      return await loginUser(adminEmail, adminPassword);
    } catch (error) {
      console.log('Admin login failed, trying regular user...');
    }
  }
  
  // Fallback to regular user
  return await registerUser();
}

async function findMovieByTitle(title) {
  try {
    const response = await axios.get(MOVIES_ENDPOINT);
    const movies = response.data;
    return movies.find(m => m.title === title);
  } catch (error) {
    console.error(`Error fetching movies:`, error.message);
    return null;
  }
}

async function deleteMovie(movieId, title, token) {
  try {
    await axios.delete(`${MOVIES_ENDPOINT}/${movieId}`, {
      headers: {
        'x-auth-token': token
      }
    });
    
    console.log(`✓ Deleted "${title}" (ID: ${movieId})`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to delete "${title}":`, error.response?.data || error.message);
    return false;
  }
}

async function deleteMovies() {
  try {
    // Step 1: Try to login as admin, or register/login as regular user
    console.log('Attempting to authenticate...');
    console.log('Note: Admin privileges required to delete movies.\n');
    
    // Try admin credentials from environment variables first
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (adminEmail && adminPassword) {
      console.log('Trying admin credentials...');
      try {
        authToken = await loginUser(adminEmail, adminPassword);
      } catch (error) {
        console.log('Admin login failed, trying regular user...\n');
        await registerUser();
      }
    } else {
      await registerUser();
    }
    
    if (!authToken) {
      throw new Error('Failed to get authentication token');
    }

    // Step 2: Find and delete movies
    console.log(`\nFinding and deleting ${moviesToDelete.length} movies...\n`);
    let deleted = 0;
    let notFound = 0;
    let failed = 0;

    for (const movieTitle of moviesToDelete) {
      const movie = await findMovieByTitle(movieTitle);
      
      if (!movie) {
        console.log(`- "${movieTitle}" - Not found in database`);
        notFound++;
        continue;
      }

      const result = await deleteMovie(movie._id, movieTitle, authToken);
      if (result) {
        deleted++;
      } else {
        failed++;
      }
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\n✅ Complete!`);
    console.log(`   Deleted: ${deleted} movies`);
    console.log(`   Not found: ${notFound} movies`);
    console.log(`   Failed: ${failed} movies`);
    
    if (failed > 0) {
      console.log('\n⚠️  Some deletions failed. This might be due to:');
      console.log('   1. Insufficient permissions (need admin account)');
      console.log('   2. Movies are protected or in use');
      console.log('\nTo use admin account, set environment variables:');
      console.log('   Windows: set ADMIN_EMAIL=your_admin_email');
      console.log('   Windows: set ADMIN_PASSWORD=your_admin_password');
      console.log('   Linux/Mac: export ADMIN_EMAIL=your_admin_email');
      console.log('   Linux/Mac: export ADMIN_PASSWORD=your_admin_password');
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    process.exit(1);
  }
}

// Run the script
deleteMovies();

