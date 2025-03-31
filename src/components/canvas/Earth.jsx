import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import { CanvasLoader } from "../Loader";

const Earth = () => {
  const earth = useGLTF("./planet/scene.gltf");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Add listener for changes to screen size
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    
    // Set initial value of isMobile state variable
    setIsMobile(mediaQuery.matches);
    
    // Define callback function for handling changes to media query
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };
    
    // Add callback function as listener for changes to media query
    mediaQuery.addEventListener("change", handleMediaQueryChange);
    
    // Remove listener when component is unmounted
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <primitive
      object={earth.scene}
      scale={isMobile ? 2.5 : 2.75}
      position-y={0}
      rotation-y={0}
    />
  );
};

const EarthCanvas = () => {
  return (
    <Canvas
      shadows
      frameloop="demand"
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-4, 3, 6],
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          autoRotate
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Earth />

        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default EarthCanvas;
