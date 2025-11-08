import { Canvas, useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { forwardRef, useImperativeHandle, useRef } from "react";

export interface HRAvatarHandle {
  speakAnimation: (duration?: number) => void;
}

const HRInner = ({ speaking }: { speaking: boolean }) => {
  const headRef = useRef<any>(null);
  const eyeL = useRef<any>(null);
  const eyeR = useRef<any>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (headRef.current) {
      headRef.current.rotation.x = Math.sin(t / 6) * 0.02;
      headRef.current.rotation.y = Math.sin(t / 8) * 0.02;
    }
    // idle blink
    const blink = Math.max(0, Math.sin(t * 2) * 0.5 + 0.5);
    const scaleY = speaking ? 0.08 : 0.12 * (0.6 + 0.4 * blink);
    if (eyeL.current) eyeL.current.scale.y = scaleY;
    if (eyeR.current) eyeR.current.scale.y = scaleY;
  });

  return (
    <group>
      <mesh ref={headRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.7, 32, 24]} />
        <meshStandardMaterial color="#0b1020" metalness={0.2} roughness={0.3} emissive="#003449" emissiveIntensity={0.12} />
      </mesh>

      <mesh ref={eyeL} position={[-0.22, 0.18, 0.66]}> 
        <sphereGeometry args={[0.06, 12, 8]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      <mesh ref={eyeR} position={[0.22, 0.18, 0.66]}> 
        <sphereGeometry args={[0.06, 12, 8]} />
        <meshStandardMaterial color="#fff" />
      </mesh>

      {/* subtle chest glow */}
      <mesh position={[0, -0.9, 0]}> 
        <sphereGeometry args={[0.35, 24, 16]} />
        <meshStandardMaterial emissive="#00bfff" emissiveIntensity={0.08} color="#002431" transparent opacity={0.9} />
      </mesh>
    </group>
  );
};

export const HRAvatar = forwardRef<HRAvatarHandle, { isSpeaking: boolean }>(function HRAvatar(props, ref) {
  const localRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    speakAnimation(duration = 1200) {
      if (!localRef.current) return;
      const el = localRef.current;
      gsap.fromTo(el.rotation, { x: 0 }, { x: -0.08, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.inOut" });
      gsap.to(el.position, { y: 0.04, duration: duration / 1000, ease: "power1.inOut", yoyo: true, repeat: 1 });
    },
  }));

  return (
    <div className="w-full h-64 md:h-96 bg-gradient-to-b from-[#071127] to-transparent rounded-xl overflow-hidden">
      <Canvas camera={{ position: [0, 0, 3.4], fov: 35 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <group ref={localRef} position={[0, -0.15, 0]}>
          <HRInner speaking={props.isSpeaking} />
        </group>
      </Canvas>
    </div>
  );
});

export default HRAvatar;
