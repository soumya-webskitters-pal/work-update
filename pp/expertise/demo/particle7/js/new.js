var container, stats;
var camera, scene, renderer, splineCamera, cameraHelper, cameraEye;
var binormal = new THREE.Vector3();
var normal = new THREE.Vector3();

var pipeSpline = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 10, -10), new THREE.Vector3(10, 0, -10),
  new THREE.Vector3(20, 0, 0), new THREE.Vector3(30, 0, 10),
  new THREE.Vector3(30, 0, 20), new THREE.Vector3(20, 0, 30),
  new THREE.Vector3(10, 0, 30), new THREE.Vector3(0, 0, 30),
  new THREE.Vector3(-10, 10, 30), new THREE.Vector3(-10, 20, 30),
  new THREE.Vector3(0, 30, 30), new THREE.Vector3(10, 30, 30),
  new THREE.Vector3(20, 30, 15), new THREE.Vector3(10, 30, 10),
  new THREE.Vector3(0, 30, 10), new THREE.Vector3(-10, 20, 10),
  new THREE.Vector3(-10, 10, 10), new THREE.Vector3(0, 0, 10),
  new THREE.Vector3(10, -10, 10), new THREE.Vector3(20, -15, 10),
  new THREE.Vector3(30, -15, 10), new THREE.Vector3(40, -15, 10),
  new THREE.Vector3(50, -15, 10), new THREE.Vector3(60, 0, 10),
  new THREE.Vector3(70, 0, 0), new THREE.Vector3(80, 0, 0),
  new THREE.Vector3(90, 0, 0), new THREE.Vector3(100, 0, 0)
]);

var parent, tubeGeometry, mesh;

var material = new THREE.MeshLambertMaterial({
  color: 0xff00ff
});
var wireframeMaterial = new THREE.MeshBasicMaterial({
  color: 0x000000,
  opacity: 0.3,
  wireframe: true,
  transparent: true
});

function addTube() {
  if (mesh !== undefined) {
    parent.remove(mesh);
    mesh.geometry.dispose();
  }
  var extrudePath = splines[params.spline];
  tubeGeometry = new THREE.TubeBufferGeometry(extrudePath, params.extrusionSegments, 2, params.radiusSegments, params.closed);
  addGeometry(tubeGeometry);
  setScale();
}

function setScale() {
  mesh.scale.set(params.scale, params.scale, params.scale);
}

function addGeometry(geometry) {
  // 3D shape
  mesh = new THREE.Mesh(geometry, material);
  var wireframe = new THREE.Mesh(geometry, wireframeMaterial);
  mesh.add(wireframe);
  parent.add(mesh);
}

function animateCamera() {
  cameraHelper.visible = params.cameraHelper;
  cameraEye.visible = params.cameraHelper;
}
init();
animate();

function init() {
  container = document.getElementById('container');
  // camera
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 10000);
  camera.position.set(0, 50, 500);
  // scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);
  // light
  var light = new THREE.DirectionalLight(0xffffff);
  light.position.set(0, 0, 1);
  scene.add(light);
  // tube
  parent = new THREE.Object3D();
  scene.add(parent);
  splineCamera = new THREE.PerspectiveCamera(84, window.innerWidth / window.innerHeight, 0.01, 1000);
  parent.add(splineCamera);
  cameraHelper = new THREE.CameraHelper(splineCamera);
  scene.add(cameraHelper);
  addTube();
  // debug camera
  cameraEye = new THREE.Mesh(new THREE.SphereBufferGeometry(5), new THREE.MeshBasicMaterial({
    color: 0xdddddd
  }));
  parent.add(cameraEye);
  cameraHelper.visible = params.cameraHelper;
  cameraEye.visible = params.cameraHelper;
  // renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
  // stats
  stats = new Stats();
  container.appendChild(stats.dom);
  // dat.GUI
  var gui = new GUI({
    width: 300
  });
  var folderGeometry = gui.addFolder('Geometry');
  folderGeometry.add(params, 'spline', Object.keys(splines)).onChange(function () {
    addTube();
  });
  folderGeometry.add(params, 'scale', 2, 10).step(2).onChange(function () {
    setScale();
  });
  folderGeometry.add(params, 'extrusionSegments', 50, 500).step(50).onChange(function () {
    addTube();
  });
  folderGeometry.add(params, 'radiusSegments', 2, 12).step(1).onChange(function () {
    addTube();
  });
  folderGeometry.add(params, 'closed').onChange(function () {
    addTube();
  });
  folderGeometry.open();
  var folderCamera = gui.addFolder('Camera');
  folderCamera.add(params, 'animationView').onChange(function () {
    animateCamera();
  });
  folderCamera.add(params, 'lookAhead').onChange(function () {
    animateCamera();
  });
  folderCamera.add(params, 'cameraHelper').onChange(function () {
    animateCamera();
  });
  folderCamera.open();
  var controls = new OrbitControls(camera, renderer.domElement);
  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  render();
  stats.update();
}

function render() {
  // animate camera along spline
  var time = Date.now();
  var looptime = 20 * 1000;
  var t = (time % looptime) / looptime;
  var pos = tubeGeometry.parameters.path.getPointAt(t);
  pos.multiplyScalar(12);
  // interpolation
  var segments = tubeGeometry.tangents.length;
  var pickt = t * segments;
  var pick = Math.floor(pickt);
  var pickNext = (pick + 1) % segments;
  binormal.subVectors(tubeGeometry.binormals[pickNext], tubeGeometry.binormals[pick]);
  binormal.multiplyScalar(pickt - pick).add(tubeGeometry.binormals[pick]);
  var dir = tubeGeometry.parameters.path.getTangentAt(t);
  var offset = 15;
  normal.copy(binormal).cross(dir);
  // we move on a offset on its binormal
  pos.add(normal.clone().multiplyScalar(offset));
  splineCamera.position.copy(pos);
  cameraEye.position.copy(pos);
  // using arclength for stablization in look ahead
  var lookAt = tubeGeometry.parameters.path.getPointAt((t + 30 / tubeGeometry.parameters.path.getLength()) % 1).multiplyScalar(params.scale);
  // camera orientation 2 - up orientation via normal
  lookAt.copy(pos).add(dir);
  // if (!params.lookAhead) lookAt.copy(pos).add(dir);
  // splineCamera.matrix.lookAt(splineCamera.position, lookAt, normal);
  // splineCamera.quaternion.setFromRotationMatrix(splineCamera.matrix);
  cameraHelper.update();
  renderer.render(scene, splineCamera);
}