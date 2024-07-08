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

//smooth scroll for desktop
const lenis = new Lenis({
  smooth: true,
  infinite: false,
  lerp: 0,
  smoothWheel: true,
  smoothTouch: true,
  syncTouch: true,
});
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

var loaderTl = gsap.timeline({
  repeat: -1,
  repeatDelay: 0,
});

imagesLoaded(document.body, { background: true }, () => {
  gsap.registerPlugin(ScrollTrigger, CSSRulePlugin);

  requestAnimationFrame(raf);
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
  ScrollTrigger.clearScrollMemory();
  const refresh = () => {
    window.history.scrollRestoration = "manual";
    ScrollTrigger.refresh(true);
  };
  refresh();
  window.addEventListener("resize", refresh);

  //page ready
  afterPageLoad();
  //end script
});

//page scripts
function afterPageLoad() {
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

  if ($(".banner").length) {
    function addGap() {
      document.querySelector(".banner").style.paddingTop =
        document.querySelector(".main-head").clientHeight + "px";
    }
    addGap();
    window.addEventListener("resize", addGap);
    window.addEventListener("scroll", addGap);
  }

  gsap.to("#loader", {
    delay: 0.5,
    opacity: 0,
    duration: 1,
    onComplete: () => {
      loaderTl.kill();
      $("#loader").remove();
      enableScroll();

      nav_timeline.pause().restart();
      $(".main-head").addClass("show active");

      setTimeout(() => {
        ScrollTrigger.refresh(true);
        window.scrollTo(0, 0);
      }, 200);
    },
  });

  //active section in viewport
  if ($(".section").length) {
    ScrollOut({
      targets: ".section",
      threshold: 0.5,
      onShown: function (el) {
        el.classList.add("active");
      },
      onHidden: function (el) {
        el.classList.remove("active");
      },
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

  //slider
  if ($(".Homepage_banner_slider").length) {
    $(".Homepage_banner_slider").slick({
      dots: false,
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      slidesToScroll: 1,
      prevArrow: ".slick_custom_prev",
      nextArrow: ".slick_custom_next",
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 2,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    });
  }
}

// jQuery(document).ready(function ($) {
// });
