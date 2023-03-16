import * as THREE from '../libs/three/three.module.js'
//import { OrbitControls } from './OrbitControls.js'
import * as dat from '../libs/lil-gui/lil-gui.esm.min.js'
import gsap from './gsap-public/esm/all.js'
import waterVertexShader from  "../shaders/vertex.js"
import waterFragmentShader from "../shaders/fragment.js"

/**
 * Debug
 */
// const gui = new dat.GUI()

const parameters = {
    meshColor: '#97a5ed'
}

const particleColors = [0x884b16, 0xf6e7da, 0xf6e7da, 0xf6e7da, 0xf48525, 0xf48525, 0xf48525, 0xf48525, 0xf48525, 0xe7ac79, 0xf48525, 0xf48525, 0xe7ac79, 0xe7ac79, 0xe7ac79, 0xd76909, 0xe7ac79, 0xe7ac79, 0x5a74f6]

// gui
//     .addColor(parameters, 'materialColor')
//     .onChange(() => {
//         material.color.set(parameters.materialColor)
//         particlesMaterial.color.set(parameters.materialColor)
//     })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
 const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    totalHeight: document.documentElement.scrollHeight
}

/**
 * Objects
 */

// Material

const material = new THREE.MeshPhysicalMaterial({
    color: parameters.meshColor,
    wireframe: true,
})

// Meshes

const objectsDistance = 4

// const mesh3 = new THREE.Mesh(
//     new THREE.BoxGeometry( 1.5, 1.5, 1.5, 2, 2, 2 ),
//     material
// )
const mesh3 = new THREE.Mesh(
    new THREE.TorusGeometry(0.8, 0.3, 16, 16),
    material
)
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)
const mesh1 = new THREE.Mesh(
    new THREE.TetrahedronGeometry(1, 4),
    material
)

mesh1.position.y = objectsDistance * -1.9
mesh2.position.y = objectsDistance * -3.1
mesh3.position.y = objectsDistance * -4.5

mesh1.position.x = -1.35
mesh2.position.x = -1.50
mesh3.position.x = -1.25

scene.add(mesh1, mesh2, mesh3)

const sectionMeshes = [ mesh1, mesh2, mesh3 ]

/**
 * Particles
 */

// Geometry 1
const particlesCount = 1000
const positions = new Float32Array(particlesCount * 3)
const colors = new Float32Array(particlesCount * 3)

for (let i = 0; i < particlesCount; i++) {
    const randomColor = new THREE.Color(particleColors[Math.floor(Math.random()*particleColors.length)])

    positions[i * 3 + 0] = (Math.random() - 0.5) * 30 // X
    positions[i * 3 + 1] = (Math.random() - 0.1) * 12 // Y
    positions[i * 3 + 2] = ((Math.random() - 1) * 25) - 10 // Z

    colors[i * 3 + 0] = randomColor.r
    colors[i * 3 + 1] = randomColor.g
    colors[i * 3 + 2] = randomColor.b
}

const particlesGeometry1 = new THREE.BufferGeometry()
particlesGeometry1.setAttribute("position", new THREE.BufferAttribute(positions, 3))
particlesGeometry1.setAttribute('color', new THREE.BufferAttribute(colors, 3))

// Geometry 2
const particlesCount2 = 200
const positions2 = new Float32Array(particlesCount2 * 3)
const colors2 = new Float32Array(particlesCount2 * 3)

for (let i = 0; i < particlesCount2; i++) {
    const randomColor = new THREE.Color(particleColors[Math.floor(Math.random()*particleColors.length)])

    positions2[i * 3 + 0] = (Math.random() - 0.5) * 20 // X
    positions2[i * 3 + 1] = (Math.random() - 0.2) * 100 // Y
    positions2[i * 3 + 2] = ((Math.random() - 1) * 8) - 8 // Z

    colors2[i * 3 + 0] = randomColor.r
    colors2[i * 3 + 1] = randomColor.g
    colors2[i * 3 + 2] = randomColor.b
}

const particlesGeometry2 = new THREE.BufferGeometry()
particlesGeometry2.setAttribute("position", new THREE.BufferAttribute(positions2, 3))
particlesGeometry2.setAttribute('color', new THREE.BufferAttribute(colors2, 3))

// Material

const particlesMaterial = new THREE.PointsMaterial({
    vertexColors: true,
    sizeAttenuation: true,
    size: 0.05
})

// Points

const particles1 = new THREE.Points(particlesGeometry1, particlesMaterial)
particles1.position.y = -2

const particles2 = new THREE.Points(particlesGeometry2, particlesMaterial)
particles2.position.x = 0
particles2.position.y = -20


scene.add(particles1, particles2)


/**
 * Lights
 */

const directionalLight = new THREE.DirectionalLight("#d76909", 0.8)
directionalLight.position.set(-3, 1, 3)

const ambientLight = new THREE.AmbientLight("#4e5166", 0.5)

scene.add(directionalLight, ambientLight)


window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */

// Group
// Scroll bude posouvat kameru
// Paralax bude hýbat skupinou
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true // Odstranění pozadí canvasu
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
 */

let scrollY = window.scrollY
let currentSection = 0

window.addEventListener("scroll", () => {
    scrollY = window.scrollY

    // const newSection = Math.round(scrollY / sizes.height)

    // if (newSection != currentSection) {
    //     currentSection = newSection

    //     gsap.to(
    //         sectionMeshes[currentSection].rotation, {
    //             duration: 1.5,
    //             ease: "power2.inOut",
    //             x: "+=6",
    //             y: "+=3",
    //             z: "+=1.5"
    //         }
    //     )
    // }
})

/**
 * Cursor
 */

const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener("mousemove", (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    //console.log(deltaTime)

    // Animate camera
    camera.position.y = - scrollY / sizes.height * objectsDistance

    const parallaxX = cursor.x * 0.5
    const parallaxY = -cursor.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    // Animate mehses
    for (const mesh of sectionMeshes) {
        mesh.rotation.x += deltaTime * 0.05
        mesh.rotation.y += deltaTime * 0.06
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()