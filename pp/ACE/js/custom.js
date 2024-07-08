jQuery(document).ready(function () {
  //// stickey nav bar create function
  function stickey_nav() {
    if (jQuery(window).scrollTop() > 250) {
      jQuery('.navbar').addClass('scroll_nav');
    } else {
      jQuery('.navbar').removeClass('scroll_nav');
    }
  }


  //// top padding for nav bar create function
  function top_padding() {
    $(".main_nav").next().css("padding-top", $(".main_nav").height());
  }


  //show menu on scroll up
  var lastScrollTop = 0;
  $(window).scroll(function (event) {
    var st = $(this).scrollTop();
    if (st > lastScrollTop) {
      // downscroll code
      $(".main_nav").addClass("hideNav");
    } else {
      // upscroll code
      $(".main_nav").removeClass("hideNav");
    }
    if (st <= window.innerHeight / 2) {
      // downscroll code
      $(".main_nav").removeClass("scroll_nav");
    }
    lastScrollTop = st;
  });

  //mob navigation animation
  var estado = 0;
  $(".main_nav .navbar-toggler").click(function () {
    disableScroll();
    // let vw = $(window).width();
    let delay_time = 0.2;
    // $(this).toggleClass('open');
    // console.log(estado);
    if (estado === 0) {
      // TweenMax.to($("#bg-menu-mobile"), 1, {
      //   // x: -vw,
      //   height: "auto",
      //   ease: Expo.easeInOut
      // });
      $(".main_nav .navbar-nav li").each(function () {
        TweenMax.to($(this), 1.2, {
          // x: -vw,
          x: "-100%",
          // scaleX: 1,
          delay: delay_time,
          ease: Expo.easeInOut
        });
        delay_time += .04;
      });
      estado = 1;
    } else {
      estado = 0;
      // TweenMax.to($("#bg-menu-mobile"), 1.2, {
      //   // x: 0,
      //   height: 0,
      //   ease: Expo.easeInOut
      // });
      $(".main_nav .navbar-nav li").each(function () {
        TweenMax.to($(this), 1, {
          x: 0,
          delay: delay_time,
          ease: Expo.easeInOut
        });
        delay_time += .02;
      });
      enableScroll();
    }
  });


  //// equal height create function
  var equalheight = function (container) {
    var set_time_delay = setInterval(function () {
      if (load_complete) {
        setTimeout(function () {
          eqHeight(container);
        }, 400)
      }
    }, 100);

    function eqHeight(container) {
      clearInterval(set_time_delay);
      // console.log("now load");
      var currentTallest = 0,
        currentRowStart = 0,
        rowDivs = new Array(),
        $el,
        topPosition = 0;
      $(container).each(function () {
        $el = $(this);
        $($el).height('auto')
        topPostion = $el.position().top;

        if (currentRowStart != topPostion) {
          for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
            rowDivs[currentDiv].height(currentTallest);
          }
          rowDivs.length = 0; // empty the array
          currentRowStart = topPostion;
          currentTallest = $el.height();
          rowDivs.push($el);
        } else {
          rowDivs.push($el);
          currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
        }

        for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
          rowDivs[currentDiv].height(currentTallest);
        }
      });
    }
  }


  // sticky function call
  stickey_nav();

  // menu top padding function call
  top_padding();


  //// toggle menu for mobile
  // jQuery('.navbar-toggler').click(function () {
  //   jQuery(this).toggleClass('open');
  // });


  //// wordpress menu open
  jQuery("<span class='clickD'></span>").insertAfter(
    '.navbar-nav > li.menu-item-has-children > a'
  );
  if (jQuery(window).width() < 992) {
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
  }


  //// add class on active viewport section
  if ($(".SecView").length) {
    inView.threshold(0.4);
    inView('.SecView').on('enter', function (el) {
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


  //// add class on active viewport element
  if ($(".inView").length) {
    inView('.inView').on('enter', function (el) {
        if (!el.classList.contains("el_active")) {
          el.classList.add("el_active");
        }
      })
      .on('exit', function (el) {
        if (el.classList.contains("el_active")) {
          el.classList.remove('el_active');
        }
      });
  }


  var ctrl = new ScrollMagic.Controller();

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
        var img_tween = TweenMax.to(this, 0.5, {
          scale: "1.5",
          ease: Linear.easeNone,
        });
      } else if (_this.attr("data-pos") == "multi") {
        var img_tween = new TimelineMax();
        img_tween.to(this.children[0], 0.5, {
          y: "-25%",
          ease: Linear.easeNone,
        }).to(this.children[1], 0.5, {
          y: "-35%",
          ease: Linear.easeNone,
        });
      } else {
        var img_tween = TweenMax.to(this, 0.5, {
          top: "-15%",
          ease: Linear.easeNone,
        });
      }

      new ScrollMagic.Scene({
          triggerElement: this,
          duration: $(window).height(),
        }).setTween(img_tween)
        // .offset(-(window.innerHeight) / 2)
        .addTo(ctrl);
    });
  }


  //// revel section
  if ($(".each_scroll").length) {
    $(".each_scroll").each(function () {
      var _this = $(this);
      if (_this.attr("data-effect") == "fade") {
        var eachTween = TweenMax.from(_this.children(), 1.2, {
          opacity: 0,
          stagger: 0.3,
          yoyo: true,
        });
      } else if (_this.attr("data-effect") == "slideFade") {
        var eachTween = TweenMax.from(_this.children(), 0.7, {
          opacity: 0,
          x: -20,
          stagger: 0.3,
          yoyo: true,
        });
      } else if (_this.attr("data-effect") == "slideSwing") {
        var eachTween = TweenMax.from(_this.children(), 1.2, {
          opacity: 0,
          x: 30,
          stagger: 0.5,
          yoyo: true,
          ease: Back.easeOut.config(2.7)
        });
      } else {
        var eachTween = TweenMax.from(_this.children(), 1.2, {
          opacity: 0,
          y: 80,
          stagger: 0.3,
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


  //// mobile_slider
  if ($(".mobile_slider").length) {
    if ($(window).width() <= 1024) {
      $(".mobile_slider").slick({
        lazyLoad: 'ondemand',
        slidesToShow: 3,
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
        centerPadding: '40px',
        responsive: [{
          breakpoint: 640,
          settings: {
            slidesToShow: 2,
          }
        }, {
          breakpoint: 380,
          settings: {
            slidesToShow: 1,
          }
        }]
      });
    }
  }


  //// text_slide
  if ($(".txt_slider").length) {
    let txt_slider = $(".txt_slider");
    txt_slider.slick({
      lazyLoad: 'ondemand',
      slidesToShow: 1,
      slidesToScroll: 1,
      speed: 1000,
      autoplay: true,
      autoplaySpeed: 4000,
      arrows: false,
      infinite: true,
      fade: true,
    });
    txt_slider.find(".slick-slide:eq(0)").addClass("sl_active");

    txt_slider.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
      txt_slider.find(".slick-slide:eq(" + currentSlide + ")").removeClass("sl_active");
      // console.log("aft:" + currentSlide);
    });
    txt_slider.on('afterChange', function (event, slick, currentSlide) {
      txt_slider.find(".slick-slide:eq(" + currentSlide + ")").addClass("sl_active");
      // console.log("aft:" + currentSlide);
    });
  }


  //// grid_blk_slide
  if ($(".grid_blk_slide").length) {
    if ($(window).width() <= 767) {
      $(" .grid_blk_slide").slick({
        lazyLoad: 'ondemand',
        slidesToShow: 3,
        slidesToScroll: 1,
        speed: 1000,
        autoplay: false,
        // autoplaySpeed: 8000,
        arrows: false,
        dots: true,
        infinite: false,
        pauseOnHover: false,
        pauseOnFocus: false,
        // centerMode: true,
        // centerPadding: '40px',
        responsive: [{
          breakpoint: 575,
          settings: {
            slidesToShow: 2,
          }
        }, {
          breakpoint: 380,
          settings: {
            slidesToShow: 1,
          }
        }]
      });
    }
    if ($(".grid_blk_slide .sl_eq").length) {
      equalheight($(".grid_blk_slide").find('.sl_eq'));
    }
    // setTimeout(function () {
    //   $(".sec_overlay").css("margin-top", -$(".grid_blk_slide").find('.col_cst_inner').height() / 2);
    // }, 300)

  }


  //// team_slider
  if ($(".team_slide").length) {
    $(".team_slide").slick({
      lazyLoad: 'ondemand',
      slidesToShow: 3,
      slidesToScroll: 1,
      speed: 1000,
      autoplay: false,
      arrows: true,
      dots: false,
      infinite: false,
      pauseOnHover: false,
      pauseOnFocus: false,
      prevArrow: '<button class="slick-arrow slick-prev"><svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-miterlimit="10"><circle class="arrow-icon--circle" cx="16" cy="16" r="15.12"></circle><path class="arrow-icon--arrow" d="M16.14 9.93L22.21 16l-6.07 6.07M8.23 16h13.98"></path></g></svg></button>',
      nextArrow: '<button class="slick-arrow slick-next"><svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-miterlimit="10"><circle class="arrow-icon--circle" cx="16" cy="16" r="15.12"></circle><path class="arrow-icon--arrow" d="M16.14 9.93L22.21 16l-6.07 6.07M8.23 16h13.98"></path></g></svg></button>',
      responsive: [{
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          arrows: false,
          dots: true,
        }
      }, {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
          arrows: false,
          dots: true,
        }
      }]
    });
  }



  //// bridge_slider
  if ($(".bridge_list").length) {
    $(".bridge_list").slick({
      // lazyLoad: 'ondemand',
      slidesToShow: 1,
      slidesToScroll: 1,
      speed: 1500,
      autoplaySpeed: 5000,
      autoplay: true,
      arrows: false,
      dots: false,
      infinite: true,
      pauseOnHover: false,
      pauseOnFocus: false,
      // prevArrow: prev_sl_btn,
      // nextArrow: next_sl_btn,
    });
  };


  ///// animate number
  if ($(".animNum_inView").length) {
    inView('.animNum_inView').on('enter', function (el) {
        if (!el.classList.contains("active")) {
          el.classList.add("active");
          //number counter
          let set_num_target = $(el),
            Contz = {
              val: 0
            },
            get_num = parseInt(set_num_target.attr("data-cnt"));
          set_num_target.html(0);
          TweenMax.to(Contz, 2, {
            delay: 0.4,
            val: get_num,
            roundProps: "val",
            onUpdate: function () {
              set_num_target.html(Contz.val.toLocaleString());
              // console.log(Contz.val)
            }
          });
        }
      })
      .on('exit', function (el) {
        if (el.classList.contains("active")) {
          el.classList.remove('active');
          //number counter
          let set_num_target = $(el);
          let get_num = parseInt(set_num_target.attr("data-cnt")),
            Contz = {
              val: get_num
            };

          set_num_target.html(get_num.toLocaleString());
          TweenMax.to(Contz, 0.1, {
            val: 0,
            roundProps: "val",
            onUpdate: function () {
              set_num_target.html(Contz.val.toLocaleString());
              // console.log(Contz.val)
            }
          });
        }
      });
  }


  ///// play video
  if ($(".videoinView").length) {
    $(".videoinView").each(function (i) {
      let ml = $(this);
      ml[0].pause();
      ml[0].currentTime = 0;
      ml.prop('muted', true);
    });

    $(".vdo-play-btn").click(function () {
      let ml = $(this).next();
      ml[0].currentTime = 0;
      ml.prop('muted', false);
      // ml.allowsInlineMediaPlayback = true;
      // ml.attr('playsinline', true);
      // ml.attr('webkit-playsinline', true);
      ml[0].play();

      ml.addClass('playVideo');
      $(this).fadeOut();
    });

    inView('.videoinView').on('enter', function (el) {
        el.classList.add("playVideo");
      })
      .on('exit', function (el) {
        el.currentTime = 0;
        el.classList.remove('playVideo');
        $(el).prop('muted', true);
        // el.allowsInlineMediaPlayback = false;
        // el.attr('playsinline', false);
        // el.attr('webkit-playsinline', false);

        el.pause();
        $(".vdo-play-btn").fadeIn();
      });
  }


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


  //// pie chart animation
  if ($(".pie_chart").length) {
    var n_path = $('.pie');

    //set value to each line
    n_path.each(function (i_cnt) {
      let cur_el = n_path.get(i_cnt);
      let length = cur_el.getTotalLength();
      $(this).css({
        'stroke-dasharray': length + 1,
        'stroke-dashoffset': length + 1,
      });
    });

    inView('.pie_chart').on('enter', function (el) {
        if (!el.classList.contains("pie_active")) {
          el.classList.add("pie_active");

          let $el = $(el).find('.pie');

          let length = $el.get(0).getTotalLength();
          let _val = $(el).attr("data-value");
          let set_val = ((_val * length) / 100);

          TweenMax.to($el, 1, {
            delay: 1,
            strokeDashoffset: set_val
          });
        }
      })
      .on('exit', function (el) {
        if (el.classList.contains("pie_active")) {
          el.classList.remove('pie_active');
          let $el = $(el).find('.pie');
          //reset value to each line
          let length = $el.get(0).getTotalLength();
          TweenMax.to($el, 0.25, {
            strokeDashoffset: length + 1,
            strokeDasharray: length + 1
          });
        }
      });
  }


  //// svg - triangle hover
  if ($(".triangle_blk").length) {
    $(".trngl").on("touchStart mouseover", function () {
      TweenMax.to($(this), 0.8, {
        scale: 1.2,
        transformOrigin: "50% 50%"
      });
    })
    $(".trngl").on("ontouchend mouseout", function () {
      TweenMax.to($(this), 0.8, {
        scale: 1,
        transformOrigin: "50% 50%"
      });
    })

  }


  //// window scroll function
  $(window).scroll(function () {
    // sticky function call
    stickey_nav();
  });


  //// add bg color on active viewport section
  if ($(".change_bg_sec").length) {
    $(".change_bg_sec .bgView").each(function () {
      $(this).attr("data-color", $(this).css("background-color"));
      $(this).css("background-color", "transparent");
    });
    $(".change_bg_sec").css("background-color", $(".change_bg_sec .bgView:eq(0)").attr("data-color"));
    change_bg();

    function change_bg() {
      $(window).scroll(function () {
        // console.log("call");
        var $window = $(window),
          $body = $('.change_bg_sec'),
          $panel = $('.bgView');

        $panel.removeClass("bg_color_change");

        // Change 33% earlier than scroll position so colour is there when you arrive.
        var scroll = $window.scrollTop() + ($window.height() / 3);
        $panel.each(function () {
          var $this = $(this);

          // set the scroll to 33% earlier in scroll var.
          if ($this.position().top <= scroll && $this.position().top + $this.height() > scroll) {
            $body.css("background-color", $(this).attr('data-color'));
            $this.addClass("bg_color_change");
          }
        });

      }).scroll();
    }
  }

  //call canvas function
  ballJump();


  //// filter cards
  if ($('.all_group').length) {
    var $grid = $(".grid_filter");
    let elements = document.querySelectorAll(".grid_filter");

    function setBox() {
      Array.prototype.forEach.call(elements, function (el, i) {
        // console.log(el.children[0].clientWidth)
        let gt_width = el.children[0].clientWidth;
        for (let m = 0; m < el.children.length; m++) {
          //set equal width and height
          el.children[m].querySelector(".card_front").style.height = gt_width + "px";
        }
      });


      $grid.isotope({
        itemSelector: '.filter_item',
        percentPosition: true,
        layoutMode: 'fitRows',
      });
    }
    window.onload = setBox;
    window.onresize = setBox;

    //custom filter functions
    /*var filterFns = {
      // show if number is greater than 50
       numberGreaterThan50: function () {
         var number = $(this).find('.number').text();
         return parseInt(number, 10) > 50;
       },
       // show if name ends with -ium
       ium: function () {
         var name = $(this).find('.name').text();
         return name.match(/ium$/);
       }
    };*/
    // bind filter button click
    $('.filters_button_group').on('click', '.filters_button', function () {
      let token = 0;
      if ($(this).attr("data-subscribe") == undefined) {
        console.log("free");
        token = 1;
      } else if ($(this).attr("data-subscribe") == "true") {
        console.log("subscribed");
        token = 1;
      } else {
        alert("Please get a subscribtion");
        token = 0;
      }
      if (token == 1) {
        var filterValue = $(this).attr('data-filter');
        // use filterFn if matches value
        // filterValue = filterFns[filterValue] || filterValue;
        $grid.isotope({
          filter: filterValue
        });

        // change is-checked class on buttons
        $(this).closest('.filters_button_group').find('.filters_button.is-checked').removeClass('is-checked');
        $(this).addClass('is-checked');
      }
    });
  }



  ////fancybox - video
  $('[data-fancybox="html5-video"]').fancybox({
    afterShow: function (instance, slide) {
      $("body").addClass("hideOverflow");
    },
    afterClose: function (instance, slide) {
      $("body").removeClass("hideOverflow");
    },
  });



  ////triangle animation
  if ($(".triangle_blk").length) {
    let _this_el = $(".triangle_blk");
    _this_el.find("[data-link]").each(function (index) {
      let tr_link = $(this).attr("href");
      _this_el.find("[data-goto=tr" + (index + 1) + "]").attr("href", tr_link);
    });

    _this_el.find("[data-goto]").on("click", function () {
      let cr_loc = $(this).attr("href");
      window.location.href = cr_loc;
    })
  }



  ////bridge animation
  if ($(".bridge").length) {
    let _this_br = $(".bridge path");

    //set value to each line
    _this_br.each(function (i_cnt) {
      let cur_el = _this_br.get(i_cnt);
      let length = cur_el.getTotalLength();
      $(this).css({
        'stroke-dasharray': length + 1,
        'stroke-dashoffset': length + 1,
      });
    });


    inView('.bridge').on('enter', function (el) {
        if (!el.classList.contains("bridge_active")) {
          el.classList.add("bridge_active");
        }
      })
      .on('exit', function (el) {
        if (el.classList.contains("bridge_active")) {
          el.classList.remove('bridge_active');
        }
      });
  }


  //// window resize function
  $(window).on("resize", function () {
    // menu top padding function call
    top_padding();

    //grid_blk_slide -
    equalheight($(".grid_blk_slide").find('.col_cst_inner'));

    if ($(window).width() >= 992) {
      estado = 1;
      $(".main_nav .navbar-toggler").trigger("click");
      estado = 0;
    }
  });

  ///// end document ready
});


//// balljump animation - create function
function ballJump() {
  var H, Particle, W, animateParticles, canvas, clearCanvas, colorArray, createParticles, ctx, drawParticles, initParticleSystem, particleCount, particles, updateParticles;
  Particle = function () {
    this.color = colorArray[Math.floor((Math.random() * 5) + 1)];
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.direction = {
      x: -1 + Math.random() * 2,
      y: -1 + Math.random() * 1
    };
    this.vx = 1 * Math.random() + .05;
    this.vy = 1 * Math.random() + .05;
    this.radius = .9 * Math.random() + 1;
    this.move = function () {
      this.x += this.vx * this.direction.x;
      this.y += this.vy * this.direction.y;
    };
    this.changeDirection = function (axis) {
      this.direction[axis] *= -1;
    };
    this.draw = function () {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      ctx.fill();
    };
    this.boundaryCheck = function () {
      if (this.x >= W) {
        this.x = W;
        this.changeDirection("x");
      } else if (this.x <= 0) {
        this.x = 0;
        this.changeDirection("x");
      }
      if (this.y >= H) {
        this.y = H;
        this.changeDirection("y");
      } else if (this.y <= 0) {
        this.y = 0;
        this.changeDirection("y");
      }
    };

    var self = this;

    function setRadius(value) {
      self.radius = value;
    }

    function resize(event) {
      W = $(window).width();
      self.x = Math.random() * W;
      if (W > 600) {
        setRadius(.9 * Math.random() + 10);
      } else {
        setRadius(.9 * Math.random() + 6);
      }
    }

    resize();
    $(window).on('resize', resize);
  };
  clearCanvas = function () {
    ctx.clearRect(0, 0, W, H);
  };
  createParticles = function () {
    var i, p;
    i = particleCount - 1;
    while (i >= 0) {
      p = new Particle();
      particles.push(p);
      i--;
    }
  };
  drawParticles = function () {
    var i, p;
    i = particleCount - 1;
    while (i >= 0) {
      p = particles[i];
      p.draw();
      i--;
    }
  };
  updateParticles = function () {
    var i, p;
    i = particles.length - 1;
    while (i >= 0) {
      p = particles[i];
      p.move();
      p.boundaryCheck();
      i--;
    }
  };
  initParticleSystem = function () {
    createParticles();
    drawParticles();
  };
  animateParticles = function () {
    clearCanvas();
    drawParticles();
    updateParticles();
    requestAnimationFrame(animateParticles);
  };

  W = void 0;
  H = void 0;
  canvas = void 0;
  ctx = void 0;
  particleCount = 100;
  particles = [];
  colorArray = ["rgba(255,255,255,.3)", "rgba(112,94,12,.2)", "rgba(204,173,95,.3)", "rgba(255,255,255,.23)", "rgba(188,188,188,.3)", "rgba(75,69,16,.2)", "rgba(136,107,13,.2)"];

  let el_canvas = jQuery("#headerballs");
  canvas = el_canvas.get(0);
  canvas.style.webkitFilter = "blur(2px)";

  W = window.innerWidth;
  H = el_canvas.parent().height();

  canvas.width = W;
  canvas.height = H;
  ctx = canvas.getContext("2d");
  initParticleSystem();
  requestAnimationFrame(animateParticles);

  //resze canvas
  $(window).on('resize', function (event) {
    canvas.width = $(window).width();
  });
};