import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x202020);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.set(8, 6, 8);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 20;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();

const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, roughness: 0.8, metalness: 0.2 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.position.set(0, 0, 0);
ground.rotateY(-Math.PI / 4);
ground.receiveShadow = true;
scene.add(ground);

const spotLight = new THREE.SpotLight(0xffffff, 2, 100, 0.6, 0.5);
spotLight.position.set(0, 25, 0);
scene.add(spotLight);

const loader = new GLTFLoader().setPath('/public/3d_tv/');
loader.load('result.glb', (gltf) => {
    const model = gltf.scene;
   model.position.set(0, -0.5, 0);
   model.rotation.y = -Math.PI / 4;
   model.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    scene.add(model);
});

function animate() {
  requestAnimationFrame(animate);
    controls.update();
  renderer.render(scene, camera);
}

animate();
