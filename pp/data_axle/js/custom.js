"use strict";

const userIdleTime = 2; // user idle Time for autoscroll


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

//remove scrollbar
document.querySelector("body").classList.add("removebar");

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(MotionPathPlugin);

ScrollTrigger.refresh(true);

gsap.set("html,body", {
    pointerEvents: "none",
    overflowX: "hidden",
    overflowY: "hidden",
});

//for idle time
let idleInterval,
    idleTime = 0,
    idleTimeSet = userIdleTime,
    autoScrollFlag = false;

function resetTimer() {
    //console.log("STOP");
    idleTime = 0;
    clearTimeout(idleInterval);
    if (autoScrollFlag) {
        autoScrollFlag = false;
        gsap.to(".autoScroll_indicaior", 0.3, {
            opacity: 1,
            pointerEvents: "all",
        });
        gsap.to(".autoScroll_indicaior", 1, {
            delay: 5,
            opacity: 0,
            pointerEvents: "none",
        });
    }
}
function timerIncrement() {
    idleTime = idleTime + 1;
    if (idleTime > idleTimeSet * 10) {
        document.querySelector(".scroll_to").classList.add("hide");
        // resetTimer();
        pageAutoScroll();
    }
}
function pageAutoScroll() {
    if (document.documentElement.scrollTop >= document.getElementById("form_sec").offsetTop) {
        resetTimer();
    }
    else {
        //  console.log("Scroll");
        window.scrollTo(0, window.pageYOffset + 5);
        autoScrollFlag = true;
    }
}

//body ready
jQuery.noConflict()(function ($) {
    ////panel timeline
    let main_timeline = gsap.timeline();

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
                node.classList.remove("scroll_to_node");

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

                if ($(e.target).parents(".home_section").length && !$(e.target).hasClass(".link")) {
                    node.classList.add("full_node");
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

                if ($(e.target).hasClass("scroll_to") || $(e.target).parents(".scroll_to").length) {
                    node.classList.add("scroll_to_node");
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


        //// Home banner text animation -- by char
        if ($("[data-homeTitle]").length) {
            let els = $("[data-homeTitle]");
            Splitting({ target: els, by: 'chars' });
            els.find(".whitespace").append("&nbsp;");
            gsap.set(els.find(".char"), {
                opacity: 0,
                yPercent: 100,
                transformOrigin: "center top",
                transformStyle: "preserve-3d",
            });
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

        $(".scroll_to").on("click", function () {
            resetTimer();
            idleTime = (idleTimeSet * 10) + 10;
            ////idle time checking
            idleInterval = setInterval(timerIncrement, 100);
        });


        ScrollTrigger.matchMedia({
            /// desktop animation:
            "(min-width: 768px)": function () {
                //// only home page intro anim
                if ($(".home_top_section").length) {
                    let home = $(".home_top_section");
                    let home_timeline = gsap.timeline({
                        onUpdate: function () {
                            // console.log(home_timeline.progress());
                            if (home_timeline.progress() >= 0.1) {
                                $(".scroll_to").addClass("hide");
                            }
                            else {
                                $(".scroll_to").removeClass("hide");
                            }
                        }
                    });

                    if ($(".home_anim").length) {
                        gsap.set(".clip_swipe", {
                            x: $(".clip_swipe").attr("width")
                        });
                        gsap.set(".home_tiles>g", {
                            opacity: 0,
                        });
                        gsap.set(".home_zoom_x", {
                            scale: 0.12,
                            opacity: 0,
                            transformOrigin: "50% 50%",
                        });
                        gsap.set(".line_draw", {
                            opacity: 1,
                        });
                        gsap.set(".home_small_dot", {
                            x: -50,
                            transformOrigin: "50% 50%",
                        });

                        gsap.timeline()
                            .set(".home_type", {
                                opacity: 1,

                            })
                            .from($(".home_type").children().not(".x"), 0.5, {
                                opacity: 0,
                                x: -250,
                                transformOrigin: "50% 50%",
                                stagger: 0.01,
                                ease: Power3.easeOut,

                            })
                            .to(".home_small_dot", 0.8, {
                                opacity: 1,
                                x: 0,
                                transformOrigin: "50% 50%",
                            }, "-=0.5")
                            .to(".home_small_dot", 0.1, {
                                y: 0,
                                opacity: 1,
                                onComplete: function () {
                                    gsap.set(".drawpath", {
                                        opacity: 1,
                                    });
                                    if ($("#node").length) {
                                        $("#node").removeClass("hide");
                                    }
                                }
                            });

                        home_timeline
                            .to("#nos1", 1.5, {
                                scale: 1.5,
                                strokeWidth: 5,
                                motionPath: {
                                    path: "#followPath1",
                                    align: "#followPath1",
                                    autoRotate: true,
                                    alignOrigin: [0.5, 0.5],
                                }
                            })
                            .to(".clip_swipe", 1.5, {
                                width: 0,
                                x: 0,

                            }, "-=1.5")
                            .set(".home_zoom_x", {
                                opacity: 1,
                            })
                            .to(".home_zoom_x", 0.95, {
                                scale: 3.5,
                                transformOrigin: "50% 50%",
                            })
                            .set([".home_small_dot", ".home_text.x"], {
                                opacity: 0,
                            }, "-=0.95")
                            .to([".line_draw", ".top_border"], 0.2, {
                                opacity: 0,
                            }, "-=0.95")
                            .to(".home_type", 0.3, {
                                opacity: 0,
                                color: "#F1F2F2",
                            }, "-=0.95")
                            .to(".home_x", 0.3, {
                                color: "#E9E9EB",
                            }, "-=0.9")
                            .to(".home_large_dot", 0.1, {
                                opacity: 0,
                            }, "-=0.85")
                            .to("#circle_clip1", 0.95, {
                                attr: { r: 180 },
                            }, "-=0.95")
                            .to("#circle_clip1", 0.5, {
                                attr: { r: 2500 },
                                ease: Power2.easeOut,
                            })
                            .to(".home_anim", 0.2, {
                                opacity: 0,
                            }, "-=0.65")
                            .to(home, 0.3, {
                                backgroundColor: "#092331",
                            }, "-=0.4")
                            .to(".home_pattern_g_color", 0.3, {
                                opacity: 0.25,
                            }, "-=0.4")
                            .to(".home_pattern_g_gray", 0.1, {
                                opacity: 0,
                            }, "-=0.4")
                            .set("[data-homeTitle] .char", {
                                opacity: 0,
                                yPercent: 100,
                                transformOrigin: "center top",
                                transformStyle: "preserve-3d",
                            }, "-=0.1")
                            .set(".home_content", {
                                opacity: 1,
                                pointerEvents: "all",
                                onComplete: function () {
                                    gsap.set("[data-homeTitle] .char", {
                                        opacity: 0,
                                        yPercent: 100,
                                        transformOrigin: "center top",
                                        transformStyle: "preserve-3d",
                                    });
                                    gsap.to("[data-homeTitle] .char", 1, {
                                        opacity: 1,
                                        yPercent: 0,
                                        stagger: 0.02,
                                        transformOrigin: "center top",
                                        transformStyle: "preserve-3d",
                                        ease: Power2.easeOut,
                                    });
                                }
                            }, "-=0.1")
                            .set(".home_tiles", {
                                opacity: 1,
                            })
                            .to(".home_tiles>g", 0.5, {
                                opacity: 1,
                                stagger: {
                                    from: "random",
                                    amount: 0.5
                                }
                            })
                            .to(home, 0.5, {
                                opacity: 1,
                            });
                    }

                    //add intro timeline to main timeline;
                    main_timeline.add(home_timeline);
                }
                if ($(".full_section").length) {
                    let all_panel = $(".home_section");
                    let panel_timeline = gsap.timeline();

                    panel_timeline.set(".full_section", {
                        pointerEvents: "all",
                        onComplete: () => {
                            $(all_panel).removeClass("active");
                        }
                    });

                    all_panel.each(function (index) {
                        let panel = $(this); // panel
                        panel.addClass("panel" + (index + 1));

                        panel_timeline
                            .to(panel, 1.2, {
                                y: 0,
                                pointerEvents: "all",
                                onComplete: () => {
                                    $(all_panel).removeClass("active");
                                    $(panel).addClass("active");
                                },
                            })
                            .to(panel.find(".title1"), 1.2, {
                                opacity: 1,
                                y: 0,
                            }, "-=1.2")
                            .to(panel.find(".bg_left"), 1, {
                                opacity: 1,
                                x: 0,
                                ease: Power2.easeOut,
                            }, "-=0.6")
                            .to(panel.find(".section_left_box .big_img img"), 1, {
                                x: 0,
                                opacity: 1,
                            }, "-=1")
                            .to(panel.find(".bg_rt"), 1, {
                                opacity: 1,
                                x: 0,
                                ease: Power2.easeOut,
                            })
                            .to(panel.find(".section_right_box .big_img img"), 1, {
                                x: 0,
                                opacity: 1,
                            }, "-=1")
                            .to(panel.find(".title1"), 1, {
                                opacity: 0,
                            })
                            .to(panel.find(".title2"), 1, {
                                opacity: 1,
                            })
                            .to(panel.find(".fig_list li"), 0.5, {
                                opacity: 1,
                                stagger: 0.1,
                                y: 0,
                            }, "-=1")
                            .set(panel, {
                                pointerEvents: "none",
                            })
                    });

                    gsap.set(all_panel, {
                        zIndex: (i, target, targets) => i + 5,
                    });

                    //add intro timeline to main timeline;
                    main_timeline.add(panel_timeline);
                }
            },

            /// mobile animation:
            "(max-width: 767px)": function () {
                //// only home page intro anim
                if ($(".home_top_section").length) {
                    let home = $(".home_top_section");
                    let home_timeline = gsap.timeline();

                    if ($(".home_anim").length) {
                        gsap.set(".clip_swipe", {
                            x: $(".clip_swipe").attr("width")
                        });
                        gsap.set(".home_tiles>g", {
                            opacity: 0,
                        });
                        gsap.set(".home_zoom_x", {
                            scale: 0.12,
                            opacity: 0,
                            transformOrigin: "50% 50%",
                        });
                        gsap.set(".line_draw", {
                            opacity: 1,
                        });

                        gsap.set(".home_small_dot", {
                            x: -150,
                            transformOrigin: "50% 50%",
                        })

                        gsap.timeline()
                            .set(".home_type", {
                                opacity: 1,
                            })
                            .from($(".home_type").children(), 0.5, {
                                opacity: 0,
                                x: -100,
                                transformOrigin: "50% 50%",
                                stagger: 0.01,
                                ease: Power2.easeOut,
                            })
                            .to(".home_small_dot", 0.6, {
                                opacity: 1,
                                x: 0,
                                transformOrigin: "50% 50%",
                            }, "-=0.5")
                            .to(".home_small_dot", 0.1, {
                                y: 0,
                                opacity: 1,
                                transformOrigin: "50% 50%",
                                onComplete: function () {
                                    gsap.set(".drawpath", {
                                        opacity: 1,
                                    });
                                    if ($("#node").length) {
                                        $("#node").removeClass("hide");
                                    }
                                }
                            });

                        home_timeline
                            .to("#nos2", 1.5, {
                                scale: 1.5,
                                strokeWidth: 2,
                                motionPath: {
                                    path: "#followPath2",
                                    align: "#followPath2",
                                    autoRotate: true,
                                    alignOrigin: [0.5, 0.5],
                                }
                            })
                            .to(".clip_swipe", 1.5, {
                                width: 0,
                                x: 0,
                            }, "-=1.5")
                            .to(".home_zoom_x", 0.1, {
                                opacity: 1,
                            }, "-=0.1")
                            .to(".home_zoom_x", 1, {
                                scale: 50,
                                transformOrigin: "50% 50%",
                            })
                            .set([".home_small_dot", ".home_text.x"], {
                                opacity: 0,
                            }, "-=0.99")
                            .to([".line_draw", ".top_border"], 0.2, {
                                opacity: 0,
                            }, "-=0.95")
                            .to(".home_type", 0.2, {
                                opacity: 0,
                                color: "#F1F2F2",
                            }, "-=0.98")
                            .to(".home_x", 0.3, {
                                color: "#E9E9EB",
                            }, "-=0.7")
                            .to(".home_large_dot", 0.01, {
                                opacity: 0,
                            }, "-=0.98")
                            .to("#circle_clip2", 0.95, {
                                attr: { r: 80 },
                            }, "-=1")
                            .to("#circle_clip2", 0.3, {
                                attr: { r: 350 },
                                ease: Power2.easeOut,
                            })
                            .to(".home_anim", 0.2, {
                                opacity: 0,
                            }, "-=0.75")
                            .to(home, 0.3, {
                                backgroundColor: "#092331",
                            }, "-=0.4")
                            .to(".home_pattern_g_color", 0.3, {
                                opacity: 0.25,
                            }, "-=0.4")
                            .to(".home_pattern_g_gray", 0.1, {
                                opacity: 0,
                            }, "-=0.4")
                            .set("[data-homeTitle] .char", {
                                opacity: 0,
                                yPercent: 100,
                                transformOrigin: "center top",
                                transformStyle: "preserve-3d",
                            }, "-=0.1")
                            .set(".home_content", {
                                opacity: 1,
                                pointerEvents: "all",
                                onComplete: function () {
                                    gsap.set("[data-homeTitle] .char", {
                                        opacity: 0,
                                        yPercent: 100,
                                        transformOrigin: "center top",
                                        transformStyle: "preserve-3d",
                                    });
                                    gsap.to("[data-homeTitle] .char", 1, {
                                        opacity: 1,
                                        yPercent: 0,
                                        stagger: 0.02,
                                        transformOrigin: "center top",
                                        transformStyle: "preserve-3d",
                                        ease: Power2.easeOut,
                                    });
                                }
                            }, "-=0.1")
                            .to(".home_tiles", 0.01, {
                                opacity: 1,
                            })
                            .to(".home_tiles>g", 0.5, {
                                opacity: 1,
                                stagger: {
                                    from: "random",
                                    amount: 0.5
                                }
                            })
                            .to(home, 0.3, {
                                opacity: 1,
                            })

                    }

                    //add intro timeline to main timeline;
                    main_timeline.add(home_timeline);
                }
                if ($(".full_section").length) {
                    let all_panel = $(".home_section");
                    let panel_timeline = gsap.timeline();

                    panel_timeline.set(".full_section", {
                        pointerEvents: "all",
                        onComplete: () => {
                            $(all_panel).removeClass("active");
                        }
                    })
                        .to(".home_top_section", 1, {
                            xPercent: -100,
                        })

                    all_panel.each(function (index) {
                        let panel = $(this); // panel
                        panel.addClass("panel" + (index + 1));

                        if (index == 0) {
                            panel_timeline
                                .to(panel, 1, {
                                    x: 0,
                                    pointerEvents: "all",
                                    onComplete: () => {
                                        $(all_panel).removeClass("active");
                                        $(panel).addClass("active");
                                    },
                                }, "-=1")
                        }
                        else {
                            panel_timeline
                                .to($(panel).prev(), 0.5, {
                                    xPercent: -100,
                                    pointerEvents: "none",
                                    onComplete: () => {
                                        $(all_panel).removeClass("active");
                                    },
                                })
                                .to(panel, 0.5, {
                                    x: 0,
                                    pointerEvents: "all",
                                    onComplete: () => {
                                        $(all_panel).removeClass("active");
                                        $(panel).addClass("active");
                                    },
                                }, "-=0.5")
                        }
                        panel_timeline.to(panel.find(".title1"), 1.2, {
                            opacity: 1,
                            x: 0,
                        }, "-=1.2")
                            .to(panel.find(".bg_left"), 1, {
                                opacity: 1,
                                x: 0,
                            })
                            .to(panel.find(".section_left_box .big_img"), 1, {
                                x: 0,
                            }, "-=1")
                            .to(panel.find(".bg_left"), 1, {
                                delay: 0.1,
                                opacity: 1,
                                xPercent: -100,
                            })
                            .to(panel.find(".bg_rt"), 1, {
                                opacity: 1,
                                x: 0,
                            }, "-=1")
                            .to(panel.find(".section_left_box .big_img"), 1, {
                                opacity: 1,
                                xPercent: -100,
                            }, "-=1")
                            .to(panel.find(".section_right_box .big_img"), 1, {
                                opacity: 1,
                                x: 0,
                            }, "-=1")
                            .to(panel.find(".title1"), 1, {
                                opacity: 0,
                            }, "-=1")
                            .to(panel.find(".title2"), 0.5, {
                                opacity: 1,
                            })
                            .to(panel.find(".fig_list li"), 0.5, {
                                opacity: 1,
                                stagger: 0.1,
                                y: 0,
                            }, "-=0.5")
                            .set(panel, {
                                pointerEvents: "none",
                            });
                    });

                    gsap.set(all_panel, {
                        zIndex: (i, target, targets) => i + 5,
                    });

                    //add intro timeline to main timeline;
                    main_timeline.add(panel_timeline);
                }
            }
        });

        setTimeout(function () {
            if ($(".pg_content").length) {
                ScrollTrigger.create({
                    trigger: ".pg_content",
                    animation: main_timeline,
                    start: "top top",
                    end: "+=400%",
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true,
                });
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
                    // onEnterBack: () => {
                    //     bounceAnimateIn.play()
                    // },
                    // onLeave: () => {
                    //     bounceAnimateIn.reverse()
                    // },
                    // onLeaveBack: () => {
                    //     bounceAnimateIn.reverse()
                    // },
                    // markers: true,
                    onUpdate: (self) => {
                        if (self.progress > 0) {
                            document.querySelector("body").classList.remove("removebar");
                        }
                        else {
                            document.querySelector("body").classList.add("removebar");
                        }
                    }
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
                        // onEnterBack: () => {
                        //     fadeUpAnimateIn.play()
                        // },
                        // onLeave: () => {
                        //     fadeUpAnimateIn.reverse()
                        // },
                        // onLeaveBack: () => {
                        //     fadeUpAnimateIn.reverse()
                        // },
                        // markers: true,
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
        }, 50);


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

        if ($("#preloader").length) {
            gsap.set("#preloader svg", {
                opacity: 1,
            });
            gsap.set(".type_x", {
                opacity: 1,
                scale: 0.7,
                yPercent: 0.5,
                transformOrigin: "50% 50%",
            });

            gsap.set(".home_patternx", {
                scale: 2,
                transformOrigin: "50% 50%",
            });

            gsap.set("body", {
                backgroundColor: "#000",
            });

            //loader animation:
            setTimeout(function () {
                gsap.timeline()
                    .to(".big_x", 1, {
                        scale: 20,
                        transformOrigin: "50% 50%",
                        ease: Power2.easeIn,
                        onComplete: function () {
                            gsap.set(".big_x", {
                                opacity: 0,
                            });
                            gsap.set(".preloader", {
                                backgroundColor: "transparent",
                            });

                            //remove mobile svg if device is desktop
                            if (window.outerWidth > 768) {
                                $(".home_svg.mobile").remove();
                            }
                            //remove desktop svg if device is mobile
                            else {
                                $(".home_svg.desktop").remove();
                            }

                            after_init();

                            ScrollTrigger.matchMedia({
                                /// desktop animation:
                                "(min-width: 768px)": function () {
                                    gsap.to(".type_x", 0.3, {
                                        //  scale: 0.78,
                                        opacity: 0,
                                        transformOrigin: "50% 50%",
                                        onComplete: function () {
                                            //remove preloader
                                            $(".preloader").remove();

                                            // gsap.set("html,body", {
                                            //     pointerEvents: "all",
                                            //     overflowX: "hidden",
                                            //     overflowY: "auto",
                                            // });

                                            //scrolltrigger refresh
                                            ScrollTrigger.refresh();
                                        }
                                    });
                                },
                                /// mobile animation:
                                "(max-width: 767px)": function () {
                                    gsap.to(".type_x", 0.3, {
                                        scale: 0,
                                        opacity: 0,
                                        transformOrigin: "50% 50%",
                                        onComplete: function () {
                                            //remove preloader
                                            $(".preloader").remove();

                                            //scrolltrigger refresh
                                            ScrollTrigger.refresh();
                                        }
                                    })
                                }
                            });

                            setTimeout(() => {
                                document.querySelector(".scroll_to").classList.remove("hover");

                                ////idle time checking
                                idleInterval = setInterval(timerIncrement, 100);

                                document.addEventListener('keyup', resetTimer);
                                //  document.addEventListener('mousemove', resetTimer);
                                //  document.addEventListener('mouseup', resetTimer);
                                //   document.addEventListener('mousedown', resetTimer);
                                document.addEventListener('touchstart', resetTimer);
                                document.addEventListener("touchmove", resetTimer);
                                document.addEventListener('wheel', resetTimer);
                                //document.addEventListener('scroll', resetTimer, true); // improved; see comments

                                gsap.set("html,body", {
                                    pointerEvents: "all",
                                    overflowX: "hidden",
                                    overflowY: "auto",
                                });
                            }, 1500);
                        }
                    })
            }, 500);
        }
    }, 200);
});