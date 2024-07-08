"use strict";
gsap.registerPlugin(ScrollTrigger, CSSRulePlugin);
ScrollTrigger.refresh();
if (window.history.scrollRestoration) {
  window.history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

 //// page smooth scroll
 let page_container = document.querySelector('[data-scroll-container]');
 let loco_scroll = new LocomotiveScroll({
     el: page_container,
     smooth: true,
     class: "inviewport",
     offset: [0, 0],
     repeat: true,
     initPosition: { x: 0, y: 0 },
     direction: "vertical",
     getDirection: true,
     getSpeed: true,
     tablet: { smooth: false },
     smartphone: { smooth: false }
 });
 loco_scroll.on("scroll", ScrollTrigger.update);
 ScrollTrigger.scrollerProxy(page_container, {
     scrollTop(value) {
         return arguments.length ? loco_scroll.scrollTo(value, 0, 0) : loco_scroll.scroll.instance.scroll.y;
     },
     getBoundingClientRect() {
         return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
     },
     pinType: page_container.style.transform ? "transform" : "fixed"
 });
 ScrollTrigger.addEventListener("refresh", () => loco_scroll.update());
 ScrollTrigger.refresh();
 

let ldrC = gsap.timeline({
  repeat: -1,
  yoyo: true,
});
ldrC
  .to("#plogo > circle", {
    fill: "#ffffff",
    stagger: { amount: 1, from: "random", ease: "power2.in" },
  })
  .to("#plogo > circle", {
    fill: "#F4BB47",
    stagger: { amount: 1, from: "random", ease: "power3.Out" },
  })
  .to("#plogo > circle", {
    fill: "#2456A5",
    stagger: { amount: 1, from: "random", ease: "power2.Out" },
  })
  .to("#plogo > circle", {
    fill: "#9F1F36",
    stagger: { amount: 1, from: "random", ease: "power3.in" },
  });

/////
function readyInit() {
  ///wave animation
  var topWave = wavify(document.querySelector("#wave"), {
    height: 110,
    bones: 12,
    amplitude: 12,
    color: "#3E2300",
    speed: 0.3,
  });
  // topWave.pause();
  // topWave.play();
  // topWave.reboot();
  // topWave.updateColor({
  //   color: "#FFF",
  //   timing: 10,
  //   onComplete: function () {
  //     console.log("Transition Complete !");
  //   },
  // });

  //logo anim
  var logo_tl = gsap.timeline({ pause: true, repeat: -1, yoyo: true });

  logo_tl
    .to(".navbar-brand svg>circle", {
      delay: 0.5,
      opacity: 1,
      stagger: { each: 0.03, from: "random" },
      duration: 1,
    })
    .to(".navbar-brand svg>circle", {
      delay: 5,
      opacity: 0,
      stagger: { each: 0.01, from: "random" },
      duration: 1,
    });

  ///particle animation
  if ($("[data-particle]").length) {
    let parent = document.querySelectorAll("[data-particle]")[0];
    let childCount = parent.getAttribute("data-particle");
    let offset = 100;
    for (let i = 0; i < childCount; i++) {
      let p = document.createElement("div");
      parent.appendChild(p);
      let w = window.innerWidth,
        h = window.innerHeight;
      if (i % 2) {
        gsap.set(p, {
          x: () => `random(25, ${w / 2 - offset}, 200)`,
          y: () => `random(25, ${h / 2 - offset}, 150)`,
          z: () => `random(0, 15, 1)`,
          opacity: () => `random(0, 0.7, 0.1)`,
          scale: () => `random(0.2, 1.5, 0.1)`,
        });
        gsap.to(p, {
          x: () => `random(50, ${w / 2 - offset}, 30)`,
          y: () => `random(50, ${h / 2 - offset}, 50)`,
          duration: `random(50, 100, 10)`,
          ease: "none",
          repeat: -1,
          repeatRefresh: true,
        });
      } else {
        gsap.set(p, {
          x: () => `random(${w / 2 + offset}, ${w}, 200)`,
          y: () => `random(${h / 2 + offset}, ${h}, 150)`,
          z: () => `random(0, 15, 1)`,
          opacity: () => `random(0, 0.7, 0.1)`,
          scale: () => `random(0.2, 1.5, 0.1)`,
        });
        gsap.to(p, {
          x: () => `random(${w / 2 + offset}, ${w}, 30)`,
          y: () => `random(${h / 2 + offset}, ${h}, 50)`,
          duration: `random(50, 100, 10)`,
          ease: "none",
          repeat: -1,
          repeatRefresh: true,
        });
      }
      gsap.to(p, {
        scale: () => `random(0.1, 1.2, 0.1)`,
        z: () => `random(2, 25, 1)`,
        duration: 10,
        ease: "none",
        repeat: -1,
        repeatRefresh: true,
      });
      gsap.to(p, {
        opacity: () => `random(0, 0.5, 0.1)`,
        duration: 5,
        ease: "none",
        repeat: -1,
        repeatRefresh: true,
      });
    }
  }

  ///add gap to banner
  if ($(".banner").length) {
    function addGap() {
      document.querySelector(".banner").style.paddingTop =
        document.querySelector(".main-head").clientHeight + "px";
    }
    addGap();
    window.addEventListener("resize", addGap);
    window.addEventListener("scroll", addGap);
  }

  gsap.set(".center_banner", {
    scale: 1.4,
  });
}
/////
function loadInit() {
//locomotive & scrolltrigger refresh
ScrollTrigger.addEventListener("refresh", () => loco_scroll.update());
ScrollTrigger.refresh();

  loco_scroll.scrollTo(page_container, 0);
  
  //pause loader
  ldrC.pause();
  ldrC.kill();
  gsap.to("#plogo > circle", {
    fill: "#FFFFFF",
  });

  gsap.to("#plogo > .lc", {
    fill: "#F4BB47",
    onComplete: () => {
      gsap.to("#plogo", {
        opacity: 0,
      });
      gsap.to("#loader .waves", {
        yPercent: -150,
        duration: 1,
        onComplete: () => {
          $("#loader").remove();
        },
      });

      //load menu
      menuAnim();
    },
  });

  //load banner
  let page_bannerEl = gsap.timeline({ pause: true });
  const pr_el = $(".center_banner").get(0);
  const bnr = document.querySelector(".home_banner");
  ////create parallax function
  bnr.addEventListener("mousemove", function (mouse) {
    $(bnr)
      .find("[data-move]")
      .each(function (i, el) {
        let _this = this;
        let resistance = Number($(_this).attr("data-move")) * 10;
        parallax(el, resistance, mouse);
      });
  });

  page_bannerEl
    .set(".home_banner_inner .popin", {
      scale: 0,
      opacity: 0,
    })
    .set(".home_banner_inner .all_text > span span", {
      yPercent: 45,
      opacity: 0,
      scaleX: 3,
      display: "inline-block",
    })
    .to(pr_el, {
      scale: 0.8,
      x: 0,
      y: 0,
      xPercent: -50,
      yPercent: -50,
      duration: 1,
      onComplete: () => {
        gsap.set(".home_banner_inner", {
          opacity: 1,
        });
        gsap.to(".home_banner_inner .popin", {
          duration: 1.5,
          scale: 1,
          opacity: 1,
          ease: "elastic.inOut",
          stagger: 0.01,
        });
        gsap.to(".home_banner_inner .all_text > span span", {
          delay: 1,
          yPercent: 0,
          opacity: 1,
          scaleX: 1,
          stagger: 0.08,
          duration: 0.5,
          ease: "Power3.inOut",
        });
      },
    })
    .to(pr_el, { delay: 2, duration: 1, opacity: 1 });

  ScrollTrigger.create({
    trigger: ".home_banner",
    scrub: 1.3,
    pin: true,
    // once: true,
    animation: page_bannerEl,
    // markers: true,
    start: "top-=1px top",
    end: () => window.innerHeight / 3,
    invalidateOnRefresh: true,
    scroller: page_container,
    onLeave: () => {
      gsap.to(".main-head", {
        yPercent: -110,
      });
      $(pr_el).addClass("glow");
    },
    onEnterBack: () => {
      gsap.to(".main-head", {
        yPercent: 0,
        overwrite: true,
      });
      $(pr_el).removeClass("glow");
    },
  });

  let page_sliderEl = gsap.timeline({ pause: true });
  page_sliderEl
    .set(pr_el, {
      scale: 0.8,
      x: 0,
      y: 0,
      xPercent: -50,
      yPercent: -50,
      duration: 1,
    })
    .to(pr_el, {
      scale: 1,
      x: "-2%",
      y: "5vh",
      xPercent: -50,
      yPercent: -50,
      scale: 1.3,
      duration: 5,
    });

  ScrollTrigger.create({
    trigger: ".after_banner",
    scrub: 1.3,
    start: () => window.innerHeight / 3,
    end: `+=${window.innerHeight}px`,
    animation: page_sliderEl,
    invalidateOnRefresh: true,
    scroller: page_container,
    // markers: true,
  });

  gsap.set(".box_inner>*", {
    xPercent: 50,
    opacity: 0,
  });
  gsap.set(".dot_start,.dot_end", {
    scale: 0,
    opacity: 0,
  });
  let benefit_tl = gsap.timeline({ pause: true });
  $(".pr_box").each(function () {
    let _this = $(this);
    benefit_tl
      .set(_this, {
        opacity: 1,
      })
      .to(_this.find(".dot_end"), {
        scale: 1,
        opacity: 1,
        duration: 0.1,
        ease: "Elastic.easeOut",
      })
      .to(_this.find(".dot_start"), {
        scale: 1,
        opacity: 1,
        duration: 0.1,
        onComplete: () => {
          _this.addClass("active");
        },
      })
      .to(_this.find(".box_inner>*"), {
        xPercent: 0,
        opacity: 1,
        stagger: 0.01,
        duration: 0.3,
      });
  });
  benefit_tl.to(".pr_box", {
    delay: 2,
    opacity: 0,
    stagger: 0.1,
  });
  benefit_tl.pause();

  ScrollTrigger.create({
    trigger: ".after_banner_inner",
    scrub: 1.3,
    pin: true,
    // markers: true,
    start: "top top",
    end: `+=${window.innerHeight / 2}px`,
    animation: benefit_tl,
    invalidateOnRefresh: true,
    scroller: page_container,
  });

  //menubar anim
  function menuAnim() {
    gsap.set([".navbar-nav>li", ".nav_btns_group>li"], {
      opacity: 0,
      yPercent: 100,
    });

    gsap.set(".navbar", { opacity: 1 });
    gsap.to([".navbar-nav>li", ".nav_btns_group>li"], {
      delay: 1,
      opacity: 1,
      yPercent: 0,
      stagger: 0.1,
      duration: 0.6,
    });
  }

  // ScrollTrigger.create({
  //   trigger: pr_el,
  //   scrub: 1.3,
  //   // pin: true,
  //   // pinSpacing: false,
  //   animation: product_tl,
  //   markers: true,
  //   start: "top top",
  //   end: () => window.innerHeight * 3,
  // });

  //parallax
  function parallax(el, resistance, mouse) {
    let x = (mouse.clientX - window.innerWidth / 2) / resistance / 10,
      y = (mouse.clientY - window.innerHeight / 2) / resistance / 5;
    // console.log(x, y);
    gsap.to(el, {
      x: x,
      y: y,
      duration: 0.2,
      ease: "none",
      z: Math.max(x * 10, y * 10),
    });
  }

  ////////slider
  ///wave animation
  const wave = document.querySelectorAll(".v_wave");
  wave.forEach(function (el) {
    wavify(el, {
      height: 60,
      bones: 12,
      amplitude: gsap.utils.random(15, 20),
      speed: gsap.utils.random(0.35, 0.45),
    });
  });

  var sliderTL = gsap.timeline({ pause: true });
  const sl_items = $(".full_sl_item");

  sl_items.each(function (i, el) {
    if (i > 0) {
      // gsap.set(el, {
      //   opacity: 0,
      // });
      gsap.set($(el).find(".sl_bg"), {
        opacity: 0,
      });
      gsap.set(
        [
          $(el).find(".sl_float"),
          $(el).find(".rt_col"),
          $(el).find(".lft_col"),
        ],
        {
          yPercent: 100,
          opacity: 0,
        }
      );
    }
  });
  sliderTL
    // .set($(".full_sl_item").eq(0), {
    //   opacity: 1,
    // })
    .to($(".full_sl_item").eq(0).find(".sl_bg"), {
      opacity: 1,
      duration: 1,
      ease: "none",
    })
    .to(
      $(".full_sl_item").eq(0).find(".sl_float"),
      {
        yPercent: 0,
        duration: 1,
        ease: "Power3.in",
      },
      "-=1"
    )
    .to(
      $(".full_sl_item").eq(0).find(".rt_col"),
      {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        ease: "Power3.in",
      },
      "-=1"
    )
    .to(
      $(".full_sl_item").eq(0).find(".lft_col"),
      {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        ease: "none",
      },
      "-=1"
    )
    ////
    .to($(".full_sl_item").eq(0).find(".sl_bg"), {
      opacity: 0,
      duration: 1,
      ease: "none",
    })
    .to(
      $(".full_sl_item").eq(0).find(".sl_float"),
      {
        yPercent: -100,
        opacity: 0,
        duration: 1,
        ease: "Power3.in",
      },
      "-=1"
    )
    .to(
      $(".full_sl_item").eq(0).find(".rt_col"),
      {
        yPercent: -100,
        opacity: 0,
        duration: 1,
        ease: "Power3.in",
      },
      "-=1"
    )
    .to(
      $(".full_sl_item").eq(0).find(".lft_col"),
      {
        yPercent: -100,
        opacity: 0,
        duration: 1,
        ease: "none",
      },
      "-=1"
    )
    ////
    .to(
      $(".full_sl_item").eq(1).find(".sl_bg"),
      {
        opacity: 1,
        duration: 1,
        ease: "none",
      },
      "-=1"
    )
    .to(
      $(".full_sl_item").eq(1).find(".sl_float"),
      {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        ease: "Power3.in",
      },
      "-=1"
    )
    .to(
      $(".full_sl_item").eq(1).find(".rt_col"),
      {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        ease: "Power3.in",
      },
      "-=1"
    )
    .to(
      $(".full_sl_item").eq(1).find(".lft_col"),
      {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        ease: "none",
      },
      "-=1"
    );

  ScrollTrigger.create({
    trigger: ".full_slider_sec",
    scrub: 1,
    pin: true,
    animation: sliderTL,
    // markers: true,
    start: "top top",
    end: () => (window.innerHeight / 4) * (sl_items - 1),
    snap: {
      snapTo: 1 / (sl_items.length - 1),
      duration: 2,
      delay: 0.02,
      ease: "none",
    },
    scroller: page_container,
  });
  ///end
}

/////
$(document).ready(function () {
  readyInit();
});

//// page loader
jQuery(".bg,img")
  .imagesLoaded({
    background: true,
  })
  .progress(function (instance, image) {})
  .always(function () {
    setTimeout(() => {
      loadInit();
    }, 1000);
  });
