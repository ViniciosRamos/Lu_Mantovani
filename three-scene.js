// three-scene.js – Cena 3D (partículas + geometria orgânica)
const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();
scene.background = null; 

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 4.5);

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// ===== LUZES SUTIS =====
const ambientLight = new THREE.AmbientLight(0x404060);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xc9a86a, 0.8);
dirLight.position.set(1, 1, 1);
scene.add(dirLight);
const backLight = new THREE.PointLight(0x445566, 0.5);
backLight.position.set(-2, 1, -2);
scene.add(backLight);

// ===== OBJETO PRINCIPAL  =====
const geometry = new THREE.TorusKnotGeometry(1.1, 0.32, 180, 24);
const material = new THREE.MeshStandardMaterial({
  color: 0xc9a86a,
  roughness: 0.25,
  metalness: 0.1,
  wireframe: false,
  emissive: new THREE.Color(0x332211),
  emissiveIntensity: 0.15,
  transparent: true,
  opacity: 0.92
});
const knot = new THREE.Mesh(geometry, material);
scene.add(knot);

// Wireframe secundário para contraste
const wireframeMat = new THREE.MeshBasicMaterial({
  color: 0xc9a86a,
  wireframe: true,
  transparent: true,
  opacity: 0.12
});
const knotWire = new THREE.Mesh(geometry, wireframeMat);
knotWire.scale.setScalar(1.02);
scene.add(knotWire);

// ===== PARTÍCULAS =====
const particlesGeo = new THREE.BufferGeometry();
const particlesCount = 1800;
const posArray = new Float32Array(particlesCount * 3);
for(let i = 0; i < particlesCount * 3; i += 3) {
  // Esfera de raio 7
  const r = 6 + Math.random() * 4;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos((Math.random() * 2) - 1);
  posArray[i] = Math.sin(phi) * Math.cos(theta) * r;
  posArray[i+1] = Math.sin(phi) * Math.sin(theta) * r;
  posArray[i+2] = Math.cos(phi) * r;
}
particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMat = new THREE.PointsMaterial({
  size: 0.015,
  color: 0xddccaa,
  transparent: true,
  blending: THREE.AdditiveBlending
});
const particles = new THREE.Points(particlesGeo, particlesMat);
scene.add(particles);

// ===== ANEL ORBITAL =====
const ringGeo = new THREE.TorusGeometry(1.8, 0.01, 32, 200);
const ringMat = new THREE.MeshStandardMaterial({ color: 0xc9a86a, emissive: new THREE.Color(0x221100), transparent: true, opacity: 0.25 });
const ring = new THREE.Mesh(ringGeo, ringMat);
ring.rotation.x = Math.PI / 2;
ring.rotation.z = 0.3;
scene.add(ring);

const ring2 = ring.clone();
ring2.material = new THREE.MeshStandardMaterial({ color: 0xaa9977, wireframe: true, transparent: true, opacity: 0.1 });
ring2.scale.setScalar(1.3);
ring2.rotation.x = 0.8;
ring2.rotation.y = 0.5;
scene.add(ring2);

// ===== ANIMAÇÃO + INTERAÇÃO COM SCROLL =====
let scrollProgress = 0;
function updateThreeOnScroll(progress) {
  scrollProgress = progress || 0;
}

// Torna a função acessível globalmente
window.updateThreeOnScroll = updateThreeOnScroll;

function animate() {
  requestAnimationFrame(animate);
  
  const time = performance.now() * 0.001;
  
  // Rotação base
  knot.rotation.x = time * 0.08;
  knot.rotation.y = time * 0.12;
  knotWire.rotation.x = knot.rotation.x;
  knotWire.rotation.y = knot.rotation.y;
  
  ring.rotation.z += 0.002;
  ring2.rotation.x += 0.001;
  ring2.rotation.y += 0.002;
  
  particles.rotation.y += 0.0005;
  
  // Efeito de parallax com scroll
  if (scrollProgress > 0) {
    const offsetY = scrollProgress * 1.2;
    camera.position.y = -offsetY * 0.4;
    camera.position.x = offsetY * 0.2;
    camera.lookAt(0, -offsetY * 0.2, 0);
  } else {
    camera.position.x += (0 - camera.position.x) * 0.05;
    camera.position.y += (0 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  }
  
  renderer.render(scene, camera);
}
animate();

// ===== RESIZE HANDLER =====
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// ===== EFEITO DE MOUSE =====
document.addEventListener('mousemove', (e) => {
  const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  gsap.to(knot.rotation, {
    x: performance.now() * 0.0008 + mouseY * 0.15,
    y: performance.now() * 0.0012 + mouseX * 0.2,
    duration: 0.8,
    overwrite: true
  });
  gsap.to(knotWire.rotation, {
    x: knot.rotation.x,
    y: knot.rotation.y,
    duration: 0.8
  });
});
