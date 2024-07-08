var objects = [],
	INTERSECTED, tubeGeometry, binormal = new THREE.Vector3(),
	normal = new THREE.Vector3(),
	tubeMesh;
var r = 1200;
var nEnd = 0,
	nMax, nStep = 90,
	animatedline, __next, __index, scroll_val = 0,
	actual_el_count = 0;
var currentNode = 0;

Model = function () {
		this.scene = null;
		this.camera = null;
		this.pointOfOrigin = null;
		this.app = {};
		this.changes = false;
		this.count = 0;
		this.controls = null;
	}, Model.prototype.Init = function (scene, camera, controls, renderer) {

		var _this = this;
		_this.scene = scene;
		_this.camera = camera;
		_this.controls = controls;
		_this.renderer = renderer

		// DROW DOTS
		var _linkedGroup = new THREE.Group();
		var geometry = new THREE.SphereGeometry(14, 20, 100);
		lineGeometry = new THREE.Geometry();
		curve_geometry = [];

		var domEvents = new THREEx.DomEvents(_this.camera, _this.renderer.domElement)
		maxDist = 100
		DataMesh = []
		var _data = []

		// CREATE TUBE
		$.getJSON("js/data.json", function (data) {
			try {
				_data = data.nodes
				actual_el_count = _data.length;
				// boxG = new THREE.BoxGeometry(600,600,600);
				// boxM = new THREE.MeshStandardMaterial({
				// 	wireframe: true,
				// 	color: 'red'
				// })
				// boxMesh = new THREE.Mesh(boxG,boxM )
				// _this.scene.add(boxMesh);
				var fixed_pos = [
					[635, 351, 163],
					[327, 409, 91],
					[-142, 296, 101],
					[-334, 9, 202],
					[720, -129, -120],
					[0, -300, 0]
				];
				for (let index = 0; index < _data.length; index++) {
					const element = _data[index];

					var Material1 = new THREE.MeshStandardMaterial({ //MeshPhongMaterial 
						color: '#0d223b',
						transparent: false,
						opacity: '.7',
						//shininess: 10,
						emissive: '#356596',
						emissiveIntensity: 0.5,
						needsUpdate: true,
						blending: THREE.AdditiveBlending
					});

					// var pX = Math.random() * r - r / 2,
					// 	pY = Math.random() * r - r / 2,
					// 	pZ = Math.random() * r - r + index / 3

					// var pX = Math.floor(Math.random() * (r - 0 + 1) + 0) / 2,
					// pY =  Math.floor(Math.random() * (r - 0 + 1) + 0) /2,
					// pZ =  Math.floor(Math.random() * (r - 0 + 1) + 0) /2;

					var pX = fixed_pos[index][0],
						pY = fixed_pos[index][1],
						pZ = fixed_pos[index][2];

					const mesh = new THREE.Mesh(geometry, Material1);
					mesh.position.x = pX;
					mesh.position.y = pY;
					mesh.position.z = pZ;
					mesh._id = element.id;
					mesh.content = element;
					// mesh.velocity = new THREE.Vector3(.1, .1, .10);
					// geometry.computeBoundingSphere();
					DataMesh.push(mesh);
					mesh._active = false

					currentNode = 0;

					//click
					domEvents.addEventListener(mesh, 'click', (event) => {
						event.target._active = true;
						isAnimate = true;
						mesh.parent.children.forEach((item) => {
							item.material.color.set('#0d223b');
							item.material.emissive.set('#356596');
						});
						event.target.material.color.set('#f85857');
						event.target.material.emissive.set('#e73827');

						//call camera movement
						mesh.callback = _this.Eventhandle(event.target);

					})

					domEvents.addEventListener(mesh, 'mouseover', (event) => {
						mesh.callback = _this.HoverHandle(event, event.target);
					})
					domEvents.addEventListener(mesh, 'mouseout', (event) => {
						mesh.callback = _this.MouseLeaveHandle(event, event.target);
					})
					_linkedGroup.add(mesh);

				}
				// console.log(_linkedGroup.children[0])
				addLine(_this.scene, _linkedGroup.children[0], _linkedGroup.children[1])
				__next = _linkedGroup.children[1];
				setTimeout(() => {
					_linkedGroup.children[0].material.color.set('#f85857');
					__next.material.color.set('#f85857');
					_linkedGroup.children[0].material.emissive.set('#e73827');
					__next.material.emissive.set('#e73827');
				}, 10);
				_this.openModal(_linkedGroup.children[0])

				_this.scene.add(_linkedGroup)
				_this.scene.updateMatrixWorld(true);
			} catch {
				console.error("can't load JSON file.");
			}
		})

		_this.AddDummy();
		// _this.DrowModel()

	},
	Model.prototype.ClearObject = function () {
		var _this = this;

	},
	Model.prototype.DrowModel = function () {
		var darkMaterial = new THREE.MeshBasicMaterial({
			transparent: true,
			color: "#ffffff",
			opacity: '0.05',
		});
		var _newGroup = new THREE.Group()
		var geometry_small = new THREE.SphereGeometry(1, 20, 100);
		var random = Math.floor(Math.random() * (.5 - 1 + 1) + .5)
		var max = 200
		var pX = Math.floor(Math.random() * (rnd_max - rnd_min + 1) + rnd_min),
			pY = Math.floor(Math.random() * (rnd_max - rnd_min + 1) + rnd_min),
			pZ = Math.floor(Math.random() * (rnd_max - rnd_min + 1) + rnd_min),
			_mesh = new THREE.Mesh(geometry_small, Material);
		var rnd_min = 0,
			rnd_max = 1000 / 2;
		var _this = this;
		for (var i = 0; i < max; i++) {
			var Material = new THREE.MeshStandardMaterial({ //MeshPhongMaterial 
				color: '#ffffff',
				transparent: true,
				opacity: '.3',
				emissive: '#356596',
				emissiveIntensity: 0,
				needsUpdate: true,
				blending: THREE.AdditiveBlending
			});
			var pX = Math.floor(Math.random() * (rnd_max - rnd_min + 1) + rnd_min),
				pY = Math.floor(Math.random() * (rnd_max - rnd_min + 1) + rnd_min),
				pZ = Math.floor(Math.random() * (rnd_max - rnd_min + 1) + rnd_min),
				_mesh = new THREE.Mesh(geometry_small, Material);
			_mesh.position.x = pX;
			_mesh.position.y = pY;
			_mesh.position.z = pZ;
			_mesh._id = i + 1;
			_mesh.scale.x = _mesh.scale.y = _mesh.scale.z = Math.random() * 1 + 0.5;
			_newGroup.add(_mesh);
			lineGeometry.vertices.push(_mesh.position);
		};
		line = new THREE.Line(lineGeometry, darkMaterial);
		// _this.scene.add(line);
		// _this.scene.add(_newGroup)
		line.geometry.verticesNeedUpdate = true;

	},
	Model.prototype.MouseMove = function (event, container) {
		container.style.cursor = 'auto';
		var _this = this;
		var mouse = new THREE.Vector2();
		const projector = new THREE.Projector();
		event.preventDefault();
		objects = DataMesh;
		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

		var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
		projector.unprojectVector(vector, _this.camera);
		var raycaster = new THREE.Raycaster(_this.camera.position, vector.sub(_this.camera.position).normalize());
		var intersects = raycaster.intersectObjects(objects, true);
		if (intersects.length > 0) {
			if (INTERSECTED != intersects[0].object) {
				if (INTERSECTED) {
					INTERSECTED.material.color.set(INTERSECTED.currentHex);
					INTERSECTED = intersects[0].object;
					INTERSECTED.currentHex = INTERSECTED.material.color.get();
					INTERSECTED.material.color.set('#f85857');
					INTERSECTED.material.emissive.set('#e73827');
				}
				container.style.cursor = 'pointer';
				container.style.zIndex = '9999';
			}

		} else {
			if (INTERSECTED) {
				INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
				INTERSECTED = null;
				container.style.cursor = 'auto';
			}

		}
	},
	Model.prototype.AddDummy = function () {
		galaxy_count = window.outerWidth;
		galaxy_size = 6 * (Math.floor(Math.random() * 0.9) + 0.3);
		galaxy_gap = galaxy_count / 2;
		galaxy_pos = 4.0;
		for (var i = 0; i <= galaxy_count; i++) {
			var galaxyGeometry = new THREE.SphereGeometry(galaxy_size, 5, 5);
			var galaxyMaterial = new THREE.MeshBasicMaterial({
				color: 0xffffff,
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
			this.scene.add(galaxyMesh);
		}
	},
	Model.prototype.HoverHandle = function (event, data) {
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
		// console.log(data);
	},
	Model.prototype.MouseLeaveHandle = function () {
		var tooltip = document.querySelector("#tooltip");
		TweenMax.to(tooltip, 0.15, {
			opacity: 0,
			onComplete: function () {
				tooltip.innerHTML = '';
			},
			delay: 0.2
		})

		// console.log(data);
	},

	Model.prototype.Eventhandle = function (data) {
		var _this = this;

		var index = data.parent.children.indexOf(data)
		var next = 1 + index;
		const prevT = _this.scene.getObjectByName('temp');
		console.log(data);
		if (prevT) {
			_this.scene.remove(prevT);
		}
		// var path = new THREE.Path();
		__next = data.parent.children[next];
		if (__next === undefined) {
			__next = data.parent.children[0]
		}
		__next.material.color.set('#f85857');
		__next.material.emissive.set('#e73827');
		__index = data.parent.children[index];
		_this.MouseLeaveHandle(null, data)
		addLine(_this.scene, __index, __next);

		const recent = _this.scene.getObjectByName('temp');
		// console.log(recent)

		// var points = [];
		// for (var i = 0; i < 20; i++) {
		// 	var x = Math.cos((__index.position.x - i)) / 2,
		// 		y = Math.cos((__index.position.y - i)) / 2,
		// 		z = Math.cos((__index.position.z - i)) / 2;
		// 	var x1 = Math.cos((__next.position.x - i)) / 2,
		// 		y1 = Math.cos((__next.position.x - i)) / 2,
		// 		z1 = Math.cos((__next.position.x - i)) / 2;
		// 	points.push(new THREE.Vector3(x, y, z), new THREE.Vector3(x1, y1, z1));
		// }
		// console.log(points)
		// var path = new THREE.CatmullRomCurve3(points);
		// var pathSegments = 512;
		// var tubeRadius = 2;
		// var radiusSegments = 8;
		// var ngeometry = new THREE.TubeGeometry(path, pathSegments, tubeRadius, radiusSegments, true);
		// ngeometry = new THREE.BufferGeometry().fromGeometry(ngeometry);

		// nMax = ngeometry.attributes.position.count;
		// var mmaterial = new THREE.MeshPhongMaterial({
		// 	color: 0x00ffff,
		// 	side: THREE.DoubleSide
		// });
		// mmesh = new THREE.Mesh(ngeometry, mmaterial);
		// mmesh.name = 'temp'
		// _this.scene.add(mmesh);
		// var pos = __index.geometry.parameters.path.getPointAt(t);
		// pos.multiplyScalar(10);

		// _0mesh.geometry.setDrawRange(0, nEnd);
		// console.log(_0mesh)
		// _this.cameraMove(data)
		// OPEN MODAL
		_this.openModal(data)
	},
	Model.prototype.openModal = function (node_data) {
		const _header = document.getElementById('node_headline');
		const _description = document.getElementById('node_description');
		const _image = document.getElementById('node_shape');
		//reset
		_description.innerHTML = '';
		_header.innerHTML = '';
		_image.innerHTML = '';
		closeModal(_header);
		closeDesc(_description);

		if (node_data.content.name != null || node_data.content.name != undefined) {
			//add title
			var h2 = document.createElement("h2");
			h2.innerHTML = node_data.content.name;
			_header.appendChild(h2);

			if (node_data.content.image != null || node_data.content.image != undefined) {
				//add image
				var imgs = document.createElement("img");
				imgs.src = "images/" + node_data.content.image + ".png";
				imgs.alt = node_data.content.image;
				_image.appendChild(imgs)
			}
			//open title modal
			openModal();
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
			_description.appendChild(h1);
			//open description modal
			openDesc();
		}

		//modal animation functions
		function openModal() {
			TweenMax.to(_header.parentNode, 1, {
				height: _header.parentNode.offsetWidth,
				left: "0",
				right: 'auto',
				height: 'auto',
				opacity: 1,
				width: '40%',
				onComplete: function () {
					_header.parentNode.classList.add("active");
				},
				delay: 0.5
			})
		}

		function closeModal() {
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
			TweenMax.to(_description.parentNode, 1, {
				height: _description.parentNode.offsetWidth,
				left: 'auto',
				right: "0",
				height: 'auto',
				opacity: 1,
				width: '40%',
				onComplete: function () {
					_description.parentNode.classList.add("active");
				},
				delay: 0.5
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
	},
	Model.prototype.OnScroll = function (event) {
		const m = this.count + event.deltaY
		this.count += m
		var isActive = false
		var activeIndex = undefined


		// console.log('wheel Start', this.count)
		// console.log('wheel DELAT', event.deltaY)
	},
	Model.prototype.cameraMove = function (item) {
		var _this = this
		var vector = new THREE.Vector3(
			_this.renderer.devicePixelRatio * (event.pageX - this.offsetLeft) / this.width * 2 - 1,
			_this.renderer.devicePixelRatio * (event.pageY - this.offsetTop) / this.height * 2 + 1,
			0.5
		);
		vector.sub(_this.camera.position).normalize()

		// _this.camera.position.sub(item.position).setLength(100).add(item.position);
		this.camera.position.clone().setZ(100), item.z * 2
		new TWEEN.Tween(_this.camera.position)
			.to(item.position)
			.onStart(function () {
				// bb.setFromObject(item);
				// btnMove.disabled = true;
				// _this.camera.position.sub(item.position).setLength(100).add(item.position);
			})
			.onComplete(function () {
				// bb.center(this.camera.target);

				// _this.camera.position.addScaledVector(item, -1000)
			})
			.start();
	}

getDistance = function (start, end) {
	deltaX = start.x - end.x;
	deltaY = start.y - end.y;
	deltaZ = start.z - end.z;
	distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
	return distance;
}
addLine = function (scene, source, target) {
	var ggeometry = new THREE.CatmullRomCurve3(
		[
			new THREE.Vector3(target.position.x, target.position.y, target.position.z),
			new THREE.Vector3(Math.random() * source.position.x / 2, Math.random() * source.position.y / 2, Math.random() * source.position.z / 2),
			new THREE.Vector3(Math.random() * target.position.x / 1, Math.random() * target.position.y / 1, Math.random() * target.position.z / 1),
			new THREE.Vector3(source.position.x, source.position.y, source.position.z),
		]
	);
	ggeometry.verticesNeedUpdate = false;
	//path meterial
	var material = new THREE.MeshBasicMaterial({
		transparent: true,
		color: "#fff",
		opacity: '0',
		needsUpdate: true,
		blending: THREE.AdditiveBlending,
		wireframe: true,
	});
	ggeometry.curveType = 'catmullrom';
	animatedline = new THREE.TubeGeometry(ggeometry, 100, 10, 100, false);
	animatedline.verticesNeedUpdate = true;
	var splineObject = new THREE.Mesh(animatedline, material);
	splineObject.__dirtyVertices = true;
	splineObject.dynamic = false;
	splineObject.name = 'temp'
	scene.add(splineObject);
	return splineObject;
};