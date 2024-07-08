"use strict";

// refresh page if orientation changed
window.addEventListener('orientationchange', event => {
    window.location.reload();
    // console.log("rotated");
});

// detect display orientation
if (window.outerWidth > window.outerHeight && window.outerWidth <= 767) {
    document.body.classList.remove("potraitView");
    document.body.classList.add("landscapeView");
}
if (window.outerWidth < window.outerHeight && window.outerWidth <= 767) {
    document.body.classList.remove("landscapeView");
    document.body.classList.add("potraitView");
}

// Detect Safari
if ((navigator.userAgent.indexOf("Safari") > -1) && (navigator.userAgent.indexOf("Chrome") <= -1)) {
    document.body.classList.add("SafariBrowser");
}

// fix pattern anim
if (window.outerHeight <= 360) {
    document.body.classList.add("smallView");
}


// reset scroll position:
window.history.scrollRestoration = "manual";
window.scrollTo(0, 0);


gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(MotionPathPlugin);

ScrollTrigger.refresh(true);

gsap.set("html,body", {
    pointerEvents: "none",
    overflowX: "hidden",
    overflowY: "hidden",
});


//body ready
jQuery.noConflict()(function ($) {
    ScrollTrigger.refresh();


    function page_init() {
        //set default scroll position top
        window.scrollTo(0, 0);

        //locomotive & scrolltrigger refresh
        ScrollTrigger.refresh();


        //// mouse cursor
        if ($("#node").length) {
            $("a:not('.logo'),.navbar-brand, button").addClass("link");
            $("input:not([type='submit']),select,textarea").addClass("_input");
            $("input[type='submit']").addClass("_input_submit");

            const node = document.getElementById("node");

            window.addEventListener("mousemove", function (e) {
                node.classList.remove("expand");
                node.classList.remove("bright_node");
                node.classList.remove("full_node");
                node.classList.remove("dark_node");
                node.classList.remove("dark_expand");
                node.classList.remove("hide_node");

                if (node.classList.contains("init")) {
                    gsap.set(node, {
                        scale: 3,
                        opacity: 1,
                        transformOrigin: "50% 50%",
                    });
                }
                else {
                    gsap.set(node, {
                        scale: 1,
                        opacity: 1,
                        transformOrigin: "50% 50%",
                    });
                }

                // console.log(e.target)
                if ($(e.target).hasClass("link") || $(e.target).parents(".link").length) {
                    node.classList.add("expand");
                }

                if ($(e.target).parents(".big_section.dark_bg").length && !$(e.target).hasClass(".link")) {
                    node.classList.add("bright_node");
                }

                if ($(e.target).parents(".dark_bg").length && !$(e.target).hasClass(".link")) {
                    node.classList.add("dark_node");
                }

                if ($(e.target).hasClass("box_btn") && $(e.target).parents(".dark_bg").length) {
                    node.classList.add("dark_expand");
                }

                if ($(e.target).hasClass("form_block") || $(e.target).parents(".form_block").length) {
                    node.classList.add("hide_node");
                }

                if ($(e.target).hasClass("top_video") || $(e.target).parents(".top_video").length) {
                    node.classList.add("hide_node");
                }

                let node_pos = node.getBoundingClientRect();
                gsap.set(node, {
                    x: e.clientX - (node_pos.width / 2),
                    y: e.clientY - (node_pos.height / 2),
                    transformOrigin: "50% 50%",
                })
            });

            document.addEventListener('scroll', () => {
                node.classList.remove("init");
                gsap.to(node, 0.3, {
                    scale: 1,
                });
            }, true);
        }

        //// chnage hover state -card
        if ($(".grid_box").length) {
            $(".grid_box .box_btn").on("mouseenter", function () {
                $(this).parents(".grid_box").addClass("hover");
            }).on("mouseout", function () {
                $(this).parents(".grid_box").removeClass("hover");
            });
        }


        ////reset body
        gsap.set("body", {
            opacity: 1,
        });
    }


    function after_init() {
        //// for css animation - on page load
        if ($(".section").length) {
            $(".section").addClass("anim");
        }

        if ($("#node").length) {
            $("#node").removeClass("hide");
        }

        //// energy section
        if ($(".big_section").length) {
            let timeout, big_sec = $('.big_section');
            gsap.set(big_sec.children(), {
                scale: 0.7,
                opacity: 0,
            });
            let bounceAnimateIn = gsap.timeline();
            bounceAnimateIn.fromTo(big_sec.children(), {
                scale: 0.7,
                opacity: 0,
            }, {
                duration: 1.2,
                opacity: 1,
                scale: 1,
                transformOrigin: "50% 50%",
                stagger: 0.1,
                // ease: Elastic.easeOut,
                ease: Back.easeOut.config(1.2),
                overwrite: true,
                onComplete: movement,
            }).pause();

            ScrollTrigger.create({
                trigger: big_sec,
                scrub: false,
                start: "top center",
                end: "bottom 40%",
                onEnter: () => {
                    bounceAnimateIn.play()
                },
            });

            function movement() {
                big_sec.mousemove(function (e) {
                    if (timeout) clearTimeout(timeout);
                    setTimeout(callParallax.bind(null, e), 100);
                });

                function callParallax(e) {
                    parallaxIt(e, '.big_exp', -50);
                    parallaxIt(e, '.center_exp', -80);
                }

                function parallaxIt(e, target, movement) {
                    let relX = e.pageX - big_sec.offset().left;
                    let relY = e.pageY - big_sec.offset().top;
                    gsap.to(target, 1, {
                        x: (relX - big_sec.width() / 2) / big_sec.width() * movement,
                        y: (relY - big_sec.height() / 2) / big_sec.height() * movement,
                        ease: Power2.easeOut
                    })
                }
            }
        }


        //// reveal animation
        if ($("[data-fadeUp='all']").length) {
            $("[data-fadeUp='all']").each(function () {
                let els_pr = $(this);
                let els = els_pr.children();
                gsap.set(els, {
                    yPercent: 50,
                    opacity: 0,
                });
                let fadeUpAnimateIn = gsap.timeline();
                fadeUpAnimateIn.fromTo(els, {
                    yPercent: 50,
                    opacity: 0,
                    transformOrigin: "50% 50%",
                }, {
                    duration: 1,
                    opacity: 1,
                    yPercent: 0,
                    transformOrigin: "50% 50%",
                    overwrite: true,
                }).pause();

                ScrollTrigger.create({
                    trigger: els_pr,
                    scrub: false,
                    start: "top bottom",
                    end: "bottom top",
                    onEnter: () => {
                        fadeUpAnimateIn.play()
                    },
                });
            });
        }

        if ($("[data-anim='all']").length) {
            $("[data-anim='all']").children().each(function () {
                let els = $(this);
                gsap.set(els, {
                    yPercent: 30,
                    opacity: 0,
                });
                let fadeAnimateIn = gsap.timeline();
                fadeAnimateIn.fromTo(els, {
                    yPercent: 30,
                    opacity: 0,
                    transformOrigin: "50% 50%",
                }, {
                    duration: 1,
                    opacity: 1,
                    yPercent: 0,
                    transformOrigin: "50% 50%",
                    overwrite: true,
                }).pause();
                ScrollTrigger.create({
                    trigger: els,
                    scrub: false,
                    start: "top bottom",
                    end: "bottom top",
                    onEnter: () => {
                        fadeAnimateIn.play()
                    },
                    // onEnterBack: () => {
                    //     fadeAnimateIn.play()
                    // },
                    // onLeave: () => {
                    //     fadeAnimateIn.reverse()
                    // },
                    // onLeaveBack: () => {
                    //     fadeAnimateIn.reverse()
                    // },
                    //  markers: true,
                });
            });
        }


        ////equal height:
        function eq_size() {
            if ($(".box_content").length) {
                let eq_el = document.querySelectorAll(".box_content"),
                    eq_ht = 0;
                eq_el.forEach(function (els) {
                    gsap.set(".box_content", {
                        height: "auto",
                    });
                    if (eq_ht < els.clientHeight) {
                        eq_ht = els.clientHeight;
                    }
                });
                gsap.set(".box_content", {
                    height: eq_ht,
                })
            }
        }
        eq_size();
        window.addEventListener('resize', eq_size, true);


        //// goto bottom:
        if ($(".gotoTop").length) {
            window.addEventListener('scroll', toggle_goto, true);
            function toggle_goto() {
                let currentScroll = window.pageYOffset;
                if (currentScroll > $("#xenergy").offset().top) {
                    $(".gotoTop").removeClass("show");
                }
                else {
                    $(".gotoTop").addClass("show");
                }
            };
            $(".gotoTop").addClass("show");
            $(".gotoTop").on("click", function () {
                $("html, body").animate({
                    // scrollTop: $('html, body').get(0).scrollHeight
                    scrollTop: $("#xenergy").offset().top
                });
            });
        }


        //locomotive & scrolltrigger refresh
        ScrollTrigger.refresh();
    }


    //init setup
    setTimeout(function () {
        if ($("#node").length) {
            $("#node").addClass("init");
            gsap.set(node, {
                scale: 3,
            });
        }

        page_init();

        //loader animation:
        setTimeout(function () {
            gsap.set("body", {
                backgroundColor: "#000",
            });
            gsap.set("html,body", {
                pointerEvents: "all",
                overflowX: "hidden",
                overflowY: "auto",
            });
            after_init();
        }, 500);
    }, 200);
});