# Blender Integration Guide

This document explains how to convert your single-mesh cottage asset into a multi-part cottage with separate materials for realistic color customization.

## Overview

The 3D House Color Mixer currently works with single-mesh models, where only one color control affects the entire model. To enable true multi-part color customization (separate walls, roof, doors, windows), we need to modify the 3D asset in Blender.

## Problem Statement

- **Current State**: `Cottage_FREE.fbx` is a single mesh with one material
- **Desired State**: Multi-part cottage with separate materials for each component
- **Result**: Independent color control for walls, roof, doors, and windows

## Solution: Blender Python Script

### File Location
```
src/scripts/cottage_multi_part_converter.py
```

### What the Script Does

1. **Imports** the original `Cottage_FREE.fbx` from `public/models/`
2. **Analyzes** geometry to identify different house parts
3. **Creates** separate materials with appropriate colors:
   - **Walls**: Tan (`#D2B48C`)
   - **Roof**: Brown (`#8B4513`) 
   - **Doors**: Dark Brown (`#654321`)
   - **Windows**: Sky Blue with transparency (`#87CEEB`)
4. **Assigns** materials to faces based on position and orientation
5. **Exports** as `Cottage_MultiPart.fbx`

### Classification Logic

The script uses geometric analysis to classify faces:

```python
# Roof: High Z position (above 2.0 units)
if center.z > 2.0:
    face.material_index = roof_material

# Doors: Low Z, center X/Y, front-facing
elif center.z < 0.5 and abs(center.x) < 1.0 and center.y > 1.0:
    face.material_index = door_material

# Windows: Mid-height, edge positions
elif 0.5 < center.z < 2.5 and (abs(center.x) > 1.5 or abs(center.y) > 1.5):
    face.material_index = window_material

# Walls: Everything else
else:
    face.material_index = wall_material
```

## Usage Instructions

### Step 1: Prepare Blender
1. **Open Blender 2.80+**
2. **Save your .blend file** in the project root directory (important for relative paths)
3. **Go to Scripting workspace**

### Step 2: Run the Script
1. **Open** `src/scripts/cottage_multi_part_converter.py`
2. **Run** the script (click the play button)
3. **Check console** for progress messages

### Step 3: Update Your Application
1. **Modify** `src/main.js`:
   ```javascript
   let modelPath = "/models/Cottage_MultiPart.fbx";
   ```
2. **Refresh** your browser
3. **Test** all color controls

## Expected Output

### Console Messages
```
🏠 Starting Cottage Multi-Part Conversion...
📦 Importing FBX from: /path/to/Cottage_FREE.fbx
✅ Successfully imported: Cottage_Free
🎨 Creating materials...
  ✅ Created material: Cottage_Walls
  ✅ Created material: Cottage_Roof
  ✅ Created material: Cottage_Doors
  ✅ Created material: Cottage_Windows
🔍 Analyzing cottage geometry...
📊 Face classification:
  🏠 Walls: 2841 faces
  🏠 Roof: 892 faces
  🚪 Doors: 124 faces
  🪟 Windows: 424 faces
📤 Exporting multi-part cottage to: /path/to/Cottage_MultiPart.fbx
✅ Export complete!
🎉 Cottage Multi-Part Conversion Complete!
```

### Generated Files
```
public/models/
├── Cottage_FREE.fbx          # Original single-mesh cottage
└── Cottage_MultiPart.fbx     # New multi-material cottage
```

## Alternative Approaches

### Manual Blender Workflow

If the script doesn't work perfectly, you can manually edit the cottage:

1. **Import** `Cottage_FREE.fbx` into Blender
2. **Enter Edit Mode** (Tab)
3. **Select roof faces** (Alt+Click for edge loops)
4. **Create new material** in Material Properties panel
5. **Assign material** to selected faces
6. **Repeat** for walls, doors, windows
7. **Export as FBX**

### Separate Objects Approach

For maximum control, create separate objects:

1. **Select roof geometry** in Edit Mode
2. **Press P → Selection** to separate
3. **Rename objects**: `Cottage_Walls`, `Cottage_Roof`, etc.
4. **Export all objects** as single FBX

## Troubleshooting

### Common Issues

**Script fails to find FBX file:**
- Ensure Blender .blend file is saved in project root
- Check that `Cottage_FREE.fbx` exists in `public/models/`
- Verify file permissions

**Face classification not accurate:**
- Adjust the geometric thresholds in the script
- Your cottage might have different proportions
- Consider manual material assignment

**Export fails:**
- Check write permissions in `public/models/` directory
- Ensure no other application has the file open
- Try exporting to a different location first

### Debugging Tips

1. **Check Blender console** for detailed error messages
2. **Inspect face classification** in Material Preview mode
3. **Test with smaller face selections** first
4. **Save incremental .blend files** during process

## Integration with 3D House Color Mixer

After successful conversion, your application will automatically detect the multiple materials and enable all color controls:

```javascript
// The app will detect separate materials and enable:
houseParts.walls.push(wallMeshes);     // Tan material faces
houseParts.roof.push(roofMeshes);      // Brown material faces  
houseParts.doors.push(doorMeshes);     // Dark brown material faces
houseParts.windows.push(windowMeshes); // Blue material faces
```

## Next Steps

1. **Run the Blender script** to convert your cottage
2. **Test the multi-part color controls** in your application
3. **Fine-tune material assignments** if needed
4. **Create additional cottage variations** using the same process

## File Structure After Integration

```
3D-house/
├── public/models/
│   ├── Cottage_FREE.fbx          # Original
│   └── Cottage_MultiPart.fbx     # Multi-material version
├── src/
│   ├── scripts/
│   │   └── cottage_multi_part_converter.py  # Blender script
│   ├── context/
│   │   └── blender-integration.md            # This document
│   └── main.js                               # Updated model path
└── README.md                                 # Updated documentation
```

## Performance Considerations

- **Multi-material models** may have slightly higher rendering cost
- **Face count remains the same** (4,281 triangles)
- **Texture memory increases** due to multiple materials
- **Overall impact is minimal** for this model size

## Future Enhancements

- **Vertex color painting** for more precise part definition
- **UV texture masking** for complex material transitions
- **Shader-based part separation** for runtime switching
- **Multiple cottage variations** with different architectural styles