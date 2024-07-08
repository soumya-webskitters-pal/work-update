"use strict";

//// reset scroll position:
window.history.scrollRestoration = "manual";
window.scrollTo(0, 0);

//remove slug on load
// if (window.location.hash.length > 0) {
//   window.location.href = window.location.origin + window.location.pathname;
// }

jQuery.noConflict()(function ($) {
  function pageloader() {
    $(".page_loader").addClass("show");
    Reveal.initialize({
      mouseWheel: true,
      touch: true,
    });
  }

  Reveal.initialize({
    margin: 0,
    disableLayout: true,
    overview: false,
    slideNumber: false,
    center: false,
    postMessage: false,
    keyboard: true,
    controls: false,
    controlsLayout: "bottom-right",
    help: false,
    progress: false,
    history: false,
    fragments: true,
    fragmentInURL: true,
    transition: "slide",
    hideInactiveCursor: false,
    autoPlayMedia: true,
    viewDistance: 2,
    jumpToSlide: true,
    mouseWheel: false,
    touch: false,
    dependencies: [
      {
        src: "https://unpkg.com/splitting@1.0.6/dist/splitting.min.js",
        async: true,
      },
      { src: "js/bootstrap.bundle.min.js", async: true },
      { src: "js/slick.min.js", async: true },
      {
        src: "https://unpkg.com/imagesloaded@4/imagesloaded.pkgd.min.js",
        async: true,
      },
    ],
  });

  //after Reveal init
  Reveal.initialize().then((event) => {
    //console.log(event);

    //create background
    let bg = $("<div class='page_background' id='pg_background'></div>");
    bg.appendTo("#reveal_slide");
    $("#reveal_slide section.bg_section").each(function (idx) {
      $(this).attr("data-bg_target", idx);
      if ($(this).attr("data-background-images") != undefined) {
        if ($(this).attr("data-background-videos") != undefined) {
          let el = $(
            "<div class='bg_item bg_video " +
              $(this).attr("class").split(/\s+/)[0] +
              "' style='background-image:url(" +
              $(this).attr("data-background-images") +
              ")' " +
              " data-bg_link='" +
              idx +
              "' ><video loop autoplay muted playsinline><source src='" +
              $(this).attr("data-background-videos") +
              ".webm' type='video/webm' codecs='vp8, vorbis'/><source src='" +
              $(this).attr("data-background-videos") +
              ".mp4' type='video/mp4'/>Your browser does not support the video element.</video></div>"
          );
          el.appendTo(bg);
        } else {
          $(
            "<div class='bg_item bg_img " +
              $(this).attr("class").split(/\s+/)[0] +
              "' style='background-image:url(" +
              $(this).attr("data-background-images") +
              ")' data-bg_link='" +
              idx +
              "'></div>"
          ).appendTo(bg);
        }
      } else if ($(this).attr("data-background-colors") != undefined) {
        $(
          "<div class='bg_item bg_color " +
            $(this).attr("class").split(/\s+/)[0] +
            "' style='background-color:" +
            $(this).attr("data-background-colors") +
            "' data-bg_link='" +
            idx +
            "'></div>"
        ).appendTo(bg);
      } else {
        $(
          "<div class='bg_item bg_none" +
            $(this).attr("class").split(/\s+/)[0] +
            "' data-bg_link='" +
            idx +
            "'></div>"
        ).appendTo(bg);
      }
    });
    let cr_el = bg.find(
      ">div:eq(" + $(event.currentSlide).attr("data-bg_target") + ")"
    );
    cr_el.addClass("present");
    gsap.set(cr_el, {
      opacity: 1,
      visibility: "visible",
    });

    setTimeout(() => {
      if ($(".bg_item.bg_video video").length && $("video").attr("autoplay")) {
        $("video[autoplay]").each((i, el) => {
          el.play();
        });
      }
    }, 100);
  });

  //action on slide change
  Reveal.addEventListener("slidechanged", function (event) {
    //event.previousSlide, event.currentSlide, event.indexh, event.indexv
  });

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
