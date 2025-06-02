import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF, Stage } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import { Group } from 'three'

type Props = {
  modelPath: string
}

function Model({ modelPath }: Props) {
  const { scene } = useGLTF(modelPath)
  const modelRef = useRef<Group>(scene)

  // دوران مستمر
  useFrame((_, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.5 // سرعة الدوران
    }
  })

  return <primitive object={scene} ref={modelRef} />
}

export default function ModelScene() {
  return (
    <div className="w-full ml-10 h-[500px] bg-transparent rounded-xl overflow-hidden">
      <Canvas
        camera={{ position: [3, 2, 4], fov: 55 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true }}
      >
        <ambientLight intensity={0.2} />
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6} shadows={true}>
            <Model modelPath="/models/myModel.glb" />
          </Stage>
          <Environment preset="sunset" background={false} />
        </Suspense>
        <OrbitControls enablePan enableZoom enableRotate />
      </Canvas>
    </div>
  )
}

useGLTF.preload('/models/myModel.glb')
