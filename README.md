# 🏠 3D House Color Mixer

A modern web application that lets you visualize and customize the colors of different parts of a 3D house model in real-time. Built with Three.js and powered by Vite for a smooth development experience.

![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## ✨ Features

- 🎨 **Real-time Color Customization** - Change colors of walls, roof, doors, and windows instantly
- 🏗️ **FBX Model Support** - Load and display complex 3D house models
- 🎭 **Interactive 3D View** - Mouse controls for rotating and zooming the camera
- 🎯 **Smart Part Detection** - Automatic categorization of house components
- 🎪 **Preset Color Palettes** - Quick color selection with predefined options
- 🔄 **Fallback System** - Generates procedural house if model loading fails
- ⚡ **Modern Build System** - Vite for fast development and optimized production builds

## 🚀 Quick Start

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**
   ```bash
   cd 3D-house
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:8000`
   - The application will automatically open in your default browser

## 🎮 How to Use

1. **Load a 3D Model**
   - Place your `.fbx` file in the `public/models/` directory
   - Update the file path in the input field at the bottom left
   - Click "Load Model" to load your custom house

2. **Customize Colors**
   - Use the color picker for precise color selection
   - Click preset colors for quick styling
   - Changes are applied instantly to the 3D model

3. **Navigate the 3D Scene**
   - **Mouse drag**: Rotate the camera around the house
   - **Mouse wheel**: Zoom in and out
   - **Model parts panel**: View all detected house components

## 🛠️ Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint to check code quality |
| `npm run format` | Format code using Prettier |

### Project Structure

```
3D-house/
├── public/
│   └── models/              # 3D model files (.fbx)
│       └── Cottage_FREE.fbx
├── src/
│   ├── styles/
│   │   └── main.css         # Application styles
│   └── main.js              # Main application logic
├── dist/                    # Built files (auto-generated)
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
├── index.html               # Main HTML template
└── README.md                # This file
```

### Adding Your Own 3D Models

1. **Supported Format**: FBX files (`.fbx`)
2. **Location**: Place files in `public/models/` directory
3. **Naming Convention**: For automatic part detection, name your meshes with keywords:
   - **Walls**: "wall", "siding", "exterior"
   - **Roof**: "roof", "shingle", "tile"
   - **Doors**: "door", "entrance"
   - **Windows**: "window", "glass", "pane"

### Customization

#### Adding New House Parts

1. **Update the `houseParts` object** in `src/main.js`:
   ```javascript
   let houseParts = {
     walls: [],
     roof: [],
     doors: [],
     windows: [],
     foundations: [], // Add new category
     other: [],
   };
   ```

2. **Add detection logic** in the `analyzeModel()` function:
   ```javascript
   } else if (name.includes("foundation") || name.includes("base")) {
     houseParts.foundations.push(child);
   ```

3. **Add UI controls** in `index.html` for the new part category

#### Modifying Colors and Styles

- **Preset colors**: Edit the `data-color` attributes in `index.html`
- **Default colors**: Change the `value` attributes of color inputs
- **Styling**: Modify `src/styles/main.css` for UI appearance

## 🎯 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

*Note: Requires WebGL support for 3D rendering*

## 🔧 Troubleshooting

### Model Not Loading?
- ✅ Check that your `.fbx` file is in `public/models/`
- ✅ Ensure you're using the development server (`npm run dev`)
- ✅ Verify the file path in the input field is correct
- ✅ Check browser console for detailed error messages

### Performance Issues?
- 📊 Use smaller/optimized FBX models (< 50MB recommended)
- 🔧 Adjust model scale in `loadHouseModel()` function
- 💻 Ensure your device has adequate WebGL support

### Build Errors?
- 🧹 Clear node_modules: `rm -rf node_modules && npm install`
- 🔄 Update dependencies: `npm update`
- 📝 Check console for specific error messages

## 📚 Tech Stack

- **[Three.js](https://threejs.org/)** - 3D graphics library
- **[Vite](https://vitejs.dev/)** - Build tool and dev server
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **Vanilla JavaScript** - No framework dependencies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Three.js community for excellent documentation
- FBX format support through Three.js loaders
- Vite team for the amazing build tool

---

**Made with ❤️ for 3D enthusiasts and web developers**