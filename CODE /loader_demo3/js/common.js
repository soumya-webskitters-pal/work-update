"use strict";

jQuery.noConflict()(function ($) {
  // document start

  //loader
  let n_path = $(".small_logo path");
  n_path.each(function (i_cnt) {
    let cur_el = n_path.get(i_cnt);
    let length = cur_el.getTotalLength();
    $(this).css({
      "stroke-dasharray": length + 1,
      "stroke-dashoffset": length + 1,
      opacity: 1,
    });
  });

  Splitting({ target: ".logoname", by: "chars" });
  gsap.set(".logoname_inner>.word", {
    display: "inline-block",
    transformOrigin: "center center",
    backfaceVisibility: "hidden",
    visibility: "hidden",
    // overflow: "hidden",
    width: 0,
  });
  gsap.set(".logoname_inner>.word .char", {
    transformOrigin: "center center",
    backfaceVisibility: "hidden",
    opacity: 0,
    xPercent: 120,
  });

  Splitting({ target: ".logo_catch", by: "chars" });
  $(".logo_catch .whitespace").append("&nbsp;");
  gsap.set(".logo_catch", {
    overflow: "hidden",
  });
  gsap.set(".logo_catch .word", {
    display: "inline-block",
    yPercent: 120,
    transformOrigin: "bottom center",
    backfaceVisibility: "hidden",
    opacity: 0,
    visibility: "hidden",
  });

  gsap.set(".logoname_inner .mainCap", { opacity: 0, display: "inline-block" });

  let loader_tl = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 1 });
  loader_tl.to(".small_logo path", {
    strokeDashoffset: 0,
    duration: 2,
    ease: "Power2.easeIn",
  });

  function pageloader() {
    loader_tl.pause();
    gsap.set([".logoname", ".logo_catch"], { opacity: 1 });
    gsap
      .timeline()
      .to(".small_logo path", {
        strokeDashoffset: 0,
        duration: 2,
        ease: "Power2.easeIn",
      })
      .to(".small_logo path", {
        duration: 1,
        fill: "#5c2c86",
        ease: "Power0.ease",
      })
      .to(".small_logo svg", {
        delay: 0.3,
        duration: 0.5,
        opacity: 0,
        scale: 0.3,
        ease: "Power0.ease",
      })
      .to(
        ".logoname_inner .mainCap",
        {
          duration: 0.3,
          opacity: 1,
          ease: "Power0.ease",
        },
        "-=0.3"
      )
      .to(".logoname_inner .word", {
        duration: 1,
        visibility: "visible",
        width: "auto",
      })
      .to(
        ".logoname_inner>.word .char",
        {
          duration: 1,
          xPercent: 0,
          opacity: 1,
        },
        "-=1"
      )
      .to(
        ".loader_bg",
        {
          duration: 0.5,
          opacity: 1,
          OnComplete: () => {
            $(".logo_catch").addClass("show");
          },
        },
        "-=0.5"
      )
      .to(".logo_catch .word", {
        duration: 0.5,
        opacity: 1,
        yPercent: 0,
        visibility: "visible",
        stagger: 0.05,
      });
  }

  //// page loader
  setTimeout(() => {
    jQuery(".bg_img,img,video")
      .imagesLoaded({
        background: true,
      })
      //.progress(function (instance, image) {})
      .always(pageloader);
  }, 500);
  // document end
});
