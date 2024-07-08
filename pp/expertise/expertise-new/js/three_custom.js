/*---------------------------
--------- 3d shape ----------
---------------------------*/
jQuery(".shape_g").each(function () {
	//console.log(this.id);
	shape_load(this.id);
});

function shape_load(shape_call) {
	// MAIN
	// standard global variables
	var container, scene, camera, renderer, controls, shapeHeight, shapeWidth, data_shape, shape;

	// custom global variables
	container = document.getElementById(shape_call);
	shapeHeight = document.getElementById(shape_call).clientWidth;
	shapeWidth = document.getElementById(shape_call).clientWidth;

	if (container.id == "torus") {
		data_shape = 1;
	}
	if (container.id == "torus_knot") {
		data_shape = 2;
	}
	if (container.id == "cone") {
		data_shape = 3;
	}
	if (container.id == "sphere") {
		data_shape = 4;
	}
	if (container.id == "dome") {
		data_shape = 5;
	}
	if (container.id == "brain") {
		data_shape = 6;
	}

	init();
	animate();

	// FUNCTIONS 		
	function init() {
		// SCENE
		scene = new THREE.Scene();

		// CAMERA
		var VIEW_ANGLE = 45,
			ASPECT = shapeWidth / shapeHeight,
			NEAR = 0.1,
			FAR = 200000;
		camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
		// Place the camera
		scene.add(camera);
		camera.position.set(0, 150, 400);
		camera.lookAt(scene.position);

		// RENDERER
		if (Detector.webgl)
			renderer = new THREE.WebGLRenderer({
				antialias: true,
				alpha: true
			});
		else
			renderer = new THREE.CanvasRenderer();
		renderer.setSize(shapeWidth, shapeHeight);

		container.appendChild(renderer.domElement);
		// EVENTS
		THREEx.WindowResize(renderer, camera);

		// CONTROLS
		controls = new THREE.OrbitControls(camera, renderer.domElement);
		controls.userZoom = false; //disable zoom on mouse scroll
		controls.enableDamping = true;
		controls.dampingFactor = 0.12;
		controls.autoRotate = true; //enable rotation
		controls.rotateSpeed = 0.08; //manual rotation speed
		controls.autoRotateSpeed = 1.5; //default rotation speed
		controls.maxPolarAngle = Math.PI / 2;

		//////////////////
		// Create Mesh //
		////////////////

		// Using wireframe materials to illustrate shape details.
		var darkMaterial = new THREE.MeshBasicMaterial({
			color: 0x071420,
			transparent: true,
			opacity: 0.5
		});
		var wireframeMaterial = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			wireframe: true
		});
		var multiMaterial = [darkMaterial, wireframeMaterial];

		if (data_shape == 1) {
			// torus
			shape = THREE.SceneUtils.createMultiMaterialObject(
				// radius of entire torus, diameter of tube (less than total radius), 
				// sides per cylinder segment, cylinders around torus ("sides")
				new THREE.TorusGeometry(100, 60, 16, 40),
				multiMaterial);
			shape.position.set(0, 0, 0);
			//console.log(shape);
			scene.add(shape);
		}
		if (data_shape == 2) {
			// torus knot
			shape = THREE.SceneUtils.createMultiMaterialObject(
				// total knot radius, tube radius, number cylinder segments, sides per cyl. segment,
				//  p-loops around torus, q-loops around torus
				new THREE.TorusKnotGeometry(90, 25, 100, 10, 3, 5),
				multiMaterial);
			shape.position.set(0, 0, 0);
			//console.log(shape);
			scene.add(shape);
		}
		if (data_shape == 3) {
			// cone
			shape = THREE.SceneUtils.createMultiMaterialObject(
				// radiusAtTop, radiusAtBottom, height, segmentsAroundRadius, segmentsAlongHeight,
				geometry = new THREE.CylinderGeometry(0, 100, 250, 20, 10),
				multiMaterial);
			shape.position.set(0, 0, 0);
			//console.log(shape);
			scene.add(shape);
		}
		if (data_shape == 4) {
			// sphere
			shape = THREE.SceneUtils.createMultiMaterialObject(
				geometry = new THREE.SphereGeometry(150, 25, 16),
				multiMaterial);
			shape.position.set(0, 0, 0);
			//console.log(shape);
			scene.add(shape);
		}
		if (data_shape == 5) {
			// dome
			shape = THREE.SceneUtils.createMultiMaterialObject(
				new THREE.SphereGeometry(150, 25, 16, 0, 2 * Math.PI, 0, Math.PI / 2),
				multiMaterial);
			// should set material to doubleSided = true so that the 
			//   interior view does not appear transparent.
			shape.position.set(0, 0, 0);
			//console.log(shape);
			scene.add(shape);
		}

		if (data_shape == 6) {
			// brain
			//human_brain();
			var material = new THREE.MeshBasicMaterial({ // Required ForShadows
				transparent: true,
				color: 0xffffff,
				wireframe: true,
				opacity: 0.5
			});


			// Loading model.
			var loader = new THREE.JSONLoader();
			var url = "https://kenoleon.github.io/Front-End-Web-Dev-UI-UX/assets/3dModels/wallyWhale.json"
			loader.load(url, function (geometry) {
				shape = new THREE.Mesh(geometry, material);
				shape.geometry.computeVertexNormals(); //smooth mesh
				shape.position.set(0, 0, 0);
				shape.scale.set(4, 4, 4);
				scene.add(shape);
				//console.log(shape);
			});

		}

	}


	//work on window resize
	function onWindowResize() {
		camera.aspect = shapeWidth / shapeHeight; // set the aspect ratio to match the new browser window aspect ratio
		camera.updateProjectionMatrix(); // update the camera's frustum
		camera.position.set(0, 150, 400);
		camera.lookAt(scene.position);

		renderer.setSize(shapeWidth, shapeHeight); // update the size of the renderer AND the canvas
	}
	window.addEventListener('resize', onWindowResize);


	function animate() {
		//render
		renderer.render(scene, camera);
		//re-render
		requestAnimationFrame(function () {
			animate();
			controls.update();
		});
	}
};
/*-----------------------------
--------- END 3d shape ----------
------------------------------*/



/*-------------------------------
----- particle - animation ------
-------------------------------*/

/*-----------------------------------
----- END particle - animation ------
-----------------------------------*/