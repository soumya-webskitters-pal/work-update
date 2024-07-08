"use strict";
// Detect Safari
if (
  navigator.userAgent.indexOf("Safari") > -1 &&
  navigator.userAgent.indexOf("Chrome") <= -1
) {
  document.body.classList.add("safari_browser");
}

// Configure GSAP's non-tween-related settings
gsap.config({
  autoSleep: 60,
  force3D: true,
  nullTargetWarn: false,
  trialWarn: false,
  units: { left: "px", top: "px", rotation: "deg" },
});

jQuery.noConflict()(function ($) {
  /* CODE */
  
  // var Webflow = Webflow || [];
  // Webflow.push(function () {
  //   $(".nav-dropdown-toggle").click(function (event) {
  //     event.stopPropagation();
  //     if ($(".main-head").hasClass("active")) {
  //       $(".main-head").removeClass("active");
  //     } else {
  //       $(".main-head").addClass("active");
  //     }
  //   });
  //   $(".nav--toggle").on("click", function () {
  //     $(this).toggleClass("open");
  //   });
  //   /* cursor start*/
  //   /*
  //   if ($(window).width() >= 992 && $(".cursor").length) {
  //     $(document).mousemove(function (e) {
  //       $(".cursor")
  //         .eq(0)
  //         .css({
  //           left: e.pageX,
  //           top: e.pageY - $(window).scrollTop(),
  //         });
  //     });
  //     $("a")
  //       .mouseenter(function () {
  //         $(".cursor").addClass("hover");
  //       })
  //       .mouseleave(function () {
  //         $(".cursor").removeClass("hover");
  //       });
  //   }*/
  //   /* cursor end*/
  //   /* gsap animation start*/
  //   if ($(".reveal").length) {
  //     var reveal = gsap.utils.toArray(".reveal");
  //     reveal.forEach((elem, i) => {
  //       ScrollTrigger.create({
  //         trigger: elem,
  //         start: "top 50%",
  //         end: "+=50%",
  //         pin: false,
  //         scrub: 1,
  //         onEnter() {
  //           elem.classList.add("play-reveal");
  //         },
  //       });
  //     });
  //   }
  //   /* gsap animation end*/
  //   /* slider nav slider for start*/
  //   if ($(".slider-nav").length && $(".slider-for").length) {
  //     $(".slider-nav").on("init", function (event, slick) {
  //       // Check if there are any slides
  //       if (slick.slideCount <= 1) {
  //         $(".prev-arrows").addClass("slick-disabled");
  //       }
  //     });
  //     $(".slider-for").slick({
  //       slidesToShow: 1,
  //       slidesToScroll: 1,
  //       infinite: false,
  //       arrows: false,
  //       fade: true,
  //       asNavFor: ".slider-nav",
  //     });
  //     $(".slider-nav").slick({
  //       slidesToShow: 1,
  //       infinite: false,
  //       slidesToScroll: 1,
  //       asNavFor: ".slider-for",
  //       dots: false,
  //       focusOnSelect: true,
  //       prevArrow: ".prev-arrows",
  //       nextArrow: ".next-arrows",
  //     });
  //   }
  //   /* slider nav slider for end*/
  //   /* accordian start*/
  //   if ($(".service-accordian-head").length) {
  //     $(".service-accordian-head").click(function () {
  //       $(this).next().stop(true, true).slideToggle();
  //       $(this).parent().toggleClass("active");
  //       $(this)
  //         .parent(".service-accordian-item")
  //         .siblings()
  //         .removeClass("active");
  //       $(this)
  //         .parents(".service-accordian-wrapper")
  //         .siblings()
  //         .find(".service-accordian-item")
  //         .removeClass("active");
  //       $(this)
  //         .parent(".service-accordian-item")
  //         .siblings()
  //         .find(".service-accordian-con")
  //         .slideUp();
  //       $(this)
  //         .parents(".service-accordian-wrapper")
  //         .siblings()
  //         .find(".service-accordian-con")
  //         .slideUp();
  //     });
  //   }
  //   /* accordian end */
  // });
  
});

window.onbeforeunload = function () {
  window.history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
};
