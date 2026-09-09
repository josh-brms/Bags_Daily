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
    vec3 warm = vec3(0.949, 0.929, 0.906);
    vec3 peach = vec3(0.965, 0.827, 0.698);
    vec3 clay = vec3(0.706, 0.412, 0.227);
    vec3 rose = vec3(0.878, 0.718, 0.718);

    float d1 = distance(uv, vec2(0.18 + 0.07 * sin(t), 0.76 + 0.05 * cos(t * 1.3)));
    float d2 = distance(uv, vec2(0.84 + 0.05 * cos(t * 0.9), 0.24 + 0.06 * sin(t * 1.1)));
    float d3 = distance(uv, vec2(0.55 + 0.08 * sin(t * 0.7), 0.9 + 0.04 * sin(t * 1.6)));
    float blob1 = smoothstep(0.6, 0.0, d1);
    float blob2 = smoothstep(0.64, 0.0, d2);
    float blob3 = smoothstep(0.55, 0.0, d3);

    vec3 col = mix(warm, top, uv.y);
    col = mix(col, peach, blob1 * 0.55);
    col = mix(col, clay, blob2 * 0.2);
    col = mix(col, rose, blob3 * 0.3);
    col *= 1.0 - 0.1 * distance(uv, vec2(0.5, 0.5));
    col += (hash(uv * 512.0) - 0.5) * 0.016;

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
  const pointer = useRef({ x: 0, y: 0 })
  const scroll = useRef(0)

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    const onScroll = () => {
      scroll.current = window.scrollY
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useFrame((_, delta) => {
    if (!group.current) return
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      pointer.current.x * 0.32,
      2.5,
      delta
    )
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      -pointer.current.y * 0.22,
      2.5,
      delta
    )
    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      scroll.current * 0.0011,
      2,
      delta
    )
  })

  return (
    <group ref={group}>
      <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.9}>
        <mesh position={[-3.4, 1.35, -1.2]} rotation={[0.4, 0.2, 0]}>
          <torusGeometry args={[0.78, 0.28, 24, 64]} />
          <meshStandardMaterial color="#B4693A" roughness={0.3} metalness={0.1} />
        </mesh>
      </Float>
      <Float speed={1.1} rotationIntensity={0.6} floatIntensity={1.1}>
        <mesh position={[3.5, 1.7, -1.6]}>
          <icosahedronGeometry args={[0.68, 0]} />
          <meshStandardMaterial color="#d9c2bf" roughness={0.4} metalness={0.05} flatShading />
        </mesh>
      </Float>
      <Float speed={1.6} rotationIntensity={0.4} floatIntensity={0.8}>
        <mesh position={[2.9, -1.6, -0.8]} rotation={[1.1, 0.3, 0.5]}>
          <torusGeometry args={[0.55, 0.2, 20, 56]} />
          <meshStandardMaterial color="#e8ddd3" roughness={0.35} metalness={0.1} />
        </mesh>
      </Float>
      <Float speed={1.3} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[-2.9, -1.7, -1.4]}>
          <icosahedronGeometry args={[0.46, 0]} />
          <meshStandardMaterial color="#211D1B" roughness={0.5} flatShading />
        </mesh>
      </Float>
      <Float speed={1.8} rotationIntensity={0.35} floatIntensity={0.7}>
        <mesh position={[0.2, 2.2, -2.2]} rotation={[0.7, 0.4, 0.2]}>
          <torusGeometry args={[0.4, 0.14, 18, 48]} />
          <meshStandardMaterial color="#f2d7ba" roughness={0.35} metalness={0.08} />
        </mesh>
      </Float>
    </group>
  )
}

export default function AmbientCanvas() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      frameloop={visible ? 'always' : 'never'}
      gl={{ antialias: true, alpha: false, powerPreference: 'default' }}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} color="#ffe9d6" />
      <ShaderBackdrop />
      <FloatingShapes />
    </Canvas>
  )
}
