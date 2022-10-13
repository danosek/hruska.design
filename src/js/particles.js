import * as THREE from './three.module.js'
// import * as dat from 'lil-gui'
//import gsap from './gsap.js'


/**
 * Debug
 */
// const gui = new dat.GUI()

const parameters = {
    particleColor: '#FFFFFF',
    meshColor: '#ffffff'

}

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
    metalness: 0.4
})

// Meshes

const objectsDistance = 4

const mesh3 = new THREE.Mesh(
    new THREE.BoxGeometry( 1.5, 1.5, 1.5, 2, 2, 2 ),
    material
)
// const mesh1 = new THREE.Mesh(
//     new THREE.TorusGeometry(1, 0.4, 16, 60),
//     material
// )
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)
const mesh1 = new THREE.Mesh(
    new THREE.TetrahedronGeometry(1, 3),
    material
)

mesh1.position.y = objectsDistance * -1.3
mesh2.position.y = objectsDistance * -2.4
mesh3.position.y = objectsDistance * -3.9

mesh1.position.x = 1.1
mesh2.position.x = 1.25
mesh3.position.x = 1.16

scene.add(mesh1, mesh2, mesh3)

const sectionMeshes = [ mesh1, mesh2, mesh3 ]

/**
 * Particles
 */

// Geometry
const particlesCount = 800
const positions = new Float32Array(particlesCount * 3)

for (let i = 0; i < particlesCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10 // X
    positions[i * 3 + 1] = (Math.random() - 0.2) * 8 // Y
    positions[i * 3 + 2] = ((Math.random() - 1) * 8) - 2 // Z
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))

// Material

const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.particleColor,
    sizeAttenuation: true,
    size: 0.02
})

// Points

const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)


/**
 * Lights
 */

const directionalLight = new THREE.DirectionalLight("#5A74F6", 1)
directionalLight.position.set(-3, 1, 3)

const ambientLight = new THREE.AmbientLight("#5A74F6", 0.3)

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
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()