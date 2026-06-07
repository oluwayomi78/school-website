# School Website Project

A comprehensive web application for managing and displaying school information, built with React, TypeScript, and Vite.

## Features

- **Landing Page**: Information about the school, news, and updates.
- **Admission**: Online admission forms and information.
- **Courses**: Details of courses and programs offered.
- **Student/Teacher Dashboard**: Personalized portals for students and teachers.
- **Admin Dashboard**: Centralized management system for administrators.
- **Authentication**: Secure login and signup for different roles (Admin, Teacher, Student).
- **Contact Us**: Communication forms and contact details.

## Tech Stack

- **Frontend Framework:** React
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** CSS (App.css, index.css)

## Project Structure

```
src/
├── assets/          # Static assets like images and icons
├── components/      # React components
│   ├── About.tsx
│   ├── AdminDashboard.tsx
│   ├── AdminLogin.tsx
│   ├── Admission.tsx
│   ├── Contact.tsx
│   ├── Courses.tsx
│   ├── Dashboard.tsx
│   ├── LandingPage.tsx
│   ├── Login.tsx
│   ├── Signup.tsx
│   └── Teacher.tsx
├── App.tsx          # Main application component
├── main.tsx         # Entry point
└── index.css        # Global styles
```

## Getting Started

### Prerequisites

- Node.js (version 18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository (if applicable) or navigate to the project directory:
   ```bash
   cd school-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   *or*
   ```bash
   yarn install
   ```

### Development Server

Run the development server to see the app in action:

```bash
npm run dev
```
*or*
```bash
yarn dev
```

The application will be available at `http://localhost:5173` by default.

### Building for Production

To build the project for production:

```bash
npm run build
```
*or*
```bash
yarn build
```

This will create a `dist` folder containing the compiled and minified code, ready for deployment.

### Linting

To run ESLint:

```bash
npm run lint
```
*or*
```bash
yarn lint
```

## License

This project is proprietary and confidential.
