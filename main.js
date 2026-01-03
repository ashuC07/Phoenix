// PHOENIX EPIC PRELOADER + ENGINE REV SOUND
window.addEventListener('load', () => {
  const loader = document.getElementById('phoenix-loader');
  const startupSound = document.getElementById('phoenix-startup-sound');

  // Play the sound at the perfect moment
  const playEpicSound = () => {
    startupSound.currentTime = 0;
    startupSound.volume = 0.6;
    startupSound.play().catch(() => {
      // Some browsers block autoplay until user interacts – we’ll trigger on first click
      document.body.addEventListener('click', () => startupSound.play(), { once: true });
    });
  };

  // Minimum dramatic time = 3.6 seconds (feels intentional)
  setTimeout(() => {
    playEpicSound();                    // Engine rev + flame whoosh
    loader.classList.add('loader-hidden');

    setTimeout(() => loader.remove(), 1500);
  }, 3600);
});
// Advanced Multi-Model Viewer with Shadows, Ground, Loading Spinner, Auto-Fit Camera, Animation Support

// -------------------------------------------------------------
// GLOBAL SETTINGS
// -------------------------------------------------------------
const MODEL_SCALE = 1.2;
const AUTO_ROTATE_SPEED = 1.0;
const DAMPING = 0.08;

// -------------------------------------------------------------
// HELPER: Create Loading Spinner
// -------------------------------------------------------------
function createLoader(container) {
    const loader = document.createElement("div");
    loader.className = "loader-spinner";
  loader.innerHTML = `
    <div class="spinner"></div>
    <p class="loader-text">Loading Model... <span class="loader-percent"></span></p>
  `;
    container.appendChild(loader);
    return loader;
}

// -------------------------------------------------------------
// HELPER: Auto-fit camera to model
// -------------------------------------------------------------
function fitCameraToModel(camera, model) {
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());

    camera.position.set(center.x + size/3, center.y + size/4, center.z + size/3);
    camera.lookAt(center);
}

// -------------------------------------------------------------
// SETUP VIEWER FUNCTION
// -------------------------------------------------------------
function setupViewer(containerId, modelPath, autoRotate = true) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Container not found:', containerId);
        return;
    }

    console.log('Setting up viewer for', containerId, 'with model', modelPath);

    const loaderUI = createLoader(container);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 2000);
    camera.position.set(0, 1.5, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = DAMPING;
    controls.rotateSpeed = 0.6;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = AUTO_ROTATE_SPEED;
    controls.enablePan = false;

    // Lights
    const hemi = new THREE.HemisphereLight(0xffffff, 0x000000, 0.6);
    scene.add(hemi);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    // Ground Plane
    const groundGeo = new THREE.PlaneGeometry(20, 20);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.3 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Load Model
    // Use LoadingManager to show progress / clearer errors
    const manager = new THREE.LoadingManager();
    manager.onStart = function (url, itemsLoaded, itemsTotal) {
      const percentEl = loaderUI.querySelector('.loader-percent');
      if (percentEl) percentEl.textContent = `0%`;
    };
    manager.onProgress = function (url, itemsLoaded, itemsTotal) {
      const percent = (itemsLoaded / itemsTotal) * 100;
      const percentEl = loaderUI.querySelector('.loader-percent');
      if (percentEl) percentEl.textContent = `${Math.round(percent)}%`;
    };
    manager.onLoad = function () {
      const percentEl = loaderUI.querySelector('.loader-percent');
      if (percentEl) percentEl.textContent = `100%`;
      setTimeout(() => loaderUI.remove(), 400);
    };
    manager.onError = function (url) {
      loaderUI.innerHTML = `<p style='color:#ff2a2a;'>Failed to load: ${url}</p>`;
      console.error('LoadingManager error, failed to load:', url);
    };

    const gltfLoader = new THREE.GLTFLoader(manager);
    let model;
    let mixer = null;

    gltfLoader.load(
      modelPath,
      function (gltf) {
        console.log('Model loaded successfully for', containerId);
        model = gltf.scene;
        model.scale.set(MODEL_SCALE, MODEL_SCALE, MODEL_SCALE);
        model.traverse(n => {
          if (n.isMesh) n.castShadow = true;
        });
        scene.add(model);

        fitCameraToModel(camera, model);

        // If model has animations
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          mixer.clipAction(gltf.animations[0]).play();
        }
      },
      // onProgress: this will be handled by LoadingManager but keep for extra logging
      function (xhr) {
        if (xhr && xhr.loaded && xhr.total) {
          const pct = Math.round((xhr.loaded / xhr.total) * 100);
          const percentEl = loaderUI.querySelector('.loader-percent');
          if (percentEl) percentEl.textContent = `${pct}%`;
        }
      },
      function (error) {
        console.error('Error loading model for', containerId, ':', error);
        loaderUI.innerHTML = `<p style='color:#ff2a2a;'>Failed to load model: ${error && error.message ? error.message : 'unknown'}</p>`;
        console.error('GLTFLoader error:', error);
      }
    );

    // Resize Handler
    window.addEventListener("resize", () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        if (mixer) mixer.update(0.01);
        renderer.render(scene, camera);
    }
    animate();
}

// PHOENIX AI POST-SALES SUPPORT CHATBOT – EXAM-READY

const toggle = document.getElementById('chatbot-toggle');
const win = document.getElementById('chatbot-window');
const body = document.getElementById('chat-body');
const input = document.getElementById('chat-input');
const send = document.querySelector('.send-btn');

toggle.onclick = () => win.style.display = win.style.display === 'flex' ? 'none' : 'flex';

// Premium message rendering with avatar and content
function add(text, type) {
  const div = document.createElement('div');
  div.className = `message ${type}`;
  // Avatar
  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  avatar.innerHTML = type === 'bot' ? '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="11" fill="#fff"/><path d="M11 6.5C12.3807 6.5 13.5 7.61929 13.5 9C13.5 10.3807 12.3807 11.5 11 11.5C9.61929 11.5 8.5 10.3807 8.5 9C8.5 7.61929 9.61929 6.5 11 6.5Z" fill="#ff2a2a"/><path d="M5.5 16.5C5.5 14.0147 7.51472 12 10 12H12C14.4853 12 16.5 14.0147 16.5 16.5V17C16.5 17.2761 16.2761 17.5 16 17.5H6C5.72386 17.5 5.5 17.2761 5.5 17V16.5Z" fill="#ff2a2a"/></svg>' : '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="11" fill="#222"/><path d="M11 6.5C12.3807 6.5 13.5 7.61929 13.5 9C13.5 10.3807 12.3807 11.5 11 11.5C9.61929 11.5 8.5 10.3807 8.5 9C8.5 7.61929 9.61929 6.5 11 6.5Z" fill="#ff2a2a"/><path d="M5.5 16.5C5.5 14.0147 7.51472 12 10 12H12C14.4853 12 16.5 14.0147 16.5 16.5V17C16.5 17.2761 16.2761 17.5 16 17.5H6C5.72386 17.5 5.5 17.2761 5.5 17V16.5Z" fill="#ff2a2a"/></svg>';
  // Message content
  const content = document.createElement('div');
  content.className = 'message-content';
  content.innerHTML = text.replace(/\n/g, '<br>');
  if (type === 'user') {
    div.appendChild(content);
    div.appendChild(avatar);
  } else {
    div.appendChild(avatar);
    div.appendChild(content);
  }
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

function reply(text) {
  setTimeout(() => add(text, 'bot'), 600 + Math.random() * 600);
}

function sendMessage() {
  let msg = input.value.trim();
  if (!msg) return;
  add(msg, 'user');
  input.value = '';

  const lower = msg.toLowerCase();

  // VIN Detection
  if (/[A-HJ-NPR-Z0-9]{17}/.test(msg.toUpperCase())) {
    reply(`<strong>VIN detected:</strong> ${msg.toUpperCase()}<br><br>
          Checking warranty status...<br><br>
          ✅ Active until: <strong>December 2028</strong><br>
          • 5-Year Powertrain: Covered<br>
          • 12-Month Bumper-to-Bumper: Covered<br><br>
          Want the full service history PDF?`);

  // Troubleshooting
  } else if (lower.includes('not starting') || lower.includes("won't start")) {
    reply(`Common no-start causes (in order):<br>
          1. Kill switch in OFF position<br>
          2. Battery voltage below 12.4V<br>
          3. Fuel valve OFF or clogged filter<br>
          4. Spark plug fouled<br><br>
          Which one matches your symptom?`);

  } else if (lower.includes('overheat') || lower.includes('hot')) {
    reply(`Overheating checklist:<br>
          • Coolant level low?<br>
          • Radiator fins clogged with mud?<br>
          • Fan not spinning?<br>
          • Running in high ambient temp + low speed?<br><br>
          Pro tip: Clean radiator after every mud ride!`);

  // Maintenance
  } else if (lower.includes('maintenance') || lower.includes('service') || lower.includes('oil')) {
    reply(`Phoenix Maintenance Schedule:<br><br>
          • Oil & Filter: Every 20 hours / 6 months<br>
          • Air Filter: Clean every ride, replace yearly<br>
          • Valve Check: Every 100 hours<br>
          • Spark Plug: Replace every 100 hours<br>
          • CVT Belt: Inspect every 50 hours<br><br>
          Want me to email you the full PDF checklist?`);

  // Service Booking
  } else if (lower.includes('book') || lower.includes('appointment') || lower.includes('service')) {
    reply(`Let’s book your service!<br><br>
          Please reply with:<br>
          • Your ATV model & year<br>
          • Preferred date/time<br>
          • ZIP code or city<br><br>
          I’ll confirm with the nearest dealer instantly.`);

  // Warranty
  } else if (lower.includes('warranty')) {
    reply(`Phoenix Warranty Coverage:<br><br>
          • 5 Years / Unlimited Miles – Powertrain<br>
          • 12 Months – Parts & Labor<br>
          • Frame: Lifetime to original owner<br><br>
          Enter your 17-digit VIN above to check exact status.`);

  // Parts
  } else if (lower.includes('part') || lower.includes('accessory')) {
    reply(`Popular parts in stock:<br>
          • Winch Kit: $379<br>
          • 30" LED Light Bar: $249<br>
          • Aluminum Roof: $499<br>
          • Snow Plow Kit: $899<br><br>
          Tell me your model and what you need!`);

  // Manual
  } else if (lower.includes('manual') || lower.includes('owner')) {
    reply(`I have your owner’s manual ready!<br><br>
          Reply with your model (e.g., 1000 Inferno 2025) and I’ll send the exact PDF or answer any page directly.`);

  // Default
  } else {
    reply(`I’m here for all post-sales support.<br><br>
          Try asking about:<br>
          • “My ATV won’t start”<br>
          • “When to change oil”<br>
          • “Book a service”<br>
          • “Check warranty” + your VIN<br><br>
          Or just describe your issue!`);
  }
}

input.addEventListener('keypress', e => e.key === 'Enter' && sendMessage());
send.addEventListener('click', sendMessage);

// Change send button to paper plane icon
send.innerHTML = '<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 23.5L23.5 13L2.5 2.5L2.5 10.5L17 13L2.5 15.5L2.5 23.5Z" fill="white"/></svg>';
// Function to show selected pack
function showPack(packId) {
    // Hide all pack containers
    const packs = document.querySelectorAll('.pack-container');
    packs.forEach(pack => pack.classList.remove('active'));

    // Remove active class from all tab buttons
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => button.classList.remove('active'));

    // Show selected pack
    document.getElementById(packId).classList.add('active');

    // Add active class to clicked button
    event.target.classList.add('active');
}
// -------------------------------------------------------------
// INITIALIZE ALL  VIEWERS
// -------------------------------------------------------------
setupViewer("model-viewer-3", "assets/apex.glb", true);
setupViewer("model-viewer-4", "assets/sisadrex.glb", true);