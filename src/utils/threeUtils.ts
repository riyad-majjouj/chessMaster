
import * as THREE from "three";

/**
 * Creates and configures a WebGL renderer
 */
export const createRenderer = (container: HTMLDivElement): THREE.WebGLRenderer => {
  const { width, height } = container.getBoundingClientRect();
  
  const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true,
    powerPreference: "high-performance"
  });
  
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  
  return renderer;
};

/**
 * Sets up lighting for a three.js scene
 */
export const setupLighting = (scene: THREE.Scene): void => {
  // Ambient light - increased slightly for better base illumination
  const ambientLight = new THREE.AmbientLight(0x404040, 2.5);
  scene.add(ambientLight);

  // Main directional light with improved shadow settings
  const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
  directionalLight.position.set(2, 3, 2);
  directionalLight.castShadow = true;
  
  // Optimize shadow map
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  directionalLight.shadow.bias = -0.0001;
  directionalLight.shadow.normalBias = 0.02;
  
  scene.add(directionalLight);

  // Rim light for better depth - using purple for aesthetic effect
  const rimLight = new THREE.DirectionalLight(0x8B5CF6, 3); // Using vivid purple
  rimLight.position.set(-2, 1, -1);
  scene.add(rimLight);

  // Bottom fill light - subtle warm glow from below
  const fillLight = new THREE.PointLight(0xF97316, 1, 10); // Soft orange
  fillLight.position.set(0, -1, 2);
  scene.add(fillLight);
};

/**
 * Creates an environment map
 */
export const createEnvironmentMap = (): THREE.CubeTexture => {
  const cubeTextureLoader = new THREE.CubeTextureLoader();
  return cubeTextureLoader.load([
    '/assets/envmap/px.png',
    '/assets/envmap/nx.png',
    '/assets/envmap/py.png',
    '/assets/envmap/ny.png',
    '/assets/envmap/pz.png',
    '/assets/envmap/nz.png',
  ]);
};
