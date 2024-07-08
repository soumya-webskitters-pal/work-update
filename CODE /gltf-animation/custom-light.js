"use strict";
function main() {
  // const gui = new dat.GUI();

  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  // renderer.physicallyCorrectLights = true;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  var mixer;
  const clock = new THREE.Clock();

  //show loader
  const loadingPara = document.createElement("p");
  loadingPara.innerText = "Please Wait, loading...";
  canvas.parentElement.append(loadingPara);

  const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 1000);
  camera.position.set(0, 0, 0.85);
  camera.rotation.set(0.2, 0, 0);

  //HELPER camera
  // const cameraFolder = gui.addFolder("Camera");
  // cameraFolder.add(camera.position, "x", -2, 2);
  // cameraFolder.add(camera.position, "y", -2, 2);
  // cameraFolder.add(camera.position, "z", -2, 2);
  // cameraFolder.add(camera.rotation, "x", -1, 1);
  // cameraFolder.add(camera.rotation, "y", -1, 1);
  // cameraFolder.add(camera.rotation, "z", -1, 1);
  // cameraFolder.open();

  const mouse = new THREE.Vector2();
  const target = new THREE.Vector2();
  const windowHalf = new THREE.Vector2(
    window.innerWidth / 2,
    window.innerHeight / 2
  );
  canvas.addEventListener("mousemove", onMouseMove, false);
  canvas.addEventListener("mouseleave", onMouseLeave, false);

  const scene = new THREE.Scene();
  scene.background = null;

  //create env texture

  const texture = new THREE.TextureLoader().load(
    "https://soumya-webskitters-pal.github.io/threejsfilehost/llm-1.png"
  );
  texture.wrapS = texture.wrapT = 64;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.mapping = THREE.EquirectangularReflectionMapping;

  // {
  //   const light = new THREE.AmbientLight("white", 0);
  //   light.name = "ambientLight";
  //   scene.add(light);
  // }
  // {
  {
    const light = new THREE.PointLight("#ffffff", 5, 2);
    light.position.set(34, -10, 100);
    light.name = "white_pointLight";
    scene.add(light);
  }
  {
    const light = new THREE.PointLight("#000068", 5, 2);
    light.position.set(34, 100, 100);
    light.name = "blue_pointLight";
    scene.add(light);
  }
  {
    new THREE.GLTFLoader().load(
      // "images/web.glb",
      "https://soumya-webskitters-pal.github.io/threejsfilehost/box.glb",
      function (gltf) {
        const root = gltf.scene;
        root.name = "graphBox";
        root.rotation.x = 0.4;
        root.rotation.y = -0.54;

        // console.log(root);
        gltf.scene.traverse(function (node) {
          if (node instanceof THREE.Mesh) {
            console.log(node.material);
            node.material.roughness = 0;
            node.material.metalness = 1;
            // node.material.refractionRatio =1;
            node.material.envMapIntensity = 1.4;
            node.material.envMap = texture;
            node.material.emissiveMap = texture;
            // node.material.lightMap = texture;
            node.material.flatShading = true;
            node.material.needsUpdate = true;
          }
        });

        scene.add(root);

        mixer = new THREE.AnimationMixer(root);
        mixer.clipAction(gltf.animations[0]).play();

        //HELPER shape
        // const cubeFolder = gui.addFolder("shape rotation");
        // cubeFolder.add(root.rotation, "x", -Math.PI * 2, Math.PI * 2);
        // cubeFolder.add(root.rotation, "y", -Math.PI * 2, Math.PI * 2);
        // cubeFolder.add(root.rotation, "z", -Math.PI * 2, Math.PI * 2);
        // cubeFolder.open();
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

  const list = document.querySelectorAll("#graph_list>*");
  if (list != null || list != undefined) {
    list.forEach(function (el, i) {
      el.addEventListener("mouseenter", function (e) {
        list.forEach(function (m) {
          m.classList.remove("active");
        });
        e.target.classList.add("active");
        toggleElement(i + 1);
      });
      el.addEventListener("mouseleave", function (e) {
        toggleElement(null);
        list.forEach(function (m) {
          m.classList.remove("active");
        });
      });

      el.addEventListener("touchenter", function (e) {
        list.forEach(function (m) {
          m.classList.remove("active");
        });
        e.target.classList.add("active");
        toggleElement(i + 1);
      });
      el.addEventListener("touchleave", function (e) {
        toggleElement(null);
        list.forEach(function (m) {
          m.classList.remove("active");
        });
      });
    });
  }
  function toggleElement(itemno) {
    var rootChild = [false, false, false, false];
    if (itemno != null && rootChild.length > itemno) {
      rootChild[itemno] = true;
    } else {
      rootChild = [true, true, true, true];
    }
    scene.getObjectByName("model_geo").visible = rootChild[0]; //op1
    scene.getObjectByName("Animation").visible = rootChild[1]; //op2
    scene.getObjectByName("FULCRUM_LAW").visible = rootChild[2]; //op3
    scene.getObjectByName("Legal_foundation").visible = rootChild[3]; //op4
  }

  function onMouseMove(event) {
    mouse.x = event.clientX - windowHalf.x;
    mouse.y = event.clientY - windowHalf.x;
  }
  function onMouseLeave(event) {
    mouse.x = 0;
    mouse.y = 0;
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
    target.x = (1 - mouse.x) * 0.0002;
    target.y = (1 - mouse.y) * -0.0001;
    scene.rotation.x += 0.05 * (target.y - scene.rotation.x);
    scene.rotation.y += 0.05 * (target.x - scene.rotation.y);

    if (mixer != undefined) {
      mixer.update(clock.getDelta());
    }

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

main();
