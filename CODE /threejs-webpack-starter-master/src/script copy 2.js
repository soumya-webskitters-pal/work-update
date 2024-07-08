// init
let sliders = document.querySelectorAll("[data-slider]");
if (sliders.length) {
  sliders.forEach((element) => {
    slider3d(element);
  });
}

//create 3d slider function
function slider3d(container) {
  const size = { w: 1.3, h: 1.8 };
  const items = container.querySelectorAll(".slide_3d_item");
  var sl_items = [];
  // instantiate a loader
  const imgLoader = new THREE.TextureLoader();
  items.forEach((el) => {
    let img = el.querySelector("img"),
      a = el.querySelector("a");
    sl_items.push({
      img: img.src,
      link: a.href,
      textures: imgLoader.load(
        img.src, // resource URL
        // onLoad callback
        function (texture) {
          let setTexture = fixTexture(size.w, size.h, texture);
          setTexture.wrapS = THREE.ClampToEdgeWrapping;
          setTexture.wrapT = THREE.RepeatWrapping;
          return setTexture;
        },
        // onProgress callback currently not supported
        undefined,
        // onError callback
        function (err) {
          console.error("images not loaded, an error happened.");
        }
      ),
    });
    el.remove();

    if (sl_items.length == items.length) {
      console.log("all images loaded");
      createMesh();
    }
  });

  function createMesh() {
    // Canvas
    const canvas = document.createElement("canvas");
    container.append(canvas);

    // debug
    // const gui = new dat.GUI();
    // const clock = new THREE.Clock();

    //Sizes
    const containerSize = {
      width: container.clientWidth,
      height: container.clientHeight,
    };

    // Scene
    const scene = new THREE.Scene();
    scene.name = "3d-slider";

    let slideToShow = sl_items.length,
      gutter = 0.035;

    // Objects
    const geometry = new THREE.PlaneBufferGeometry(size.w, size.h, 30, 30);
    // Materials
    const material = new THREE.MeshBasicMaterial({
      map: sl_items[0].textures,
      color: "#fff",
    });

    for (let i = 0; i < slideToShow; i++) {
      let m = material.clone();
      let applyTexture = sl_items[i].textures;
      m.map = applyTexture;
      let mesh = new THREE.Mesh(geometry, m);
      mesh.name = `slider-item${i + 1}`;
      mesh.position.set(i * (size.w + gutter), 0, 0);
      mesh.link = sl_items[i].link;
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
      containerSize.width = container.clientWidth;
      containerSize.height = container.clientHeight;

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

    //Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvas,
      alpha: true,
    });
    renderer.setSize(containerSize.width, containerSize.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    let posY = 0,
      position = 0;

    canvas.addEventListener("mouseenter", () => {
      canvas.classList.remove("filter");
    });
    canvas.addEventListener("mouseleave", () => {
      canvas.classList.add("filter");
    });

    // mouse
    direction = 1;
    startPos = 0;
    let y = 0,
      scrollSpeed = 0,
      scrollY = 0,
      oldScrollY = 0;
    window.addEventListener("wheel", onmouseWheel);
    function onmouseWheel(e) {
      scrollY -= e.deltaY * 0.9 * startPos;
      posY = e.deltaY * 0.0007 * startPos;
    }

    ScrollTrigger.refresh();
    ScrollTrigger.create({
      trigger: container,
      pin: true,
      start: "top top",
      // end:"+=800%",
      end: `+=${container.clientWidth * 3}px`,
      onUpdate: (self) => {
        // console.log(self.progress);
        startPos = self.progress;
      },
      onEnter: () => {
        direction = 1;
      },
      onEnterBack: () => {
        direction = -1;
      },
    });

    // Touch
    let touchStart = 0;
    let touchX = 0;
    let isDragging = false;
    const handleTouchStart = (e) => {
      touchStart = e.clientX || e.touches[0].clientX;
      isDragging = true;
      container.classList.add("is-dragging");
      // container.classList.remove("filter");
    };
    const handleTouchMove = (e) => {
      if (!isDragging) return;
      touchX = e.clientX || e.touches[0].clientX;
      scrollY += (touchX - touchStart) * 2.5;
      touchStart = touchX;
    };
    const handleTouchEnd = () => {
      isDragging = false;
      container.classList.remove("is-dragging");
      // container.classList.add("filter");
    };
    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchmove", handleTouchMove);
    container.addEventListener("touchend", handleTouchEnd);
    container.addEventListener("mousedown", handleTouchStart);
    container.addEventListener("mousemove", handleTouchMove);
    container.addEventListener("mouseleave", handleTouchEnd);
    container.addEventListener("mouseup", handleTouchEnd);
    container.addEventListener("selectstart", () => {
      return false;
    });

    const mouse = new THREE.Vector2();
    var flag = 0,
      clicked = 0;
    canvas.addEventListener("mousemove", (event) => {
      mouse.x = (event.clientX / containerSize.width) * 2 - 1;
      mouse.y = -(event.clientY / containerSize.height) * 2 + 1;
    });
    canvas.addEventListener("click", (event) => {
      if (flag) {
        clicked = 1;
      }
      mouse.x = (event.clientX / containerSize.width) * 2 - 1;
      mouse.y = -(event.clientY / containerSize.height) * 2 + 1;
    });

    /// Lerp
    function lerp(v0, v1, t) {
      return v0 * (1 - t) + v1 * t;
    }

    //custom ease
    const easing = {
      damp3: (target, to, rate, delta) => {
        for (let i = 0; i < 3; i++) {
          target[i] += (to[i] - target[i]) * rate * delta;
        }
      },
      damp: (target, prop, to, rate, delta) => {
        target[prop] += (to - target[prop]) * rate * delta;
      },
      dampC: (color, toColor, rate, delta) => {
        color.r += (toColor.r - color.r) * rate * delta;
        color.g += (toColor.g - color.g) * rate * delta;
        color.b += (toColor.b - color.b) * rate * delta;
      },
    };

    //Animate
    const rayCaster = new THREE.Raycaster();

    const tick = () => {
      //rotate object based on scroll speed
      
      for (let i = 0; i < objs.length; i++) {
        let object = objs[i];
        gsap.to(object.rotation, {
          y: (0.0051 * scrollSpeed) / 2,
        });
        gsap.to(object.position, {
          z: () => {
            return i * scrollSpeed * 0.001;
          },
        });
        container.style.cursor = "default";
        flag = 0;
        //detect intersection
        rayCaster.setFromCamera(mouse, camera);
        let intersects = rayCaster.intersectObjects(objs);
        //if intersect

        for (const intersect of intersects) {
          if (intersect.object.link.length) {
            flag = 1;
            if (clicked == 1) {
              console.log(intersect.object.link);
            }
          }
          // gsap.to(intersect.object.scale, {
          //   x: 1.1
          // });
          container.style.cursor = "pointer";
          easing.dampC(
            intersect.object.material.color,
            new THREE.Color("#fff"),
            1,
            1
          );

          gsap.to(intersect.object.position, {
            z: 0,
          });
        }
        //if not intersect
        for (const intsec_object of objs) {
          if (
            !intersects.find(
              (intersect) => intersect.intsec_object === intsec_object
            )
          ) {
            // gsap.to(intsec_object.scale, {
            //   x: 1
            // });
            easing.dampC(
              intsec_object.material.color,
              new THREE.Color("#aaa"),
              0.15,
              0.1
            );
          }
        }
      }

      // move objects along x-axis
      position += posY;
      position = gsap.utils.clamp(0, slideToShow - 0.22, position);
      posY *= 0.9;

      if (startPos < 1) {
        gsap.to(camera.position, {
          x: position * (  direction==1? startPos * 1.5: (1-startPos) * 1.5 ),
        });
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

/*
const state = {
  clicked: null,
  urls: ['src/images/CGI_1', 'src/images/CGI_2', 'src/images/CGI_3', 'src/images/CGI_4', 'src/images/CGI_5','src/images/CGI_6','src/images/CGI_7'].map((u) => `/${u}.webp`)
};

let camera, scene, renderer, raycaster, mouse;
const items = [];
const easing = {
  damp3: (target, to, rate, delta) => {
    for (let i = 0; i < 3; i++) {
      target[i] += (to[i] - target[i]) * rate * delta;
    }
  },
  damp: (target, prop, to, rate, delta) => {
    target[prop] += (to - target[prop]) * rate * delta;
  },
  dampC: (color, toColor, rate, delta) => {
    color.r += (toColor.r - color.r) * rate * delta;
    color.g += (toColor.g - color.g) * rate * delta;
    color.b += (toColor.b - color.b) * rate * delta;
  }
};

function init() {
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 10;

  scene = new THREE.Scene();

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const w = 2,h=2, gap = 0.15;
  const xW = w + gap;
  state.urls.forEach((url, i) => {
    const texture = new THREE.TextureLoader().load(url);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const geometry = new THREE.PlaneGeometry(w, h);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = i * xW;
    scene.add(mesh);
    items.push({ mesh, index: i, position: [i * xW, 0, 0], scale: [w, h, 1], hovered: false });
  });

  window.addEventListener('resize', onWindowResize, false);
  window.addEventListener('mousemove', onMouseMove, false);
  window.addEventListener('click', onClick, false);

  animate();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onClick(event) {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    const clickedItem = items.find(item => item.mesh === intersects[0].object);
    if (clickedItem) {
      state.clicked = state.clicked === clickedItem.index ? null : clickedItem.index;
    }
  } else {
    state.clicked = null;
  }
}

function animate() {
  requestAnimationFrame(animate);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  items.forEach(item => {
    const mesh = item.mesh;
    const scaleTarget = [item.scale[0], item.scale[1], 1];
    const clicked = state.clicked;
    if (clicked !== null && item.index < clicked) {
      easing.damp(mesh.position, 'x', item.position[0] - 2, 0.15, 0.1);
    }
    if (clicked !== null && item.index > clicked) {
      easing.damp(mesh.position, 'x', item.position[0] + 2, 0.15, 0.1);
    }
    if (clicked === null || clicked === item.index) {
      easing.damp(mesh.position, 'x', item.position[0], 0.15, 0.1);
    }
    easing.damp3(mesh.scale, clicked === item.index ? [4.7, 5, 1] : scaleTarget, 0.15, 0.1);
    const hovered = intersects.length > 0 && intersects[0].object === mesh;
    if (hovered) {
      easing.dampC(mesh.material.color, new THREE.Color('white'), 0.3, 0.1);
      easing.damp(mesh.material, 'grayscale', 0, 0.15, 0.1);
    } else {
      easing.dampC(mesh.material.color, new THREE.Color('#aaa'), 0.15, 0.1);
      easing.damp(mesh.material, 'grayscale', 1, 0.15, 0.1);
    }
  });

  renderer.render(scene, camera);
}

init();
*/
