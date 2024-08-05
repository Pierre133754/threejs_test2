import * as THREE from 'three'
import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, useGLTF } from '@react-three/drei'
import { BallCollider, CuboidCollider, Physics, RigidBody } from '@react-three/rapier'

function Walls() {
  const { width, height } = useThree((state) => state.viewport)

  return (
    <>
      <RigidBody position={[0, (-height / 2) - 0.3, 0]} type='fixed'>
        <mesh>
          <boxGeometry args={[width*10, 1, 1]}/>
          <meshBasicMaterial color='green' transparent={true} opacity={0} />
        </mesh>
      </RigidBody>
      <RigidBody position={[(-width / 2) - 0.4, 0, 0]} type='fixed'>
        <mesh>
          <boxGeometry args={[1, height * 10, 1]}/>
          <meshBasicMaterial color='green' transparent={true} opacity={0} />
        </mesh>
      </RigidBody>
      <RigidBody position={[(width / 2) + 0.4, 0, 0]} type='fixed'>
        <mesh>
          <boxGeometry args={[1, height * 100, 1]}/>
          <meshBasicMaterial color='green' transparent={true} opacity={0} />
        </mesh>
      </RigidBody>
    </>
  )
}

function Apol({ y }) {
  const { width, height } = useThree((state) => state.viewport)
  const { nodes, materials } = useGLTF('./untitled-v1-transformed.glb')

  const ref = useRef()
  const [data] = useState({
    x: THREE.MathUtils.randFloatSpread(2)*(width/2)
  })

  return (
    <RigidBody enabledTranslations={[true, true, false]} colliders={false} ref={ref} position={[data.x, y, 0]} >
      <BallCollider args={[0.48]} />
      <mesh 
      geometry={nodes.Apol001.geometry} 
      material={materials.skin} 
      scale={[0.522/2, 0.811/2, 0.85/2]} 
      material-emissive='red' 
      onClick={() => {
        ref.current.applyImpulse({ x: 0, y: 4, z: 0 }, true)
      }}
    />
    </RigidBody>
  )
}

export default function App() {
  return (
    <Canvas >
      <color attach='background' args={['#ffbf40']} />
      <spotLight position={[5, 5, 5]} intensity={200} />
      <Suspense fallback={null} >
        <Physics>
          {
            Array.from({ length:10 }, (v,i) => (
              <Apol key={i} y={i*10}/>
            ))
          }
          <Walls />
        </Physics>
      </Suspense>
    </Canvas>
  )
}
