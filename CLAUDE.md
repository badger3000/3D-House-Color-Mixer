# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a 3D house color mixer application built with Three.js that allows users to visualize and customize colors of different parts of a house model. The application loads FBX 3D models and provides an interactive interface for changing colors of walls, roof, doors, and windows.

## Architecture

- **Modern build system**: Uses Vite for fast development and optimized production builds
- **Modular structure**: Separated HTML, CSS, and JavaScript for better maintainability
- **3D Engine**: Uses Three.js (latest) for 3D rendering and scene management
- **Model Loading**: FBX models loaded via Three.js FBXLoader with ES6 modules
- **Fallback System**: Creates procedural house if FBX loading fails
- **Real-time Updates**: Color changes are applied immediately to 3D models
- **Development Tools**: ESLint, Prettier, and TypeScript support included

## Key Components

### Scene Setup (`init()`)
- Creates Three.js scene with camera, renderer, and lighting
- Sets up shadow mapping and post-processing effects
- Initializes mouse controls for camera rotation/zoom

### Model Loading (`loadHouseModel()`)
- Attempts to load FBX model from `./models/` directory
- Falls back to procedural house generation if loading fails
- Automatically analyzes model structure for part categorization

### Part Classification (`analyzeModel()`)
- Categorizes mesh objects based on naming conventions:
  - **walls**: Contains "wall", "siding", or "exterior"
  - **roof**: Contains "roof", "shingle", or "tile"
  - **doors**: Contains "door" or "entrance"
  - **windows**: Contains "window", "glass", or "pane"
  - **other**: Everything else

### Color Management
- Real-time color updates using Three.js material color properties
- Preset color palettes for each house component
- Visual feedback through color preview elements

## Model Requirements

- **Format**: FBX files (`.fbx`)
- **Location**: Must be placed in `public/models/` directory
- **Naming**: Mesh names should include descriptive keywords for automatic categorization
- **Scale**: Models are scaled by 0.01 by default (adjust in `loadHouseModel()`)

## Development

### Quick Start
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Available Scripts
- `npm run dev` - Start Vite development server with hot reload
- `npm run build` - Create optimized production build in `dist/` folder
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality
- `npm run format` - Format code using Prettier

### Adding New House Parts
1. Add new category to `houseParts` object
2. Update `analyzeModel()` with naming conventions
3. Add corresponding UI controls in HTML
4. Implement color update logic in event listeners

### Model Debugging
- Check browser console for model loading progress and errors
- Use the model parts panel to verify mesh categorization
- Model analysis info shows part and material counts

## File Structure
```
3D-house/
├── public/
│   └── models/
│       └── Cottage_FREE.fbx    # 3D house model
├── src/
│   ├── styles/
│   │   └── main.css            # Application styles
│   └── main.js                 # Main application logic
├── dist/                       # Built files (generated)
├── package.json                # Project dependencies and scripts
├── vite.config.js              # Vite configuration
├── .eslintrc.json              # ESLint configuration
├── .prettierrc                 # Prettier configuration
├── .gitignore                  # Git ignore rules
├── index.html                  # Main HTML template
└── CLAUDE.md                   # This documentation
```