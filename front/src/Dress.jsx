import React, { useRef, useEffect,useState } from 'react';
import { useLoader, useThree, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Box3, Vector3, CanvasTexture } from 'three';
import { useParams, useLocation } from "react-router-dom";

function Dress({ color, canvasRef }) {
      const [bgImage, setBgImage] = useState(null);
      const { name } = useParams();
  const location = useLocation();
  const items = location.state;
    useEffect(() => {
      setBgImage(items.image);},[items])
  const gltf = useLoader(GLTFLoader, "/tshirt.glb");
  const ref = useRef();
  const { camera } = useThree();
  const textureRef = useRef(null);

  useEffect(() => {
    if (ref.current) {
      const box = new Box3().setFromObject(ref.current);
      const center = new Vector3();
      const size = new Vector3();
      box.getCenter(center);
      box.getSize(size);
      ref.current.position.sub(center);

      const maxDim = Math.max(size.x, size.y, size.z);
      const cameraZ = maxDim * 2;
      camera.position.set(0, 0, cameraZ);
      camera.lookAt(0, 0, 0);
    }
  }, [gltf, camera]);

  useEffect(() => {
    if (canvasRef.current) {
      textureRef.current = new CanvasTexture(canvasRef.current);
    }
  }, [canvasRef]);

  useFrame(() => {
    if (textureRef.current) {
      textureRef.current.needsUpdate = true;
    }
  });

  useEffect(() => {
    if (ref.current && textureRef.current) {
      ref.current.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.color.set(color);
          child.material.map = textureRef.current;
          child.material.needsUpdate = true;
        }
      });
    }
  }, [color]);

  return <primitive ref={ref} object={gltf.scene} scale={[0.1, 0.1, 0.1]} />;
}

export default Dress;
