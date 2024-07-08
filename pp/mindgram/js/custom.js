"use strict";
jQuery(function ($) {
  if ($("#layer").length) {
    function getRandom(min, max) {
      return min + Math.random() * (max - min);
    }
    let time = 5, svgShape = document.getElementById("layer");
    gsap.set(svgShape, { opacity: 1 });
    gsap.from("#layer circle,#layer rect", time / 2, {
      opacity: 0
    })
    gsap.from("#layer circle,#layer rect", time, {
      scale: function () {
        return getRandom(0.3, 3);
      },
      x: function () {
        return getRandom(0, window.innerWidth / 2);
      },
      y: function () {
        return getRandom(0, svgShape.clientHeight);
      },
      rotate: function () {
        return getRandom(-45, 45);
      },
      transformOrigin: "center",
    })
    gsap.from("#line-dot", time, {
      x: -window.innerWidth,
    })
    gsap.from("#circle-dot3", time, {
      xPercent: -50,
    })
    gsap.from("#circle-dot4", time, {
      yPercent: -15,
    })
    gsap.from("#circle-dot1", time, {
      xPercent: 50,
      yPercent: -50,
      onComplete: function () {
        let tl = gsap.timeline({ repeat: -1, repeatDelay: 0, });
        tl.to("#line-dot,#circle-dot4,#circle-dot2", time * 6, {
          rotate: 360,
          ease: Linear.easeNone,
          transformOrigin: "center",
        });
        let tl2 = gsap.timeline({ repeat: -1, repeatDelay: 0, });
        tl2.to("#circle-dot5,#circle-dot3,#circle-dot1", time * 6, {
          rotate: -360,
          ease: Linear.easeNone,
          transformOrigin: "center",
        })
      }
    });
  }
});