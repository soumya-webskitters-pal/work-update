"use strict";
jQuery.noConflict()(function ($) {
  /*--mobile animation--*/
  setTimeout(function () {
    if ($(".anim-post-cards").length) {
      let tl1 = gsap.timeline();
      tl1
        .fromTo(".anim-block", 0.3, {
          opacity: 0,
        }, {
          opacity: 1,
        })
        .to(".anim-post-cards-box", 5, {
          x: 0,
          y: 0,
          xPercent: -50,
          yPercent: -60,
          z: 100,
          rotationY: 0,
          scale: 1,
          ease: Power2.easeOut,
        }, "-=0.2")
        .to("#anim_frame", 1.5, {
          y: 0,
          yPercent: -20,
          ease: Power0.easeOut,
        }, "-=5")
        .fromTo(".second-image", 0.5, {
          opacity: 0,
        }, {
          opacity: 1,
        }, "-=4.1")
        .fromTo(".anim-post-cards-box", 0.5, {
          opacity: 1,
        }, {
          opacity: 0,
        }, "-=3.5")
        .to(".iphone-frame__screen", 5, {
          y: 0,
          yPercent: -52.5,
          ease: Power0.easeOut,
        }, "-=3")
        .to(".top_fade_header", 5, {
          opacity: 0,
          ease: Power0.easeOut,
        }, "-=5")
      ScrollTrigger.create({
        pin: true,
        trigger: ".section-anim",
        start: 'top top',
        // end: "bottom center",
        end: "+=200%",
        scrub: 1,
        animation: tl1,
        // markers: true,
        invalidateOnRefresh: true
      });

      //  setTimeout(() => {
      let tl2 = gsap.timeline();
      tl2
        .to(".tips-block-bg-circle", 1, {
          opacity: 1,
        })
        .to(".tips-block__images", 1, {
          opacity: 1,
          ease: Power1.easeOut,
        })
        .fromTo(".tips-block__images", 5, {
          x: 0,
          y: -document.querySelector(".tip-section").getBoundingClientRect().top,
          xPercent: -50,
          yPercent: -50,
          scale: 0.82,
        }, {
          x: 0,
          y: 0,
          xPercent: -50,
          yPercent: -50,
          scale: 1,
          ease: Power0.easeNone,
        }, "-=1")
      ScrollTrigger.create({
        trigger: ".tip-section",
        start: 'top bottom',
        end: "+=200%",
        // end: document.querySelector(".tip-section").getBoundingClientRect().top + (document.querySelector(".tip-section").clientHeight / 2),
        scrub: 0.5,
        animation: tl2,
        //markers: true,
        invalidateOnRefresh: true,
      });
      //  }, 50);

      setTimeout(() => {
        let tl3 = gsap.timeline();
        tl3.to(".bubble_group", 0.1, {
          opacity: 1,
        })
          .to(".bubbles", 0.8, {
            x: 0,
            y: 0,
            opacity: 0,
            scale: 0.5,
            onComplete: function () {
              $(".bubble_btn").addClass("shake");
              explosion("bubble_canvas1");
            },
          }, "-=0.1");
        ScrollTrigger.create({
          trigger: ".tips-block",
          start: 'top top',
          end: "+=50%",
          animation: tl3,
          // markers: true,
          invalidateOnRefresh: true,
          toggleActions: "restart none none none",
          onEnter: function () {
            $(".bubble_btn").removeClass("shake");
          }
        });
      }, 100);

      /*--blast animation--*/
      function explosion(fn_trigger) {
        const colors = ["#b0ddf2", "#fae3c1", "#ecaae0"];
        const bubbles = 45;
        const explode = () => {
          let particles = [];
          let ratio = window.devicePixelRatio;
          let c = document.getElementById(fn_trigger);
          let ctx = c.getContext("2d");
          let x_pos = c.getBoundingClientRect().x + 50,
            y_pos = c.getBoundingClientRect().y + 100;
          c.width = 200 * ratio;
          c.height = 200 * ratio;
          c.style.left = x_pos;
          c.style.top = y_pos;
          // console.log(c.getBoundingClientRect());

          for (var i = 0; i < bubbles; i++) {
            particles.push({
              x: c.width / 2,
              y: c.height / 2,
              radius: r(5, 15),
              color: colors[Math.floor(Math.random() * colors.length)],
              rotation: r(0, 360, true),
              speed: r(8, 12),
              friction: 0.9,
              opacity: r(0, 0.5, true),
              yVel: 0,
              gravity: 0.1
            });

          }

          render(particles, ctx, c.width, c.height);
        };

        const render = (particles, ctx, width, height) => {
          requestAnimationFrame(() => render(particles, ctx, width, height));
          ctx.clearRect(0, 0, width, height);

          particles.forEach((p, i) => {
            p.x += p.speed * Math.cos(p.rotation * Math.PI / 180);
            p.y += p.speed * Math.sin(p.rotation * Math.PI / 180);

            p.opacity -= 0.01;
            p.speed *= p.friction;
            p.radius *= p.friction;
            p.yVel += p.gravity;
            p.y += p.yVel;

            if (p.opacity < 0 || p.radius < 0) return;

            ctx.beginPath();
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;
            ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, false);
            ctx.fill();
          });

          return ctx;
        };

        const r = (a, b, c) =>
          parseFloat(
            (Math.random() * ((a ? a : 1) - (b ? b : 0)) + (b ? b : 0)).toFixed(
              c ? c : 0));

        explode(fn_trigger);
        //document.querySelector(".bubble_btn").addEventListener("mouseover", e => explode(false, e.pageX, e.pageY));
      }
    }
  }, 50);


  /*--top slider--*/
  if ($(".tilted_slider").length) {
    new Splide('.tilted_slider', {
      type: 'loop',
      drag: 'free',
      focus: 'center',
      perPage: 3,
      pagination: false,
      arrows: false,
      autoScroll: {
        speed: 1,
      },
      breakpoints: {
        //1200: { arrows: false },
        991: { perPage: 2 },
        575: { perPage: 1 },
      },
    }).mount(window.splide.Extensions);
  }


  /*--hover to blast anim--*/
  $('.lottie_play').each(function () {
    let iconMenu = this;
    let ico_container = $(iconMenu).find(".lottie_box").get(0);
    let ico_path = $(ico_container).attr("data-src");
    let animationMenu = bodymovin.loadAnimation({
      container: ico_container,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: ico_path,
    });
    iconMenu.addEventListener('mouseenter', (e) => {
      animationMenu.playSegments([0, 100], true);
    });
    iconMenu.addEventListener('mousemove', (e) => {
      if (this.clientWidth / 2 > e.layerX) {
        gsap.to($(this).find(".lottie_box svg"), 0.1, {
          x: e.layerX / 2,
          y: e.layerY / 2,
        })
      }
      else {
        gsap.to($(this).find(".lottie_box svg"), 0.1, {
          x: -e.layerX / 2,
          y: e.layerY / 2,
        })
      }
      //console.log(e.layerX, e.layerY)
    });
  });


  /*--scroll to move anim--*/
  setTimeout(function () {
    if ($(".prlx_box").length) {
      $(".prlx_box img").each(function (index) {
        let offset = 15;
        gsap.to(this, {
          ease: Power0.easeNone,
          xPercent: function () {
            if (index % 2 == 0) {
              return offset * 1;
            }
            else {
              return offset * -1;
            }
          },
          scrollTrigger: {
            trigger: ".prlx_box img",
            scrub: 1,
            start: "top bottom",
            end: "+=150%",
            //markers: true,
          }
        });
      })
    }
  }, 100);
});
