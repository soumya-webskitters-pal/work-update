var container = document.getElementById('canvas');
var isAnimate = false;
var stats = new Stats();

var maxParticleCount = 1200;
var particleCount = 800;
var r = 1200;
var pointCloud, particlePositions, newgeometry, positions, linesMesh, particles, colors, group, segments;
var rHalf = r / 2;


var pMaterial = new THREE.PointsMaterial({
  color: "#adadad",
  size: 2,
  opacity: 0.4,
  blending: THREE.AdditiveBlending,
  transparent: true,
  sizeAttenuation: false
});


var particlesData = [];
var effectController = {
  showDots: true,
  showLines: true,
  minDistance: 150,
  limitConnections: false,
  maxConnections: 20,
  particleCount: 500
};

Viewer = function () {
    this.scene = null;
    this.container = null;
    this.camera = null;
    this.controls = null;
    this.renderer = null;
    this.pointOfOrigin = null;
    this.model = null
    this.splineCamera = null;

  },
  Viewer.prototype.Init = function () {
    var _this = this;
    _this.container = document.getElementById('canvas');
    var canvasWidth = window.innerWidth,
      canvasHeight = window.innerHeight

    // _this.container.appendChild(stats.dom);

    _this.scene = new THREE.Scene();
    // _this.scene.fog = new THREE.FogExp2(0xefd1b5, 0.0025);
    // _this.scene.background = new THREE.Color(0x102b45);
    // camera
    var VIEW_ANGLE = 85,
      ASPECT = canvasWidth / canvasHeight,
      NEAR = 0.01,
      FAR = 1000;
    // _this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    _this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    // _this.camera.position.z = 1750;
    _this.camera.receiveShadow = true;
    _this.camera.view = _this.scene;
    _this.camera.view.autoUpdate = false;
    _this.camera.castShadow = true;
    _this.scene.add(_this.camera);

    // lights
    _this.scene.add(new THREE.AmbientLight("#FFFFFF"));
    var light = new THREE.DirectionalLight("#FFFFFF", 0.7);
    light.position.set(-500, 2000, -2000);
    light.position.multiplyScalar(1.3);
    _this.scene.add(light);

    // lights
    var light = new THREE.DirectionalLight("#FFFFFF", 0.7);
    light.position.set(500, 2000, 2000);
    light.position.multiplyScalar(1.3);
    _this.scene.add(light);

    // renderer
    _this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    _this.renderer.setPixelRatio(window.devicePixelRatio);
    _this.renderer.setSize(canvasWidth, canvasHeight);
    _this.container.appendChild(_this.renderer.domElement);


    // controls
    _this.controls = new THREE.OrbitControls(_this.camera, _this.renderer.domElement);
    _this.controls.minPolarAngle = Math.PI * 0.1;
    _this.controls.maxPolarAngle = Math.PI * 0.45;
    _this.controls.enableRotate = true;
    _this.controls.rotateSpeed = 1;
    _this.controls.enableZoom = false;
    _this.controls.zoomSpeed = 1;
    _this.controls.screenSpacePanning = false;
    _this.controls.enablePan = true;
    _this.controls.panSpeed = 1;
    _this.controls.enableDamping = false;
    _this.controls.dampingFactor = 0.3;
    _this.controls.minDistance = 800;
    _this.controls.maxDistance = 12000;
    // _this.controls.maxZoom = 1;
    _this.addParticles()
    var _Model = new Model();
    _Model.Init(_this.scene, _this.camera, _this.controls, _this.renderer);
    // console.log(_this.controls)
    this.model = _Model

  },
  Viewer.prototype.addParticles = function () {
    var _this = this;

    var GrannyKnot = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(10, 10, -10), new THREE.Vector3(10, 0, -10),
        new THREE.Vector3(20, 0, 0), new THREE.Vector3(30, 0, 10),
        new THREE.Vector3(30, 0, 20), new THREE.Vector3(20, 0, 30),
        new THREE.Vector3(10, 0, 30), new THREE.Vector3(0, 0, 30),
        new THREE.Vector3(-10, 10, 30), new THREE.Vector3(-10, 20, 30),
        new THREE.Vector3(10, 30, 30), new THREE.Vector3(10, 30, 30),
        new THREE.Vector3(20, 30, 15), new THREE.Vector3(10, 30, 10),
        new THREE.Vector3(0, 30, 10), new THREE.Vector3(-10, 20, 10),
        new THREE.Vector3(-10, 10, 10), new THREE.Vector3(0, 0, 10),
        new THREE.Vector3(10, -10, 10), new THREE.Vector3(20, -15, 10),
        new THREE.Vector3(30, -15, 10), new THREE.Vector3(40, -15, 10),
        new THREE.Vector3(50, -15, 10), new THREE.Vector3(60, 0, 10),
        new THREE.Vector3(70, 0, 0), new THREE.Vector3(80, 0, 0),
        new THREE.Vector3(90, 0, 0), new THREE.Vector3(100, 0, 0)
      ]
    );
    GrannyKnot.curveType = 'catmullrom';
    GrannyKnot.closed = true;
    GrannyKnot.needsUpdate = true
    tubeGeometry = new THREE.TubeBufferGeometry(GrannyKnot, 10, 1, 2, true);
    var tubeMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      color: "#fff",
      opacity: 0,
      needsUpdate: true,
      blending: THREE.AdditiveBlending,
      wireframe: true,
    });
    tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
    tubeMesh.scale.set(10, 10, 10);

    segments = maxParticleCount * maxParticleCount;
    colors = new Float32Array(segments * 3);
    particles = new THREE.BufferGeometry();
    particlePositions = new Float32Array(maxParticleCount * 3);
    segments = maxParticleCount * maxParticleCount;
    group = new THREE.Group();
    positions = new Float32Array(segments * 3);

    for (var i = 0; i < maxParticleCount; i++) {
      var x = Math.random() * r - r / 2;
      var y = Math.random() * r - r / 2;
      var z = Math.random() * r - r / 2;
      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;
      particlesData.push({
        velocity: new THREE.Vector3(.015, .015, .015),
        numConnections: 1
      });
    }

    particles.setDrawRange(0, particleCount);
    particles.addAttribute('position', new THREE.BufferAttribute(particlePositions, 3).setDynamic(false));
    pointCloud = new THREE.Points(particles, pMaterial);
    pointCloud.visible = true;
    // particles.scale(2, 2, 2);
    group.add(pointCloud);
    newgeometry = new THREE.BufferGeometry();
    newgeometry.addAttribute('position', new THREE.BufferAttribute(positions, 3).setDynamic(true));
    newgeometry.addAttribute('color', new THREE.BufferAttribute(colors, 3).setDynamic(false));
    //newgeometry.computeBoundingSphere();
    newgeometry.setDrawRange(0, 10);
    var material = new THREE.LineBasicMaterial({
      //vertexColors: THREE.VertexColors,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: .07,
      color: "#adadad"
    });
    linesMesh = new THREE.LineSegments(newgeometry, material);
    linesMesh.visible = true;
    linesMesh.verticesNeedUpdate = true
    // newgeometry.scale(2, 2, 2);
    group.add(linesMesh);

    _this.scene.add(group)
  },
  Viewer.prototype.ParticleAnimate = function () {
    var vertexpos = 0;
    var colorpos = 0;
    var numConnected = 0;
    for (var i = 0; i < particleCount; i++) {
      particlesData[i].numConnections = 0;
    }

    for (var i = 0; i < particleCount; i++) {
      // get the particle
      var particleData = particlesData[i];
      particlePositions[i * 3] += particleData.velocity.x;
      particlePositions[i * 3 + 1] += particleData.velocity.y;
      particlePositions[i * 3 + 2] += particleData.velocity.z;

      if (particlePositions[i * 3 + 1] < -rHalf || particlePositions[i * 3 + 1] > rHalf) {
        particleData.velocity.y = -particleData.velocity.y;
      }

      if (particlePositions[i * 3] < -rHalf || particlePositions[i * 3] > rHalf) {
        particleData.velocity.x = -particleData.velocity.x;
      }

      if (particlePositions[i * 3 + 2] < -rHalf || particlePositions[i * 3 + 2] > rHalf) {
        particleData.velocity.z = -particleData.velocity.z;
      }

      if (effectController.limitConnections && particleData.numConnections >= effectController.maxConnections) {
        continue;
      }

      // Check collision
      for (var j = i + 1; j < particleCount; j++) {
        var particleDataB = particlesData[j];
        if (effectController.limitConnections && particleDataB.numConnections >= effectController.maxConnections) {
          continue;
        }

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
    linesMesh.geometry.setDrawRange(0, numConnected * 3);
    linesMesh.geometry.attributes.position.needsUpdate = true;
    linesMesh.geometry.attributes.color.needsUpdate = true;
    pointCloud.geometry.attributes.position.needsUpdate = true;
    pointCloud.geometry.attributes.position.needsUpdate = true;

  },
  Viewer.prototype.animate = function () {
    this.ParticleAnimate()
    requestAnimationFrame(this.animate.bind(this));
    stats.update();
    this.render();

  },
  Viewer.prototype.render = function () {
    var _this = this;
    var time = Date.now();
    var looptime = 20 * 600;
    var t = (time % looptime) / looptime;
    const recent = _this.scene.getObjectByName('temp');

    //dynamic camera--
    if (recent) {
      var pos = animatedline.parameters.path.getPointAt(t);
      pos.multiplyScalar(1);
      var segments = animatedline.tangents.length;
      var pickt = t * segments;
      var pick = Math.floor(pickt);
      var pickNext = (pick + 1) % segments;

      binormal.subVectors(animatedline.binormals[pickNext], animatedline.binormals[pick]);
      binormal.multiplyScalar(pickt - pick).add(animatedline.binormals[pick]);
      var dir = animatedline.parameters.path.getTangentAt(t);
      var offset = 15;
      normal.copy(binormal).cross(dir);
      pos.add(normal.clone().multiplyScalar(offset));
      var lookAt = animatedline.parameters.path.getPointAt((t + 30 / animatedline.parameters.path.getLength()) % 1).multiplyScalar(1);
      _this.camera.position.copy(pos);
      lookAt.copy(pos).add(dir)
      _this.camera.matrix.lookAt(_this.camera.position, lookAt, normal);
      _this.camera.quaternion.setFromRotationMatrix(_this.camera.matrix);
      _this.camera.updateProjectionMatrix();
      _this.camera.updateMatrixWorld();
      //wheel off
      window.onwheel = function () {
        return false;
      }

      if (pickNext * 1.1 >= segments - 1) {
        console.log(objects[currentNode])
        setTimeout(() => {
          _this.scene.remove(recent);
          window.onwheel = function (event) {
            _this.OnScroll(event);
          }
        }, 1000);
        //wheel on

      }
    }

    // this.renderer.gammaInput = true;
    // this.renderer.gammaOutput = true;
    this.renderer.render(this.scene, this.camera);
    _this.controls.update();
    _this.camera.matrixWorldNeedsUpdate = true;

  },
  Viewer.prototype.Resize = function () {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

  },
  Viewer.prototype.OnScroll = function (event) {
    var scroll_offset = 100;
    var temp_scroll_val = event.deltaY;
    var _currentNode = currentNode;
    objects = event.view.DataMesh
    objects.forEach((item) => {
      item._active = false;
    });
    var _this = this;
    scroll_val = scroll_val + temp_scroll_val
    if (scroll_val > actual_el_count * scroll_offset) {
      scroll_val = actual_el_count * scroll_offset
    }
    if (scroll_val <= 0) {
      scroll_val = 0
    }
    if (temp_scroll_val >= 0) {
      //scroll down
      _currentNode = _currentNode + 1
      if (_currentNode > actual_el_count - 1) {
        _currentNode = 0;
      }

    } else {
      return false
    }
    // else {
    //   //scroll up
    //   _currentNode = _currentNode - 1
    //   if (_currentNode < 0) {
    //     _currentNode = actual_el_count - 1;
    //   }
    // }
    currentNode = _currentNode

    objects[currentNode]._active = true;
    isAnimate = true;
    objects.forEach((item) => {
      item.material.color.set('#0d223b');
      item.material.emissive.set('#356596');
    });
    objects[currentNode].material.color.set('#f85857');
    objects[currentNode].material.emissive.set('#e73827');
    console.log(currentNode)
    const prevT = _this.scene.getObjectByName('temp');
    if (prevT) {
      _this.scene.remove(prevT);
    }
    _this.model.Eventhandle(objects[currentNode]);
    // addLine(_this.scene, objects[currentNode], objects[currentNode + 1]);

  },
  Viewer.prototype.OnMouseMove = function (event, container) {
    this.model.MouseMove(event, container);
  }

window.onload = function () {
  var g = new Viewer;
  g.Init();
  g.animate();
  window.onresize = function () {
    g.Resize();
  }
  window.onwheel = function (event) {
    g.OnScroll(event);
  }
  window.onmousemove = function (event) {
    // g.OnMouseMove(event, container)
    // .MouseMove(event);
  }
};