"use strict";
console.clear();
window.addEventListener("DOMContentLoaded", app);

function app() {
  var scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    ),
    renderer = new THREE.WebGLRenderer({
      logarithmicDepthBuffer: false,
      antialias: true,
      alpha: true,
    }),
    textureLoader = new THREE.TextureLoader(),
    controls,
    GUI = new dat.GUI(),
    sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  var road,
    environment = {
      trees: {
        wireframes: false,
        src: ["/static/tree/tree1.glb", "/static/tree/tree2.glb"],
        gapBetweenTree: 15,
        gapBetweenRoad: 25,
        size: 5,
        amount: 19,
        offsetZ: 20,
      },
      grassTexture: textureLoader.load("/static/textures/grass.jpg"),
      roadTexture: textureLoader.load("/static/textures/road.jpg"),
      fogColor: {
        h: 215,
        s: 80,
        l: 80,
        // h: 332,
        // s: 98,
        // l: 48,
      },
      ambientColor: "#fff",
    },
    car = {
      speed: 20,
      wireframes: false,
      src: "/static/car/car2.glb",
      licensePlate: textureLoader.load("/static/textures/license-plate.png"),
      mesh: {
        body: new THREE.Object3D(),
        wheels: [
          new THREE.Object3D(),
          new THREE.Object3D(),
          new THREE.Object3D(),
          new THREE.Object3D(),
        ],
      },
      smokeBox: {
        mesh: new THREE.Object3D(),
        size: 20,
        param: {
          windX: 0.0,
          windY: 0.5,
          colorBias: 0.3,
          burnRate: 1.6,
          diffuse: 1.33,
          viscosity: 1.33,
          expansion: 0.0,
          swirl: 0.0,
          drag: 0.0,
          airSpeed: 8.0,
          speed: 500.0,
          massConservation: false,
        },
        flame: {
          color1: 0xffffff,
          color2: 0xffa000,
          color3: 0x000000,
          swirl: 1.2,
        },
        smoke: {
          color1: 0xffffff,
          color2: 0xffa000,
          color3: 0x000000,
          swirl: 0.0,
        },
      },
    },
    ambientLight,
    daylight;

  const timeStep = 1 / 60;
  var lastCallTime;

  function adjustWindow() {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  function init() {
    scene.fog = new THREE.Fog(
      `hsl(${environment.fogColor.h},${environment.fogColor.s}%,${environment.fogColor.l}%)`,
      0.01,
      272
    );

    camera.position.set(0, 10, -20);
    camera.lookAt(scene.position);

    renderer.setClearColor(scene.fog.color.getStyle());
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    let camControls = new THREE.OrbitControls(camera, renderer.domElement);
    camControls.enablePan = false;
    camControls.enableDamping = true;

    // ambient light
    ambientLight = new THREE.AmbientLight(environment.ambientColor);
    ambientLight.intensity = 1;
    scene.add(ambientLight);

    // daylight
    daylight = new THREE.PointLight(
      environment.ambientColor,
      ambientLight.intensity * 2
    );
    daylight.position.set(0, 64, 0);
    daylight.castShadow = true;
    scene.add(daylight);

    // config
    controls = {
      daylight: ambientLight.intensity,
      speed: car.speed,
      resetCam: () => {
        camControls.reset();
      },
    };
    GUI.add(controls, "daylight", 0.1, 1, 0.01)
      .name("Daylight")
      .onChange((e) => {
        let newVal = controls.daylight;
        car.headlight.intensity = (1 - newVal) * 2;
        car.rearlight.intensity = (1 - newVal) * 2;
        ambientLight.intensity = newVal;
        daylight.intensity = newVal * 2;

        let h = environment.fogColor.h,
          s = environment.fogColor.s,
          l = newVal * 100;
        environment.fogColor.l = l * 0.8;

        let daylightColorStr = `hsl(${h},${s}%,${l.toFixed(0)}%)`,
          fogColorStr = `hsl(${h},${s}%,${fogColor.l.toFixed(0)}%)`;

        daylight.color = new THREE.Color(daylightColorStr);
        renderer.setClearColor(fogColorStr);
        scene.fog.color.set(fogColorStr);
      });
    GUI.add(controls, "speed", 0, 60, 1)
      .name("Speed (MPH)")
      .onChange((e) => {
        car.speed = controls.speed;
      });
    GUI.add(controls, "resetCam").name("Reset Camera");

    // first render
    document.body.appendChild(renderer.domElement);
    renderScene();
  }

  function renderScene() {
    updateObjects();
    renderer.render(scene, camera);
    requestAnimationFrame(renderScene);
  }

  function updateObjects() {
    const time = performance.now() / 1000; // seconds;
    const dt = time - lastCallTime;

    //car move
    let fps = 60,
      scaleBy = 10,
      inchesInMile = 5280 * 12,
      incZ1MPH = inchesInMile / 3600 / fps,
      incZ = incZ1MPH * car.speed,
      tireRadius = car.height * 0.23,
      feetPerMin = (car.speed * 5280) / 60,
      rpm = feetPerMin / (2 * Math.PI * (tireRadius / 12)),
      incRotate = Math.PI * 2 * (rpm / 6e4) * (1e3 / fps);

    // car.mesh.wheels.forEach((e) => {
    //   e.rotation.x += incRotate / scaleBy;
    //   if (e.rotation.x >= Math.PI * 2) e.rotation.x = 0;
    // });
    car.mesh.body.position.z += incZ / scaleBy;

    if (car.mesh.body.position.z > road.tileSize)
      car.mesh.body.position.z -= road.tileSize;

    let carZ = car.mesh.body.position.z;
    daylight.position.z = carZ;
    scene.position.z = -carZ;
  }

  function loadCar() {
    car.mesh.name = "car";
    new THREE.GLTFLoader().load(
      // resource URL
      car.src,
      // called when the resource is loaded
      function (gltf) {
        const root = gltf.scene;
        
        car.mesh.body.add(root);
        car.mesh.body.scale.set(6.5, 6.5, 6.5);
        // car.mesh.body.rotation.set(0, Math.PI, 0);
        car.mesh.body.position.y = 0.65;
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      function (error) {
        console.error(error);
      }
    );
    car.mesh.body.name = "carBody";
    scene.add(car.mesh.body);

    loadSmoke();
  }

  function loadTree() {
    environment.trees.src.forEach(
      (singleTreeSrc, j) => {
        new THREE.GLTFLoader().load(
          // resource URL
          singleTreeSrc,
          // called when the resource is loaded
          function (gltf) {
            let root = gltf.scene;
            root.castShadow = true;
            for (let i = 0; i < environment.trees.amount; i++) {
              const root_left = root.clone();
              root_left.position.set(
                environment.trees.gapBetweenRoad + j * 15,
                0,
                environment.trees.gapBetweenTree * i -
                  environment.trees.offsetZ -
                  j * 30
              );
              const root_right = root.clone();
              root_right.position.set(
                -environment.trees.gapBetweenRoad - j * 15,
                0,
                environment.trees.gapBetweenTree * i -
                  environment.trees.offsetZ -
                  j * 30
              );
              scene.add(root_left, root_right);
            }
          }
        );
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      function (error) {
        console.error(error);
      }
    );
  }

  function loadSmoke() {
    // var plane = new THREE.PlaneBufferGeometry(car.smokeBox.size, car.smokeBox.size);
    // var fire = new Fire(plane, {
    //   textureWidth: 512,
    //   textureHeight: 512,
    //   debug: false,
    // });
    // fire.position.z = -2;
    // car.smokeBox.mesh.add(fire);
    // scene.add(car.smokeBox.mesh);
  }

  function spawnObjects() {
    // add road
    road = new Road(environment.grassTexture, environment.roadTexture);
    scene.add(road.mesh);

    //add car
    loadCar();

    //add tree
    loadTree();

    init();

    // console.log(car.mesh);
  }

  class Road {
    constructor(grassTexture, roadTexture) {
      this.tileSize = 32;
      this.worldSize = this.tileSize * 16;
      this.mesh = new THREE.Object3D();
      this.mesh.rotation.x = -Math.PI / 2;

      // grass
      let grassGeo = new THREE.PlaneBufferGeometry(
          this.worldSize,
          this.worldSize
        ),
        grassMat = new THREE.MeshLambertMaterial({
          color: 0xc0ea3b,
          map: grassTexture,
        });

      grassMat.map.wrapS = THREE.RepeatWrapping;
      grassMat.map.wrapT = THREE.RepeatWrapping;
      grassMat.map.repeat.set(128, 128);

      let grass = new THREE.Mesh(grassGeo, grassMat);
      grass.position.z = -0.02;
      this.mesh.add(grass);

      // road
      let roadGeo = new THREE.PlaneBufferGeometry(
          this.tileSize,
          this.worldSize
        ),
        roadMat = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          map: roadTexture,
        });

      roadMat.map.wrapS = THREE.RepeatWrapping;
      roadMat.map.wrapT = THREE.RepeatWrapping;
      roadMat.map.repeat.set(1, 16);

      let road = new THREE.Mesh(roadGeo, roadMat);
      // road.position.x = 7;
      road.receiveShadow = true;
      this.mesh.add(road);
    }
  }

  window.addEventListener("load", spawnObjects);
  window.addEventListener("resize", adjustWindow);
}

/**
 * Animate
 */
/*
  const timeStep = 1 / 60; // seconds
  let lastCallTime;

  const tick = () => {
    // Update controls
    controls.update();

    const time = performance.now() / 1000; // seconds
    if (!lastCallTime) {
      // world.step(timeStep);
    } else {
      const dt = time - lastCallTime;
      //  world.step(timeStep, dt);

      //wheel anim

      if (carModel) {
        // console.log(carModel)
        carModel.getObjectByName("FR").rotation.x =
          carModel.getObjectByName("FL").rotation.x =
          carModel.getObjectByName("RL").rotation.x =
          carModel.getObjectByName("RR").rotation.x =
            time * 5;
      }
    }
    lastCallTime = time;

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };
  tick();*/
