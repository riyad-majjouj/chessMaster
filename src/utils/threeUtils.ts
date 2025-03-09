
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
  
  return renderer;
};

/**
 * Sets up lighting for a three.js scene
 */
export const setupLighting = (scene: THREE.Scene): void => {
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0x404040, 3);
  scene.add(ambientLight);

  // Main directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
  directionalLight.position.set(1, 1, 1);
  directionalLight.castShadow = true;
  
  // Optimize shadow map
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  
  scene.add(directionalLight);

  // Rim light for better depth
  const rimLight = new THREE.DirectionalLight(0x6e59a5, 2);
  rimLight.position.set(-1, 1, -1);
  scene.add(rimLight);
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
