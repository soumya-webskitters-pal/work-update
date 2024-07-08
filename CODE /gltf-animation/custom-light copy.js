"use strict";

/* global THREE */

function main() {
  //HELPER
  const gui = new dat.GUI();

  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  // renderer.toneMapping = THREE.ACESFilmicToneMapping;
  // renderer.outputEncoding = THREE.sRGBEncoding;
  // renderer.toneMappingExposure =1;

  var mixer;
  const clock = new THREE.Clock();

  //show loader
  const loadingPara = document.createElement("p");
  loadingPara.innerText = "Please Wait, loading...";
  canvas.parentElement.append(loadingPara);

  const camera = new THREE.PerspectiveCamera(45, 2, 0.01, 50);
  camera.position.set(0.52, 0.95, 0.95);

  //HELPER camera
  const cameraFolder = gui.addFolder("Camera");
  cameraFolder.add(camera.position, "x", 0, 10);
  cameraFolder.add(camera.position, "y", 0, 10);
  cameraFolder.add(camera.position, "z", 0, 10);
  cameraFolder.add(camera.rotation, "x", -90, 90);
  cameraFolder.add(camera.rotation, "y", -90, 90);
  cameraFolder.add(camera.rotation, "z", -90, 90);
  cameraFolder.open();

  // const controls = new THREE.OrbitControls(camera, canvas);
  // controls.target.set(0, 5, 0);
  // controls.update();
  // controls.addEventListener("change", (event) => {
  //   console.log("target", controls.target);
  //   console.log("position", controls.object.position);
  // });

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
  const texture = new THREE.TextureLoader().load("images/llm-1.png");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.mapping = THREE.EquirectangularReflectionMapping;

  {
    const light = new THREE.AmbientLight("white", 1.5);
    light.name = "ambientLight";
    scene.add(light);
  }
  {
    // const light = new THREE.DirectionalLight("#0d7271", 3);
    // scene.add(light);
    // scene.add(new THREE.DirectionalLightHelper(light, 0.25));
    //   const cubeFolder = gui.addFolder("cyan_DirectionalLight");
    // cubeFolder.add(light.position, "x", -5, 5);
    // cubeFolder.add(light.position, "y", -5, 5);
    // cubeFolder.add(light.position, "z", -5, 5);
    // cubeFolder.add(light.rotation, "x", -5, 5);
    // cubeFolder.add(light.rotation, "y", -5, 5);
    // cubeFolder.add(light.rotation, "z", -5, 5);
    // cubeFolder.open();
  }
  //cyan_pointLight
  // {
  //   const light = new THREE.PointLight("#0d7271", 0.5, 0.2);
  //   light.position.set(-54, 254, -165);
  //   light.name = "cyan_pointLight";
  //   scene.add(light);
  //   scene.add(new THREE.PointLightHelper(light, 1));
  //   //HELPER light
  //   const cubeFolder = gui.addFolder("cyan_pointLight");
  //   cubeFolder.add(light.position, "x", -500, 500);
  //   cubeFolder.add(light.position, "y", -500, 500);
  //   cubeFolder.add(light.position, "z", -500, 500);
  //   cubeFolder.open();
  // }
  //dark_blue_pointLight
  /*{
    const light = new THREE.PointLight("#061a5d", 0.8, 1);
    light.position.set(24, 68, -21);
    light.name = "dark_blue_pointLight";
    scene.add(light);
    scene.add(new THREE.PointLightHelper(light, 1));

    //HELPER light
    const cubeFolder = gui.addFolder("dark_blue_pointLight");
    cubeFolder.add(light.position, "x", -500, 500);
    cubeFolder.add(light.position, "y", -500, 500);
    cubeFolder.add(light.position, "z", -500, 500);
    cubeFolder.open();
  }
  //dark_blue2_pointLight
  {
    const light = new THREE.PointLight("#061a5d", 0.8, 1);
    light.position.set(45, -11, -11);
    light.name = "dark_blue2_pointLight";
    scene.add(light);
    scene.add(new THREE.PointLightHelper(light, 1));

    //HELPER light
    const cubeFolder = gui.addFolder("dark_blue2_pointLight");
    cubeFolder.add(light.position, "x", -500, 500);
    cubeFolder.add(light.position, "y", -500, 500);
    cubeFolder.add(light.position, "z", -500, 500);
    cubeFolder.open();
  }
  //pink_pointLight
  {
    const light = new THREE.PointLight("#920e78", 0.5, 0.5);
    light.position.set(-209, -198, 111);
    light.name = "pink_pointLight";
    scene.add(light);
    scene.add(new THREE.PointLightHelper(light, 1));

    //HELPER light
    const cubeFolder = gui.addFolder("pink_pointLight");
    cubeFolder.add(light.position, "x", -500, 500);
    cubeFolder.add(light.position, "y", -500, 500);
    cubeFolder.add(light.position, "z", -500, 500);
    cubeFolder.open();
  }
  //pink2_pointLight
  {
    const light = new THREE.PointLight("#920e78", 0.5, 0.5);
    light.position.set(-33, -11, 12);
    light.name = "pink2_pointLight";
    scene.add(light);
    scene.add(new THREE.PointLightHelper(light, 1));

    //HELPER light
    const cubeFolder = gui.addFolder("pink2_pointLight");
    cubeFolder.add(light.position, "x", -500, 500);
    cubeFolder.add(light.position, "y", -500, 500);
    cubeFolder.add(light.position, "z", -500, 500);
    cubeFolder.open();
  }
  //pink3_pointLight
  {
    const light = new THREE.PointLight("#920e78", 0.02, 1);
    light.position.set(260, -33, -126);
    light.name = "pink3_pointLight";
    scene.add(light);
    scene.add(new THREE.PointLightHelper(light, 1));

    //HELPER light
    const cubeFolder = gui.addFolder("pink3_pointLight");
    cubeFolder.add(light.position, "x", -500, 500);
    cubeFolder.add(light.position, "y", -500, 500);
    cubeFolder.add(light.position, "z", -500, 500);
    cubeFolder.open();
  }
  //yellow_pointLight
  {
    const light = new THREE.PointLight("#978e07", 0.3, 0.5);
    light.position.set(-225, -304, 12);
    light.name = "yellow_pointLight";
    scene.add(light);
    scene.add(new THREE.PointLightHelper(light, 1));

    //HELPER light
    const cubeFolder = gui.addFolder("yellow_pointLight");
    cubeFolder.add(light.position, "x", -500, 500);
    cubeFolder.add(light.position, "y", -500, 500);
    cubeFolder.add(light.position, "z", -500, 500);
    cubeFolder.open();
  }
  //green_pointLight
  {
    const light = new THREE.PointLight("#074d23", 0.3, 0.8);
    light.position.set(-165, -145, -45);
    light.name = "green_pointLight";
    scene.add(light);
    scene.add(new THREE.PointLightHelper(light, 1));

    //HELPER light
    const cubeFolder = gui.addFolder("green_pointLight");
    cubeFolder.add(light.position, "x", -500, 500);
    cubeFolder.add(light.position, "y", -500, 500);
    cubeFolder.add(light.position, "z", -500, 500);
    cubeFolder.open();
  }
  //light_green_pointLight
  {
    const light = new THREE.PointLight("#477d08", 0.3, 0.8);
    light.position.set(35, 1, -11);
    light.name = "light_green_pointLight";
    scene.add(light);
    scene.add(new THREE.PointLightHelper(light, 1));

    //HELPER light
    const cubeFolder = gui.addFolder("light_green_pointLight");
    cubeFolder.add(light.position, "x", -500, 500);
    cubeFolder.add(light.position, "y", -500, 500);
    cubeFolder.add(light.position, "z", -500, 500);
    cubeFolder.open();
  }*/

  function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
    const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
    const halfFovY = THREE.Math.degToRad(camera.fov * 0.5);
    const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);

    const direction = new THREE.Vector3()
      .subVectors(camera.position, boxCenter)
      .multiply(new THREE.Vector3(1, 0, 1))
      .normalize();

    camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));
    // camera.near = boxSize / 100;
    // camera.far = boxSize * 100;
    camera.updateProjectionMatrix();
    camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
  }

  {
    new THREE.GLTFLoader().load(
      // resource URL
      "images/web.glb",
      // called when the resource is loaded
      function (gltf) {
        const root = gltf.scene;
        root.name = "graphBox";
        root.rotation.x = 0.4;
        root.rotation.z = -0.2;
        root.position.y = 0.31;

        // console.log(root);
        gltf.scene.traverse(function (node) {
          // console.log(node);
          if (node instanceof THREE.Mesh) {
            node.material.roughness = 0.16;
            node.material.envMapIntensity = 1.5;
            // node.material.clearcoatRoughness = 0.16;
            // node.material.clearcoat = 0.32;
            // node.material.transmission = 1;
            // node.material.clearcoatNormalScale = 0;
            // node.material.normalScale = 1;
            node.material.envMap = texture;
            node.material.flatShading = true;
            node.material.needsUpdate = true;
          }
        });

        scene.add(root);

        mixer = new THREE.AnimationMixer(root);
        mixer.clipAction(gltf.animations[0]).play();

        //HELPER shape
        const cubeFolder = gui.addFolder("shape rotation");
        cubeFolder.add(root.rotation, "x", -Math.PI * 2, Math.PI * 2);
        cubeFolder.add(root.rotation, "y", -Math.PI * 2, Math.PI * 2);
        cubeFolder.add(root.rotation, "z", -Math.PI * 2, Math.PI * 2);
        cubeFolder.open();

        const box = new THREE.Box3().setFromObject(root);
        const boxSize = box.getSize(new THREE.Vector3()).length();
        const boxCenter = box.getCenter(new THREE.Vector3());
        frameArea(boxSize * 2, boxSize, boxCenter, camera);

        // controls.maxDistance = boxSize * 1.2;
        // controls.minDistance = boxSize / 1.2;
        // controls.target.copy(boxCenter);
        // controls.update();
      },
      // called while loading is progressing
      function (xhr) {
        // canvas.
        // console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
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

  const list = document.querySelectorAll("#graph_list li");
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
        // console.log(e.target,i);
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
        // console.log(e.target,i);
        toggleElement(null);
        list.forEach(function (m) {
          m.classList.remove("active");
        });
      });
    });
  }
  // console.log(list);
  function toggleElement(itemno) {
    var rootChild = [false, false, false, false];
    // console.log(rootChild.length, itemno);
    if (itemno != null && rootChild.length > itemno) {
      rootChild[itemno] = true;
    } else {
      rootChild = [true, true, true, true];
    }
    // console.log(rootChild);
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
    target.x = (1 - mouse.x) * 0.0005;
    target.y = (1 - mouse.y) * -0.0002;
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
