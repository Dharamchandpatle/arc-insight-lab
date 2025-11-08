import { Canvas, useFrame } from "@react-three/fiber";
import gsap from "gsap";
import React, { useEffect, useRef } from "react";
import { Mesh } from "three";

interface CandidateAvatarProps {
  mouthPower: number; // 0..1
}

function Head({ mouthPower }: { mouthPower: number }) {
  const jawRef = useRef<Mesh | null>(null);

  useFrame(() => {
    if (!jawRef.current) return;
    // smooth target
    const t = 0.2 + mouthPower * 0.8;
    jawRef.current.scale.y += (t - jawRef.current.scale.y) * 0.25;
  });

  useEffect(() => {
    const el = jawRef.current;
    if (!el) return;
    const id = setInterval(() => {
      gsap.to(el.scale, { y: 0.25 + mouthPower * 1.1, duration: 0.25, ease: "power2.out" });
    }, 60);
    return () => clearInterval(id);
  }, [mouthPower]);

  return (
    <group>
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.7, 32, 24]} />
        <meshStandardMaterial color="#0ea5e9" metalness={0.2} roughness={0.3} emissive="#042c3b" emissiveIntensity={0.2} />
      </mesh>

      {/* jaw */}
      <mesh ref={jawRef} position={[0, -0.35, 0.45]} scale={[1, 0.25, 0.8]}>
        <boxGeometry args={[0.6, 0.25, 0.4]} />
        <meshStandardMaterial color="#06283d" metalness={0.1} roughness={0.6} />
      </mesh>

      {/* eyes */}
      <mesh position={[-0.22, 0.18, 0.66]}> 
        <sphereGeometry args={[0.07, 16, 12]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      <mesh position={[0.22, 0.18, 0.66]}> 
        <sphereGeometry args={[0.07, 16, 12]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
    </group>
  );
}

export const CandidateAvatar: React.FC<CandidateAvatarProps> = ({ mouthPower }) => {
  return (
    <div className="w-full h-64 md:h-96 bg-gradient-to-b from-[#071127] to-transparent rounded-xl overflow-hidden">
      <Canvas camera={{ position: [0, 0, 3.2], fov: 35 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} />
        <pointLight position={[-5, -3, -2]} color="#00bfff" intensity={0.25} />
        <group position={[0, -0.3, 0]}>
          <Head mouthPower={mouthPower} />
        </group>
      </Canvas>
    </div>
  );
};

export default CandidateAvatar;
