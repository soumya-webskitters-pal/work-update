"use strict";

//// preload anim
let tl_pre, pageLoad = false, checkInterval, slicebox,
    homeloader = document.getElementById("homepreloader");
let loadRetry = 0;
if (typeof (homeloader) != 'undefined' && homeloader != null) {
    tl_pre = new gsap.timeline({
        repeat: -1,
        repeatDelay: 1,
        yoyo: true,
        force3D: true,
        ease: "power1.inOut"
    });
    gsap.set(".preloader", {
        perspective: 200
    });
    gsap.set(".loader_inner", {
        transformStyle: "preserve-3d",
    });
    gsap.to(".preloader svg", 0.5, {
        opacity: 1,
    });

    tl_pre
        .to(".loader_inner", {
            delay: 1,
            rotationX: 180,

        })
        .to(".loader_inner", 1, {
            delay: 0.5,
            rotationY: 180,
        })
        .to(".loader_inner", 1, {
            delay: 0.5,
            rotationX: 0,
        })
        .to(".loader_inner", 1, {
            delay: 0.5,
            rotationY: 0,
        })
}

//set nav gap function
function navHeight() {
    let getHeaderHght = document.querySelector(".page_nav").clientHeight;
    return getHeaderHght;
}

jQuery(function ($) {
    gsap.registerPlugin(ScrollTrigger);

    ////parallax on scroll
    if ($("[data-type='parallax']").length) {
        let layers = document.querySelectorAll("[data-type='parallax']");
        for (let i = 0; i < layers.length; i++) {
            let layer = layers[i];
            let depth = layer.getAttribute("data-depth") * 20;
            gsap.to(layer, {
                yPercent: -depth,
                ease: "none",
                scrollTrigger: {
                    scrub: 0.7,
                },
            }, 0);
        }
    }


    ////parallax on mouse move
    if ($(".move_container").length) {
        let $parallaxContainer = $(".move_container"); //our container
        let $parallaxItems = $parallaxContainer.find(".round_move");  //elements
        let fixer = 0.009;	//experiment with the value
        $(document).on("mousemove", function (event) {
            let pageX = event.pageX - ($parallaxContainer.width() * 0.5),  //get the mouseX - negative on left, positive on right
                pageY = event.pageY - ($parallaxContainer.height() * 0.5); //get the mouseY - negative on top, positive on bottom
            //here we move each item
            $parallaxItems.each(function () {
                let item = $(this);
                let speedX = item.data("speed-x"),
                    speedY = item.data("speed-y");
                gsap.to(item, 0.2, {
                    x: (item.position().left + pageX * speedX) * fixer,
                    y: (item.position().top + pageY * speedY) * fixer
                });
            });
        });
    }

    //goto next section - banner
    if ($(".page_goto_btm").length) {
        $(".page_goto_btm").click(function (event) {
            event.preventDefault();
            let pos = $(".home_banner").get(0).clientHeight;
            $('html, body').stop().animate({ scrollTop: pos }, 1500, function () {
                $(".home_banner").removeClass("anim")
            });
        });
    }


    if ($("#menu").length) {
        gsap.set("#menu>ul>li", {
            xPercent: -100,
            opacity: 0,
        });
    }
    if ($(".sec_contact").length) {
        gsap.set($(".sec_contact>div").children(), {
            opacity: 0,
            x: -100,
        });
    }


    ///bottom animation
    if ($("#about").length) {
        let sec2_target = document.getElementById("sec2_reveal"),
            sec2 = document.getElementById("about"),
            secq_sec = document.getElementById("seq_sec"),
            sec2_video_target = document.getElementById("seq_trigger");
        $(".seq_trigger").removeClass("active");

        //anim -in
        function animateFrom(elem) {
            gsap.set($(elem).find(".sec_logo img"), { opacity: 0 });
            gsap.set($(elem).find(".sec_logo span"), { opacity: 0 });
            gsap.set($(elem).find(".lft_anim"), { opacity: 0 });
            gsap.set($(elem).find("p"), { opacity: 0 });
            gsap.set(sec2_video_target, { opacity: 0 });

            gsap.to($(sec2).find(".backgrop_sec"), {
                duration: 0.3,
                opacity: 1
            });
            gsap.fromTo($(elem).find(".sec_logo img"), { x: -100, autoAlpha: 0 }, {
                delay: 0.3,
                duration: 1,
                x: 0,
                autoAlpha: 1,
                ease: "expo",
                overwrite: "auto",
            });
            gsap.fromTo($(elem).find(".sec_logo span"), { y: 100, autoAlpha: 0 }, {
                delay: 0.3,
                duration: 1,
                y: 0,
                autoAlpha: 1,
                ease: "expo",
                overwrite: "auto",
            });
            gsap.fromTo($(elem).find(".lft_anim"), { x: -100, autoAlpha: 0 }, {
                duration: 1.5,
                x: 0,
                autoAlpha: 1,
                ease: "expo",
                overwrite: "auto",
            });
            gsap.fromTo($(elem).find(".rt_anim").children(), { x: 100, autoAlpha: 0 }, {
                duration: 1.5,
                x: 0,
                autoAlpha: 1,
                stagger: 0.1,
                ease: "expo",
                overwrite: "auto",
            });
            gsap.fromTo(sec2_video_target, {
                // y: 100,
                autoAlpha: 0
            }, {
                duration: 1.5,
                // y: 0,
                autoAlpha: 0,
                ease: "expo",
                overwrite: "auto",
            });
        }
        //anim - out
        function animateTo(elem) {
            gsap.to($(sec2).find(".backgrop_sec"), {
                duration: 0.3,
                opacity: 0,
            });
            gsap.to($(elem).find(".sec_logo img"), {
                duration: 1,
                x: -100,
                autoAlpha: 0,
                ease: "expo",
                overwrite: "auto",
            });
            gsap.to($(elem).find(".sec_logo span"), {
                duration: 1,
                y: 100,
                autoAlpha: 0,
                ease: "expo",
                overwrite: "auto",
            });
            gsap.to($(elem).find(".lft_anim"), {
                duration: 1,
                x: -100,
                autoAlpha: 0,
                ease: "expo",
                overwrite: "auto",
            });
            gsap.to($(elem).find(".rt_anim").children(), {
                duration: 1,
                x: 100,
                autoAlpha: 0,
                stagger: 0.1,
                ease: "expo",
                overwrite: "auto",
            });
            gsap.to(sec2_video_target, {
                duration: 1,
                // y: 100,
                autoAlpha: 0,
                ease: "expo",
                overwrite: "auto",
                onComplete: function () {
                    gsap.set($(elem).find(".sec_logo img"), { opacity: 0 });
                    gsap.set($(elem).find(".sec_logo span"), { opacity: 0 });
                    gsap.set($(elem).find(".lft_anim"), { opacity: 0 });
                    gsap.set($(elem).find("p"), { opacity: 0 });
                    gsap.set(sec2_video_target, { opacity: 0 });
                }
            });
        }

        function hide(elem) {
            gsap.set($(elem).find(".sec_logo img"), { opacity: 0 });
            gsap.set($(elem).find(".sec_logo span"), { opacity: 0 });
            gsap.set($(elem).find(".lft_anim"), { opacity: 0 });
            gsap.set($(elem).find("p"), { opacity: 0 });
            gsap.set(sec2_video_target, { opacity: 0 });
            $(".seq_trigger").removeClass("active");
        }

        ScrollTrigger.create({
            trigger: sec2_target,
            onEnter: function () { animateFrom(sec2_target) },
            onEnterBack: function () { animateFrom(sec2_target) },
            onLeave: function () {
                animateTo(sec2_target);
            },
            onLeaveBack: function () { hide(sec2_target) },
            start: "top 20%",
            end: "bottom 50%",
            scrub: false,
            // markers: true,
        });
        hide(sec2_target);
        // animateTo(sec2_target);
        gsap.set($(sec2).find(".backgrop_sec"), { opacity: 1, });

        ////scroll to play video
        const canvas = document.getElementById("sequence_canvas");
        const context = canvas.getContext("2d");
        const frameCount = 178, frame_duration = 600, frame_scrub = 2;
        const currentFrame = index => (
            `images/video/sequence1/scrollsequence${(index + 1).toString().padStart(3, '0')}.jpg`
        );
        const images = []
        const playVideo = {
            frame: 0
        };
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            images.push(img);
        }

        ScrollTrigger.create({
            trigger: sec2_target,
            pin: sec2,
            start: "top top",
            end: '+=' + (frame_duration + 50) + '%',
            scrub: frame_scrub,
            anticipatePin: 0.5,
            // markers: true,
        });

        gsap.timeline().to(playVideo, {
            // duration: 20,
            frame: frameCount - 1,
            snap: "frame",
            ease: "none",
            scrollTrigger: {
                ease: "none",
                scrub: frame_scrub,
                // markers: true,
                trigger: sec2_video_target,
                // pin: ".bottom_banner",
                // pinSpacing: true,
                start: 'top center',
                end: '+=' + frame_duration + '%',
            },
            onUpdate: render // use animation onUpdate instead of scrollTrigger's onUpdate
        });


        ///first load canvas-- only first image
        images[0].onload = render;

        function render() {
            canvas.width = secq_sec.clientWidth;
            canvas.height = secq_sec.clientHeight;
            context.clearRect(0, 0, canvas.width, canvas.height);
            const win = {
                w: secq_sec.clientWidth,
                h: secq_sec.clientHeight,
            };
            const imgRatio = images[0].naturalHeight / images[0].naturalWidth,
                winRatio = secq_sec.clientHeight / secq_sec.clientWidth;
            if (imgRatio > winRatio) {
                const h = secq_sec.clientWidth * imgRatio;
                context.drawImage(images[playVideo.frame], 0, (secq_sec.clientHeight - h) / 2, secq_sec.clientWidth, h)
            }
            else if (imgRatio < winRatio) {
                const w = secq_sec.clientWidth * winRatio / imgRatio;
                context.drawImage(images[playVideo.frame], (win.w - w) / 2, 0, w, secq_sec.clientHeight)
            }


            //console.log(playVideo.frame);
            if (playVideo.frame > 25 && playVideo.frame < (frameCount - 50)) {
                $(".seq_trigger").addClass("active");
            }
            else {
                $(".seq_trigger").removeClass("active");
            }
        }

        window.addEventListener('resize', render);

        //wait for all image load -- untill load, show page loader
        let imgLoadCounter = 0;
        for (let m = 0; m < images.length; m++) {
            images[m].addEventListener('load', function () {
                imgLoadCounter++;
                if (imgLoadCounter == frameCount) {
                    console.log(imgLoadCounter + " images loaded successfully");
                    pageLoad = true;
                    images[0].onload = render;
                }
            });
            images[m].addEventListener('error', function () {
                pageLoad = false;
            });
        }

        //goto next section --bottom banner
        if ($(".seq_trigger_btn").length) {
            $(".seq_trigger_btn").click(function (event) {
                event.preventDefault();
                let pos = $(".nxt_fix").get(0).offsetTop;
                $(".seq_trigger").removeClass("active");
                $('html, body').animate({ scrollTop: pos }, 1000, function () {
                    $("#about").removeClass("anim")
                });
            });
        }
    }
    else {
        pageLoad = true;
    }

    if ($(".all_tribal").length) {
        gsap.set(".all_tribal path", {
            opacity: 1,
        })
        $(".all_tribal .trb_g").each(function (index) {
            $(this).attr("mask", "url(#cstMask" + index + ")");
            $(".all_tribal mask:eq(0)").clone().attr("id", "cstMask" + index).addClass("trib_mask").prependTo(".all_tribal>svg");
        });
        gsap.set(".trib_mask rect", {
            yPercent: 100,
        });
    }


    let page_index = 1;
    ////menu
    if ($("#menu").length) {
        window.slinky = $('#menu').slinky({
            speed: 500,
            title: true,
        });

        ///page index
        // $("#menu a[data-href]").each(function () {
        //     let pages = $(this).attr("data-href").slice(1);
        //     window.history.pushState({ page: page_index + 1 }, pages, "?/" + pages);
        //     $(this).attr("data-page", page_index + 1);
        // });
        // window.history.pushState({ page: 1 }, "about", "/about");
        // window.history.pushState({ page: 0 }, "home", "/home");
        // $("#menu a[href='#home']").attr("data-page", 0);
        // $("#menu a[href='#about']").attr("data-page", 1);


        /// page banner animation
        function bannerAnim(el) {
            let els = $("[data-page='" + el + "']");
            // console.log(els);
            gsap.to(els.find("video"), 1, {
                opacity: 1,
                stagger: 0.1,
            });
            els.find("video").each(function () {
                this.play();
                $(this).attr("loop", "true");
                $(this).attr("autoplay", "true");
                $(this).attr("playinline", "true");
            });
        }

        /// click to change page
        $("#menu a[data-href]").on("click", function (e) {
            e.preventDefault();
            let pages = $(this).attr("data-href");
            // console.log(page);
            if (pages.length && $("[data-page='" + pages + "']").length) {
                $("[data-page]").removeClass("active").hide();
                $("[data-page='" + pages + "']").addClass("active").show();
                $("#menu a[data-href]").removeClass("active");
                $(this).addClass("active");
                bannerAnim(pages);
                window.history.pushState({ page: page_index + 1 }, pages, "?/" + pages);
            }
        });
        $("#menu a[href^='#home'],.gotoHome").on("click", function (e) {
            e.preventDefault();
            $("html, body").animate({ scrollTop: 0 }, 1000);
        });
        $("#menu a[href^='#about']").on("click", function (e) {
            e.preventDefault();
            $("html, body").animate({ scrollTop: window.outerHeight }, 1000);
        });
    }


    function page_load() {
        window.scrollTo(0, 0);

        //stop intro animation:
        tl_pre.clear();

        gsap.timeline()
            .to(".preloader", 1, {
                delay: 1.5,
                ease: Expo.easeOut,
                opacity: 0,
                onComplete: function () {
                    //remove preloader
                    $(".preloader").remove();
                }
            });
        gsap.from(".logo1", 0.4, {
            delay: 2,
            opacity: 0,
            yPercent: 100,
        });
        gsap.from(".logo2", 0.4, {
            delay: 2.4,
            opacity: 0,
            xPercent: 100,
            onComplete: () => {
                if ($(".header_content").length) {
                    gsap.set('#maskpos', { scaleY: 0.1, opacity: 0, });
                    $(".header_content").addClass("anim");
                    gsap.timeline()
                        .to(".trib_mask rect", 1, {
                            delay: 1,
                            stagger: 0.08,
                            yPercent: 0,
                        })
                        .to('.banner_caption', 0.2, {
                            opacity: 1,
                        })
                        .to('#maskpos', 0.2, {
                            opacity: 0,
                            ease: Power1.easeIn,
                        })
                        .to('#maskpos', 0.2, {
                            opacity: 1,
                            ease: Power1.easeOut,
                        })
                        .to('#maskpos', 0.3, {
                            scaleY: 1,
                            x: 0,
                            y: 0,
                            ease: Elastic.ease,
                        })
                        .to('#maskpos', 0.5, {
                            x: -210,
                            ease: Elastic.ease,
                        })
                        .from('#maskpos_left', 0.5, {
                            attr: {
                                width: 0,
                                ease: Power1.ease,
                            },
                        })
                        .to('#maskpos', 0.5, {
                            x: 260,
                            ease: Power1.ease,
                        }, "-=0.5")
                        .from('#maskpos_right', 0.5, {
                            attr: {
                                width: 0,
                                x: 473.99,
                            },
                            ease: Power1.ease,
                        })
                        .to('#maskpos', 0.5, {
                            x: -60,
                            ease: Power1.ease,
                        }, "-=0.5")
                        .to('#maskpos', 0.3, {
                            x: -90,
                            ease: Power1.ease,
                        }, "-=0.1")
                        .to('#maskpos', 1, {
                            x: 0,
                            ease: Power3.easeIn
                        })

                        .to('.banner_para>p', 1, {
                            y: 0,
                            opacity: 1,
                            ease: Power2.easeInOut,
                            onComplete: () => {
                                $(".page_goto_btm").addClass("bounce");
                                if ($('.sb-slider').length) {
                                    const images = gsap.utils.toArray('.sb-slider img'),
                                        duration = 1.5,
                                        delay = 5;
                                    const banner_tl = gsap.timeline({ onComplete: repeat });
                                    images.forEach((image, index) => {
                                        // console.log(image);
                                        let offset = index === 0 ? 0 : "-=" + duration;
                                        banner_tl.to(image, {
                                            opacity: 1,
                                            duration,
                                            repeat: 1,
                                            repeatDelay: delay,
                                            yoyo: true,
                                            ease: Expo,
                                        }, offset);

                                        if (index === 0) {
                                            gsap.to(".canvas-slider img.frst", delay, { opacity: 0, });
                                        }
                                        if (index === images.length - 1) {
                                            banner_tl.to(images[0], { duration, opacity: 1, }, offset)
                                        }
                                    });
                                    function repeat() {
                                        banner_tl.play(duration);
                                    }
                                }
                            }
                        }, "-=2")
                        .set('.banner_para>p', {
                            delay: 5,
                            opacity: 1,
                        })
                }
            }
        });
    }


    //init setup
    window.scrollTo(0, 0);
    jQuery(".bg,img")
        .imagesLoaded({
            background: true,
        })
        .always(function () {
            window.scrollTo(0, 0);

            ////frame height:
            if ($(".sec3").length) {
                gsap.set(".sec_frame_all", { paddingTop: document.querySelector(".sec3_logo").clientHeight });

                if ($("#menu").length) {
                    gsap.to("#menu>ul>li", 1.5, {
                        xPercent: 0,
                        opacity: 1,
                        stagger: 0.1,
                        clearProps: true,
                        scrollTrigger: {
                            trigger: '.sec3',
                            start: "top 30%",
                            end: "top top",
                            scrub: false,
                            invalidateOnRefresh: true,
                            onEnter: function () {
                                gsap.to($(".sec_contact>div").children(), 1, {
                                    opacity: 1,
                                    x: 0,
                                    stagger: 0.1,
                                });
                            },
                            //markers: true,
                        },
                    });
                }
            }

            ///play only one audio at a time
            if ($(".audio_box").length) {
                $(".audio_box audio").on("play", function () {
                    $(".audio_box audio").not(this).each(function (index, audio) {
                        audio.pause();
                    });
                });
            }

            /// click to goto id
            // $("#menu a[href^='#']").on("click", function (e) {
            //     e.preventDefault();
            //     let s = $(this).attr("href");
            //     let offset = $(s).position().top;
            //     // console.log(s, offset);
            //     if (s) {
            //         setTimeout(function () {
            //             $("html, body").animate({ scrollTop: offset }, 1000);
            //         }, 100);
            //     }
            // });

            checkInterval = setInterval(page_init, 300);
            function page_init() {
                loadRetry++;
                console.log("page loading...");
                if (pageLoad) {
                    clearInterval(checkInterval);
                    page_load();
                }
                if (loadRetry > 500) {
                    clearInterval(checkInterval);
                    //stop intro animation:
                    tl_pre.clear();
                    gsap.to(".loader_inner", 0.3, {
                        transformStyle: "preserve-3d",
                        rotationY: 0,
                        rotationX: 0,
                    });
                    $("body").css("position", "fixed");
                    $("body").children().not(homeloader).remove();
                    $(homeloader).addClass("fail").append("<p>Sorry, page is not loading<br/> Please reload the page</p>")
                }
            }
        });
});
