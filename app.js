// Variables
let container, camera, scene, renderer, particleSystem;

// Initialization
init();

// Animation loop
animate();

function init() {
    container = document.getElementById('webgl-container');

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 50;

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const particleCount = 2000;
    const particles = new THREE.BufferGeometry();
    const vertices = [];

    for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * 100 - 50;
        const y = Math.random() * 100 - 50;
        const z = Math.random() * 100 - 50;

        const newY = Math.random() < 0.5 ? y : -y;

        vertices.push(x, y, z);
    }

    particles.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const particleMaterial = new THREE.ShaderMaterial({
    vertexShader: `
        varying vec3 vColor;

        void main() {
            vColor = position * 0.1 + vec3(0.5, 0.5, 0.5);
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = 0.5 * 300.0 / -mvPosition.z;
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
        varying vec3 vColor;

        void main() {
            gl_FragColor = vec4(vColor, 1.0);
        }
    `,
    uniforms: {}
});

    particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    window.addEventListener('resize', onWindowResize, false);
}

function animate() {
    requestAnimationFrame(animate);

    // Update particle system
   particleSystem.rotation.y += 0.005; 

    for (let i = 0; i < particleSystem.geometry.attributes.position.array.length; i += 3) {
        particleSystem.geometry.attributes.position.array[i + 1] -= 0.2; 
        if (particleSystem.geometry.attributes.position.array[i + 1] < -50) {
            particleSystem.geometry.attributes.position.array[i + 1] = 50;
        }
    }
    particleSystem.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
