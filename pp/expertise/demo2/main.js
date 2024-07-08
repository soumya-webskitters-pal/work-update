
// GLOBAL VARIABLEs
var html = document.documentElement;
var body = document.body;
var body_height = 0;
var scrollY = 0;

var container = document.getElementById('canvas');
var canvasWidth = window.innerWidth,
    canvasHeight = window.innerHeight;

var worldSize = 800;

// var stats;

var scene = new THREE.Scene();

var world = new THREE.Object3D();

scene.add(world);
SceneGroup = new THREE.Group();
scene.add(SceneGroup);

//for scroll
var scrollCount = 0;
var scrollStop = 0;
var prev_node = -1;
var focus_node = 1;

//progress
const progressStep = [0.240, 0.375, 0.525, 0.670];
var nodePositionFocusOffset = 0.3, progressOffset = 0.02;

//click
var NowPrevNode = 0;
var NowNextNode = true; //true goes to next node /false goes to prev node;

var maxParticleCount = worldSize * 2;
var particleCount = worldSize / 1.1;
var r = worldSize;
var pointCloud, particlePositions, pointGeometry, positions, linesMesh, particles, colors, segments;
var rHalf = r / 2;
var group = new THREE.Group();
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
var progress = progressStep[1];
var prevTime = performance.now();
var funfairs = [];
var curve;
var cameraSpeed = 0.005;
var cameraMoveOffset = 0.002;
var PI2 = Math.PI / 2; // path size

//Node
var nodeMesh;
var hoverInitial = new THREE.Color('#356596');
var hoverValue = new THREE.Color('#f85857');
var nodeAnim = false;
var ajax_node_load_flag = false;

////working Node
var currentNode = 0,
    actualElCount = 0;
var _linkedGroup = new THREE.Group();
var DataMesh = [];
var _data = [];
var nodeGap = 150;

//light
var light = new THREE.PointLight("#ffffff", .5);
var DirectionalLight;

//select object
var selectedObject = null;
var NowObjectSelected = false;

//solid mesh
var _solidGroup = new THREE.Group();

//on mouse movement
var windowHalfX = window.innerWidth / 2,
    windowHalfY = window.innerHeight / 2;
var mouseX = 0,
    mouseY = 0;
var groupPos = null;

//load 3d model on demand
var shapeCameraPos = null;

//modal
const _dataBox = document.getElementById('scroll-content');
////////////////////////////

MODEL = function () {
    var camera, renderer, controls;
},
    MODEL.prototype.Init = function () {
        ////PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.001, 4000);
        this.camera.receiveShadow = true;
        this.camera.castShadow = true;
        world.add(this.camera);

        // lights
        var AmbientLight = new THREE.AmbientLight("#000000");
        AmbientLight.castShadow = false;
        SceneGroup.add(AmbientLight);
        DirectionalLight = new THREE.DirectionalLight("#ffffff", .1);
        DirectionalLight.position.set(5000, 600, 300);
        DirectionalLight.castShadow = false;
        SceneGroup.add(DirectionalLight);

        this.camera.add(light);

        //fog
        SceneGroup.fog = new THREE.Fog("#356596", 0.0025, 20);

        // renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            premultipliedalpha: false,
            powerPreference: "high-performance",
            logarithmicDepthBuffer: true,
            physicallyCorrectLights: true,
        });
        this.renderer.setSize(canvasWidth, canvasHeight);
        this.renderer.shadowMap.autoUpdate = false;
        this.renderer.shadowMap.needsUpdate = false;
        container.appendChild(this.renderer.domElement);

        this.SceneLoad();
    },

    MODEL.prototype.SceneLoad = function () {
        ////animated mesh
        segments = 2 * maxParticleCount;
        colors = new Float32Array(segments * 3);
        particles = new THREE.BufferGeometry();
        particlePositions = new Float32Array(maxParticleCount * 3);
        positions = new Float32Array(segments * 3);

        for (var i = 0; i < maxParticleCount; i++) {
            var x = Math.random() * r - r / 2;
            var y = Math.random() * r - r / 2;
            var z = Math.random() * r - r / 2;
            particlePositions[i * 3] = x;
            particlePositions[i * 3 + 1] = y;
            particlePositions[i * 3 + 2] = z;
            particlesData.push({
                velocity: new THREE.Vector3(effectController.velocity, effectController.velocity, effectController.velocity),
                numConnections: 0
            });
        }

        particles.setDrawRange(0, particleCount);
        particles.addAttribute('position', new THREE.BufferAttribute(particlePositions, 3).setDynamic(true));
        pointCloud = new THREE.Points(particles, pMaterial);
        newgeometry = new THREE.BufferGeometry();
        newgeometry.addAttribute('position', new THREE.BufferAttribute(positions, 3).setDynamic(true));
        newgeometry.addAttribute('color', new THREE.BufferAttribute(colors, 3).setDynamic(true));
        var material = new THREE.LineBasicMaterial({
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: .05,
            color: "#adadad"
        });
        linesMesh = new THREE.LineSegments(newgeometry, material);
        linesMesh.visible = true;
        linesMesh.verticesNeedUpdate = true;

        var offset_mesh_scale = 0.05;
        pointCloud.scale.set(offset_mesh_scale, offset_mesh_scale, offset_mesh_scale);
        linesMesh.scale.set(offset_mesh_scale, offset_mesh_scale, offset_mesh_scale);
        group.add(linesMesh);
        group.add(pointCloud);


        var pointMesh1 = linesMesh.clone();
        pointMesh1.position.x = 30;
        pointMesh1.position.y = 10;
        pointMesh1.position.z = 10;
        pointMesh1.rotation.x = 80;
        group.add(pointMesh1);
        pointMesh1 = linesMesh.clone();
        pointMesh1.position.x = -10;
        pointMesh1.position.y = -10;
        pointMesh1.position.z = 50;
        pointMesh1.rotation.y = 15;
        group.add(pointMesh1);
        pointMesh1 = linesMesh.clone();
        pointMesh1.position.x = -10;
        pointMesh1.position.y = -20;
        pointMesh1.position.z = 50;
        pointMesh1.rotation.x = 75;
        group.add(pointMesh1);
        pointMesh1 = linesMesh.clone();
        pointMesh1.position.x = 0;
        pointMesh1.position.y = -20;
        pointMesh1.position.z = 50;
        pointMesh1.rotation.x = -15;
        group.add(pointMesh1);
        pointMesh1 = linesMesh.clone();
        pointMesh1.position.x = -10;
        pointMesh1.position.y = 20;
        pointMesh1.position.z = 20;
        group.add(pointMesh1);
        pointMesh1 = linesMesh.clone();
        pointMesh1.position.x = -20;
        pointMesh1.position.y = 10;
        pointMesh1.position.z = 20;
        group.add(pointMesh1);
        pointMesh1 = linesMesh.clone();
        pointMesh1.position.x = 35;
        pointMesh1.position.y = 2;
        pointMesh1.position.z = 3;
        group.add(pointMesh1);
        pointMesh1 = linesMesh.clone();
        pointMesh1.position.x = 25;
        pointMesh1.position.y = 20;
        pointMesh1.position.z = 30;
        group.add(pointMesh1);
        pointMesh1 = linesMesh.clone();
        pointMesh1.position.x = -20;
        pointMesh1.position.y = 5;
        pointMesh1.position.z = 20;
        pointMesh1.rotation.x = -35;
        group.add(pointMesh1);
        pointMesh1 = linesMesh.clone();
        pointMesh1.position.x = -30;
        pointMesh1.position.y = 5;
        pointMesh1.position.z = 50;
        pointMesh1.rotation.x = -35;
        group.add(pointMesh1);
        pointMesh1 = linesMesh.clone();
        pointMesh1.position.x = -35;
        pointMesh1.position.y = 0;
        pointMesh1.position.z = 25;
        pointMesh1.rotation.x = -35;
        group.add(pointMesh1);
        pointMesh1 = linesMesh.clone();
        pointMesh1.position.x = 10;
        pointMesh1.position.y = -10;
        pointMesh1.position.z = 50;
        pointMesh1.rotation.y = -65;
        group.add(pointMesh1);

        var pointcloud1 = pointCloud.clone();
        pointcloud1.position.x = 30;
        pointcloud1.position.y = 10;
        pointcloud1.position.z = 10;
        pointcloud1.rotation.x = 80;
        group.add(pointcloud1);
        pointcloud1 = pointCloud.clone();
        pointcloud1.position.x = -10;
        pointcloud1.position.y = -10;
        pointcloud1.position.z = 50;
        pointcloud1.rotation.y = 15;
        group.add(pointcloud1);
        pointcloud1 = pointCloud.clone();
        pointcloud1.position.x = -10;
        pointcloud1.position.y = -20;
        pointcloud1.position.z = 50;
        pointcloud1.rotation.x = 75;
        group.add(pointcloud1);
        pointcloud1 = pointCloud.clone();
        pointcloud1.position.x = 0;
        pointcloud1.position.y = -20;
        pointcloud1.position.z = 50;
        pointcloud1.rotation.x = -15;
        group.add(pointcloud1);
        pointcloud1 = pointCloud.clone();
        pointcloud1.position.x = -10;
        pointcloud1.position.y = 20;
        pointcloud1.position.z = 20;
        group.add(pointcloud1);
        pointcloud1 = pointCloud.clone();
        pointcloud1.position.x = -20;
        pointcloud1.position.y = 10;
        pointcloud1.position.z = 20;
        group.add(pointcloud1);
        pointcloud1 = pointCloud.clone();
        pointcloud1.position.x = 35;
        pointcloud1.position.y = 2;
        pointcloud1.position.z = 3;
        group.add(pointcloud1);
        pointcloud1 = pointCloud.clone();
        pointcloud1.position.x = 25;
        pointcloud1.position.y = 20;
        pointcloud1.position.z = 30;
        group.add(pointcloud1);
        pointcloud1 = pointCloud.clone();
        pointcloud1.position.x = -20;
        pointcloud1.position.y = 5;
        pointcloud1.position.z = 20;
        pointcloud1.rotation.x = -35;
        group.add(pointcloud1);
        pointcloud1 = pointCloud.clone();
        pointcloud1.position.x = -30;
        pointcloud1.position.y = 5;
        pointcloud1.position.z = 50;
        pointcloud1.rotation.x = -35;
        group.add(pointcloud1);
        pointcloud1 = pointCloud.clone();
        pointcloud1.position.x = -35;
        pointcloud1.position.y = 0;
        pointcloud1.position.z = 25;
        pointcloud1.rotation.x = -35;
        group.add(pointcloud1);
        pointcloud1 = pointCloud.clone();
        pointcloud1.position.x = 10;
        pointcloud1.position.y = -10;
        pointcloud1.position.z = 50;
        pointcloud1.rotation.y = -65;
        group.add(pointcloud1);

        SceneGroup.add(group);
        var groupClone = group.clone();

        groupClone.rotation.set(25, -40, 10);
        groupClone.position.set(25, 40, 10);
        // console.log(groupClone);
        SceneGroup.add(groupClone);
        ////END--animated mesh

        ////working node--
        $.ajax({
            url: "js/data.json",
            cache: false,
            dataType: "json",
            success: function (data) {
                _data = data.nodes;
                actualElCount = _data.length;
                var counter = 0;
                var _axis = new THREE.Vector3();
                var _tangent = new THREE.Vector3();
                var up = new THREE.Vector3(0, 0, 0);
                for (var index = 0; index < _data.length; index++) {
                    var nodeGeometry = new THREE.DodecahedronBufferGeometry(0.2, 0);

                    var nodeMaterial = new THREE.MeshPhongMaterial({
                        name: "nodeBall",
                        color: '#356596',
                        transparent: true,
                        opacity: '1',
                        emissive: '#000000',
                        emissiveIntensity: 0.4,
                        specular: '#ffffff',
                        shininess: 40,
                        reflectivity: 0.5,
                        needsUpdate: true,
                        blending: THREE.AdditiveBlending,
                        side: THREE.DoubleSide,
                    });
                    nodeMaterial.needsUpdate = true;
                    nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
                    nodeMesh.rotation.set(Math.random * Math.PI / 2 * 1);
                    nodeMesh.material.side = THREE.BackSide; // back faces
                    nodeMesh.renderOrder = 0;
                    nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
                    nodeMesh.material.side = THREE.FrontSide; // front faces
                    nodeMesh.renderOrder = 0;

                    // console.log(nodeMesh)

                    nodeMesh.position.copy(curve.getPointAt(counter * Math.PI / _data.length));
                    _tangent = curve.getTangentAt(counter * Math.PI / _data.length).normalize();
                    _axis.crossVectors(up, _tangent).normalize();
                    var radians = Math.acos(up.dot(_tangent));
                    nodeMesh.quaternion.setFromAxisAngle(_axis, radians);
                    counter += Math.PI * .5 / _data.length;
                    nodeMesh.updateMatrixWorld(true);
                    nodeMesh._id = index;
                    // nodeMesh.content = _data[index];
                    DataMesh.push(nodeMesh);

                    TweenMax.to(DataMesh[index].rotation, 50, {
                        repeat: -1,
                        paused: false,
                        delay: 0,
                        yoyo: true,
                        force3D: "auto",
                        ease: Power0.easeNone,
                        y: 5,
                        z: 2,
                    });

                    TweenMax.to(DataMesh[index].material.color, 0.8, {
                        repeat: -1,
                        paused: false,
                        delay: 0,
                        yoyo: true,
                        force3D: "auto",
                        ease: Power3.easeIn,
                        r: hoverValue.r,
                        g: hoverValue.g,
                        b: hoverValue.b,
                    });

                    _linkedGroup.add(nodeMesh);
                }
                DataMesh[0].visible = false;

                // center solid particle mesh Group to middle of node
                _solidGroup.position.x = DataMesh[DataMesh.length - 2].position.x;
                _solidGroup.position.y = DataMesh[DataMesh.length - 2].position.y;
                _solidGroup.position.z = DataMesh[DataMesh.length - 2].position.z;
            },
            complete: function (e, status) {
                ajax_node_load_flag = true;
            },
            error: function (request, status, error) {
                console.error(status + ", " + error);
            }
        });

        SceneGroup.add(_linkedGroup);
        ////End - Working node--

        //camera path
        curve = (function () {
            var vector = new THREE.Vector3();
            var vector2 = new THREE.Vector3();
            return {
                getPointAt: function (t) {
                    t = t * PI2;
                    var a = 10; // radius
                    var b = 15; // height
                    var t2 = 2 * Math.PI * t * b / 30;

                    var x = Math.cos(t2) * a * 5;
                    var y = Math.sin(t2) * a * 5;
                    var z = b * t * 5;

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
        var geometry = new RollerCoasterGeometry(curve, 0); //give low faces because We hide the RollerCoasterGeometry. 
        var material = new THREE.MeshBasicMaterial({ color: "red" });
        var mesh = new THREE.Mesh(geometry, material);
        // mesh.visible = false;
        scene.add(mesh);
        // console.log(mesh)
        ////--END -- camera 

        ////add solid mesh
        var trGap = 100;
        var mr = .2,
            mh = .3,
            mrs = 3,
            mhs = 0; //radius, height, radialSegments, heightSegments
        var triGeometry = new THREE.ConeBufferGeometry(mr, mh, mrs, mhs);
        var texture = new THREE.TextureLoader().load('images/texture.jpg');
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.encoding = THREE.sRGBEncoding;
        texture.anisotropy = 16;
        var triGeometry = new THREE.ConeBufferGeometry(mr, mh, mrs, mhs);
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

        for (var i = 0; i < canvasWidth; i++) {
            var trPosX = Math.random() * trGap - trGap / 2 + Math.PI / 2;
            var trPosY = Math.random() * trGap - trGap / 2 + Math.PI / 2;
            var trPosZ = Math.random() * trGap - trGap / 2 + Math.PI / 2;
            var trScaleX = Math.random();
            var trScaleY = Math.random();
            var trScaleZ = Math.random();

            var triMeshClone = new THREE.Mesh(triGeometry, triMaterial);
            triMeshClone.position.x = trPosX;
            triMeshClone.position.y = trPosY;
            triMeshClone.position.z = trPosZ;
            triMeshClone.rotation.x = trScaleX;
            triMeshClone.rotation.y = trScaleY;
            triMeshClone.rotation.z = trScaleZ;
            triMeshClone.scale.x = trScaleX;
            triMeshClone.scale.y = trScaleY;
            triMeshClone.scale.z = trScaleZ;
            triMeshClone.geometry.uvsNeedUpdate = true;
            triMeshClone.matrixWorldNeedsUpdate = true;

            _solidGroup.add(triMeshClone);
        }
        SceneGroup.add(_solidGroup);
        // console.log(_solidGroup)
        ////END solid Mesh

        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;

        this.Animate();
    },

    MODEL.prototype.Render = function () {
        this.renderer.render(scene, this.camera);
        //this.renderer.setPixelRatio(window.devicePixelRatio);
        this.camera.matrixWorldNeedsUpdate = true;

        requestAnimationFrame(this.Animate.bind(this));

        // this.controls.update();

        // performance monitor
        // stats.update();
        // document.querySelector('#call').innerHTML = 'draw calls :' + this.renderer.info.render.calls;
    },

    MODEL.prototype.Animate = function () {
        ////animated mesh
        var vertexpos = 0;
        var colorpos = 0;
        var numConnected = 0;

        for (var i = 0; i < maxParticleCount; i++) {
            particlesData[i].numConnections = 0;
        }

        for (var i = 0; i < maxParticleCount; i++) {
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
                    if (numConnected <= maxParticleCount * 2) {
                        numConnected++;
                    }
                }
            }
        }

        linesMesh.geometry.setDrawRange(0, numConnected);
        linesMesh.geometry.attributes.position.needsUpdate = true;
        linesMesh.geometry.attributes.color.needsUpdate = true;
        pointCloud.geometry.attributes.position.needsUpdate = true;
        ////end--animated mesh


        scrollY = window.pageYOffset || html.scrollTop || body.scrollTop || 0;
        if (scrollY > 0) {
            scrollCount = (body_height / scrollY) / 1000;
        }
        else {
            scrollCount = 0;
        }
        // console.log(window.pageYOffset, body_height);

        //progress--
        progress = progress % 1;
        // console.log(progress);
        position.copy(curve.getPointAt(progress));
        position.y += 0.5;
        world.position.copy(position);
        tangent.copy(curve.getTangentAt(progress));
        velocity = Math.max(0.005, Math.min(cameraSpeed, velocity));
        world.lookAt(lookAt.copy(position).sub(tangent));

        //solid mesh
        for (let index = 0; index < _solidGroup.children.length; index++) {
            var trTotSize = _solidGroup.children.length;
            var trRotateTime = Date.now() * 0.0001;

            if ((index * 2) < trTotSize) {
                _solidGroup.children[index * 2].rotation.set(0, trRotateTime, trRotateTime / 2);
            }
            if ((index * 5) < trTotSize) {
                _solidGroup.children[index * 5].rotation.set(trRotateTime, 0, trRotateTime);
            }
        }
        this.Render();
    },

    MODEL.prototype.Resize = function () {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    },

    MODEL.prototype.Scroll = function (event) {
        event.stopImmediatePropagation();
        // deltaY = event.deltaY;
        if (event.deltaY > 0) {
            TweenMax.to(document.getElementById("scrollme"), 0.5, {
                bottom: -100,
                delay: 0.5,
                onComplete: function () {
                    document.getElementById("scrollme").classList.add("close");
                },
            });
            if (progress <= progressStep[progressStep.length - 1]) {
                progress += progressOffset;
            }
        } else {
            if (progress >= progressStep[0]) {
                progress -= progressOffset;
            }
        }

        // //add active class to section in current viewport
        var elem = _dataBox.children;
        for (var i = 0; i < elem.length; i++) {
            if (inView.is(elem[i])) {
                for (j = 0; j < elem.length; j++) {
                    elem[j].classList.remove("active");
                    // if (elem[i].contains("active")) {
                    //     if (elem[i].contains("black_theme")) {
                    //         document.querySelector('.sl_count').classList.add("blackTheme");
                    //     }
                    // }
                }
                elem[i].classList.add("active");
            }
        }
    },

    MODEL.prototype.moveHandle = function (event) {
        ////movement
        mouseX = (event.clientX - windowHalfX) / 100;
        mouseY = (event.clientY - windowHalfY) / 100;

        TweenMax.to(SceneGroup.position, 1, {
            x: mouseX * .08,
            y: mouseY * .3,
        });

        this.camera.lookAt(scene.position);
    },
    /*
        MODEL.prototype.selectedNode = function () {
            TweenMax.to(document.getElementById("scrollme"), 0.5, {
                bottom: -100,
                onComplete: function () {
                    document.getElementById("scrollme").classList.add("close");
                },
            });
    
            // //reset all node
            var _thisPrev = DataMesh[NowPrevNode];
            TweenMax.to(_thisPrev.scale, 0.7, {
                x: 1,
                y: 1,
                z: 1,
            });
        },*/
    /*
        MODEL.prototype.ClickHandle = function (event) {
            /* event.stopImmediatePropagation();
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
             
                     //bottom navigation menu click
                     var menuItemClicked = parseInt(event.target.getAttribute("data-select"));
                     if (menuItemClicked > 0) {
                         NowPrevNode = focus_node;
                         prev_node = focus_node;
                         focus_node = menuItemClicked;
                         if (NowPrevNode < menuItemClicked) {
                             NowNextNode = true;
                             autoScroll = true;
                             this.selectedNode();
                         }
                         else {
                             NowNextNode = false;
                             autoScroll = true;
                             this.selectedNode();
                         }
                     }
    
            if (event.target.id == "scrollme") {
                NowPrevNode = focus_node;
                focus_node++;
                prev_node = focus_node;
    
                autoScroll = true;
                NowNextNode = true;
                this.selectedNode();
                TweenMax.to(document.getElementById("scrollme"), 0.5, {
                    bottom: -100,
                    onComplete: function () {
                        document.getElementById("scrollme").classList.add("close");
                    },
                });
            }
        },*/

    MODEL.prototype.openModal = function (node_data) {
        if (node_data.content.name !== null) {
            //rotating slider counter-----
            var n0 = document.querySelector("#node0");
            var n1 = document.querySelector("#node1");
            var n2 = document.querySelector("#node2");
            n0.textContent = focus_node;
            n1.textContent = NowPrevNode;
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

/*--smooth scroll page--*/
var scroller = {
    target: document.querySelector("#scroll-container"),
    //subTarget: document.querySelector("#canvas"),
    ease: 0.06, // <= scroll speed
    endY: 0,
    y: 0,
    resizeRequest: 1,
    scrollRequest: 0,
};
var requestId = null;
TweenLite.set(scroller.target, {
    rotation: 0.01,
    force3D: true
});
// TweenLite.set(scroller.subTarget, {
//     rotation: 0.05,
//     force3D: true
// });
function onLoad() {
    updateScroller();
    window.focus();
    window.addEventListener("resize", onResize);
    document.addEventListener("scroll", onScroll);
}
function updateScroller() {
    var resized = scroller.resizeRequest > 0;
    if (resized) {
        body_height = document.body.scrollHeight;
        var height = scroller.target.clientHeight;
        body.style.height = height + "px";
        scroller.resizeRequest = 0;
    }
    scrollY = window.pageYOffset || html.scrollTop || body.scrollTop || 0;
    scroller.endY = scrollY;
    scroller.y += (scrollY - scroller.y) * scroller.ease;
    if (Math.abs(scrollY - scroller.y) < 0.05 || resized) {
        scroller.y = scrollY;
        scroller.scrollRequest = 0;
    }
    TweenLite.set(scroller.target, {
        y: -scroller.y,
    });
    // TweenLite.set(scroller.subTarget, {
    //     y: -scroller.y / 3,
    // });
    requestId = scroller.scrollRequest > 0 ? requestAnimationFrame(updateScroller) : null;
}
function onScroll() {
    scroller.scrollRequest++;
    if (!requestId) {
        requestId = requestAnimationFrame(updateScroller);
    }
}
function onResize() {
    scroller.resizeRequest++;
    if (!requestId) {
        requestId = requestAnimationFrame(updateScroller);
    }
}
/*--end scroll smooth--*/

/*--load function--*/
window.onload = function () {
    var worldModel = new MODEL();
    //check browser support for WEBGL
    if (WEBGL.isWebGLAvailable()) {
        //init canvas
        worldModel.Init();

        //show page - remove loader
        showPage();

        window.onresize = function () {
            worldModel.Resize();
        }
        _dataBox.onwheel = function (event) {
            worldModel.Scroll(event);
        }
        window.onmousemove = function (event) {
            worldModel.moveHandle(event);
        }
        // window.onclick = function (event) {
        //     worldModel.ClickHandle(event);
        // }

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

    function showPage() {
        var loader = document.getElementById("loader");
        TweenMax.to(loader, 0.5, {
            opacity: 1,
            onComplete: function () {
                loader.style.pointerEvents = "none";
                clearTimeout(loadTime);
                loader.remove();
                document.body.classList.add("loaded");
                //console.clear();
                body_height = document.body.scrollHeight;
            }
        });

        //smooth scroll function call
        onLoad();
    }
}
/*--END -- load function--*/

