
import { useRef, useEffect } from "react";
import * as THREE from "three";

interface MouseState {
  x: number;
  y: number;
}

interface ThreeInteractionProps {
  knightGroup: THREE.Group | null;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const useThreeInteraction = ({
  knightGroup,
  camera,
  renderer,
  scene,
  containerRef
}: ThreeInteractionProps) => {
  const mouseRef = useRef<MouseState>({ x: 0, y: 0 });
  const animationFrameId = useRef<number | null>(null);
  
  // Animation state
  const rotationState = useRef({
    y: knightGroup ? knightGroup.rotation.y : Math.PI / 4,
    x: 0,
    z: 0
  });

  useEffect(() => {
    if (!knightGroup || !containerRef.current) return;

    // Mouse movement handler with smoother interaction
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
    };

    // Handle resize for responsive canvas
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      
      const { width, height } = containerRef.current.getBoundingClientRect();
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    // Animation loop with smoother transitions
    const animate = () => {
      if (!knightGroup) return;
      
      // Smoothly update rotation based on mouse position
      rotationState.current.y += 0.003; // Constant slow rotation
      rotationState.current.x = mouseRef.current.y * 0.2;
      rotationState.current.z = mouseRef.current.x * 0.1;

      // Apply easing to rotation - smoother animation
      knightGroup.rotation.y += (rotationState.current.y - knightGroup.rotation.y) * 0.03;
      knightGroup.rotation.x += (rotationState.current.x - knightGroup.rotation.x) * 0.03;
      knightGroup.rotation.z += (rotationState.current.z - knightGroup.rotation.z) * 0.03;
      
      // Add subtle floating animation
      knightGroup.position.y = -1 + Math.sin(Date.now() * 0.0008) * 0.05;

      // Render scene - using low-level rendering for better performance
      renderer.render(scene, camera);
      
      // RAF with memory leak prevention
      animationFrameId.current = requestAnimationFrame(animate);
    };

    // Set up event listeners
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);
    
    // Start animation loop
    animate();

    // Clean up resources on unmount
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [knightGroup, camera, renderer, scene, containerRef]);
};
