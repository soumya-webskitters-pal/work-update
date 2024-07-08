"use strict";
const responsive_size = 1024;
var isDekstop = true;

//prevent scroll
function pvs(e) {
  e.preventDefault();
  e.stopPropagation();
  return false;
}
function preventScroll() {
  document.body.classList.add("disable");
  document.addEventListener("wheel", pvs, { passive: false });
  document.addEventListener("touchstart", pvs, { passive: false });
  document.addEventListener("touchend", pvs, { passive: false });
  document.addEventListener("touchmove", pvs, { passive: false });
}
//enable scroll
function enableScroll() {
  document.body.classList.remove("disable");
  document.removeEventListener("wheel", pvs, { passive: false });
  document.removeEventListener("touchstart", pvs, { passive: false });
  document.removeEventListener("touchend", pvs, { passive: false });
  document.removeEventListener("touchmove", pvs, { passive: false });
}
preventScroll();

//detect device width
if (window.innerWidth <= responsive_size) {
  isDekstop = false;
  document.body.classList.add("mobileLayout");
}

//detect mobile device type
function detectDevice() {
  const iOS = /^iP/.test(navigator.platform);
  if (iOS) {
    document.body.classList.add("iphone");
  } else {
    document.body.classList.add("android");
  }
}

// Detect Safari
if (
  navigator.userAgent.indexOf("Safari") > -1 &&
  navigator.userAgent.indexOf("Chrome") <= -1
) {
  document.body.classList.add("safari_browser");
}

var loader = document.getElementById("loader");
var loco_scroll;
const page_container = document.querySelector("[data-scroll-container]");

if (loader != undefined && loader != null) {
}

//initial loading scripts
function onAlways() {
  gsap.registerPlugin(ScrollTrigger);
  window.history.scrollRestoration = "manual";
  ScrollTrigger.clearScrollMemory();
  window.scrollTo(0, 0);

  //for desktop
  if (isDekstop) {
    loco_scroll = new LocomotiveScroll({
      el: page_container,
      smooth: true,
      class: "inviewport",
      // reloadOnContextChange: true,
      offset: [0, 0],
      // repeat: true,
      initPosition: { x: 0, y: 0 },
      direction: "vertical",
      getDirection: true,
      getSpeed: true,
      tablet: { breakpoint: 0, smooth: false },
      smartphone: { smooth: false },
    });
    loco_scroll.on("scroll", ScrollTrigger.update);
    ScrollTrigger.scrollerProxy(page_container, {
      scrollTop(value) {
        return arguments.length
          ? loco_scroll.scrollTo(value, 0, 0)
          : loco_scroll.scroll.instance.scroll.y;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: page_container.style.transform ? "transform" : "fixed",
    });
    ScrollTrigger.addEventListener("refresh", () => loco_scroll.update());
    loco_scroll.stop();
  }
  //for mobile
  else {
    detectDevice();
    $(page_container).unwrap();
  }

  function refresh() {
    if (isDekstop) {
      loco_scroll.update();
    }
    ScrollTrigger.update();
    ScrollTrigger.refresh();
  }
  refresh();

  window.addEventListener("resize", refresh);

  //page ready
  if (loader != null) {
    gsap.to(loader, {
      opacity: 0,
      duration: 0.5,
      onEnd: afterPageLoad,
      onComplete: () => {
        $(loader).remove();
        enableScroll();
        refresh();
      },
    });
  } else {
    enableScroll();
    refresh();
    afterPageLoad();
  }
  //end script
}

//all functional scripts
function afterPageLoad() {
  ScrollTrigger.clearScrollMemory();
  window.history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
  if (isDekstop) {
    loco_scroll.start();
  }
  // Navbar
  $("<span class='clickD'></span>").insertAfter(
    ".navbar-nav li.menu-item-has-children > a"
  );
  $(".navbar-nav li .clickD").click(function (e) {
    e.preventDefault();
    var $this = $(this);
    if ($this.next().hasClass("show")) {
      $this.next().removeClass("show");
      $this.removeClass("toggled");
    } else {
      $this.parent().parent().find(".sub-menu").removeClass("show");
      $this.parent().parent().find(".toggled").removeClass("toggled");
      $this.next().toggleClass("show");
      $this.toggleClass("toggled");
    }
  });
  gsap.set(".main-head .navbar", {
    opacity: 0,
  });
  gsap.set([".main-head .navbar-nav>li", ".main-head .nav_btns_group>li"], {
    opacity: 0,
    yPercent: 50,
  });
  var nav_timeline = gsap.timeline();
  nav_timeline
    .to(".main-head .navbar", { opacity: 1, duration: 0.3 }, "-=0.5")
    .to([".main-head .navbar-nav>li", ".main-head .nav_btns_group>li"], {
      opacity: 1,
      yPercent: 0,
      stagger: 0.04,
      duration: 0.3,
    })
    .pause();

  nav_timeline.pause().restart();
  $(".main-head").addClass("active");

  // to make sticky nav bar
  var oldScrollVal = 0;
  const navHeight = document.querySelector(".main-head").clientHeight;
  if (isDekstop) {
    loco_scroll.on("scroll", (e) => {
      if (e.direction == "down") {
        if (e.delta.y > navHeight) {
          $(".main-head").removeClass("active hasBg");
        }
      } else {
        if (e.delta.y == 0) {
          $(".main-head").removeClass("hasBg");
        } else {
          if (!$("body").hasClass("home") || e.delta.y < navHeight) {
            $(".main-head").addClass("active hasBg");
          }
        }
      }
    });
  } else {
    $(window).scroll(function () {
      var scroll = $(window).scrollTop();
      if (oldScrollVal >= scroll && !$("body").hasClass("home")) {
        $(".main-head").addClass("active");
      } else {
        if (scroll > navHeight) {
          $(".main-head").removeClass("active");
        }
      }
      if (scroll < navHeight * 2) {
        $(".main-head").addClass("active");
      }
      oldScrollVal = scroll;
    });
  }

  //open nav
  let navmenu = document.querySelector(".collapsed_navbar"),
    navlist = navmenu.querySelector(".navbar-nav");
  $("<span class='line lft'></span><span class='line rt'></span>").appendTo(
    navlist
  );
  $(navlist)
    .find(">li")
    .each(function (i, nl) {
      $(nl).find(">a").attr("data-glitchtext", "link");
      $(nl).find(">a").wrapInner("<span class='list_itm' data-glitch></span>");
      $(
        `<span class='nv_count'>${(i + 1)
          .toString()
          .padStart(
            2,
            "0"
          )}<span class="line lft"></span><span class="line rt"></span></span>`
      ).prependTo($(nl));
      $(
        `<span class='nv_arw'><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M1.31787 1H19.3179V19" stroke="currentColor" /><path d="M0.5 19.0001L18.9091 1.40918" stroke="currentColor" /></svg><span>`
      ).appendTo($(nl).find("a"));
    });
  gsap.set(navmenu, { opacity: 0, pointerEvents: "none" });
  gsap.set(navlist, { scaleY: 0, transformOrigin: "top center" });
  gsap.set(navmenu.querySelector(".cls_btn_wrp"), { scale: 0 });
  gsap.set(navlist.querySelectorAll("li"), { opacity: 0, y: 100 });

  var navTl = gsap.timeline();
  navTl
    .to(navmenu, {
      opacity: 1,
      pointerEvents: "all",
    })
    .to(navlist, {
      scaleY: 1,
    })
    .to(navlist.querySelectorAll("li"), {
      opacity: 1,
      y: 0,
      stagger: 0.05,
    })
    .to(
      navmenu.querySelector(".cls_btn_wrp"),
      {
        scale: 1,
      },
      "-=0.15"
    )
    .pause();

  $(".navbar-toggler").on("click", function (e) {
    e.preventDefault();
    if (isDekstop) {
      loco_scroll.stop();
    }
    $(this).addClass("open");
    $(".close_menu").addClass("show");
    navTl.timeScale(1).restart();
  });

  $(".close_menu").on("click", function (e) {
    e.preventDefault();
    $(".navbar-toggler").removeClass("open");
    $(this).removeClass("show");
    navTl.timeScale(2).reverse();
    if (isDekstop) {
      loco_scroll.start();
    }
  });

  //parallax
  if ($("[data-parallax]").length) {
    const parallax_box = document.querySelectorAll("[data-parallax]");
    parallax_box.forEach(function (prel) {
      if (prel.dataset.parallax == "all" || isDekstop) {
        const parallax_el = prel.querySelectorAll("[data-speed]");
        parallax_el.forEach(function (el) {
          if (el.dataset.desktop === undefined || isDekstop) {
            let smoothVal =
              Number(el.dataset.speed === 0 ? 1 : el.dataset.speed) * 100;
            let topPos = el.getBoundingClientRect().top;

            gsap.to(el, {
              scale: () =>
                el.dataset.zoom != undefined ? 1 + el.dataset.speed / 2 : 1,
              yPercent: () =>
                el.dataset.zoom === undefined && el.dataset.move === undefined
                  ? -smoothVal
                  : 0,
              xPercent: () =>
                el.dataset.move != undefined
                  ? el.dataset.move == "-x"
                    ? smoothVal
                    : -smoothVal
                  : 0,
              ease: "none",
              scrollTrigger: {
                scroller: isDekstop ? page_container : window,
                start: () =>
                  topPos > window.innerHeight ? "top bottom" : "top top",
                trigger: prel,
                scrub: 1,
                // markers: true,
              },
            });
          }
        });
      }
    });
  }

  //move elements on mouse move
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
  if ($("[data-movement]").length && isDekstop) {
    const bnrMove = document.querySelectorAll("[data-movement]");
    window.addEventListener("mousemove", function (mouse) {
      bnrMove.forEach(function (el, i) {
        let resistance =
          (el.dataset.movement != 0 ? Number(el.dataset.movement) : 0.5) * 10;
        parallax(el, resistance, mouse);
      });
    });
  }

  //title text anim
  if ($("[data-effect='title']").length) {
    document.querySelectorAll("[data-effect='title']").forEach((t) => {
      const topPos = t.getBoundingClientRect().top;
      let titleTl = gsap.timeline({
        defaults: {
          ease: "Power3.easeOut",
          duration: 0.7,
        },
      });
      function animload() {
        Splitting({ target: t, by: "chars" });
        const e = t.querySelectorAll(".char");
        e.forEach((t) =>
          gsap.set(t.parentNode, {
            perspective: 1e3,
          })
        );
        titleTl
          .set(t, { opacity: 1 })
          .fromTo(
            e,
            {
              "will-change": "opacity, transform",
              opacity: 0,
              rotateX: () => gsap.utils.random(-120, 120),
              z: () => gsap.utils.random(-200, 200),
              filter: "blur(10px)",
              scale: () => gsap.utils.random(-0.5, 1.5),
            },
            {
              opacity: 1,
              rotateX: 0,
              scale: 1,
              z: 0,
              filter: "none",
              stagger: 0.06,
            }
          )
          .pause();
      }

      if (topPos > window.innerHeight - 100) {
        //set animation on section enter
        ScrollTrigger.create({
          scroller: isDekstop ? page_container : window,
          trigger: t,
          start: "top bottom",
          onEnter: animload,
          onEnterBack: animload,
          once: true,
          // markers:true,
        });

        ScrollTrigger.create({
          scroller: isDekstop ? page_container : window,
          trigger: t,
          start: "top 80%",
          end: "bottom bottom",
          animation: titleTl,
          toggleActions: "play none play none",
          // scrub: 1,
          // markers: true,
        });
      } else {
        animload();
        setTimeout(() => {
          titleTl.play();
        }, 1000);
      }
    });
  }

  //sub-title text anim
  if ($("[data-effect='subtitle']").length) {
    document.querySelectorAll("[data-effect='subtitle']").forEach((t) => {
      const topPos = t.getBoundingClientRect().top;
      let titleTl = gsap.timeline({
        defaults: {
          ease: "Power3.easeOut",
          duration: 0.7,
        },
      });
      function animload() {
        Splitting({ target: t, by: "chars" });
        const e = t.querySelectorAll(".char");
        e.forEach((t) =>
          gsap.set(t.parentNode, {
            perspective: 1e3,
          })
        );
        titleTl
          .to(t, { opacity: 1 })
          .fromTo(
            e,
            {
              "will-change": "opacity, transform",
              opacity: 0,
              yPercent: 100,
            },
            {
              opacity: 1,
              yPercent: 0,
              stagger: 0.02,
            }
          )
          .pause();
      }

      if (topPos > window.innerHeight - 100) {
        //set animation on section enter
        ScrollTrigger.create({
          scroller: isDekstop ? page_container : window,
          trigger: t,
          start: "top bottom",
          onEnter: animload,
          onEnterBack: animload,
          once: true,
          // markers:true,
        });

        ScrollTrigger.create({
          scroller: isDekstop ? page_container : window,
          trigger: t,
          start: "top 80%",
          end: "bottom bottom",
          animation: titleTl,
          toggleActions: "play none play none",
          // scrub: 1,
          // markers:true,
        });
      } else {
        animload();
        setTimeout(() => {
          titleTl.play();
        }, 1000);
      }
    });
  }

  //position anim -from
  if ($("[data-position]").length) {
    let el_position = document.querySelectorAll("[data-position]");
    el_position.forEach((t) => {
      const topPos = t.getBoundingClientRect().top;
      const data = t.dataset.position;
      gsap.set(t, {
        opacity: 0,
        xPercent: () => {
          if (data != undefined && data == "left") {
            return -100;
          }
          if (data != undefined && data == "right") {
            return 100;
          }
        },
        yPercent: () => {
          if (data != undefined && data == "top") {
            return -100;
          }
          if (data != undefined && data == "bottom") {
            return 100;
          }
        },
        scaleX: () => {
          if (data != undefined && data == "zoomX") {
            return 0.5;
          }
          if (data != undefined && data == "scaleX") {
            return 1.1;
          }
        },
        scaleY: () => {
          if (data != undefined && data == "zoomY") {
            return 0.5;
          }
          if (data != undefined && data == "scaleY") {
            return 1.1;
          }
        },
      });

      gsap.to(t, {
        delay: topPos > window.innerHeight ? 0 : isDekstop ? 2 : 0.5,
        opacity: 1,
        xPercent: 0,
        yPercent: 0,
        scaleX: 1,
        scaleY: 1,
        duration: 1,
        scrollTrigger: {
          scroller: isDekstop ? page_container : window,
          start: "top bottom",
          end: "+=1%",
          trigger: t,
          // markers: true,
        },
      });
    });
  }

  // smooth scroll to any section
  if ($("a.scroll").length) {
    $("a.scroll").on("click", function (event) {
      if (this.hash !== "") {
        event.preventDefault();
        var target = this.hash,
          $target = $(target);
        $("html, body").animate(
          {
            scrollTop: $target.offset().top - 60,
          },
          800,
          function () {
            window.location.href.substr(0, window.location.href.indexOf("#"));
          }
        );
      }
    });
  }

  // back to top
  if ($("#scroll").length) {
    $(window).scroll(function () {
      if ($(this).scrollTop() > 200) {
        $("#scroll").fadeIn(200);
      } else {
        $("#scroll").fadeOut(200);
      }
    });
    $("#scroll").click(function () {
      $("html, body").animate({ scrollTop: 0 }, 500);
      return false;
    });
  }
}

//load all images
document.addEventListener(
  "DOMContentLoaded",
  function () {
    var allImg = document.querySelectorAll("img[data-src]"),
      eachImgCount = 0;
    const imgLoad = new imagesLoaded("img");
    if (allImg != undefined || allImg != null) {
      allImg.forEach((imgs) => {
        var getSrc = imgs.dataset.src;
        imgs.setAttribute("src", getSrc);

        if (imgs.nodeName == "video") {
          imgs.play();
        }

        var imgLoad = imagesLoaded(imgs);
        imgLoad.on("always", function () {
          // console.log(eachImgCount, allImg.length);
          if (eachImgCount == allImg.length) {
            onAlways();
            ScrollTrigger.refresh();
            if (isDekstop) {
              loco_scroll.update();
            }
          }
        });
        imgLoad.on("progress", function (instance, image) {
          if (image.isLoaded == true) {
            image.img.classList.add("loaded");
            eachImgCount++;
          }
        });
      });
    }
  },
  false
);

//load fonts --then init page scripts
// function loadFonts() {
//   if (sessionStorage.fontsLoaded) {
//     document.documentElement.classList.add("fonts-loaded");
//     return;
//   }
//   if ("fonts" in document) {
//     new FontFaceObserver("Bartomes").load().then(() => {
//       document.documentElement.classList.add("fonts-loaded");
//       onAlways();
//     });
//   }
// }
// loadFonts();

window.onbeforeunload = function () {
  window.history.scrollRestoration = "manual";
  ScrollTrigger.clearScrollMemory();
  window.scrollTo(0, 0);
};
