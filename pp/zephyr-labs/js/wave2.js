"use strict";

//create vector 2d
class Vec2 {
  constructor() {
    this.pi = Math.PI;
    this.pi2 = this.pi * 2;
  }
  sub(p1, p2) {
    const x = p1.x - p2.x;
    const y = p1.y - p2.y;
    return this.set(x, y);
  }
  dist(p1, p2) {
    const { x, y } = this.sub(p1, p2);
    return Math.hypot(x, y);
  }
  map(value, low1, high1, low2, high2) {
    return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
  }
  set(x = 0, y = 0, z = 0) {
    return { x, y, z };
  }
}

//shader code
const VSHADER_SOURCE = `
// https://tympanus.net/codrops/2019/04/10/how-to-create-a-sticky-image-effect-with-three-js/comment-page-1/#comment-476238
uniform float u_progress;
uniform float u_direction;
uniform float u_waveIntensity;
uniform float u_offset;
uniform float u_time;

varying vec2 vUv;
void main(){
  
  vec3 pos = position.xyz;
  float dist = length(uv - 0.5); // center of uv coordinates
  float maxDist = length(vec2(0.01)); // radius == .25
  float normDist = dist / maxDist; // add radio to distance
  
  float stickOut = normDist; // makes geometry move starting from its center in negative z
  float stickIn = -normDist; // makes geometry move starting from its center in positive z
  float stickEff = mix(stickOut, stickIn, u_direction); // depending on the direction value it will give an effect from inside or outside
  
  float stick = 0.5; // value that indicates how fast the animation will start ==0.85
  
  float waveIn = u_progress * (1./stick); // progress from 0 to 2
  float waveOut = -(u_progress - 1.) * (1./(1. - stick)); // progress from 2 to 0
  float stickProg = min(waveIn, waveOut); // get progress with lowest value
  
  float offIn = clamp(waveIn, -0.001, 0.99); // give a limit from 0.0 to 1.0 to progress
  float offOut = clamp(1. - waveOut, 0., 1.); // give a limit from 1.0 to 0.0 to progress
  float offProg = mix(offIn, offOut, u_direction); // depending on the direction value for progress or progress reversed

  pos.z += stickEff * u_offset * stickProg - u_offset * offProg; // here the whole effect is added to modify the z position of the vertices
  
  pos.z += sin(dist * 0.8 - u_time * 100.) * u_waveIntensity; // create a distortion effect using the center of the geometry
  
  vUv = uv;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1);
}
`;
const FSHADER_SOURCE = `
#define S(a,b,n) smoothstep(a,b,n)
#define pi2 6.28318530718
#define pi 3.14159265359

uniform float u_time;
uniform float u_volatility;

uniform vec2 u_res;
uniform vec2 u_mouse;
uniform vec2 u_directionMouse;
uniform vec2 u_textureFactor;
uniform sampler2D u_text0;

varying vec2 vUv;

vec2 centeredAspectRatio(vec2 uvs, vec2 factor){
  return uvs * factor - factor / 2. + 0.5;
}

void main() {
  vec2 uv = vUv;
  vec2 st = (gl_FragCoord.xy - .5 * u_res) / min(u_res.x, u_res.y) * vec2(.1, 1);
  vec2 mouse_normalized = (u_mouse - .5 * u_res) / min(u_res.x, u_res.y) * vec2(.1, 1);
  
  float volatility = u_volatility; 

  float dist = length(mouse_normalized - st);
  float m_color = S(0.35, .01, dist);
     
  vec4 tex1 = vec4(0.05);
  
  volatility = clamp(volatility * 0.1, -1.0, 1.0); // creates a limit to the amplitude of volatility
  
  // creates a chromatic aberration effect

  uv.x -= (sin(uv.y) * m_color * volatility / 100.) * u_directionMouse.x;
  uv.y -= (sin(uv.x) * m_color * volatility / 100.) * u_directionMouse.y;
  tex1.rgb = texture2D(u_text0, centeredAspectRatio(uv, u_textureFactor)).rgb;
         
  gl_FragColor = tex1;
}
`;

const vec2 = new Vec2();
const init = () => {
  document.body.style.minHeight = "100vh";
  const content = document.getElementById("bg_parent");
  const width = innerWidth;
  const height = innerHeight;

  let mouse = {
    x: 0,
    y: 0,
  };
  let lastmouse = { x: 0, y: 0 };

  const webgl = {
    renderer: new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      logarithmicDepthBuffer: true,
    }),
    camera: new THREE.PerspectiveCamera(45, 1, 0.1, 10000),
    scene: new THREE.Scene(),
    loader: new THREE.TextureLoader(),
    clock: new THREE.Clock(),
  };

  const textures = [content.querySelector("img").src];
  content.querySelector("img").remove();

  const loadCanvas = (texturesLoaded) => {
    const factors = textures.map((d) => new THREE.Vector2(1, 1));
    let currentIndex = 0;

    const uniforms = {
      u_time: { type: "f", value: 0 },
      u_res: {
        type: "v2",
        value: new THREE.Vector2(width, height),
      },
      u_mouse: { type: "v2", value: new THREE.Vector2(0, 0) },
      u_directionMouse: { type: "v2", value: new THREE.Vector2(0, 0) },
      u_text0: { value: texturesLoaded[currentIndex] },
      u_progress: { type: "f", value: 0 },
      u_waveIntensity: { type: "f", value: 0 },
      u_direction: { type: "f", value: 0 },
      u_offset: { type: "f", value: 0 },
      u_volatility: { type: "f", value: 0 },
      u_textureFactor: { type: "v2", value: factors[0] },
    };

    const getPlaneSize = () => {
      const fovRadians = (webgl.camera.fov * Math.PI) / 180;
      const viewSize = Math.abs(
        webgl.camera.position.z * Math.tan(fovRadians / 2) * 2
      );

      return [viewSize, viewSize];
    };

    const calculateAspectRatioFactor = (index, texture) => {
      const [width, height] = getPlaneSize();

      const windowRatio = innerWidth / innerHeight;
      const rectRatio = (width / height) * windowRatio;
      const imageRatio = texture.image.width / texture.image.height;

      let factorX = 1;
      let factorY = 1;
      if (rectRatio > imageRatio) {
        factorX = 1;
        factorY = (1 / rectRatio) * imageRatio;
      } else {
        factorX = (1 * rectRatio) / imageRatio;
        factorY = 1;
      }

      factors[index] = new THREE.Vector2(factorX, factorY);

      if (currentIndex === index) {
        uniforms.u_textureFactor.value = factors[index];
        uniforms.u_textureFactor.needsUpdate = true;
      }
    };

    const addScene = () => {
      webgl.renderer.setSize(width, height);
      webgl.renderer.setPixelRatio(devicePixelRatio);

      content.append(webgl.renderer.domElement);

      webgl.camera.position.z = 5;
      webgl.scene.add(webgl.camera);
      addMesh();
    };

    const addMesh = () => {
      const [width, height] = getPlaneSize();
      const geometry = new THREE.PlaneGeometry(width, height, 60, 60);
      const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: VSHADER_SOURCE,
        fragmentShader: FSHADER_SOURCE,
      });
      webgl.mesh = new THREE.Mesh(geometry, material);
      webgl.scene.add(webgl.mesh);
    };

    const onMouse = (interval) => {
      const velocity = vec2.dist(lastmouse, mouse) / interval;

      // volatility
      gsap.to(uniforms.u_volatility, {
        duration: 5.5,
        value: Math.min(vec2.map(velocity, 1, 10, 10, 0.5), 100),
      });

      gsap.to(uniforms.u_directionMouse.value, {
        duration: 3,
        x: mouse.x - lastmouse.x,
        y: mouse.y - lastmouse.y,
      });
      lastmouse = { x: mouse.x, y: mouse.y };
    };

    const resize = () => {
      const w = innerWidth;
      const h = innerHeight;

      webgl.renderer.setSize(w, h);

      uniforms.u_res.value.x = w;
      uniforms.u_res.value.y = h;

      for (let [i, texture] of texturesLoaded.entries()) {
        calculateAspectRatioFactor(i, texture);
      }

      webgl.camera.updateProjectionMatrix();
    };

    content.addEventListener("mousemove", ({ clientX, clientY }) => {
      mouse.x = clientX;
      mouse.y = innerHeight - clientY;

      // mouse position
      gsap.to(uniforms.u_mouse.value, {
        x: mouse.x,
        y: mouse.y,
        ease: "none",
        duration: 5,
      });
    });

    const render = () => webgl.renderer.render(webgl.scene, webgl.camera);

    let start = performance.now();
    const update = () => {
      uniforms.u_time.value = webgl.clock.getElapsedTime();

      const now = performance.now();
      const interval = now - start;

      onMouse(interval);

      start = now;

      render();
      requestAnimationFrame(update);
    };

    addScene();
    update();
    resize();
    window.addEventListener("resize", resize);
  };

  let texturesLoaded = [];
  textures.map((texture, i) => {
    webgl.loader.load(texture, (textLoaded) => {
      texturesLoaded.push(textLoaded);
      if (i + 1 === textures.length) {
        loadCanvas(texturesLoaded);
      }
    });
  });
};

init();
