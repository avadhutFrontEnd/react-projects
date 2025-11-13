# Image Storage Guide for Vidly App

## 📁 Folder Structure

### Option 1: Public Folder (Recommended for Movie Images)
```
public/
  └── images/
      ├── movies/          # Movie posters/thumbnails
      │   ├── movie1.jpg
      │   ├── movie2.jpg
      │   └── ...
      ├── hero/            # Hero section images
      │   └── featured.jpg
      └── logos/            # Logos and branding
          └── vidly-logo.png
```

**How to use:**
```jsx
// In your components
<img src="/images/movies/movie1.jpg" alt="Movie Title" />

// Or in inline styles
style={{ backgroundImage: "url('/images/movies/movie1.jpg')" }}

// Or from database/API
const movieImage = `/images/movies/${movie.id}.jpg`
```

### Option 2: Src/Assets Folder (For Component Images)
```
src/
  └── assets/
      └── images/
          ├── logo.svg
          ├── placeholder.jpg
          └── icons/
```

**How to use:**
```jsx
// Import at the top of your component
import moviePlaceholder from '../assets/images/placeholder.jpg';

// Then use it
<img src={moviePlaceholder} alt="Placeholder" />
```

---

## 🎬 For Vidly App - Recommended Structure

### Movie Images (Use Public Folder)
```
public/
  └── images/
      └── movies/
          ├── 1.jpg        # Movie ID 1
          ├── 2.jpg        # Movie ID 2
          └── ...
```

**Why Public Folder?**
- ✅ Easy to reference from database (just store filename)
- ✅ Can be accessed via URL: `/images/movies/1.jpg`
- ✅ No need to import each image
- ✅ Better for dynamic content

---

## 📝 How to Update Your Code

### 1. Update Movie Cards (movies.jsx)

**Current code:**
```jsx
backgroundImage: `url(https://via.placeholder.com/300x400/1a1a1a/8b5cf6?text=${encodeURIComponent(movie.title)})`
```

**Updated code:**
```jsx
// If movie has image property
const movieImage = movie.image 
  ? `/images/movies/${movie.image}` 
  : `https://via.placeholder.com/300x400/1a1a1a/8b5cf6?text=${encodeURIComponent(movie.title)}`;

// Then use it
style={{
  backgroundImage: `url(${movieImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
}}
```

### 2. Update Hero Section (heroSection.jsx)

**Current code:**
```jsx
const backgroundImage = movie.image || "https://via.placeholder.com/1920x600/1a1a1a/8b5cf6?text=VIDLY";
```

**Updated code:**
```jsx
const backgroundImage = movie.image 
  ? `/images/movies/${movie.image}` 
  : movie.imageUrl 
  ? movie.imageUrl 
  : "https://via.placeholder.com/1920x600/1a1a1a/8b5cf6?text=VIDLY";
```

---

## 🔧 Example: Adding Movie Images

### Step 1: Add images to public folder
```
public/images/movies/
  ├── the-shawshank-redemption.jpg
  ├── the-godfather.jpg
  └── pulp-fiction.jpg
```

### Step 2: Update your movie data/API
```javascript
// In your movieService or database
{
  _id: "1",
  title: "The Shawshank Redemption",
  image: "the-shawshank-redemption.jpg",  // Just the filename
  genre: { name: "Drama" },
  // ... other properties
}
```

### Step 3: Use in components
```jsx
// The image will be accessible at: /images/movies/the-shawshank-redemption.jpg
const imageUrl = movie.image ? `/images/movies/${movie.image}` : defaultImage;
```

---

## 📋 Quick Reference

| Location | Use Case | How to Reference |
|----------|----------|------------------|
| `public/images/` | Movie posters, hero images | `/images/filename.jpg` |
| `src/assets/images/` | Logos, icons, placeholders | `import img from '../assets/images/file.jpg'` |

---

## 💡 Tips

1. **Naming Convention**: Use lowercase, hyphens, and descriptive names
   - ✅ `the-shawshank-redemption.jpg`
   - ❌ `The Shawshank Redemption.jpg`
   - ❌ `movie1.jpg`

2. **Image Formats**: 
   - Use `.jpg` for photos/posters
   - Use `.png` for logos with transparency
   - Use `.webp` for better compression (modern browsers)

3. **Image Sizes**:
   - Movie cards: 300x400px (or 3:4 aspect ratio)
   - Hero images: 1920x600px (or 16:5 aspect ratio)
   - Thumbnails: 150x200px

4. **Optimization**: Compress images before adding to reduce load time

---

## 🚀 Next Steps

1. Create the folder structure (already done)
2. Add your movie images to `public/images/movies/`
3. Update your movie data to include image filenames
4. Update components to use the image paths
5. Test that images load correctly

