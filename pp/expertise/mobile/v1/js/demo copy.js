//custom shape --figure
const _image = document.querySelector('#node_shape1 .front');
var shape_container = _image;
var shapeHeight = shape_container.clientHeight;
var shapeWidth = shape_container.clientWidth;
var shape_camera, shape_renderer, shape_controls;
var shape_scene = new THREE.Scene();
var shapeGroup = new THREE.Group();


MODEL = function () {

},
  MODEL.prototype.Init = function () {
    ////add 3d model on demand
    shape_scene.add(new THREE.AmbientLight("#ffffff"));

    var FOV = 70,
      ASPECT = shapeWidth / shapeHeight,
      NEAR = 0.00001,
      FAR = shapeWidth * 5;
    shape_camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR);

    shape_scene.add(shape_camera);
    shape_camera.position.set(0, 0, shapeWidth * 1.5);

    shape_renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    shape_renderer.setSize(shapeWidth, shapeHeight);

    shape_container.appendChild(shape_renderer.domElement);

    shape_controls = new THREE.OrbitControls(shape_camera, shape_renderer.domElement);
    shape_controls.enableZoom = false;
    shape_controls.userZoom = false; //disable zoom on mouse scroll
    shape_controls.enableDamping = true;
    shape_controls.dampingFactor = 0.12;
    shape_controls.enableRotate = true;
    shape_controls.autoRotate = true; //enable rotation
    shape_controls.rotateSpeed = 0.03; //manual rotation speed
    shape_controls.autoRotateSpeed = 0.2; //default rotation speed
    shape_controls.maxPolarAngle = Math.PI / 2;
    shape_controls.enablePan = false;
    shape_controls.minDistance = NEAR;
    shape_controls.maxDistance = shapeWidth * 3.5;

    var shapeMaterial = new THREE.MeshBasicMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.4,
      wireframe: true,
    });

    // torus
    var shape_torus = new THREE.Mesh(new THREE.TorusBufferGeometry(180, 110, 16, 40), shapeMaterial);
    shape_torus.position.set(0, 0, 0);
    shapeGroup.add(shape_torus);
    /*
        // torus knot
        var shape_torus_knot = new THREE.Mesh(
          new THREE.TorusKnotBufferGeometry(90, 25, 100, 10, 3, 5), shapeMaterial);
        shape_torus_knot.position.set(0, 0, 0);
        shapeGroup.add(shape_torus_knot);
        // cone
        var shape_cone = new THREE.Mesh(new THREE.CylinderBufferGeometry(0, 100, 250, 20, 10), shapeMaterial);
        shape_cone.position.set(0, 0, 0);
        shape_cone.rotateX(90);
        shape_cone.rotateY(45);
        shape_cone.rotateZ(90);
        shapeGroup.add(shape_cone);
        // sphere
        var shape_sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(150, 25, 16), shapeMaterial);
        shape_sphere.position.set(0, 0, 0);
        shapeGroup.add(shape_sphere);
        // dome
        var shape_dome = new THREE.Mesh(new THREE.SphereBufferGeometry(150, 25, 16, 0, 2 * Math.PI, 0, Math.PI / 2), shapeMaterial);
        shape_dome.position.set(0, 0, 0);
        shapeGroup.add(shape_dome);*/
    shape_scene.add(shapeGroup);
    this.Animate();
    ////----End- 3d model======


    ////calculate container width
    $(".col").mouseover(function () {
      if (!$(this).hasClass("active")) {
        $(".col").removeClass("active");
        $(this).addClass("active");

        TweenMax.to($(this).find(".back"), 0.5, {
          css: {
            height: $(".container_inner").height() + "px",
            width: $(".container_inner").width() + "px",
          },
          yoyo: true,
          force3D: "auto",
          ease: Power0.easeNone,
          onComplete: () => {
            // this.pause();
            TweenMax.set($(this).find(".anim_box"), {
              y: 30,
              opacity: 0,
              ease: Expo.easeInOut
            });
            TweenMax.to($(this).find(".anim_box"), 1, {
              y: 0,
              opacity: 1,
              ease: Expo.easeInOut,
              onComplete: function () {
                this.pause();
              }
            });
          }
        });
      }
    });

    $(".col").mouseleave(function () {
      TweenMax.to(".anim_box", 1, {
        y: 30,
        opacity: 0,
        ease: Expo.easeInOut,
        onComplete: function () {
          this.pause();
        }
      });
      TweenMax.to($(this).find(".back"), 0.5, {
        css: {
          height: $(".container_inner").find(".front").height() + "px",
          width: $(".container_inner").find(".front").width() + "px",
        },
        yoyo: true,
        force3D: "auto",
        ease: Power0.easeNone,
        onComplete: function () {
          $(".col").removeClass("active");
          // this.pause();
        }
      });
    });

  },

  MODEL.prototype.Scroll = function (event) {
    // event.preventDefault();
    event.stopImmediatePropagation();
  },

  MODEL.prototype.ClickHandle = function (event) {
    // event.preventDefault();
    event.stopImmediatePropagation();
  },

  MODEL.prototype.moveHandle = function (event) {
    // event.preventDefault();
    event.stopImmediatePropagation();
  },

  MODEL.prototype.Render = function () {
    ////----3d model======
    shape_renderer.render(shape_scene, shape_camera);
    shape_controls.update();
    shape_camera.updateProjectionMatrix();
    shape_camera.matrixWorldNeedsUpdate = true;
    shape_renderer.setPixelRatio(window.devicePixelRatio);
    requestAnimationFrame(this.Animate.bind(this));
    ////----End- 3d model======
  },

  MODEL.prototype.Animate = function () {
    //inner canvas figure/shape
    this.Render();
    //END--inner canvas figure/shape
  },

  MODEL.prototype.Resize = function () {
    ////----3d model======
    shape_camera.aspect = shapeWidth / shapeHeight;
    shape_camera.updateProjectionMatrix();
    shape_renderer.setPixelRatio(window.devicePixelRatio);
    shape_renderer.setSize(shapeWidth, shapeHeight);
    ////----End- 3d model======
  },

  MODEL.prototype.openModal = function () { };





/*--load function--*/
window.onload = function () {
  // console.log("Page loading time: ", Date.now() - timerStart);

  var worldModel = new MODEL();
  //check browser support for WEBGL
  if (WEBGL.isWebGLAvailable()) {
    //init canvas
    worldModel.Init();

    //show page - remove loader
    showPage();

    window.onresize = function () {
      worldModel.Resize();
    }
    window.onwheel = function (event) {
      worldModel.Scroll(event);
    }
    window.onmousemove = function (event) {
      worldModel.moveHandle(event);
    }
    window.onclick = function (event) {
      worldModel.ClickHandle(event);
    }

    //call nav function
    document.querySelector("#nav_btn").onclick = openNav;
    //add nav function
    var submenu = new TimelineMax({
      paused: true
    });
    submenu.staggerTo("#submenu li", 0.3, {
      left: 0,
      autoAlpha: 1
    }, 0.2, 0.3);

    var menu = new TimelineMax({
      paused: true,
      reversed: true
    });

    menu.to("#circle_anim", 0.75, {
      height: "100vh",
      width: "100vh",
      borderRadius: "0 0 0 100%",
      ease: Power2.easeInOut
    });

    function openNav() {
      if (menu.reversed()) {
        menu.play();
        submenu.play().timeScale(1);
        document.querySelector("#submenu").classList.add("active");
        document.querySelector("#nav_btn").classList.add("active");
      } else {
        menu.reverse();
        submenu.reverse();
        document.querySelector("#submenu").classList.remove("active");
        document.querySelector("#nav_btn").classList.remove("active");
      }
    }
  } else {
    var warning = WEBGL.getWebGLErrorMessage();
    container.appendChild(warning);
  }

  function showPage() {
    var loader = document.getElementById("loader");
    TweenMax.to(loader, 0.5, {
      opacity: 1,
      onComplete: function () {
        loader.style.pointerEvents = "none";
        clearTimeout(loadTime);
        loader.remove();
        document.body.classList.add("loaded");
        //console.clear();
      }
    });
  }
}
/*--END -- load function--*/