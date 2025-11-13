# How to Delete Movies from Database

## Option 1: Using Admin Account (Recommended)

### Step 1: Get your admin email and password
You need to use an account that has admin privileges in your database.

### Step 2: Set environment variables

**Windows (CMD):**
```cmd
set ADMIN_EMAIL=your_admin_email@example.com
set ADMIN_PASSWORD=your_admin_password
```

**Windows (PowerShell):**
```powershell
$env:ADMIN_EMAIL="your_admin_email@example.com"
$env:ADMIN_PASSWORD="your_admin_password"
```

**Linux/Mac:**
```bash
export ADMIN_EMAIL=your_admin_email@example.com
export ADMIN_PASSWORD=your_admin_password
```

### Step 3: Run the script
```bash
node scripts/delete-movies.js
```

---

## Option 2: Delete Through UI (Easiest)

1. **Start your React app:**
   ```bash
   npm start
   ```

2. **Login as admin** in your browser

3. **Go to Movies page** (`/movies`)

4. **Find the movies:**
   - "Last Movie 8 Chapter"
   - "Avadhut's Movie"

5. **Click the Delete button** (trash icon) on each movie card

---

## Option 3: Direct API Call (If you have admin token)

If you have an admin JWT token, you can use curl:

```bash
# Get the movie IDs first
curl http://localhost:3900/api/movies

# Then delete using the IDs (replace MOVIE_ID and YOUR_JWT_TOKEN)
curl -X DELETE http://localhost:3900/api/movies/MOVIE_ID -H "x-auth-token: YOUR_JWT_TOKEN"
```

---

## Current Movies to Delete:
1. Last Movie 8 Chapter
2. Avadhut's Movie

---

## Troubleshooting

**"Access denied" error:**
- You need admin privileges to delete movies
- Make sure you're using an admin account
- Check that the account has `isAdmin: true` in the database

**"Movie not found":**
- The movie might have already been deleted
- Check the movies list in your API

