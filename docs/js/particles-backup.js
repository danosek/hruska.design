import * as THREE from '../../docs/js/three.module.js'
//import * as dat from 'lil-gui'
//import * as gsap from './gsap.js'


/**
 * Debug
 */
// const gui = new dat.GUI()

const parameters = {
    materialColor: '#ffeded'
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
    height: window.innerHeight
}

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
 * Particles
 */

// Geometry
const particlesColumns = 150
const particlesRows = 70
const particlesCount = particlesColumns * particlesRows
const particlesGap = 0.1
const positions = new Float32Array(particlesColumns * particlesRows * 3)

for (let i = 0; i < particlesRows; i++) {
    for (let j = 0; j < particlesColumns; j++) {
        const positionIndex = particlesColumns * i + j

        positions[positionIndex * 3 + 0] = (j * particlesGap) - ((particlesColumns * particlesGap) / 2) + (particlesGap / 2)
        positions[positionIndex * 3 + 1] = (i * particlesGap) - ((particlesRows * particlesGap) / 2) + (particlesGap / 2)
        positions[positionIndex * 3 + 2] = 1
        //console.log(positionIndex + ": [ " + positions[positionIndex * 3 + 0] + ", " + positions[positionIndex * 3 + 0] +  " ]")
    }
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))

// Material

const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.02
})

// Points

const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)


/**
 * Lights
 */

const directionalLight = new THREE.DirectionalLight("#5A74F6", 0.4)
directionalLight.position.set(1, 1, 2)
scene.add(directionalLight)


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

window.addEventListener("click", () => {
    scrollY = window.scrollY
    console.log("click")

    for (let i = 0; i < particlesCount; i++) {
        // positions[i * 3 + 0] = (Math.random() - 0.5) * 15
        // positions[i * 3 + 1] = (Math.random()) * - 50
        // positions[i * 3 + 2] = (Math.random() - 1) * 15

        // gsap.to(
        //     positions[i], {
        //         duration: 1.5,
        //         ease: "power2.inOut",
        //         x: positions[i * 3 + 0] = (Math.random() - 0.5) * 15,
        //         y: positions[i * 3 + 1] = (Math.random()) * - 50,
        //         z: positions[i * 3 + 2] = (Math.random() - 1) * 15
        //     }
        // )
    }


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
    camera.position.y = - scrollY / sizes.height * 1

    const parallaxX = cursor.x * 0.5
    const parallaxY = -cursor.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()