"use strict";
document.addEventListener("DOMContentLoaded", pageScript, false);
function pageScript() {
  gsap.registerPlugin(ScrollTrigger, CSSRulePlugin);
  if (window.history.scrollRestoration) {
    window.history.scrollRestoration = "manual";
  }
  window.scrollTo(0, 0);

  //// page smooth scroll
  let page_container = document.querySelector("[data-scroll-container]");
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

  //// loader anim
  gsap.set(".loader_txt_inner > .txts path,.loader_txt_inner > .fill_bg", {
    opacity: 0,
    scale: 0,
  });
  gsap.set(".loader_txt", {
    opacity: 1,
  });
  var loaderTl = gsap.timeline({
    repeat: -1,
    repeatDelay: 0,
  });
  loaderTl
    .to(".loader_txt_inner > .txts path", {
      ease: "Elastic.easeInOut",
      opacity: 1,
      scale: 1,
      duration: 1.5,
      stagger: 0.05,
    })
    .to(
      ".loader_txt_inner > .fill_bg",
      {
        duration: 0.5,
        ease: "Back.easeOut",
        opacity: 1,
        scale: 1,
        stagger: 0.1,
      },
      "-=0.8"
    )
    .to(".loader_txt_inner", {
      delay: 1,
      ease: "Elastic.easeInOut",
      opacity: 0,
      scale: 0,
      duration: 2,
    })
    .set(".loader_txt_inner", {
      opacity: 1,
      scale: 1,
    });

  /////

  $(document).ready(function () {
    //locomotive & scrolltrigger refresh
    if (window.history.scrollRestoration) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    loco_scroll.scrollTo(page_container, 0);
    ScrollTrigger.addEventListener("refresh", () => loco_scroll.update());
    ScrollTrigger.refresh();

    ///////// init function //////////////////
    /////
    function loadInit() {
      //locomotive & scrolltrigger refresh
      loco_scroll.scrollTo(page_container, 0);
      ScrollTrigger.refresh();

      //pause loader
      loaderTl.repeat(0).pause();
      gsap.to(".loader_txt_inner", {
        ease: "Back.easeIOut",
        opacity: 0,
        scale: 0,
        duration: 1,
      });
      gsap.to("#loader", {
        delay: 0.5,
        opacity: 0,
        duration: 1,
        onComplete: () => {
          loaderTl.kill();
          $("#loader").remove();
        },
      });
      if ($(".home_banner").length) {
        //create splashScreen -one time use only
        var firstScroll = true;

        gsap.to(".pg_content", { opacity: 1, pointerEvents: "all" });
        gsap.set(".scale", {
          scale: 0,
          opacity: 0,
        });
        gsap.set(".scale > img", {
          opacity: 0,
        });
        let flash_srt = gsap.timeline();
        const srt_ln = $(".scale > img").length,
          srt_duration = 0.3;
        for (let i = 0; i < srt_ln; i++) {
          if (i == 0) {
            flash_srt.to($(".scale > img").eq(i), {
              delay: 1,
              opacity: 1,
              duration: srt_duration,
              ease: "Power0.easeOut",
            });
          } else {
            flash_srt
              .to($(".scale > img").eq(i - 1), {
                opacity: 0,
                duration: srt_duration,
                ease: "Power0.easeOut",
              })
              .to($(".scale > img").eq(i), {
                opacity: 1,
                duration: srt_duration,
                ease: "Power0.easeOut",
              });
          }
        }
        flash_srt
          .to($(".scale > img").eq(srt_ln - 1), {
            opacity: 0,
            duration: srt_duration,
            ease: "Power0.easeOut",
          })
          .to($(".scale > img").eq(0), {
            opacity: 1,
            duration: srt_duration,
            ease: "Power0.easeOut",
          });

        ///banner animation
        gsap.set(".center_banner", { pointerEvents: "all" });
        var page_bannerEl = gsap.timeline({ pause: true, once: true });
        page_bannerEl
          .set(".center_move", {
            scale: 1,
            opacity: 1,
            y: 0,
            x: 0,
            transformOrigin: "bottom center",
          })
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
          .to(".center_move", {
            scale: 0.45,
            x: "-19%",
            y: "-5%",
            y: 0,
            duration: 0.3,
            transformOrigin: "bottom center",
          })
          .to(".home_banner_inner,.particle_box", {
            opacity: 1,
            duration: 0.5,
          })
          .to(".home_banner_inner .popin", {
            duration: 0.5,
            scale: 1,
            opacity: 1,
            ease: "Back.easeOut",
            stagger: 0.05,
          })
          .to(
            ".home_banner_inner .all_text > span span",
            {
              yPercent: 0,
              opacity: 1,
              scaleX: 1,
              stagger: 0.05,
              duration: 0.5,
              ease: "Power3.in",
            },
            "-=0.5"
          )
          .pause();

        gsap.to(".scale", {
          scale: 1,
          opacity: 1,
          delay: 1,
          duration: 1,
          ease: "none",
          onComplete: () => {
            $(".scrollme").addClass("show");
            setTimeout(() => {
              $(".floating").addClass("active");
              window.addEventListener("wheel", ({ deltaY }) => {
                if (deltaY > 0) {
                  splashScreen();
                }
              });

              $(".scrollme").on("click", splashScreen);
            }, 2000);
          },
        });
      }

      function splashScreen() {
        if (firstScroll) {
          gsap.set(".center_banner", { pointerEvents: "none" });
          gsap.set(".home_banner", { pointerEvents: "all" });
          page_bannerEl.play();
          $(".scrollme").removeClass("show");
          setTimeout(() => {
            $(".main-head").addClass("show");
            gsap.set(page_container, {
              pointerEvents: "all",
            });
            loco_scroll.start();
            window.scrollTo(0, 0);
            loco_scroll.scrollTo(0, 0, 0);
            ScrollTrigger.clearScrollMemory();
            ScrollTrigger.refresh();

            afterPageLoad();
          }, 1500);
          firstScroll = false;
        }
      }
      ///end
    }
    /////////////////////////////////////////

    //// Navigation setup
    //add gap to banner
    function addGap() {
      document.querySelector(".banner").style.paddingTop =
        document.querySelector(".main-head").clientHeight + "px";
    }
    addGap();
    window.addEventListener("resize", addGap);
    window.addEventListener("scroll", addGap);

    // nav element animation
    wavify(document.querySelector("#wave"), {
      height: 110,
      bones: 6,
      amplitude: 12,
      color: "#3E2300",
      speed: 0.3,
    });

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

    ////load lottie animation for banner
    var playhead = { frame: 0, max: 86 },
      lottieEl = document.getElementById("lottie");
    var animations = lottie.loadAnimation({
      container: lottieEl,
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: "js/jelly-v2.json",
      // animationData: animationData,
      rendererSettings: {
        scaleMode: "noScale",
        preserveAspectRatio: "xMidYMid meet",
        progressiveLoad: true,
      },
    });

    ////text split
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

        gsap.to($(el).find(".char"), {
          yPercent: 0,
          opacity: 1,
          stagger: 0.015,
          duration: 0.3,
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
            end: "+=100%",
            scroller: page_container,
            // markers: true,
          },
        });
      });
    }
    if ($(".header_float").length) {
      $(".header_float").each(function (i, el) {
        gsap.set(el, {
          yPercent: 100,
          opacity: 0,
        });
        gsap.to(el, {
          yPercent: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: el,
            start: "top 65%",
            end: "+=100%",
            scroller: page_container,
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
            scrub: 1.5,
            start: "top 75%",
            end: "+=50%",
            scroller: page_container,
            // markers: true,
          },
        });
      });
    }

    if ($(".home_banner").length) {
      const bnr = document.querySelector(".home_banner");
      ///create parallax function
      bnr.addEventListener("mousemove", function (mouse) {
        $(bnr)
          .find("[data-move]")
          .each(function (i, el) {
            let _this = this;
            let resistance = Number($(_this).attr("data-move")) * 10;
            parallax(el, resistance, mouse);
          });
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
              y: () => `random(25, ${h / 2 - offset * 2}, 150)`,
              z: () => `random(0, 15, 1)`,
              opacity: () => `random(0, 0.7, 0.1)`,
              scale: () => `random(0.2, 1.5, 0.1)`,
            });
            gsap.to(p, {
              x: () => `random(50, ${w / 2 - offset}, 30)`,
              y: () => `random(50, ${h / 2 - offset * 2}, 50)`,
              duration: `random(20, 80, 25)`,
              ease: "none",
              repeat: -1,
              repeatRefresh: true,
            });
          } else {
            gsap.set(p, {
              x: () => `random(${w / 2 + offset}, ${w - offset}, 200)`,
              y: () => `random(${h / 2 + offset}, ${h - offset * 2}, 150)`,
              z: () => `random(0, 15, 1)`,
              opacity: () => `random(0, 0.7, 0.1)`,
              scale: () => `random(0.2, 1.5, 0.1)`,
            });
            gsap.to(p, {
              x: () => `random(${w / 2 + offset}, ${w - offset}, 30)`,
              y: () => `random(${h / 2 + offset}, ${h - offset * 2}, 50)`,
              duration: `random(20, 80, 25)`,
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

      if ($("#canvas").length) {
        paintParticle({
          el: "canvas",
          count: 30,
          size: 1.5,
          alpha: 0.25,
          speed: 50,
        });
      }
    }

    if ($(".after_banner").length) {
      ///after banner section
      gsap.set(".pr_box", {
        opacity: 0,
      });
      gsap.set(".box_inner>*", {
        xPercent: 50,
        opacity: 0,
      });
      gsap.set(".dot_start,.dot_end", {
        scale: 0,
        opacity: 0,
      });

      gsap.set(".after_banner .btn_box", {
        opacity: 0,
        yPercent: 100,
      });
      var after_banner_tl = gsap.timeline({ pause: true });

      $(".bg_pos>img,.popin>img,.all_text>span,.particle_box").each(
        function () {
          after_banner_tl.to(
            this,
            {
              yPercent: () => gsap.utils.random(-50, 50),
              opacity: 0,
              ease: "Power0.easeOut",
              duration: 0.3,
            },
            "-=0.3"
          );
        }
      );
      after_banner_tl
        .to(
          ".center_move",
          {
            scale: 0.85,
            x: 0,
            y: "5%",
            transformOrigin: "bottom center",
            duration: 3,
            attr: {
              class: "center_move glow",
            },
          },
          "-=2"
        )
        .to(".after_banner", {
          opacity: 1,
          duration: 2,
        });
      $(".pr_box").each(function () {
        let _this = $(this);
        after_banner_tl
          .to(_this, {
            duration: 0.1,
            opacity: 1,
          })
          .to(
            _this.find(".dot_end"),
            {
              scale: 1,
              opacity: 1,
              duration: 0.3,
              ease: "Elastic.easeOut",
            },
            "-=0.1"
          )
          .to(
            _this.find(".dot_start"),
            {
              scale: 1,
              opacity: 1,
              duration: 0.3,
            },
            "-=0.3"
          )
          .to(
            _this.find(".box_inner>*"),
            {
              xPercent: 0,
              opacity: 1,
              stagger: 0.03,
              duration: 0.3,
            },
            "-=0.3"
          );
      });
      after_banner_tl
        .to(".after_banner .btn_box", {
          opacity: 1,
          yPercent: 0,
          duration: 1,
        })
        .to(".after_banner_inner", {
          opacity: 1,
          duration: 1,
        });
      after_banner_tl.pause();
    }

    ///wave animation
    if ($(".v_wave").length) {
      const wave = document.querySelectorAll(".v_wave");
      wave.forEach(function (el) {
        wavify(el, {
          height: 60,
          bones: 6,
          amplitude: 20,
          speed: 0.35,
        });
      });
    }

    //facnybox gallery
    if ($("[data-fancybox='gallery']").length) {
      Fancybox.bind("[data-fancybox='gallery']", {
        hideScrollbar: true,
        wheel: "slide",
        Toolbar: {
          display: {
            left: ["infobar"],
            middle: [],
            right: ["toggle1to1", "slideshow", "thumbs", "close"],
          },
        },
        Thumbs: {
          type: "modern",
        },
        Images: {
          initialSize: "fit",
        },
        Hash: false,
      });
    }

    //slider
    if ($(".review_slider").length) {
      let slider = document.querySelector(".review_slider");
      new Swiper(slider, {
        navigation: {
          nextEl: slider.querySelector(".swiper-button-next"),
          prevEl: slider.querySelector(".swiper-button-prev"),
        },
      });
    }

    if ($(".full_slider_sec").length) {
      gsap.set(".full_slider_sec .full_slider_wrapper", {
        height: $(".full_slider_sec .full_sl_item").length * 100 + "vh",
      });
    }

    function afterPageLoad() {
      //load images
      loadImages();

      if ($(".after_banner").length) {
        ScrollTrigger.create({
          trigger: ".after_banner",
          pin: true,
          scrub: 1.3,
          start: "top top",
          end: "+=55%",
          invalidateOnRefresh: true,
          scroller: page_container,
          // markers: true,
        });
        ScrollTrigger.create({
          trigger: ".after_banner_inner",
          animation: after_banner_tl,
          scrub: 1.3,
          start: "top center",
          end: "+=75%",
          invalidateOnRefresh: true,
          scroller: page_container,
          // markers: true,
        });
      }

      if ($(".center_banner").length) {
        $(".center_banner .scale").addClass("hidden");
        $("#lottie").addClass("show");
        ScrollTrigger.create({
          trigger: ".center_banner",
          scrub: 1.3,
          start: 0,
          end: "+=155%",
          pin: true,
          // markers: true,
          invalidateOnRefresh: true,
          scroller: page_container,
          onUpdate: (self) => {
            playhead.frame = Math.round(self.progress * 100);
            if (playhead.frame > playhead.max) {
              playhead.frame = playhead.max;
            }
            // console.log(playhead.frame);
            animations.goToAndStop(playhead.frame, true);
          },
        });
        $(".center_banner").parent().addClass("center_pin");
      }

      //// project page
      if ($(".full_slider_sec").length) {
        const sections = document.querySelectorAll(".full_sl_item");
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
              loco_scroll.start();
            }
          },
        };
        function goToSection(section, anim, i) {
          if (scrolling.enabled) {
            // skip if a scroll tween is in progress
            scrolling.disable();

            loco_scroll.scrollTo(section);

            gsap.to(page_container, {
              scrollTo: { y: section, autoKill: false },
              onComplete: scrolling.enable,
              duration: 1,
            });
            anim && anim.restart();
          }
        }
        function setAnimation(section, index, direction) {
          // console.log(index);

          $(sections).removeClass("active up down");
          if (direction === "down") {
            $(section).next().addClass("down");
            $(section).prev().addClass("up");
            $(section).addClass("down");
          }
          if (direction === "up") {
            $(section).next().addClass("down");
            $(section).prev().addClass("up");
            $(section).addClass("up");
          }
          $(section).addClass("active");

          $(".full_slider_sec .sl_bg").removeClass("active");
          $(".full_slider_sec .sl_bg").eq(index).addClass("active");
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

          // Second ScrollTrigger for onLeave
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
          trigger: ".full_slider_inner_wave",
          pin: true,
          start: "top top",
          // pinSpacing: false,
          end: `+=${(sections.length - 1) * 100}%`,
          scroller: page_container,
          // markers: true,
        });
        $(".full_slider_inner_wave").parent().addClass("full_slider_wave_pin");
        ScrollTrigger.create({
          trigger: ".all_bg",
          pin: true,
          start: "top top",
          // pinSpacing: false,
          end: `+=${(sections.length - 1) * 100}%`,
          scroller: page_container,
          // markers: true,
        });
        $(".all_bg").parent().addClass("all_bg_pin");
      }

      //parallax
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
                scroller: page_container,
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
                scroller: page_container,
                // markers: true,
              },
            });
          }
        });
      }

      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 300);
    }

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

    loco_scroll.on("scroll", (args) => {
      // console.log(args);
      if (window.innerWidth > 1024) {
        if (args.delta.y >= 0 && args.delta.y <= 10) {
          if (!$(".main-head").hasClass("active")) {
            $(".main-head").addClass("active");
            nav_timeline.pause().delay(3).restart();
          }
        } else {
          nav_timeline.pause().reverse();
          $(".main-head").delay(3).removeClass("active");
        }
      }
    });
    //end page Js

    //end ready

    //// page loader

    jQuery(".bg,img:not([data-src]),video,canvas")
      // jQuery("body")
      .imagesLoaded({
        background: true,
      })
      .progress(function (instance, image) {})
      .always(function () {
        animations.addEventListener("DOMLoaded", function () {
          setTimeout(() => {
            loadInit();
          }, 2000);
        });
      });
  });

  function paintParticle(particle) {
    let pr_el = particle.el,
      pr_count = particle.count,
      pr_size = particle.size,
      pr_alpha = particle.alpha,
      pr_speed = particle.speed;

    window.requestAnimFrame = (function () {
      return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
          window.setTimeout(callback, 1000 / 60);
        }
      );
    })();
    let canvas = document.getElementById(pr_el);
    let ctx = canvas.getContext("2d");
    let W = window.innerWidth,
      H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    let particle_count = pr_count,
      particles = [];
    function Particle() {
      this.radius = Math.round(Math.random() * pr_size + 5);
      this.x = Math.floor((Math.random() * canvas.width) / 2 + 50);
      this.y = Math.floor((Math.random() * canvas.height) / 2 + 50);
      this.color = "#fff";
      this.speedx = Math.round(Math.random() * pr_speed + 0) / 100;
      this.speedy = Math.round(Math.random() * pr_speed + 0) / 100;
      switch (Math.round(Math.random() * 5)) {
        case 1:
          this.speedx *= 1;
          this.speedy *= 1;
          break;
        case 2:
          this.speedx *= -1;
          this.speedy *= 1;
          break;
        case 3:
          this.speedx *= 1;
          this.speedy *= -1;
          break;
        case 4:
          this.speedx *= -1;
          this.speedy *= -1;
          break;
      }
      this.move = function () {
        ctx.beginPath();
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = this.color;
        ctx.globalAlpha = pr_alpha;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
        this.x = this.x + this.speedx;
        this.y = this.y + this.speedy;

        if (this.x <= 0 + this.radius || this.x >= canvas.width - this.radius) {
          this.speedx *= -1;
        }
        if (
          this.y <= 0 + this.radius ||
          this.y >= canvas.height - this.radius
        ) {
          this.speedy *= -1;
        }
      };
    }
    for (let i = 0; i < particle_count; i++) {
      let particle = new Particle();
      particles.push(particle);
    }
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particle_count; i++) {
        particles[i].move();
      }
      requestAnimFrame(animate);
    }
    animate();
  }

  function loadImages() {
    let all_img = document.querySelectorAll("img[data-src]");
    all_img.forEach(function (images) {
      images.src = images.dataset.src;
    });
  }
}
