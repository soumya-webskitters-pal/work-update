let sliders = document.querySelector(".slider_3d");
function slider3d(container) {
  const slideItems = container.querySelectorAll(".slide_3d_item");
  const imgLoader = new THREE.TextureLoader();
  var state = {
    clicked: null,
    links: [],
    textures: [],
  };
  model_size = { w: 8, h: 11, gap: 0.15 };
  var size = {
    w: container.clientWidth,
    h: container.clientHeight,
  };
  var selectedIndex = null;

  let mmGSAP = gsap.matchMedia();
  mmGSAP
    .add("(min-width: 992px)", () => {
      model_size.w = 8;
      model_size.h = 11;
    })
    .add("(max-width: 991px)", () => {
      model_size.w = 5;
      model_size.h = 12;
    });

  slideItems.forEach((el) => {
    let img = el.querySelector("img"),
      a = el.querySelector("a");
    state.links.push(a.href);
    state.textures.push(
      imgLoader.load(
        img.src, // resource URL
        // onLoad callback
        function (texture) {
          let setTexture = fixTexture(model_size.w, model_size.h, texture);
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
      )
    );
    el.remove();

    if (slideItems.length == state.textures.length) {
      console.log("all images loaded");
      createMesh();
    }
  });

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
  function createMesh() {
    const items = [];
    var posY = 0,
      scrollY = 0,
      scrollSpeed = 0,
      oldScrollY = 0;
    var camera, scene, renderer, raycaster, mouse;
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
      lerp: (v0, v1, t) => {
        v0 * (1 - t) + v1 * t;
      },
    };

    const totalWidth = state.textures.length;

    function init() {
      camera = new THREE.PerspectiveCamera(75, size.w / size.h, 0.1, 1000);
      camera.position.z = 10;

      scene = new THREE.Scene();

      raycaster = new THREE.Raycaster();
      mouse = new THREE.Vector2();

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(size.w, size.h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const xW = model_size.w + model_size.gap;
      state.textures.forEach((texture, i) => {
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const geometry = new THREE.PlaneGeometry(model_size.w, model_size.h);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = i * xW;
        mesh.name = `slide${i}`;
        (mesh.link = state.links[i]), scene.add(mesh);
        items.push({
          mesh,
          name: `slide${i}`,
          index: i,
          position: [i * xW, 0, 0],
          scale: [model_size.w, model_size.h, 1],
          hovered: false,
          link: state.links[i],
        });
      });

      /// add Listeners
      window.addEventListener("resize", onWindowResize, false);
      container.addEventListener("mousemove", onMouseMove, false);
      container.addEventListener("click", onClick, false);

      animate();
      let sceneTl = gsap.timeline();
      mmGSAP
        .add("(min-width: 992px)", () => {
          sceneTl.to(scene.position, {
            x: -(totalWidth * model_size.w) + model_size.w,
          });
        })
        .add("(max-width: 991px)", () => {
          sceneTl.to(scene.position, {
            x: -(totalWidth * model_size.w) + (model_size.w / 2),
          });
        });

      sceneTl.pause();
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "+=800%",
        animation: sceneTl,
        onUpdate: (self) => {
          posY = self.progress;
        },
        scrub: 1.2,
        pin: true,
      });
    }

    function onWindowResize() {
      size = {
        w: container.clientWidth,
        h: container.clientHeight,
      };

      camera.aspect = size.w / size.h;
      camera.updateProjectionMatrix();
      renderer.setSize(size.w, size.h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    function onMouseMove(event) {
      mouse.x = (event.clientX / size.w) * 2 - 1;
      mouse.y = -(event.clientY / size.h) * 2 + 1;
    }

    function onClick(event) {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);
      if (intersects.length > 0) {
        const clickedItem = items.find(
          (item) => item.mesh === intersects[0].object
        );
        if (clickedItem) {
          state.clicked =
            state.clicked === clickedItem.index ? null : clickedItem.index;
          selectedIndex = clickedItem.index;
          if (state.links[selectedIndex].length) {
            window.location.href = state.links[selectedIndex];
          }
        }
      } else {
        state.clicked = null;
      }
    }

    function animate() {
      requestAnimationFrame(animate);
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);

      container.classList.remove("hover");

      scrollY += posY * 0.9;
      scrollSpeed = posY - oldScrollY;
      oldScrollY = posY;
      // console.log(scrollSpeed);

      items.forEach((item, i) => {
        const mesh = item.mesh;

        gsap.to(mesh.rotation, {
          y: () => Math.sin(scrollSpeed * 15),
          duration: 2,
        });
        gsap.to(mesh.scale, {
          // x:()=>Math.cos(scrollSpeed *(i+1)* 10),
          y: () => Math.cos(scrollSpeed * (i + 1) * 5),
          duration: 2,
        });

        const scaleTarget = [item.scale[0], item.scale[1], 1];
        const clicked = state.clicked;
        if (clicked !== null && item.index < clicked) {
          easing.damp(mesh.position, "x", item.position[0] - 2, 0.15, 0.1);
        }
        if (clicked !== null && item.index > clicked) {
          easing.damp(mesh.position, "x", item.position[0] + 2, 0.15, 0.1);
        }
        if (clicked === null || clicked === item.index) {
          easing.damp(mesh.position, "x", item.position[0], 0.15, 0.1);
        }
        easing.damp3(
          mesh.scale,
          clicked === item.index ? [4.7, 5, 1] : scaleTarget,
          0.15,
          0.1
        );

        const hovered = intersects.length > 0 && intersects[0].object === mesh;
        if (hovered) {
          easing.dampC(mesh.material.color, new THREE.Color("white"), 0.3, 0.1);
        } else {
          easing.dampC(mesh.material.color, new THREE.Color("#aaa"), 0.15, 0.1);
        }

        //if intersect
        for (const intersect of intersects) {
          container.classList.add("hover");
        }

        //if not intersect
        // for (const intsec_object of items) {
        //   if (
        //     !intersects.find(
        //       (intersect) => intersect.intsec_object === intsec_object
        //     )
        //   ) {
        //   }
        // }
      });

      renderer.render(scene, camera);
    }

    init();
  }
}
slider3d(sliders);

