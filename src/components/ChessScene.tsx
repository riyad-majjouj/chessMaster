
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const ChessScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

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

    // Set up renderer with better quality
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const rimLight = new THREE.DirectionalLight(0x6e59a5, 2);
    rimLight.position.set(-1, 1, -1);
    scene.add(rimLight);

    // Create a better knight chess piece
    const knightGroup = new THREE.Group();

    // Base
    const baseGeometry = new THREE.CylinderGeometry(1, 1.2, 0.3, 16);
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.8,
      roughness: 0.2,
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.castShadow = true;
    base.receiveShadow = true;
    knightGroup.add(base);

    // Middle piece
    const middleGeometry = new THREE.CylinderGeometry(0.8, 1, 0.7, 16);
    const middleMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.8,
      roughness: 0.2,
    });
    const middle = new THREE.Mesh(middleGeometry, middleMaterial);
    middle.position.y = 0.5;
    middle.castShadow = true;
    middle.receiveShadow = true;
    knightGroup.add(middle);

    // Knight head
    const headGeometry = new THREE.SphereGeometry(0.7, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const headMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.8,
      roughness: 0.2,
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.rotation.x = Math.PI;
    head.position.y = 1.1;
    head.castShadow = true;
    head.receiveShadow = true;
    knightGroup.add(head);

    // Knight's mane
    const maneGeometry = new THREE.ConeGeometry(0.4, 0.8, 16);
    const maneMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.7,
      roughness: 0.3,
    });
    const mane = new THREE.Mesh(maneGeometry, maneMaterial);
    mane.position.set(0, 1.1, -0.5);
    mane.rotation.x = Math.PI / 2.5;
    mane.castShadow = true;
    mane.receiveShadow = true;
    knightGroup.add(mane);

    // Knight's ears
    const earGeometry = new THREE.ConeGeometry(0.15, 0.4, 8);
    const earMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.7,
      roughness: 0.3,
    });
    
    const leftEar = new THREE.Mesh(earGeometry, earMaterial);
    leftEar.position.set(-0.3, 1.5, 0);
    leftEar.rotation.z = -Math.PI / 12;
    leftEar.castShadow = true;
    leftEar.receiveShadow = true;
    knightGroup.add(leftEar);
    
    const rightEar = new THREE.Mesh(earGeometry, earMaterial);
    rightEar.position.set(0.3, 1.5, 0);
    rightEar.rotation.z = Math.PI / 12;
    rightEar.castShadow = true;
    rightEar.receiveShadow = true;
    knightGroup.add(rightEar);

    // Add some reflections with environment map
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    const environmentMap = cubeTextureLoader.load([
      '/assets/envmap/px.png',
      '/assets/envmap/nx.png',
      '/assets/envmap/py.png',
      '/assets/envmap/ny.png',
      '/assets/envmap/pz.png',
      '/assets/envmap/nz.png',
    ]);
    
    // Apply environment map
    scene.environment = environmentMap;
    baseMaterial.envMap = environmentMap;
    baseMaterial.envMapIntensity = 0.5;
    middleMaterial.envMap = environmentMap;
    middleMaterial.envMapIntensity = 0.5;
    headMaterial.envMap = environmentMap;
    headMaterial.envMapIntensity = 0.5;
    maneMaterial.envMap = environmentMap;
    maneMaterial.envMapIntensity = 0.5;
    earMaterial.envMap = environmentMap;
    earMaterial.envMapIntensity = 0.5;

    // Add the knight to the scene
    knightGroup.scale.set(0.8, 0.8, 0.8);
    knightGroup.position.y = -1;
    knightGroup.rotation.y = Math.PI / 4; // Initial rotation
    scene.add(knightGroup);

    // Mouse movement handler with smoother interaction
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const { width, height } = containerRef.current.getBoundingClientRect();
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Animation loop with smoother transitions
    let targetRotationY = knightGroup.rotation.y;
    let targetRotationX = knightGroup.rotation.x;
    let targetRotationZ = knightGroup.rotation.z;
    
    const animate = () => {
      requestAnimationFrame(animate);

      // Smoothly update rotation based on mouse position
      targetRotationY += 0.003; // Constant slow rotation
      targetRotationX = mouseRef.current.y * 0.2;
      targetRotationZ = mouseRef.current.x * 0.1;

      // Apply easing to rotation
      knightGroup.rotation.y += (targetRotationY - knightGroup.rotation.y) * 0.05;
      knightGroup.rotation.x += (targetRotationX - knightGroup.rotation.x) * 0.05;
      knightGroup.rotation.z += (targetRotationZ - knightGroup.rotation.z) * 0.05;
      
      // Add subtle floating animation
      knightGroup.position.y = -1 + Math.sin(Date.now() * 0.001) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Clean up
    return () => {
      if (containerRef.current) {
        if (containerRef.current.contains(renderer.domElement)) {
          containerRef.current.removeChild(renderer.domElement);
        }
      }
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default ChessScene;
