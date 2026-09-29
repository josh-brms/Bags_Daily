import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Float, MeshDistortMaterial, Sparkles } from '@react-three/drei'
import { markThreeReady } from '@/lib/loadSignals'

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

  // Sits behind everything at z = -4. It was previously at z = 0, which meant it
  // occluded every shape with a negative z — the scene rendered as a flat wash.
  // Scaled 2.2x (not 1.3x) to still cover the viewport from further away.
  return (
    <mesh position={[0, 0, -4]} scale={[viewport.width * 2.2, viewport.height * 2.2, 1]}>
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
  const { viewport } = useThree()

  // The vertical fov is fixed, so on narrow viewports the horizontal frustum collapses —
  // at z = 2 a 390px phone only sees about ±0.76 world units. Pull the layout inward so
  // mobile is not an empty background.
  const xScale = THREE.MathUtils.clamp(viewport.width / 4, 0.42, 1)

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
    // Kept deliberately shallow. At 0.5 rad the whole group swung ~29°, which
    // walked the shapes across the fixed page and parked them behind body copy —
    // the 3D is a fixed background, so any large swing ends up over text.
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      pointer.current.x * 0.2,
      2.5,
      delta
    )
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      -pointer.current.y * 0.12,
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

  // Sizes are tuned against the frustum: at z = 1.8 (distance 4.2) the visible frame
  // is ~3.5 units tall, so a torus of outer radius 0.43 reads as a distinct object at
  // roughly a quarter of the frame. Larger than that and it competes with the headline.
  return (
    <group ref={group} scale={[xScale, 1, 1]}>
      <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.9}>
        <mesh position={[-1.9, 0.9, 0.6]} rotation={[0.4, 0.2, 0]}>
          <torusGeometry args={[0.42, 0.13, 24, 64]} />
          <meshStandardMaterial
            color="#B4693A"
            roughness={0.22}
            metalness={0.15}
            emissive="#B4693A"
            emissiveIntensity={0.12}
          />
        </mesh>
      </Float>
      <Float speed={1.1} rotationIntensity={0.6} floatIntensity={1.1}>
        <mesh position={[2.1, 1.1, 1.2]}>
          <icosahedronGeometry args={[0.42, 0]} />
          <meshStandardMaterial
            color="#E8B4B8"
            roughness={0.35}
            emissive="#E8B4B8"
            emissiveIntensity={0.1}
            flatShading
          />
        </mesh>
      </Float>
      <Float speed={1.6} rotationIntensity={0.4} floatIntensity={0.8}>
        <mesh position={[-1.7, -0.95, 1.8]} rotation={[1.1, 0.3, 0.5]}>
          <torusGeometry args={[0.33, 0.1, 20, 56]} />
          <meshStandardMaterial
            color="#C4B1D4"
            roughness={0.3}
            emissive="#C4B1D4"
            emissiveIntensity={0.1}
          />
        </mesh>
      </Float>
      <Float speed={1.3} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[1.6, -1.0, 2.2]}>
          <icosahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial
            color="#8A5A3A"
            roughness={0.4}
            emissive="#8A5A3A"
            emissiveIntensity={0.08}
            flatShading
          />
        </mesh>
      </Float>
      <Float speed={1.8} rotationIntensity={0.35} floatIntensity={0.7}>
        <mesh position={[0.3, 1.6, 0.8]} rotation={[0.7, 0.4, 0.2]}>
          <torusGeometry args={[0.2, 0.07, 18, 48]} />
          <meshStandardMaterial
            color="#F2D9A0"
            roughness={0.28}
            emissive="#F2D9A0"
            emissiveIntensity={0.1}
          />
        </mesh>
      </Float>
    </group>
  )
}

/** A large, slowly deforming blob that gives the backdrop depth. */
function MorphBlob() {
  const mesh = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!mesh.current) return
    // Drift is kept small enough that the blob never crosses into the text column,
    // where it would wash out the headline.
    mesh.current.position.x = -2.7 + Math.sin(clock.elapsedTime * 0.11) * 0.5
    mesh.current.position.y = -1.0 + Math.cos(clock.elapsedTime * 0.09) * 0.8
  })

  return (
    <mesh ref={mesh} position={[-2.7, -1.0, 1.2]} scale={0.9}>
      <sphereGeometry args={[1, 40, 40]} />
      <MeshDistortMaterial
        color="#E8B4B8"
        roughness={0.9}
        metalness={0}
        transparent
        opacity={0.18}
        distort={0.5}
        speed={0.42}
      />
    </mesh>
  )
}

/** Fine drifting dust, parallaxed against the scroll. */
function Dust() {
  const group = useRef<THREE.Group>(null)
  const { viewport } = useThree()
  const xScale = THREE.MathUtils.clamp(viewport.width / 4, 0.42, 1)

  useEffect(() => {
    const onScroll = () => {
      if (group.current) group.current.position.y = window.scrollY * 0.0022
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <group ref={group} scale={[xScale, 1, 1]}>
      <Sparkles
        count={110}
        scale={[8, 5.5, 3]}
        position={[0, 0, 3.5]}
        size={4}
        speed={0.3}
        opacity={0.7}
        color="#B4693A"
      />
      <Sparkles
        count={70}
        scale={[6, 4, 2]}
        position={[0.8, -0.6, 2.2]}
        size={5}
        speed={0.2}
        opacity={0.5}
        color="#A38CBC"
      />
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
      onCreated={markThreeReady}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 5]} intensity={1.9} color="#fff1e2" />
      {/* Rim from behind-left and a soft fill, so the forms read against a pale backdrop. */}
      <directionalLight position={[-4, -2, -2]} intensity={1.1} color="#C4B1D4" />
      <directionalLight position={[2, -3, 3]} intensity={0.5} color="#E8B4B8" />
      <ShaderBackdrop />
      <MorphBlob />
      <Dust />
      <FloatingShapes />
    </Canvas>
  )
}
