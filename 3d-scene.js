// Three.js 3D Scene Setup
let scene, camera, renderer, particles = [];
let rotatingObjects = [];

function init3DScene() {
    // Scene setup
    const container = document.getElementById('canvas-container');
    if (!container) return;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a3d2a); // Dark teal background

    // Camera
    camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.z = 50;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x1abc9c, 0.8);
    directionalLight.position.set(10, 20, 10);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x16a085, 0.6);
    pointLight.position.set(-10, 10, 10);
    scene.add(pointLight);

    // Create 3D objects
    createRecyclingSymbol();
    createFloatingCubes();
    createSphere();
    createParticles();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Animation loop
    animate();
}

function createRecyclingSymbol() {
    const group = new THREE.Group();

    // Create three rotating arrows
    for (let i = 0; i < 3; i++) {
        const geometry = new THREE.BoxGeometry(2, 0.3, 0.3);
        const material = new THREE.MeshPhongMaterial({
            color: i % 2 === 0 ? 0x1abc9c : 0x16a085,
            emissive: 0x0a3d2a,
            shininess: 100
        });
        const box = new THREE.Mesh(geometry, material);
        
        const angle = (i * Math.PI * 2) / 3;
        box.position.x = Math.cos(angle) * 3;
        box.position.y = Math.sin(angle) * 3;
        box.rotation.z = angle + Math.PI / 2;
        
        group.add(box);
    }

    // Center circle
    const circleGeometry = new THREE.CylinderGeometry(1, 1, 0.1, 32);
    const circleMaterial = new THREE.MeshPhongMaterial({
        color: 0x1abc9c,
        emissive: 0x0a3d2a,
        shininess: 100
    });
    const circle = new THREE.Mesh(circleGeometry, circleMaterial);
    group.add(circle);

    group.position.z = 0;
    scene.add(group);
    rotatingObjects.push({ object: group, speed: 0.005 });
}

function createFloatingCubes() {
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    
    for (let i = 0; i < 5; i++) {
        const material = new THREE.MeshPhongMaterial({
            color: Math.random() > 0.5 ? 0x1abc9c : 0x16a085,
            emissive: 0x0a3d2a,
            shininess: 100
        });
        const cube = new THREE.Mesh(geometry, material);
        
        // Random positions
        cube.position.x = (Math.random() - 0.5) * 80;
        cube.position.y = (Math.random() - 0.5) * 60;
        cube.position.z = Math.random() * 20 - 10;
        
        // Random rotation
        cube.rotation.x = Math.random() * Math.PI;
        cube.rotation.y = Math.random() * Math.PI;
        
        scene.add(cube);
        
        rotatingObjects.push({
            object: cube,
            speed: 0.003 + Math.random() * 0.003,
            rotationAxis: {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2,
                z: (Math.random() - 0.5) * 2
            }
        });
    }
}

function createSphere() {
    const geometry = new THREE.IcosahedronGeometry(8, 4);
    const material = new THREE.MeshPhongMaterial({
        color: 0x1abc9c,
        emissive: 0x0a3d2a,
        wireframe: true,
        shininess: 100
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.z = -20;
    
    scene.add(sphere);
    rotatingObjects.push({ object: sphere, speed: 0.002 });
}

function createParticles() {
    const particleCount = 100;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 100;
        positions[i + 1] = (Math.random() - 0.5) * 100;
        positions[i + 2] = (Math.random() - 0.5) * 50;
        
        velocities.push({
            x: (Math.random() - 0.5) * 0.5,
            y: (Math.random() - 0.5) * 0.5,
            z: (Math.random() - 0.5) * 0.5
        });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0x1abc9c,
        size: 0.5,
        sizeAttenuation: true
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    particles = {
        points: points,
        velocities: velocities,
        positions: positions
    };
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate objects
    rotatingObjects.forEach(item => {
        if (item.rotationAxis) {
            item.object.rotation.x += item.rotationAxis.x * item.speed;
            item.object.rotation.y += item.rotationAxis.y * item.speed;
            item.object.rotation.z += item.rotationAxis.z * item.speed;
        } else {
            item.object.rotation.z += item.speed;
        }
    });

    // Update particles
    if (particles.velocities) {
        const positions = particles.positions;
        particles.velocities.forEach((vel, i) => {
            const idx = i * 3;
            positions[idx] += vel.x;
            positions[idx + 1] += vel.y;
            positions[idx + 2] += vel.z;

            // Bounce particles
            if (positions[idx] > 50 || positions[idx] < -50) vel.x *= -1;
            if (positions[idx + 1] > 50 || positions[idx + 1] < -50) vel.y *= -1;
            if (positions[idx + 2] > 25 || positions[idx + 2] < -25) vel.z *= -1;
        });
        particles.points.geometry.attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);
}

function onWindowResize() {
    const container = document.getElementById('canvas-container');
    if (!container || !camera || !renderer) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init3DScene);
