// GLOBAL VARIABLEs
var container = document.getElementById('canvas');
var canvasWidth = window.innerWidth,
    canvasHeight = window.innerHeight;

var worldSize = 800;

var scene = new THREE.Scene();

var world = new THREE.Object3D();

scene.add(world);
SceneGroup = new THREE.Group();
scene.add(SceneGroup);

//for scroll
var scrollCount = 0;
var scrollStop = 0;
var prev_node = -1;
var focus_node = 0;
var smoothScroll = false;
var whellUp, scrollSpeed;
var autoScroll = false;
var nowScrollUp = true;

//progress
var finalProgress = 0.625;
var initProgress = 0.100;

//click
var NowPrevNode = -1;
var NowNextNode = true; //true goes to next node /false goes to prev node;
var buttonDisableTime = 2000;

////for animated mesh
var maxParticleCount = worldSize * 2;
var particleCount = worldSize / 1.1;
var r = worldSize;
var pointCloud, particlePositions, pointGeometry, positions, linesMesh, particles, colors, group, segments;
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
    minDistance: 120,
    limitConnections: false,
    maxConnections: 20,
    particleCount: 500
};

////for camera
var position = new THREE.Vector3();
var tangent = new THREE.Vector3();
var lookAt = new THREE.Vector3();
var velocity = 0;
var progress = 0;
var prevTime = performance.now();
var funfairs = [];
var curve;
var cameraSpeed = 0.009;
var PI2 = Math.PI / 2; // path size

//Node
var nodeMesh;
var hoverInitial = new THREE.Color('#356596');
var hoverValue = new THREE.Color('#f85857');
var nodeAnim = false;

////working Node
var currentNode = 0,
    actualElCount = 0;
var _linkedGroup = new THREE.Group();
var DataMesh = [];
var _data = [];
var nodeGap = 150;

//light
var light = new THREE.PointLight("#ffffff", 1.5);
var DirectionalLight;

//select object
var selectedObject = null;
var NowObjectSelected = false;

//solid mesh
var _solidGroup = new THREE.Group();

//on mouse movement
var effect;
var windowHalfX = window.innerWidth / 2,
    windowHalfY = window.innerHeight / 2;
var mouseX = 0,
    mouseY = 0;
var groupPos = null;

//load 3d model on demand
var shapeCameraPos = null;

//modal
const _dataBox = document.getElementById('dataBox');
const _header = document.getElementById('node_headline');
const _description = document.getElementById('node_description');
const _image = document.getElementById('node_shape');
const _closeBtn = document.getElementById('closeModal');

//custom shape --figure
var shape_container,
    shape_camera, shape_renderer, shape_controls,
    shapeHeight, shapeWidth, shape;
var shapeWorld = new THREE.Object3D();
var shape_scene = new THREE.Scene();
var shapeGroup = new THREE.Group();

////////////////////////////
MODEL = function () {
    var camera, renderer, controls;
},
    MODEL.prototype.Init = function () {
        ////PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.2, 4000);
        this.camera.receiveShadow = true;
        this.camera.castShadow = true;
        world.add(this.camera);

        // lights
        var AmbientLight = new THREE.AmbientLight("#000000");
        AmbientLight.castShadow = false;
        SceneGroup.add(AmbientLight);
        DirectionalLight = new THREE.DirectionalLight("#ffffff", 2.7);
        DirectionalLight.position.set(0, 400, 100);
        DirectionalLight.position.multiplyScalar(1.3);
        DirectionalLight.castShadow = false;
        SceneGroup.add(DirectionalLight);

        this.camera.add(light);

        //fog
        SceneGroup.fog = new THREE.Fog("#356596", 0.0025, 20);

        // renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true
        });
        this.renderer.shadowMap.enabled = false;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(canvasWidth, canvasHeight);
        this.renderer.toneMapping = THREE.ReinhardToneMapping;
        container.appendChild(this.renderer.domElement);

        ////movement
        effect = new THREE.AnaglyphEffect(this.renderer);
        effect.setSize(canvasWidth, canvasHeight);

        //// controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.minPolarAngle = Math.PI * 0.1;
        this.controls.maxPolarAngle = Math.PI * 0.45;
        this.controls.enableRotate = true;
        this.controls.rotateSpeed = 3;
        this.controls.enableZoom = true;
        this.controls.zoomSpeed = 5;
        this.controls.screenSpacePanning = false;
        this.controls.enablePan = true;
        this.controls.panSpeed = 1;
        this.controls.enableDamping = false;
        this.controls.dampingFactor = 0.3;
        this.controls.minDistance = 0.5;
        this.controls.maxDistance = 12000;
        this.controls.maxZoom = 1;

        this.SceneLoad();
    },

    MODEL.prototype.SceneLoad = function () {
        ////animated mesh
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

        // particles.setDrawRange(0, particleCount);
        particles.addAttribute('position', new THREE.BufferAttribute(particlePositions, 3).setDynamic(false));
        pointCloud = new THREE.Points(particles, pMaterial);
        pointCloud.visible = true;
        group.add(pointCloud);
        newgeometry = new THREE.BufferGeometry();
        newgeometry.addAttribute('position', new THREE.BufferAttribute(positions, 3).setDynamic(true));
        newgeometry.addAttribute('color', new THREE.BufferAttribute(colors, 3).setDynamic(false));
        var material = new THREE.LineBasicMaterial({
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: .1,
            color: "#adadad"
        });
        linesMesh = new THREE.LineSegments(newgeometry, material);
        linesMesh.visible = true;
        linesMesh.verticesNeedUpdate = true;

        var offset_mesh_pos = 60;
        var offset_mesh_scale = 0.17;
        var NewPointCloud = pointCloud;
        NewPointCloud.scale.set(offset_mesh_scale, offset_mesh_scale, offset_mesh_scale);
        linesMesh.scale.set(offset_mesh_scale, offset_mesh_scale, offset_mesh_scale);
        group.add(linesMesh);

        var pointMesh1 = linesMesh.clone();
        pointMesh1.position.x = -offset_mesh_pos;
        pointMesh1.position.y = offset_mesh_pos;
        pointMesh1.rotation.x = -offset_mesh_pos;
        group.add(pointMesh1);
        pointMesh1 = linesMesh.clone();
        pointMesh1.position.x = offset_mesh_pos;
        pointMesh1.position.y = -offset_mesh_pos;
        pointMesh1.rotation.y = -offset_mesh_pos;
        group.add(pointMesh1);
        pointMesh1 = linesMesh.clone();
        pointMesh1.position.x = offset_mesh_pos;
        pointMesh1.position.y = offset_mesh_pos;
        pointMesh1.rotation.z = -offset_mesh_pos;
        group.add(pointMesh1);
        pointMesh1 = linesMesh.clone();
        pointMesh1.position.x = -offset_mesh_pos;
        pointMesh1.position.y = -offset_mesh_pos;
        pointMesh1.rotation.x = offset_mesh_pos;
        group.add(pointMesh1);
        pointMesh1 = linesMesh.clone();
        pointMesh1.position.x = -offset_mesh_pos;
        pointMesh1.position.z = -offset_mesh_pos;
        pointMesh1.rotation.x = -offset_mesh_pos;
        group.add(pointMesh1);
        pointMesh1 = linesMesh.clone();
        pointMesh1.position.x = offset_mesh_pos;
        pointMesh1.position.z = -offset_mesh_pos;
        pointMesh1.rotation.y = -offset_mesh_pos;
        group.add(pointMesh1);
        pointMesh1 = linesMesh.clone();
        pointMesh1.position.x = -offset_mesh_pos;
        pointMesh1.position.z = offset_mesh_pos;
        pointMesh1.rotation.z = -offset_mesh_pos;
        group.add(pointMesh1);
        pointMesh1 = linesMesh.clone();
        pointMesh1.position.x = offset_mesh_pos;
        pointMesh1.position.z = offset_mesh_pos;
        pointMesh1.rotation.x = offset_mesh_pos;
        group.add(pointMesh1);
        pointMesh1 = linesMesh.clone();
        pointMesh1.position.y = offset_mesh_pos;
        pointMesh1.position.z = offset_mesh_pos;
        pointMesh1.rotation.x = offset_mesh_pos;
        group.add(pointMesh1);
        pointMesh1 = linesMesh.clone();
        pointMesh1.position.y = -offset_mesh_pos;
        pointMesh1.position.z = offset_mesh_pos;
        pointMesh1.rotation.y = offset_mesh_pos;
        group.add(pointMesh1);
        pointMesh1 = linesMesh.clone();
        pointMesh1.position.y = offset_mesh_pos;
        pointMesh1.position.z = -offset_mesh_pos;
        pointMesh1.rotation.z = offset_mesh_pos;
        group.add(pointMesh1);
        pointMesh1 = linesMesh.clone();
        pointMesh1.position.y = -offset_mesh_pos;
        pointMesh1.position.z = -offset_mesh_pos;
        pointMesh1.rotation.x = -offset_mesh_pos;
        group.add(pointMesh1);
        pointMesh1 = linesMesh.clone();
        pointMesh1.position.x = -offset_mesh_pos;
        group.add(pointMesh1);
        pointMesh1 = linesMesh.clone();
        pointMesh1.position.x = offset_mesh_pos;
        group.add(pointMesh1);
        pointMesh1 = linesMesh.clone();
        pointMesh1.position.y = offset_mesh_pos;
        group.add(pointMesh1);
        pointMesh1 = linesMesh.clone();
        pointMesh1.position.y = -offset_mesh_pos;
        group.add(pointMesh1);
        pointMesh1 = linesMesh.clone();
        pointMesh1.position.z = offset_mesh_pos;
        group.add(pointMesh1);
        pointMesh1 = linesMesh.clone();
        pointMesh1.position.z = -offset_mesh_pos;
        group.add(pointMesh1);

        var pointcloud1 = NewPointCloud.clone();
        pointcloud1.position.x = -offset_mesh_pos;
        pointcloud1.position.y = offset_mesh_pos;
        pointcloud1.rotation.x = -offset_mesh_pos;
        group.add(pointcloud1);
        pointcloud1 = NewPointCloud.clone();
        pointcloud1.position.x = offset_mesh_pos;
        pointcloud1.position.y = -offset_mesh_pos;
        pointcloud1.rotation.y = -offset_mesh_pos;
        group.add(pointcloud1);
        pointcloud1 = NewPointCloud.clone();
        pointcloud1.position.x = offset_mesh_pos;
        pointcloud1.position.y = offset_mesh_pos;
        pointcloud1.rotation.z = -offset_mesh_pos;
        group.add(pointcloud1);
        pointcloud1 = NewPointCloud.clone();
        pointcloud1.position.x = -offset_mesh_pos;
        pointcloud1.position.y = -offset_mesh_pos;
        pointcloud1.rotation.x = offset_mesh_pos;
        group.add(pointcloud1);
        pointcloud1 = NewPointCloud.clone();
        pointcloud1.position.x = -offset_mesh_pos;
        pointcloud1.position.z = -offset_mesh_pos;
        pointcloud1.rotation.x = -offset_mesh_pos;
        group.add(pointcloud1);
        pointcloud1 = NewPointCloud.clone();
        pointcloud1.position.x = offset_mesh_pos;
        pointcloud1.position.z = -offset_mesh_pos;
        pointcloud1.rotation.y = -offset_mesh_pos;
        group.add(pointcloud1);
        pointcloud1 = NewPointCloud.clone();
        pointcloud1.position.x = -offset_mesh_pos;
        pointcloud1.position.z = offset_mesh_pos;
        pointcloud1.rotation.z = -offset_mesh_pos;
        group.add(pointcloud1);
        pointcloud1 = NewPointCloud.clone();
        pointcloud1.position.x = offset_mesh_pos;
        pointcloud1.position.z = offset_mesh_pos;
        pointcloud1.rotation.x = offset_mesh_pos;
        group.add(pointcloud1);
        pointcloud1 = NewPointCloud.clone();
        pointcloud1.position.y = offset_mesh_pos;
        pointcloud1.position.z = offset_mesh_pos;
        pointcloud1.rotation.x = offset_mesh_pos;
        group.add(pointcloud1);
        pointcloud1 = NewPointCloud.clone();
        pointcloud1.position.y = -offset_mesh_pos;
        pointcloud1.position.z = offset_mesh_pos;
        pointcloud1.rotation.y = offset_mesh_pos;
        group.add(pointcloud1);
        pointcloud1 = NewPointCloud.clone();
        pointcloud1.position.y = offset_mesh_pos;
        pointcloud1.position.z = -offset_mesh_pos;
        pointcloud1.rotation.z = offset_mesh_pos;
        group.add(pointcloud1);
        pointcloud1 = NewPointCloud.clone();
        pointcloud1.position.y = -offset_mesh_pos;
        pointcloud1.position.z = -offset_mesh_pos;
        pointcloud1.rotation.x = -offset_mesh_pos;
        group.add(pointcloud1);
        pointcloud1 = NewPointCloud.clone();
        pointcloud1.position.x = -offset_mesh_pos;
        group.add(pointcloud1);
        pointcloud1 = NewPointCloud.clone();
        pointcloud1.position.x = offset_mesh_pos;
        group.add(pointcloud1);
        pointcloud1 = NewPointCloud.clone();
        pointcloud1.position.y = offset_mesh_pos;
        group.add(pointcloud1);
        pointcloud1 = NewPointCloud.clone();
        pointcloud1.position.y = -2 * offset_mesh_pos;
        group.add(pointcloud1);
        pointcloud1 = NewPointCloud.clone();
        pointcloud1.position.z = offset_mesh_pos;
        group.add(pointcloud1);
        pointcloud1 = NewPointCloud.clone();
        pointcloud1.position.z = -2 * offset_mesh_pos;
        group.add(pointcloud1);

        ////END--animated mesh
        SceneGroup.add(group);
        groupPos = group.position;
        // console.log(groupPos)

        ////add 3d model on demand
        shape_container = _image;
        shapeHeight = shape_container.clientWidth;
        shapeWidth = shape_container.clientWidth;

        shapeWorld.position.set(0, 0, 0);
        shape_scene.add(shapeWorld);

        var FOV = 70,
            ASPECT = shapeWidth / shapeHeight,
            NEAR = .1,
            FAR = 1000;
        shape_camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR);
        shape_camera.useQuaternion = true;

        shapeWorld.add(shape_camera);
        shape_camera.position.set(shapeWorld.position.x, shapeWorld.position.y, FAR);

        shape_renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        shape_renderer.setSize(shapeWidth, shapeHeight);

        shape_container.appendChild(shape_renderer.domElement);

        shape_controls = new THREE.OrbitControls(shape_camera, shape_renderer.domElement);
        shape_controls.enableZoom = false;
        shape_controls.userZoom = false; //disable zoom on mouse scroll
        shape_controls.enableDamping = true;
        shape_controls.dampingFactor = 0.12;
        shape_controls.enableRotate = true;
        shape_controls.autoRotate = true; //enable rotation
        shape_controls.rotateSpeed = 0.08; //manual rotation speed
        shape_controls.autoRotateSpeed = 1.5; //default rotation speed
        shape_controls.maxPolarAngle = Math.PI / 2;
        shape_controls.enablePan = false;
        shape_controls.minDistance = shapeWidth * (Math.PI / 2);
        shape_controls.maxDistance = shapeWidth * (Math.PI / 2);

        // Using wireframe materials to illustrate shape details.
        var shapeMaterial = new THREE.MeshBasicMaterial({
            color: "#ffffff",
            transparent: true,
            opacity: 0.5,
            wireframe: true,
        });

        // torus
        shape = new THREE.Mesh(new THREE.TorusGeometry(100, 60, 16, 40), shapeMaterial);
        shape.position.set(0, 0, 0);
        shapeGroup.add(shape);

        // torus knot
        shape = new THREE.Mesh(
            new THREE.TorusKnotGeometry(90, 25, 100, 10, 3, 5), shapeMaterial);
        shape.position.set(0, 0, 0);
        shapeGroup.add(shape);
        // cone
        shape = new THREE.Mesh(new THREE.CylinderGeometry(0, 100, 250, 20, 10), shapeMaterial);
        shape.position.set(0, 0, 0);
        shapeGroup.add(shape);
        // sphere
        shape = new THREE.Mesh(new THREE.SphereGeometry(150, 25, 16), shapeMaterial);
        shape.position.set(0, 0, 0);
        shapeGroup.add(shape);
        // dome
        shape = new THREE.Mesh(new THREE.SphereGeometry(150, 25, 16, 0, 2 * Math.PI, 0, Math.PI / 2), shapeMaterial);
        shape.position.set(0, 0, 0);
        shapeGroup.add(shape);

        shape_scene.add(shapeGroup);
        ////End- 3d model

        ////working node--
        $.getJSON("js/data.json", function (data) {
            try {
                _data = data.nodes
                actualElCount = _data.length;
                var counter = 0;
                var _axis = new THREE.Vector3();
                var _tangent = new THREE.Vector3();
                var up = new THREE.Vector3(0, 0, 0);
                for (var index = 0; index < _data.length; index++) {
                    var nodeGeometry = new THREE.DodecahedronGeometry(0.2, 0);
                    var nodeMaterial = new THREE.MeshPhongMaterial({
                        color: '#356596',
                        transparent: true,
                        opacity: '1',
                        emissive: '#000000',
                        // emissiveIntensity: 0.4,
                        specular: '#ffffff',
                        shininess: 40,
                        flatShading: true,
                        needsUpdate: true,
                        blending: THREE.AdditiveBlending,
                        side: THREE.DoubleSide,
                        combine: THREE.MixOperation
                    });
                    nodeMaterial.needsUpdate = true;
                    nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
                    nodeMesh.rotation.set(Math.random * Math.PI / 2 * 1);
                    nodeMesh.material.side = THREE.BackSide; // back faces
                    nodeMesh.renderOrder = 0;

                    nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
                    nodeMesh.material.side = THREE.FrontSide; // front faces
                    nodeMesh.renderOrder = 1;

                    nodeMesh.position.copy(curve.getPointAt(counter * Math.PI / _data.length));
                    _tangent = curve.getTangentAt(counter * Math.PI / _data.length).normalize();
                    _axis.crossVectors(up, _tangent).normalize();
                    var radians = Math.acos(up.dot(_tangent));
                    nodeMesh.quaternion.setFromAxisAngle(_axis, radians);
                    counter += Math.PI * .5 / _data.length;
                    nodeMesh.updateMatrixWorld(true);
                    nodeMesh._id = _data[index].id;
                    nodeMesh.content = _data[index];
                    DataMesh.push(nodeMesh);
                    _linkedGroup.add(nodeMesh);
                }
                DataMesh[0].visible = false;

                // center solid particle mesh Group to middle of node
                _solidGroup.position.x = DataMesh[DataMesh.length - 2].position.x;
                _solidGroup.position.y = DataMesh[DataMesh.length - 2].position.y;
                _solidGroup.position.z = DataMesh[DataMesh.length - 2].position.z;
            } catch {
                console.error("can't load JSON file.");
            }
        });
        SceneGroup.add(_linkedGroup);
        ////End - Working node--

        ////camera
        //camera path
        curve = (function () {
            var vector = new THREE.Vector3();
            var vector2 = new THREE.Vector3();
            return {
                getPointAt: function (t) {
                    t = t * PI2;
                    var x = (Math.cos(t) - Math.sin(3 * t) / 3) * 100;
                    var y = Math.sin(t) * 100;
                    var z = t * 100;
                    return vector.set(x, y, z).multiplyScalar(0.5);
                },
                getTangentAt: function (t) {
                    var delta = 0.001;
                    var t1 = Math.max(0, t - delta);
                    var t2 = Math.min(1, t + delta);
                    return vector2.copy(this.getPointAt(t2))
                        .sub(this.getPointAt(t1)).normalize();
                }
            };
        })();

        //camera path material
        var geometry = new RollerCoasterGeometry(curve, 1500);
        var material = new THREE.MeshBasicMaterial({
            color: "red",
            transparent: true,
            opacity: 1
        });
        var mesh = new THREE.Mesh(geometry, material);

        mesh.visible = false;
        scene.add(mesh);
        // console.log(mesh)
        ////--END -- camera 

        ////add solid mesh
        var trGap = 100;
        var mr = .3,
            mh = .4,
            mrs = 3,
            mhs = 0; //radius, height, radialSegments, heightSegments

        var texture = new THREE.TextureLoader().load('images/texture.jpg');
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.encoding = THREE.sRGBEncoding;
        texture.anisotropy = 16;
        var triGeometry = new THREE.ConeGeometry(mr, mh, mrs, mhs);
        var triMaterial = new THREE.MeshPhongMaterial({
            flatShading: true,
            transparent: true,
            alphaTest: 0.5,
            opacity: '0.7',
            needsUpdate: true,
            side: THREE.DoubleSide,
            shininess: 100,
            blending: THREE.AdditiveBlending,
            color: "#ccc",
            map: texture
        });
        var triMesh = new THREE.Mesh(triGeometry, triMaterial);

        triMesh.geometry.uvsNeedUpdate = true;
        triMesh.matrixWorldNeedsUpdate = true;
        //add multiple, random size mesh
        for (var t = 0; t < canvasWidth; t++) {
            var trPosX = Math.random() * trGap - trGap / 2;
            var trPosY = Math.random() * trGap - trGap / 2;
            var trPosZ = Math.random() * trGap - trGap / 2;
            var triMeshClone = triMesh.clone();
            var trScaleX = Math.random();
            var trScaleY = Math.random();
            var trScaleZ = Math.random();
            triMeshClone.scale.set(trScaleX, trScaleY, trScaleZ);
            triMeshClone.rotation.set(trScaleX, trScaleY, trScaleZ);
            triMeshClone.position.set(trPosX, trPosY, trPosZ);
            _solidGroup.add(triMeshClone);
        }
        SceneGroup.add(_solidGroup);
        // console.log(_solidGroup)
        ////END solid Mesh
    },

    MODEL.prototype.Render = function () {
        this.renderer.render(scene, this.camera);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.camera.matrixWorldNeedsUpdate = true;
    },

    MODEL.prototype.Animate = function () {
        ////animated mesh
        var vertexpos = 0;
        var colorpos = 0;
        var numConnected = 0;

        for (var i = 0; i < worldSize; i++) {
            particlesData[i].numConnections = 0;
        }

        for (var i = 0; i < worldSize; i++) {
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
                    if (numConnected >= 3500) {
                        numConnected++;
                    }
                }
            }
        }
        linesMesh.geometry.attributes.position.needsUpdate = true;
        linesMesh.geometry.attributes.color.needsUpdate = true;
        pointCloud.geometry.attributes.position.needsUpdate = true;
        ////end--animated mesh


        //rotate mesh
        DataMesh.forEach((item) => {
            item.rotation.x += 0.003;
            item.rotation.y += 0.004;
            item.rotation.z += 0.005;
            item.material.needsUpdate = true;
        });

        //click
        if (autoScroll) {
            //set progress of section--
            var sec_pr = document.querySelector("#secProgressBar");
            var sec_calculation = (progress * 100) / (finalProgress);
            sec_pr.style.width = sec_calculation + "%";
            //END--set progress of section--

            if (NowNextNode) {
                progress += velocity;
                world.position.y += 0.3;
            }
            else {
                progress -= velocity;
                world.position.y -= 0.3;
            }
            // console.log(focus_node)
            var autoProgress = progress.toFixed(3);
            // console.log(autoProgress, 'autoProgress')
            if (focus_node == 1) {
                if (autoProgress == initProgress) {
                    scrollCount = 1;
                    smoothScroll = false;
                    autoScroll = false;
                }
            } else if (focus_node == 2) {
                if (autoProgress == 0.225) {
                    smoothScroll = false;
                    autoScroll = false;
                }
            } else if (focus_node == 3) {
                if (autoProgress == 0.350) {
                    smoothScroll = false;
                    autoScroll = false;
                }
            } else if (focus_node == 4) {
                if (autoProgress == 0.485) {
                    smoothScroll = false;
                    autoScroll = false;
                }
            } else if (focus_node == 5) {
                if (autoProgress == finalProgress) {
                    smoothScroll = false;
                    autoScroll = false;
                }
            }
        }

        //control arrow show/hide - based on content
        if (focus_node <= 1) {
            document.querySelector("#sl_prev").classList.add("hide");
        }
        else {
            document.querySelector("#sl_prev").classList.remove("hide");
        } if (focus_node >= actualElCount - 1) {
            document.querySelector("#sl_nxt").classList.add("hide");
        }
        else {
            document.querySelector("#sl_nxt").classList.remove("hide");
        }


        //scroll
        if (smoothScroll) {
            // console.log(focus_node);
            var time = performance.now();

            //set progress of section--
            var sec_pr = document.querySelector("#secProgressBar");
            var sec_calculation = (progress * 100) / (finalProgress);
            sec_pr.style.width = sec_calculation + "%";
            //END--set progress of section--

            if (scrollCount >= 0) {
                if (whellUp) {
                    if (scrollStop <= 0) {
                        progress += velocity;
                        world.position.y += 0.3;
                    }
                } else {
                    progress -= velocity;
                    if (progress < 0) {
                        progress = 0;
                    }
                    world.position.y -= 0.3;
                }
                if (NowPrevNode !== focus_node) {
                    NowPrevNode = focus_node;
                }

                if (progress >= 0 && progress < 0.05) {
                    focus_node = 0;
                }
                if (progress >= 0.100 && progress < 0.120) {
                    focus_node = 1;
                    smoothScroll = false
                } else if (progress >= 0.225 && progress < 0.250) {
                    focus_node = 2;
                    smoothScroll = false
                } else if (progress >= 0.350 && progress < 0.385) {
                    focus_node = 3;
                    smoothScroll = false
                } else if (progress >= 0.485 && progress < 0.505) {
                    focus_node = 4;
                    smoothScroll = false
                } else if (progress >= finalProgress && progress < 0.655) {
                    focus_node = 5;
                    scrollStop = 1;
                    smoothScroll = false
                }

                if (prev_node !== focus_node) {
                    prev_node = focus_node;
                    this.selectedNode();
                }
                ////END camera move--
            }
        }

        ////close data modal
        _closeBtn.addEventListener("click", function () {
            _dataBox.classList.remove("active");
        });
        ////END-close data modal;

        //progress--
        progress = progress % 1;
        // console.log(progress);
        position.copy(curve.getPointAt(progress));
        position.y += 0.5;
        world.position.copy(position);
        tangent.copy(curve.getTangentAt(progress));
        velocity = Math.max(0.005, Math.min(cameraSpeed, velocity));
        setTimeout(() => {
            cameraSpeed -= 0.004;
        }, 200);
        setTimeout(() => {
            cameraSpeed += 0.0006;
        }, 400);
        clearTimeout();
        world.lookAt(lookAt.copy(position).sub(tangent));
        prevTime = time;

        //solid mesh
        for (let index = 0; index < _solidGroup.children.length; index++) {
            var trTotSize = _solidGroup.children.length;
            var trRotateTime = Date.now() * 0.0001;
            _solidGroup.children[index].material.map.rotation = trRotateTime * 0.5;

            if ((index * 2) < trTotSize) {
                _solidGroup.children[index * 2].rotation.set(trRotateTime * 2, trRotateTime, trRotateTime / 2);
            }
            if ((index * 3) < trTotSize) {
                _solidGroup.children[index * 3].rotation.set(0, trRotateTime * 3, 0);
            }
            if ((index * 4) < trTotSize) {
                _solidGroup.children[index * 4].rotation.set(trRotateTime / 4, trRotateTime * 4, trRotateTime * 4);
            }
        }

        //page title focus
        if (focus_node < 1) {
            document.querySelector("#page_title").classList.remove('active');
        }
        else {
            document.querySelector("#page_title").classList.add('active');
        }


        //inner canvas figure/shape
        for (let shapeIndex = 0; shapeIndex < shapeGroup.children.length; shapeIndex++) {
            shapeGroup.children[shapeIndex].visible = false;
        }

        if (shapeCameraPos != null) {
            shapeGroup.children[shapeCameraPos].visible = true;
        }

        shape_camera.updateProjectionMatrix(); // update the camera's frustum
        shape_renderer.render(shape_scene, shape_camera);
        shape_controls.update();
        //END--inner canvas figure/shape


        requestAnimationFrame(this.Animate.bind(this));
        this.Render();
    },

    MODEL.prototype.Resize = function () {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        ////movement
        effect.setSize(window.innerWidth, window.innerHeight);
    },

    MODEL.prototype.Scroll = function (event) {
        scrollSpeed = event.deltaY;
        const _wheelUP = function () {
            if (event.deltaY > 0) {
                if (prev_node !== actualElCount - 1) {
                    scrollCount++
                    scrollStop--;
                    if (scrollStop <= 0) {
                        scrollStop = 0;
                    }
                }
                nowScrollUp = true;
                return true
            } else {
                scrollCount--;
                scrollStop = 0;
                if (scrollCount <= 0) {
                    scrollCount = 1;
                }
                nowScrollUp = false;
                return false
            }
        }
        ////camera move--
        smoothScroll = true;
        //scroll down to next
        whellUp = _wheelUP();
    },

    MODEL.prototype.moveHandle = function (event) {
        event.preventDefault();
        var now_cam = this.camera;

        var raycaster = new THREE.Raycaster();
        var mouseVector = new THREE.Vector3();
        if (selectedObject) {
            tooltips(selectedObject, false, event);
            selectedObject = null;
        }
        var intersects = getIntersects(event.layerX, event.layerY);
        if (intersects.length > 0) {
            var res = intersects.filter(function (res) {
                return res && res.object;
            })[0];
            if (res && res.object) {
                selectedObject = res.object;
                //selectedObject.material.color.set('#ffffff');
                tooltips(selectedObject, true, event);
            }
        }

        function getIntersects(x, y) {
            x = (x / window.innerWidth) * 2 - 1;
            y = -(y / window.innerHeight) * 2 + 1;
            mouseVector.set(x, y, 0.5);
            raycaster.setFromCamera(mouseVector, now_cam);
            return raycaster.intersectObject(_linkedGroup, true);
        }

        //make tooltip function
        function tooltips(data, toggleTooltip, event) {
            var tooltip = document.querySelector('#tooltip');
            tooltip.innerHTML = '';
            if (toggleTooltip) {
                container.style.cursor = 'pointer';
                tooltip.innerHTML = (data.content.name) != null ? (data.content.name) : null;
                TweenMax.to(tooltip, 0.25, {
                    top: event.clientY,
                    left: event.clientX,
                    opacity: 1,
                    onComplete: function () {
                        tooltip.classList.add("open");
                    }
                });
            } else {
                container.style.cursor = 'default';
                tooltip.classList.remove("open");
                TweenMax.to(tooltip, 0.25, {
                    top: window.innerHeight / 2,
                    left: window.innerWidth / 2,
                    opacity: 0
                });
            }
        }

        ////movement
        mouseX = (event.clientX - windowHalfX) / 100;
        mouseY = (event.clientY - windowHalfY) / 100;

        TweenMax.to(SceneGroup.position, 1, {
            x: mouseX * 0.05,
            y: mouseY * 0.08,
        });

        this.camera.lookAt(scene.position);
        effect.render(world, this.camera);
    },

    MODEL.prototype.selectedNode = function () {
        //open modal
        this.openModal(DataMesh[focus_node]);

        //reset all node
        var _thisFocus = DataMesh[focus_node];
        TweenMax.from(_thisFocus.material.color, 0.8, {
            r: hoverValue.r,
            g: hoverValue.g,
            b: hoverValue.b,
            repeat: -1,
            yoyo: true,
            onUpdate: function () {
                TweenMax.to(_thisPrev.scale, 0.7, {
                    x: 1.3,
                    y: 1.3,
                    z: 1.3,
                });
            }
        });

        var _thisPrev = DataMesh[NowPrevNode];
        TweenMax.to(_thisPrev.material.color, 1, {
            r: hoverInitial.r,
            g: hoverInitial.g,
            b: hoverInitial.b,
            onComplete: function () {
                TweenMax.to(_thisPrev.scale, 0.7, {
                    x: 1,
                    y: 1,
                    z: 1,
                });
            }
        });
    },

    MODEL.prototype.ClickHandle = function (event) {
        event.preventDefault();
        var now_cam = this.camera;

        var raycaster = new THREE.Raycaster();
        var mouseVector = new THREE.Vector3();
        if (selectedObject) {
            selectedObject = null;
        }
        var intersects = getIntersects(event.layerX, event.layerY);
        if (intersects.length > 0) {
            var res = intersects.filter(function (res) {
                return res && res.object;
            })[0];
            if (res && res.object) {
                selectedObject = res.object;
                var search_focus = 0;
                for (var srch_item_index = 0; srch_item_index < DataMesh.length; srch_item_index++) {
                    if (parseInt(DataMesh[srch_item_index].content.id) == parseInt(selectedObject.content.id)) {
                        search_focus = srch_item_index;
                    }
                }
                if (NowPrevNode !== focus_node) {
                    NowPrevNode = focus_node;
                }

                if (focus_node !== search_focus) {
                    focus_node = search_focus;
                    prev_node = focus_node;
                    autoScroll = true;
                    this.selectedNode();
                }

                // console.log(NowPrevNode, focus_node);
                if (NowPrevNode > focus_node) {
                    NowNextNode = false;
                }
                else {
                    NowNextNode = true;
                }
            }
        }

        function getIntersects(x, y) {
            x = (x / window.innerWidth) * 2 - 1;
            y = -(y / window.innerHeight) * 2 + 1;
            mouseVector.set(x, y, 0.5);
            raycaster.setFromCamera(mouseVector, now_cam);
            return raycaster.intersectObject(_linkedGroup, true);
        }
        this.camera.lookAt(scene.position);
        effect.render(world, this.camera);

        if (event.target.id == "sl_nxt") {
            disableControlBtn();

            //button action
            if ((focus_node + 1) < actualElCount) {
                NowPrevNode = focus_node;
                focus_node++;
                prev_node = focus_node;
                autoScroll = true;
                NowNextNode = true;
                this.selectedNode();
            }
        }

        if (event.target.id == "sl_prev") {
            disableControlBtn();

            //button action
            if ((focus_node - 1) > 0) {
                NowPrevNode = focus_node;
                focus_node--;
                prev_node = focus_node;
                autoScroll = true;
                NowNextNode = false;
                this.selectedNode();
            }
        }

        function disableControlBtn() {
            //disable the button for a short period
            document.querySelector("#sl_nxt").setAttribute("disabled", true);
            document.querySelector("#sl_nxt").classList.add("disable");
            document.querySelector("#sl_prev").setAttribute("disabled", true);
            document.querySelector("#sl_prev").classList.add("disable");
            setTimeout(function () {
                document.querySelector("#sl_nxt").removeAttribute("disabled");
                document.querySelector("#sl_nxt").classList.remove("disable");
                document.querySelector("#sl_prev").removeAttribute("disabled");
                document.querySelector("#sl_prev").classList.remove("disable");
            }, buttonDisableTime);
            clearTimeout();
        }

    },

    MODEL.prototype.openModal = function (node_data) {
        //reset
        _description.innerHTML = '';
        _header.innerHTML = '';

        //close modal box
        _dataBox.classList.remove("active");

        var TextAction = new TimelineMax()
            .staggerFrom(".anim_box", 1.5, {
                y: 30,
                opacity: 0,
                ease: Expo.easeInOut
            }, 0.06, 1);


        if (node_data.content.name !== null) {
            //add title
            var h2 = document.createElement("h2");
            h2.innerHTML = node_data.content.name;
            _header.appendChild(h2);

            //add 3d model
            if (node_data.content.image !== null) {
                var ShapeName = node_data.content.image;
                //add 3d model
                if (ShapeName == "torus") {
                    shapeCameraPos = 0;
                } else if (ShapeName == "torus_knot") {
                    shapeCameraPos = 1;
                } else if (ShapeName == "cone") {
                    shapeCameraPos = 2;
                } else if (ShapeName == "sphere") {
                    shapeCameraPos = 3;
                } else if (ShapeName == "dome") {
                    shapeCameraPos = 4;
                } else {
                    shapeCameraPos = null;
                }
            } else {
                var ShapeName = '';
            }

            //add content
            if (node_data.content.description !== null) {
                var p = document.createElement("p");
                p.innerHTML = node_data.content.description;
                _description.appendChild(p);
            }


            //set modal height for small height devices
            var nowWindowHeight = window.innerHeight;
            var NowDataBoxHeight = nowWindowHeight -
                parseFloat(getComputedStyle(_dataBox).marginTop) -
                parseFloat(getComputedStyle(_dataBox).marginBottom) -
                parseFloat(document.getElementById("nav_btn").clientHeight) -
                parseFloat(getComputedStyle(document.getElementById("nav_btn")).marginTop) -
                parseFloat(getComputedStyle(document.getElementById("nav_btn")).marginBottom);

            _dataBox.style.maxHeight = NowDataBoxHeight;

            var setHeight = NowDataBoxHeight -
                parseFloat(getComputedStyle(_dataBox).paddingTop) -
                parseFloat(getComputedStyle(_dataBox).paddingBottom) -
                parseFloat(getComputedStyle(document.getElementsByClassName("data_box_inner")[0]).paddingTop) -
                parseFloat(getComputedStyle(document.getElementsByClassName("data_box_inner")[0]).paddingBottom) -
                _header.clientHeight -
                parseFloat(getComputedStyle(_header).marginBottom) -
                parseFloat(getComputedStyle(_image).marginTop) -
                _image.clientHeight -
                parseFloat(getComputedStyle(_description).marginTop) -
                parseFloat(getComputedStyle(_description).marginBottom);

            _description.style.maxHeight = setHeight;
            var nice_bar = jQuery("#node_description");
            nice_bar.niceScroll();
            nice_bar.niceScroll("div.nice-wrapper", {
                cursorwidth: "8px"
            });
            jQuery("#node_description").getNiceScroll().resize();

            //end--height set

            //open modal box
            _dataBox.classList.add("active");
            // 
            //counter-----
            var n0 = document.querySelector("#node0");
            var n1 = document.querySelector("#node1");
            var n2 = document.querySelector("#node2");
            n0.textContent = prev_node;
            n1.textContent = focus_node;
            n2.textContent = actualElCount - 1;
            TweenMax.to("#node0, #node1", 0.9, {
                y: "+=400",
                delay: 0.25,
                ease: Power3.easeInOut,
            });
            TweenMax.set("#node0, #node1", {
                y: "-=400",
            });
            //end--
        }
    };

/*--load function--*/
window.onload = function () {
    var worldModel = new MODEL();
    //check browser support for WEBGL
    if (WEBGL.isWebGLAvailable()) {
        worldModel.Init();
        worldModel.Animate();

        TweenMax.to(document.getElementById("main"), 0.8, {
            opacity: 1,
            onComplete: function () {
                document.body.classList.add("loaded");
            }
        });

        window.onresize = function () {
            worldModel.Resize();
        }
        window.onwheel = function (event) {
            setTimeout(() => {
                smoothScroll = false
            }, 100);
            clearTimeout();
            worldModel.Scroll(event);
        }
        window.onmousemove = function (event) {
            worldModel.moveHandle(event);
        }
        window.onclick = function (event) {
            worldModel.ClickHandle(event);
        }

        //call nav function
        document.querySelector("#nav_btn").onclick = openNav;
        //add nav function
        var submenu = new TimelineMax({
            paused: true
        });
        submenu.staggerTo("#submenu li", 0.3, {
            left: 0,
            autoAlpha: 1
        }, 0.2, 0.3);

        var menu = new TimelineMax({
            paused: true,
            reversed: true
        });

        menu.to("#circle_anim", 0.75, {
            height: "50vh",
            width: "50vh",
            borderRadius: "0 0 0 100%",
            ease: Power2.easeInOut
        });

        function openNav() {
            if (menu.reversed()) {
                menu.play();
                submenu.play().timeScale(1);
                document.querySelector("#submenu").classList.add("active");
                document.querySelector("#nav_btn").classList.add("active");
            } else {
                menu.reverse();
                submenu.reverse();
                document.querySelector("#submenu").classList.remove("active");
                document.querySelector("#nav_btn").classList.remove("active");
            }
        }
    } else {
        var warning = WEBGL.getWebGLErrorMessage();
        container.appendChild(warning);
    }
}
/*--END -- load function--*/

/*--call pre-loader--*/
paceOptions = {
    elements: { selectors: ["body"] },
    ajax: false,
    restartOnRequestAfter: false,
    document: false,
    eventLag: false,
}