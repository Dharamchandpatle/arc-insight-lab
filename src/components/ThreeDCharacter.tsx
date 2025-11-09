import React, { useEffect, useRef } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

interface ThreeDCharacterProps {
  url: string;
  mouthLevel?: number; // 0..1
  isSpeaking?: boolean;
  position?: [number, number, number];
  scale?: number;
}

export const ThreeDCharacter: React.FC<ThreeDCharacterProps> = ({ url, mouthLevel = 0, isSpeaking = false, position = [0, 0, 0], scale = 1 }) => {
  const gltf = useLoader(GLTFLoader, url) as any;
  const group = useRef<THREE.Group | null>(null);

  // detect morph targets
  useEffect(() => {
    if (!gltf) return;
    // ensure scene has cast/receive
    gltf.scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [gltf]);

  // animate mouth via morphTargetInfluences if present
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (!group.current) return;
    // idle breathing & subtle head bob
    group.current.rotation.y = Math.sin(t / 4) * 0.06;
    group.current.position.y = Math.sin(t * 0.8) * 0.02;

    // apply mouth morphs
    gltf.scene.traverse((child: any) => {
      if (child.isMesh && child.morphTargetInfluences) {
        // map mouthLevel to first morph target
        const base = child.morphTargetInfluences[0] || 0;
        const target = Math.max(0, Math.min(1, mouthLevel));
        // smooth approach
        child.morphTargetInfluences[0] += (target - (child.morphTargetInfluences[0] || 0)) * Math.min(1, delta * 8);
      }
    });
  });

  return (
    <group ref={group} position={position} scale={scale}>
      <primitive object={gltf.scene} />
    </group>
  );
};

export default ThreeDCharacter;
