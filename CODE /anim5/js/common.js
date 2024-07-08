jQuery(document).ready(function ($) {
  gsap.registerPlugin(ScrollTrigger, CSSRulePlugin);

  if ($(".circle_container").length) {
    gsap.to(".subOrbitGroup", {
      rotation: 360,
      transformOrigin: "50% 50%",
      duration: 20,
      ease: "none",
      repeat: -1,
    });
    gsap.to($(".subOrbitGroup").children(), {
      rotation: -360,
      transformOrigin: "50% 50%",
      duration: 20,
      ease: "none",
      repeat: -1,
    });

    gsap.set(".orbit", {
      opacity: 0,
      scale: 0,
    });
    gsap.set(".subOrbit", {
      scale: 0,
      opacity: 0,
      transformOrigin: "50% 50%",
    });
    gsap.set(".title", {
      y: 200,
      opacity: 0,
    });
    gsap.set(".orbitGroup", { opacity: 0.1 });

    gsap.set(".cir_item", { opacity: 0, y: "100vh" });

    const EL = document.querySelectorAll(".orbitGroup");
    const el = document.querySelectorAll(".cir_item");
    const ln = EL.length;

    const ctl = gsap.timeline({ pause: true });

    ctl.to(".orbitGroup", {
      opacity: 0.1,
      duration: 0.2,
      onComplete: () => {
        gsap.to(".orbit", {
          scale: 1,
          opacity: 1,
          ease: "Back.easeInOut",
          duration: 1,
          stagger: 0.05,
        });
      },
    });

    for (let i = ln - 1; i >= 0; i--) {
      if (EL[i] != null) {
        ctl.to(EL[i], {
          opacity: 1,
          duration: 1,
        });
      }
      if (EL[i].querySelector(".title") != null) {
        ctl.to(
          EL[i].querySelector(".title"),
          {
            y: 0,
            opacity: 1,
            ease: "Power2.easeIn",
            duration: 1,
          },
          "-=1"
        );
      }
      if (EL[i].querySelector(".subOrbit") != null) {
        ctl.to(
          EL[i].querySelectorAll(".subOrbit"),
          {
            scale: 1,
            opacity: 1,
            ease: "Elastic.easeInOut",
            stagger: 0.5,
            duration: 2,
            transformOrigin: "50% 50%",
          },
          "-=1"
        );
      }

      ctl.to(el[i], { duration: 1, opacity: 1, y: 0 }, "-=2");
    }
    ctl.to(".circle_container", { opacity: 1, duration: 1 });

    ScrollTrigger.create({
      trigger: ".circle_container",
      start: "top center",
      scrub: 1.3,
      animation: ctl,
      markers: true,
    });
    // ScrollTrigger.create({
    //   trigger: ".circle_container",
    //   start: "top top",
    //   pin: true,
    //   scrub: 1.3,
    //   //   markers: true,
    // });

    $(".circle_container").on("mousemove", function (e) {
      gsap.to(".orbit>circle, .subOrbit>*", {
        duration: 1,
        x: function (i) {
          return (x = (e.clientX / window.innerWidth / (i + 1)) * 150);
        },
        y: function (i) {
          return (y = i * -2 * (e.clientY / window.innerHeight));
        },
        overwrite: "auto",
      });
      gsap.to(".title", {
        duration: 1,
        x: function (i) {
          return (x = (e.clientX / window.innerWidth / (i + 1)) * 50);
        },
        y: function (i) {
          return (y = i * -5 * (e.clientY / window.innerHeight));
        },
        overwrite: "auto",
      });
    });
  }
});
