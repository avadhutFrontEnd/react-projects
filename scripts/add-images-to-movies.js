/**
 * Script to add image properties to movies in the database
 * Run this with Node.js: node scripts/add-images-to-movies.js
 * 
 * This script will update each movie in the database with an image property
 * if a matching image exists in public/images/movies/
 */

const axios = require('axios');

const API_URL = 'http://localhost:3900/api/movies';

// Map of movie titles to image filenames
const movieImageMap = {
  "The Avengers": "the-avenger.jpg",
  "The Hangover+": null, // No matching image
  "Wedding Crashers": null,
  "Die Hard": null,
  "Terminator": null,
  "The Notebook": null,
  "When Harry Met Sally": null,
  "Pretty Woman": null,
  "The Sixth Sense": null,
  "Gone Girl": null,
  "The Others": null,
  "Avadhut's Movie": null,
  "Last Movie 8 Chapter": null
};

async function updateMoviesWithImages() {
  try {
    console.log('Fetching movies from API...');
    const response = await axios.get(API_URL);
    const movies = response.data;

    console.log(`Found ${movies.length} movies in database\n`);

    for (const movie of movies) {
      // Check if movie already has image property
      if (movie.image) {
        console.log(`✓ "${movie.title}" already has image: ${movie.image}`);
        continue;
      }

      // Try to find matching image
      const imageFilename = movieImageMap[movie.title];
      
      if (imageFilename) {
        // Update movie with image property
        const updateData = {
          ...movie,
          image: imageFilename
        };
        delete updateData._id; // Remove _id from update body

        try {
          await axios.put(`${API_URL}/${movie._id}`, updateData);
          console.log(`✓ Updated "${movie.title}" with image: ${imageFilename}`);
        } catch (error) {
          console.error(`✗ Failed to update "${movie.title}":`, error.message);
        }
      } else {
        console.log(`- "${movie.title}" - No matching image found (will use placeholder)`);
      }
    }

    console.log('\n✅ Update complete!');
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Run the script
updateMoviesWithImages();

