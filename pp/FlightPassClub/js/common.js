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
preventScroll();
//enable scroll
function enableScroll() {
  document.body.classList.remove("disable");
  document.removeEventListener("wheel", pvs, { passive: false });
  document.removeEventListener("touchstart", pvs, { passive: false });
  document.removeEventListener("touchend", pvs, { passive: false });
  document.removeEventListener("touchmove", pvs, { passive: false });
}
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
detectDevice();

document.addEventListener("DOMContentLoaded", pageScript, false);

function pageScript() {
  gsap.registerPlugin(ScrollTrigger, TextPlugin, ScrollToPlugin);

  //// page smooth scroll
  var page_container = document.querySelector("[data-scroll-container]");
  //for desktop
  if (isDekstop) {
    var loco_scroll = new LocomotiveScroll({
      el: page_container,
      smooth: true,
      class: "inviewport",
      reloadOnContextChange: true,
      offset: [0, 0],
      repeat: true,
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
    ScrollTrigger.refresh();
    loco_scroll.stop();
  } else {
    page_container = window;
  }

  //refresh scrollTrigger on resize/load
  const refresh = () => {
    ScrollTrigger.refresh(true);
  };
  window.addEventListener("resize", refresh);

  //show loader
  gsap.to(".loader .load_percent", { opacity: 1 });

  // load page
  jQuery(document).ready(function ($) {
    gsap.set(".navbar-nav>li", {
      opacity: 0,
      yPercent: 100,
    });
    gsap.set("#navbar_collapse", {
      xPercent: 110,
    });
    const nav_mobile = gsap.timeline({ pause: true });
    nav_mobile
      .to("#navbar_collapse", {
        xPercent: 0,
        duration: 0.6,
        ease: "Power2.easeOut",
      })
      .to(
        ".navbar-nav>li",
        {
          opacity: 1,
          yPercent: 0,
          stagger: 0.1,
          duration: 1,
          ease: "Power3.easeOut",
        },
        "-=0.2"
      )
      .pause();
    $(".navbar-toggler").on("click", function (e) {
      e.preventDefault();
      if ($(this).hasClass("active")) {
        nav_mobile.reverse(0.6).then(() => {
          $(this).removeClass("active");
          $("#navbar_collapse").removeClass("show");
          $("body").removeClass("open-nav");

          if (isDekstop) {
            loco_scroll.start();
          } else {
            enableScroll();
          }
          ScrollTrigger.refresh(true);
        });
      } else {
        $(this).addClass("active");
        $("#navbar_collapse").addClass("show");
        $("body").addClass("open-nav");
        nav_mobile.restart();
        if (isDekstop) {
          loco_scroll.stop();
        } else {
          preventScroll();
        }
        ScrollTrigger.refresh(true);
      }
    });

    //create side navbar
    $('<nav class="side_nav" id="side_nav"><ul></ul></nav>').appendTo("body");
    $("[data-index]").each(function (i) {
      let numb = Number(i + 1).toString();
      let sec_id = "sec" + numb;
      this.id = sec_id;
      $(
        '<li><a href="#' + sec_id + '">' + numb.padStart(2, "0") + "</a></li>"
      ).appendTo("#side_nav>ul");
      $(".navbar-nav>li")
        .eq(i)
        .find(">a")
        .attr("href", "#" + sec_id);
    });

    $("#side_nav a").on("click", function (e) {
      $("#side_nav>li").removeClass("active");
      $(this).parent().addClass("active");
    });
    $(".navbar-nav>li>a").on("click", function (e) {
      $(".navbar-nav>li").removeClass("current-menu-item");
      $(this).parent().addClass("current-menu-item");
    });
    $("#side_nav a, .navbar-nav>li>a").on("click", function (e) {
      // console.log(e);
      e.preventDefault();
      const hash = this.hash;
      const navHeight = document.querySelector(".main-head").clientHeight + 50;
      if (isDekstop) {
        loco_scroll.start();
        loco_scroll.scrollTo(hash, -navHeight);
      } else {
        $("html, body").animate(
          {
            scrollTop: $(this).offset().top + 30,
          },
          1000
        );
      }
    });

    //add gap to banner
    if ($(".banner").length) {
      function addGap() {
        document.querySelector(".banner").style.paddingTop =
          document.querySelector(".main-head").clientHeight + "px";
      }
      addGap();
      window.addEventListener("resize", addGap);
      window.addEventListener("scroll", addGap);

      //sticky navbar
      if (isDekstop) {
        //locomotive scroller
        loco_scroll.on("scroll", (els) => {
          if (els.scroll.y > window.innerHeight) {
            $(".main-head").addClass("sticky");
          } else {
            $(".main-head").removeClass("sticky");
          }
        });
      } else {
        $(window).scroll(function () {
          if ($(window).scrollTop() > window.innerHeight) {
            $(".main-head").addClass("sticky");
          } else {
            $(".main-head").removeClass("sticky");
          }
        });
      }
    }

    //intro banner Animation
    if ($(".banne_bg").length) {
      let bnel = $(".banne_bg");
      let bannerTl = gsap.timeline({
        defaults: {
          ease: "none",
        },
        repeatRefresh: true,
        smoothChildTiming: true,
      });
      bannerTl
        .set(bnel, {
          clipPath: "inset(0% 0% 0% 0%)",
          overwrite: true,
        })
        .to(bnel, {
          clipPath: () =>
            isDekstop ? "inset(15% 40% 10% 40%)" : "inset(25% 20% 20% 20%)",
          duration: 1,
        })
        .to(bnel, { opacity: 1, duration: 0.5 })
        .pause();
      ScrollTrigger.create({
        trigger: ".banner",
        start: "top top",
        end: "+=50%",
        scrub: 1.1,
        animation: bannerTl,
        pin: true,
        scroller: page_container,
        // markers: true,
      });
    }

    //flight section
    if ($(".map_box").length) {
      let mapTl = gsap.timeline();
      mapTl
        .to(".flight1", {
          x: "35vw",
          ease: "power3.easeOut",
          duration: 1.5,
        })
        .to(
          ".flight2",
          {
            x: "25vw",
            ease: "power3.easeIn",
            duration: 1.6,
          },
          "<"
        )
        .to(
          ".flight3",
          {
            x: "20vw",
            ease: "power2.easeOut",
            duration: 2,
          },
          "<"
        )
        .pause();
      ScrollTrigger.create({
        trigger: ".map_box",
        start: "top bottom",
        end: "bottom top",
        scrub: 1.3,
        animation: mapTl,
        scroller: page_container,
      });
    }

    //discover sec Animation
    if ($(".discover_bg").length) {
      let bnel = $(".discover_bg");
      let video = bnel.find("video").get(0);
      let dscTl = gsap.timeline({
        defaults: {
          ease: "none",
        },
        repeatRefresh: true,
        smoothChildTiming: true,
      });
      dscTl
        .to(bnel, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.1,
        })
        .to(bnel, {
          clipPath: () =>
            isDekstop ? "inset(15% 0% 25% 0%)" : "inset(15% 0% 15% 0%)",
          duration: 1,
        })
        .pause();
      ScrollTrigger.create({
        trigger: bnel,
        start: "top center",
        end: "+=200%",
        // markers: true,
        scroller: page_container,
        onEnter: () => {
          video.play();
        },
        onEnterBack: () => {
          video.play();
        },
        onLeave: () => {
          video.pause();
        },
        onLeaveBack: () => {
          video.pause();
        },
      });
      ScrollTrigger.create({
        trigger: bnel,
        pin: true,
        start: "top top",
        end: "+=80%",
        scrub: 1.3,
        animation: dscTl,
        scroller: page_container,
        // markers: true,
      });
    }

    //boat figure
    if ($(".boat_fig").length) {
      gsap.set(".boat_fig .clip", {
        clipPath: "inset(0% 0% 0% 0%)",
      });
      let boat_tl = gsap.timeline({
        repeatRefresh: true,
        smoothChildTiming: true,
      });

      boat_tl.to(".boat_fig .clip", {
        clipPath: "inset(0% 0% 0% 20%)",
      });

      ScrollTrigger.create({
        trigger: ".boat_fig",
        start: "top 60%",
        end: "+=25%",
        scrub: 1.3,
        animation: boat_tl,
        scroller: page_container,
        // markers: true,
      });
    }

    //dsc_figure
    if ($(".dsc_fig").length) {
      gsap.set(".dsc_fig img", {
        clipPath: "inset(0% 0% 0% 0%)",
      });
      let fx_tl = gsap.timeline({
        repeatRefresh: true,
        smoothChildTiming: true,
      });

      fx_tl.to(".dsc_fig img", {
        clipPath: () =>
          isDekstop ? "inset(0% 30% 0% 0%)" : "inset(15% 0% 15% 0%)",
        yPercent: isDekstop ? 0 : -35,
      });

      ScrollTrigger.create({
        trigger: ".dsc_fig",
        start: "top bottom",
        end: "+=50%",
        scrub: 1.3,
        animation: fx_tl,
        scroller: page_container,
        // markers: true,
      });
    }

    //box figure
    if ($(".fx_box").length) {
      gsap.set(".fx_box img", {
        clipPath: "inset(0% 0% 0% 0%)",
      });
      let fx_tl = gsap.timeline({
        repeatRefresh: true,
        smoothChildTiming: true,
      });

      fx_tl.to(".fx_box img", {
        clipPath: () =>
          isDekstop ? "inset(0% 10% 0% 0%)" : "inset(10% 0% 25% 0%)",
        yPercent: isDekstop ? 0 : -10,
      });

      ScrollTrigger.create({
        trigger: ".fx_box",
        start: "top 40%",
        end: "+=25%",
        scrub: 1.3,
        animation: fx_tl,
        scroller: page_container,
        // markers: true,
      });
    }

    //parallax
    if ($("[data-parallax]").length) {
      const parallax_box = document.querySelectorAll("[data-parallax]");
      parallax_box.forEach(function (prel) {
        if (prel.dataset.parallax == "all" || isDekstop) {
          const parallax_el = prel.querySelectorAll("[data-speed]");
          parallax_el.forEach(function (el) {
            let smoothVal =
              Number(el.dataset.speed === 0 ? 1 : el.dataset.speed) * 100;
            let topPos = el.getBoundingClientRect().top;
            // console.log(topPos);
            gsap.to(el, {
              yPercent: () => -smoothVal,
              ease: "none",
              scrollTrigger: {
                start: () =>
                  topPos > window.innerHeight ? "top bottom" : "top top",
                trigger: prel,
                scrub: 1.3,
                scroller: page_container,
                // markers: true,
              },
            });
          });
        }
      });
    }

    //section selection
    if ($("[data-index]").length) {
      document.querySelectorAll("[data-index]").forEach((t, i) => {
        function activeSec(control, i) {
          let sidenav = $("#side_nav");
          if (control == "in") {
            $("[data-index]").removeClass("active");
            $("[data-index='" + i + "']").addClass("active");
            sidenav.find("li").removeClass("active");
            sidenav.find("li").eq(i).addClass("active");
            $(".navbar-nav>li").removeClass("current-menu-item");
            $(".navbar-nav>li").eq(i).addClass("current-menu-item");
          } else {
            $("[data-index]").removeClass("active");
            sidenav.find("li").removeClass("active");
            $(".navbar-nav>li").removeClass("current-menu-item");
          }
          if (sidenav.find("li.active").length == 0) {
            sidenav.removeClass("show");
          } else {
            sidenav.addClass("show");
          }
        }

        ScrollTrigger.create({
          trigger: t,
          start: "top 70%",
          end: "bottom 70%",
          scroller: page_container,
          onEnter: () => activeSec("in", i),
          onEnterBack: () => activeSec("in", i),
          onLeave: () => activeSec(i),
          onLeaveBack: () => activeSec(i),
          // markers: true,
        });
      });
    }

    //caption text anim
    document.querySelectorAll("[data-effect='bigcap']").forEach((e) => {
      Splitting({ target: e, by: "chars" });
      const t = e.querySelectorAll(".char");
      gsap.fromTo(
        t,
        {
          "will-change": "opacity, transform",
          opacity: 0,
          yPercent: 100,
          scaleY: 2,
          scaleX: 0.5,
          transformOrigin: "50% 0%",
        },
        {
          duration: 1.3,
          ease: "back.inOut(2)",
          opacity: 1,
          yPercent: 0,
          scaleY: 1,
          scaleX: 1,
          stagger: 0.035,
          scrollTrigger: {
            trigger: e,
            start: "center bottom+=50%",
            end: "bottom top+=50%",
            // scrub: 1.3,
            toggleActions: "play none play none",
            scroller: page_container,
            // markers:true,
          },
        }
      );
    });

    //title text anim
    document.querySelectorAll("[data-effect='title']").forEach((t) => {
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

      //set animation on section enter
      ScrollTrigger.create({
        trigger: t,
        start: "top bottom",
        scroller: page_container,
        onEnter: animload,
        onEnterBack: animload,
        once: true,
        // markers:true,
      });

      ScrollTrigger.create({
        trigger: t,
        start: "top 80%",
        end: "bottom bottom",
        animation: titleTl,
        toggleActions: "play none play none",
        // scrub: 1.3,
        scroller: page_container,
        // markers:true,
      });
    });

    //paragraph text anim
    document.querySelectorAll("[data-effect='paragraph']").forEach((t) => {
      let paraTl = gsap.timeline();
      function animload() {
        Splitting({ target: t, by: "chars" });
        paraTl
          .fromTo(
            t.querySelectorAll(".word"),
            {
              "will-change": "opacity",
              opacity: 0.1,
            },
            {
              ease: "none",
              opacity: 1,
              stagger: 0.05,
            }
          )
          .pause();
      }
      //set animation on section enter
      ScrollTrigger.create({
        trigger: t,
        start: "top bottom",
        scroller: page_container,
        onEnter: animload,
        onEnterBack: animload,
        once: true,
        // markers:true,
      });

      ScrollTrigger.create({
        trigger: t,
        start: "top bottom+=10%",
        end: "bottom 90%",
        scrub: 1.3,
        animation: paraTl,
        scroller: page_container,
        // markers: true,
      });
    });

    //label text anim
    document.querySelectorAll("[data-effect='label']").forEach((t) => {
      let labelTl = gsap.timeline();
      function animload() {
        labelTl
          .fromTo(
            t,
            {
              yPercent: 110,
              opacity: 0,
            },
            {
              ease: "Back.out",
              yPercent: 0,
              opacity: 1,
              duration: 1,
            }
          )
          .pause();
      }

      //set animation on section enter
      ScrollTrigger.create({
        trigger: t,
        start: "top bottom",
        scroller: page_container,
        onEnter: animload,
        onEnterBack: animload,
        once: true,
        // markers:true,
      });

      ScrollTrigger.create({
        trigger: t,
        start: "top 80%",
        end: "bottom bottom",
        scrub: 1.3,
        toggleActions: "play none play none",
        scroller: page_container,
        // markers:true,
        animation: labelTl,
      });
    });

    //path draw
    document.querySelectorAll("[data-effect='pathdraw']").forEach((t) => {
      gsap.set(t, { opacity: 1 });
      let ln0 = t.querySelector(".dot1"),
        ln1 = t.querySelector(".dot2"),
        ln2 = t.querySelector(".draw");
      gsap.set([ln0, ln1], { opacity: 0 });

      let length1 = ln2.getTotalLength();
      gsap.set(ln2, {
        strokeDashoffset: length1,
        strokeDasharray: length1,
      });
      let pathTl = gsap.timeline();
      pathTl
        .to(ln0, { opacity: 1, ease: "Power3.easeOut" })
        .to(ln1, { opacity: 1, ease: "Power3.easeIn" })
        .pause();
      let pathTl2 = gsap.timeline();
      pathTl2.to(ln2, { strokeDashoffset: 0 }).pause();

      ScrollTrigger.create({
        trigger: t,
        start: "top 70%",
        end: "bottom center",
        animation: pathTl,
        toggleActions: "play none play none",
        scrub: 1.3,
        scroller: page_container,
        // markers: true,
      });
      ScrollTrigger.create({
        trigger: t,
        start: "top 40%",
        end: "bottom 50%",
        animation: pathTl2,
        toggleActions: "play none play none",
        scrub: 1.3,
        scroller: page_container,
        // markers: true,
      });
    });

    const allImages = $("img").length + $(".bg").length;
    $("body")
      .imagesLoaded({
        background: true,
      })
      .progress(function (instance, image) {
        if (image.isLoaded) {
          $(image.img).addClass("loaded");
          let countLoadedImages = $("img.loaded").length;
          let width = (100 * (countLoadedImages / allImages)).toFixed() + "%";
          gsap.set(".loader_line>span", { width: width });
          $(".load_percent").html(width);
        }
      })
      .always(function () {
        window.history.scrollRestoration = "manual";
        ScrollTrigger.clearScrollMemory();
        window.scrollTo(0, 0);
        if (isDekstop) {
          loco_scroll.scrollTo(page_container, 0);
        }
        ScrollTrigger.refresh(true);

        //hide loader
        $(".load_percent").html("100%");
        gsap
          .timeline()
          .set(".loader_line>span", { width: "100%" })
          .to(".loader_line", {
            duration: 0.5,
            opacity: 0,
          })
          .to(
            ".loadersvg",
            {
              opacity: 0,
              yPercent: -150,
              duration: 0.5,
              ease: "Power3.easeIn",
            },
            "<"
          )
          .to(
            ".load_percent",
            {
              opacity: 0,
              yPercent: 120,
              duration: 0.5,
              ease: "Power3.easeOut",
            },
            "<"
          )
          .to(".loader", {
            opacity: 0,
            ease: "none",
            onComplete: () => {
              $(".loader").hide();
              //load page script
              afterPageLoad();
            },
          });
        //end script
      });

    //after loader hide
    function afterPageLoad() {
      enableScroll();
      refresh();
      if (isDekstop) {
        loco_scroll.start();
        loco_scroll.scrollTo(0, 0, 0);
      }

      // menubar
      $(".main-head").addClass("show");

      //play video in banner
      if ($("video [data-src]").length) {
        document.querySelectorAll("video source").forEach((ev) => {
          ev.src = ev.dataset.src;
        });
      }
    }
  });
}
