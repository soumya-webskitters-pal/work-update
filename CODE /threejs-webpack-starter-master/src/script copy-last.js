// init
let sliders = document.querySelectorAll("[data-slider]");
if (sliders.length) {
  sliders.forEach((element) => {
    slider3d(element);
  });
}

//create 3d slider function
function slider3d(container) {
  const size = { w: 1, h: 1.5 };
  const allImgs = container.querySelectorAll("img");
  // instantiate a loader
  const imgLoader = new THREE.TextureLoader();
  let textures = [];
  allImgs.forEach((e) => {
    e.classList.add("hide");
    // load a resource
    imgLoader.load(
      e.src, // resource URL
      // onLoad callback
      function (texture) {
        let setTexture = fixTexture(size.w, size.h, texture);
        setTexture.wrapS = THREE.ClampToEdgeWrapping;
        setTexture.wrapT = THREE.RepeatWrapping;
        textures.push(setTexture);
        if (allImgs.length == textures.length) {
          console.log("all images loaded");
          createMesh(size, textures);
        }
      },
      // onProgress callback currently not supported
      undefined,
      // onError callback
      function (err) {
        console.error("images not loaded, an error happened.");
      }
    );
  });

  function createMesh() {
    // Canvas
    const canvas = document.querySelector("canvas.webgl");

    // debug
    const gui = new dat.GUI();
    const clock = new THREE.Clock();

    /*Sizes*/
    const containerSize = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Scene
    const scene = new THREE.Scene();
    scene.name = "3d-slider";

    let slideToShow = allImgs.length,
      gutter = 0.1;

    // Objects
    const geometry = new THREE.PlaneBufferGeometry(size.w, size.w, 30, 30);
    // Materials
    const material = new THREE.MeshBasicMaterial({
      map: textures[0],
      color: "#fff",
    });
    // const material = new THREE.ShaderMaterial({
    //   uniforms: {
    //     uTime: { value: 0 },
    //     uTexture: { value: textures[0] },
    //   },
    //   // uniforms: {
    //   //   uTexture: { type:'f',value: textures[0],time: clock.getElapsedTime()+1},
    //   // },
    //   vertexShader: `
    //         varying vec2 vUv;
    //         void main(){
    //           vUv = uv;
    //           vec3 newposition = position;
    //         float distanceFromCenter = abs(
    //               (modelMatrix * vec4(position, 1.0)).x
    //           );
    //         newposition.y *= 1.0 - 0.05*pow(distanceFromCenter,1.5); // most important
    //           gl_Position = projectionMatrix * modelViewMatrix * vec4( newposition, 1.0 );
    //         }
    //      `,
    //   fragmentShader: `
    //        uniform sampler2D uTexture;
    //        uniform float uTime;
    //       varying vec2 vUv;
    //       void main()	{
    //         gl_FragColor = texture2D(uTexture,vUv);
    //       }
    //      `,
    // });

    for (let i = 0; i < slideToShow; i++) {
      let m = material.clone();
      let applyTexture = textures[i % slideToShow];
      // m.uniforms.uTexture.value = applyTexture;
      m.map = applyTexture;
      let mesh = new THREE.Mesh(geometry, m);
      mesh.name = "slider-item";
      mesh.position.set(i * (1 + gutter), 0, 0);
      scene.add(mesh);
    }

    let objs = [];
    scene.traverse((object) => {
      if (object.isMesh) {
        objs.push(object);
      }
    });

    window.addEventListener("resize", () => {
      // Update sizes
      containerSize.width = window.innerWidth;
      containerSize.height = window.innerHeight;

      // Update camera
      camera.aspect = containerSize.width / containerSize.height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(containerSize.width, containerSize.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    // Base camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerSize.width / containerSize.height,
      0.1,
      100
    );
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 2;
    scene.add(camera);

    // gui.add(camera.position, "x").min(0).max(slideToShow);

    /*Renderer*/
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvas,
      alpha: true,
    });
    renderer.setSize(containerSize.width, containerSize.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // mouse
    window.addEventListener("wheel", onmouseWheel);
    let y = 0,
      position = 0,
      oldPos = 0;
    function onmouseWheel(event) {
      y = event.deltaY * 0.0007;
    }

    const mouse = new THREE.Vector2();
    window.addEventListener("mousemove", (event) => {
      mouse.x = (event.clientX / containerSize.width) * 2 - 1;
      mouse.y = -(event.clientY / containerSize.height) * 2 + 1;
    });

    /// Lerp
    function lerp(v0, v1, t) {
      return v0 * (1 - t) + v1 * t;
    }

    /*Animate*/
    const rayCaster = new THREE.Raycaster();

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      //scene.position.x = -0.25 * elapsedTime*y;

      // Update objects
      oldPos = position;
      position += y;
      position = gsap.utils.clamp(0, slideToShow + 0.77, position);
      y *= 0.9;
      gsap.to(camera.position, {
        x: lerp(position, y, 0.1),
      });

      let direction = position > oldPos ? 1 : -1;
      console.log(position , oldPos);
      
      for (const object of objs) {
        gsap.to(object.rotation, {
          y: 0.05 * position * direction,
          // modifiers: {
          //   y: (y,target) =>{
          //  // console.log(y);
          //     return `${y}px`;
          //   },
          // },
        });
        // gsap.to(object.rotation, { y: position >= 0 ? 0.25 : -0.25 });
        // gsap.to(object.position, { z: 0.05 });
      }

      //rayCaster
      rayCaster.setFromCamera(mouse, camera);
      let intersects = rayCaster.intersectObjects(objs);
      //if intersect
      for (const intersect of intersects) {
        // intersect.object.material.uniforms.uTime.value = position * 0.5;
        //intersect.object.material.uniforms.uTexture.time =position;
        //   console.log(intersect.object.material.uniforms.uTexture.time =position
        //   );
        // gsap.to(intersect.object.scale, { x: 1.05, y: 1.1 });
        // gsap.to(intersect.object.rotation, { y: position >= 0 ? 0.25 : -0.25 });
        // gsap.to(intersect.object.position, { z: 0.05 });
      }
      //if not intersect
      for (const object of objs) {
        // if (!intersects.find((intersect) => intersect.object === object)) {
        //   gsap.to(object.scale, { x: 1, y: 1 });
        //   gsap.to(object.rotation, { y: 0 });
        //   gsap.to(object.position, { z: 0 });
        // }
      }

      // Render
      renderer.render(scene, camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

    tick();
  }

  function fixTexture(planeWidth, planeHeight, texture) {
    let planeAspect = planeWidth / planeHeight;
    let imageAspect = texture.image.width / texture.image.height;
    let aspect = imageAspect / planeAspect;
    texture.offset.x = aspect > 1 ? (1 - 1 / aspect) / 2 : 0;
    texture.repeat.x = aspect > 1 ? 1 / aspect : 1;
    texture.offset.y = aspect > 1 ? 0 : (1 - aspect) / 2;
    texture.repeat.y = aspect > 1 ? 1 : aspect;
    return texture;
  }
}
