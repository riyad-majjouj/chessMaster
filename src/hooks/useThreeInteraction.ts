
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
  const clock = useRef<THREE.Clock>(new THREE.Clock());
  
  // Animation state with smoother transitions
  const rotationState = useRef({
    y: knightGroup ? knightGroup.rotation.y : Math.PI / 4,
    x: 0,
    z: 0,
    bobPhase: 0
  });

  useEffect(() => {
    if (!knightGroup || !containerRef.current) return;

    // Reset the clock
    clock.current.start();

    // Mouse movement handler with smoother interaction
    const handleMouseMove = (event: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      mouseRef.current = {
        x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((event.clientY - rect.top) / rect.height) * 2 + 1,
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
      
      const deltaTime = clock.current.getDelta();
      const elapsedTime = clock.current.getElapsedTime();
      
      // Smoothly update rotation based on mouse position
      rotationState.current.y += 0.3 * deltaTime; // Constant slow rotation
      
      // Calculate target rotations based on mouse position with limits
      const targetX = mouseRef.current.y * 0.3; // Limited tilt
      const targetZ = mouseRef.current.x * 0.15; // Limited tilt
      
      // Apply spring physics for smoother, more natural movement
      knightGroup.rotation.y += (rotationState.current.y - knightGroup.rotation.y) * (1.5 * deltaTime);
      knightGroup.rotation.x += (targetX - knightGroup.rotation.x) * (2 * deltaTime);
      knightGroup.rotation.z += (targetZ - knightGroup.rotation.z) * (2 * deltaTime);
      
      // Add more complex floating animation with subtle sway
      rotationState.current.bobPhase += deltaTime;
      const floatY = Math.sin(elapsedTime * 0.8) * 0.05;
      const swayX = Math.sin(elapsedTime * 0.4) * 0.01;
      const swayZ = Math.cos(elapsedTime * 0.5) * 0.01;
      
      knightGroup.position.y = -1 + floatY;
      knightGroup.position.x = swayX;
      knightGroup.position.z = swayZ;

      // Add subtle breathing-like scale animation
      const breathScale = 1.0 + Math.sin(elapsedTime * 1.2) * 0.01;
      knightGroup.scale.set(0.8 * breathScale, 0.8 * breathScale, 0.8 * breathScale);

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
      clock.current.stop();
      
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [knightGroup, camera, renderer, scene, containerRef]);
};
