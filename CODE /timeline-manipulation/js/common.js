jQuery(document).ready(function ($) {
  // document start

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

  $(window).on("resize", function () {
    if ($(this).width() < 1025) {
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
  });
  // Navbar end

  /* ===== For menu animation === */
  $(".navbar-toggler").click(function () {
    $(".navbar-toggler").toggleClass("open");
    $(".navbar-toggler .stick").toggleClass("open");
    $("body,html").toggleClass("open-nav");
  });

  // Navbar end

  // to make sticky nav bar
  $(window).scroll(function () {
    var scroll = $(window).scrollTop();
    if (scroll > 20) {
      $(".main-head").addClass("fixed");
    } else {
      $(".main-head").removeClass("fixed");
    }
  });

  // smooth scroll to any section
  // if($('a.scroll').length){
  //     $("a.scroll").on('click', function(event) {
  //       if (this.hash !== "") {
  //         event.preventDefault();
  //         var target = this.hash, $target = $(target);
  //         $('html, body').animate({
  //           scrollTop: $target.offset().top - 60
  //         }, 800, function(){
  //           window.location.href.substr(0, window.location.href.indexOf('#'));
  //         });
  //       }
  //     });

  //   }

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

  // one page scroll menu link
  // $('a[href*="#"]').on('click', function (e) {
  //     e.preventDefault();
  //     $(document).off("scroll");
  //     $('.navbar-nav > li > a').each(function () {
  //         $(this).parent('li').removeClass('current-menu-item');
  //     });
  //     $(this).parent('li').addClass('current-menu-item');
  //     var target = this.hash, $target = $(target);
  //     $('html, body').stop().animate({
  //         'scrollTop': $target.offset().top
  //     }, 500, 'swing', function () {
  //         window.location.href.substr(0, window.location.href.indexOf('#'));
  //         $(document).on("scroll", onScroll);
  //     });
  // });
  //  $(document).on("scroll", onScroll);
  // function onScroll(event){
  //     var scrollPos = $(document).scrollTop() + 100;
  //     $('.navbar-nav > li > a').each(function () {
  //         var currLink = $(this);
  //         var refElement = $(currLink.attr("href"));
  //         if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
  //             $('.navbar-nav > li').removeClass("current-menu-item");
  //             currLink.parent('li').addClass("current-menu-item");
  //         }
  //         else{
  //             currLink.parent('li').removeClass("current-menu-item");
  //         }
  //     });
  // }

  // slick slider

  $(".home-scnd-sec-slider").slick({
    rows: 2,
    dots: true,
    arrows: false,
    infinite: true,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: true,
    adaptiveHeight: true,
    centerPadding: "0px",
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  });

  $(".home-middle-unname-slidermain").slick({
    dots: true,
    arrows: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: true,
    adaptiveHeight: true,
    centerPadding: "0",
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  });

  $(".slider-right-upskill-slider").slick({
    dots: false,
    arrows: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: true,
    adaptiveHeight: true,
    centerPadding: "0px",
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  });

  ///////// equal height ////////
  // function equal_height() {
  //     $('.home-fourthcart-crtWrap').matchHeight({ property: 'min-height' });
  //   }
  //   equal_height();
  //   $(window).on('load', function (event) {
  //     equal_height();
  //   });
  //   $(window).resize(function (event) {
  //     equal_height();
  //   });

  //// accordion item active js ////
  // $(".faq_sec hr").first().addClass("hidee");
  // $('.faq_sec .accordion-collapse').on('show.bs.collapse', function () {
  //   $(this).parents(".accordion-item").addClass('activelink');
  //   $(this).parents(".accordion-item").next("hr").addClass("hidee");
  // });
  // $('.faq_sec .accordion-collapse').on('hide.bs.collapse', function () {
  // $(this).parents(".accordion-item").removeClass('activelink');
  // $(this).parents(".accordion-item").next("hr").removeClass("hidee");
  // });

  equalheight = function (container) {
    var currentTallest = 0,
      currentRowStart = 0,
      rowDivs = new Array(),
      jQueryel,
      topPosition = 0;
    jQuery(container).each(function () {
      jQueryel = jQuery(this);
      jQuery(jQueryel).height("auto");
      topPostion = jQueryel.position().top;
      if (currentRowStart != topPostion) {
        for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
          rowDivs[currentDiv].height(currentTallest);
        }
        rowDivs.length = 0;
        currentRowStart = topPostion;
        currentTallest = jQueryel.height();
        rowDivs.push(jQueryel);
      } else {
        rowDivs.push(jQueryel);
        currentTallest =
          currentTallest < jQueryel.height()
            ? jQueryel.height()
            : currentTallest;
      }
      for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
        rowDivs[currentDiv].height(currentTallest);
      }
    });
  };

  $(window).on("load", function (event) {
    equalheight(".wrapitem-txtcrtmatch");
  });

  // jQuery(window).scroll(function () {
  //     equalheight('.wrapitem-txtcrtmatch');
  // });
  jQuery(window).resize(function () {
    equalheight(".wrapitem-txtcrtmatch");
  });
  jQuery(document).ajaxSuccess(function () {
    equalheight(".wrapitem-txtcrtmatch");
  });

  //Horizontal Tab
  $("#parentHorizontalTab").easyResponsiveTabs({
    type: "default", //Types: default, vertical, accordion
    width: "auto", //auto or any width like 600px
    fit: true, // 100% fit in a container
    tabidentify: "hor_1", // The tab groups identifier
    activate: function (event) {
      // Callback function if tab is switched
      var $tab = $(this);
      var $info = $("#nested-tabInfo");
      var $name = $("span", $info);
      $name.text($tab.text());
      $info.show();
    },
  });

  $(".accordion-item").on("show.bs.collapse hide.bs.collapse", function (e) {
    if (e.type == "show") {
      $(this).addClass("active");
    } else {
      $(this).removeClass("active");
    }
  });

  // more less js

  $(".moreless-button").click(function () {
    $(".moretext").slideToggle();
    if ($(".moreless-button").text() == "Read less") {
      $(this).text("Read more");
    } else {
      $(this).text("Read less");
    }
  });
  $(".moreless-button").click(function () {
    $(this).toggleClass("less");
  });

  //// circle -progress animation
  if ($(".stickyBlueSec").length) {
    gsap.registerPlugin(ScrollTrigger);

    let parent = $(".stickyBlueSec"),
      content_elements = $(".animate_content"),
      line_elements = $(".path_shape path"),
      number_elements = $(".num_list li");

    //set content Height
    let maxHeight = 0;

    function w_resize() {
      content_elements.each((idx, el) => {
        if (maxHeight < el.clientHeight) {
          maxHeight = el.clientHeight;
        }
      });
      content_elements.parent().height(maxHeight);
    }
    w_resize();
    window.addEventListener("resize", w_resize);

    content_elements.each((idx, el) => {
      gsap.set(el, {
        opacity: 0,
        yPercent: 100,
      });
      if (idx == 0) {
        gsap.set(el, {
          opacity: 1,
          yPercent: 0,
        });
        gsap.set(number_elements.eq(0).find("a"), {
          background: "#ffffff",
          color: "#1d7bff",
        });
      }
    });

    //draw line
    line_elements.each((i_cnt, el) => {
      let length = el.getTotalLength();
      $(el).attr("data-offset", length + 1);
      $(el).css({
        "stroke-dasharray": length + 1,
        "stroke-dashoffset": length + 1,
        opacity: 1,
      });
    });

    let slider_tl = gsap.timeline(),
      time = 0.7,
      delay = 1,
      timelineAr = [],
      currentSl = 0;

    slider_tl.addLabel("timeLabel0", 0);
    timelineAr.push(0);
    content_elements.each((idx, el) => {
      if (idx != 0) {
        slider_tl
          .to(content_elements.get(idx), {
            delay: delay,
            duration: time,
            opacity: 1,
            yPercent: 0,
          })
          .to(
            content_elements.get(idx - 1),
            {
              duration: time,
              opacity: 0,
              yPercent: -100,
            },
            "-=" + time
          )
          .to(
            line_elements.get(idx - 1),
            {
              duration: time,
              strokeDashoffset: 0,
              onComplete: () => {
                currentSl = idx;
                // console.log(currentSl);
              },
            },
            "-=" + time
          )
          .to(number_elements.eq(idx).find("a"), {
            duration: time / 2,
            background: "#ffffff",
            color: "#1d7bff",
          })
          .to(number_elements.eq(idx).find("a"), {
            duration: time,
            opacity: 1,
          });
        let tot_time = (delay + time + time / 2 + time) * idx;
        slider_tl.addLabel("timeLabel" + idx, tot_time);
        timelineAr.push(tot_time);
      }
    });
    slider_tl.pause();
    // slider_tl.smoothChildTiming = true;

    // console.log(slider_tl, timelineAr);

    ScrollTrigger.create({
      trigger: parent,
      //pin: true,
      start: "top " + $(".main-head").get(0).clientHeight + "px top",
      invalidateOnRefresh: true,
      end: "bottom " + $(".main-head").get(0).clientHeight + "px center",
      // markers: true,
      onEnter: () => {
        slider_tl.restart();
      },
      onEnterBack: () => {
        slider_tl.reverse();
      },
      onLeave: () => {
        slider_tl.totalProgress(1).pause();
      },
    });

    number_elements.each((idx, el) => {
      $(el).on("click", (_this) => {
      //  slider_tl.pause();
        // console.log("::::", Math.abs(currentSl - idx));
        if (Math.abs(currentSl - idx) > 1) {
          slider_tl.seek("timeLabel" + idx).pause();
        } else {
          gsap.fromTo(
            slider_tl,
            2,
            { time: timelineAr[currentSl]-0.3 },
            {
              time: timelineAr[idx]+0.3,
              ease: Linear.easeNone,
              onComplete: () => {
                slider_tl.pause();
              },
            }
          );
        }
        currentSl = idx;
      });
    });
  }
  // document end
});
