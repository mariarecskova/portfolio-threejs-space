import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
//this mimics what human eyeballs would see
//3 arguments: fiels of view- amount in degrees that is visible, aspect ratio- based on user window, view frustrum: which objects are visible relative to the camera itself
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);
//this gives us a better perspective

renderer.render(scene, camera);
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);

const material = new THREE.MeshStandardMaterial({
  //this is a material that will react to light bouncing off of it
  color: 0x13265c,
});
//it is like wrapping paper
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);
//this will add the light to our shape. 0x = we are working with a hexadecimal value instead of a number type
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

//this lights everything up equally
const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
//this draws a 2D grid along the scene
scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);
//this listen to the DOM and updates camera position accordingly

const spaceTexture = new THREE.TextureLoader().load("galaxy.jpg");

scene.background = spaceTexture;

//here we take 2D pixels, and we map them to 3D geometry
const mariaTexture = new THREE.TextureLoader().load("maria.jpeg");
const mariaCube = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: mariaTexture })
);

scene.add(mariaCube);

const moonTexture = new THREE.TextureLoader().load("moon.jpg");
const normalTexture = new THREE.TextureLoader().load("normal.jpg");

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);
scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

mariaCube.position.z = -5;
mariaCube.position.setX(-10);

function moveCamera() {
  //dimensions of the viewport- and the top property will show us how far exactly we are from the top of the webpage
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  mariaCube.rotation.y += 0.01;
  mariaCube.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;

// we do not want to render it over and over again, so we set up a recursive function that calls an infinite loop
function animate() {
  requestAnimationFrame(animate);
  //this is a mechanism, that tells the browser that you want to perform an animation- like a game loop
  torus.rotation.x += 0.01;
  //every shape that we create has different properties if we change its propertie inside the loop, it will animate
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  // controls.update();

  renderer.render(scene, camera);
}
animate();
