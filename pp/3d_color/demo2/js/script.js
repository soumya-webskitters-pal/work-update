"use strict";
const canvas = document.getElementById("renderCanvas");
var engine = null,
  scene = null,
  sceneToRender = null,
  camera = null;
const loader = document.getElementById("js-loader"),
  selected_element = document.querySelectorAll("[data-element]"),
  set_meterials = document.getElementById("set_meterial"),
  label_trigger = document.getElementById("label"),
  label_color = document.querySelectorAll("#label_font_color li"),
  label_fontType = document.getElementById("label_font_type");
// label_fontSize = document.getElementById("label_font_size");

const camera_fov = 0.35;

//function - text color list
function LabelControl() {
  // build text color list
  label_color.forEach((el, index) => {
    el.style.background = el.dataset.color;
    if (index == 0) {
      el.classList.add("active");
      label_trigger.style.color = el.dataset.color;
    }

    //bind EventListener - set color on label
    el.addEventListener("click", function () {
      label_color.forEach(function (each_els) {
        each_els.classList.remove("active");
      });
      this.classList.add("active");
      label_trigger.style.color = this.dataset.color;
      triggerLabelInput(false);
    });
  });

  //bind EventListener - set text on label
  label_trigger.addEventListener("input", function () {
    triggerLabelInput(true);
  });

  //bind EventListener - set font-style on label
  label_fontType.addEventListener("change", function () {
    triggerLabelInput(false);
  });

  //trigger draw label function
  function triggerLabelInput(blank) {
    let type_text = label_trigger.value.toUpperCase().trim();
    if (type_text.length >= 1 && type_text.length <= 3) {
      drawLabel(type_text);
    } else if (blank && type_text.length <= 3) {
      drawLabel(type_text);
    }
  }
}

// limit font size of label
// label_fontSize.addEventListener("change", checkFontSize);
// function checkFontSize() {
//   const maxLimit = 500,
//     minLimit = 200;
//   if (label_fontSize.value < minLimit) {
//     label_fontSize.value = minLimit;
//     label_fontSize.innerText = minLimit;
//   }
//   if (label_fontSize.value > maxLimit) {
//     label_fontSize.value = maxLimit;
//     label_fontSize.innerText = maxLimit;
//   }
//   return label_fontSize.value;
// }

//function - get label color
function getLabelColor() {
  let sendColor = null;
  label_color.forEach(function (es, i) {
    if (i == 0) {
      sendColor = es.dataset.color;
    }
    if (es.classList.contains("active")) {
      // console.log("color:", es.dataset.color);
      sendColor = es.dataset.color;
    }
  });
  return sendColor;
}

//draw label
function drawLabel(type_text) {
  console.log("draw label");

  const txrSize = { x: 512, y: 256 };
  let fStyle = label_fontType.value,
    fColor = getLabelColor();
  let fSize = 100; //checkFontSize();

  if (scene.getTextureByName("matLabel")) {
    let targetTexture = scene.getTextureByName("matLabel");
    console.log("found:", targetTexture);
  }
  //else {
  scene.materials.forEach(function (el, i) {
    // console.log("++", el);
    if (el.name.includes("label")) {
      var tx_texture = new BABYLON.DynamicTexture(
        "matLabel",
        { width: txrSize.x, height: txrSize.y },
        scene
      );
      tx_texture.hasAlpha = true;
      var ctx = tx_texture.getContext();
      ctx.fillStyle = "transparent";
      ctx.textAlign = "center";

      // let textWidth = ctx.measureText(tx_texture).width;
      // let ratio = textWidth / fSize;
      // fSize = Math.floor(txrSize.x / 8 / (ratio * 1));
      let font = "bold " + fSize + "px " + fStyle;
      tx_texture.drawText(
        type_text,
        txrSize.x / 2,
        fSize,
        font,
        fColor,
        "transparent",
        true
      );
      el.albedoColor = BABYLON.Color3.FromHexString(fColor);
      el.albedoTexture = tx_texture;
      el.albedoTexture.wrapU = null;
      el.albedoTexture.wrapV = null;
      el.albedoTexture.uScale = -5;
      el.albedoTexture.vScale = -5;
      el.albedoTexture.uOffset = -14.51;
      el.albedoTexture.vOffset = 14.55;
      el.albedoTexture.invertZ = true;
      el.transparencyMode = BABYLON.PBRMaterial.PBRMATERIAL_ALPHABLEND;
      el.useAlphaFromAlbedoTexture = true;
      tx_texture.update();
    }
  });
  //}
}

// Function - select element
function selectElement() {
  selected_element.forEach(function (each_el) {
    each_el.addEventListener("click", function () {
      if (this.classList.contains("selected")) {
        selected_element.forEach(function (each_el) {
          each_el.classList.remove("selected");
        });
      } else {
        selected_element.forEach(function (each_el) {
          each_el.classList.remove("selected");
        });
        this.classList.add("selected");

        set_meterials.innerHTML = "";
        set_meterials.innerHTML = this.nextElementSibling.innerHTML;
        gsap.set(this.nextElementSibling, {
          opacity: 0,
          x: -50,
        });

        const all_color = set_meterials.querySelectorAll("li");

        // Build Colors tab
        for (let i = 0; i < all_color.length; i++) {
          if (all_color[i].dataset.color != undefined) {
            all_color[i].style.background = all_color[i].dataset.color;
          }
          if (all_color[i].dataset.image != undefined) {
            all_color[i].style.backgroundImage =
              "url(" + all_color[i].dataset.image + ")";
          }
        }

        gsap.to(all_color, {
          delay: 0.3,
          opacity: 1,
          x: 0,
          duration: 1,
          stagger: 0.05,
        });

        //change meterial from color tab
        all_color.forEach((el) => {
          el.addEventListener("click", function () {
            let _this = this;
            let selectedElement = getSelectedElement();
            if (selectedElement != null) {
              console.log(selectedElement);
              all_color.forEach((elss) => {
                elss.classList.remove("active");
              });
              _this.classList.add("active");

              scene.materials.forEach(function (el, i) {
                if (selectedElement === el.name) {
                  if (_this.dataset.color != undefined) {
                    el.albedoColor = BABYLON.Color3.FromHexString(
                      _this.dataset.color
                    );
                  }
                  if (_this.dataset.image != undefined) {
                    el.albedoTexture = new BABYLON.Texture(
                      _this.dataset.image,
                      scene
                    );
                    el.albedoTexture.uScale = 5;
                    el.albedoTexture.vScale = 5;
                  }
                  // console.log(el);
                }
              });
            } else {
              alert("select element");
            }
          });
        });
      }
    });
  });
}

// return selected element
function getSelectedElement() {
  let returnEl = null;
  selected_element.forEach((each_el) => {
    if (each_el.classList.contains("selected")) {
      returnEl = each_el.dataset.element;
    }
  });
  return returnEl;
}

var startRenderLoop = function (engine, canvas) {
  engine.runRenderLoop(function () {
    if (sceneToRender && sceneToRender.activeCamera) {
      sceneToRender.render();
    }
  });
};

var createDefaultEngine = function () {
  return new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false,
  });
};
var delayCreateScene = function () {
  scene = new BABYLON.Scene(engine);

  BABYLON.SceneLoader.ImportMesh(
    "",
    canvas.dataset.path,
    canvas.dataset.model,
    scene,
    function (meshes) {
      console.log(meshes);

      scene.materials.forEach(function (el, i) {
        //set global color
        el.albedoColor = BABYLON.Color3.FromHexString("#404040");

        //set elemnt name in HTML
        if (!el.name.includes("root")) {
          if (el.name === "label") {
            drawLabel("");
          } else {
            selected_element[i].innerText = el.name;
            selected_element[i].dataset.element = el.name;
          }
        }
      });

      // Remove the loader
      loader.remove();

      //animate after load
      gsap.from(scene.activeCamera, {
        fov: 2,
        alpha: Math.PI * 8,
        duration: 1.5,
      });
    }
  );

  return scene;
};
window.initFunction = async function () {
  var asyncEngineCreation = async function () {
    try {
      return createDefaultEngine();
    } catch (e) {
      console.log(
        "the available createEngine function failed. Creating the default engine instead"
      );
      return createDefaultEngine();
    }
  };

  window.engine = await asyncEngineCreation();
  if (!engine) throw "engine should not be null.";
  canvas.inn;
  startRenderLoop(engine, canvas);
  window.scene = delayCreateScene();

  // setup cameara
  camera = new BABYLON.ArcRotateCamera(
    "Camera",
    0,
    Math.PI / 2,
    1.5,
    new BABYLON.Vector3(0, 0, 0),
    scene
  );
  camera.fov = camera_fov;
  camera.setTarget(new BABYLON.Vector3(0, 0.12, 0));
  camera.position = new BABYLON.Vector3(0, 0, 0);
  // camera.minZ = 1;
  // camera.maxZ = 10;
  camera.lowerBetaLimit = 0.8;
  camera.upperBetaLimit = (Math.PI / 2) * 0.8;
  camera.lowerRadiusLimit = 1.5;
  camera.upperRadiusLimit = 2;
  camera.cameraAcceleration = 0.0001;
  camera.maxCameraSpeed = 0.1;
  camera.attachControl(canvas, true);

  //rotate camera to label
  scene.activeCamera.alpha = Math.PI / 1.6;
  // console.log(scene.activeCamera);

  //setup lights
  const hemiLight = new BABYLON.HemisphericLight(
    "HemiLight",
    // new BABYLON.Vector3(0, -100, 150),
    new BABYLON.Vector3(0, -50, 200),
    scene
  );
  hemiLight.intensity = 2;
  const hemiLight2 = new BABYLON.HemisphericLight(
    "HemiLight",
    new BABYLON.Vector3(0, 100, -150),
    scene
  );
  hemiLight2.intensity = 0.4;
  const light1 = new BABYLON.PointLight(
    "Omni1",
    new BABYLON.Vector3(0, 100, 40),
    scene
  );
  light1.intensity = 5000;

  //Cannot change the color of the material
  scene.ambientColor = new BABYLON.Color3(0.8, 0.8, 0.8);
  scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

  // Show inspector.
  scene.debugLayer.show({
    embedMode: true,
  });

  selectElement();
  LabelControl();
};
initFunction().then(() => {
  sceneToRender = scene;
});

// Resize
window.addEventListener("resize", function () {
  engine.resize();
});
