
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
 * Creates an environment map with fallback handling
 */
export const createEnvironmentMap = (): THREE.CubeTexture => {
  try {
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    
    // Create a simple procedural environment map as fallback
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    
    if (context) {
      // Create a simple gradient background
      const gradient = context.createLinearGradient(0, 0, 0, 256);
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(0.5, '#16213e');
      gradient.addColorStop(1, '#0f3460');
      
      context.fillStyle = gradient;
      context.fillRect(0, 0, 256, 256);
    }
    
    // Create cube texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.mapping = THREE.CubeReflectionMapping;
    
    // Create cube texture with simple colors as fallback
    const cubeTexture = new THREE.CubeTexture();
    const images = [];
    
    for (let i = 0; i < 6; i++) {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const context = canvas.getContext('2d');
      
      if (context) {
        const gradient = context.createLinearGradient(0, 0, 256, 256);
        gradient.addColorStop(0, '#2a2a4a');
        gradient.addColorStop(1, '#1a1a2e');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 256, 256);
      }
      
      images.push(canvas);
    }
    
    cubeTexture.image = images;
    cubeTexture.needsUpdate = true;
    
    console.log("Environment map created successfully with procedural fallback");
    return cubeTexture;
    
  } catch (error) {
    console.warn("Failed to create environment map, using minimal fallback", error);
    
    // Absolute minimal fallback
    const cubeTexture = new THREE.CubeTexture();
    cubeTexture.image = [null, null, null, null, null, null];
    return cubeTexture;
  }
};
