"use strict";
document.addEventListener("DOMContentLoaded", pageScript, false);
function pageScript() {
  gsap.registerPlugin(ScrollTrigger, CSSRulePlugin);

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
  //for mobile
  else {
    detectDevice();
    preventScroll();
  }

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
    if (isDekstop) {
      loco_scroll.scrollTo(page_container, 0);
      ScrollTrigger.addEventListener("refresh", () => loco_scroll.update());
    }
    ScrollTrigger.refresh();

    ///////// init function //////////////////
    /////
    function loadInit() {
      //locomotive & scrolltrigger refresh
      if (isDekstop) {
        loco_scroll.scrollTo(page_container, 0);
      }
      ScrollTrigger.clearScrollMemory();
      ScrollTrigger.refresh();
      window.scrollTo(0, 0);

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

      //only for homepage - responsible for loading
      if ($(".home_pg").length) {
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
          });
        if (isDekstop) {
          page_bannerEl.to(".center_move", {
            scale: 0.45,
            x: "-19%",
            y: "-5%",
            y: 0,
            duration: 0.3,
            transformOrigin: "bottom center",
          });
        } else {
          page_bannerEl.to(".center_move", {
            scale: 0.45,
            x: 0,
            y: 0,
            y: 0,
            duration: 0.3,
            transformOrigin: "bottom center",
          });
        }
        page_bannerEl
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
              if (!isDekstop) {
                enableScroll();
              }

              $(".scrollme").on("click", splashScreen);
              window.addEventListener("wheel", ({ deltaY }) => {
                if (deltaY > 0 && firstScroll) {
                  preventScroll();
                  $(".scrollme").trigger("click");
                }
              });
              window.addEventListener("scroll", (e) => {
                $(".scrollme").trigger("click");
              });
              window.addEventListener("touchmove", (e) => {
                if (
                  e.touches[0].clientY ||
                  (e.touches[0].pageY && window.pageY === 0 && firstScroll)
                ) {
                  $(".scrollme").trigger("click");
                }
              });
            }, 2000);
          },
        });

        function splashScreen() {
          // preventScroll();
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
              if (isDekstop) {
                loco_scroll.start();
                loco_scroll.scrollTo(0, 0, 0);
                ScrollTrigger.clearScrollMemory();
              } else {
                enableScroll();
              }
              // window.scrollTo(0, 0);
              // ScrollTrigger.refresh();

              afterPageLoad();
            }, 1500);
            firstScroll = false;
          }
        }
      } else {
        firstScroll = false;
        gsap.set(page_container, {
          pointerEvents: "all",
        });

        if (isDekstop) {
          loco_scroll.start();
          loco_scroll.scrollTo(0, 0, 0);
        } else {
          enableScroll();
        }
        ScrollTrigger.clearScrollMemory();
        window.scrollTo(0, 0);
        ScrollTrigger.refresh();
        afterPageLoad();
        nav_timeline.pause().delay(6).restart();
        $(".main-head").addClass("show active");
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
    wavify(document.querySelector("#nav_wave"), {
      height: 110,
      bones: isDekstop ? 6 : 3,
      amplitude: isDekstop ? 12 : 6,
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
    }
    ////load lottie animation for banner
    if ($("#lottie").length) {
      var playhead = { frame: 0, max: 86 },
        lottieEl = document.getElementById("lottie");
      var animations = lottie.loadAnimation({
        container: lottieEl,
        renderer: "canvas",
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
    }

    ///title move
    if ($("[data-hr_move]").length) {
      $("[data-hr_move]").each(function () {
        let cr_els = $(this);
        let pos = Number(cr_els.attr("data-hr_move"));
        if (isDekstop) {
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
        } else {
          gsap.from(cr_els, {
            xPercent: 50 * pos,
            scrollTrigger: {
              trigger: cr_els,
              scrub: 1.5,
              start: "top 75%",
              end: "+=50%",
              // markers: true,
            },
          });
        }
      });
    }

    //move elements on mouse move
    if ($("[data-move_container]").length && isDekstop) {
      const bnrMove = document.querySelectorAll("[data-move_container]");
      bnrMove.forEach(function (bnr) {
        bnr.addEventListener("mousemove", function (mouse) {
          $(bnr)
            .find("[data-move]")
            .each(function (i, el) {
              let _this = this;
              let resistance = Number($(_this).attr("data-move")) * 10;
              parallax(el, resistance, mouse);
            });
        });
      });
    }

    //particle movement
    if ($("[data-particle]").length && isDekstop) {
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

    //particle bounce
    if ($("#canvas").length) {
      paintParticle({
        el: "canvas",
        count: 30,
        size: 1.5,
        alpha: 0.25,
        speed: 50,
      });
    }

    ///wave animation
    if ($(".v_wave").length) {
      const wave = document.querySelectorAll(".v_wave");
      wave.forEach(function (el) {
        wavify(el, {
          height: 60,
          bones: isDekstop ? 6 : 3,
          amplitude: isDekstop ? 20 : 10,
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

    //custom tab
    if ($("[data-tab_parent]").length) {
      $("[data-tab_parent]").each(function () {
        let _this_container = $(this);
        let navs = _this_container.find("[data-tab_nav]"),
          tabs = _this_container.find("[data-tab_target]"),
          fig = _this_container.find("[data-tab_fig]");
        navs.on("click", function (e) {
          e.preventDefault();
          if (!$(this).hasClass("active")) {
            let idx = navs.index(this);
            navs.removeClass("active");
            tabs.removeClass("active");
            fig.removeClass("active");
            gsap.set(tabs.find("li"), {
              opacity: 0,
              xPercent: -100,
              overwrite: true,
            });
            gsap.set(fig, {
              opacity: 0,
              scale: 0,
              transformOrigin: "bottom center",
              overwrite: true,
            });

            $(this).addClass("active");
            tabs.eq(idx).addClass("active");
            gsap.to(tabs.eq(idx).find("li"), {
              opacity: 1,
              xPercent: 0,
              duration: 1,
              stagger: 0.1,
              ease: "Back.easeOut",
            });
            fig.eq(idx).addClass("active");
            gsap.to(fig.eq(idx), {
              opacity: 1,
              scale: 1,
              duration: 1,
              ease: "Back.easeOut",
            });
          }
        });
      });
    }

    //review slider
    if ($(".review_slider").length) {
      let slider = document.querySelector(".review_slider");
      new Swiper(slider, {
        navigation: {
          nextEl: slider.querySelector(".swiper-button-next"),
          prevEl: slider.querySelector(".swiper-button-prev"),
        },
      });
    }

    //select
    if ($(".selectbox").length) {
      $(".selectbox").each(function () {
        $(this).select2({
          dropdownParent: $(this).parent(),
        });
      });
    }

    //number spinner
    $.fn.numberstyle = function (options) {
      var settings = $.extend(
        {
          value: 0,
          step: undefined,
          min: undefined,
          max: undefined,
        },
        options
      );
      return this.each(function (i) {
        var input = $(this);
        var container = document.createElement("div"),
          btnAdd = document.createElement("div"),
          btnRem = document.createElement("div"),
          min = settings.min ? settings.min : input.attr("min"),
          max = settings.max ? settings.max : input.attr("max"),
          value = settings.value ? settings.value : parseFloat(input.val());
        container.className = "numberstyle-qty";
        btnAdd.className =
          max && value >= max ? "qty-btn qty-add disabled" : "qty-btn qty-add";
        btnAdd.innerHTML = "+";
        btnRem.className =
          min && value <= min ? "qty-btn qty-rem disabled" : "qty-btn qty-rem";
        btnRem.innerHTML = "-";
        input.wrap(container);
        input.closest(".numberstyle-qty").prepend(btnRem).append(btnAdd);
        $(document)
          .off("click", ".qty-btn")
          .on("click", ".qty-btn", function (e) {
            var input = $(this).siblings("input"),
              sibBtn = $(this).siblings(".qty-btn"),
              step = settings.step
                ? parseFloat(settings.step)
                : parseFloat(input.attr("step")),
              min = settings.min
                ? settings.min
                : input.attr("min")
                ? input.attr("min")
                : undefined,
              max = settings.max
                ? settings.max
                : input.attr("max")
                ? input.attr("max")
                : undefined,
              oldValue = parseFloat(input.val()),
              newVal;
            if ($(this).hasClass("qty-add")) {
              (newVal = oldValue >= max ? oldValue : oldValue + step),
                (newVal = newVal > max ? max : newVal);
              if (newVal == max) {
                $(this).addClass("disabled");
              }
              sibBtn.removeClass("disabled");
            } else {
              (newVal = oldValue <= min ? oldValue : oldValue - step),
                (newVal = newVal < min ? min : newVal);
              if (newVal == min) {
                $(this).addClass("disabled");
              }
              sibBtn.removeClass("disabled");
            }
            input.val(newVal).trigger("change");
          });
        input.on("change", function () {
          const val = parseFloat(input.val()),
            min = settings.min
              ? settings.min
              : input.attr("min")
              ? input.attr("min")
              : undefined,
            max = settings.max
              ? settings.max
              : input.attr("max")
              ? input.attr("max")
              : undefined;
          if (val > max) {
            input.val(max);
          }
          if (val < min) {
            input.val(min);
          }
        });
      });
    };
    if ($(".numberstyle").length) {
      $(".numberstyle").numberstyle();
    }

    //home page section
    if ($(".after_banner").length && isDekstop) {
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
      after_banner_tl.to(
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
      );
      after_banner_tl.to(".after_banner", {
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

    //home page section
    if ($(".full_slider_sec").length) {
      if (isDekstop) {
        gsap.set(".full_slider_sec .full_slider_wrapper", {
          height: $(".full_slider_sec .full_sl_item").length * 100 + "vh",
        });
      }
    }

    //details page slider sec
    if ($(".swiper_main").length && $(".swiper_thumb").length) {
      var swiper_thumb = new Swiper(".swiper_thumb", {
        loop: false,
        spaceBetween: 17,
        slidesPerView: 4,
        freeMode: true,
        watchSlidesProgress: true,
        navigation: {
          nextEl: ".swiper_thumb-next",
          prevEl: ".swiper_thumb-prev",
        },
      });
      new Swiper(".swiper_main", {
        lazy: true,
        loop: false,
        spaceBetween: 0,
        thumbs: {
          swiper: swiper_thumb,
        },
        // navigation: {
        //   nextEl: ".swiper_main-next",
        //   prevEl: ".swiper_main-prev",
        // },
      });
    }

    if ($(".faq_accordion").length) {
      $(".faq_accordion .accordion-header:not(.collapsed)")
        .parents(".accordion-item")
        .addClass("active");
      $(".faq_accordion .accordion-header:not(.collapsed)")
        .parents(".accordion-item")
        .prev()
        .addClass("border0");
      $(".faq_accordion .accordion-header").on("click", function () {
        ScrollTrigger.refresh();
        $(".faq_accordion .accordion-item").removeClass("active border0");
        if (!$(this).hasClass("collapsed")) {
          $(this).parents(".accordion-item").addClass("active");
          $(this).parents(".accordion-item").prev().addClass("border0");
        }
      });
    }

    //responsive tab
    if ($("#horizontalTab").length) {
      $("#horizontalTab").easyResponsiveTabs({
        type: "default", //Types: default, vertical, accordion
        width: "auto", //auto or any width like 600px
        fit: true, // 100% fit in a container
        activate: function (e) {
          gsap.set($("#horizontalTab .resp-tabs-container_item>*"), {
            opacity: 0,
            overwrite: true,
          });
          gsap.to($("#horizontalTab .resp-tabs-container_item>*"), {
            opacity: 1,
            duration: 0.4,
            stagger: 0.1,
          });
          ScrollTrigger.refresh();
        },
      });
    }

    //hover to color change
    if ($(".cont_inner").length) {
      document.querySelectorAll(".cont_inner").forEach(function (el) {
        let ee = getDeg(el);
        let prevLG = ee.pre + ee.deg + ee.post;
        gsap.set(el, {
          background: prevLG,
        });
        el.addEventListener("mouseenter", function () {
          let createLG = ee.pre + (ee.deg > 0 ? ee.deg * 3 : ee.deg) + ee.post;
          gsap.to(el, {
            duration: 2,
            background: createLG,
            ease: "none",
            repeat: -1,
            yoyo: true,
          });
        });
        el.addEventListener("mouseleave", function () {
          let prevLG = ee.pre + ee.deg + ee.post;
          gsap.to(el, {
            duration: 0.5,
            background: prevLG,
            ease: "none",
            overwrite: true,
          });
        });
      });
    }

    //input hover
    if ($(".input_container").length) {
      $(".input_container input, .input_container textarea").on(
        "blur focus hover click mouseenter mouseleave change keyup",
        function () {
          if ($(this).val().trim().length > 0) {
            $(this).parents(".input_container").addClass("active");
            $(this).addClass("active");
          } else {
            $(this).parents(".input_container").removeClass("active");
            $(this).removeClass("active");
          }
        }
      );
    }

    function afterPageLoad() {
      ScrollTrigger.refresh();

      //load images
      loadImages();

      if (!isDekstop) {
        document.body.classList.remove("disable");
        enableScroll();
      }

      //load large image in about page
      if ($(".all_details_fig").length) {
        gsap.set(".all_details_fig img", {
          scale: 0.5,
        });
        gsap.set(".sv_arrow>*", {
          opacity: 0,
        });
        gsap.set(".all_details_fig svg text", {
          opacity: 0,
        });
        gsap.set(".all_details_fig svg .sv_imgs g", {
          scale: 0,
          opacity: 0,
        });
        let img_tl = gsap.timeline({ pause: true });
        img_tl
          .to(".all_details_fig img", {
            scale: 1,
            duration: 3,
            ease: "none",
          })
          .to(
            ".all_details_fig svg .main_sv_txt text",
            {
              opacity: 1,
              duration: 1,
              ease: "none",
              stagger: 0.15,
            },
            "-=1.5"
          )
          .to(".all_details_fig svg .sv_imgs g", {
            delay: 0.5,
            opacity: 1,
            scale: 1,
            duration: 1,
            stagger: 0.5,
            ease: "Back.easeInOut",
          })
          .to(".all_details_fig svg .sv_arrow>*", {
            opacity: 1,
            duration: 1,
            stagger: 0.2,
            ease: "none",
          })
          .to(".all_details_fig svg .sv_txt text", {
            delay: 0.5,
            opacity: 1,
            duration: 1,
            ease: "none",
            stagger: 1,
          })
          .to(".all_details_fig", {
            delay: 1,
            opacity: 1,
          })
          .pause();

        if (isDekstop) {
          ScrollTrigger.create({
            trigger: ".all_details_fig",
            start: "top top",
            scrub: 1.3,
            end: "+=50%",
            pin: true,
            animation: img_tl,
            invalidateOnRefresh: true,
            scroller: page_container,
            // markers: true,
          });
        } else {
          img_tl = img_tl.timeScale(9)
          ScrollTrigger.create({
            trigger: ".all_details_fig",
            start: "top center",
            animation: img_tl,
            invalidateOnRefresh: true,
            // markers: true,
          });
        }
      }

      //table layout
      if ($(".dtl_table").length) {
        gsap.set(".dtl_table th, .dtl_table td", {
          opacity: 0,
        });
        gsap.set(".dtl_table td img", {
          opacity: 0,
          scale: 0,
        });
        let table_tl = gsap.timeline({ pause: true });
        table_tl
          .to(".dtl_table th, .dtl_table td", {
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
          })
          .to(".dtl_table td:not(.sq) img", {
            opacity: 1,
            scale: 1,
            ease: "Back.easeInOut",
            duration: 1,
            stagger: 0.1,
          })
          .to(".dtl_table", {
            attr: {
              class: "dtl_table active",
            },
          })
          .to(".dtl_table .sq img", {
            opacity: 1,
            scale: 1,
            ease: "Back.easeInOut",
            duration: 1,
            stagger: 0.1,
          })
          .pause();

        if (isDekstop) {
          ScrollTrigger.create({
            trigger: ".dtl_table",
            start: "top 80%",
            scrub: 1.3,
            end: "+=60%",
            animation: table_tl,
            invalidateOnRefresh: true,
            scroller: page_container,
            // markers: true,
          });
        } else {
          ScrollTrigger.create({
            trigger: ".dtl_table",
            start: "top 80%",
            scrub: 1.3,
            end: "+=60%",
            animation: table_tl,
            invalidateOnRefresh: true,
            // markers: true,
          });
        }
      }

      //
      if ($(".howItWorks_inner").length) {
        $(".howItWorks_inner .hw_lft").each(function () {
          let _this = $(this);
          const ln1 = this.querySelector(".l"),
            ln2 = this.querySelector(".c");
          const length1 = ln1.getTotalLength(),
            length2 = ln2.getTotalLength();
          gsap.set(ln1, {
            strokeDashoffset: length1,
            strokeDasharray: length1,
            opacity: 0,
          });
          gsap.set(ln2, {
            strokeDashoffset: length2,
            strokeDasharray: length2,
            opacity: 0,
          });

          let hw_tl = gsap.timeline({ pause: true });
          hw_tl
            .set(ln1, {
              opacity: 1,
            })
            .to(ln1, {
              strokeDashoffset: 0,
            })
            .set(ln2, {
              opacity: 1,
            })
            .to(ln2, {
              strokeDashoffset: 0,
            });

          if (isDekstop) {
            ScrollTrigger.create({
              trigger: _this,
              start: "top center",
              scrub: 1.3,
              end: "+=10%",
              animation: hw_tl,
              invalidateOnRefresh: true,
              scroller: page_container,
              // markers: true,
            });
          } else {
            ScrollTrigger.create({
              trigger: _this,
              start: "top center",
              scrub: 1.3,
              end: "+=10%",
              animation: hw_tl,
              invalidateOnRefresh: true,
              // markers: true,
            });
          }
        });
      }

      //home page section
      if ($(".after_banner").length) {
        if (isDekstop) {
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
        } else {
          gsap.to(".after_banner", {
            attr: {
              class: "after_banner active",
            },
            scrollTrigger: {
              trigger: ".after_banner",
              start: "top 80%",
              invalidateOnRefresh: true,
              // markers: true,
            },
          });
        }
      }

      //home page section
      if ($(".center_banner").length) {
        $(".center_banner .scale").addClass("hidden");
        $("#lottie").addClass("show");
        if (isDekstop) {
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
        } else {
          ScrollTrigger.create({
            trigger: ".center_banner",
            scrub: 1.3,
            start: 0,
            end: "+=100%",
            pin: true,
            // markers: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              playhead.frame = Math.round(self.progress * 100);
              if (playhead.frame > playhead.max) {
                playhead.frame = playhead.max;
              }
              // console.log(playhead.frame);
              animations.goToAndStop(playhead.frame, true);
            },
          });
        }
        $(".center_banner").parent().addClass("center_pin");
      }

      //home page section
      if ($(".full_slider_sec").length) {
        const sections = document.querySelectorAll(".full_sl_item");
        if (isDekstop) {
          const scrolling = {
            enabled: true,
            events: "scroll,wheel,touchmove,touchstart,touchend".split(","),
            prevent: (e) => {
              e.preventDefault();
              e.stopPropagation();
              return false;
            },
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

            var qq = { currentFrame: 0, end: 15 },
              clr_time;
            const playTime = 50,
              playDelay = 1000;
            qq.currentFrame = 0;
            sections[index].lottie.anim.goToAndStop(qq.currentFrame, true);
            setTimeout(() => {
              clr_time = setInterval(() => {
                if (qq.currentFrame < qq.end) {
                  // console.log("asfasfsfasfa=", qq.currentFrame);
                  sections[index].lottie.anim.goToAndStop(
                    qq.currentFrame,
                    true
                  );
                  qq.currentFrame++;
                } else {
                  clearInterval(clr_time);
                }
              }, playTime);
            }, playDelay);

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
            sections[i].lottie = {};
            sections[i].lottie.index = i;
            sections[i].lottie.id = "#" + section.querySelector(".lottie").id;
            sections[i].lottie.src = document
              .querySelector(sections[i].lottie.id)
              .getAttribute("data-lottie_src");
            sections[i].lottie.anim = lottie.loadAnimation({
              container: document.querySelector(sections[i].lottie.id),
              renderer: "svg",
              loop: false,
              autoplay: false,
              speed: 1,
              path: sections[i].lottie.src,
              rendererSettings: {
                scaleMode: "noScale",
                preserveAspectRatio: "xMidYMid meet",
                progressiveLoad: true,
              },
            });
            sections[i].lottie.anim.goToAndStop(0, true);
            // console.log(sections);

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
            end: `+=${(sections.length - 1) * 100}%`,
            scroller: page_container,
            // markers: true,
          });
          $(".full_slider_inner_wave")
            .parent()
            .addClass("full_slider_wave_pin");

          ScrollTrigger.create({
            trigger: ".all_bg",
            pin: true,
            start: "top top",
            end: `+=${(sections.length - 1) * 100}%`,
            scroller: page_container,
            // markers: true,
          });
          $(".all_bg").parent().addClass("all_bg_pin");
        }
        ///
        else {
          sections.forEach((section, i) => {
            if (i == 0) {
              ScrollTrigger.create({
                trigger: section,
                start: "top bottom",
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
                  // $(section).removeClass("active");
                  $(section).addClass("prev");
                },
                onLeaveBack: () => {
                  gsap.set($(".sl_bg").eq(i), { opacity: 0 });
                  // $(section).removeClass("active");
                  $(section).addClass("prev");
                },
              });
            } else if (i == sections.length - 1) {
              ScrollTrigger.create({
                trigger: section,
                start: "top 75%",
                end: "bottom top",
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
                  // $(section).removeClass("active");
                  $(section).addClass("prev");
                },
                onLeaveBack: () => {
                  gsap.set($(".sl_bg").eq(i), { opacity: 0 });
                  // $(section).removeClass("active");
                  $(section).addClass("prev");
                },
              });
            } else {
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
                  // $(section).removeClass("active");
                  $(section).addClass("prev");
                },
                onLeaveBack: () => {
                  gsap.set($(".sl_bg").eq(i), { opacity: 0 });
                  // $(section).removeClass("active");
                  $(section).addClass("prev");
                },
              });
            }
          });

          ScrollTrigger.create({
            trigger: ".full_slider_wrapper",
            pin: ".full_slider_inner_wave",
            start: "top top",
            end: `+=${(sections.length - 1) * 100}%`,
            // markers: true,
          });
          $(".full_slider_inner_wave")
            .parent()
            .addClass("full_slider_wave_pin");

          ScrollTrigger.create({
            trigger: ".full_slider_wrapper",
            pin: ".all_bg",
            start: "top top",
            end: `+=${sections.length * 100}%`,
            // markers: true,
          });
          $(".all_bg").parent().addClass("all_bg_pin");
        }
      }

      //ingredient page section
      if ($(".ingredients_pinner").length) {
        const sections = document.querySelectorAll(".ingredients_sl");
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
          $(sections).removeClass("up down");
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

          $(".ingredients_pinner .sl_bg").removeClass("active");
          $(".ingredients_pinner .sl_bg").eq(index).addClass("active");

          if (!$(section).hasClass("active")) {
            $(sections).removeClass("active");
            gsap.set($(sections).find(".header .char"), {
              delay: 0.5,
              opacity: 0,
              yPercent: 110,
              overwrite: true,
            });
            gsap.to($(section).find(".header .char"), {
              delay: 0.8,
              yPercent: 0,
              opacity: 1,
              stagger: 0.015,
              duration: 0.3,
            });

            gsap.set($(sections).find(".ing_item .ing_fig"), {
              delay: 0.5,
              opacity: 0,
              scale: 0,
              overwrite: true,
              attr: {
                class: "ing_fig",
              },
            });

            gsap.to($(section).find(".ing_item .ing_fig"), {
              delay: 0.8,
              scale: 1,
              opacity: 1,
              duration: 0.6,
              stagger: 0.1,
              ease: "Back.easeInOut",
              attr: {
                class: "ing_fig active",
              },
            });
            gsap.set($(sections).find(".ing_item .ing_content"), {
              delay: 0.5,
              opacity: 0,
              overwrite: true,
            });
            gsap.to($(section).find(".ing_item .ing_content"), {
              delay: 1.2,
              opacity: 1,
              stagger: 0.1,
              duration: 1,
              ease: "Power3.easeIn",
            });

            $(section).addClass("active");
          }
        }
        sections.forEach((section, i) => {
          if (isDekstop) {
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
          } else {
            ScrollTrigger.create({
              trigger: section,
              start: "top bottom-=1",
              end: "bottom top+=1",
              // markers: true,
              onEnter: () => {
                goToSection(section);
              },
              onEnterBack: () => {
                goToSection(section);
              },
            });
          }

          gsap.set($(sections).find(".ing_item .ing_fig"), {
            opacity: 0,
            scale: 0,
          });
          gsap.set($(sections).find(".ing_item .ing_content"), {
            opacity: 0,
          });

          // Second ScrollTrigger for onLeave
          if (isDekstop) {
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
            ScrollTrigger.create({
              trigger: ".full_slider_inner_wave",
              pin: true,
              start: "top top",
              end: `+=${(sections.length - 1) * 102}%`,
              scroller: page_container,
              // markers: true,
            });
          } else {
            ScrollTrigger.create({
              trigger: section,
              start: "top center",
              end: "bottom center",
              // markers: true,
              onEnter: () => {
                setAnimation(section, i, "down");
              },
              onEnterBack: () => {
                setAnimation(section, i, "up");
              },
            });
            ScrollTrigger.create({
              trigger: ".full_slider_inner_wave",
              pin: true,
              start: "top top",
              end: `+=${(sections.length - 1) * 102}%`,
              scroller: page_container,
              // markers: true,
            });
          }
        });

        $(".full_slider_inner_wave").parent().addClass("full_slider_wave_pin");
        if (isDekstop) {
          ScrollTrigger.create({
            trigger: ".all_bg",
            pin: true,
            start: "top top",
            end: `+=${(sections.length - 1) * 102}%`,
            scroller: page_container,
            // markers: true,
          });
        } else {
          ScrollTrigger.create({
            trigger: ".all_bg",
            pin: true,
            start: "top top",
            end: `+=${(sections.length - 1) * 102}%`,
            // markers: true,
          });
        }
        $(".all_bg").parent().addClass("all_bg_pin");

        gsap.to(".shape svg", {
          rotation: 360,
          ease: "none",
          duration: 25,
          repeat: -1,
          yoyo: true,
        });
        gsap.to(".shape svg path", {
          ease: "none",
          duration: 5,
          repeat: -1,
          yoyo: true,
          attr: {
            d: "M359.51 97.0023C453.603 220 419.327 304.267 344.51 361.502C269.692 418.738 87.422 377.676 28 300C-31.4219 222.324 31.6851 86.7325 106.502 29.4973C181.32 -27.738 300.088 19.3267 359.51 97.0023Z",
          },
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

            if (isDekstop) {
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
            } else {
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
                  // markers: true,
                },
              });
            }
          }

          if (pr_this.find(".parallax_el").length) {
            gsap.set(pr_this.find(".parallax_el"), {
              yPercent: -pr_val,
              scale: 1 + Math.abs(pr_val) / 90,
            });
            if (isDekstop) {
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
            } else {
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
                  // markers: true,
                },
              });
            }
          }

          if (pr_this.find("[data-rotate]").length) {
            let rotate_val = pr_this.find("[data-rotate]").attr("data-rotate");
            gsap.set(pr_this.find("[data-rotate]"), {
              rotation: -rotate_val,
            });
            if (isDekstop) {
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
                  scroller: page_container,
                  // markers: true,
                },
              });
            } else {
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
                  // markers: true,
                },
              });
            }
          }

          if (pr_this.find("[data-pr]").length) {
            pr_this.find("[data-pr]").each(function (q, pr) {
              let vl = $(pr).attr("data-pr");
              if (isDekstop) {
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
                    scroller: page_container,
                    // markers: true,
                  },
                });
              } else {
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
                    // markers: true,
                  },
                });
              }
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
            if (isDekstop) {
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
            } else {
              gsap.to($(el).find(".char"), {
                yPercent: 0,
                opacity: 1,
                stagger: 0.015,
                duration: 0.3,
                scrollTrigger: {
                  trigger: el,
                  start: "top 85%",
                  end: "+=100%",
                  // markers: true,
                },
              });
            }
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

      //large text revel anim
      if ($(".header_float").length) {
        $(".header_float").each(function (i, el) {
          gsap.set(el, {
            yPercent: 100,
            opacity: 0,
          });
          if (isDekstop) {
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
          } else {
            gsap.to(el, {
              yPercent: 0,
              opacity: 1,
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                end: "+=100%",
                // markers: true,
              },
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
              if (isDekstop) {
                gsap.to(_this.find(">*"), {
                  stagger: 0.5,
                  opacity: 1,
                  yPercent: 0,
                  duration: 1,
                  ease: "Back.easeOut",
                  scrollTrigger: {
                    trigger: _this,
                    start: "top 75%",
                    scroller: page_container,
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
                  scrollTrigger: {
                    trigger: _this,
                    start: "top 85%",
                    //  markers: true,
                  },
                });
              }
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
              if (isDekstop) {
                gsap.to(_this.find(">*"), {
                  stagger: 0.3,
                  opacity: 1,
                  yPercent: 0,
                  duration: 1,
                  ease: "Power2.easeOut",
                  scrollTrigger: {
                    trigger: _this,
                    start: "top 80%",
                    scroller: page_container,
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
                  scrollTrigger: {
                    trigger: _this,
                    start: "top 95%",
                    //  markers: true,
                  },
                });
              }
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
              if (isDekstop) {
                gsap.to(_this.find(">*"), {
                  stagger: 0.1,
                  opacity: 1,
                  xPercent: 0,
                  duration: 1,
                  ease: "Back.easeOut",
                  scrollTrigger: {
                    trigger: _this,
                    start: "top 80%",
                    scroller: page_container,
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
                  scrollTrigger: {
                    trigger: _this,
                    start: "top 95%",
                    //  markers: true,
                  },
                });
              }
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

      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
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

    function getDeg(el) {
      let v = window.getComputedStyle(el, null).getPropertyValue("background");
      let pos = v.indexOf("deg");
      let pre = v.slice(0, pos - 2),
        post = v.slice(pos, v.length),
        deg = v.slice(pos - 2, pos),
        sign = 0;
      if (deg >= 0) {
        sign = 1;
      }
      // console.log({sign,pre,deg,post});
      return { sign, pre, deg, post };
    }

    if (isDekstop) {
      loco_scroll.on("scroll", (args) => {
        // console.log(args);
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
    //end page Js

    //end ready

    //// page loader

    jQuery(".bg,img:not([data-src]),video,canvas")
      // jQuery("body")
      .imagesLoaded({
        background: true,
      })
      // .progress(function (instance, image) {})
      .always(function () {
        gsap.set(page_container, {
          opacity: 1,
        });
        if ($("#lottie").length) {
          animations.addEventListener("DOMLoaded", function () {
            setTimeout(() => {
              loadInit();
            }, 2000);
          });
        } else {
          setTimeout(() => {
            loadInit();
          }, 2000);
        }
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
      imagesLoaded(images);
      ScrollTrigger.refresh();
    });
  }
}
