// GLOBAL VARIABLEs
var html = document.documentElement;
var body = document.body;
var body_height = 0;
// var scrollY = 0.2;

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
var supportsWheel = false;
var total_node = 5;
var prev_node = 0;
var focus_node = 0;
var autoScroll = false;

//canvas progress
const progressStep = [0.110, 0.245, 0.375, 0.525, 0.675, 0.750];
var nodePositionFocusOffset = 0.3,
    progressOffset = 0.001;

var maxParticleCount = worldSize * 2;
var particleCount = worldSize / 1.1;
var r = worldSize;
var pointCloud, particlePositions, pointGeometry, positions, linesMesh, particles, colors, segments;
var rHalf = r / 2;
var group = new THREE.Group();

////color variable
var hoverInitial = new THREE.Color('#8faadc');
var hoverValue = new THREE.Color('#f85857');
var lightValue = new THREE.Color('#c1c1c1');
var shadowValue = new THREE.Color('#000000');

var pMaterial = new THREE.PointsMaterial({
    color: shadowValue,
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
var cameraSpeed = 0.005;
var cameraMoveOffset = 0.002;
var PI2 = Math.PI / 2; // path size

//Node
var nodeMesh;
var nodeAnim = false;
var ajax_node_load_flag = false;

////working Node
var currentNode = 0,
    actualElCount = 5;
var _linkedGroup = new THREE.Group();
var DataMesh = [];
var _data = [];
var nodeGap = 150;

//light
var light = new THREE.PointLight(lightValue, .5);
var DirectionalLight;

//solid mesh
var _solidGroup = new THREE.Group();

//on mouse movement
var windowHalfX = window.innerWidth / 2,
    windowHalfY = window.innerHeight / 2;
var mouseX = 0,
    mouseY = 0;
var groupPos = null;

////navigation
var header = document.querySelector(".main-head");
var navigation = document.querySelector(".navigation");

//page section scene 
var controller;
var slides = document.querySelectorAll("section.section");
var MagicScene;
var current_scene_selector = 0;
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
            opacity: 0.2,
            color: new THREE.Color('#000000')
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
                total_node = _data.length - 1;
                var counter = 0;
                var _axis = new THREE.Vector3();
                var _tangent = new THREE.Vector3();
                var up = new THREE.Vector3(0, 0, 0);
                for (var index = 0; index < _data.length; index++) {
                    var nodeGeometry = new THREE.DodecahedronBufferGeometry(0.2, 0);

                    var nodeMaterial = new THREE.MeshStandardMaterial({
                        name: "nodeBall",
                        color: hoverValue,
                        transparent: true,
                        opacity: '0.8',
                        emissive: shadowValue,
                        emissiveIntensity: 0.2,
                        specular: hoverValue,
                        shininess: 100,
                        reflectivity: 100,
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

                    ////NOTE: for node blink
                    // TweenMax.to(DataMesh[index].material.color, 0.8, {
                    //     repeat: -1,
                    //     paused: false,
                    //     delay: 0,
                    //     yoyo: true,
                    //     force3D: "auto",
                    //     ease: Power3.easeIn,
                    //     r: hoverValue.r,
                    //     g: hoverValue.g,
                    //     b: hoverValue.b,
                    // });

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
        var material = new THREE.MeshBasicMaterial({ color: hoverValue });
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
            alphaTest: 0.05,
            opacity: '0.7',
            needsUpdate: true,
            side: THREE.DoubleSide,
            shininess: 100,
            blending: THREE.AdditiveBlending,
            color: hoverInitial,
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

        //// init ScrollMagic
        controller = new ScrollMagic.Controller({
            globalSceneOptions: {
                triggerHook: 'onLeave',
                // triggerHook: "onEnter",
                // triggerHook: "onCenter",
                duration: "100%"
            }
        });
        // get all slides and create scene for every slide
        for (var q = 0; q < slides.length - 1; q++) {
            MagicScene = new ScrollMagic.Scene({
                triggerElement: slides[q],
                //indent: 0,//for IE support
                // offset: -header.clientHeight,
                //duration: header.clientHeigh, /* How many pixels to scroll / animate */
            })
                // .setPin(slides[q], {
                //     pushFollowers: false
                // })
                .setClassToggle(slides[q], "active")
                .on("progress", function (e) {
                    var progressvalue = Math.floor(100 * e.progress);
                    if (e.state == "BEFORE") {
                        if (progressvalue == 0) {
                            current_scene_selector--;
                        }
                    }
                    if (e.state == "AFTER") {
                        if (progressvalue == 100) {
                            current_scene_selector++;
                        }
                    }

                    ////add Class to body.
                    if (slides[current_scene_selector].classList.contains("darkTheme")) {
                        document.body.classList.add("dark");
                        document.body.classList.remove("light");
                    }
                    if (slides[current_scene_selector].classList.contains("lightTheme")) {
                        document.body.classList.add("light");
                        document.body.classList.remove("dark");
                    }
                    //console.log("countScene", current_scene_selector);
                    // console.log('progress-', progressvalue + "%", 'currentScene-', e.currentTarget);
                    if (slides[0].classList.contains("active")) {
                        slides[0].parentElement.classList.add("fixed_box");
                    }

                    if (Math.abs(prev_node - focus_node) == 0) {
                        autoScroll = false;
                        prev_node = 0;
                        focus_node = 1;
                    }

                    MODEL.prototype.pageAnimation(e);
                })
                .on("enter", function (event) {
                    if (current_scene_selector != 0) {
                        prev_node = focus_node;
                    }
                    focus_node = current_scene_selector;
                    autoScroll = true;
                })
                .on("leave", function (event) {
                })
                // .addIndicators() // add indicators (requires plugin)
                // .setTween(tween)
                .addTo(controller);

            if (current_scene_selector == 1) {
                MagicScene.removePin();
                slides[0].parentElement.classList.remove("fixed_box");
            }
        }

        MagicScene.setPin(slides[0], {
            pushFollowers: false
        });
        MagicScene.update(true);
        //// END ScrollMagic


        ////svg button animation -- function
        function svgBtnAnim() {
            var speed = 800,
                easing = mina.backout;

            [].slice.call(document.querySelectorAll('.svgBtn')).forEach(function (el) {
                var s = Snap(el.querySelector('svg')), path = s.select('path'),
                    pathConfig = {
                        from: path.attr('d'),
                        to: el.getAttribute('data-path-hover')
                    };

                el.addEventListener('mouseenter', function () {
                    path.animate({ 'path': pathConfig.to }, speed, easing);
                });

                el.addEventListener('mouseleave', function () {
                    path.animate({ 'path': pathConfig.from }, speed, easing);
                });
            });
        }
        //Initialization svg button animation
        svgBtnAnim();
        ////ENDsvg button animation -- function

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

        //progress--
        progress = progress % 1;
        // console.log(progress);
        position.copy(curve.getPointAt(progress));
        position.y += 0.4;
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

        //move node
        // console.log("focus_node--", focus_node, "prev_node--", prev_node);
        if (autoScroll) {
            //backword scene movement
            if (prev_node > focus_node) {
                if (progress.toFixed(3) == progressStep[focus_node - 1]) {
                    autoScroll = false;
                }
                else {
                    progress -= progressOffset * (Math.abs(focus_node - prev_node));
                }
            }
            //forward scene movement
            if (prev_node < focus_node) {
                for (var j = 0; j < total_node; j++) {
                    if (focus_node == j + 1) {
                        if (progress.toFixed(3) == progressStep[j]) {
                            autoScroll = false;
                        }
                        else {
                            progress += progressOffset * Math.abs(focus_node - prev_node);
                        }
                    }
                }
            }
        }
        //console.log(progress.toFixed(3));
        //end move node

        if (current_scene_selector >= 1) {
            header.classList.add("nav_fix");
            document.body.classList.add("nav_now_stickey");
            document.getElementById("scrollme").classList.remove("close");
        }
        else {
            header.classList.remove("nav_fix");
            document.body.classList.remove("nav_now_stickey");
            document.getElementById("scrollme").classList.add("close");
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
    },

    // MODEL.prototype.ClickHandle = function (event) {
    // },

    MODEL.prototype.moveHandle = function (event) {
        ////create parallax function
        $.fn.parallax = function (resistance, mouse) {
            $el = $(this);
            TweenMax.to($el, 0.2, {
                x: -((mouse.clientX - (window.innerWidth / 2)) / resistance),
                y: -((mouse.clientY - (window.innerHeight / 2)) / resistance)
            });
        };

        //intro page
        $('.backgroundImg').parallax(-30, event);
        $('.cloud1').parallax(20, event);

        ////canvas scene movement
        mouseX = (event.clientX - windowHalfX) / 100;
        mouseY = (event.clientY - windowHalfY) / 100;
        TweenMax.to(SceneGroup.position, 1, {
            x: mouseX * .06,
            y: mouseY * .02,
        });

        this.camera.lookAt(scene.position);
        ////END canvas scene movement


        ////open close Menu On Hover
        $('body').on('mouseenter mouseleave', '.nav-item', function (e) {
            if ($(window).width() > 750) {
                var _d = $(e.target).closest('.nav-item'); _d.addClass('show');
                setTimeout(function () {
                    _d[_d.is(':hover') ? 'addClass' : 'removeClass']('show');
                }, 1);
            }
        });
    },


    MODEL.prototype.pageAnimation = function (e) {
        ////Intro text animation
        // inView(".moveboxText")
        //     .on('enter', el => {
        //         var intro_selector = $(el);
        //         TweenMax.set(intro_selector, {
        //             // yPercent: 100,
        //             bottom: '-100%',
        //         });
        //         TweenMax.to(intro_selector, 1, {
        //             // yPercent: 0,
        //             bottom: '8%',
        //             ease: "power4.out",
        //         });
        //     })
        //     .on('exit', el => {
        //         var intro_selector = $(el);
        //         TweenMax.set(intro_selector, {
        //             //yPercent: 100,
        //             bottom: '-100%',
        //         });
        //     })

        ////each section content animation
        inView(".section-inner")
            .on('enter', el => {
                var sec_selector = $(el);
                TweenMax.set(sec_selector, {
                    yPercent: 10,
                });
                TweenMax.to(sec_selector, 1, {
                    yPercent: 0,
                    ease: "power4.out",
                });
            })
            .on('exit', el => {
                var sec_selector = $(el);
                TweenMax.set(sec_selector, {
                    yPercent: 10,
                });
            });

        ////hexagon animation
        inView(".hexagon_shape")
            .on('enter', el => {
                var hoxagon_selector = $(el);
                TweenMax.set(hoxagon_selector, {
                    y: -150,
                    opacity: 0,
                    onComplete: function () {
                        hoxagon_selector.removeClass("show");
                    }
                });
                TweenMax.set(hoxagon_selector.find(".node_data"), {
                    y: 80,
                    opacity: 0,
                });
                TweenMax.to(hoxagon_selector, 0.4, {
                    y: 0,
                    opacity: 1,
                    onComplete: function () {
                        hoxagon_selector.addClass("show");
                        TweenMax.to($(hoxagon_selector).find(".node_data"), 0.4, {
                            y: 0,
                            delay: 2,
                            opacity: 1,
                        });
                    }
                });
                //}
            })
            .on('exit', el => {
                var hoxagon_selector = $(el);
                TweenMax.set(hoxagon_selector, {
                    y: -150,
                    opacity: 0,
                    onComplete: function () {
                        hoxagon_selector.removeClass("show");
                    }
                });
                TweenMax.set(hoxagon_selector.find(".node_data"), {
                    y: 80,
                    opacity: 0,
                });
            });

        ////image animation
        inView(".anim_img")
            .on('enter', el => {
                var img_selector = $(el);
                TweenMax.set(img_selector, {
                    y: 120,
                });
                TweenMax.to(img_selector, 2, {
                    y: 0,
                    ease: "elastic.out(1, 0.3)",
                    yoyo: true,
                });
            })
            .on('exit', el => {
                var img_selector = $(el);
                TweenMax.set(img_selector, {
                    y: 120,
                });
            });
    }
/*--load function--*/
window.onload = function () {
    var worldModel = new MODEL();
    //check browser support for WEBGL
    if (WEBGL.isWebGLAvailable()) {
        //init canvas
        worldModel.Init();

        //show page - remove loader
        showPage();

        //page resize EventListener
        document.addEventListener('resize', function () {
            worldModel.Resize();
        });

        //mouse scroll EventListener
        document.addEventListener('wheel', call_whell);
        document.addEventListener('mousewheel', call_whell);
        document.addEventListener('DOMMouseScroll', call_whell);
        // document.addEventListener('touchmove', call_whell);
        function call_whell(event) {
            /* Check whether the wheel event is supported. */
            if (event.type == "wheel") supportsWheel = true;
            else if (supportsWheel) return;
            worldModel.Scroll(event);
        }

        //keyboard down button EventListener
        //document.addEventListener("keydown", onKeyDown);

        //mouse move EventListener
        document.addEventListener('mousemove', call_touch);
        // document.addEventListener('touchmove', call_touch);
        function call_touch(event) {
            worldModel.moveHandle(event);
        }

        //click EventListener
        document.addEventListener('touchstart', function (event) {
            worldModel.ClickHandle(event);
        });
        document.addEventListener('click', function (event) {
            worldModel.ClickHandle(event);
        });

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
    }
}
/*--END -- load function--*/