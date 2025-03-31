import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Decal,
  Float,
  OrbitControls,
  Preload,
  useTexture,
} from "@react-three/drei";

import CanvasLoader from "../Loader";

const Ball = (props) => {
  const [decal] = useTexture([props.imgUrl]);
  const meshRef = useRef();
  
  // Use less resource-intensive animation
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <Float speed={1.75} rotationIntensity={0.5} floatIntensity={0.5} floatingRange={[0.1, 0.2]}>
      <mesh ref={meshRef} castShadow={false} receiveShadow={false} scale={2.75}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#fff8eb"
          polygonOffset
          polygonOffsetFactor={-5}
          flatShading={false}
        />
        <Decal
          position={[0, 0, 1]}
          rotation={[2 * Math.PI, 0, 6.25]}
          scale={1}
          map={decal}
          flatShading={false}
        />
      </mesh>
    </Float>
  );
};

const BallCanvas = ({ icon }) => {
  // Create a ref to track if component is visible
  const containerRef = useRef();
  const [isVisible, setIsVisible] = React.useState(false);
  
  React.useEffect(() => {
    // Use IntersectionObserver to detect when ball is visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div className='w-28 h-28' ref={containerRef}>
      {isVisible && (
        <Canvas
          frameloop="demand"
          dpr={[1, 1.5]}
          gl={{ preserveDrawingBuffer: false, powerPreference: "high-performance" }}
        >
          <Suspense fallback={<CanvasLoader />}>
            <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
            <Ball imgUrl={icon} />
          </Suspense>

          <Preload all />
        </Canvas>
      )}
    </div>
  );
};

export default BallCanvas;
