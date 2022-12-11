import { Canvas } from "@react-three/fiber";
import {Environment} from '@react-three/drei';

const CanvasContainer = ({children}) => (
  <Canvas
      shadows
      camera={{
        fov: 45,
        near: 0.01,
        far: 200,
        position: [0,0,3]
      }}
    >
      <ambientLight intensity={0.5} />
      <spotLight intensity={0.4} angle={0.1} penumbra={1} position={[5, 25, 20]} />
      {children}
      <Environment
        background
        preset="lobby"
        />
    </Canvas>
)

export default CanvasContainer