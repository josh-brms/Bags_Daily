import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Float } from '@react-three/drei'

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.08;

    vec3 top = vec3(0.980, 0.973, 0.965);
    vec3 warm = vec3(0.953, 0.937, 0.918);
    vec3 peach = vec3(0.957, 0.843, 0.729);
    vec3 clay = vec3(0.706, 0.412, 0.227);

    float d1 = distance(uv, vec2(0.20 + 0.06 * sin(t), 0.74 + 0.05 * cos(t * 1.3)));
    float d2 = distance(uv, vec2(0.82 + 0.05 * cos(t * 0.9), 0.22 + 0.06 * sin(t * 1.1)));
    float blob1 = smoothstep(0.58, 0.0, d1);
    float blob2 = smoothstep(0.62, 0.0, d2);

    vec3 col = mix(warm, top, uv.y);
    col = mix(col, peach, blob1 * 0.5);
    col = mix(col, clay, blob2 * 0.16);
    col *= 1.0 - 0.12 * distance(uv, vec2(0.5, 0.5));
    col += (hash(uv * 512.0) - 0.5) * 0.018;

    gl_FragColor = vec4(col, 1.0);
  }
`

function ShaderBackdrop() {
  const { viewport } = useThree()
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.elapsedTime
  })

  return (
    <mesh scale={[viewport.width * 1.3, viewport.height * 1.3, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}

function FloatingShapes() {
  const group = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (!group.current) return
    const targetY = state.pointer.x * 0.35
    const targetX = -state.pointer.y * 0.25
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      targetY,
      2.5,
      delta
    )
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      targetX,
      2.5,
      delta
    )
  })

  return (
    <group ref={group}>
      <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.9}>
        <mesh position={[-2.6, 1.15, -1.2]} rotation={[0.4, 0.2, 0]}>
          <torusGeometry args={[0.72, 0.26, 24, 64]} />
          <meshStandardMaterial color="#B4693A" roughness={0.35} metalness={0.05} />
        </mesh>
      </Float>
      <Float speed={1.1} rotationIntensity={0.6} floatIntensity={1.1}>
        <mesh position={[2.7, 1.5, -1.6]}>
          <icosahedronGeometry args={[0.62, 0]} />
          <meshStandardMaterial color="#d9c2bf" roughness={0.45} metalness={0.02} flatShading />
        </mesh>
      </Float>
      <Float speed={1.6} rotationIntensity={0.4} floatIntensity={0.8}>
        <mesh position={[2.2, -1.35, -0.8]} rotation={[1.1, 0.3, 0.5]}>
          <torusGeometry args={[0.5, 0.18, 20, 56]} />
          <meshStandardMaterial color="#e4dcd6" roughness={0.4} metalness={0.05} />
        </mesh>
      </Float>
      <Float speed={1.3} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[-2.2, -1.5, -1.4]}>
          <icosahedronGeometry args={[0.42, 0]} />
          <meshStandardMaterial color="#211D1B" roughness={0.5} flatShading />
        </mesh>
      </Float>
    </group>
  )
}

export default function HeroCanvas() {
  const wrapper = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const node = wrapper.current
    if (!node) return
    const io = new IntersectionObserver(
      entries => setVisible(entries[0]?.isIntersecting ?? true),
      { threshold: 0 }
    )
    io.observe(node)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrapper} className="absolute inset-0">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        frameloop={visible ? 'always' : 'never'}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <ambientLight intensity={0.75} />
        <directionalLight position={[3, 4, 5]} intensity={1.15} color="#ffe9d6" />
        <ShaderBackdrop />
        <FloatingShapes />
      </Canvas>
    </div>
  )
}
