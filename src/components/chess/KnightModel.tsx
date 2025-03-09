
import React, { useRef, useEffect } from "react";
import * as THREE from "three";

interface KnightModelProps {
  scene: THREE.Scene;
  environmentMap: THREE.CubeTexture;
}

const KnightModel: React.FC<KnightModelProps> = ({ scene, environmentMap }) => {
  // Store references to meshes for animation
  const knightGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    // Create the knight group
    const knightGroup = new THREE.Group();
    knightGroupRef.current = knightGroup;

    // Enhanced materials with physical properties
    const createMaterial = (color = 0xf0f0f0, metalness = 0.7, roughness = 0.3) => {
      const material = new THREE.MeshPhysicalMaterial({
        color,
        metalness,
        roughness,
        envMap: environmentMap,
        envMapIntensity: 1.0,
        clearcoat: 0.3,
        clearcoatRoughness: 0.25,
        reflectivity: 1.0,
      });
      return material;
    };

    // Base of knight - more polished with golden accent
    const baseGeometry = new THREE.CylinderGeometry(1, 1.2, 0.3, 32);
    const baseMaterial = createMaterial(0xe6e6e6, 0.8, 0.2); // Shiny silver-white
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.castShadow = true;
    base.receiveShadow = true;
    
    // Add golden rim to base
    const rimGeometry = new THREE.TorusGeometry(1.0, 0.05, 16, 32);
    const rimMaterial = createMaterial(0xd4af37, 0.9, 0.1); // Gold material
    const rim = new THREE.Mesh(rimGeometry, rimMaterial);
    rim.position.y = 0.15;
    rim.rotation.x = Math.PI / 2;
    rim.castShadow = true;
    
    base.add(rim);
    knightGroup.add(base);

    // Middle column - higher polygon count for smoother edges
    const middleGeometry = new THREE.CylinderGeometry(0.8, 1, 0.7, 32);
    const middleMaterial = createMaterial(0xf5f5f5, 0.65, 0.35);
    const middle = new THREE.Mesh(middleGeometry, middleMaterial);
    middle.position.y = 0.5;
    middle.castShadow = true;
    middle.receiveShadow = true;
    knightGroup.add(middle);

    // Knight's body - increased segments for smoother surface
    const bodyGeometry = new THREE.CylinderGeometry(0.6, 0.8, 0.6, 32);
    const bodyMaterial = createMaterial(0xf8f8f8, 0.6, 0.4);
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1.1;
    body.castShadow = true;
    body.receiveShadow = true;
    knightGroup.add(body);

    // Knight head - higher polygon count
    const headGeometry = new THREE.SphereGeometry(0.45, 32, 32);
    const headMaterial = createMaterial(0xfafafa, 0.5, 0.5);
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.65;
    head.position.z = 0.1;
    head.scale.set(1, 1.2, 1.3);
    head.castShadow = true;
    head.receiveShadow = true;
    knightGroup.add(head);

    // Knight's neck/mane - smoother with higher segment count
    const neckGeometry = new THREE.CylinderGeometry(0.3, 0.5, 0.4, 24);
    const neckMaterial = createMaterial(0xf0f0f0, 0.55, 0.45);
    const neck = new THREE.Mesh(neckGeometry, neckMaterial);
    neck.position.set(0, 1.55, -0.2);
    neck.rotation.x = Math.PI / 4;
    neck.castShadow = true;
    neck.receiveShadow = true;
    knightGroup.add(neck);

    // Knight's ears - more detailed
    const earGeometry = new THREE.ConeGeometry(0.15, 0.3, 24);
    const earMaterial = createMaterial(0xf2f2f2, 0.5, 0.5);
    
    const leftEar = new THREE.Mesh(earGeometry, earMaterial);
    leftEar.position.set(-0.25, 1.9, 0);
    leftEar.rotation.z = -Math.PI / 12;
    leftEar.castShadow = true;
    leftEar.receiveShadow = true;
    knightGroup.add(leftEar);
    
    const rightEar = new THREE.Mesh(earGeometry, earMaterial);
    rightEar.position.set(0.25, 1.9, 0);
    rightEar.rotation.z = Math.PI / 12;
    rightEar.castShadow = true;
    rightEar.receiveShadow = true;
    knightGroup.add(rightEar);

    // Knight's nose 
    const noseGeometry = new THREE.CylinderGeometry(0.18, 0.25, 0.5, 24);
    const noseMaterial = createMaterial(0xf5f5f5, 0.5, 0.5);
    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.position.set(0, 1.6, 0.5);
    nose.rotation.x = Math.PI / 3;
    nose.castShadow = true;
    nose.receiveShadow = true;
    knightGroup.add(nose);

    // Add eyes
    const eyeGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const eyeMaterial = createMaterial(0x222222, 0.2, 0.8); // Dark, less reflective
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.2, 1.65, 0.35);
    knightGroup.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.2, 1.65, 0.35);
    knightGroup.add(rightEye);

    // Add mane details
    const maneGeometry = new THREE.BoxGeometry(0.05, 0.2, 0.05);
    const maneMaterial = createMaterial(0xe6e6e6, 0.5, 0.6);
    
    for (let i = 0; i < 8; i++) {
      const maneStrand = new THREE.Mesh(maneGeometry, maneMaterial);
      const angle = (i / 8) * Math.PI - Math.PI / 2;
      const radius = 0.4;
      maneStrand.position.set(
        Math.cos(angle) * radius,
        1.7,
        Math.sin(angle) * radius - 0.3
      );
      maneStrand.rotation.set(
        Math.random() * 0.2 - 0.1, 
        Math.random() * 0.2 - 0.1, 
        Math.random() * 0.4 - 0.2
      );
      knightGroup.add(maneStrand);
    }

    // Position and scale the knight
    knightGroup.scale.set(0.8, 0.8, 0.8);
    knightGroup.position.y = -1;
    knightGroup.rotation.y = Math.PI / 4; // Initial rotation
    
    // Add the knight to the scene
    scene.add(knightGroup);

    // Clean up on unmount
    return () => {
      if (knightGroup) {
        scene.remove(knightGroup);
        
        // Dispose of geometries and materials to free memory
        knightGroup.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }
    };
  }, [scene, environmentMap]);

  return null; // This is a logical component, doesn't render DOM elements
};

export default KnightModel;
