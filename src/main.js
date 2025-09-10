import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

let scene, camera, renderer, house, mixer;
let houseModel = null;
let houseParts = {
  walls: [],
  roof: [],
  doors: [],
  windows: [],
  other: [],
};

// File path for the FBX model
let modelPath = "/models/Cottage_FREE.fbx";

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

      // Categorize parts based on name
      const name = child.name.toLowerCase();
      const partItem = document.createElement("div");
      partItem.className = "part-item";
      partItem.textContent = child.name || "Unnamed Part";

      if (
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
}

function updatePartColor(partType, color) {
  const parts = houseParts[partType];
  const colorObj = new THREE.Color(color);

  parts.forEach((part) => {
    if (part.material) {
      if (Array.isArray(part.material)) {
        part.material.forEach((mat) => {
          mat.color = colorObj.clone();
        });
      } else {
        part.material.color = colorObj.clone();
      }
    }
  });
}

function updateAllColors() {
  updatePartColor("walls", document.getElementById("walls-color").value);
  updatePartColor("roof", document.getElementById("roof-color").value);
  updatePartColor("doors", document.getElementById("doors-color").value);
  updatePartColor(
    "windows",
    document.getElementById("windows-color").value
  );
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
      targetRotationX = Math.max(
        -Math.PI / 3,
        Math.min(Math.PI / 3, targetRotationX)
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
    camera.position.y = Math.sin(rotationX) * radius + 5;
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
  // Color input changes
  document
    .getElementById("walls-color")
    .addEventListener("input", (e) => {
      updatePartColor("walls", e.target.value);
      document.getElementById("walls-preview").textContent =
        e.target.value;
    });

  document.getElementById("roof-color").addEventListener("input", (e) => {
    updatePartColor("roof", e.target.value);
    document.getElementById("roof-preview").textContent = e.target.value;
  });

  document
    .getElementById("doors-color")
    .addEventListener("input", (e) => {
      updatePartColor("doors", e.target.value);
      document.getElementById("doors-preview").textContent =
        e.target.value;
    });

  document
    .getElementById("windows-color")
    .addEventListener("input", (e) => {
      updatePartColor("windows", e.target.value);
      document.getElementById("windows-preview").textContent =
        e.target.value;
    });

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