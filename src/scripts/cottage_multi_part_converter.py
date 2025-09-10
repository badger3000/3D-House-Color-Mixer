"""
Cottage Multi-Part Converter for Blender
=========================================

This script automatically converts a single-mesh cottage FBX model into a multi-part 
cottage with separate materials for walls, roof, doors, and windows.

Requirements:
- Blender 2.80+
- FBX model located in public/models/Cottage_FREE.fbx

Usage:
1. Open Blender
2. Go to Scripting workspace
3. Open this script file
4. Run the script
5. The converted model will be saved as Cottage_MultiPart.fbx

Author: Claude Code Assistant
Date: 2025-09-10
"""

try:
    import bpy
    import bmesh
    from mathutils import Vector
except ImportError:
    # This script is designed to run inside Blender, not system Python
    print("This script must be run inside Blender")
    exit()

import os

def clear_scene():
    """Clear the default Blender scene"""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)

def import_cottage_fbx():
    """Import the original cottage FBX file"""
    # Adjust path to your project structure
    project_root = bpy.path.abspath("//")
    fbx_path = os.path.join(project_root, "public", "models", "Cottage_FREE.fbx")
    
    if not os.path.exists(fbx_path):
        print(f"❌ FBX file not found at: {fbx_path}")
        print("Please ensure Cottage_FREE.fbx is in public/models/ directory")
        return None
    
    print(f"📦 Importing FBX from: {fbx_path}")
    
    # Import FBX
    bpy.ops.import_scene.fbx(filepath=fbx_path)
    
    # Find the cottage mesh (look for any mesh object, not just active)
    cottage = None
    mesh_objects = [obj for obj in bpy.context.scene.objects if obj.type == 'MESH']
    
    print(f"Found {len(mesh_objects)} mesh objects after import:")
    for obj in mesh_objects:
        print(f"  - {obj.name} (vertices: {len(obj.data.vertices)})")
        
        # Look for cottage-like objects
        if 'cottage' in obj.name.lower() or 'house' in obj.name.lower() or not cottage:
            cottage = obj
    
    if cottage and cottage.type == 'MESH':
        print(f"✅ Successfully imported: {cottage.name}")
        # Make sure it's selected and active
        bpy.context.view_layer.objects.active = cottage
        cottage.select_set(True)
        return cottage
    else:
        print("❌ Failed to find cottage mesh")
        print(f"Available objects: {[obj.name for obj in bpy.context.scene.objects]}")
        return None

def create_materials():
    """Create materials for different house parts"""
    materials = {}
    
    # Define material colors
    material_specs = {
        'Cottage_Walls': (0.82, 0.71, 0.55, 1.0),    # Tan
        'Cottage_Roof': (0.55, 0.27, 0.07, 1.0),     # Brown  
        'Cottage_Doors': (0.40, 0.26, 0.13, 1.0),    # Dark Brown
        'Cottage_Windows': (0.53, 0.81, 0.92, 0.7),  # Sky Blue (semi-transparent)
    }
    
    print("🎨 Creating materials...")
    
    for mat_name, (r, g, b, a) in material_specs.items():
        # Create new material
        material = bpy.data.materials.new(name=mat_name)
        material.use_nodes = True
        
        # Get the principled BSDF node
        bsdf = material.node_tree.nodes.get("Principled BSDF")
        if bsdf:
            bsdf.inputs[0].default_value = (r, g, b, a)  # Base Color
            
            # Make windows semi-transparent
            if 'Windows' in mat_name:
                material.blend_method = 'BLEND'
                bsdf.inputs[21].default_value = a  # Alpha
        
        materials[mat_name] = material
        print(f"  ✅ Created material: {mat_name}")
    
    return materials

def separate_cottage_parts(cottage, materials):
    """Separate the cottage into different parts based on geometry analysis"""
    
    # Enter edit mode
    bpy.context.view_layer.objects.active = cottage
    bpy.ops.object.mode_set(mode='EDIT')
    
    # Create bmesh from mesh
    bm = bmesh.from_edit_mesh(cottage.data)
    bm.faces.ensure_lookup_table()
    
    print("🔍 Analyzing cottage geometry...")
    
    # Clear existing materials
    cottage.data.materials.clear()
    
    # Add all materials to the cottage
    for material in materials.values():
        cottage.data.materials.append(material)
    
    # Get material indices
    mat_indices = {name: i for i, name in enumerate(materials.keys())}
    
    # Analyze each face and assign materials
    wall_faces = []
    roof_faces = []
    door_faces = []
    window_faces = []
    
    for face in bm.faces:
        # Get face center and normal
        center = face.calc_center_median()
        normal = face.normal
        
        # Classify faces based on position and orientation
        if center.z > 2.0:  # High up = roof
            face.material_index = mat_indices['Cottage_Roof']
            roof_faces.append(face.index)
        elif center.z < 0.5 and abs(center.x) < 1.0 and center.y > 1.0:  # Low, center, front = door
            face.material_index = mat_indices['Cottage_Doors']
            door_faces.append(face.index)
        elif 0.5 < center.z < 2.5 and (abs(center.x) > 1.5 or abs(center.y) > 1.5):  # Mid-height, edges = windows
            face.material_index = mat_indices['Cottage_Windows']
            window_faces.append(face.index)
        else:  # Everything else = walls
            face.material_index = mat_indices['Cottage_Walls']
            wall_faces.append(face.index)
    
    # Update mesh
    bmesh.update_edit_mesh(cottage.data)
    bpy.ops.object.mode_set(mode='OBJECT')
    
    print(f"📊 Face classification:")
    print(f"  🏠 Walls: {len(wall_faces)} faces")
    print(f"  🏠 Roof: {len(roof_faces)} faces") 
    print(f"  🚪 Doors: {len(door_faces)} faces")
    print(f"  🪟 Windows: {len(window_faces)} faces")
    
    return cottage

def create_separate_objects(cottage):
    """Create separate objects for each part (alternative approach)"""
    
    print("🔨 Creating separate objects for each part...")
    
    # Duplicate cottage for each part
    objects = {}
    part_names = ['Walls', 'Roof', 'Doors', 'Windows']
    
    for part_name in part_names:
        # Duplicate the cottage
        bpy.ops.object.select_all(action='DESELECT')
        cottage.select_set(True)
        bpy.context.view_layer.objects.active = cottage
        bpy.ops.object.duplicate()
        
        # Rename the duplicate
        new_obj = bpy.context.active_object
        new_obj.name = f"Cottage_{part_name}"
        objects[part_name] = new_obj
        
        print(f"  ✅ Created: {new_obj.name}")
    
    # Hide original cottage
    cottage.hide_set(True)
    
    return objects

def export_multi_part_cottage():
    """Export the multi-part cottage as FBX"""
    
    # Get export path
    project_root = bpy.path.abspath("//")
    export_path = os.path.join(project_root, "public", "models", "Cottage_MultiPart.fbx")
    
    print(f"📤 Exporting multi-part cottage to: {export_path}")
    
    # Select all cottage objects
    bpy.ops.object.select_all(action='DESELECT')
    for obj in bpy.context.scene.objects:
        if obj.name.startswith("Cottage_") and obj.type == 'MESH':
            obj.select_set(True)
    
    # Export FBX
    bpy.ops.export_scene.fbx(
        filepath=export_path,
        use_selection=True,
        axis_forward='-Z',
        axis_up='Y',
        global_scale=1.0,
        bake_space_transform=False
    )
    
    print("✅ Export complete!")
    return export_path

def main():
    """Main function to convert cottage to multi-part"""
    
    print("🏠 Starting Cottage Multi-Part Conversion...")
    print("=" * 50)
    
    try:
        # Step 1: Clear scene
        clear_scene()
        
        # Step 2: Import cottage FBX
        cottage = import_cottage_fbx()
        if not cottage:
            return
        
        # Step 3: Create materials
        materials = create_materials()
        
        # Step 4: Separate cottage parts
        multi_part_cottage = separate_cottage_parts(cottage, materials)
        
        # Step 5: Alternative - create separate objects (uncomment to use)
        # separate_objects = create_separate_objects(cottage)
        
        # Step 6: Export multi-part cottage
        export_path = export_multi_part_cottage()
        
        print("=" * 50)
        print("🎉 Cottage Multi-Part Conversion Complete!")
        print(f"📁 Output file: {export_path}")
        print("🔄 Update your modelPath to: '/models/Cottage_MultiPart.fbx'")
        
    except Exception as e:
        print(f"❌ Error during conversion: {str(e)}")
        import traceback
        traceback.print_exc()

# Run the conversion
if __name__ == "__main__":
    main()