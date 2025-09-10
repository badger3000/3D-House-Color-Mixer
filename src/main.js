import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

let scene, camera, renderer, mixer;
let houseModel = null;
let houseParts = {
  walls: [],
  roof: [],
  doors: [],
  windows: [],
  other: [],
};

// File path for the FBX model
let modelPath = "/models/Cottage_MultiPart.fbx";

function init() {
  // Scene setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);
  scene.fog = new THREE.Fog(0x87ceeb, 10, 100);

  // Camera setup
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(10, 8, 10);

  // Renderer setup
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document
    .getElementById("canvas-container")
    .appendChild(renderer.domElement);

  // Lighting setup
  setupLighting();

  // Ground plane
  createGround();

  // Mouse controls
  addMouseControls();

  // Event listeners
  addEventListeners();

  // Load the house model
  loadHouseModel();

  // Start animation
  animate();
}

function setupLighting() {
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
  scene.add(ambientLight);

  // Main directional light (sun)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(20, 20, 10);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 0.1;
  directionalLight.shadow.camera.far = 100;
  directionalLight.shadow.camera.left = -20;
  directionalLight.shadow.camera.right = 20;
  directionalLight.shadow.camera.top = 20;
  directionalLight.shadow.camera.bottom = -20;
  scene.add(directionalLight);

  // Fill light
  const fillLight = new THREE.DirectionalLight(0x87ceeb, 0.3);
  fillLight.position.set(-10, 10, -10);
  scene.add(fillLight);
}

function createGround() {
  const groundGeometry = new THREE.PlaneGeometry(50, 50);
  const groundMaterial = new THREE.MeshLambertMaterial({
    color: 0x90ee90,
    transparent: true,
    opacity: 0.8,
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
}

function loadHouseModel() {
  // Enhanced debugging
  console.log("=== Starting Model Load Debug ===");
  console.log("Model path:", modelPath);
  console.log("FBXLoader available:", typeof FBXLoader !== "undefined");
  
  // Check if FBXLoader is available
  if (typeof FBXLoader === "undefined") {
    console.error(
      "❌ FBXLoader not available! Check if the script is loading properly."
    );
    console.log("Creating procedural house instead...");
    createProceduralHouse();
    return;
  }

  const loader = new FBXLoader();
  
  console.log("✅ FBXLoader created successfully");
  console.log("Attempting to load:", modelPath);

  loader.load(
    modelPath,
    function (object) {
      console.log("✅ FBX model loaded successfully:", object);
      houseModel = object;

      // Scale and position the model
      object.scale.setScalar(0.01); // Adjust scale as needed
      object.position.set(0, 0, 0);

      // Enable shadows
      object.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      scene.add(object);

      // Analyze the model structure
      analyzeModel(object);

      // Hide loading screen and show controls
      document.getElementById("loading").style.display = "none";
      document.getElementById("controls").style.display = "block";
      document.getElementById("model-status").textContent =
        "Model: Loaded ✓";
      
      console.log("✅ Controls should now be visible");

      // Setup initial colors
      updateAllColors();
    },
    function (progress) {
      const percentage = progress.total ? (progress.loaded / progress.total) * 100 : 0;
      console.log(
        "📊 Loading progress:",
        Math.round(percentage) + "%",
        `(${progress.loaded}/${progress.total} bytes)`
      );
    },
    function (error) {
      console.error("❌ Error loading FBX model:", error);
      console.error("Error type:", error.constructor.name);
      console.error("Error message:", error.message);
      console.error("Model path attempted:", modelPath);
      
      // Check if it's a CORS error (common when opening file:// directly)
      if (window.location.protocol === 'file:') {
        console.error("🚫 CORS Error: You're opening the file directly in the browser!");
        console.log("💡 SOLUTION: You need to run a local server:");
        console.log("  1. Open Terminal/Command Prompt");
        console.log("  2. Navigate to your project folder: cd /Users/pothole/Desktop/3D-house");
        console.log("  3. Run: python3 -m http.server 8000");
        console.log("  4. Open: http://localhost:8000");
        console.log("  5. OR use Live Server extension in VS Code");
      } else if (error.message && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
        console.error("🌐 Network Error: This is likely a file not found or corrupted file");
        console.log("💡 Solutions:");
        console.log("  1. Check that the file path is correct");
        console.log("  2. Verify the .fbx file isn't corrupted");
      }
      
      console.log("Creating procedural house instead...");
      createProceduralHouse();
    }
  );
}

function createProceduralHouse() {
  // Create a simple house procedurally as fallback
  const houseGroup = new THREE.Group();

  // Walls
  const wallsGeometry = new THREE.BoxGeometry(4, 3, 4);
  const wallsMaterial = new THREE.MeshLambertMaterial({color: 0xd2b48c});
  const walls = new THREE.Mesh(wallsGeometry, wallsMaterial);
  walls.position.y = 1.5;
  walls.castShadow = true;
  walls.receiveShadow = true;
  walls.name = "walls";
  houseGroup.add(walls);

  // Roof
  const roofGeometry = new THREE.ConeGeometry(3.5, 1.5, 4);
  const roofMaterial = new THREE.MeshLambertMaterial({color: 0x8b4513});
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  roof.position.y = 3.75;
  roof.rotation.y = Math.PI / 4;
  roof.castShadow = true;
  roof.name = "roof";
  houseGroup.add(roof);

  // Door
  const doorGeometry = new THREE.BoxGeometry(0.8, 2, 0.1);
  const doorMaterial = new THREE.MeshLambertMaterial({color: 0x654321});
  const door = new THREE.Mesh(doorGeometry, doorMaterial);
  door.position.set(0, 1, 2.05);
  door.castShadow = true;
  door.name = "door";
  houseGroup.add(door);

  // Windows
  const windowGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.1);
  const windowMaterial = new THREE.MeshLambertMaterial({
    color: 0x87ceeb,
    transparent: true,
    opacity: 0.7,
  });

  // Left window
  const leftWindow = new THREE.Mesh(
    windowGeometry,
    windowMaterial.clone()
  );
  leftWindow.position.set(-1.2, 2, 2.05);
  leftWindow.name = "window_left";
  houseGroup.add(leftWindow);

  // Right window
  const rightWindow = new THREE.Mesh(
    windowGeometry,
    windowMaterial.clone()
  );
  rightWindow.position.set(1.2, 2, 2.05);
  rightWindow.name = "window_right";
  houseGroup.add(rightWindow);

  // Add to scene
  scene.add(houseGroup);
  houseModel = houseGroup;

  // Analyze the procedural model
  analyzeModel(houseGroup);

  // Hide loading screen and show controls
  document.getElementById("loading").style.display = "none";
  document.getElementById("controls").style.display = "block";
  document.getElementById("model-status").textContent =
    "Model: Procedural House ✓";

  // Setup initial colors
  updateAllColors();
}

function analyzeModel(object) {
  let meshCount = 0;
  let materialCount = 0;
  const materials = new Set();
  const partsList = document.getElementById("model-parts");
  partsList.innerHTML = "";

  // Reset parts arrays
  Object.keys(houseParts).forEach((key) => {
    houseParts[key] = [];
  });

  object.traverse(function (child) {
    if (child.isMesh) {
      meshCount++;

      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) =>
            materials.add(mat.name || "Unnamed")
          );
        } else {
          materials.add(child.material.name || "Unnamed");
        }
      }

      // Categorize parts based on name and materials
      const name = child.name.toLowerCase();
      const partItem = document.createElement("div");
      partItem.className = "part-item";
      partItem.textContent = child.name || "Unnamed Part";

      // Check if this mesh has multiple materials (multi-part cottage)
      const hasMaterialArray = Array.isArray(child.material);
      const materialCount = hasMaterialArray ? child.material.length : (child.material ? 1 : 0);
      
      console.log(`🔍 Analyzing ${child.name}: ${materialCount} materials`);
      
      if (name.includes("cottage") && materialCount >= 4) {
        // Multi-material cottage - assign to all categories for independent control
        console.log("📦 Multi-material cottage detected!");
        
        houseParts.walls.push(child);
        houseParts.roof.push(child);  
        houseParts.doors.push(child);
        houseParts.windows.push(child);
        
        partItem.style.borderLeft = "4px solid #4CAF50";
        partItem.textContent += " (Multi-Material - All Controls Active)";
        
        console.log("✅ Multi-material cottage assigned to all controls");
      } else if (name.includes("cottage") || name.includes("house") || meshCount === 1) {
        // Single-material cottage - assign to walls only
        console.log("📦 Single-material cottage detected, using walls control for entire cottage");
        
        houseParts.walls.push(child);
        partItem.style.borderLeft = "4px solid #D2B48C";
        partItem.textContent += " (Walls Control = Entire Cottage)";
        
        console.log("✅ Single-material cottage assigned to walls control");
      } else if (
        name.includes("wall") ||
        name.includes("siding") ||
        name.includes("exterior")
      ) {
        houseParts.walls.push(child);
        partItem.style.borderLeft = "4px solid #D2B48C";
      } else if (
        name.includes("roof") ||
        name.includes("shingle") ||
        name.includes("tile")
      ) {
        houseParts.roof.push(child);
        partItem.style.borderLeft = "4px solid #8B4513";
      } else if (name.includes("door") || name.includes("entrance")) {
        houseParts.doors.push(child);
        partItem.style.borderLeft = "4px solid #654321";
      } else if (
        name.includes("window") ||
        name.includes("glass") ||
        name.includes("pane")
      ) {
        houseParts.windows.push(child);
        partItem.style.borderLeft = "4px solid #87CEEB";
      } else {
        houseParts.other.push(child);
        partItem.style.borderLeft = "4px solid #888";
      }

      partsList.appendChild(partItem);
    }
  });

  materialCount = materials.size;
  document.getElementById(
    "model-details"
  ).textContent = `Parts: ${meshCount} | Materials: ${materialCount}`;

  console.log("Model analysis:", {
    meshes: meshCount,
    materials: materialCount,
    parts: houseParts,
  });
  
  // Debug: Show all mesh names to help with categorization
  console.log("🔍 All mesh names found in model:");
  object.traverse(function (child) {
    if (child.isMesh) {
      console.log(`  - "${child.name}" (type: ${child.type})`);
    }
  });
}

function getPartMaterialIndex(partType) {
  // Map part types to material slot indices based on Blender script order
  const materialSlots = {
    'walls': 0,    // Cottage_Walls material
    'roof': 1,     // Cottage_Roof material  
    'doors': 2,    // Cottage_Doors material
    'windows': 3   // Cottage_Windows material
  };
  return materialSlots[partType] ?? -1;
}

function updatePartColor(partType, color) {
  const parts = houseParts[partType];
  const colorObj = new THREE.Color(color);
  
  console.log(`🎨 Updating ${partType} color to ${color}`, {
    partCount: parts.length,
    parts: parts.map(p => p.name)
  });

  parts.forEach((part) => {
    if (part.material) {
      if (Array.isArray(part.material)) {
        // Multi-material object - update specific material slot based on part type
        const materialIndex = getPartMaterialIndex(partType);
        if (materialIndex >= 0 && materialIndex < part.material.length) {
          part.material[materialIndex].color = colorObj.clone();
          console.log(`  - Updated material slot ${materialIndex}: ${part.material[materialIndex].name || 'Unnamed'}`);
        } else {
          console.warn(`  - Material slot ${materialIndex} not found for ${partType}`);
        }
      } else {
        part.material.color = colorObj.clone();
        console.log(`  - Updated material: ${part.material.name || 'Unnamed'}`);
      }
    } else {
      console.warn(`  - Part ${part.name} has no material!`);
    }
  });
}

function updateAllColors() {
  console.log("🌈 Updating all colors...");
  
  const wallsEl = document.getElementById("walls-color");
  const roofEl = document.getElementById("roof-color");
  const doorsEl = document.getElementById("doors-color");
  const windowsEl = document.getElementById("windows-color");
  
  console.log("Color inputs found:", {
    walls: !!wallsEl,
    roof: !!roofEl,
    doors: !!doorsEl,
    windows: !!windowsEl
  });
  
  if (wallsEl) updatePartColor("walls", wallsEl.value);
  if (roofEl) updatePartColor("roof", roofEl.value);
  if (doorsEl) updatePartColor("doors", doorsEl.value);
  if (windowsEl) updatePartColor("windows", windowsEl.value);
}

function addMouseControls() {
  let isMouseDown = false;
  let mouseX = 0,
    mouseY = 0;
  let targetRotationX = 0,
    targetRotationY = 0;
  let rotationX = 0,
    rotationY = 0;
  let radius = 15;

  renderer.domElement.addEventListener("mousedown", (e) => {
    isMouseDown = true;
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener("mouseup", () => {
    isMouseDown = false;
  });

  document.addEventListener("mousemove", (e) => {
    if (isMouseDown) {
      targetRotationY += (e.clientX - mouseX) * 0.01;
      targetRotationX += (e.clientY - mouseY) * 0.01;
      
      // Constrain vertical rotation to prevent going below ground
      // -0.1 allows slight downward angle, Math.PI/2.5 allows looking down at ~72 degrees max
      targetRotationX = Math.max(
        -0.1,  // Prevent going below horizontal (ground level)
        Math.min(Math.PI / 2.5, targetRotationX)  // Allow looking down but not too much
      );
      
      mouseX = e.clientX;
      mouseY = e.clientY;
    }
  });

  // Smooth rotation
  function updateRotation() {
    rotationX += (targetRotationX - rotationX) * 0.05;
    rotationY += (targetRotationY - rotationY) * 0.05;

    camera.position.x =
      Math.sin(rotationY) * Math.cos(rotationX) * radius;
    
    // Calculate camera height and ensure it never goes below ground (y = 0.5 minimum)
    const calculatedY = Math.sin(rotationX) * radius + 5;
    camera.position.y = Math.max(0.5, calculatedY);
    
    camera.position.z =
      Math.cos(rotationY) * Math.cos(rotationX) * radius;
    camera.lookAt(0, 2, 0);

    requestAnimationFrame(updateRotation);
  }
  updateRotation();

  // Zoom with mouse wheel
  renderer.domElement.addEventListener("wheel", (e) => {
    radius += e.deltaY * 0.01;
    radius = Math.max(5, Math.min(50, radius));
  });
}

function addEventListeners() {
  console.log("🎛️ Setting up event listeners...");
  
  // Color input changes
  const wallsColorEl = document.getElementById("walls-color");
  if (wallsColorEl) {
    console.log("✅ Walls color input found, adding listener");
    wallsColorEl.addEventListener("input", (e) => {
      console.log("🎨 Walls color changed to:", e.target.value);
      updatePartColor("walls", e.target.value);
      const previewEl = document.getElementById("walls-preview");
      if (previewEl) previewEl.textContent = e.target.value;
    });
  } else {
    console.error("❌ Walls color input not found!");
  }

  const roofColorEl = document.getElementById("roof-color");
  if (roofColorEl) {
    console.log("✅ Roof color input found, adding listener");
    roofColorEl.addEventListener("input", (e) => {
      console.log("🎨 Roof color changed to:", e.target.value);
      updatePartColor("roof", e.target.value);
      const previewEl = document.getElementById("roof-preview");
      if (previewEl) previewEl.textContent = e.target.value;
    });
  }

  const doorsColorEl = document.getElementById("doors-color");
  if (doorsColorEl) {
    console.log("✅ Doors color input found, adding listener");
    doorsColorEl.addEventListener("input", (e) => {
      console.log("🎨 Doors color changed to:", e.target.value);
      updatePartColor("doors", e.target.value);
      const previewEl = document.getElementById("doors-preview");
      if (previewEl) previewEl.textContent = e.target.value;
    });
  }

  const windowsColorEl = document.getElementById("windows-color");
  if (windowsColorEl) {
    console.log("✅ Windows color input found, adding listener");
    windowsColorEl.addEventListener("input", (e) => {
      console.log("🎨 Windows color changed to:", e.target.value);
      updatePartColor("windows", e.target.value);
      const previewEl = document.getElementById("windows-preview");
      if (previewEl) previewEl.textContent = e.target.value;
    });
  }

  // Preset color clicks
  document.querySelectorAll(".preset-color").forEach((preset) => {
    preset.addEventListener("click", (e) => {
      const target = e.target.dataset.target;
      const color = e.target.dataset.color;

      document.getElementById(`${target}-color`).value = color;
      document.getElementById(`${target}-preview`).textContent = color;
      updatePartColor(target, color);
    });
  });

  // File path input
  document.getElementById("load-model").addEventListener("click", () => {
    modelPath = document.getElementById("file-path").value;

    // Remove existing model
    if (houseModel) {
      scene.remove(houseModel);
    }

    // Show loading screen
    document.getElementById("loading").style.display = "block";
    document.getElementById("controls").style.display = "none";
    document.getElementById("model-status").textContent =
      "Model: Loading...";

    // Load new model
    loadHouseModel();
  });

  // Window resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function animate() {
  requestAnimationFrame(animate);

  if (mixer) {
    mixer.update(0.016);
  }

  renderer.render(scene, camera);
}

// Initialize the scene
init();