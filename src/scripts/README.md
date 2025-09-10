# Scripts Directory

This directory contains utility scripts for enhancing the 3D House Color Mixer project.

## Available Scripts

### `cottage_multi_part_converter.py`
**Purpose**: Converts single-mesh cottage FBX models into multi-part cottages with separate materials for walls, roof, doors, and windows.

**Requirements**: 
- Blender 2.80+
- Python (included with Blender)

**Usage**:
1. Open Blender
2. Load the script in Scripting workspace  
3. Run the script
4. Check console for progress

**Input**: `public/models/Cottage_FREE.fbx`  
**Output**: `public/models/Cottage_MultiPart.fbx`

## Running Scripts

### In Blender
1. **Open Blender**
2. **Go to Scripting workspace**
3. **Open script file** using the folder icon
4. **Click Run** (play button) to execute

### From Command Line (Advanced)
```bash
blender --background --python src/scripts/cottage_multi_part_converter.py
```

## Script Development

### Adding New Scripts
1. Create `.py` files in this directory
2. Follow the existing naming convention: `descriptive_name.py`
3. Include comprehensive docstrings and error handling
4. Update this README with script descriptions

### Code Style
- Use descriptive variable names
- Include progress print statements
- Handle errors gracefully
- Document all functions

### Testing
- Test with various FBX models
- Verify output file integrity
- Check material assignments in Blender

## Integration with Main Project

Scripts in this directory are designed to enhance the 3D assets used by the main application. After running scripts:

1. **Update model paths** in `src/main.js`
2. **Test the application** to ensure changes work
3. **Update documentation** if behavior changes

## Troubleshooting

**Script won't run**:
- Ensure Blender version compatibility
- Check file paths are correct
- Verify input files exist

**Output files missing**:
- Check write permissions
- Verify export path exists
- Look for error messages in console

**Unexpected results**:
- Review geometric thresholds in scripts
- Test with simpler models first
- Check material assignments manually

## Future Scripts

Potential scripts to add:
- **Texture optimizer** - Compress and optimize textures
- **Model validator** - Check model integrity and standards
- **Batch converter** - Convert multiple models at once
- **UV unwrapper** - Automated UV mapping improvements
- **LOD generator** - Create level-of-detail variations