"use strict";
const responsive_size = 1024;
var isDekstop = true;
var Interval = {
    hours: 1,
    mins: 30,
    seconds: 0,
  },
  time = new Date().getTime();
var timex, setTime;
function startTimer() {
  timex = setTimeout(function () {
    Interval.seconds++;
    if (Interval.seconds > 59) {
      Interval.seconds = 0;
      Interval.mins++;
      if (Interval.mins > 59) {
        Interval.mins = 0;
        Interval.hours++;
      }
    }
    if (document.getElementById("loader") != null) {
      startTimer();
    }
  }, 1000);
}

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

var loader = document.getElementById("loader");

if (loader != undefined && loader != null) {
  var codebg = loader.querySelectorAll(".ld_code_bg");
  if (codebg != undefined && codebg != null) {
    gsap.set(codebg, { opacity: 1 });
    gsap.fromTo(
      codebg,
      {
        yPercent: 0,
        ease: "none",
      },
      {
        repeat: -1,
        repeatRefresh: true,
        duration: 5,
        ease: "none",
        yPercent: -window.innerHeight,
      }
    );
  }

  //clock
  var clk = loader.querySelector(".changeTime1");
  if (clk != undefined && clk != null) {
    startTimer();
    var appendTens = clk.querySelector(".seconds"),
      appendSeconds = clk.querySelector(".tens");
    setTime = setInterval(function () {
      appendSeconds.innerHTML = Interval.hours;
      appendTens.innerHTML = Interval.mins;
    }, 1000);
  }

  glitchtext(document.querySelectorAll("[data-glitchtext]"));
}

const page_container = document.querySelector("[data-scroll-container]");
var loco_scroll;

//initial loading scripts
function onAlways() {
  gsap.registerPlugin(ScrollTrigger, TextPlugin);

  //for desktop
  if (isDekstop) {
    loco_scroll = new LocomotiveScroll({
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
    loco_scroll.stop();
  }
  //for mobile
  else {
    detectDevice();
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
  // loader.querySelector(".progress_val").innerHTML = "Please Wait...";
  gsap.to(loader, {
    delay:
      (new Date().getTime() - time) / 1000 > 2
        ? 0
        : 2 - (new Date().getTime() - time) / 1000,
    opacity: 0,
    duration: 0.5,
    onEnd: afterPageLoad,
    onComplete: () => {
      clearInterval(setTime);

      $(loader).remove();

      enableScroll();
      refresh();
      setTimeout(() => {
        glitchtext(document.querySelectorAll("[data-glitchtext]"));
      }, 600);
    },
  });

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
  if (isDekstop) {
    loco_scroll.on("scroll", (e) => {
      if (e.direction == "down") {
        if (e.delta.y > window.innerHeight / 4) {
          $(".main-head").removeClass("active");
        }
      } else {
        if (!$("body").hasClass("home") || e.delta.y < window.innerHeight / 4) {
          $(".main-head").addClass("active");
        }
      }
    });
  } else {
    $(window).scroll(function () {
      var scroll = $(window).scrollTop();
      if (oldScrollVal >= scroll && !$("body").hasClass("home")) {
        $(".main-head").addClass("active");
      } else {
        if (scroll > window.innerHeight / 2) {
          $(".main-head").removeClass("active");
        }
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
          let smoothVal =
            Number(el.dataset.speed === 0 ? 1 : el.dataset.speed) * 100;
          let topPos = el.getBoundingClientRect().top;
          // console.log(topPos);
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
        delay: topPos > window.innerHeight ? 0 : 2,
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

  //play video
  if ($(".video_box").length) {
    let video = $(".video_box video");
    video.attr("src", video.attr("data-link"));

    $(".video_box .video_action_overlay").on("click", function () {
      let parent = $(this).parents(".video_box");
      if (!parent.hasClass("opened")) {
        $(this).addClass("hide");
        parent.find("video").get(0).play();
        parent.addClass("opened");
      } else {
        $(this).removeClass("hide");
        parent.find("video").get(0).pause();
        parent.removeClass("opened");
      }
    });
  }

  if ($(".banner").length) {
    function addGap() {
      document.querySelector(".banner").style.paddingTop =
        document.querySelector(".main-head").clientHeight + "px";
    }
    addGap();
    window.addEventListener("resize", addGap);
    window.addEventListener("scroll", addGap);

    $(".banner").addClass("loaded");
    ScrollTrigger.create({
      scroller: isDekstop ? page_container : window,
      pin: true,
      start: "top top",
      end: "+=15%",
      trigger: ".banner",
      scrub: 1,
      onToggle: (scrollTrigger) => {
        scrollTrigger.refresh();
      },
      // markers: true,
    });

    gsap.to(".banner .banner_title", {
      scaleX: 1.5,
      scrollTrigger: {
        scroller: isDekstop ? page_container : window,
        start: "top top",
        end: "+=100%",
        trigger: ".banner",
        scrub: 1,
        // markers: true,
      },
    });

    gsap.to(".banner", {
      opacity: 0,
      scrollTrigger: {
        scroller: isDekstop ? page_container : window,
        start: "top top",
        end: "+=150%",
        trigger: ".banner",
        scrub: 1.5,
        // markers: true,
      },
    });
  }

  if ($(".home_about_sec").length) {
    let sec = document.querySelector(".home_about_sec");
    let clk2 = sec.querySelector(".changeTime2");
    if (clk2 != undefined && clk2 != null) {
      let appendTens = clk2.querySelector(".seconds"),
        appendSeconds = clk2.querySelector(".tens");
      setTime = setInterval(function () {
        appendSeconds.innerHTML = Interval.hours;
        appendTens.innerHTML = Interval.mins;
      }, 1000);
    }
    let ld_rt = document.querySelectorAll(".after_menu .chng_txt");
    if (ld_rt != undefined && ld_rt != null) {
      ld_rt.forEach((e) => {
        let sfltl = gsap.timeline({ repeat: -1 });
        e.querySelectorAll("span").forEach((m, i) => {
          let headText = new WordShuffler(m, {
            textColor: "#e98645",
            timeOffset: 1,
            fps: 5,
          });
          gsap.set(m, { opacity: 1 });
          sfltl.to(m, {
            duration: 5,
            onStart: function () {
              headText.restart();
            },
          });
        });
        sfltl.pause();
        sfltl.play();
      });
    }
    function menu_Out() {
      $(sec).removeClass("activeSec");
      gsap.set([".top_box", ".nav_txt", ".top_lft"], {
        opacity: 0,
        overwrite: true,
      });
      $(".nav_txt").removeClass("active");
      $(".chng_txt2").removeClass("active");
      $(clk2).removeClass("active");
    }
    menu_Out();
    function menu_In() {
      $(sec).addClass("activeSec");
      if (!$(".nav_txt").hasClass("splitting")) {
        Splitting({ target: ".nav_txt", by: "chars" });
      }
      if (!$(".chng_txt2").hasClass("splitting")) {
        Splitting({ target: ".chng_txt2", by: "chars" });
      }
      gsap.to([".top_box", ".nav_txt", ".top_lft"], {
        opacity: 1,
        onComplete: () => {
          $(".nav_txt").addClass("active");
          $(".chng_txt2").addClass("active");
          $(clk2).addClass("active");
        },
      });
    }

    let para = sec.querySelector(".content_para>p");
    var paraTl = gsap.timeline();
    gsap.set(para, { opacity: 0 });
    paraTl
      .set(para, {
        opacity: 1,
      })
      .from(para, {
        duration: 4,
        text: "",
        onComplete: () => {
          $(sec).find(".page_btn").addClass("show");
        },
      })
      .pause();

    ScrollTrigger.create({
      scroller: isDekstop ? page_container : window,
      start: "top -=3%",
      end: "+=15%",
      trigger: sec,
      scrub: 1,
      onEnter: menu_In,
      onLeaveBack: menu_Out,
      onUpdate: (self) => {
        if (self.progress > 0) {
          $(".after_menu").addClass("pinnedsec");
        } else {
          $(".after_menu").removeClass("pinnedsec");
        }
      },
      // markers: true,
    });

    ScrollTrigger.create({
      scroller: isDekstop ? page_container : window,
      start: "top center",
      end: "+=100%",
      trigger: sec,
      scrub: 1,
      onEnter: () => {
        paraTl.isActive() ? paraTl.play() : paraTl.timeScale(1).restart();
      },
      onUpdate: (self) => {
        if (self.progress <= 0 && self.direction < 0) {
          $(sec).find(".page_btn").removeClass("show");
          paraTl.isActive() ? paraTl.pause() : paraTl.timeScale(5).reverse();
        }
      },
      // markers: true,
    });

    ScrollTrigger.create({
      scroller: isDekstop ? page_container : window,
      start: "top top",
      end: "+=25%",
      pin: true,
      trigger: sec,
      // markers: true,
    });
  }

  if ($(".after_abt_video_Sec").length) {
    let sec2 = $(".after_abt_video_Sec");
    let box1 = sec2.find(".video_box_outer");
    gsap.set(box1, {
      yPercent: 50,
      opacity: 1,
      scale: 0.5,
      transformOrigin: "bottom center",
    });
    let sec2Tl = gsap.timeline();
    sec2Tl
      .to(box1, {
        yPercent: 0,
        opacity: 1,
        scale: 1,
      })
      .to(box1, {
        yPercent: -50,
        scale: 0.8,
      })
      .to(
        sec2,
        {
          opacity: 0,
        },
        "<"
      );

    ScrollTrigger.create({
      scroller: isDekstop ? page_container : window,
      start: "top bottom",
      end: "bottom top",
      trigger: sec2,
      scrub: 1.5,
      animation: sec2Tl,
      // markers: true,
    });
  }

  if ($(".our_process_sec").length) {
    let sec3 = $(".our_process_sec");
    let allSecInner = sec3.find(".inner_sec");
    let headline1 = sec3.find(".our_process_headline>h2"),
      moon1 = sec3.find(".moonBox1"),
      moon2 = sec3.find(".moonBox2 img"),
      shadow1 = sec3.find(".moonShadow"),
      slider = sec3.find(".process_slider"),
      videobg = sec3.find(".spacedots");

    $(slider).slick({
      dots: false,
      arrows: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    });

    gsap.set(headline1, {
      yPercent: 75,
      opacity: 0,
      scale: 0.3,
      transformOrigin: "bottom center",
    });
    gsap.set(sec3, {
      opacity: 0,
    });
    gsap.set(shadow1, {
      opacity: 0,
      yPercent: 25,
    });
    gsap.set(moon1, {
      yPercent: 70,
      scale: 0.45,
      transformOrigin: "bottom center",
    });
    gsap.set(slider.parent(), {
      yPercent: 50,
      opacity: 0,
      scale: 0.5,
    });
    let sec3Tl = gsap.timeline();
    sec3Tl
      .to(sec3, {
        opacity: 1,
        duration: 1.3,
      })
      .to(
        headline1,
        {
          yPercent: 0,
          opacity: 1,
          scale: 1,
        },
        "-=1"
      )
      .to(
        moon1,
        {
          yPercent: 0,
          scale: 1,
          duration: 1.5,
        },
        "<"
      )
      .to(
        shadow1,
        {
          opacity: 0.5,
          duration: 1,
        },
        "<"
      )
      .to(
        slider.parent(),
        {
          yPercent: 0,
          opacity: 1,
          scale: 1,
          duration: 1.5,
        },
        "-=0.5"
      )
      .to(
        shadow1,
        {
          yPercent: 0,
          opacity: 0.2,
          duration: 0.5,
        },
        "<"
      )

      .to(slider.parent(), {
        delay: 0.5,
        yPercent: 100,
        opacity: 0,
        duration: 1,
      })
      .to(
        headline1,
        {
          duration: 1,
          scaleX: 1.3,
          opacity: 0,
        },
        "<"
      )
      .to(
        sec3.find(".bg"),
        {
          opacity: 0,
          duration: 0.5,
        },
        "-=0.5"
      )
      .to(moon1, {
        yPercent: -50,
        scale: 2,
        rotation: 90,
        duration: 2,
        transformOrigin: "center center",
      })
      .to(
        moon2,
        {
          rotation: 180,
          yPercent: 55,
          x: window.innerWidth,
          scale: 3,
          duration: 1.5,
        },
        "<"
      )
      .to(
        shadow1,
        {
          opacity: 0,
          duration: 0.5,
        },
        "<"
      )
      .to(moon1, {
        opacity: 0,
        duration: 1,
      })
      .to(
        videobg,
        {
          opacity: 1,
          duration: 1,
        },
        "<"
      );

    allSecInner.each(function (i) {
      let innerSec = $(this);
      if (i > 0) {
        let topHead = innerSec.find(".top_info_box");
        let headline = topHead.find(".titleAnim"),
          btn = topHead.find(".page_btn"),
          prd_fig = innerSec.find(".lft_fig img"),
          moon_fig = innerSec.find(".rt_fig img");
        gsap.set(innerSec, { display: "none", opacity: 0 });
        gsap.set(topHead, { opacity: 0 });
        gsap.set(prd_fig, {
          opacity: 0,
          xPercent: i % 2 ? -50 : 50,
        });
        gsap.set(moon_fig, {
          scale: 0,
          xPercent: i % 2 ? -150 : 150,
          yPercent: 50,
        });

        if (!headline.hasClass("splitting")) {
          Splitting({ target: headline, by: "chars" });
        }

        sec3Tl
          .set(allSecInner[i - 1], { display: "none" })
          .set(innerSec, { display: "block" })
          .to(innerSec, { duration: 0.5, opacity: 1 })
          .to(
            moon_fig,
            {
              duration: 1,
              xPercent: 0,
              yPercent: 0,
              scale: 1,
              onStart: () => {
                gsap.set(topHead, { opacity: 0 });
                innerSec.removeClass("active");
                headline.removeClass("active");
                btn.removeClass("show");
              },
            },
            "<"
          )
          .to(
            prd_fig,
            {
              duration: 0.5,
              opacity: 1,
              xPercent: 0,
              onStart: () => {
                gsap.to(topHead, { opacity: 1 });
                innerSec.addClass("active");
                headline.addClass("active");
                btn.addClass("show");
              },
            },
            "-=0.5"
          );
        if (i < allSecInner.length - 1) {
          sec3Tl
            .to(moon_fig, {
              delay: 0.5,
              duration: 0.5,
              scale: 0,
              xPercent: i % 2 ? 150 : -150,
              yPercent: 50,
            })
            .to(
              prd_fig,
              {
                duration: 0.5,
                opacity: 0,
                xPercent: i % 2 ? -50 : 50,
              },
              "<"
            )
            .to(
              innerSec,
              {
                duration: 0.5,
                opacity: 0,
                display: "none",
              },
              "<"
            );
        }
      }
    });
    sec3Tl.pause();
    ScrollTrigger.create({
      scroller: isDekstop ? page_container : window,
      start: "top top",
      end: "+=400%",
      pin: true,
      trigger: sec3,
      scrub: 1,
      onToggle: (scrollTrigger) => {
        scrollTrigger.refresh();
      },
    });
    ScrollTrigger.create({
      scroller: isDekstop ? page_container : window,
      start: "top +=60%",
      end: "+=400%",
      trigger: sec3,
      scrub: 1,
      animation: sec3Tl,
      // snap: {
      //   snapTo: [0,0.27,0.72, 0.85, 1],
      //   radius: 0.15,
      //   delay: 0,
      //   duration: {min: 0, max: 2},
      //   ease: "none",
      // },
      // markers: true,
    });
  }

  if ($(".footer").length) {
    const prel = document.querySelector(".footer");
    const parallax_el = prel.querySelectorAll("[data-speed]");
    parallax_el.forEach(function (el) {
      let smoothVal =
        Number(el.dataset.speed === 0 ? 1 : el.dataset.speed) * 100;
      let topPos = el.getBoundingClientRect().top;
      // console.log(topPos);
      gsap.to(el, {
        scale: () =>
          el.dataset.zoom != undefined ? 1 + el.dataset.speed / 2 : 1,
        yPercent: () =>
          el.dataset.zoom === undefined && el.dataset.move === undefined
            ? -smoothVal
            : 0,
        ease: "none",
        transformOrigin: "bottom top",
        scrollTrigger: {
          scroller: isDekstop ? page_container : window,
          start: () => (topPos > window.innerHeight ? "top bottom" : "top top"),
          trigger: prel,
          scrub: 1,
          // markers: true,
        },
      });
    });

    if ($(".after_menu").length) {
      ScrollTrigger.create({
        scroller: isDekstop ? page_container : window,
        trigger: prel,
        start: "top 75%",
        onToggle: (scrollTrigger, m) => {
          if (scrollTrigger.progress > 0) {
            $(".after_menu").removeClass("pinnedsec");
          } else {
            $(".after_menu").addClass("pinnedsec");
          }
          scrollTrigger.refresh();
        },
        // markers: true,
      });
    }
  }

  if ($(".inner_banner").length) {
    setTimeout(() => {
      $(".inner_banner").addClass("loaded");
    }, 700);
    ScrollTrigger.create({
      scroller: isDekstop ? page_container : window,
      pin: true,
      start: "top top",
      end: "+=15%",
      trigger: ".inner_banner",
      scrub: 1,
      onToggle: (scrollTrigger) => {
        scrollTrigger.refresh();
      },
      // markers: true,
    });
  }

  if ($(".learn_about").length) {
    ScrollTrigger.create({
      scroller: isDekstop ? page_container : window,
      trigger: ".learn_about",
      pin: ".pinEl",
      start: "top top",
      scrub: 1,
      onToggle: (scrollTrigger) => {
        scrollTrigger.refresh();
      },
      // markers: true,
    });
  }

  //draw lines on viewport
  if ($(".pathsvg").length) {
    document.querySelectorAll(".pathsvg").forEach(function (t) {
      let ln0 = t.querySelector(".dot2"),
        ln1 = t.querySelector(".dot1"),
        ln2 = t.querySelector(".movepath");
      let length1 = ln2.getTotalLength();
      gsap.set([ln0, ln1], { opacity: 0 });
      gsap.set(t, { opacity: 1 });
      gsap.set(ln2, {
        strokeDashoffset: length1,
        strokeDasharray: length1,
      });
      let drawTl = gsap.timeline();
      drawTl
        .to(ln0, { opacity: 1, ease: "Power3.easeOut" })
        .to(ln2, { strokeDashoffset: 0 })
        .to(ln1, { opacity: 1, ease: "Power3.easeOut" })
        .pause();

      ScrollTrigger.create({
        trigger: t,
        start: "top bottom",
        end: "bottom 75%",
        animation: drawTl,
        toggleActions: "play none play none",
        scrub: 1.1,
        scroller: isDekstop ? page_container : window,
        // markers: true,
      });
    });
  }

  //product page slider
  if ($(".pr_slider").length) {
    $(".pr_slider").slick({
      dots: false,
      arrows: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
    });
  }

  // for all accordion
  if ($(".accordion").length) {
    $(".accordion").each((i, el) => {
      $(el).on("shown.bs.collapse", function () {
        if (isDekstop) {
          loco_scroll.update();
        }
        ScrollTrigger.refresh();
      });
    });
  }

  //for all nav-tab
  if ($("[data-bs-toggle='tab']").length) {
    $('[data-bs-toggle="tab"]').each((i, el) => {
      el.addEventListener("shown.bs.tab", function (event) {
        const slider = $(event.target.dataset.bsTarget).find(".slick-slider");
        if (slider.length) {
          slider.slick("setPosition");
        }
        if (isDekstop) {
          loco_scroll.update();
        }
        ScrollTrigger.refresh();
      });
    });
  }

  //for all slick slider - resize on window resize
  if ($(".slick-slider").length) {
    $(window).resize(function () {
      $(".slick-slider").each((i, el) => {
        $(el).slick("setPosition");
        if (isDekstop) {
          loco_scroll.update();
        }
        ScrollTrigger.refresh();
      });
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
function loadFonts() {
  if (sessionStorage.fontsLoaded) {
    document.documentElement.classList.add("fonts-loaded");
    return;
  }
  if ("fonts" in document) {
    const font = new FontFaceObserver("Bartomes").load().then(() => {
      document.documentElement.classList.add("fonts-loaded");
      onAlways();
    });
  }
}
loadFonts();

// onAlways();
