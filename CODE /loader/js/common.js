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
  document.removeEventListener("wheel", pvs, { passive: false });
  document.removeEventListener("touchstart", pvs, { passive: false });
  document.removeEventListener("touchend", pvs, { passive: false });
  document.removeEventListener("touchmove", pvs, { passive: false });
}

//after DOM load
document.addEventListener("DOMContentLoaded", pageScript, false);
function pageScript() {
  gsap.registerPlugin(ScrollTrigger);

  //detect device width
  if (window.innerWidth <= responsive_size) {
    isDekstop = false;
  }

  //loader
  let pr = 95;
  gsap.set(".ld_lines", { opacity: 1 });
  document.querySelectorAll(".ld_lines path").forEach(function (cur_el, index) {
    let length = cur_el.getTotalLength();
    cur_el.style.strokeDasharray = length + 1;
    cur_el.style.strokeDashoffset = length + 1;
    gsap.to(cur_el, {
      strokeDashoffset: 0,
      strokeDasharray: length + 1,
      duration: () => gsap.utils.random(0.4, 1.3),
      delay: () => gsap.utils.random(0.25, 3.5),
      repeat: -1,
      yoyo: true,
      ease: "linear",
      repeatDelay: gsap.utils.random(1.5, 3.8),
      repeatRefresh: true,
    });
  });
  const pr_line = document.querySelector(".ld_line");
  const pr_line_ln = pr_line.getTotalLength() + 1;
  pr_line.style.strokeDasharray = pr_line_ln;
  pr_line.style.strokeDashoffset = pr_line_ln;
  gsap.set(pr_line, { opacity: 1 });
  gsap.set(".ld_txt", {
    opacity: 1,
  });
  gsap.set(".ld_txt>path.text1", {
    x: 100,
    opacity: 0,
    transformOrigin: "50% 50%",
  });
  gsap.set(".ld_txt>path.text2", {
    y: 100,
    opacity: 0,
    transformOrigin: "50% 50%",
  });

  window.history.scrollRestoration = "manual";
  ScrollTrigger.clearScrollMemory();
  window.scrollTo(0, 0);

  // gsap.to(".ld_lines path", {
  //   strokeDashoffset: 0,
  //   strokeDasharray: () => {
  //     console.log(this);
  //     return 100;
  //   },
  //   repeat: -1,
  //   stagger: {
  //     amount: 0.1,
  //     from: "random",
  //     // repeat:1,
  //     ease: "linear",
  //     yoyo: true,
  //   },
  //   duration: () => gsap.utils.random(0.3, 0.5),
  //   delay: () => gsap.utils.random(0, 2),
  //   // repeatRefresh: true,
  //   repeatDelay: 0,
  // });

  // var loaderTl = gsap.timeline({
  //   repeat: -1,
  //   repeatDelay: 0,
  // });
}

//page scripts
function afterPageLoad() {
  jQuery.noConflict()(function ($) {
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
    gsap.set(".navbar", {
      opacity: 0,
    });
    gsap.set(".navbar-nav>li", {
      opacity: 0,
      yPercent: 50,
    });
    var nav_timeline = gsap.timeline({ pause: true });
    nav_timeline
      .to(".navbar", { opacity: 1, duration: 0.3 }, "-=0.5")
      .to(".navbar-nav>li", {
        opacity: 1,
        yPercent: 0,
        stagger: 0.04,
        duration: 0.3,
      })
      .pause();

    if (!isDekstop) {
      var nav_mobile = gsap.timeline({ pause: true });
      nav_mobile
        .set(".navbar-nav>li", {
          opacity: 0,
          yPercent: 100,
        })
        .to(".navbar-nav>li", {
          opacity: 1,
          yPercent: 0,
          stagger: 0.1,
          duration: 0.5,
          ease: "Back.easeInOut",
        })
        .pause();

      $(".navbar-toggler").on("click", function () {
        if ($(this).hasClass("active")) {
          $(this).removeClass("active");
          $(page_container).removeClass("open-nav");
          nav_mobile.pause().reverse();
        } else {
          $(this).addClass("active");
          $(page_container).addClass("open-nav");
          nav_mobile.pause().restart();
        }
      });

      // for sub Navbar
      $("html").click(function () {
        $(".navbar-nav li .clickD").removeClass("toggled");
        $(".toggled").removeClass("toggled");
        $(".sub-menu").removeClass("show");
      });
      $(document).click(function () {
        $(".navbar-nav li .clickD").removeClass("toggled");
        $(".toggled").removeClass("toggled");
        $(".sub-menu").removeClass("show");
      });
      $(".navbar-nav").click(function (e) {
        e.stopPropagation();
      });
    }

    // to make sticky nav bar
    $(window).scroll(function () {
      var scroll = $(window).scrollTop();
      if (scroll > 200) {
        $(".main-head").addClass("fixed");
      } else {
        $(".main-head").removeClass("fixed");
      }
    });

    gsap.set(".banner_content", {
      opacity: 1,
    });
    gsap.set(".banner_content .cap>span", {
      yPercent: 200,
      opacity: 0,
    });

    //for loader
    // gsap.set(pr_line, {
    //   strokeDashoffset: (pr_line_ln * (pr-100)) / 100,
    // });
    gsap.to(pr_line, {
      strokeDashoffset: 0,
      duration: 2,
      onComplete: hideSplash,
    });
    function hideSplash() {
      let vdo = $(".splash_sec .vidoe_box");
      $(".splash_sec video").get(0).pause();
      gsap.set(vdo, {
        scale: 1.4,
      });
      gsap.to(".ld_fill", {
        opacity: 1,
      });
      gsap.to(".loader_bg", {
        opacity: 0.5,
        duration: 0.8,
        ease: "linear",
      });
      gsap.to(".ld", {
        delay: 0.5,
        opacity: 0,
        duration: 1,
        ease: "easeOut",
      });
      gsap.to(".ld_ico", {
        delay: 0.3,
        scale: 0.5,
        transformOrigin: "50% 50%",
      });
      gsap.to(".ld_ico", {
        delay: 0.8,
        x: -150,
        transformOrigin: "50% 50%",
      });

      gsap.to(".ld_txt>path", {
        duration: 0.3,
        delay: 1,
        opacity: 1,
        x: 0,
        y: 0,
        transformOrigin: "50% 50%",
        stagger: 0.5,
        onComplete: () => {
          gsap.to("#loader", {
            opacity: 0,
            pointerEvents: "none",
            duration: 0.5,
          });
          gsap.to(vdo, {
            duration: 0.4,
            scale: 1,
          });
          enableScroll();

          nav_timeline.pause().restart();
          $(".main-head").addClass("show active");

          setTimeout(() => {
            ScrollTrigger.refresh(true);
            window.scrollTo(0, 0);
            console.log($(".splash_sec video").get(0));
            $(".splash_sec video").get(0).play();
          }, 2000);

          gsap.to(".banner_content .cap>span", {
            delay: 0.2,
            yPercent: 0,
            opacity: 1,
            duration: 1,
            ease: "Power2.easeOut",
            stagger: 0.15,
          });

          gsap.to(".banner_content .ck1", {
            delay: 0.2,
            duration: 0.5,
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          });
          gsap.to(".banner_content .ck2", {
            delay: 0.2,
            duration: 0.8,
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          });
        },
      });
    }

    //play video in banner
    if ($("video [data-vdo]").length) {
      document.querySelectorAll("video source").forEach((ev) => {
        ev.src = ev.dataset.vdo;
      });
    }

    Reveal.initialize({
      margin: 0,
      disableLayout: true,
      progress: false,
      history: false,
      center: false,
      overview: false,
      transition: "slide",
      mouseWheel: false,
      slideNumber: false,
      touch: false,
      fragmentInURL: false,
      autoPlayMedia: true,
      hideInactiveCursor: false,
      postMessage: false,
      keyboard: true,
      controls: false,
      controlsLayout: "bottom-right",
      jumpToSlide: false,
      help: false,
      fragments: false,
    });
    Reveal.on("ready", (event) => {
      // console.log("READY>>",event.currentSlide, event.indexh, event.indexv)
    });
    //after Reveal init
    Reveal.initialize().then((event) => {
      console.log(event);

      window.scrollTo(0, 0);
      ScrollTrigger.refresh(true);
      gsap.ticker.lagSmoothing(0);

      // afterPageLoad();
    });
    //action on slide change
    Reveal.addEventListener("slidechanged", function (event) {
      //event.previousSlide, event.currentSlide, event.indexh, event.indexv
    });
    Reveal.on("resize", (event) => {
      // event.scale, event.oldScale, event.size
    });
  });
}

// jQuery(document).ready(function ($) {
// });
