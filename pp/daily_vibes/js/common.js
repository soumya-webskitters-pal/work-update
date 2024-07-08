"use strict";
document.addEventListener("DOMContentLoaded", pageScript, false);
function pageScript() {
  gsap.registerPlugin(ScrollTrigger);

  window.scrollTo(0, 0);
  if (window.history.scrollRestoration) {
    window.history.scrollRestoration = "manual";
  }

  const responsive_size = 1024;
  var isDekstop = true;

  if (window.innerWidth <= responsive_size) {
    isDekstop = false;
    document.body.classList.add("mobileLayout");
  }

  //detect device
  function detectDevice() {
    const iOS = /^iP/.test(navigator.platform);
    if (iOS) {
      document.body.classList.add("iphone");
    } else {
      document.body.classList.add("android");
    }
  }
  detectDevice();

  // Detect Safari
  if (
    navigator.userAgent.indexOf("Safari") > -1 &&
    navigator.userAgent.indexOf("Chrome") <= -1
  ) {
    document.body.classList.add("safariBrowser");
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
  preventScroll();

  //enable scroll
  function enableScroll() {
    document.removeEventListener("wheel", pvs, { passive: false });
    document.removeEventListener("touchstart", pvs, { passive: false });
    document.removeEventListener("touchend", pvs, { passive: false });
    document.removeEventListener("touchmove", pvs, { passive: false });
  }

  window.onbeforeunload = function () {
    window.history.scrollRestoration = "manual";
    ScrollTrigger.clearScrollMemory();
    window.scrollTo(0, 0);
  };

  var isLoaded = false;

  //// page smooth scroll
  const page_container = document.querySelector("[data-scroll-container]");
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
  }

  //// loader anim
  var loaderTl = gsap.timeline({
    repeat: -1,
    repeatDelay: 0,
  });

  const gr_bg = document.querySelector(".gradient_bg");
  if (gr_bg != undefined) {
    const interBubble = gr_bg.querySelector(".interactive");
    window.addEventListener("mousemove", (e) => {
      if (gr_bg.classList.contains("active")) {
        var newposX = e.clientX - interBubble.clientWidth / 2,
          newposY = e.clientY - interBubble.clientHeight / 2;

        interBubble.style.transform = `translate3d(${Math.round(
          newposX
        )}px, ${Math.round(newposY)}px,0px)`;
      }
    });
  }
  /////

  $(document).ready(function () {
    ///////// init function //////////////////
    function loadInit() {
      //locomotive & scrolltrigger refresh
      ScrollTrigger.clearScrollMemory();
      ScrollTrigger.refresh();
      window.scrollTo(0, 0);
      if (isDekstop) {
        loco_scroll.scrollTo(page_container, 0);
        ScrollTrigger.addEventListener("refresh", () => loco_scroll.update());
      }

      //pause loader
      loaderTl.repeat(0).pause();
      gsap.set(page_container, { opacity: 1, pointerEvents: "all" });
      gsap.to("#loader", {
        delay: 0.5,
        opacity: 0,
        duration: 1,
        onComplete: () => {
          enableScroll();
          loaderTl.kill();
          $("#loader").remove();
          loadImages();
          nav_timeline.pause().delay(6).restart();
          $(".main-head").addClass("show active");
          if (!isDekstop) {
            document.body.classList.remove("disable");
          }

          setTimeout(() => {
            ScrollTrigger.refresh();
            loco_scroll.start();

            isLoaded = true;
          }, 300);
        },
      });
      ///end
    }
    /////////////////////////////////////////
    //mouse interactive
    const circle = document.createElement("div");
    circle.classList.add("circle");
    document.querySelector("body").append(circle);
    const circleBounds = circle.getBoundingClientRect();
    let mousetl = gsap.timeline();
    mousetl
      .fromTo(
        circle,
        0.5,
        {
          autoAlpha: 1,
          scale: 0,
        },
        {
          autoAlpha: 0,
          scale: 1,
          ease: Power1.easeOut,
        }
      )
      .pause();
    window.addEventListener("mousedown", function (e) {
      const pageX = e.pageX - circleBounds.width / 2;
      const pageY = e.pageY - circleBounds.height / 2;
      gsap.set(circle, { css: { top: pageY, left: pageX } });
      mousetl.restart();
    });
    //// Navigation setup
    //add gap to banner
    function addGap() {
      document.querySelector(".banner").style.paddingTop =
        document.querySelector(".main-head").clientHeight + "px";
    }
    addGap();
    window.addEventListener("resize", addGap);
    window.addEventListener("scroll", addGap);

    //add class in viewport
    function scrollUpdate() {
      document.querySelectorAll(".sections").forEach((sec) => {
        isLoaded
          ? ScrollTrigger.isInViewport(sec, 0.3)
            ? sec.classList.add("active")
            : sec.classList.remove("active")
          : null;
      });
    }

    // nav element animation
    gsap.set(".navbar", {
      opacity: 0,
    });
    gsap.set([".navbar-nav>li", ".nav_btns_group>li"], {
      opacity: 0,
      yPercent: 50,
    });
    var nav_timeline = gsap.timeline({ pause: true });
    nav_timeline
      .to(".navbar", { opacity: 1, duration: 0.3 }, "-=0.5")
      .to([".navbar-nav>li", ".nav_btns_group>li"], {
        opacity: 1,
        yPercent: 0,
        stagger: 0.04,
        duration: 0.3,
      })
      .pause();

    //nav open-close
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

      $(".navbar-toggler-main").on("click", function () {
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

    //nav show-hide
    if (isDekstop) {
      loco_scroll.on("scroll", (args) => {
        scrollUpdate();

        //nav show-hide
        if (args.delta.y >= 0 && args.delta.y <= 10) {
          if (!$(".main-head").hasClass("active")) {
            $(".main-head").addClass("active");
            nav_timeline.pause().delay(3).restart();
          }
        } else {
          nav_timeline.pause().reverse();
          $(".main-head").delay(3).removeClass("active");
        }
      });
    } else {
      window.addEventListener("scroll", function (args) {
        scrollUpdate();

        //nav show-hide
        if (window.scrollY >= 0 && window.scrollY <= 10) {
          if (!$(".main-head").hasClass("active")) {
            $(".main-head").addClass("active");
            nav_timeline.pause().restart();
          }
        } else {
          nav_timeline.pause().reverse();
          $(".main-head").removeClass("active");
        }
      });
    }

    //tooltip
    if ($('[data-toggle="tooltip"]').length) {
      $('[data-toggle="tooltip"]').tooltip();
    }

    if ($("[data-scroll]").length) {
      const scroll_box = document.querySelectorAll("[data-scroll]");
      scroll_box.forEach(function (revEl) {
        const dataval = revEl.dataset.scroll;
        let get_start_pos = revEl.getBoundingClientRect().top;
        gsap.to(revEl, {
          x: () =>
            (revEl.scrollWidth -
              window.innerWidth +
              (window.innerWidth > 991 ? 50 : 20)) *
            -1,
          scrollTrigger: {
            start: () =>
              get_start_pos > window.innerHeight
                ? "top 70%"
                : "top " + get_start_pos + "px",
            end: () =>
              get_start_pos > window.innerHeight ? "bottom 40%" : "bottom 20%",
            trigger: revEl,
            scrub: 1.1,
            scroller: isDekstop ? page_container : window,
            // markers: true,
          },
        });
      });
    }

    ///title move
    if ($("[data-hr_move]").length) {
      $("[data-hr_move]").each(function () {
        let cr_els = $(this);
        let pos = Number(cr_els.attr("data-hr_move"));
        gsap.from(cr_els, {
          xPercent: 50 * pos,
          scrollTrigger: {
            trigger: cr_els,
            scrub: 1.1,
            start: "top 75%",
            end: "+=50%",
            scroller: isDekstop ? page_container : window,
            // markers: true,
          },
        });
      });
    }

    //move elements on mouse move
    if ($("[data-move_container]").length && isDekstop) {
      const bnrMove = document.querySelectorAll("[data-move_container]");

      bnrMove.forEach(function (bnr) {
        bnr.addEventListener("mousemove", function (mouse) {
          //move elements
          if ($(bnr).find("[data-move]").length) {
            $(bnr)
              .find("[data-move]")
              .each(function (i, el) {
                let _this = this;
                let resistance = Number($(_this).attr("data-move")) * 10;

                let x =
                    (mouse.clientX - window.innerWidth / 2) / resistance / 10,
                  y = (mouse.clientY - window.innerHeight / 2) / resistance / 5;
                // console.log(x, y);
                gsap.to(el, {
                  x: x,
                  y: y,
                  duration: 0.2,
                  ease: "none",
                  z: Math.max(x * 10, y * 10),
                });
              });
          }

          //rotate elements
          if ($(bnr).find("[data-rotate]").length) {
            $(bnr)
              .find("[data-rotate]")
              .each(function (i, el) {
                let _this = this;
                let resistance = Number($(_this).attr("data-rotate")) * 10;
                let r =
                  (mouse.clientX - window.innerWidth / 2) / resistance / 5 +
                  (mouse.clientY - window.innerHeight / 2) / resistance / 10;
                gsap.to(el, {
                  rotation: r,
                  duration: 0.15,
                  ease: "none",
                });
              });
          }
        });
      });
    }

    //create bubble effect
    if ($("[data-bubble]").length) {
      const sections = document.querySelectorAll("[data-bubble]");
      sections.forEach((el) => {
        let pr_val = Number(el.dataset.bubble);
        for (let i = 0; i < pr_val; i++) {
          let bubbles = document.createElement("span");
          bubbles.classList.add("bubble");
          el.append(bubbles);
        }

        let bubbles = el.querySelectorAll(".bubble");
        gsap.set(el, { opacity: 1 });
        gsap.to(bubbles, {
          opacity: "random(0, 0.5)",
          top: 0,
          x: "random(-150,150)",
          rotation: "random(-360,360)",
          scale: "random(.1, 1.8)",
          duration: 5,
          stagger: {
            amount: 5,
            each: 1,
            repeat: -1,
          },
        });
      });
    }

    //parallax element
    if ($("[data-parallax]").length) {
      $("[data-parallax]").each(function () {
        let pr_this = $(this);
        let pr_val = Number(pr_this.attr("data-parallax"));
        if (pr_this.find(".parallax_bg").length) {
          gsap.set(pr_this.find(".parallax_bg"), {
            yPercent: -pr_val,
            height: 100 + pr_val + "%",
          });

          gsap.to(pr_this.find(".parallax_bg"), {
            yPercent: pr_val,
            duration: 1,
            ease: "none",
            scrollTrigger: {
              trigger: pr_this,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.3,
              invalidateOnRefresh: true,
              scroller: isDekstop ? page_container : window,
              // markers: true,
            },
          });
        }

        if (pr_this.find(".parallax_el").length) {
          gsap.set(pr_this.find(".parallax_el"), {
            yPercent: -pr_val,
            scale: 1 + Math.abs(pr_val) / 90,
          });
          gsap.to(pr_this.find(".parallax_el"), {
            yPercent: pr_val,
            duration: 1,
            ease: "none",
            scrollTrigger: {
              trigger: pr_this,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.3,
              invalidateOnRefresh: true,
              scroller: isDekstop ? page_container : window,
              // markers: true,
            },
          });
        }

        if (pr_this.find("[data-rotate]").length) {
          let rotate_val = pr_this.find("[data-rotate]").attr("data-rotate");
          gsap.set(pr_this.find("[data-rotate]"), {
            rotation: -rotate_val,
          });
          gsap.to(pr_this.find("[data-rotate]"), {
            rotation: rotate_val,
            duration: 1,
            ease: "none",
            scrollTrigger: {
              trigger: pr_this,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.3,
              invalidateOnRefresh: true,
              scroller: isDekstop ? page_container : window,
              // markers: true,
            },
          });
        }

        if (pr_this.find("[data-pr]").length) {
          pr_this.find("[data-pr]").each(function (q, pr) {
            let vl = $(pr).attr("data-pr");
            gsap.to(pr, {
              yPercent: vl,
              duration: 1,
              ease: "none",
              scrollTrigger: {
                trigger: pr_this,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.3,
                invalidateOnRefresh: true,
                scroller: isDekstop ? page_container : window,
                // markers: true,
              },
            });
          });
        }
      });
    }

    //headline text split anim
    if ($("[data-split]").length) {
      $("[data-split]").each(function (i, el) {
        Splitting({ target: el, by: "chars" });
        if ($(el).find(".whitespace").length) {
          $(el).find(".whitespace").append("&nbsp;");
        }
        gsap.set($(el).find(".char"), {
          opacity: 0,
          yPercent: 110,
          transformOrigin: "center top",
          transformStyle: "preserve-3d",
        });

        let get_start_pos = el.getBoundingClientRect().top;
        if (get_start_pos > window.innerHeight) {
          gsap.to($(el).find(".char"), {
            yPercent: 0,
            opacity: 1,
            stagger: 0.015,
            duration: 0.3,
            scrollTrigger: {
              trigger: el,
              start: isDekstop ? "top 75%" : "top 85%",
              end: "+=100%",
              scroller: isDekstop ? page_container : window,
              // markers: true,
            },
          });
        } else {
          gsap.to($(el).find(".char"), {
            delay: 1,
            yPercent: 0,
            opacity: 1,
            stagger: 0.05,
            duration: 1,
            ease: "Back.easeInOut",
          });
        }
      });
    }

    /// reveal element
    if ($("[data-reveal]").length) {
      $("[data-reveal]").each(function (ix, el) {
        let _this = $(this);
        if (_this.attr("data-reveal") === "slideUp") {
          gsap.set(_this, {
            opacity: 1,
          });
          gsap.set(_this.find(">*"), {
            opacity: 0,
            yPercent: 100,
          });
          if (_this.offset().top > window.innerHeight) {
            gsap.to(_this.find(">*"), {
              stagger: 0.5,
              opacity: 1,
              yPercent: 0,
              duration: 1,
              ease: "Back.easeOut",
              scrollTrigger: {
                trigger: _this,
                start: isDekstop ? "top 75%" : "top 85%",
                scroller: isDekstop ? page_container : window,
                //  markers: true,
              },
            });
          } else {
            gsap.to(_this.find(">*"), {
              stagger: 0.5,
              opacity: 1,
              yPercent: 0,
              duration: 1,
              ease: "Back.easeOut",
            });
          }
        }
        if (_this.attr("data-reveal") === "slide") {
          gsap.set(_this, {
            opacity: 1,
          });
          gsap.set(_this.find(">*"), {
            opacity: 0,
            yPercent: 100,
          });
          if (_this.offset().top > window.innerHeight) {
            gsap.to(_this.find(">*"), {
              stagger: 0.3,
              opacity: 1,
              yPercent: 0,
              duration: 1,
              ease: "Power2.easeOut",
              scrollTrigger: {
                trigger: _this,
                start: isDekstop ? "top 80%" : "top 95%",
                scroller: isDekstop ? page_container : window,
                //  markers: true,
              },
            });
          } else {
            gsap.to(_this.find(">*"), {
              stagger: 0.3,
              opacity: 1,
              yPercent: 0,
              duration: 1,
              ease: "Power2.easeOut",
            });
          }
        }
        if (_this.attr("data-reveal") === "list") {
          gsap.set(_this, {
            opacity: 1,
          });
          gsap.set(_this.find(">*"), {
            opacity: 0,
            xPercent: -100,
          });
          if (_this.offset().top > window.innerHeight) {
            gsap.to(_this.find(">*"), {
              stagger: 0.1,
              opacity: 1,
              xPercent: 0,
              duration: 1,
              ease: "Back.easeOut",
              scrollTrigger: {
                trigger: _this,
                start: isDekstop ? "top 80%" : "top 95%",
                scroller: isDekstop ? page_container : window,
                //  markers: true,
              },
            });
          } else {
            gsap.to(_this.find(">*"), {
              stagger: 0.1,
              opacity: 1,
              xPercent: 0,
              duration: 1,
              ease: "Back.easeOut",
            });
          }
        }
      });
    }

    //home banner anim
    if ($(".home_banner").length) {
      let home_banner = document.querySelector(".home_banner"),
        layers = home_banner.querySelectorAll(".btf"),
        btfSec = document.getElementById("butterflyBox"),
        butterfly = btfSec.querySelector(".butterfly");

      //butterfly fly anim
      const body = butterfly.querySelector(".body"),
        lftWing = butterfly.querySelector(".leftwing"),
        rtWing = butterfly.querySelector(".rightwing");
      gsap.set([body, lftWing, rtWing], {
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        xPercent: -50,
        scaleX: 1,
        scaleY: 1,
      });
      gsap.set(body, {
        transformOrigin: "50% 50%",
      });
      gsap.set(lftWing, {
        transformOrigin: "100% 50%",
      });
      gsap.set(rtWing, {
        transformOrigin: "0% 50%",
      });
      let butterflyTl = gsap.timeline({
        repeat: -1,
        defaults: { duration: 0.85, ease: "none" },
      });
      butterflyTl
        .to(body, {
          scaleX: 0.9,
        })
        .to(
          lftWing,
          {
            scaleX: 1.1,
            scaleY: 1.05,
            rotationY: -75,
            rotationZ: -8,
          },
          "<"
        )
        .to(
          rtWing,
          {
            scaleX: 1.1,
            scaleY: 1.05,
            rotationY: 75,
            rotationZ: 8,
          },
          "<"
        )

        .to(body, {
          scaleX: 1,
        })
        .to(
          lftWing,
          {
            scaleX: 1,
            scaleY: 1,
            rotationY: 0,
            rotationZ: 0,
          },
          "<"
        )
        .to(
          rtWing,
          {
            scaleX: 1,
            scaleY: 1,
            rotationY: 0,
            rotationZ: 0,
          },
          "<"
        )
        .pause();

      let homeBannerTl = gsap.timeline();
      homeBannerTl
        .to(layers, {
          opacity: 0,
        })
        .to(
          btfSec,
          {
            opacity: 1,
          },
          "<"
        )
        .to(butterfly, {
          transformOrigin: "50% 50%",
          xPercent: 50,
          yPercent: -130,
          scale: 0.2,
          rotation: 70,
          ease: "none",
        })
        .to(butterfly, {
          transformOrigin: "50% 50%",
          xPercent: 110,
          yPercent: -100,
          scale: 0.15,
          rotation: 160,
          ease: "none",
        })
        .to(butterfly, {
          transformOrigin: "50% 50%",
          xPercent: 50,
          yPercent: -40,
          scale: 0.12,
          rotation: 240,
          ease: "none",
        })
        .to(butterfly, {
          transformOrigin: "50% 50%",
          xPercent: 0,
          yPercent: -40,
          scale: 0.2,
          rotation: 260,
          ease: "none",
        })
        .to(butterfly, {
          transformOrigin: "50% 50%",
          xPercent: -75,
          yPercent: -80,
          scale: 0.25,
          rotation: 360,
          ease: "none",
        });
      homeBannerTl.pause();

      ScrollTrigger.create({
        trigger: home_banner,
        pin: true,
        start: 0,
        end: "+=25%",
        scroller: isDekstop ? page_container : window,
      });

      ScrollTrigger.create({
        trigger: home_banner,
        start: 0,
        end: "+=100%",
        animation: homeBannerTl,
        scrub: 1.1,
        scroller: isDekstop ? page_container : window,
        onUpdate: (self) => {
          if (self.progress > 0.1) {
            butterflyTl.play();
          } else {
            butterflyTl.pause(0);
          }

          if (self.progress > 0.6) {
            $(".gradient_bg").removeClass("active");
            $(".all_sl_bg").addClass("active");
            $(".sl_bg").eq(0).addClass("active");
          } else {
            $(".gradient_bg").addClass("active");
            $(".all_sl_bg").removeClass("active");
            $(".sl_bg").removeClass("active");
          }
        },
      });

      gsap.to(butterfly, {
        left: "100%",
        top: 0,
        duration: 0.25,
        scrollTrigger: {
          trigger: btfSec,
          start: "+=450%",
          end: "+=50%",
          scrub: 1.1,
          scroller: isDekstop ? page_container : window,
          onUpdate: (self) => {
            if (self.progress > 0.5) {
              $(".all_sl_bg").removeClass("active");
              $(".splash_bg").addClass("active");
            } else {
              $(".all_sl_bg").addClass("active");
              $(".splash_bg").removeClass("active");
            }
          },
          // markers: true,
        },
      });
    }

    //after banner anim
    if ($(".after_banner").length) {
      const middleSec = document.querySelector(".ingredients_middle_wrapper"),
        allmiddleBox = middleSec.querySelectorAll(".ingredients_middle"),
        sections = document.querySelectorAll(".ingredients_sl"),
        allBg = document.querySelectorAll(".sl_bg");
      let pulseTl = gsap.timeline();
      gsap.set(".pulse", {
        opacity: 0,
      });
      pulseTl
        .set(".pulse", {
          opacity: 1,
          overwrite: true,
        })
        .to(".ring", {
          scale: 15,
          opacity: 0,
          duration: 2,
          stagger: {
            each: 0.3,
          },
        })
        .set(".pulse", {
          opacity: 0,
        })
        .pause();

      if (isDekstop) {
        const scrolling = {
          enabled: true,
          events: "scroll,wheel,touchmove,pointermove".split(","),
          prevent: (e) => e.preventDefault(),
          disable() {
            if (scrolling.enabled) {
              scrolling.enabled = false;
              loco_scroll.stop();
            }
          },
          enable() {
            if (!scrolling.enabled) {
              scrolling.enabled = true;
              if (isDekstop) {
                loco_scroll.start();
              } else {
                enableScroll();
              }
            }
          },
        };

        function goToSection(section, anim, i) {
          if (scrolling.enabled) {
            // skip if a scroll tween is in progress
            scrolling.disable();
            if (i < 1) {
              loco_scroll.scrollTo(section, 0, 2000);
            } else {
              loco_scroll.scrollTo(section, 0);
            }
            // loco_scroll.scrollTo(section);
            gsap.to(page_container, {
              scrollTo: { y: section, autoKill: false },
              onComplete: scrolling.enable,
              duration: 2.5,
              ease: "none",
            });
          }
        }
        function setAnimation(section, index, direction) {
          // console.log(index);
          $(sections).removeClass("up down");
          $(allmiddleBox).removeClass("up down active");

          if (direction === "down") {
            $(section).next().addClass("down");
            $(section).prev().addClass("up");
            $(section).addClass("down");

            $(allmiddleBox[index + 1]).addClass("down");
            $(allmiddleBox[index - 1]).addClass("up");
            $(allmiddleBox[index]).addClass("down");
          }
          if (direction === "up") {
            $(section).next().addClass("down");
            $(section).prev().addClass("up");
            $(section).addClass("up");

            $(allmiddleBox[index + 1]).addClass("down");
            $(allmiddleBox[index - 1]).addClass("up");
            $(allmiddleBox[index]).addClass("up");
          }

          $(allBg).removeClass("active");
          $(allBg[index]).addClass("active");

          $(allmiddleBox[index]).addClass("active");

          if (!$(section).hasClass("active")) {
            $(sections).removeClass("active");
            $(section).addClass("active");
          }

          pulseTl.restart();
        }
        sections.forEach((section, i) => {
          ScrollTrigger.create({
            trigger: section,
            start: "top bottom-=1",
            end: "bottom top+=1",
            scroller: page_container,
            // markers: true,
            onEnter: () => {
              goToSection(section);
            },
            onEnterBack: () => {
              goToSection(section);
            },
          });

          ScrollTrigger.create({
            trigger: section,
            start: "top center",
            end: "bottom center",
            scroller: page_container,
            // markers: true,
            onEnter: () => {
              setAnimation(section, i, "down");
            },
            onEnterBack: () => {
              setAnimation(section, i, "up");
            },
          });
        });
        ScrollTrigger.create({
          trigger: middleSec,
          pin: true,
          start: "top top+=2",
          end: `+=${(sections.length - 1) * 101}%`,
          scroller: page_container,
          // markers: true,
        });
        $(middleSec).parent().addClass("ingredients_middle_pin");
      }
      //for mobile
      else {
        sections.forEach((section, i) => {
          if (i == 0) {
            ScrollTrigger.create({
              trigger: section,
              start: "top 75%",
              end: "bottom 25%",
              // markers: true,
              onEnter: () => {
                gsap.set($(".sl_bg").eq(i), { opacity: 1 });
                $(section).addClass("active");
                $(section).removeClass("prev");
              },
              onEnterBack: () => {
                gsap.set($(".sl_bg").eq(i), { opacity: 1 });
                $(section).addClass("active");
                $(section).removeClass("prev");
              },
              onLeave: () => {
                gsap.set($(".sl_bg").eq(i), { opacity: 0 });
                $(section).addClass("prev");
              },
              onLeaveBack: () => {
                gsap.set($(".sl_bg").eq(i), { opacity: 0 });
                $(section).addClass("prev");
              },
            });
            $(section).addClass("active");
          } else if (i == sections.length - 1) {
            ScrollTrigger.create({
              trigger: section,
              start: "top 75%",
              end: "bottom 25%",
              // markers: true,
              onEnter: () => {
                gsap.set($(".sl_bg").eq(i), { opacity: 1 });
                $(section).addClass("active");
                $(section).removeClass("prev");
              },
              onEnterBack: () => {
                gsap.set($(".sl_bg").eq(i), { opacity: 1 });
                $(section).addClass("active");
                $(section).removeClass("prev");
              },
              onLeave: () => {
                gsap.set($(".sl_bg").eq(i), { opacity: 0 });
                $(section).addClass("prev");
              },
              onLeaveBack: () => {
                gsap.set($(".sl_bg").eq(i), { opacity: 0 });
                $(section).addClass("prev");
              },
            });
          } else {
            ScrollTrigger.create({
              trigger: section,
              start: "top 50%",
              end: "bottom 50%",
              // markers: true,
              onEnter: () => {
                gsap.set($(".sl_bg").eq(i), { opacity: 1 });
                $(section).addClass("active");
                $(section).removeClass("prev");
              },
              onEnterBack: () => {
                gsap.set($(".sl_bg").eq(i), { opacity: 1 });
                $(section).addClass("active");
                $(section).removeClass("prev");
              },
              onLeave: () => {
                gsap.set($(".sl_bg").eq(i), { opacity: 0 });
                $(section).addClass("prev");
              },
              onLeaveBack: () => {
                gsap.set($(".sl_bg").eq(i), { opacity: 0 });
                $(section).addClass("prev");
              },
            });
          }
        });
      }
    }

    //end ready

    //// page loader

    jQuery(".banner")
      .imagesLoaded({
        background: true,
      })
      // .progress(function (instance, image) {})
      .always(loadInit);
  });

  function loadImages() {
    let all_img = document.querySelectorAll("img[data-src]");
    all_img.forEach(function (images) {
      images.src = images.dataset.src;
      ScrollTrigger.refresh();
    });
  }
}
