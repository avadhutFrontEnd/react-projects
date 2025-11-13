# Vidly - Movie Rental Management System

A full-featured movie rental management application built with React using class components. This project demonstrates modern React patterns including authentication, routing, form validation, and API integration.

## 📋 Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Application Routes](#application-routes)
- [Component Architecture](#component-architecture)
- [Styling](#styling)
- [Backend Integration](#backend-integration)
- [Development Notes](#development-notes)

## 🎬 Overview

**Vidly** is a movie rental management system that allows users to browse, search, and manage movies. The application includes user authentication, role-based access control, and a comprehensive movie management interface.

## 🛠 Technology Stack

- **React** 18.3.1 (Class Components)
- **React Router DOM** 4.3.1 (Routing)
- **Bootstrap** 4.1.1 (UI Framework)
- **Font Awesome** 4.7.0 (Icons)
- **Axios** 1.7.9 (HTTP Client)
- **Joi-browser** 13.4 (Form Validation)
- **React Toastify** 11.0.2 (Notifications)
- **JWT Decode** 4.0.0 (Authentication)
- **Lodash** 4.17.10 (Utility Functions)

## ✨ Features

### Authentication System
- User registration and login
- JWT-based authentication
- Protected routes for authenticated users
- Role-based access control (Admin features)
- Secure logout functionality

### Movies Management
- **Movies Listing** (`/movies`)
  - Paginated movie display (4 movies per page)
  - Real-time search by movie title
  - Genre-based filtering
  - Sortable columns (Title, Genre, Stock, Rate)
  - Like/Unlike functionality
  - Delete movies (Admin only)
  
- **Movie Form** (`/movies/:id` or `/movies/new`)
  - Create new movies
  - Edit existing movies
  - Form validation with Joi
  - Genre selection dropdown

### Additional Pages
- Customers page (placeholder)
- Rentals page (placeholder)
- 404 Not Found page

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components
│   │   ├── form.jsx
│   │   ├── input.jsx
│   │   ├── select.jsx
│   │   ├── listGroup.jsx
│   │   ├── pagination.jsx
│   │   ├── searchBox.jsx
│   │   ├── table.jsx
│   │   ├── tableHeader.jsx
│   │   ├── tableBody.jsx
│   │   ├── like.jsx
│   │   └── protectedRoute.jsx
│   ├── movies.jsx
│   ├── moviesTable.jsx
│   ├── movieForm.jsx
│   ├── navBar.jsx
│   ├── loginForm.jsx
│   ├── registerForm.jsx
│   ├── customers.jsx
│   ├── rentals.jsx
│   ├── notFound.jsx
│   └── logout.jsx
├── services/            # API services
│   ├── authService.js
│   ├── movieService.js
│   ├── genreService.js
│   ├── userService.js
│   ├── httpService.js
│   └── logService.js
├── utils/               # Utility functions
│   └── paginate.js
├── App.js
├── App.css
├── index.js
├── index.css
└── config.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API server running on `http://localhost:3900`

### Installation

1. Clone the repository:
```bash
git clone https://github.com/avadhutFrontEnd/react-projects.git
cd react-projects
git checkout vidly
```

2. Install dependencies:
```bash
npm install
```

3. Configure the API endpoint in `src/config.json`:
```json
{
  "apiUrl": "http://localhost:3900/api"
}
```

4. Start the development server:
```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## 🗺 Application Routes

| Route | Component | Access |
|-------|-----------|--------|
| `/` | Redirects to `/movies` | Public |
| `/movies` | Movies listing | Public |
| `/movies/new` | Create movie form | Protected (Authenticated) |
| `/movies/:id` | Edit movie form | Protected (Authenticated) |
| `/login` | Login form | Public |
| `/register` | Registration form | Public |
| `/logout` | Logout handler | Authenticated |
| `/customers` | Customers page | Public |
| `/rentals` | Rentals page | Public |
| `/not-found` | 404 page | Public |

## 🏗 Component Architecture

### Main Components

- **App.js** - Main application component with routing configuration
- **navBar.jsx** - Navigation bar with conditional authentication links
- **movies.jsx** - Movies listing page with filtering, search, and pagination
- **movieForm.jsx** - Form for creating and editing movies
- **loginForm.jsx** - User login form
- **registerForm.jsx** - User registration form

### Reusable Components (common/)

- **form.jsx** - Base form component with validation logic
- **input.jsx** - Reusable input field with error display
- **select.jsx** - Dropdown select component
- **listGroup.jsx** - List group for genre filtering
- **pagination.jsx** - Pagination controls
- **searchBox.jsx** - Search input component
- **table.jsx** - Reusable table component
- **tableHeader.jsx** - Sortable table header
- **tableBody.jsx** - Table body renderer
- **like.jsx** - Like button with heart icon
- **moviesTable.jsx** - Movies-specific table configuration
- **protectedRoute.jsx** - Route protection wrapper

## 🎨 Styling

### Current Styling Approach

1. **Bootstrap 4.1.1** - Primary UI framework
   - Grid system for layout
   - Form components
   - Navigation components
   - Table styling
   - Button styles

2. **Font Awesome 4.7.0** - Icon library
   - Heart icons for likes
   - Sort icons for table headers

3. **Custom CSS**
   - `src/index.css` - Global styles and utilities
   - `src/App.css` - Application-level styles

### UI Characteristics

- Bootstrap 4 default theme
- Light navigation bar
- Standard Bootstrap form styling
- Responsive table layouts
- Minimal custom styling

## 🔌 Backend Integration

### API Configuration

The application connects to a backend API configured in `src/config.json`:
- Default endpoint: `http://localhost:3900/api`

### Services

- **authService.js** - Authentication and JWT management
- **movieService.js** - Movie CRUD operations
- **genreService.js** - Genre data fetching
- **userService.js** - User registration
- **httpService.js** - Axios wrapper with interceptors

### Error Handling

- HTTP interceptors for global error handling
- Toast notifications for user feedback
- Automatic error logging

## 📝 Development Notes

### Commit Message Format

```
[Course: Mastering React 16 > 10-Deployment (33m) ] [ Video: #3-Production-Builds_mp4_2min_48sec ] - 
```

### Repository Information

- **GitHub Account**: [avadhutFrontEnd](https://github.com/avadhutFrontEnd)
- **Repository**: [react-projects](https://github.com/avadhutFrontEnd/react-projects)
- **Branch**: `vidly-new-ui`

### Project Details

- Built with Create React App
- Uses React class components
- Implements modern React patterns and best practices
- Ready for UI styling updates and enhancements

---

**Note**: This project was created as part of the "Mastering React" course and demonstrates core React concepts using class components.
