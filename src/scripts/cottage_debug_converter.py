"""
Cottage Multi-Part Converter - DEBUG VERSION
============================================

This debug version shows more detailed information about file paths and operations.
Use this to troubleshoot issues before running the full converter.
"""

import bpy
import os

def debug_file_paths():
    """Debug function to check all file paths"""
    print("🔍 DEBUG: Checking file paths...")
    
    # Also show in Blender's interface
    bpy.context.window_manager.popup_menu(lambda self, context: self.layout.label(text="Debug: Checking file paths..."), title="Cottage Converter Debug", icon='INFO')
    
    # Get current blend file path
    blend_path = bpy.data.filepath
    print(f"📁 Current .blend file: {blend_path}")
    
    if not blend_path:
        print("❌ ERROR: .blend file not saved! Please save your .blend file first.")
        print("💡 Go to File → Save As... and save in your project root directory")
        return False
    
    # Get project root (where .blend file is saved)
    project_root = os.path.dirname(blend_path)
    print(f"📁 Project root: {project_root}")
    
    # Check for public/models directory
    models_dir = os.path.join(project_root, "public", "models")
    print(f"📁 Models directory: {models_dir}")
    print(f"📁 Models directory exists: {os.path.exists(models_dir)}")
    
    if os.path.exists(models_dir):
        print("📁 Files in models directory:")
        for file in os.listdir(models_dir):
            print(f"  - {file}")
    
    # Check for specific FBX file
    fbx_path = os.path.join(models_dir, "Cottage_FREE.fbx")
    print(f"📁 FBX file path: {fbx_path}")
    print(f"📁 FBX file exists: {os.path.exists(fbx_path)}")
    
    if os.path.exists(fbx_path):
        file_size = os.path.getsize(fbx_path)
        print(f"📁 FBX file size: {file_size} bytes")
        return True
    else:
        print("❌ ERROR: Cottage_FREE.fbx not found!")
        return False

def debug_blender_info():
    """Show Blender version and addon info"""
    print("🔍 DEBUG: Blender Information...")
    print(f"📦 Blender version: {bpy.app.version_string}")
    print(f"📦 Scene objects: {len(bpy.context.scene.objects)}")
    
    # Check if FBX addon is enabled
    addon_utils = bpy.utils
    if hasattr(addon_utils, 'addon_ensure'):
        print("📦 Checking FBX addon...")
        try:
            import io_scene_fbx
            print("✅ FBX addon is available")
        except ImportError:
            print("❌ FBX addon not available - enable in Preferences → Add-ons")
    
def simple_import_test():
    """Try to import the FBX file with detailed error reporting"""
    print("🔍 DEBUG: Testing FBX import...")
    
    # Get file path
    blend_path = bpy.data.filepath
    if not blend_path:
        print("❌ ERROR: Save your .blend file first!")
        return False
    
    project_root = os.path.dirname(blend_path)
    fbx_path = os.path.join(project_root, "public", "models", "Cottage_FREE.fbx")
    
    if not os.path.exists(fbx_path):
        print(f"❌ ERROR: FBX file not found at: {fbx_path}")
        return False
    
    print(f"📦 Attempting to import: {fbx_path}")
    
    try:
        # Clear scene first
        bpy.ops.object.select_all(action='SELECT')
        bpy.ops.object.delete(use_global=False)
        
        # Import FBX
        bpy.ops.import_scene.fbx(filepath=fbx_path)
        
        # Check what was imported
        imported_objects = [obj for obj in bpy.context.scene.objects if obj.type == 'MESH']
        print(f"✅ Successfully imported {len(imported_objects)} mesh objects:")
        for obj in imported_objects:
            print(f"  - {obj.name} (vertices: {len(obj.data.vertices)})")
        
        return len(imported_objects) > 0
        
    except Exception as e:
        print(f"❌ ERROR during import: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Run all debug checks"""
    print("🏠 COTTAGE CONVERTER - DEBUG MODE")
    print("=" * 50)
    
    # Step 1: Check file paths
    if not debug_file_paths():
        print("❌ File path check failed - fix paths before proceeding")
        return
    
    print("\n" + "=" * 50)
    
    # Step 2: Check Blender info
    debug_blender_info()
    
    print("\n" + "=" * 50)
    
    # Step 3: Test import
    if simple_import_test():
        print("✅ DEBUG COMPLETE: Everything looks good!")
        print("💡 You can now run the full cottage_multi_part_converter.py script")
    else:
        print("❌ DEBUG FAILED: Fix the issues above before proceeding")

# Run the debug checks
if __name__ == "__main__":
    main()