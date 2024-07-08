jQuery(document).ready(function () {
  //// toggle menu for mobile
  jQuery('.navbar-toggler').click(function () {
    jQuery(this).toggleClass('open');
  });


  //// wordpress menu open
  jQuery("<span class='clickD'></span>").insertAfter(
    '.navbar-nav > li.menu-item-has-children > a'
  );


  if (jQuery(window).width() <= 1024) {
    $('.navbar-nav li .clickD').click(function (e) {
      e.preventDefault();
      var $this = $(this);

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

    //mob navigation
    var t1 = new TimelineMax({
      paused: true
    });
    console.log(window.innerHeight);
    t1.to(".main_nav .navbar-collapse", 1, {
      // height: window.innerHeight + "px",
      top: 0,
      opacity: 1,
      visibility: "visible",
      ease: Expo.easeInOut,
      delay: -0.3,
    });

    t1.staggerFrom(
      ".main_nav .navbar-nav li",
      1.5, {
        x: -200,
        opacity: 0,
        ease: Expo.easeOut,
      },
      0.3
    );

    t1.reverse();

    $(document).on("click", ".main_nav .navbar-nav a", function () {
      t1.reversed(!t1.reversed());
    });


    $(document).on("click", ".main_nav .navbar-toggler", function () {
      t1.reversed(!t1.reversed());

      if ($(this).hasClass("open")) {
        disableScroll();
        $("html").addClass("disable_scroll");
      } else {
        enableScroll();
        $("html").removeClass("disable_scroll");
      }
    });
  } else {
    TweenMax.set(".main_nav .navbar-collapse", {
      top: 0,
      visibility: "visible"
    });
    TweenMax.set(".main_nav .navbar-nav li", {
      opacity: 1,
      transform: "none",
    });
    TweenMax.set(".main_nav .navbar-nav li", {
      clearProps: 'all'
    });
    enableScroll();
    $("html").removeClass("disable_scroll");
    $(".main_nav .navbar-toggler").removeClass("open");
    $(".main_nav .navbar-collapse").removeClass("show");
  }


  $(window).scroll(function () {});


  $(window).resize(function () {
    top_padding();
  });

  //// top padding for nav bar
  function top_padding() {
    TweenMax.set($(".main_nav").next(), {
      paddingTop: $(".main_nav").height(),
    });
    if (jQuery(window).width() <= 1024) {
      if ($(".navbar-toggler").hasClass("open")) {
        TweenMax.set(".main_nav .navbar-collapse", {
          top: 0,
          visibility: "visible"
        });

      } else {
        TweenMax.set(".main_nav .navbar-collapse", {
          top: "-100%",
          visibility: "hidden"
        });
      }
    } else {
      TweenMax.set(".main_nav .navbar-collapse", {
        top: "auto",
        visibility: "visible",
        opacity: 1,
      });
      TweenMax.set(".main_nav .navbar-nav li", {
        opacity: 1,
        transform: "none",
      });
      // TweenMax.set(".main_nav .navbar-nav li", {
      //   clearProps: 'all'
      // });
    }
  }
  top_padding();


  //// particle Move animation
  if ($(".particleMove").length) {
    //particle movement
    $(".particleMove").each(function () {
      let rand_num = Math.floor(Math.random() * (15 - 10 + 1) + 10);
      TweenMax.to($(this).children(), rand_num, {
        ease: Linear.easeOut,
        perspective: 400,
        transformStyle: "preserve-3d",
        transform: "rotate3d(1, 2, 2, -15deg)",
        scaleX: 1.05,
        scaleY: 0.85,
        repeat: -1,
        yoyo: true,
      });
    });
  }


  //// add class on active viewport section
  if ($(".inView").length) {
    inView.threshold(0.5);
    inView('.inView').on('enter', function (el) {
        if (!el.classList.contains("sec_active")) {
          el.classList.add("sec_active");
        }
      })
      .on('exit', function (el) {
        if (el.classList.contains("sec_active")) {
          el.classList.remove('sec_active');
        }
      });
  }


  var ctrl = new ScrollMagic.Controller();
  //// rotate cube
  if ($(".rotator_anim").length) {
    $(".rotator_anim").each(function () {
      var _this_rotate = $(this);
      var _this_rotator = $(this).children();
      var _rotation = $(this).find(".rotate");

      TweenMax.to(_rotation, 20, {
        rotate: -135,
        ease: Linear.easeOut,
        repeat: -1,
        yoyo: true,
      });
      if (_this_rotate.attr("data-pos") == "right") {
        var tb_img_tween = TweenMax.from(_this_rotator, 1, {
          y: window.innerHeight / 2,
          top: "30%",
          right: 0,
          ease: Linear.easeOut,
          yoyo: true,
        });
      } else if (_this_rotate.attr("data-pos") == "lbtr") {
        var tb_img_tween = TweenMax.from(_this_rotator, 1, {
          y: window.innerHeight / 2,
          top: "5%",
          left: "0",
          ease: Linear.easeOut,
          yoyo: true,
        });
      } else {
        var tb_img_tween = TweenMax.from(_this_rotator, 1, {
          y: window.innerHeight / 2,
          top: 0,
          left: 0,
          ease: Linear.easeOut,
          yoyo: true,
        });
      }

      new ScrollMagic.Scene({
          triggerElement: this,
          triggerHook: 0.1,
          duration: _this_rotate.height(),
        }).setTween(tb_img_tween)
        .addTo(ctrl)
    });
  }


  //// parallax image
  if ($(".parallax_bg").length) {
    $(".parallax_bg").each(function () {
      var _this = $(this);
      if (_this.attr("data-pos") == "x") {
        var img_tween = TweenMax.from(this, 0.5, {
          x: -200,
          ease: Linear.easeNone,
        });
      } else if (_this.attr("data-pos") == "z") {
        var img_tween = TweenMax.from(this, 0.5, {
          backgroundSize: "100% 100%",
          ease: Linear.easeNone,
        });
      } else {
        var img_tween = TweenMax.from(this, 0.5, {
          y: -200,
          ease: Linear.easeNone,
        });
      }

      new ScrollMagic.Scene({
          triggerElement: this,
          // triggerHook: 0.1,
          duration: "100%",
        }).setTween(img_tween)
        .offset(-(window.innerHeight) / 4)
        .addTo(ctrl);
    });
  }


  //// revel section
  if ($(".each_scroll").length) {
    $(".each_scroll").each(function () {
      var _this = $(this);
      if (_this.attr("data-effect") == "fade") {
        var eachTween = TweenMax.from(_this.children(), 1.5, {
          opacity: 0,
          stagger: 0.5,
          yoyo: true,
        });
      } else {
        var eachTween = TweenMax.from(_this.children(), 1.5, {
          opacity: 0,
          y: 80,
          stagger: 0.5,
          yoyo: true,
        });
      }
      new ScrollMagic.Scene({
          triggerElement: this,
          triggerHook: "0.8",
        }).setTween(eachTween)
        .addTo(ctrl)
        .on("progress", function (event) {
          var scene_progress = event.progress;
          if (scene_progress >= 0.5) {
            setTimeout(() => {
              _this.children().addClass("visible");
            }, 1200);
          } else {
            setTimeout(() => {
              _this.children().removeClass("visible");
            }, 1200);
          }
        });
    });
  }


  //// testimonial_slide
  if ($(".testimoni_slide").length) {
    $(".testimoni_slide").slick({
      lazyLoad: 'ondemand',
      slidesToShow: 1,
      slidesToScroll: 1,
      speed: 1000,
      autoplay: true,
      autoplaySpeed: 8000,
      arrows: false,
      dots: true,
      infinite: true,
      pauseOnHover: false,
      pauseOnFocus: false,
      centerMode: true,
      centerPadding: '0px',
    });
  }


  //// network animation
  if ($(".network_anim").length) {
    var n_path = $('.net_line');

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

    //animation
    inView('.network_anim').on('enter', function (el) {
        if (!el.classList.contains("anim2_active")) {
          el.classList.add("anim2_active");

          //show network anim
          let $el = $(el).find('.net_line');
          //animate when needed --show line
          TweenMax.set($el, {
            opacity: 1,
          });
          TweenMax.to($el, 1, {
            delay: 1,
            //stagger: 0.5,
            strokeDashoffset: 0
          });
        }
      })
      .on('exit', function (el) {
        if (el.classList.contains("anim2_active")) {
          el.classList.remove('anim2_active');

          //hide network anim
          let $el = $(el).find('.net_line');
          //set value to each line -- hide line
          TweenMax.to($el, 0.3, {
            delay: 0,
            opacity: 0,
            onComplete: function () {
              //reset value to each line
              $el.each(function (i_cnt) {
                let cur_el = $el.get(i_cnt);
                let length = cur_el.getTotalLength();
                // console.log(length);
                $(this).css({
                  'stroke-dasharray': length + 1,
                  'stroke-dashoffset': length + 1,
                  'opacity': 1,
                });
              });
            }
          });
        }
      });
  }


  //// mountain animation
  if ($(".mountain_anim").length) {
    var n_path = $('.cnct_sub,.cnct');

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

    //animation
    inView('.mountain_anim').on('enter', function (el) {
        if (!el.classList.contains("anim_active")) {
          el.classList.add("anim_active");

          //show mountain anim
          let $el = $(el).find('.cnct_sub,.cnct');
          let $el2 = $(el).find('.pt,.pt_sub');
          //animate when needed --show line
          TweenMax.set($el, {
            opacity: 1,
          });
          TweenMax.to($el, 0.4, {
            stagger: 0.3,
            strokeDashoffset: 0
          });
          TweenMax.to($el2, 0.4, {
            // delay: 0.5,
            stagger: 0.3,
            scale: 2,
            transformOrigin: "6px 3px !important"
          });
        }
      })
      .on('exit', function (el) {
        if (el.classList.contains("anim_active")) {
          el.classList.remove('anim_active');

          //hide mountain anim
          let $el = $(el).find('.cnct_sub,.cnct');
          let $el2 = $(el).find('.pt_sub,.pt');
          //set value to each line -- hide line
          TweenMax.to($el2, 0.2, {
            scale: 1,
          });
          TweenMax.to($el, 0.2, {
            opacity: 0,
            onComplete: function () {
              //reset value to each line
              $el.each(function (i_cnt) {
                let cur_el = $el.get(i_cnt);
                let length = cur_el.getTotalLength();
                // console.log(length);
                $(this).css({
                  'stroke-dasharray': length + 1,
                  'stroke-dashoffset': length + 1,
                  'opacity': 1,
                });
              });
            }
          });
        }
      });
  }


  //// planet rotation
  if ($(".planet_rotation").length) {
    //offset the planet to center on orbit
    TweenMax.set(".path", {
      scale: 0.88,
      transformOrigin: "center center !important",
    });

    TweenMax.to(".path", 60, {
      repeat: -1,
      rotate: 360,
      transformOrigin: "center center !important",
      ease: Linear.easeNone
    });
    TweenMax.to(".planet1_outer", 3, {
      repeat: -1,
      rotate: 360,
      transformOrigin: "center center !important",
      ease: Linear.easeNone
    });
    TweenMax.to(".planet2_outer", 10, {
      repeat: -1,
      rotate: 360,
      transformOrigin: "center center !important",
      ease: Linear.easeNone
    });
  }


  //// planet rotation whatwedo
  if ($(".planet_multi_rotation").length) {
    //offset the planet to center on orbit
    TweenMax.set(".planet-path", {
      scale: 0.88,
      transformOrigin: "center center !important",
    });

    TweenMax.to(".planet-path", 60, {
      repeat: -1,
      rotate: 360,
      transformOrigin: "center center !important",
      ease: Linear.easeNone
    });
    TweenMax.to(".planet-single", 60, {
      repeat: -1,
      rotate: -360,
      transformOrigin: "center center !important",
      ease: Linear.easeNone
    });
    TweenMax.to(".planet-ring", 3, {
      repeat: -1,
      rotate: 360,
      transformOrigin: "center center !important",
      ease: Linear.easeNone
    });
  }


  //// starfall
  if ($(".starfall").length) {
    let s_path = $('.fl_star');

    s_path.css("opacity", 1);

    //set value to each line
    s_path.each(function (i_cnts) {
      let cur_els = s_path.get(i_cnts);
      let lengths = cur_els.getTotalLength();
      $(this).css({
        'stroke-dasharray': lengths + 1,
        'stroke-dashoffset': lengths + 1,
      });

      gsap.to(s_path, 0.6, {
        delay: 2.5,
        stagger: 2.5,
        opacity: 0,
        strokeDashoffset: 0,
        repeat: -1,
        repeatDelay: 3,
        ease: "Power1.easeInOut"
      });
    });
  }


  //// lightning and storm
  if ($(".lightning").length) {
    var canvas3 = document.getElementById('canvas1');
    var ctx3 = canvas3.getContext('2d');

    var lightning = [];
    var lightTimeCurrent = 0;
    var lightTimeTotal = 0;

    var w = canvas3.width = window.innerWidth;
    var h = canvas3.height = window.innerHeight;
    window.addEventListener('resize', function () {
      w = canvas3.width = window.innerWidth;
      h = canvas3.height = window.innerHeight;
    });

    function random(min, max) {
      return Math.random() * (max - min + 1) + min;
    }

    function clearCanvas3() {
      ctx3.globalCompositeOperation = 'destination-out';
      ctx3.fillStyle = 'rgba(0,0,0,' + random(1, 30) / 100 + ')';
      ctx3.fillRect(0, 0, w, h);
      ctx3.globalCompositeOperation = 'source-over';
    };

    function createLightning() {
      var x = random(100, w - 100);
      var y = random(0, h / 4);

      var createCount = random(1, 3);
      for (var i = 0; i < createCount; i++) {
        single = {
          x: x,
          y: y,
          xRange: random(15, 10),
          yRange: random(10, 5),
          path: [{
            x: x,
            y: y
          }],
          pathLimit: random(80, 95)
        };
        lightning.push(single);
      }
    };

    function drawLightning() {
      for (var i = 0; i < lightning.length; i++) {
        var light = lightning[i];

        light.path.push({
          x: light.path[light.path.length - 1].x + (random(0, light.xRange) - (light.xRange / 2)),
          y: light.path[light.path.length - 1].y + (random(0, light.yRange))
        });

        if (light.path.length > light.pathLimit) {
          lightning.splice(i, 1);
        }

        ctx3.strokeStyle = 'rgba(255, 255, 255, 1)'; //lightning color
        ctx3.lineWidth = 1; //lightning width
        ctx3.shadowBlur = 6; //lightning shadow
        ctx3.shadowColor = 'rgba(33,150,243,0.02)'; //lightning shadow color

        if (random(0, 10) === 0) {
          ctx3.lineWidth = 1;
        }
        if (random(0, 20) === 0) {
          ctx3.lineWidth = 2;
        }

        ctx3.beginPath();
        ctx3.moveTo(light.x, light.y);
        for (var pc = 0; pc < light.path.length; pc++) {
          ctx3.lineTo(light.path[pc].x, light.path[pc].y);
        }
        if (Math.floor(random(0, 30)) === 1) { //to fos apo piso
          ctx3.fillStyle = 'rgba(0, 0, 0, ' + random(1, 10) / 100 + ')';
          //change lightning flash color here, value 10 -> indicate light intencity
          ctx3.fillRect(0, 0, w, h);
        }
        ctx3.lineJoin = 'miter';
        ctx3.stroke();
      }
    };

    function animateLightning() {
      clearCanvas3();
      lightTimeCurrent++;
      if (lightTimeCurrent >= lightTimeTotal) {
        createLightning();
        lightTimeCurrent = 0;
        lightTimeTotal = 400; //rand(100, 200)
      }
      drawLightning();
    }

    function animloop() {
      animateLightning();
      requestAnimationFrame(animloop);
    }
    animloop();
  }





});