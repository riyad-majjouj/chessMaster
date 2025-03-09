
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import KnightModel from "./chess/KnightModel";
import { createRenderer, setupLighting, createEnvironmentMap } from "../utils/threeUtils";
import { useThreeInteraction } from "../hooks/useThreeInteraction";

const ChessScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sceneState, setSceneState] = useState<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    environmentMap: THREE.CubeTexture | null;
  }>({
    scene: null,
    camera: null,
    renderer: null,
    environmentMap: null
  });

  // Get the knight group reference - this will be populated by the KnightModel component
  const knightGroupRef = useRef<THREE.Group | null>(null);

  // Initialize the 3D scene
  useEffect(() => {
    if (!containerRef.current) return;

    // Set up scene
    const scene = new THREE.Scene();
    scene.background = null;

    const container = containerRef.current;
    const { width, height } = container.getBoundingClientRect();
    const aspect = width / height;

    // Set up camera
    const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.z = 5;

    // Set up renderer with optimized settings
    const renderer = createRenderer(container);
    container.appendChild(renderer.domElement);

    // Set up lighting
    setupLighting(scene);

    // Load environment map
    const environmentMap = createEnvironmentMap();
    scene.environment = environmentMap;

    // Update state with created objects
    setSceneState({
      scene,
      camera,
      renderer,
      environmentMap
    });

    // Clean up on unmount
    return () => {
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Set up the interaction handler
  useThreeInteraction({
    knightGroup: knightGroupRef.current,
    camera: sceneState.camera as THREE.PerspectiveCamera,
    renderer: sceneState.renderer as THREE.WebGLRenderer,
    scene: sceneState.scene as THREE.Scene,
    containerRef
  });

  return (
    <div ref={containerRef} className="w-full h-full">
      {sceneState.scene && sceneState.environmentMap && (
        <KnightModel 
          scene={sceneState.scene} 
          environmentMap={sceneState.environmentMap} 
        />
      )}
    </div>
  );
};

export default ChessScene;
