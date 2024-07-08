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
var cameraSpeed = 0.002;
var PI2 = Math.PI / 2; // path size

//NOde
var nodeMesh;
var hoverInitial = new THREE.Color('#356596');
var hoverValue = new THREE.Color('#f85857');

////working Node
var currentNode = 0,
    actualElCount = 0;
var _linkedGroup = new THREE.Group();
var DataMesh = [];
var _data = [];
var nodeGap = 150;

//light
var light = new THREE.PointLight("#ffffff", 1);
var DirectionalLight;

var selectedObject = null;

////////////////////////////
MODEL = function () {
        var camera, renderer, controls;
    },
    MODEL.prototype.Init = function () {
        ////PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.9, 4000);
        // this.camera.position.z = 1750;
        this.camera.receiveShadow = true;
        // this.camera.view = this.scene;
        // this.camera.view.autoUpdate = false;
        this.camera.castShadow = true;
        world.add(this.camera);
        // scene.add(this.camera);

        // lights
        var AmbientLight = new THREE.AmbientLight("#000000");
        AmbientLight.castShadow = true;
        SceneGroup.add(AmbientLight);
        DirectionalLight = new THREE.DirectionalLight("#fff", 1.7);
        DirectionalLight.position.set(0, 400, 100);
        DirectionalLight.position.multiplyScalar(1.3);
        DirectionalLight.castShadow = true;
        SceneGroup.add(DirectionalLight);
        this.camera.add(light);


        // renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.shadowMap.enabled = true;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(canvasWidth, canvasHeight);
        container.appendChild(this.renderer.domElement);

        //// controls
        // this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        // this.controls.minPolarAngle = Math.PI * 0.1;
        // this.controls.maxPolarAngle = Math.PI * 0.45;
        // this.controls.enableRotate = true;
        // this.controls.rotateSpeed = 1;
        // this.controls.enableZoom = true;
        // this.controls.zoomSpeed = 1;
        // this.controls.screenSpacePanning = false;
        // this.controls.enablePan = true;
        // this.controls.panSpeed = 1;
        // this.controls.enableDamping = false;
        // this.controls.dampingFactor = 0.3;
        // this.controls.minDistance = 0.5;
        // this.controls.maxDistance = 12000;
        // this.controls.maxZoom = 1;

        this.SceneLoad();
    },

    MODEL.prototype.SceneLoad = function () {
        //world box - environment
        var WorldGeometry = new THREE.SphereGeometry(worldSize, worldSize, worldSize);
        var worldMaterial = new THREE.MeshPhongMaterial({
            color: "#0d223b",
            transparent: true,
            opacity: 0,
        });
        worldMaterial.color.multiplyScalar(1.7);
        // geometry.rotateX(-Math.PI / 2);
        var worldMesh = new THREE.Mesh(WorldGeometry, worldMaterial);
        // worldMesh.castShadow = true;
        // worldMesh.receiveShadow = true;
        SceneGroup.add(worldMesh);
        //end world box - environment

        //add dummy particles
        galaxy_count = worldSize * 2;
        galaxy_size = 1 * (Math.floor(Math.random() * 0.9) + 0.3);
        galaxy_gap = galaxy_count / 6;
        galaxy_pos = 4.0;
        for (var i = 0; i <= galaxy_count; i++) {
            var galaxyGeometry = new THREE.SphereGeometry(galaxy_size, 8, 8);
            var galaxyMaterial = new THREE.MeshBasicMaterial({
                color: "#FFFFFF",
                transparent: true,
                opacity: 0.5,
            });
            var galaxyMesh = new THREE.Mesh(galaxyGeometry, galaxyMaterial);
            galaxyMesh.position.x = galaxy_gap * (galaxy_pos * Math.random() - (
                galaxy_pos / 2));
            galaxyMesh.position.y = galaxy_gap * (galaxy_pos * Math.random() - (
                galaxy_pos / 2));
            galaxyMesh.position.z = galaxy_gap * (galaxy_pos * Math.random() - (
                galaxy_pos / 2));
            galaxyMesh.rotation.x = Math.random() * Math.PI;
            galaxyMesh.rotation.y = Math.random() * Math.PI;
            galaxyMesh.rotation.z = Math.random() * Math.PI;
            galaxyMesh.matrixAutoUpdate = true;
            galaxyMesh.updateMatrix();
            SceneGroup.add(galaxyMesh);
        }
        //END--dummy particles

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
        // particles.scale(2, 2, 2);
        group.add(pointCloud);
        newgeometry = new THREE.BufferGeometry();
        newgeometry.addAttribute('position', new THREE.BufferAttribute(positions, 3).setDynamic(true));
        newgeometry.addAttribute('color', new THREE.BufferAttribute(colors, 3).setDynamic(false));
        //newgeometry.computeBoundingSphere();
        // newgeometry.setDrawRange(0, 10);
        var material = new THREE.LineBasicMaterial({
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: .1,
            color: "#adadad"
        });
        linesMesh = new THREE.LineSegments(newgeometry, material);
        linesMesh.visible = true;
        linesMesh.verticesNeedUpdate = true
        group.add(linesMesh);
        var offset_mesh_pos = 150;
        SceneGroup.add(group);
        group.scale.set(0.2, 0.2, 0.2);

        var pointMesh1 = group.clone();
        pointMesh1.position.x = -offset_mesh_pos;
        SceneGroup.add(pointMesh1);
        var pointMesh2 = group.clone();
        pointMesh2.position.x = offset_mesh_pos;
        SceneGroup.add(pointMesh2);
        var pointMesh3 = group.clone();
        pointMesh3.position.y = -offset_mesh_pos;
        SceneGroup.add(pointMesh3);
        var pointMesh4 = group.clone();
        pointMesh4.position.y = offset_mesh_pos;
        SceneGroup.add(pointMesh4);
        var pointMesh5 = group.clone();
        pointMesh5.position.z = -offset_mesh_pos;
        SceneGroup.add(pointMesh5);
        var pointMesh6 = group.clone();
        pointMesh6.position.z = offset_mesh_pos;
        SceneGroup.add(pointMesh6);
        var pointMesh7 = group.clone();
        pointMesh7.position.z = offset_mesh_pos;
        pointMesh7.position.x = offset_mesh_pos;
        SceneGroup.add(pointMesh7);
        var pointMesh8 = group.clone();
        pointMesh8.position.z = -offset_mesh_pos;
        pointMesh8.position.x = -offset_mesh_pos;
        SceneGroup.add(pointMesh8);
        ////END--animated mesh

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
                        shininess: 40,
                        flatShading: true,
                        needsUpdate: true,
                        blending: THREE.AdditiveBlending,
                        side: THREE.DoubleSide
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
                    var x = (Math.sin(t * 5) * Math.cos(t * 8)) * 150;
                    var y = (Math.sin(t * 5) + Math.cos(t * 4)) * 24;
                    var z = (Math.sin(t * 4) * Math.sin(t * 2)) * 150;
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
        geometry = new RollerCoasterGeometry(curve, 1500);
        var material = new THREE.MeshBasicMaterial({
            color: "red",
            transparent: true,
            opacity: 1
        });
        var mesh = new THREE.Mesh(geometry, material);
        mesh.visible = false;

        scene.add(mesh);
        ////--END -- camera 

        //open modal on 1st time load
        setTimeout(() => {
            this.openModal(DataMesh[focus_node]);
        }, 200);
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
                    numConnected++;
                }
            }
        }
        linesMesh.geometry.attributes.position.needsUpdate = true;
        linesMesh.geometry.attributes.color.needsUpdate = true;
        pointCloud.geometry.attributes.position.needsUpdate = true;
        pointCloud.geometry.attributes.position.needsUpdate = true;
        ////end--animated mesh


        //rotate mesh
        DataMesh.forEach((item) => {
            item.rotation.x += 0.003;
            item.rotation.y += 0.004;
            item.rotation.z += 0.005;
            item.material.needsUpdate = true;
        });

        if (smoothScroll) {
            console.log(focus_node);
            var time = performance.now();
            for (var i = 0; i < funfairs.length; i++) {
                funfairs[i].rotation.y = time * 0.0004;
            }
            if (scrollCount > 0) {
                if (whellUp) {
                    if (scrollStop <= 0) {
                        progress += velocity;
                        world.position.y += 0.3;
                    }
                } else {
                    progress -= velocity;
                    if (progress <= 0) {
                        progress = 0;
                    }
                    world.position.y -= 0.3;
                }
                for (let item_index = 0; item_index < DataMesh.length; item_index++) {
                    if (progress >= 0 && progress < 0.06) {
                        focus_node = 0;
                    }
                    if (progress > 0.12 && progress < 0.135) {
                        focus_node = 1;
                        smoothScroll = false
                    } else if (progress > 0.258 && progress < 0.270) {
                        focus_node = 2;
                        smoothScroll = false
                    } else if (progress > 0.395 && progress < 0.405) {
                        focus_node = 3;
                        smoothScroll = false
                    } else if (progress > 0.535 && progress < 0.547) {
                        focus_node = 4;
                        smoothScroll = false
                    } else if (progress > 0.672 && progress < 0.73) {
                        focus_node = 5;
                        scrollStop = 1;
                        smoothScroll = false
                    }
                }
                if (prev_node !== focus_node) {
                    prev_node = focus_node;
                    this.openModal(DataMesh[focus_node]);
                    //reset all node
                    DataMesh.forEach((item) => {
                        item.material.color.set('#356596');
                        // item.material.transparent = true;
                        item.material.needsUpdate = true;
                    });
                    setTimeout(() => {
                        DataMesh[focus_node].material.color.set('#f85857');
                        // DataMesh[focus_node].material.transparent = false;
                        DataMesh[focus_node].material.needsUpdate = true;
                    }, 100);
                }
                ////END camera move--
            }
            progress = progress % 1;
            position.copy(curve.getPointAt(progress));
            position.y += 0.3;
            world.position.copy(position);
            tangent.copy(curve.getTangentAt(progress));
            velocity = Math.max(0.003, Math.min(cameraSpeed, velocity));
            setTimeout(() => {
                cameraSpeed -= 0.002;
            }, 1200);
            setTimeout(() => {
                cameraSpeed += 0.002;
            }, 1500);
            world.lookAt(lookAt.copy(position).sub(tangent));
            prevTime = time;
        }









        /*--demo--*
        //radius, height, radialSegments, heightSegments
        var mr = 5 * Math.random(),
            mh = 10 * Math.random(),
            mrs = 3,
            mhs = 0;
        var triGeometry = new THREE.ConeGeometry(mr, mh, mrs, mhs);
        var triMaterial = new THREE.MeshBasicMaterial({
            flatShading: true,
            transparent: true,
            opacity: '0.1',
            needsUpdate: true,
            blending: THREE.AdditiveBlending,
            color: "#fff",
            wireframe: true,
            side: THREE.DoubleSide
        });

        var triMesh = new THREE.Mesh(triGeometry, triMaterial);
        triMesh.position.set = ((50 * Math.random()), (100 * Math.random()), (140 * Math.random()));
        _linkedGroup.add(triMesh);

        scene.add(_linkedGroup);
        /*--*/










        requestAnimationFrame(this.Animate.bind(this));
        this.Render();
    },

    MODEL.prototype.Resize = function () {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    },

    MODEL.prototype.Scroll = function (event) {
        scrollSpeed = event.deltaY;

        const _wheelUP = function () {
            if (event.deltaY > 0) {
                if (prev_node == actualElCount - 1) {} else {
                    scrollCount++
                    scrollStop--;
                    if (scrollStop < 0) {
                        scrollStop = 0;
                    }
                    document.querySelector("#page_title").classList.add('active');
                }
                return true
            } else {
                scrollCount--;
                scrollStop = 0;
                if (scrollCount < 0) {
                    scrollCount = 0;
                    document.querySelector("#page_title").classList.remove('active');
                }
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
            if (DataMesh[focus_node].content.id != selectedObject.content.id) {
                selectedObject.material.color.set('#356596');
                // selectedObject.material.transparent = true;
            } else {
                selectedObject.material.color.set('#f85857');
            }
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
                selectedObject.material.color.set('#ffffff');
                // selectedObject.material.transparent = false;
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

        function tooltips(data, toggleTooltip, event) {
            var tooltip = document.querySelector('#tooltip');
            tooltip.innerHTML = '';
            if (toggleTooltip) {
                container.style.cursor = 'pointer';
                tooltip.innerHTML = (data.content.name) != null ? (data.content.name) : null;
                TweenMax.to(tooltip, 0.25, {
                    top: event.clientY,
                    left: event.clientX,
                    opacity: 1
                });
            } else {
                container.style.cursor = 'default';
                TweenMax.to(tooltip, 0.25, {
                    top: window.innerHeight / 2,
                    left: window.innerWidth / 2,
                    opacity: 0
                });
            }

        }
    },

    MODEL.prototype.openModal = function (node_data) {
        const _header = document.getElementById('node_headline');
        const _description = document.getElementById('node_description');
        const _image = document.getElementById('node_shape');
        //reset
        _description.innerHTML = '';
        _header.innerHTML = '';
        _image.innerHTML = '';
        closeTitle(_header);
        closeDesc(_description);

        if (node_data.content.name != null || node_data.content.name != undefined) {
            //add title
            var h2 = document.createElement("h2");
            h2.innerHTML = node_data.content.name;
            _header.appendChild(h2);

            if (node_data.content.image != null || node_data.content.image != undefined) {
                //add image
                _image.style.height = '380px';
                var imgs = document.createElement("img");
                imgs.src = "images/" + node_data.content.image + ".png";
                imgs.alt = node_data.content.image;
                _image.appendChild(imgs)
            } else {
                _image.style.height = 0;
            }
            //open title modal
            openTitle();
        }
        if (node_data.content.description != null || node_data.content.description != undefined) {
            //add content
            var p = document.createElement("p");
            p.innerHTML = node_data.content.description;
            _description.appendChild(p);
            //open description modal
            openDesc();
        }

        if (node_data.content.title != null || node_data.content.title != undefined) { //add title
            var h1 = document.createElement("h1");
            h1.innerHTML = node_data.content.title;
            _header.appendChild(h1);
            //open description modal
            openTitle();
        }

        //modal animation functions
        function openTitle() {
            TweenMax.to(_header.parentNode, 2, {
                height: _header.parentNode.offsetWidth,
                left: "0",
                right: 'auto',
                height: 'auto',
                opacity: 1,
                width: '40%',
                onComplete: function () {
                    _header.parentNode.classList.add("active");
                }
            })
        }

        function closeTitle() {
            TweenMax.to(_header.parentNode, 0, {
                opacity: 0,
                left: "-10000px",
                right: 'auto',
                width: 0,
                onComplete: function () {
                    _header.parentNode.classList.remove("active");
                }
            })
        }

        function openDesc() {
            TweenMax.to(_description.parentNode, 2, {
                height: _description.parentNode.offsetWidth,
                left: 'auto',
                right: "0",
                height: 'auto',
                opacity: 1,
                width: '40%',
                onComplete: function () {
                    _description.parentNode.classList.add("active");
                }
            })
        }

        function closeDesc() {
            TweenMax.to(_description.parentNode, 0, {
                opacity: 0,
                left: 'auto',
                right: "-10000px",
                width: 0,
                onComplete: function () {
                    _description.parentNode.classList.remove("active");
                }
            })
        }
    };



window.onload = function () {
    var worldModel = new MODEL();
    worldModel.Init();
    worldModel.Animate();
    window.onresize = function () {
        worldModel.Resize();
    }
    window.onwheel = function (event) {
        setTimeout(() => {
            smoothScroll = false
        }, 250);
        worldModel.Scroll(event);
    }
    window.onmousemove = function (event) {
        worldModel.moveHandle(event);
    }

    document.querySelector("#nav_btn").onclick = openNav;


    //open nav
    function openNav() {
        var clickedBtn = document.querySelector("#nav_btn");
        var navAnimate = document.querySelector("#nav");
        var navAnimateCircle = document.querySelector("#nav_anim");
        var navItem = document.querySelector("#nav_item");
        if (clickedBtn.classList.contains("active")) {
            clickedBtn.classList.remove("active");
            TweenMax.to(navAnimate, 0.25, {
                opacity: 0,
                onComplete: function () {
                    TweenMax.to(navAnimateCircle, 0.30, {
                        opacity: 0,
                        transform: "scale(0)",
                        delay: 0.25,
                        onComplete: function () {
                            navAnimateCircle.classList.remove("active");
                            TweenMax.to(navItem, 0.45, {
                                opacity: 0,
                                delay: 0.45
                            });
                        }
                    });
                }
            });
        } else {
            clickedBtn.classList.add("active");
            TweenMax.to(navAnimate, 0.25, {
                opacity: 1,
                onComplete: function () {
                    TweenMax.to(navAnimateCircle, 0.30, {
                        opacity: 1,
                        transform: "scale(1)",
                        delay: 0.25,
                        onComplete: function () {
                            navAnimateCircle.classList.add("active");
                            TweenMax.to(navItem, 0.45, {
                                opacity: 1,
                                delay: 0.45
                            });
                        }
                    });
                }
            });
        }
    };
}