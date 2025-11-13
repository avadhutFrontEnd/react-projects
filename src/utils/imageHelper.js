/**
 * Helper function to get movie image path based on title
 * Converts movie title to filename format and checks if image exists
 */

// Map of movie titles to their image filenames
// Based on actual files in public/images/movies/ and API movie titles
const movieImageMap = {
  // Movies added to database with matching images
  "the shawshank redemption": "the-shawshank-redemption.jpg",
  "shawshank redemption": "the-shawshank-redemption.jpg",
  "the godfather": "the-godfather.jpg",
  "godfather": "the-godfather.jpg",
  "pulp fiction": "pulp-fiction.jpg",
  "the dark knight": "the-dark-knight.jpg",
  "dark knight": "the-dark-knight.jpg",
  "inception": "inception.jpg",
  "fight club": "fight-club.jpg",
  "the matrix": "the-matrix.jpg",
  "matrix": "the-matrix.jpg",
  "interstellar": "interstellar.jpg",
  "forrest gump": "forrest-gump.jpg",
  "gladiator": "gladiator.jpg",
  "goodfellas": "goodfellas.jpg",
  "titanic": "titanic.jpg",
  "avatar": "avatar.jpg",
  "the lord of the rings": "lord-of-the-rings.jpg",
  "lord of the rings": "lord-of-the-rings.jpg",
  
  // Original API Movies
  "the avengers": "the-avenger.jpg",
  "avengers": "the-avenger.jpg",
  
  // Hero Movies
  "extraction": "extraction.jpg",
  "unbreakable": "unbreakable.jpg",
  "jojo rabbit": "jojo-rabbit.jpg",
  
  // Movies that will get posters downloaded (mapped by title-to-filename conversion)
  "the hangover+": "the-hangover.jpg", // + will be removed, becomes the-hangover.jpg
  "the hangover": "the-hangover.jpg",
  "hangover": "the-hangover.jpg",
  "wedding crashers": "wedding-crashers.jpg",
  "die hard": "die-hard.jpg",
  "terminator": "terminator.jpg",
  "the notebook": "the-notebook.jpg",
  "notebook": "the-notebook.jpg",
  "when harry met sally": "when-harry-met-sally.jpg",
  "pretty woman": "pretty-woman.jpg",
  "the sixth sense": "the-sixth-sense.jpg",
  "sixth sense": "the-sixth-sense.jpg",
  "gone girl": "gone-girl.jpg",
  "the others": "the-others.jpg",
  "others": "the-others.jpg",
  "avadhut's movie": "avadhuts-movie.jpg",
  "avadhuts movie": "avadhuts-movie.jpg",
  "last movie 8 chapter": "last-movie-8-chapter.jpg",
};

/**
 * Converts a movie title to a filename format
 * Example: "The Shawshank Redemption" -> "the-shawshank-redemption"
 */
function titleToFilename(title) {
  if (!title) return null;
  
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters (including +, ', etc.)
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Gets the image path for a movie
 * Priority:
 * 1. movie.image property (if exists)
 * 2. movie.imageUrl property (if exists)
 * 3. Check movieImageMap for exact title match
 * 4. Try to generate filename from title
 * 5. Return placeholder
 */
export function getMovieImage(movie) {
  if (!movie) return null;

  // Priority 1: If movie has explicit image property
  if (movie.image) {
    // If it's already a full path, return it
    if (movie.image.startsWith('http') || movie.image.startsWith('/')) {
      return movie.image;
    }
    // Otherwise, assume it's a filename in movies folder
    return `/images/movies/${movie.image}`;
  }

  // Priority 2: If movie has imageUrl property
  if (movie.imageUrl) {
    return movie.imageUrl;
  }

  // Priority 3: Check movieImageMap for exact title match
  const titleLower = movie.title?.toLowerCase().trim();
  if (titleLower && movieImageMap[titleLower]) {
    return `/images/movies/${movieImageMap[titleLower]}`;
  }

  // Priority 4: Try to generate filename from title
  const filename = titleToFilename(movie.title);
  if (filename) {
    return `/images/movies/${filename}.jpg`;
  }

  // Priority 5: Return null (will use placeholder)
  return null;
}

/**
 * Gets the hero image path
 */
export function getHeroImage(movie) {
  if (!movie) return '/images/hero/hero-featured.webp';

  // Check for explicit hero image
  if (movie.heroImage) {
    return `/images/hero/${movie.heroImage}`;
  }

  // Use movie image if available (will use the movie poster)
  const movieImage = getMovieImage(movie);
  if (movieImage && !movieImage.includes('placeholder') && !movieImage.startsWith('http')) {
    return movieImage;
  }

  // Default hero images (try different formats)
  const heroImages = [
    '/images/hero/hero-featured.webp',
    '/images/hero/hero-featured.jpg',
    '/images/hero/hero-action.jpg',
    '/images/hero/hero-drama.jpeg'
  ];
  
  // Return first available (in production, you'd check if file exists)
  return heroImages[0];
}

/**
 * Gets placeholder image URL
 */
export function getPlaceholderImage(text = 'VIDLY', width = 300, height = 400) {
  return `https://via.placeholder.com/${width}x${height}/1a1a1a/8b5cf6?text=${encodeURIComponent(text)}`;
}

