"use strict";

jQuery.noConflict()(function ($) {
  // document start
  window.history.scrollRestoration = "manual";

  /*svg effect*/
  const filter = document.getElementById("turbulence");
  let frames = 1;
  let rad = Math.PI / 180;
  let bfx, bfy;
  let mm = 0;
  function freqAnimation() {
    frames += 0.2;
    bfx = 0.03;
    bfy = 0.03;
    bfx += 0.005 * Math.cos(frames * rad);
    bfy += 0.005 * Math.sin(frames * rad);
    var bf = bfx.toString() + " " + bfy.toString();
    filter.setAttributeNS(null, "baseFrequency", bf);
    window.requestAnimationFrame(freqAnimation);

    if (mm > 0) {
      document
        .getElementById("sourceGraphic")
        .setAttribute("scale", (mm += 100));
    }
  }
  window.requestAnimationFrame(freqAnimation);

  const loader_tl = gsap.timeline({
    defaults: {
      duration: 0.7,
    },
  });

  beforeLoad();
  function beforeLoad() {
    let pageLoader = document.querySelector(".page_loader");
    let svg = pageLoader.querySelector(".small_logo");
    let dot = svg.querySelector(".dot"),
      clip = svg.querySelector("#clip");

    gsap.set(clip, {
      attr: {
        r: 55,
        cx: -55,
      },
    });
    gsap.set(svg.querySelector(".small_logo svg"), {
      scaleX: 0.8,
      xPercent: -20,
    });
    gsap.set(svg.querySelectorAll("path"), {
      opacity: 1,
    });
    gsap.set(dot, {
      xPercent: -100,
      left: 0,
      background: "#808080",
      opacity: 1,
      height: 80,
      width: 80,
    });
    loader_tl
      .set(dot, {
        xPercent: -100,
        left: 0,
        width: 80,
        background: "#808080",
      })
      ///
      .to(dot, {
        xPercent: 20,
        left: "100%",
        background: "#000",
        duration: 1,
      })
      .to(
        dot,
        {
          width: 160,
        },
        "-=0.85"
      )
      .to(
        dot,
        {
          width: 80,
        },
        "-=0.25"
      )
      ///
      .to(dot, {
        xPercent: -100,
        left: 0,
        background: "#808080",
        duration: 1,
      })
      .to(
        dot,
        {
          width: 160,
        },
        "-=0.85"
      )
      .to(
        dot,
        {
          width: 80,
        },
        "-=0.25"
      )
      ///
      .to(dot, {
        xPercent: 20,
        left: "100%",
        background: "#000",
        duration: 1,
      })
      .to(
        dot,
        {
          width: 160,
        },
        "-=0.85"
      )
      .to(
        dot,
        {
          width: 80,
        },
        "-=0.45"
      )
      .to(
        dot,
        {
          xPercent: 30,
          scale: 0.3,
        },
        "-=0.35"
      )
      .to(
        clip,
        {
          attr: {
            r: 200,
            cx: 170,
          },
          duration: 0.95,
        },
        "-=1.6"
      )
      .to(
        svg.querySelector("svg"),
        {
          scaleX: 1,
          xPercent: 0,
        },
        "-=1.5"
      )
      ///
      .to(dot, {
        delay: 0.85,
        scale: 1,
        duration: 0.3,
      })
      .to(
        dot,
        {
          xPercent: -100,
          left: 0,
          background: "#808080",
        },
        "-=0.25"
      )
      .to(
        clip,
        {
          attr: {
            r: 55,
            cx: -55,
          },
          duration: 1,
        },
        "-=0.85"
      )
      ///
      .to(dot, {
        xPercent: 100,
        left: "100%",
        background: "#000",
        duration: 1,
      })
      .to(
        dot,
        {
          opacity: 0,
          duration: 0.3,
        },
        "-=0.25"
      )
      ///
      .pause();

    gsap.to(loader_tl, {
      progress: 1,
      duration: 3,
      ease: "none",
    });
    gsap.to(pageLoader, {
      delay: 3,
      opacity: 0,
      duration: 1,
      onstart: () => {
        console.log("asfsaf");
        mm = 1;
      },
    });
  }
});
