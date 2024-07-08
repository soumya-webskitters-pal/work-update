var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 0, 250);
var renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x404040);
document.body.appendChild(renderer.domElement);

var controls = new THREE.OrbitControls(camera, renderer.domElement);

var planes = [];
for (let i = 0; i < 5; i++) {
  let geometry = new THREE.CylinderBufferGeometry(50, 50, 100, 6, 1, true);

  geometry.rotateX(-Math.PI * .5);
  let material = new THREE.ShaderMaterial({
    uniforms: {
      time: {
        value: 0
      },
      basePos: {
        value: new THREE.Vector3()
      },
      color: {
        value: new THREE.Color().setScalar(.5 + ((i + 1) / 5) * .5)
      }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.DoubleSide
  });

  let plane = new THREE.Mesh(geometry, material);
  plane.position.set(0, 0, 270 - i * 110);
  scene.add(plane);
  planes.push(plane);
}

var clock = new THREE.Clock();
var time = 0;
var delta = 0;
var direction = new THREE.Vector3(0, 0, 1);
var speed = 50; //units a second

render();

function render() {
  requestAnimationFrame(render);

  delta = clock.getDelta();
  time += delta;
  planes.forEach(function (plane) {
    plane.position.addScaledVector(direction, speed * delta);
    if (plane.position.z > 275) plane.position.z = -275 + ((plane.position.z - 275) % 550);
    plane.material.uniforms.time.value = time;
    plane.material.uniforms.basePos.value.copy(plane.position);
  });

  renderer.render(scene, camera);
}