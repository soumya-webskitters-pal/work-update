var ww = window.innerWidth;
var wh = window.innerHeight;
var isMobile = ww < 500;

var linesMesh, colors, group, controls, particles,
  pointCloud, particlePositions, positions;
var particlesData = [];

var maxParticleCount = 500,
  particleCount = 200,
  r = 800,
  rHalf = r / 2;

var effectController = {
  showDots: true,
  showLines: true,
  minDistance: 150,
  limitConnections: false,
  maxConnections: 20,
  particleCount: 500
};

function Tunnel() {
  this.init();
  this.createMesh();

  this.handleEvents();

  window.requestAnimationFrame(this.render.bind(this));
}

Tunnel.prototype.init = function () {

  this.speed = 1;
  this.prevTime = 0;

  this.mouse = {
    position: new THREE.Vector2(ww * 0.5, wh * 0.7),
    ratio: new THREE.Vector2(0, 0),
    target: new THREE.Vector2(ww * 0.5, wh * 0.7)
  };

  this.renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.querySelector("#scene")
  });
  this.renderer.setSize(ww, wh);

  this.camera = new THREE.PerspectiveCamera(15, ww / wh, 0.01, 100);
  this.camera.rotation.y = Math.PI;
  this.camera.position.z = 0.35;

  this.scene = new THREE.Scene();
  this.scene.fog = new THREE.Fog(0x10b55a, 0.05, 1.6);

  var light = new THREE.HemisphereLight(0xdc0c0c, 0x2c9cca, 1);
  this.scene.add(light);

  this.addParticle();
};

Tunnel.prototype.addParticle = function () {
  this.particles = [];
  for (var i = 0; i < (isMobile ? 70 : 150); i++) {
    this.particles.push(new Particle(this.scene));
  }
};

Tunnel.prototype.createMesh = function () {
  var points = [];
  var i = 0;
  var geometry = new THREE.Geometry();

  this.scene.remove(this.tubeMesh)

  for (i = 0; i < 5; i += 1) {
    points.push(new THREE.Vector3(0, 0, 2.5 * (i / 4)));
  }
  points[4].y = -0.06;

  this.curve = new THREE.CatmullRomCurve3(points);
  this.curve.type = "catmullrom";

  geometry = new THREE.Geometry();
  geometry.vertices = this.curve.getPoints(70);
  this.splineMesh = new THREE.Line(geometry, new THREE.LineBasicMaterial());

  this.tubeMaterial = new THREE.MeshBasicMaterial({
    side: THREE.BackSide,
    color: 0xec105a
  });

  this.tubeGeometry = new THREE.TubeGeometry(this.curve, 70, 0.02, 30, false);
  this.tubeGeometry_o = this.tubeGeometry.clone();
  this.tubeMesh = new THREE.Mesh(this.tubeGeometry, this.tubeMaterial);

  this.scene.add(this.tubeMesh);

};

Tunnel.prototype.handleEvents = function () {
  window.addEventListener('resize', this.onResize.bind(this), false);

  document.body.addEventListener('mousemove', this.onMouseMove.bind(this), false);
  document.body.addEventListener('touchmove', this.onMouseMove.bind(this), false);
};

Tunnel.prototype.onResize = function () {
  ww = window.innerWidth;
  wh = window.innerHeight;

  isMobile = ww < 500;

  this.camera.aspect = ww / wh;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(ww, wh);
};

Tunnel.prototype.onMouseMove = function (e) {
  if (e.type === "mousemove") {
    this.mouse.target.x = e.clientX;
    this.mouse.target.y = e.clientY;
  } else {
    this.mouse.target.x = e.touches[0].clientX;
    this.mouse.target.y = e.touches[0].clientY;
  }
};

Tunnel.prototype.updateCameraPosition = function () {

  this.mouse.position.x += (this.mouse.target.x - this.mouse.position.x) / 30;
  this.mouse.position.y += (this.mouse.target.y - this.mouse.position.y) / 30;

  this.mouse.ratio.x = (this.mouse.position.x / ww);
  this.mouse.ratio.y = (this.mouse.position.y / wh);

  this.camera.rotation.z = ((this.mouse.ratio.x) * 1 - 0.05);
  this.camera.rotation.y = Math.PI - (this.mouse.ratio.x * 0.3 - 0.15);
  this.camera.position.x = ((this.mouse.ratio.x) * 0.044 - 0.025);
  this.camera.position.y = ((this.mouse.ratio.y) * 0.044 - 0.025);

};

Tunnel.prototype.updateCurve = function () {
  var i = 0;
  var index = 0;
  var vertice_o = null;
  var vertice = null;
  for (i = 0; i < this.tubeGeometry.vertices.length; i += 1) {
    vertice_o = this.tubeGeometry_o.vertices[i];
    vertice = this.tubeGeometry.vertices[i];
    index = Math.floor(i / 30);
    vertice.x += ((vertice_o.x + this.splineMesh.geometry.vertices[index].x) - vertice.x) / 15;
    vertice.y += ((vertice_o.y + this.splineMesh.geometry.vertices[index].y) - vertice.y) / 15;
  }
  this.tubeGeometry.verticesNeedUpdate = true;

  this.curve.points[2].x = 0.6 * (1 - this.mouse.ratio.x) - 0.3;
  this.curve.points[3].x = 0;
  this.curve.points[4].x = 0.6 * (1 - this.mouse.ratio.x) - 0.3;

  this.curve.points[2].y = 0.6 * (1 - this.mouse.ratio.y) - 0.3;
  this.curve.points[3].y = 0;
  this.curve.points[4].y = 0.6 * (1 - this.mouse.ratio.y) - 0.3;

  this.splineMesh.geometry.verticesNeedUpdate = true;
  this.splineMesh.geometry.vertices = this.curve.getPoints(70);
};

Tunnel.prototype.render = function (time) {

  this.updateCameraPosition();

  this.updateCurve();

  for (var i = 0; i < this.particles.length; i++) {
    this.particles[i].update(this);
    if (this.particles[i].burst && this.particles[i].percent > 1) {
      this.particles.splice(i, 1);
      i--;
    }
  }

  this.renderer.render(this.scene, this.camera);

  window.requestAnimationFrame(this.render.bind(this));
};

function Particle(scene, burst, time) {
  var radius = 0.0009;
  var geom = this.icosahedron;

  //new--
  group = new THREE.Group();
  var segments = maxParticleCount * maxParticleCount;

  positions = new Float32Array(segments * 3);
  colors = new Float32Array(segments * 3);

  var mat = pMaterial = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 3,
    blending: THREE.AdditiveBlending,
    transparent: true,
    sizeAttenuation: false
  });

  particles = new THREE.BufferGeometry();
  particlePositions = new Float32Array(maxParticleCount * 3);

  for (var i = 0; i < maxParticleCount; i++) {

    var x = Math.random() * r - r / 2;
    var y = Math.random() * r - r / 2;
    var z = Math.random() * r - r / 2;

    particlePositions[i * 3] = x;
    particlePositions[i * 3 + 1] = y;
    particlePositions[i * 3 + 2] = z;

    // add it to the geometry
    particlesData.push({
      velocity: new THREE.Vector3(-1 + Math.random() * 2, -1 + Math.random() * 2, -1 + Math.random() * 2),
      numConnections: 0
    });

  }

  particles.setDrawRange(0, particleCount);
  particles.addAttribute('position', new THREE.BufferAttribute(particlePositions, 3).setDynamic(true));

  // create the particle system
  pointCloud = new THREE.Points(particles, pMaterial);
  group.add(pointCloud);

  var geometry = new THREE.BufferGeometry();

  geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3).setDynamic(true));
  geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3).setDynamic(true));

  geometry.computeBoundingSphere();

  geometry.setDrawRange(0, 0);

  var material = new THREE.LineBasicMaterial({
    vertexColors: THREE.VertexColors,
    blending: THREE.AdditiveBlending,
    transparent: true
  });

  linesMesh = new THREE.LineSegments(geometry, material);
  group.add(linesMesh);

  var vertexpos = 0;
  var colorpos = 0;
  var numConnected = 0;

  for (var i = 0; i < particleCount; i++)
    particlesData[i].numConnections = 0;

  for (var i = 0; i < particleCount; i++) {

    // get the particle
    var particleData = particlesData[i];

    particlePositions[i * 3] += particleData.velocity.x;
    particlePositions[i * 3 + 1] += particleData.velocity.y;
    particlePositions[i * 3 + 2] += particleData.velocity.z;

    if (particlePositions[i * 3 + 1] < -rHalf || particlePositions[i * 3 + 1] > rHalf)
      particleData.velocity.y = -particleData.velocity.y;

    if (particlePositions[i * 3] < -rHalf || particlePositions[i * 3] > rHalf)
      particleData.velocity.x = -particleData.velocity.x;

    if (particlePositions[i * 3 + 2] < -rHalf || particlePositions[i * 3 + 2] > rHalf)
      particleData.velocity.z = -particleData.velocity.z;

    if (effectController.limitConnections && particleData.numConnections >= effectController.maxConnections)
      continue;

    // Check collision
    for (var j = i + 1; j < particleCount; j++) {

      var particleDataB = particlesData[j];
      if (effectController.limitConnections && particleDataB.numConnections >= effectController.maxConnections)
        continue;

      var dx = particlePositions[i * 3] - particlePositions[j * 3];
      var dy = particlePositions[i * 3 + 1] - particlePositions[j * 3 + 1];
      var dz = particlePositions[i * 3 + 2] - particlePositions[j * 3 + 2];
      var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < effectController.minDistance) {

        particleData.numConnections++;
        particleDataB.numConnections++;

        var alpha = 1.0 - dist / effectController.minDistance;

        positions[vertexpos++] = particlePositions[i * 3];
        positions[vertexpos++] = particlePositions[i * 3 + 1];
        positions[vertexpos++] = particlePositions[i * 3 + 2];

        positions[vertexpos++] = particlePositions[j * 3];
        positions[vertexpos++] = particlePositions[j * 3 + 1];
        positions[vertexpos++] = particlePositions[j * 3 + 2];

        colors[colorpos++] = alpha;
        colors[colorpos++] = alpha;
        colors[colorpos++] = alpha;

        colors[colorpos++] = alpha;
        colors[colorpos++] = alpha;
        colors[colorpos++] = alpha;

        numConnected++;

      }

    }

  }


  linesMesh.geometry.setDrawRange(0, numConnected * 2);
  linesMesh.geometry.attributes.position.needsUpdate = true;
  linesMesh.geometry.attributes.color.needsUpdate = true;

  pointCloud.geometry.attributes.position.needsUpdate = true;
  //new--end

  /*
    var mat = new THREE.MeshPhongMaterial({
      color: "#339a63",
      shading: THREE.FlatShading
    });*/


  this.mesh = new THREE.Mesh(geom, mat);
  this.mesh.scale.set(radius, radius, radius);
  this.mesh.position.set(0, 0, 1.5);

  this.percent = burst ? 0.2 : Math.random();
  this.offset = new THREE.Vector3((Math.random() - 0.5) * 0.025, (Math.random() - 0.5) * 0.025, 0);
  this.speed = Math.random() * 0.004 + 0.0002;
  this.rotate = new THREE.Vector3(-Math.random() * 0.1 + 0.01, 0, Math.random() * 0.01);

  scene.add(this.mesh);
}

//create the particle
Particle.prototype.icosahedron = new THREE.IcosahedronBufferGeometry(1, 0);

Particle.prototype.update = function (tunnel) {

  this.percent += this.speed * (this.burst ? 1 : tunnel.speed);

  this.pos = tunnel.curve.getPoint(1 - (this.percent % 1)).add(this.offset);

  this.mesh.position.x = this.pos.x;
  this.mesh.position.y = this.pos.y;
  this.mesh.position.z = this.pos.z;
  this.mesh.rotation.x += this.rotate.x;
  this.mesh.rotation.y += this.rotate.y;
  this.mesh.rotation.z += this.rotate.z;
};

window.onload = function () {

  window.tunnel = new Tunnel();

};