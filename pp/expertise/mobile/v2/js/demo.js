//custom shape --figure
var hoverInitial = new THREE.Color('#ffffff');
var hoverValue = new THREE.Color('#f85857');

var canvas;
var scenes = [], renderer;
var frameCount = 0;
var stats;

var oldSize;

var canvasTransformY = 0, scrollFlag = false;

MODEL = function () {

},
  MODEL.prototype.Init = function () {
    ////add 3d model on demand
    canvas = document.getElementById("canvas");

    var geometries = [
      new THREE.TorusBufferGeometry(.5, 0.3, 10, 20),
      new THREE.TorusKnotBufferGeometry(.45, .17, 50, 8),
      new THREE.CylinderBufferGeometry(0, 0.5, 1.4, 12, 8),
      new THREE.SphereBufferGeometry(0.8, 15, 15),
      new THREE.SphereBufferGeometry(0.8, 15, 15, 0, 2 * Math.PI, 0, Math.PI / 2),
    ];

    var content = document.querySelector(".cols");
    var allElement = document.querySelectorAll(".col");

    for (var i = 0; i < geometries.length; i++) {
      var scene = new THREE.Scene();
      var element = allElement[i];
      scene.userData.element = element.querySelector(".el_canvas");
      content.appendChild(element);

      var camera = new THREE.PerspectiveCamera(50, 1, 1, 10);
      camera.position.set(0, 0, 2);
      scene.userData.camera = camera;
      var geometry = geometries[i];
      var material = new THREE.MeshBasicMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: 0.3,
        wireframe: true,
        flatShading: true
      });
      scene.add(new THREE.Mesh(geometry, material));


      // console.log(scene)
      scene.scale.set(0.6, 0.6, 0.6);

      scenes.push(scene);
    }
    // console.log(scenes)
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    camera.matrixWorldNeedsUpdate = true;
    camera.updateProjectionMatrix();

    // performance monitor
    // stats = new Stats();
    // document.getElementById("main").appendChild(stats.dom);

    this.Animate();
    ////----End- 3d model======

    $("#demo01").animatedModal();
    $("#demo02").animatedModal();
    $("#demo03").animatedModal();
    $("#demo04").animatedModal();
    $("#demo05").animatedModal();
  },

  MODEL.prototype.Scroll = function (event) {
    // canvasTransformY = document.documentElement.scrollTop;
    function getDocHeight() {
      var D = document;
      return Math.max(
        D.body.scrollHeight, D.documentElement.scrollHeight,
        D.body.offsetHeight, D.documentElement.offsetHeight,
        D.body.clientHeight, D.documentElement.clientHeight
      )
    }

    var winheight = window.innerHeight || (document.documentElement || document.body).clientHeight
    var docheight = getDocHeight()
    var scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop
    var trackLength = docheight - winheight
    var pctScrolled = Math.floor(scrollTop / trackLength * 100) // gets percentage scrolled (ie: 80 or NaN if tracklength == 0)
    canvasTransformY = pctScrolled;

    scrollFlag = true;
    // event.preventDefault();
    // event.stopImmediatePropagation();

    document.body.ontouchend = (e) => {
      e.preventDefault();
    };
  },

  MODEL.prototype.ClickHandle = function (event) {
    // event.preventDefault();
    // event.stopImmediatePropagation();
  },

  MODEL.prototype.moveHandle = function (event) {
    // event.preventDefault();
    //event.stopImmediatePropagation();

    $(".col").mouseover(function () {
      if (!$(this).hasClass("active")) {
        $(this).find("canvas").addClass("active");
        $(".col").removeClass("active");
        $(this).addClass("active");
      }
    });
  },

  MODEL.prototype.Render = function () {
    ////----3d model======
    this.Resize();
    canvas.style.transform = `translateY(${window.scrollY}px)`;

    renderer.setScissorTest(true);
    scenes.forEach(function (scene) {
      scene.children[0].rotation.y = Date.now() * 0.001;
      var element = scene.userData.element;
      var rect = element.getBoundingClientRect();

      var width = rect.width;
      var height = rect.height;
      var left = rect.left;
      var top = rect.top - 130;

      renderer.setViewport(left, top, width, height);
      renderer.setScissor(left, top, width, height);

      var camera = scene.userData.camera;

      renderer.render(scene, camera);
    });

    // performance monitor
    // stats.update();
    // document.querySelector('#test').innerHTML = 'draw calls :' + renderer.info.render.calls;
    ////----End- 3d model======
  },

  MODEL.prototype.Animate = function () {
    ////----3d model======
    ++frameCount;
    if (frameCount % 1 === 0) {
      this.Render();
    }
    requestAnimationFrame(this.Animate.bind(this));
    ////----End- 3d model======
  },

  MODEL.prototype.Resize = function () {
    ////----3d model======
    var width = canvas.clientWidth;
    var height = canvas.clientHeight;
    if (canvas.width !== width || canvas.height !== height) {
      renderer.setSize(width, height, false);
    }
    renderer.setPixelRatio(window.devicePixelRatio);
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
      //return false;
    }
    window.onscroll = function (event) {
      worldModel.Scroll(event);
      return false;
    }
    window.ontouchmove = function (event) {
      worldModel.Scroll(event);
      //return false;
    }
    window.onmousemove = function (event) {
      worldModel.moveHandle(event);
      //return false;
    }
    window.onclick = function (event) {
      worldModel.ClickHandle(event);
      //return false;
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