// kinya luga haru dekhauna lai canvas ho yo chai
import React from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
function Luga({ URL, position = [0, 0, 0] }) {
  const gltf = useLoader(GLTFLoader, URL);
  return (
    <primitive
      object={gltf.scene}
      scale={[0.03, 0.03, 0.03]}
      position={position}
      rotation={[0, -1.4, 0]}
    />
  );
}
export default Luga;