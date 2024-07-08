jQuery(document).ready(function () {
  //// toggle menu for mobile
  // jQuery('.navbar-toggler').click(function () {
  //   jQuery(this).toggleClass('open');
  // });

  jQuery('.navbar-toggler').click(function () {
    if ($(this).hasClass("open")) {
      filter_anim();
      $(this).removeClass("open");
      $("body").removeClass("noScroll");
    }
    else {
      $(this).addClass("open");
      $("body").addClass("noScroll");
      filter_anim("open");
    }
  });


  //// wordpress menu open
  jQuery("<span class='clickD'></span>").insertAfter(
    '.navbar-nav > li.menu-item-has-children > a'
  );


  if (jQuery(window).width() <= 991) {
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

  jQuery(window).scroll(function () {
    if (jQuery(window).scrollTop() > 1) {
      jQuery(".main_nav").addClass('sticky');
    } else {
      jQuery(".main_nav").removeClass('sticky');
    }
  });
  // sticky menu end

  banner_parallax();
  blockRevel();
  hr_scroll();
  blockRotate();
  // glich();
});

//nav animation
function filter_anim(ctrl) {
  let trans = gsap.timeline({ invalidateOnRefresh: true });
  if (ctrl == "open") {
    gsap.set("#navbarSupportedContent", {
      opacity: 0,
      pointerEvents: "none",
      visibility: 'hidden',
    });
    gsap.set(".navbar-nav>li", {
      opacity: 0,
      translateX: "-100%",
    });
    trans.to("#navbarSupportedContent", 0.7, {
      opacity: 1,
      pointerEvents: "all",
      visibility: 'visible',
      ease: Power0.easeOut,
    }).to(".navbar-nav>li", 1.5, {
      opacity: 1,
      translateX: 0,
      stagger: 0.1,
      // ease: Expo.easeOut,
      ease: Expo.easeOut,
    }, "-=0.4");
  }
  else {
    gsap.set("#navbarSupportedContent", {
      opacity: 1,
      pointerEvents: "all",
      visibility: 'visible',
    });
    gsap.set(".navbar-nav>li", {
      opacity: 1,
      translateX: 0,
    });
    trans.to(".navbar-nav>li", 1.5, {
      opacity: 0,
      translateX: "-100%",
      stagger: 0.05,
      ease: Expo.easeOut,
    }).to("#navbarSupportedContent", 0.8, {
      opacity: 0,
      pointerEvents: "none",
      visibility: 'hidden',
    }, "-=0.5");
  }
}

//timeline scroll
function hr_scroll() {
  if ($(".fix_sec").length) {
    //line
    function get_line() {
      var n_path = $('#line path');
      n_path.each(function (i_cnt) {
        let cur_el = n_path.get(i_cnt);
        let length = cur_el.getTotalLength();
        $(this).css({
          'stroke-dasharray': length + 1,
          'stroke-dashoffset': length + 1,
          'opacity': 1,
        });
      });
    }

    const formats = document.querySelectorAll(".road_box_item"), par_el = document.querySelector(".fix_sec"), pw = document.querySelector(".roadmap_map");
    let maxWidth = 0;
    get_line();
    const getMaxWidth = () => {
      maxWidth = 0;
      formats.forEach((section) => {
        maxWidth += section.offsetWidth;
        // section.style.height = (window.innerHeight - document.querySelector(".main_nav").clientHeight) + "px";
      });
    };
    getMaxWidth();
    gsap.to([formats, ".road_line"], {
      // xPercent: -100 * (formats.length - 1),
      delay: 0.5,
      x: () => `-${maxWidth - window.innerWidth + (formats[formats.length - 1].offsetWidth) * 2}`,
      ease: "none",
      scrollTrigger: {
        trigger: par_el,
        pin: true,
        scrub: 1,
        // start: "top +=" + parseInt(document.querySelector(".main_nav").clientHeight + (window.innerHeight / 10)) + "px top",
        start: 'center center',
        end: () => `+=${maxWidth}`,
        invalidateOnRefresh: true,
        onEnter: function () {
          get_line();
          gsap.to($('#line path'), {
            strokeDashoffset: 0,
            ease: "none",
          });
        },
        onEnterBack: function () {
          get_line();
          gsap.to($('#line path'), {
            strokeDashoffset: 0,
            ease: "none",
          });
        },
      }
    });
  }
}

//banner parallax
function banner_parallax() {
  gsap.set($(".banner_content").children(), {
    transform: "translateY(-30%)",
    opacity: 0,
  });
  gsap.to(".parallax", {
    yPercent: -15,
    xPercent: 20,
    ease: "none",
    scrollTrigger: {
      trigger: ".home_overlay",
      start: "top bottom",
      end: "bottom top",
      scrub: 1.2,
      invalidateOnRefresh: true,
      onUpdate: self => {
        let prg = 0.5;
        if (window.innerWidth < 1080) {
          prg = 0.8;
        }
        if (window.innerWidth < 481) {
          prg = 0.99;
        }

        if (self.progress > prg) {
          gsap.to($(".banner_content").children(), 1, {
            transform: "translateY(-30%)",
            opacity: 0,
          });
        } else {
          gsap.to($(".banner_content").children(), 1, {
            transform: "translateY(0)",
            opacity: 1,
          });
        };
      },
    },
  });
}

//animate section
function blockRevel() {
  if ($(".gs_reveal").length) {
    function animateFrom(elem, direction) {
      direction = direction | 1;
      var x = 0,
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
      else if (elem.classList.contains("gs_reveal_fade")) {
        x = 0;
        y = 0;
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
    gsap.utils.toArray(".gs_reveal").forEach(function (elem) {
      hide(elem);
      ScrollTrigger.create({
        trigger: elem,
        toggleClass: 'enable',
        scrub: 1.2,
        // start: "top top",
        // end: "bottom bottom",
        // invalidateOnRefresh: true,
        onEnter: function () { animateFrom(elem) },
        onEnterBack: function () { animateFrom(elem, -1) },
        onLeave: function () { hide(elem) }
      });
    });
  }
}

//rotation animate section
function blockRotate() {
  if ($(".gs_rotate").length) {
    function animateFrom(elem) {
      gsap.fromTo(elem, { rotation: 45, transformOrigin: "50%, 50%", }, {
        duration: 2,
        rotation: 0,
        ease: "Circle.easeOut",
        overwrite: "auto", transformOrigin: "50%, 50%",
      });
    }
    function hide(elem) {
      gsap.set(elem, { rotation: 45, transformOrigin: "50%, 50%", });
    }
    gsap.utils.toArray(".gs_rotate").forEach(function (elem) {
      hide(elem);
      ScrollTrigger.create({
        trigger: elem,
        toggleClass: 'enable',
        scrub: 1.2,
        invalidateOnRefresh: true,
        // start: "center center",
        // end: "center center",
        invalidateOnRefresh: true,
        onEnter: function () { animateFrom(elem) },
        onEnterBack: function () { animateFrom(elem, -1) },
        onLeave: function () { hide(elem) }
      });
    });
  }
}


// function glich() {
//   var glich_el = $(".glich");
//   var tls = gsap.timeline({ repeat: -1, repeatRefresh: true, ease: "none", })
//     .to(glich_el, 0.1, {
//       textShadow: "2px 3px 2px red, -2px -3px 2px green, 2px -3px 2px yellow",
//     }).to(glich_el, 0.1, {
//       textShadow: "2px -3px 2px red, 2px -3px 2px green, -2px -3px 2px yellow",
//     })
//     .to(glich_el, 0.1, {
//       textShadow: "-2px 3px 2px red, 2px 3px 2px green, 2px 3px 2px yellow",
//     })
// }