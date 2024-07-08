"use strict";

jQuery(document).ready(function () {
  //// toggle menu for mobile
  jQuery('.navbar-toggler').click(function () {
    jQuery(this).toggleClass('open');
  });


  //// wordpress menu open
  jQuery("<span class='clickD'></span>").insertAfter(
    '.navbar-nav li.menu-item-has-children > a'
  );


  if (jQuery(window).width() <= 991) {
    $('.navbar-nav li .clickD').click(function (e) {
      e.preventDefault();
      let $this = $(this);

      if ($this.next().hasClass('show')) {
        $this.next().removeClass('show');
        $this.removeClass('toggled');
        $this.next().hide();
      } else {
        $this.parent().parent().find('.sub-menu').removeClass('show');
        $this.parent().parent().find('.toggled').removeClass('toggled');
        $this.parent().parent().find('.sub-menu').hide();
        $this.next().toggleClass('show');
        $this.toggleClass('toggled');
        $this.next().show();
      }
    });

    $('html').click(function () {
      $('.navbar-nav li .clickD').removeClass('toggled');
    });
    $(document).click(function () {
      $('.navbar-nav li .clickD').removeClass('toggled');
    });
    $('.navbar-nav').click(function (e) {
      e.stopPropagation();
    });
  }

  jQuery(window).scroll(function () {
    if (jQuery(window).scrollTop() > 1) {
      jQuery(".main_nav").addClass('sticky');
    } else {
      jQuery(".main_nav").removeClass('sticky');
    }
  });

  //// mouse click to ripple effect
  $(".search_btn, .cst_btn.green_hr_light_gradient").addClass("green_ripple");
  $(".cart_btn, .cst_btn.blue_hr_gradient ").addClass("blue_ripple");
  $('.green_ripple').ripple({
    speed: 100,
    color: '#53a444'
  });
  $('.blue_ripple').ripple({
    speed: 100,
    color: '#0097ba'
  });


  //// banner_slide
  if ($(".banner_slide").length) {
    $(".banner_bg_sl").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      speed: 1000,
      arrows: false,
      dots: false,
      infinite: true,
      pauseOnHover: false,
      pauseOnFocus: false,
      fade: true,
      asNavFor: '.banner_slide'
    });
    $(".banner_img_box_sl").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      speed: 1000,
      arrows: false,
      dots: false,
      infinite: true,
      pauseOnHover: false,
      pauseOnFocus: false,
      fade: true,
      adaptiveHeight: false,
      asNavFor: '.banner_slide',
      responsive: [
        {
          breakpoint: 575,
          settings: {
            adaptiveHeight: true,
          }
        },
      ]
    });
    $(".banner_slide").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      speed: 1500,
      autoplay: true,
      autoplaySpeed: 10000,
      arrows: false,
      dots: true,
      infinite: true,
      pauseOnHover: false,
      pauseOnFocus: false,
      fade: true,
      asNavFor: '.banner_bg_sl, .banner_img_box_sl'
    });

    // On before slide change setup elements
    let $split_text = $(".banner_slide_item label");
    $split_text.html($split_text.html().replace(/./g, "<span>$&</span>").replace(/\s/g, "&nbsp;"));
    function set() {
      let myv = 0;
      if ($(".banner_img_box_item").length) {
        $(".banner_img_box_item").each(function () {
          if (myv < $(this).height()) {
            myv = $(this).height();
          }
        });
        $(".banner_img_box_item").height(myv);
      }

      gsap.set($(".banner_img_box_item"), {
        scale: 0,
        opacity: 0,
        transformOrigin: "50% 50%",
      });
      gsap.set($(".banner_slide_item h1"), {
        x: "-100%",
        opacity: 0,
        transformOrigin: "50% 50%",
      });
      gsap.set($(".banner_slide_item label").children(), {
        display: "inline-block",
        opacity: 0,
        x: -50,
        transformOrigin: "50% 50%",
      });
      gsap.set($(".banner_slide_item p"), {
        y: "100%",
        opacity: 0,
        transformOrigin: "50% 50%",
      });
      gsap.set($(".banner_slide_item .banner_btn_group"), {
        y: "100%",
        opacity: 0,
        transformOrigin: "50% 50%",
      });
    }
    set();
    // first print on screen
    gsap.set($(".banner_img_box_item:eq(0)"), {
      scale: 1,
      opacity: 1,
    });
    gsap.set($(".banner_slide_item:eq(0) h1"), {
      x: 0,
      opacity: 1,
    });
    $split_text = $(".banner_slide_item:eq(0) label");
    gsap.set($split_text.children(), {
      x: 0,
      opacity: 1,
    });
    gsap.set($(".banner_slide_item:eq(0) p"), {
      opacity: 1,
      y: 0,
    });
    gsap.set($(".banner_slide_item:eq(0) .banner_btn_group"), {
      y: 0,
      opacity: 1,
    });

    $(".banner_slide").on('afterChange', function (event, slick, currentSlide) {
      set();
      gsap.to($(".banner_img_box_item:eq(" + currentSlide + ")"), 0.6, {
        scale: 1,
        opacity: 1,
      });
      gsap.to($(".banner_slide_item:eq(" + currentSlide + ") h1"), 1, {
        x: 0,
        opacity: 1,
        delay: 0.6,
      });
      $split_text = $(".banner_slide_item:eq(" + currentSlide + ") label");
      gsap.to($split_text.children(), 0.25, {
        stagger: 0.02,
        x: 0,
        opacity: 1,
        delay: 1.6,
      });
      gsap.to($(".banner_slide_item:eq(" + currentSlide + ") p"), 1, {
        opacity: 1,
        y: 0,
        delay: 2.6,
      });
      gsap.to($(".banner_slide_item:eq(" + currentSlide + ") .banner_btn_group"), 1, {
        y: 0,
        opacity: 1,
        delay: 3.6,
      });
    });
    $(".banner_slide").on('beforeChange', function (event, slick, currentSlide, nextSlide) {
      gsap.to($(".banner_img_box_item:eq(" + currentSlide + ")"), 0.5, {
        scale: 0,
        opacity: 0,
      });
      gsap.to($(".banner_slide_item:eq(" + currentSlide + ") h1"), 0.5, {
        x: "-100%",
        opacity: 0,
      });
      $split_text = $(".banner_slide_item:eq(" + currentSlide + ") label");
      gsap.to($split_text.children(), 0.15, {
        stagger: 0.02,
        x: -50,
        opacity: 0,
      });
      gsap.to($(".banner_slide_item:eq(" + currentSlide + ") p"), 0.5, {
        opacity: 0,
        y: "100%",
      });
      gsap.to($(".banner_slide_item:eq(" + currentSlide + ") .banner_btn_group"), 0.5, {
        y: "100%",
        opacity: 0,
      });
    });
  }


  //// mountain_slide
  if ($(".m_slider").length) {
    $(".m_slider").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      speed: 1000,
      autoplay: false,
      arrows: true,
      dots: false,
      infinite: true,
      pauseOnHover: false,
      pauseOnFocus: false,
      fade: true,
      nextArrow: $(".goto_nxt"),
      prevArrow: $(".goto_prev"),
      asNavFor: '.connect_img_slider'
    });
    $(".connect_img_slider").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      speed: 1000,
      autoplay: false,
      arrows: false,
      dots: false,
      infinite: true,
      pauseOnHover: false,
      pauseOnFocus: false,
      fade: true,
      asNavFor: '.m_slider'
    });
    // On before slide change
    gsap.set($(".m_slider .m_item").children(), {
      translateY: "100%",
      opacity: 0,
    });
    gsap.to($(".m_slider .m_item:eq(0)").children(), 1, {
      stagger: 0.2,
      translateY: 0,
      opacity: 1,
      ease: Back.easeOut,
    });

    //line
    let n_path = $('#mountain_line_progress path');
    n_path.each(function (i_cnt) {
      let cur_el = n_path.get(i_cnt);
      let length = cur_el.getTotalLength();
      $(this).css({
        'stroke-dasharray': length + 1,
        'stroke-dashoffset': length + 1,
        'opacity': 1,
      });
    });
    gsap.set("#sun", {
      top: "35%",
      right: "20%",
      opacity: 0,
    });
    gsap.set("#m_1 path", {
      strokeDashoffset: 0,
    })

    let tl1 = new TimelineMax({ paused: true, });
    tl1
      .to("#m_1 path", {
        strokeDashoffset: 0,
      }, "path0")
      .addPause()
      .to("#m_2 path", {
        strokeDashoffset: 0,
      }, "path1")
      .addPause()
      .to("#m_3 path", {
        strokeDashoffset: 0,
      }, "path2")
      .addPause()
      .to("#m_4 path", {
        strokeDashoffset: 0,
      }, "path3")
      .addPause()
      .to("#m_5 path", {
        strokeDashoffset: 0,
      }, "path4")
      .addPause()
      .to("#m_6 path", {
        strokeDashoffset: 0,
      }, "path5")
      .addPause();

    let tl2 = new TimelineMax({ paused: true, }), _sun = document.getElementById("sun");
    tl2
      .to(_sun, {
        top: "35%",
        right: "20%",
        opacity: 0,
      }, "label0")
      .addPause()
      .to(_sun, {
        top: "33%",
        right: "21%",
        opacity: 0.1,
      }, "label1")
      .addPause()
      .to(_sun, {
        top: "28%",
        right: "18%",
        opacity: 0.3,
      }, "label2")
      .addPause()
      .to(_sun, {
        top: "20%",
        right: "15%",
        opacity: 0.6,
      }, "label3")
      .addPause()
      .to(_sun, {
        top: "15%",
        right: "13%",
        opacity: 1,
      }, "label4")
      .addPause()
      .to(_sun, {
        top: "12%",
        right: "12%",
        opacity: 1,
      }, "label5")
      .addPause();

    $(".m_slider").on('afterChange', function (event, slick, curtSl) {
      // console.log("after:", curtSl);
      gsap.set($(".m_slider .m_item").children(), {
        translateY: "100%",
        opacity: 0,
      });
      gsap.to($(".m_slider .m_item:eq(" + curtSl + ")").children(), 1.5, {
        stagger: 0.2,
        translateY: 0,
        opacity: 1,
        ease: Back.easeOut,
      });
    });
    $(".m_slider").on('beforeChange', function (event, slick, curtSl, nextSlide) {
      // console.log("before:", curtSl, nextSlide);
      gsap.to($(".m_slider .m_item:eq(" + curtSl + ")").children(), 1, {
        stagger: 0.2,
        translateY: "100%",
        opacity: 0,
        ease: Back.easeOut,
      });

      if (nextSlide == 0) {
        tl1.reverse("path0");
        tl2.reverse("label0");
      }
      else {
        if (curtSl > nextSlide) {
          tl1.reverse();
          tl2.reverse();
          // console.log("backword");
        }
        else {
          tl1.play("path" + nextSlide);
          tl2.play("label" + nextSlide);
          // console.log("forword");
        }
      }
    });
  }


  //// animate section
  blockRevel();
  function blockRevel() {
    if ($(".gs_reveal").length) {
      function animateFrom(elem, direction) {
        direction = direction | 1;

        let x = 0,
          y = direction * 100;
        if (elem.classList.contains("gs_reveal_fromLeft")) {
          x = -100;
          y = 0;
        } else if (elem.classList.contains("gs_reveal_fromRight")) {
          x = 100;
          y = 0;
        }
        else if (elem.classList.contains("gs_reveal_fromBottom")) {
          x = 0;
          y = 100;
        }
        gsap.fromTo(elem, { x: x, y: y, autoAlpha: 0 }, {
          duration: 1.5,
          x: 0,
          y: 0,
          autoAlpha: 1,
          ease: "Power1.easeOut",
          overwrite: "auto"
        });
      }
      function hide(elem) {
        gsap.set(elem, { autoAlpha: 0 });
      }
      // document.addEventListener("DOMContentLoaded", function () {
      gsap.utils.toArray(".gs_reveal").forEach(function (elem) {
        hide(elem); // assure that the element is hidden when scrolled into view

        ScrollTrigger.create({
          trigger: elem,
          toggleClass: 'enable',
          // scrub: 1,
          invalidateOnRefresh: true,
          onEnter: function () { animateFrom(elem) },
          onEnterBack: function () { animateFrom(elem, -1) },
          onLeave: function () { hide(elem) } // assure that the element is hidden when scrolled into view
        });
      });
      // });
    }
  }


  //// line animation
  pathRevel();
  function pathRevel() {
    if ($(".path_anim").length) {
      let n_path = $('.net_line');
      //set value to each line
      n_path.each(function (i_cnt) {
        let cur_el = n_path.get(i_cnt);
        let length = cur_el.getTotalLength();
        // console.log(length);
        $(this).css({
          'stroke-dasharray': length + 1,
          'stroke-dashoffset': length + 1,
          'opacity': 1,
        });
      });
      gsap.set([".dot1", ".dot2"], {
        scale: 0, transformOrigin: "50% 50%",
      });
      function animateFrom(elem, direction) {
        // console.log(elem)
        direction = direction | 1;
        let start_dot = elem.querySelector(".dot1");
        let cur_path = elem.querySelector(".net_line");
        let end_dot = elem.querySelector(".dot2");
        // console.log(start_dot, cur_path, end_dot)
        gsap.fromTo(start_dot, { scale: 0, transformOrigin: "50% 50%" }, {
          duration: .8,
          scale: 1, transformOrigin: "50% 50%",
          ease: Bounce.easeOut,
          overwrite: "auto"
        });
        gsap.fromTo(cur_path, { strokeDashoffset: cur_path.getTotalLength() }, {
          delay: 0.8,
          duration: 2,
          strokeDashoffset: 0,
          ease: "Power1.easeOut",
          overwrite: "auto"
        });
        gsap.fromTo(end_dot, { scale: 0, transformOrigin: "50% 50%" }, {
          delay: 2.8,
          duration: .8,
          scale: 1, transformOrigin: "50% 50%",
          ease: Bounce.easeOut,
          overwrite: "auto"
        });
      }
      function hide(elem) {
        let start_dot = elem.querySelector(".dot1");
        let cur_path = elem.querySelector(".net_line");
        let end_dot = elem.querySelector(".dot2");
        gsap.set([start_dot, end_dot], {
          scale: 0, transformOrigin: "50% 50%",
        });
        gsap.set(cur_path, { strokeDashoffset: cur_path.getTotalLength() });
      }
      gsap.utils.toArray(".path_anim").forEach(function (elem) {
        hide(elem);
        ScrollTrigger.create({
          trigger: elem,
          invalidateOnRefresh: true,
          onEnter: function () { animateFrom(elem) },
          onEnterBack: function () { animateFrom(elem, -1) },
          onLeave: function () { hide(elem) }
        });
      });
    }
  }


  //// dot pluse
  if ($(".dot_pls").length) {
    gsap.to(".dot_pls", 0.75, {
      scale: 0.6,
      transformOrigin: "50% 50%",
      repeat: -1,
      repeatDelay: 0.5,
      yoyo: true,
      ease: Bounce.easeOut,
    });
  }


  //// client slider
  if ($(".client_slider").length) {
    $(".client_slider").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      speed: 1000,
      autoplay: true,
      autoplaySpeed: 2000,
      arrows: true,
      dots: false,
      infinite: true,
      pauseOnHover: false,
      pauseOnFocus: false,
      centerMode: true,
      centerPadding: '30vw',
      prevArrow: $(".client_slide_control .slick-prev"),
      nextArrow: $(".client_slide_control .slick-next"),
      responsive: [
        {
          breakpoint: 992,
          settings: {
            centerPadding: '20vw',
          }
        },
        {
          breakpoint: 640,
          settings: {
            centerPadding: '15vw',
          }
        },
        {
          breakpoint: 575,
          settings: {
            centerPadding: '2vw',
          }
        }
      ]
    });

    gsap.set($(".client_slider .client_slide_item .cl_img"), {
      translateY: "0",
      translateX: "-35%",
      scale: "1.5",
      transformOrigin: "50% 40%",
    });
    gsap.set($(".client_slider .client_slide_item.slick-current .cl_img"), {
      translateX: "-50%",
    });
    $(".client_slider").on('beforeChange', function (event, slick, currentSlide, nextSlide) {
      gsap.set($(".client_slider .client_slide_item:not(.slick-current) .cl_img"), {
        translateX: "-35%",
      });
      gsap.to($(".client_slider .client_slide_item[data-slick-index=" + currentSlide + "]").find(".cl_img"), 1, {
        translateX: "-35%",
      });
      gsap.to($(".client_slider .client_slide_item[data-slick-index=" + nextSlide + "]").find(".cl_img"), 1, {
        translateX: "-50%",
      });
    });
  }


  //// blog slider
  if ($(".blog_sl").length) {
    $(".blog_sl").slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      speed: 1000,
      arrows: false,
      dots: true,
      infinite: false,
      pauseOnHover: false,
      pauseOnFocus: false,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 2,
          }
        },
        {
          breakpoint: 640,
          settings: {
            slidesToShow: 1,
          }
        }
      ]
    });
  }


  //// team slider
  if ($(".team_slider").length) {
    $(".team_slider").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      speed: 1000,
      arrows: true,
      dots: false,
      infinite: false,
      pauseOnHover: false,
      pauseOnFocus: false,
      variableWidth: true,
      centerMode: false,
      centerPadding: '0',
      prevArrow: $(".team_slide_control .slick-prev"),
      nextArrow: $(".team_slide_control .slick-next"),
      responsive: [
        {
          breakpoint: 992,
          settings: {
            variableWidth: false,
            centerMode: true,
            centerPadding: '32vw',
          }
        },
        {
          breakpoint: 767,
          settings: {
            variableWidth: false,
            centerMode: true,
            centerPadding: '25vw',
          }
        },
        {
          breakpoint: 575,
          settings: {
            variableWidth: false,
            centerMode: true,
            centerPadding: '5vw',
          }
        }
      ]
    });
    $(window).on("resize load ready", function () {
      if ($(window).width() < 992) {
        $(".team_slider").slick("slickGoTo", 1);
      }
    })
  }


  //// contact_step slider
  if ($(".appo_slider").length) {
    $(".appo_slider").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      speed: 1000,
      arrows: false,
      dots: false,
      infinite: false,
      pauseOnHover: false,
      pauseOnFocus: false,
      draggable: false,
      swipe: false,
      touchMove: false,
      adaptiveHeight: true,
    });
    $(".appo_slider").on('beforeChange', function (event, slick, currentSlide, nextSlide) {
      $(".app_sl_count").text(('0' + (nextSlide + 1)).slice(-2));
    });

    $("#appo_nextSl1").on("click", function (e) {
      e.preventDefault();
      $(".appo_slider").slick('slickGoTo', 1)
    })
    $("#appo_nextSl2").on("click", function (e) {
      e.preventDefault();
      $(".appo_slider").slick('slickGoTo', 2)
    })
    $("#appo_prevSl1").on("click", function (e) {
      e.preventDefault();
      $(".appo_slider").slick('slickGoTo', 0)
    })
  }


  //blog page sidebar slider
  if ($(".blog_side_sl").length) {
    $(".blog_side_sl").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      speed: 1000,
      autoplay: false,
      arrows: true,
      dots: false,
      infinite: true,
      pauseOnHover: false,
      pauseOnFocus: false,
    });
  }


  if ($('[data-type = "time"]').length) {
    $('[data-type = "time"]').timepicker({
      'autoclose': true,
    }).on("click", function () {
      let m = $(this).outerWidth();
      gsap.to($(".ui-timepicker-wrapper"), 0.4, {
        width: m
      })
      // $(".ui-timepicker-wrapper").width($(this).width());
    });
  }
  if ($('[data-type="date"]').length) {
    $('[data-type="date"]').datepicker({
      clearBtn: true,
      todayHighlight: true
    });
  }


  ///// parallax
  parallax();
  function parallax() {
    if ($(".hero").length) {
      const text = document.querySelector(".hero-title");
      // Hero Parallax
      const tl = gsap.timeline({
        defaults: { ease: "none", transformOrigin: "50% 50%" },
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
      gsap.utils.toArray(".prlx_bg").forEach((layer) => {
        const depth = layer.dataset.depth;
        const movement = -(layer.offsetHeight * depth);
        tl.to(layer, { y: -movement }, 0);
      });
      tl.to(text, {
        y: -text.offsetHeight * text.dataset.depth,
        autoAlpha: 0,
        scale: 1.5,
        duration: 0.2
      }, 0);
    }
  }


  //smooth scroll to section
  $(".target_scroll").on('click', function (event) {
    if (this.hash !== "") {
      event.preventDefault();
      var hash = this.hash;
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function () {
        window.location.hash = hash;
      });
    }
  });


  //equal width of sitemap anchor
  if ($(".sitemap").length) {
    $(".sitemap-main>ul>li>ul>li>ul>li a").width($(".sitemap-main>ul>li>ul>li>a").width());
    jQuery(window).on("resize", function () {
      $(".sitemap-main>ul>li>ul>li>ul>li a").width($(".sitemap-main>ul>li>ul>li>a").width());
    });
  }

});


/*page loader*/
function page_loader() {
  const loaderCircles = document.querySelector(".loader-circles"),
    greyCircle = document.querySelector(".grey"),
    blackCircle = document.querySelector(".black");
  const imgToLoad = document.querySelectorAll("img");
  const loadImgs = imagesLoaded(imgToLoad);

  let loadedCount = 0, loadingProgress = 0;

  gsap.set(greyCircle, { scale: 0, transformOrigin: "50% 100%" });
  gsap.set(blackCircle, { scale: 0, transformOrigin: "50% 100%" });

  gsap.fromTo(
    loaderCircles,
    { scale: 0.9, transformOrigin: "50% 50%" },
    {
      y: -12,
      repeat: -1,
      scale: 1.1,
      yoyo: true,
      ease: "sine.inOut",
      duration: 0.5
    }
  );

  const loaderTl = gsap.timeline({ defaults: { ease: "sine.inOut" } });

  loaderTl
    .to(greyCircle, { repeat: -1, repeatDelay: 0.5, scale: 1 }, "one")
    .to(blackCircle, { repeat: -1, repeatDelay: 0.5, scale: 1 }, "two")
    .set(
      greyCircle,
      { zIndex: "6", scale: 0, repeat: -1, repeatDelay: 1 },
      "two+=0.5"
    )
    .set(
      blackCircle,
      { zIndex: "6", scale: 0, repeat: -1, repeatDelay: 1 },
      "two+=1"
    )
    .set(greyCircle, { zIndex: "5", repeat: -1, repeatDelay: 1 }, "two+=1");

  loaderTl.timeScale(0.5);
  const loadCompleteTl = gsap.timeline({});
  loadImgs.on("progress", () => {
    loadedCount++;
    loadingProgress = loadedCount / imgToLoad.length;
    if (loadingProgress === 1) {
      //// place image inside svg
      if ($(".morph_box").length) {
        $(".morph_box").each(function (index) {
          let mrph_each = $(this);
          let mrph_src = String(mrph_each.attr("data-image"));
          // console.log(mrph_src);
          if (mrph_src != null) {
            //generate dynamic id
            mrph_each.find("clipPath").attr("id", "myClip" + index);
            mrph_each.find(".morph_pop").css("clipPath", "url(#myClip" + index + ")");
            //set image url
            mrph_each.find(".set_img").attr("xlink:href", mrph_src);
          }
        });
      }

      loadCompleteTl
        .to(".loader-circles div", {
          delay: 0.75,
          opacity: 0,
          onComplete: () => {
            loaderTl.pause();
          }
        })
        .to(
          ".loader",
          {
            autoAlpha: 0,
            duration: 0.75
          },
          "load"
        )
    }
  });
}
page_loader();