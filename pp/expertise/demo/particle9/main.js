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

var scrollCount = 0;
var prev_node = -1;
var disable_scroll = false;
var focus_node = 0;

////for animated mesh
var maxParticleCount = worldSize * 2;
var particleCount = worldSize;
var r = worldSize;
// var maxParticleCount = worldSize;
// var particleCount = worldSize / 4;
// var r = worldSize;
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
var cameraSpeed = 0.005;
var PI2 = Math.PI / 2; // path size

////working Node
var currentNode = 0,
    actualElCount = 0;
var _linkedGroup = new THREE.Group();
var DataMesh = [];
var _data = [];
var nodeGap = 150;

////////////////////////////
MODEL = function () {
        var camera, renderer, controls;
    },
    MODEL.prototype.Init = function () {
        ////PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.5, 4000);
        // this.camera.position.z = 1750;
        this.camera.receiveShadow = true;
        // this.camera.view = this.scene;
        // this.camera.view.autoUpdate = false;
        this.camera.castShadow = true;
        world.add(this.camera);
        // scene.add(this.camera);

        // lights
        var AmbientLight = new THREE.AmbientLight("#FFFFFF");
        SceneGroup.add(AmbientLight);
        var DirectionalLight = new THREE.DirectionalLight("#fff", 1.7);
        DirectionalLight.position.set(-500, 2000, -2000);
        DirectionalLight.position.multiplyScalar(1.3);
        SceneGroup.add(DirectionalLight);

        // renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(canvasWidth, canvasHeight);
        container.appendChild(this.renderer.domElement);

        // controls
        // this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        // this.controls.minPolarAngle = Math.PI * 0.1;
        // this.controls.maxPolarAngle = Math.PI * 0.45;
        // this.controls.enableRotate = true;
        // this.controls.rotateSpeed = 1;
        // this.controls.enableZoom = false;
        // this.controls.zoomSpeed = 1;
        // this.controls.screenSpacePanning = false;
        // this.controls.enablePan = true;
        // this.controls.panSpeed = 1;
        // this.controls.enableDamping = false;
        // this.controls.dampingFactor = 0.3;
        // this.controls.minDistance = 100;
        // this.controls.maxDistance = 12000;
        // this.controls.maxZoom = 1;

        this.SceneLoad();
    },

    MODEL.prototype.SceneLoad = function () {
        //wheel off
        // window.onwheel = function () {
        //     return false;
        // }

        //world box - environment
        var WorldGeometry = new THREE.SphereGeometry(worldSize, worldSize, worldSize);
        var worldMaterial = new THREE.MeshPhongMaterial({
            color: "#0d223b",
            transparent: true,
            opacity: 0,
            shininess: 10,
            specular: "#ffffff",
            side: THREE.DoubleSide
        });
        worldMaterial.color.multiplyScalar(1.7);
        // geometry.rotateX(-Math.PI / 2);
        var worldMesh = new THREE.Mesh(WorldGeometry, worldMaterial);
        worldMesh.castShadow = true;
        worldMesh.receiveShadow = true;
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
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: .2,
            color: "#adadad"
        });
        linesMesh = new THREE.LineSegments(newgeometry, material);
        linesMesh.visible = true;
        linesMesh.verticesNeedUpdate = true
        group.add(linesMesh);
        SceneGroup.add(group);
        var ndPos = [];
        ////END--animated mesh

        ////working node--

        $.getJSON("js/data.json", function (data) {
            try {
                _data = data.nodes
                actualElCount = _data.length;
                var nodeGeometry = new THREE.SphereGeometry(1, 20, 100);
                var counter = 0;
                var _axis = new THREE.Vector3();
                var _tangent = new THREE.Vector3();
                var up = new THREE.Vector3(0, 0, 0);
                for (var index = 0; index < _data.length; index++) {
                    var nodeMaterial = new THREE.MeshStandardMaterial({
                        color: '#0d223b',
                        transparent: false,
                        opacity: '1',
                        emissive: '#356596',
                        emissiveIntensity: 0.3,
                        needsUpdate: true,
                        blending: THREE.AdditiveBlending
                    });
                    nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
                    nodeMesh.position.copy(curve.getPointAt(counter * Math.PI / _data.length));
                    // console.log(curve.getPointAt(counter * Math.PI / _data.length));
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
                // var ConnectLineGeometry = new THREE.TubeGeometry(curve, 20, 2, 8, false);
                // var ConnectLineMaterial = new THREE.MeshBasicMaterial({
                //     color: 0x00ff00
                // });
                // var ConnectLineMesh = new THREE.Mesh(ConnectLineGeometry, ConnectLineMaterial);
                // _linkedGroup.add(ConnectLineMesh);
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
                    var x = (Math.sin(t * 2) * Math.cos(t * 4)) * 450;
                    var y = (Math.sin(t * 3) + Math.cos(t * 7)) * 75;
                    var z = (Math.sin(t * 4) * Math.sin(t * 2)) * 300;
                    return vector.set(x, y, z).multiplyScalar(1);
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
            opacity: 0
        });
        var mesh = new THREE.Mesh(geometry, material);
        //mesh path rotation
        // mesh.rotation.x = Math.PI / 2;
        // mesh.rotation.y = Math.PI / 1.5;
        //console.log(curve);
        scene.add(mesh);
        ////--END -- camera 

        //open modal on 1st time load
        setTimeout(() => {
            this.openModal(DataMesh[focus_node]);
        }, 200);


    },

    MODEL.prototype.Render = function () {
        this.renderer.render(scene, this.camera);
        //this.controls.update();
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
        linesMesh.geometry.setDrawRange(0, numConnected * 3);
        linesMesh.geometry.attributes.position.needsUpdate = true;
        linesMesh.geometry.attributes.color.needsUpdate = true;
        pointCloud.geometry.attributes.position.needsUpdate = true;
        pointCloud.geometry.attributes.position.needsUpdate = true;
        ////end--animated mesh

        requestAnimationFrame(this.Animate.bind(this));
        this.Render();
    },

    MODEL.prototype.Resize = function () {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    },

    MODEL.prototype.Scroll = function (event) {
        const _wheelUP = function () {
            if (event.deltaY > 0) {
                if (prev_node == actualElCount - 1) {
                    disable_scroll = true;
                } else {
                    scrollCount++
                    disable_scroll = false;
                }
                return true
            } else {
                scrollCount--
                if (scrollCount < 0) {
                    scrollCount = 0;
                }
                return false
            }
        }
        ////camera move--
        var time = performance.now();

        for (var i = 0; i < funfairs.length; i++) {
            funfairs[i].rotation.y = time * 0.0004;
        }
        //scroll down to next
        _wheelUP();
        if (scrollCount > 0) {
            if (_wheelUP()) {
                progress += velocity;
                world.position.y += 0.3;
            } else {
                progress -= velocity;
                if (progress <= 0) {
                    progress = 0;
                }
                world.position.y -= 0.3;
            }
            progress = progress % 1;
            // console.log(progress);
            position.copy(curve.getPointAt(progress));
            position.y += 0.3;
            world.position.copy(position);
            tangent.copy(curve.getTangentAt(progress));
            velocity = Math.max(cameraSpeed, Math.min(cameraSpeed, velocity));
            world.lookAt(lookAt.copy(position).sub(tangent));
            prevTime = time;
            for (let item_index = 0; item_index < DataMesh.length; item_index++) {
                // console.log(progress);
                if (progress >= 0 && progress < 0.08) {
                    focus_node = 0;
                }
                if (progress > 0.12 && progress < 0.140) {
                    focus_node = 1;
                } else if (progress > 0.260 && progress < 0.275) {
                    focus_node = 2;
                } else if (progress > 0.40 && progress < 0.415) {
                    focus_node = 3;
                } else if (progress > 0.535 && progress < 0.550) {
                    focus_node = 4;
                } else if (progress > 0.675 && progress < 0.685) {
                    focus_node = 5;
                }
            }
            console.log(focus_node);
            if (prev_node !== focus_node) {
                prev_node = focus_node;
                this.openModal(DataMesh[focus_node]);
            }
            ////END camera move--
        }
    },
    MODEL.prototype.MouseOver = function (event) {
        var _this = this;
        if (document.getElementById('tooltip') != null || document.getElementById('tooltip') != undefined) {
            var tooltip = document.getElementById('tooltip');
            tooltip.innerHTML = '';
            tooltip.innerHTML = (data.content.name) != null ? (data.content.name) : ((data.content.title) != null ? (data.content.title) : '');
        } else {
            const tooltip_container = document.getElementById('outer_box');
            var _tooltip = document.createElement("div");
            _tooltip.setAttribute("id", "tooltip");
            _tooltip.setAttribute("class", "tooltip");
            _tooltip.innerHTML = (data.content.name) != null ? (data.content.name) : ((data.content.title) != null ? (data.content.title) : '');
            tooltip_container.appendChild(_tooltip);
            var tooltip = document.getElementById('tooltip');
        }

        TweenMax.to(tooltip, 0.15, {
            top: event.origDomEvent.clientY,
            left: event.origDomEvent.clientX,
            opacity: 1,
            delay: 0.2
        })
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
    var worldModel = new MODEL;
    worldModel.Init();
    worldModel.Animate();
    window.onresize = function () {
        worldModel.Resize();
    }
    window.onwheel = function (event) {
        worldModel.Scroll(event);
    }
    window.mouseover = function (event) {
        worldModel.MouseOver(event);
    }
}