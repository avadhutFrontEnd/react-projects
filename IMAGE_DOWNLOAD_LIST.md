# Image Download List for Vidly App

## 📥 Images to Download

### 🎬 Movie Posters (for Movie Cards)
**Location:** `public/images/movies/`
**Recommended Size:** 300x400px (3:4 aspect ratio) or higher resolution
**Format:** JPG or PNG

| Movie Title | Filename | Suggested Search Terms |
|------------|----------|----------------------|
| The Shawshank Redemption | `the-shawshank-redemption.jpg` | "Shawshank Redemption movie poster" |
| The Godfather | `the-godfather.jpg` | "Godfather movie poster 1972" |
| Pulp Fiction | `pulp-fiction.jpg` | "Pulp Fiction movie poster" |
| The Dark Knight | `the-dark-knight.jpg` | "Dark Knight movie poster" |
| Inception | `inception.jpg` | "Inception movie poster" |
| Fight Club | `fight-club.jpg` | "Fight Club movie poster" |
| The Matrix | `the-matrix.jpg` | "Matrix movie poster 1999" |
| Interstellar | `interstellar.jpg` | "Interstellar movie poster" |
| Goodfellas | `goodfellas.jpg` | "Goodfellas movie poster" |
| Forrest Gump | `forrest-gump.jpg` | "Forrest Gump movie poster" |
| The Lord of the Rings | `lord-of-the-rings.jpg` | "Lord of the Rings movie poster" |
| Avatar | `avatar.jpg` | "Avatar movie poster 2009" |
| Titanic | `titanic.jpg` | "Titanic movie poster" |
| Gladiator | `gladiator.jpg` | "Gladiator movie poster" |
| The Avengers | `the-avengers.jpg` | "Avengers movie poster" |

### 🎭 Hero Section Images (Featured Movies)
**Location:** `public/images/movies/` (can reuse movie posters) or `public/images/hero/`
**Recommended Size:** 1920x600px (16:5 aspect ratio) or higher
**Format:** JPG

| Description | Filename | Notes |
|------------|----------|-------|
| Featured Movie Hero | `hero-featured.jpg` | Use a high-quality movie poster or banner |
| Action Movie Hero | `hero-action.jpg` | Wide banner format |
| Drama Movie Hero | `hero-drama.jpg` | Wide banner format |

### 🎨 Logo & Branding
**Location:** `public/images/logos/` or `src/assets/images/`
**Recommended Size:** Various (see below)
**Format:** PNG (with transparency) or SVG

| Description | Filename | Size | Notes |
|------------|----------|------|-------|
| Vidly Logo | `vidly-logo.png` | 200x60px | Main logo for navbar |
| Vidly Logo (Large) | `vidly-logo-large.png` | 400x120px | For hero section or footer |
| Favicon | `favicon.ico` | 32x32px | Already exists, but can replace |
| App Icon | `app-icon.png` | 512x512px | For PWA/manifest |

### 🖼️ Placeholder Images
**Location:** `src/assets/images/`
**Format:** PNG or JPG

| Description | Filename | Size | Notes |
|------------|----------|------|-------|
| Movie Placeholder | `movie-placeholder.jpg` | 300x400px | Default when no image |
| Hero Placeholder | `hero-placeholder.jpg` | 1920x600px | Default hero image |
| No Image Icon | `no-image.png` | 200x200px | Fallback icon |

---

## 📋 Quick Download Checklist

### Priority 1: Essential Images
- [ ] **5-10 Movie Posters** - Start with popular movies
  - `the-shawshank-redemption.jpg`
  - `the-godfather.jpg`
  - `pulp-fiction.jpg`
  - `the-dark-knight.jpg`
  - `inception.jpg`

- [ ] **1 Hero Image** - For featured section
  - `hero-featured.jpg` (or reuse a movie poster)

### Priority 2: Branding
- [ ] **Vidly Logo** - If you have a custom logo
  - `vidly-logo.png`

### Priority 3: Additional Content
- [ ] **More Movie Posters** - Fill out your movie library
- [ ] **Placeholder Images** - For fallbacks

---

## 🔍 Where to Download Images

### Free Image Sources:
1. **The Movie Database (TMDB)** - https://www.themoviedb.org/
   - Best for movie posters
   - Free API available
   - High quality images

2. **IMDb** - https://www.imdb.com/
   - Movie posters available
   - Good quality

3. **Unsplash** - https://unsplash.com/
   - For hero backgrounds and placeholders
   - Free high-quality images

4. **Pexels** - https://www.pexels.com/
   - Free stock photos
   - Good for hero sections

5. **Google Images** (with usage rights filter)
   - Search: "movie poster [title]"
   - Filter: Tools → Usage Rights → Creative Commons

### Image Search Tips:
- Use specific search terms: "movie poster [title] official"
- Look for high resolution (at least 300x400px for posters)
- Check usage rights before downloading
- Prefer official movie posters from studios

---

## 📐 Image Specifications

### Movie Card Images
- **Dimensions:** 300x400px (minimum)
- **Aspect Ratio:** 3:4 (portrait)
- **File Size:** < 200KB (optimized)
- **Format:** JPG (for photos) or PNG (if transparency needed)

### Hero Section Images
- **Dimensions:** 1920x600px (minimum)
- **Aspect Ratio:** 16:5 (landscape)
- **File Size:** < 500KB (optimized)
- **Format:** JPG

### Logo Images
- **Dimensions:** 200x60px (navbar), 400x120px (large)
- **Format:** PNG (with transparency) or SVG
- **File Size:** < 50KB

---

## 🛠️ Image Optimization Tips

Before adding images to your project:

1. **Resize Images:**
   - Use online tools like: https://www.iloveimg.com/resize-image
   - Or: https://squoosh.app/ (Google's image optimizer)

2. **Compress Images:**
   - Use: https://tinypng.com/ or https://compressor.io/
   - Reduces file size without losing quality

3. **Rename Files:**
   - Use lowercase
   - Use hyphens instead of spaces
   - Example: `the-shawshank-redemption.jpg` ✅
   - Not: `The Shawshank Redemption.jpg` ❌

---

## 📝 Example Movie Data Structure

After downloading images, your movie data should look like:

```javascript
{
  _id: "1",
  title: "The Shawshank Redemption",
  image: "the-shawshank-redemption.jpg",  // ← This matches the filename
  genre: { name: "Drama" },
  numberInStock: 5,
  dailyRentalRate: 2.5,
  // ... other properties
}
```

---

## 🚀 Quick Start Guide

1. **Create folders** (already done):
   ```
   public/images/movies/
   public/images/hero/
   public/images/logos/
   src/assets/images/
   ```

2. **Download 5-10 movie posters:**
   - Search for movie posters on TMDB or Google Images
   - Save with suggested filenames
   - Place in `public/images/movies/`

3. **Download 1 hero image:**
   - Use a wide movie banner or landscape image
   - Place in `public/images/movies/` or `public/images/hero/`

4. **Update your movie data:**
   - Add `image: "filename.jpg"` property to each movie object

5. **Test:**
   - Run your app and verify images load correctly

---

## 💡 Pro Tips

1. **Consistent Naming:** Use the same naming convention for all images
2. **Optimize First:** Compress images before adding to reduce load time
3. **Test Loading:** Verify images load correctly after adding
4. **Fallback:** The code already has placeholder fallbacks, so missing images won't break the app
5. **CDN Option:** For production, consider using a CDN for faster image delivery

---

## 📦 Sample Image URLs (for testing)

If you want to test with online images first, you can use:

```javascript
// In your movie data, use imageUrl instead of image:
{
  title: "The Shawshank Redemption",
  imageUrl: "https://image.tmdb.org/t/p/w500/9cqN61eyFw3cd1e3l5f0x5jJzKt.jpg"
}
```

Then download and replace with local images later.

---

**Note:** Make sure to respect copyright and usage rights when downloading images. For commercial use, consider purchasing licenses or using royalty-free sources.

