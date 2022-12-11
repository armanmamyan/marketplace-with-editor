import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import Shoe from '../../assets/shoe-draco.glb'


const ModelLoader = ({layers, setLayers}) => {
  const modelRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  const { nodes, materials } = useGLTF(Shoe);

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(e.object.material.name);
  };

  const handlePointerOut = (e) =>
    e.intersections.length === 0 && setHovered(null);
  const handlePointerMissed = () =>
    setLayers((prevState) => ({ ...prevState, current: null }));

  const handlePointerDown = (e) => {
    e.stopPropagation();
    setLayers((prevState) => ({
      ...prevState,
      current: e.object.material.name,
    }));
  };

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();
    modelRef.current.rotation.z = -0.2 - (1 + Math.sin(elapsedTime / 1.5)) / 10;
    modelRef.current.position.y = (1 + Math.sin(elapsedTime / 1.5)) / 10;
  });

  return (
    <>
      <Perf position="top-left" />
      <OrbitControls makeDefault />
      <group
          ref={modelRef}
          dispose={null}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          onPointerMissed={handlePointerMissed}
          onPointerDown={handlePointerDown}
        >
          <mesh
            geometry={nodes.shoe.geometry}
            material={materials.laces}
            material-color={layers.items.laces}
          />
          <mesh
            geometry={nodes.shoe_1.geometry}
            material={materials.mesh}
            material-color={layers.items.mesh}
          />
          <mesh
            geometry={nodes.shoe_2.geometry}
            material={materials.caps}
            material-color={layers.items.caps}
          />
          <mesh
            geometry={nodes.shoe_3.geometry}
            material={materials.inner}
            material-color={layers.items.inner}
          />
          <mesh
            geometry={nodes.shoe_4.geometry}
            material={materials.sole}
            material-color={layers.items.sole}
          />
          <mesh
            geometry={nodes.shoe_5.geometry}
            material={materials.stripes}
            material-color={layers.items.stripes}
          />
          <mesh
            geometry={nodes.shoe_6.geometry}
            material={materials.band}
            material-color={layers.items.band}
          />
          <mesh
            geometry={nodes.shoe_7.geometry}
            material={materials.patch}
            material-color={layers.items.patch}
          />
        </group>
    </>
  );
};

useGLTF.preload(Shoe);

export default ModelLoader;
