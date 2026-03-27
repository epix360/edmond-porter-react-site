# Edmond A Porter - Author Website

A modern React website for author Edmond A Porter, built with React, React Router, and Tailwind CSS.

## Features

- **Responsive Design**: Mobile-first design that works beautifully on all devices
- **Modern Stack**: React 18, React Router DOM for navigation
- **Styling**: Tailwind CSS with custom color palette and typography
- **Components**: Modular component architecture
- **Dynamic Content**: Medium RSS feed integration
- **Smooth Animations**: CSS transitions and hover effects

## Project Structure

```
edmond-porter-website/
├── public/
│   ├── index.html          # HTML template
│   └── manifest.json       # PWA manifest
├── src/
│   ├── components/
│   │   ├── Navigation.js   # Site navigation
│   │   ├── Footer.js       # Site footer
│   │   └── MediumFeed.js   # Medium RSS feed component
│   ├── pages/
│   │   ├── HomePage.js     # Homepage component
│   │   └── AboutPage.js    # About page component
│   ├── styles/
│   │   └── index.css       # Global styles and Tailwind imports
│   ├── App.js              # Main app component with routing
│   └── index.js            # Application entry point
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
└── postcss.config.js       # PostCSS configuration
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd edmond-porter-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm start
```

The app will open in your default browser at `http://localhost:3000`.

### Production Build

Create an optimized production build:
```bash
npm run build
```

The build files will be in the `build` directory.

## Customization

### Colors and Typography

The color scheme and typography are defined in `tailwind.config.js`. The custom colors include:
- Primary: Deep blue (#162839)
- Secondary: Warm brown (#805533)
- Surface colors for light/dark theme support

### Adding New Pages

1. Create a new component in `src/pages/`
2. Add a route in `src/App.js`
3. Update the Navigation component to include the new page

### Medium Feed

The Medium feed is fetched using the RSS2JSON API. To change the Medium username, update the URL in `src/components/MediumFeed.js`.

## Deployment

This project can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

## Technologies Used

- **React 18**: UI library
- **React Router DOM**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Create React App**: Build tool and development environment
- **Google Fonts**: Typography (Noto Serif, Inter)
- **Material Symbols**: Iconography

## License

© 2026 Edmond A Porter. All rights reserved.
