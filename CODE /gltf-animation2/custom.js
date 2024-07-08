// load 3d model
const home_tl = gsap.timeline({ pause: true });
// if ($("#home").length) {
//load 3d model
const canvas = document.getElementById("home");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

//show loader
const loadingPara = document.createElement("p");
loadingPara.innerText = "Please Wait, loading...";
canvas.parentElement.append(loadingPara);
loadingPara.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    z-index:-1
  `;
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2.7, 7.5);
const mouse = new THREE.Vector2();
const target = new THREE.Vector2();
const windowHalf = new THREE.Vector2(
  window.innerWidth / 2,
  window.innerHeight / 2
);
window.addEventListener("mousemove", onMouseMove, false);
const scene = new THREE.Scene();
scene.background = new THREE.Color("#c3c3c3");
{
  const light = new THREE.AmbientLight("#ffffff", 2);
  light.name = "ambientLight";
  scene.add(light);
}

{
  new THREE.GLTFLoader().load(
    // resource URL
    "images/house_stylized_v2.glb",
    function (gltf) {
      const root = gltf.scene;
      root.name = "home";

      let grp = new THREE.Group();
      let material = new THREE.LineBasicMaterial({
        color: "#616161",
        side: THREE.FrontSide,
      });
      gltf.scene.traverse(function (node) {
        if (node instanceof THREE.Mesh) {
          let geometry = new THREE.EdgesGeometry(node.geometry);
          let wireframe = new THREE.LineSegments(geometry, material);
          wireframe.name = "home_line";
          wireframe.position.set(0.45, 0, 0);
          wireframe.scale.set(0.845, 0.845, 0.845);

          grp.add(wireframe);

          node.material.flatShading = false;
          node.material.blendDst = 1;
          node.material.needsUpdate = true;
        }
      });
      grp.add(root);

      grp.position.set(0, 0.8, 0);
      grp.rotation.set(0.9, -0.25, 0);
      grp.scale.set(0.6, 0.6, 0.6);
      // grp.position.set(0.8, 0, 0);
      // grp.rotation.set(0, -0.8, 0);
      // grp.scale.set(0.7, 0.7, 0.7);
      grp.name = "homeGroup";
      scene.add(grp);
      
      home_tl
        .fromTo(
          grp.position,
          {
            x: 0,
            y: 0.8,
            z: 0,
          },
          {
            x: 0.8,
            y: 0,
            z: 0,
            duration: 2,
            ease: "expo.inOut",
          }
        )
        .fromTo(
          grp.rotation,
          {
            x: 0.9,
            y: -0.25,
            z: 0,
          },
          {
            x: 0,
            y: -0.8,
            z: 0,
            duration: 2,
            ease: "expo.inOut",
          },
          "<"
        )
        .fromTo(
          grp.scale,
          {
            x: 0.6,
            y: 0.6,
            z: 0.6,
          },
          {
            x: 0.7,
            y: 0.7,
            z: 0.7,
            duration: 2,
            ease: "expo.inOut",
          },
          "<"
        );
    },
    // called while loading is progressing
    function (xhr) {
      let pr = ((xhr.loaded / xhr.total) * 100).toFixed(0);
      if (pr < 100) {
        loadingPara.innerText = "Please Wait, " + pr + "% loaded";
      } else {
        loadingPara.innerText = pr + "% loaded";
        canvas.classList.add("show");
        setTimeout(() => {
          loadingPara.remove();
        }, 3000);
      }
    },
    // called when loading has errors
    function (error) {
      console.error(error);
    }
  );
}
function onMouseMove(event) {
  mouse.x = event.clientX - windowHalf.x;
}
function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}
function render() {
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  target.x = (mouse.x - 1) * 0.00013;
  scene.rotation.y += 0.1 * (target.x - scene.rotation.y);

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}
requestAnimationFrame(render);

home_tl.play();





















