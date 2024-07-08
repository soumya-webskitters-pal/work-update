// init
let sliders = document.querySelectorAll("[data-slider]");
if (sliders.length) {
  sliders.forEach((element) => {
    slider3d(element);
  });
}

//create 3d slider function
function slider3d(container) {
  gsap.registerPlugin(ScrollTrigger, Draggable);

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
          createMesh();
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
    var raycaster = new THREE.Raycaster(),
      mouse = new THREE.Vector2();

    //create camera
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      10
    );
    camera.position.z = 2;

    //create scene
    const scene = new THREE.Scene();

    //create template geometry and material
    const geometry = new THREE.PlaneBufferGeometry(size.w, size.h, 10, 10);
    // const material = new THREE.MeshBasicMaterial({
    //   map: textures[0],
    //   color: "#fff",
    // });
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: textures[0] },
      },
      vertexShader: `
          varying vec2 vUv;
          void main(){
            vUv = uv;
            vec3 newposition = position;
            // float distanceFromCenter = abs(
            //     (modelMatrix * vec4(position, 1.0)).x
            // );
          //  newposition.y *= 1.+ .3*pow(distanceFromCenter/2.,2.);  // most important
          float distanceFromCenter = abs(
                (modelMatrix * vec4(position, 1.0)).x
            );
            newposition.y *= 1.0 - 0.05*pow(distanceFromCenter,1.5);
            gl_Position = projectionMatrix * modelViewMatrix * vec4( newposition, 1.0 );
          }`,
      fragmentShader: `
            uniform sampler2D uTexture;
            varying vec2 vUv;
            void main()	{
              gl_FragColor = texture2D(uTexture,vUv);
            }
           `,
    });
    let slideToShow = allImgs.length,
      gutter = 0.1;
    let meshes = [];
    for (let i = 0; i < slideToShow; i++) {
      let m = material.clone();
      let applyTexture = textures[i % slideToShow];
      // m.map = applyTexture;
      m.uniforms.uTexture.value = applyTexture;
      // m.uniforms.uTexture.value = textures[i % slideToShow];
      let mesh = new THREE.Mesh(geometry, m);
      mesh.name = "slider-item";
      mesh.position.x = i * (1 + gutter);
      meshes.push(mesh);
      scene.add(mesh);
    }
    let totalwidth = size.w * slideToShow - size.w / 2;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.setAnimationLoop(animation);
    // requestAnimationFrame(animation);
    container.appendChild(renderer.domElement);
    renderer.render(scene, camera);

    let scrollSpeed = 0,
      oldScrollY = 0,
      scrollY = 0,
      y = 0;

    /// Lerp
    function lerp(v0, v1, t) {
      return v0 * (1 - t) + v1 * t;
    }

    /// Wheel
    const handleMouseWheel = (e) => {
      scrollY -= e.deltaY * 0.9;
    };

    ///Touch
    let touchStart = 0;
    let touchX = 0;
    let isDragging = false;
    const handleTouchStart = (e) => {
      touchStart = e.clientX || e.touches[0].clientX;
      isDragging = true;
      container.classList.add("is-dragging");
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
    };

    /// add Listeners
    container.addEventListener("mousewheel", handleMouseWheel);
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
    container.addEventListener("click", onClick, false);

    // select box
    function onClick(ev) {
      ev.preventDefault();
      mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      let intersects = raycaster.intersectObject(scene, true);
      if (intersects.length > 0) {
        let object = intersects[0].object;
        console.log(object);
      }
      render();
    }

    /// render
    const render = () => {
      requestAnimationFrame(render);
      y = lerp(y, scrollY, 0.1);
      scrollSpeed = y - oldScrollY;
      oldScrollY = y;
      // console.log(scrollSpeed);
      renderer.render(scene, camera);
    };
    // render();

    let animTl = gsap.timeline();
    animTl
      .to(scene.position, {
        x: -totalwidth,
        onUpdate: render(),
      })
      .pause();
    ScrollTrigger.create({
      trigger: container,
      pin: true,
      start: "top top",
      end: "+=1000px",
      animation: animTl,
      scrub: 1.5,
      // markers: true,
    });

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", onWindowResize, false);
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
