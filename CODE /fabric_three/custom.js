"use strict";
/*
fabric.js
*/
var fabric_canvas = document.getElementById("canvas1");
function fabricjs() {
  var canvas1 = new fabric.Canvas(fabric_canvas);
  var rectangle = new fabric.Rect({
    top: 10,
    left: 10,
    fill: "#FF6E27",
    width: 200,
    height: 200,
    transparentCorners: false,
    centeredScaling: true,
    borderColor: "black",
    cornerColor: "black",
    corcerStrokeColor: "black",
  });
  canvas1.add(rectangle);
}

/*
three.js
*/
function threejs() {
  const canvas = document.querySelector(".webgl");
  const scene = new THREE.Scene();
  const textureLoader = new THREE.TextureLoader();
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  // Base camera
  const camera = new THREE.PerspectiveCamera(
    10,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.x = 18;
  camera.position.y = 8;
  camera.position.z = 20;
  scene.add(camera);

  //Controls
  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.enableZoom = true;
  controls.enablePan = false;
  // controls.minDistance = 20;
  // controls.maxDistance = 40;
  // controls.minPolarAngle = Math.PI / 4;
  // controls.maxPolarAngle = Math.PI / 2;
  // controls.minAzimuthAngle = -Math.PI / 80;
  // controls.maxAzimuthAngle = Math.PI / 2.5;

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
  });

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;

  // Materials
  const bakedTexture = new THREE.Texture(fabric_canvas);
  // textureLoader.load(
  // 	"https://rawcdn.githack.com/ricardoolivaalonso/ThreeJS-Room05/ae27bdffd31dcc5cd5a919263f8f1c6874e05400/baked.jpg"
  // );
  bakedTexture.flipY = false;
  //   bakedTexture.encoding = THREE.sRGBEncoding;

  const bakedMaterial = new THREE.MeshBasicMaterial({
    map: bakedTexture,
    // side: THREE.DoubleSide,
    transparent: true,
  });

  //Loader
  const loader = new THREE.GLTFLoader();
  loader.load(
    // "https://rawcdn.githack.com/ricardoolivaalonso/ThreeJS-Room05/ae27bdffd31dcc5cd5a919263f8f1c6874e05400/model.glb",
    "pillow.glb",
    // "shipping_box.glb",
    (gltf) => {
      const model = gltf.scene;

	  var clone_model = model.clone();
      clone_model.scale.set(0.99, 0.99, 0.99);
      clone_model.position.set(1, 2, 1);
    //   clone_model.children[0].material.color="red";
      console.log(clone_model.children[0].material.color);
      scene.add(clone_model);
      
      model.traverse((child) => (child.material = bakedMaterial));
      scene.add(model);
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    }
  );

  ///add new element
  // var n_texture = new THREE.Texture(fabric_canvas);
  // n_texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  // var n_material = new THREE.MeshBasicMaterial({
  // 	map: n_texture,
  // 	transparent: true
  // });
  // n_material.roughness = 0.2;
  // n_material.metalness = 0.6;
  // var n_geometry = new THREE.BoxGeometry(1, 2, 0.5);
  // var n_cube = new THREE.Mesh(n_geometry, n_material);
  // scene.add(n_cube);

  // var n_geometry_clone = n_geometry.clone();
  // var n_material_clone = new THREE.MeshBasicMaterial({
  // 	// transparent: true,
  // 	color: "red"
  // });
  // n_material_clone.roughness = n_material.roughness;
  // n_material_clone.metalness = n_material.metalness;
  // var n_cube_clone = new THREE.Mesh(n_geometry_clone, n_material_clone);
  // n_cube_clone.scale.set(0.99, 0.99, 0.99);

  // n_cube_clone.rotation.x = n_cube.rotation.x = Math.PI / 3;
  // n_cube_clone.rotation.y = n_cube.rotation.y = Math.PI / 3;
  // n_cube_clone.rotation.z = n_cube.rotation.z = Math.PI / 3;
  // scene.add(n_cube_clone);

  // const pointLight = new THREE.PointLight(0xffffff, 0.5);
  // pointLight.position.x = -3;
  // pointLight.position.y = 4;
  // pointLight.position.z = 3;
  // scene.add(pointLight);

    window.addEventListener("resize", () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

  // Animation
  const animate = () => {
    controls.update();
    renderer.render(scene, camera);
    // n_texture
    bakedTexture.needsUpdate = true;

    window.requestAnimationFrame(animate);
  };

  animate();
}

fabricjs();
threejs();
// setTimeout(, 500);
