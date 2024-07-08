"use strict";
console.clear();
window.addEventListener("DOMContentLoaded", app);
function app() {
  var textureLoader = new THREE.TextureLoader(),
    controls,i;
  var world = {
      clock: new THREE.Clock(),
      GUI: new dat.GUI(),
      sizes: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      renderer: new THREE.WebGLRenderer({
        logarithmicDepthBuffer: false,
        antialias: true,
        alpha: true,
      }),
      mesh: new THREE.Object3D(),
      scene: new THREE.Scene(),
      camera: new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      ),
      // uniforms : {
      //   u_time: { value: 0 },
      //   u_resolution: {
      //     type: "v2",
      //     value: new THREE.Vector2(window.innerWidth, window.innerheight),
      //   },
      //   u_mouse:{},
      //   progress: { type: "f", value: 0 },
      //   color_main: {
      //     value: hex2rgb(world.params.topColor, true),
      //   },
      //   color_accent: {
      //     value: hex2rgb(world.params.bottomColor, true),
      //   },
      // },
      // params:{
      //   topColor: "#fff00",
      //   bottomColor: "#ffab00",
      //   lightIntensity2: 0.85,
      //   numOfMeshSets: 6,
      //   sunPos: {
      //     x: 0,
      //     y: world.environment.tileSize / 3,
      //     z: -world.environment.tileSize,
      //   },
      // },
      environment: {
        wireframe: false,
        camControls: {},
        light: {
          ambient: {
            intensity: 1,
            color: "#fff",
          },
        },
        tileSize: 2,
        grid: 28,
        texture1: textureLoader.load("../static/textures/mountain.png"),
        texture2: textureLoader.load("../static/textures/bg1.png"),
        mountain: {
          texture: textureLoader.load("../static/textures/bloom2.jpg"),
          displacementTexture: textureLoader.load(
            "../static/textures/displacement.png"
          ),
          height: 0.1,
          color: "#184905",
        },
        road: {
          texture: textureLoader.load("../static/textures/road.jpg"),
          color: "#4e4e4e",
        },
        trees: {
          mesh: new THREE.Object3D(),
          wireframes: false,
          src: "../static/tree/tree4.glb",
          gapBetweenTree: 0.25,
          gapBetweenRoad: 0.15,
          amount: 15,
          offsetZ: 2.4,
          offsetY: 12,
          scale: 0.01,
        },
        grassTexture: textureLoader.load("../static/textures/grass.jpg"),
        fogColor: {
          h: 215,
          s: 80,
          l: 80,
        },
      },
      car: {
        speed: 0.15,
        scale: 0.05,
        wireframes: false,
        src: "../static/car/car-body.glb",
        licensePlate: textureLoader.load(
          "../static/textures/license-plate.png"
        ),
        wheelsrc: "../static/car/car-wheel.glb",
        wheelscale: 0.052,
        wheelY: 0.025,
        mesh: {
          body: new THREE.Object3D(),
          wheels: [
            new THREE.Object3D(),
            new THREE.Object3D(),
            new THREE.Object3D(),
            new THREE.Object3D(),
          ],
        },
      },
    },
    ambientLight,
    daylight;

  function adjustWindow() {
    world.sizes.width = window.innerWidth;
    world.sizes.height = window.innerHeight;

    world.camera.aspect = world.sizes.width / world.sizes.height;
    world.camera.updateProjectionMatrix();
    world.renderer.setSize(world.sizes.width, world.sizes.height);
    world.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  function init() {
    // world.scene.fog = new THREE.Fog(
    //   `hsl(${world.environment.fogColor.h},${world.environment.fogColor.s}%,${world.environment.fogColor.l}%)`,
    //   0.01,
    //   1.1
    // );

    world.camera.position.set(0, 0.1, 1.1);
    world.camera.lookAt(world.scene.position);

    // world.renderer.setClearColor(world.scene.fog.color.getStyle());
    world.renderer.setSize(window.innerWidth, window.innerHeight);
    world.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    world.renderer.shadowMap.enabled = true;

    world.environment.camControls = new THREE.OrbitControls(
      world.camera,
      world.renderer.domElement
    );
    world.environment.camControls.enablePan = false;
    world.environment.camControls.enableDamping = true;

    // ambient light
    ambientLight = new THREE.AmbientLight(
      world.environment.light.ambient.color,
      1
    );
    world.scene.add(ambientLight);

    // daylight
    daylight = new THREE.HemisphereLight(
      world.environment.light.ambient.color,
      world.environment.light.ambient.intensity
    );
    daylight.position.set(0, 0.5, 1);
    daylight.castShadow = true;
    world.scene.add(daylight);
    //add light helper
    const helper = new THREE.HemisphereLightHelper( daylight, 0.1 );
    world.scene.add( helper );

    // config
    controls = {
      daylight: world.environment.light.ambient.intensity,
      speed: world.car.speed,
      resetCam: () => {
        world.environment.camControls.reset();
      },
    };
    world.GUI.add(controls, "daylight", 0.1, 1, 0.01)
      .name("Daylight")
      .onChange((e) => {
        let newVal = controls.daylight;
        world.car.headlight.intensity = (1 - newVal) * 2;
        world.car.rearlight.intensity = (1 - newVal) * 2;
        world.environment.light.ambient.intensity = newVal;
        daylight.intensity = newVal * 2;

        let h = world.environment.fogColor.h,
          s = world.environment.fogColor.s,
          l = newVal * 100;
        world.environment.fogColor.l = l * 0.8;

        let daylightColorStr = `hsl(${h},${s}%,${l.toFixed(0)}%)`,
          fogColorStr = `hsl(${h},${s}%,${fogColor.l.toFixed(0)}%)`;

        daylight.color = new THREE.Color(daylightColorStr);
        world.renderer.setClearColor(fogColorStr);
        world.scene.fog.color.set(fogColorStr);
      });
    world.GUI.add(controls, "speed", 0.1, 1, 0.05)
      .name("Speed (MPH)")
      .onChange((e) => {
        world.car.speed = controls.speed;
      });
    world.GUI.add(controls, "resetCam").name("Reset Camera");

    // first render
    document.body.appendChild(world.renderer.domElement);
    renderScene();
  }

  function renderScene() {
    updateObjects();
    world.renderer.render(world.scene, world.camera);
    requestAnimationFrame(renderScene);
  }

  function updateObjects() {
    const elapsedTime = world.clock.getElapsedTime();

    // Update controls
    world.environment.camControls.update();

    //mountain movement
    world.environment.mountain.plane1.position.z =
      (elapsedTime * world.car.speed) % 2;
    world.environment.mountain.plane2.position.z =
      ((elapsedTime * world.car.speed) % 2) - world.environment.tileSize;

    //road movement
    world.environment.road.plane1.position.z =
      (elapsedTime * world.car.speed) % 2;

    //tree movement
    world.environment.trees.mesh.position.z =
      (elapsedTime * world.car.speed) % 2;

    //wheel movement
    world.car.mesh.wheels.forEach((ee) => {
      let whl = ee.children[0];
      if (whl != undefined) {
        whl.rotation.x = elapsedTime * (-world.car.speed * 30);
      }
    });
  }
  function spawnObjects() {
    //add mountain
    createMountain(),
      // add road
      createRoad(),
      //add tree
      createTree(),
      //add car
      createCar(),
      //add wheel
      createWheel(),
      //add sun
      // createSun();

    init();
  }

  ///create mountain
  function createMountain() {
    ///boundary box
    // const boundaryGeometry = new THREE.SphereGeometry(
    //   world.environment.tileSize,
    //   world.environment.grid,
    //   world.environment.grid
    // );
    // const boundaryMaterial = new THREE.MeshBasicMaterial({
    //   color: "#fff",
    //   side: THREE.DoubleSide,
    //   map: world.environment.texture2,
    //   wireframe: world.environment.wireframe,
    // });
    // world.mesh = new THREE.Mesh(boundaryGeometry, boundaryMaterial);
    // world.mesh.rotation.y = Math.PI / 2;
    // world.mesh.position.set(
    //   0,
    //   world.environment.mountain.height + world.environment.tileSize / 100,
    //   world.car.speed
    // );

    //add back mountain
    // const backMountainGeometry = new THREE.SphereGeometry(
    //   world.environment.tileSize,
    //   world.environment.grid,
    //   world.environment.grid,
    //   0,
    //   Math.PI,
    //   0,
    //   0.5 * Math.PI
    // );
    // const backMountainMaterial = new THREE.MeshStandardMaterial({
    //   map: world.environment.texture1,
    //   // color: world.environment.mountain.color,
    //   wireframe: world.environment.wireframe,
    //   alpha: true,
    //   side: THREE.DoubleSide,
    //   alphaMap: world.environment.texture1,
    // });
    // backMountainMaterial.map.wrapS = THREE.RepeatWrapping;
    // backMountainMaterial.map.wrapT = THREE.RepeatWrapping;
    // let backMountain = new THREE.Mesh(
    //   backMountainGeometry,
    //   backMountainMaterial
    // );
    // backMountain.position.set(0, -world.environment.tileSize / 4, 0.01);
    // backMountain.rotation.set(0, Math.PI / 2, world.car.speed);
    // world.mesh.add(backMountain);
    // world.scene.add(world.mesh);

    ///add land
    const landGeometry = new THREE.PlaneGeometry(
      world.environment.tileSize,
      world.environment.tileSize,
      world.environment.grid * 2,
      world.environment.grid * 2
    );
    const landMaterial = new THREE.MeshStandardMaterial({
      map: world.environment.grassTexture,
      displacementMap: world.environment.mountain.displacementTexture,
      displacementScale: world.environment.mountain.height,
      color: world.environment.mountain.color,
      wireframe: world.environment.wireframe,
      side: THREE.DoubleSide,
    });
    landMaterial.map.wrapS = THREE.RepeatWrapping;
    landMaterial.map.wrapT = THREE.RepeatWrapping;
    landMaterial.map.repeat.set(32, 32);
    world.environment.mountain.plane1 = new THREE.Mesh(
      landGeometry,
      landMaterial
    );
    world.environment.mountain.plane1.rotation.x = -Math.PI * 0.5;
    world.environment.mountain.plane1.position.y = 0.0;
    world.environment.mountain.plane2 =
      world.environment.mountain.plane1.clone();
    world.environment.mountain.plane1.position.z =
      world.environment.tileSize / 2;
    world.environment.mountain.plane2.position.z =
      -world.environment.tileSize / 2;
    world.scene.add(
      world.environment.mountain.plane1,
      world.environment.mountain.plane2
    );
  }

  ///create road
  function createRoad() {
    const roadGeometry = new THREE.PlaneGeometry(
      world.environment.tileSize / 8,
      world.environment.tileSize * 2,
      world.environment.grid,
      world.environment.grid
    );
    const RoadMaterial = new THREE.MeshPhongMaterial({
      map: world.environment.road.texture,
      bumpMap: world.environment.road.texture,
      bumpScale: 1.5,
      color: world.environment.road.color,
      wireframe: world.environment.wireframe,
    });
    RoadMaterial.map.wrapS = THREE.RepeatWrapping;
    RoadMaterial.map.wrapT = THREE.RepeatWrapping;
    RoadMaterial.map.repeat.set(1, 20);
    world.environment.road.plane1 = new THREE.Mesh(roadGeometry, RoadMaterial);
    world.environment.road.plane1.rotation.x = -Math.PI * 0.5;
    world.environment.road.plane1.position.y = 0.001;
    world.environment.road.plane1.position.z = -world.environment.tileSize;
    world.scene.add(world.environment.road.plane1);
  }

  ///create tree
  function createTree() {
    new THREE.GLTFLoader().load(
      //   // resource URL
      world.environment.trees.src,
      //   // called when the resource is loaded
      function (gltf) {
        let root = gltf.scene;
        root.scale.set(
          world.environment.trees.scale,
          world.environment.trees.scale,
          world.environment.trees.scale
        );
        root.castShadow = true;
        for (let i = 0; i < world.environment.trees.amount; i++) {
          const root_left = root.clone();
          root_left.position.set(
            world.environment.trees.gapBetweenRoad,
            0,
            world.environment.trees.gapBetweenTree * i -
              world.environment.trees.offsetZ -
              0.18
          );
          root_left.rotation.set(0, Math.random() * 0.5, 0);
          world.environment.trees.mesh.add(root_left);
          // root_left.position.set(
          //   world.environment.trees.gapBetweenRoad + j * 0.05,
          //   Math.random() / world.environment.trees.offsetY - j * 0.05,
          //   world.environment.trees.gapBetweenTree * i -
          //     world.environment.trees.offsetZ -
          //     j * 0.18
          // );
          // root_left.rotation.set(0, Math.random() * 0.5, 0);

          const root_right = root.clone();
          root_right.position.set(
            -world.environment.trees.gapBetweenRoad - 0.05,
            Math.random() / world.environment.trees.offsetY - 0.05,
            world.environment.trees.gapBetweenTree * i -
              world.environment.trees.offsetZ -
              0.18
          );
          root_right.rotation.set(0, Math.random() * 0.5, 0);
          world.environment.trees.mesh.add(root_left, root_right);
          world.scene.add(world.environment.trees.mesh);
        }
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      function (error) {
        console.error(error);
      }
    );
  }

  ///create car body
  function createCar() {
    new THREE.GLTFLoader().load(
      // resource URL
      world.car.src,
      // called when the resource is loaded
      function (gltf) {
        const root = gltf.scene;
        root.traverse(function (node) {
          if (node instanceof THREE.Mesh) {
            node.material.castShadow = true;
            node.material.wireframe = world.car.wireframes;
            // console.log(node);
          }
        });
        world.car.mesh.body.add(root);
        world.car.mesh.body.scale.set(
          world.car.scale,
          world.car.scale,
          world.car.scale
        );
        world.car.mesh.body.rotation.set(0, Math.PI, 0);
        world.car.mesh.body.position.y = 0.02;
        world.car.mesh.body.position.z = 0.895;
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      function (error) {
        console.error(error);
      }
    );
    world.car.mesh.body.name = "carBody";
    world.scene.add(world.car.mesh.body);
  }

  ///create wheel
  function createWheel() {
    new THREE.GLTFLoader().load(
      // resource URL
      world.car.wheelsrc,
      // called when the resource is loaded
      function (gltf) {
        const root = gltf.scene;
        root.traverse(function (node) {
          if (node instanceof THREE.Mesh) {
            node.castShadow = true;
            node.wireframes == world.car.wireframes;
          }
        });
        root.scale.set(
          world.car.wheelscale,
          world.car.wheelscale,
          world.car.wheelscale
        );

        let FL = new THREE.Object3D();
        FL.name = "FL";
        FL.rotation.set(0, Math.PI, 0);
        FL.position.set(-0.036, world.car.wheelY, 0.837);
        FL.add(root.clone());
        world.car.mesh.wheels[0].add(FL);

        let FR = new THREE.Object3D();
        FR.name = "FR";
        FR.position.set(0.036, world.car.wheelY, 0.837);
        FR.add(root.clone());
        world.car.mesh.wheels[1].add(FR);

        let RL = new THREE.Object3D();
        RL.name = "RL";
        RL.rotation.set(0, Math.PI, 0);
        RL.position.set(-0.036, world.car.wheelY, 0.967);
        RL.add(root.clone());
        world.car.mesh.wheels[2].add(RL);

        let RR = new THREE.Object3D();
        RR.name = "RR";
        RR.position.set(0.036, world.car.wheelY, 0.967);
        RR.add(root.clone());
        world.car.mesh.wheels[3].add(RR);
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      function (error) {
        console.error(error);
      }
    );
    world.scene.add(
      world.car.mesh.wheels[0],
      world.car.mesh.wheels[1],
      world.car.mesh.wheels[2],
      world.car.mesh.wheels[3]
    );
  }

  ///create sun
  function createSun() {
    const sunGeom = new THREE.SphereGeometry(
      // world.environment.tileSize/2,
      30,
      64,
      64
    );
    const sunMat = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
    });
    let sun = new THREE.Mesh(sunGeom, sunMat);
    // sun.scale.set(0.07, 0.07,0.07);
    sun.position.set(world.params.sunPos.x, world.params.sunPos.y, world.params.sunPos.z);
    world.scene.add(sun);
    
    setInterval(() => {
      world.uniforms.u_time.value=i+=5;
      world.uniforms.progress.value=i++;
    }, 150);
  }

  window.addEventListener("load", spawnObjects);
  window.addEventListener("resize", adjustWindow);
}

//shader
 const vertexShader = `
 varying vec2 vUv;
 varying vec3 vPos;
 void main() {
   vUv = uv;
   vPos = position;
   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
 }
`,
   fragmentShader =`
   #ifdef GL_ES
   precision mediump float;
   #endif
   #define PI 3.14159265359
   #define TWO_PI 6.28318530718
   
   uniform vec2 u_resolution;
   uniform vec2 u_mouse;
   uniform float u_time;
   uniform vec3 color_main;
   uniform vec3 color_accent;
   varying vec2 vUv;
   varying vec3 vPos;
   void main() {
     vec2 st = gl_FragCoord.xy/u_resolution.xy;
     float x = vPos.y;
     float osc = (ceil(sin((3. - (x - u_time) / 1.5) * 5.) / 2. + 0.4 - floor((3. - x / 1.5) * 5. / TWO_PI) / 10.));
     vec3 color = mix(color_accent, color_main, smoothstep(0.02, 1., vUv.y));
     gl_FragColor = vec4(color, osc);
   }
`;
 //convert hex to rgb
const hex2rgb = (hex) => {
  if (hex.length === 4) {
    return fullHex(hex);
  }
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};

//create vector 2d
class Vec2 {
  constructor() {
    this.pi = Math.PI;
    this.pi2 = this.pi * 2;
  }

  add(p1, p2) {
    const x = p1.x + p2.x;
    const y = p1.y + p2.y;
    return this.set(x, y);
  }

  sub(p1, p2) {
    const x = p1.x - p2.x;
    const y = p1.y - p2.y;
    return this.set(x, y);
  }

  div(p1, p2) {
    const x = p1.x / p2.x;
    const y = p1.y / p2.y;
    return this.set(x, y);
  }

  mul(p1, p2) {
    const x = p1.x * p2.x;
    const y = p1.y * p2.y;
    return this.set(x, y);
  }

  dist(p1, p2) {
    const { x, y } = this.sub(p1, p2);
    return Math.hypot(x, y);
  }

  radToDeg(rad) {
    return (rad * 180) / this.pi;
  }

  degToRad(deg) {
    return (deg * this.pi) / 180;
  }

  angle(p1, p2) {
    const { x, y } = this.sub(p1, p2);
    return Math.atan2(y, x);
  }

  scale(p, n) {
    const x = p.x * n;
    const y = p.y * n;
    return this.set(x, y);
  }

  lerp(l, c, t) {
    const v = t * (c - l) + l;
    return v;
  }

  dot(p1, p2) {
    return p1.x * p2.x + p1.y * p2.y;
  }

  cross(p1, p2) {
    const z = p1.x * p2.x - p1.y * p2.y;
    return this.set(0, 0, z);
  }

  rot2d(p1, p2, a) {
    const { x, y } = this.sub(p1, p2);
    const sin = Math.sin(a);
    const cos = Math.cos(a);

    const rotX = x * cos - y * sin + p2.x;
    const rotY = x * sin - y * cos + p2.y;

    return this.set(rotX, rotY);
  }

  length(p) {
    return Math.sqrt(p.x * p.x + p.y * p.y);
  }

  norm(p) {
    const { x, y } = p;
    let len = x * x + y * y;

    if (len > 0) len = 1 / Math.sqrt(len);

    const out1 = x * len;
    const out2 = y * len;

    return this.set(out1, out2);
  }

  clamp(v, min, max) {
    return Math.max(min, Math.min(v, max));
  }

  map(value, low1, high1, low2, high2) {
    return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
  }

  // fract(value) {
  //   return value - Math.floor(value);
  // }

  set(x = 0, y = 0, z = 0) {
    return { x, y, z };
  }
}
