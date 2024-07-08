"use strict";
jQuery(document).ready(function ($) {
    // document start

    // Navbar
    $("<span class='clickD'></span>").insertAfter(".navbar-nav li.menu-item-has-children > a");
    $('.navbar-nav li .clickD').click(function (e) {
        e.preventDefault();
        var $this = $(this);

        if ($this.next().hasClass('show')) {
            $this.next().removeClass('show');
            $this.removeClass('toggled');
        } else {
            $this.parent().parent().find('.sub-menu').removeClass('show');
            $this.parent().parent().find('.toggled').removeClass('toggled');
            $this.next().toggleClass('show');
            $this.toggleClass('toggled');
        }
    });

    $(window).on('resize', function () {
        var win = $(this); //this = window
        if (win.width() < 1025) {
            $('html').click(function () {
                $('.navbar-nav li .clickD').removeClass('toggled');
                $('.toggled').removeClass('toggled');
                $('.sub-menu').removeClass('show');
            });
            $(document).click(function () {
                $('.navbar-nav li .clickD').removeClass('toggled');
                $('.toggled').removeClass('toggled');
                $('.sub-menu').removeClass('show');
            });
            $('.navbar-nav').click(function (e) {
                e.stopPropagation();
            });
        }
    });

    /* ===== For menu animation === */
    $(".navbar-toggler").click(function () {
        $(".navbar-toggler").toggleClass("open");
        $(".navbar-toggler .stick").toggleClass("open");
        $('body,html').toggleClass("open-nav");
    });
    // Navbar end

    //menu toggle
    if ($('#toggle').length) {
        let cr_el = $(".custom_nav>li"),
            cr = $("#main_nav"),
            overlay = $(".nav_bg"),
            tgl_btn = $('#toggle');

        gsap.set(cr_el, {
            x: "100",
            opacity: 0,
        });
        gsap.set(cr, {
            width: "0",
            opacity: 0,
            visibility: "hidden",
            pointerEvents: "none",
        });
        gsap.set(overlay, {
            opacity: 0,
            visibility: "hidden",
            scale: 1.5,
        });

        tgl_btn.click(function () {
            //CLOSE
            if ($(this).hasClass("toggle-active")) {
                let delay_time = 0,
                    _delay_each = 0.1;
                cr_el.each(function () {
                    gsap.to($(this), 0.7, {
                        x: "100",
                        opacity: 0,
                        delay: delay_time,
                        ease: Expo.easeInOut
                    });
                    delay_time += _delay_each;
                });

                tgl_btn.removeClass("toggle-active");

                setTimeout(function () {
                    cr.removeClass("nav-active");
                    gsap.to(overlay, 0.9, {
                        opacity: 0,
                        scale: 1.5,
                        ease: Expo.easeOut,
                    });
                    gsap.to(cr, 0.5, {
                        width: "0",
                        opacity: 0,
                        pointerEvents: "none",
                        ease: Expo.easeIn,
                        onComplete: function () {
                            gsap.set([cr, overlay], {
                                visibility: "hidden",
                            });
                            $("body").removeClass("noScroll");
                        }
                    });
                }, (cr_el.length * _delay_each) * 1000);
            }
            //OPEN
            else {
                tgl_btn.addClass("toggle-active");
                cr.addClass("nav-active");
                $("body").addClass("noScroll");
                gsap.to(overlay, 0.9, {
                    visibility: "visible",
                    opacity: 0.4,
                    delay: 1,
                    scale: 1,
                    ease: Expo.easeOut,
                });
                gsap.to(cr, 0.7, {
                    visibility: "visible",
                    pointerEvents: "all",
                    width: "100%",
                    opacity: 1,
                    ease: Expo.easeInOut,
                });
                let delay_time = 0,
                    _delay_each = 0.1;
                cr_el.each(function () {
                    gsap.to($(this), 1.3, {
                        x: "0",
                        opacity: 1,
                        delay: delay_time,
                        ease: Expo.easeInOut
                    });
                    delay_time += _delay_each;
                });
            }
        });
    }


    //nav Screen animation:
    function all_nav_loading() {
        let tl2 = gsap.timeline();
        tl2.set(".header-logo, .navbar-toggler, .tel_call", {
            translateY: '-100px',
            opacity: 0,
        });
        tl2.set(".social_links a", {
            translateY: '100px',
            opacity: 0,
        });

        tl2.to(".header-logo, .navbar-toggler, .tel_call", {
            duration: 0.5,
            opacity: 1,
            translateY: 0,
            translateX: 0,
            ease: Expo.easeOut
        })
            .to(".social_links a", {
                translateY: 0,
                opacity: 1,
                stagger: 0.1,
                ease: Expo.easeOut
            }, '+=0.1');
    }


    //ribbon navigation
    function ribbon_nav_anim(anim) {
        if (anim) {
            gsap.set(".ribbon_nav", {
                translateX: '100%',
                opacity: 0,
            });
            gsap.set(".ribbon_menu a", {
                translateX: '100px',
                opacity: 0,
            });
            let tl3 = gsap.timeline();
            tl3.to(".ribbon_nav", {
                translateX: 0,
                opacity: 1,
                ease: Expo.easeOut
            })
                .to(".ribbon_menu a", {
                    translateX: 0,
                    opacity: 1,
                    stagger: 0.1,
                    ease: Expo.easeOut
                }, '+=0.1');
        }
        else {
            gsap.set(".ribbon_nav, .ribbon_menu a", {
                translateX: 0,
                opacity: 1,
            });
            let tl4 = gsap.timeline();
            tl4.to(".ribbon_menu a", {
                translateX: '100px',
                opacity: 0,
                stagger: 0.1,
                ease: Expo.easeOut
            }, '+=0.1')
                .to(".ribbon_nav", {
                    translateX: '100%',
                    opacity: 0,
                    ease: Expo.easeOut
                })
        }
    }

    if ($(".ribbon_nav.showpage").length) {
        ribbon_nav_anim(true);
    }


    ////home animation =======
    function home_logo_anim(anim) {
        gsap.set(".cardWrapper", {
            perspective: 800,
        });
        gsap.set(".initial-logo_lft", {
            transformStyle: "preserve-3d",
            transformY: "130%",
        });

        gsap.set(".initial-logo_rt", {
            transformStyle: "preserve-3d",
            transformY: "-130%",
        });

        gsap.set(".middle-logo", {
            opacity: 0,
        });
        gsap.set(".header-txtlogo", {
            translateY: '100px',
            opacity: 0,
        });

        gsap.set(".text_sl_item", {
            opacity: 0,
            scale: 2,
            x: "-50%",
            y: "-50%",
            top: "50%",
            left: "50%",
            "-webkit-transform" : "translate(-50%, -50%)",
            "-ms-transform":"translate(-50%, -50%)"
        });

        var tl = gsap.timeline();
        tl.to(".initial-logo_lft", 0.5, {
            translateY: 0,
            ease: Power0.easeIn,
        }).to(".initial-logo_rt", 0.5, {
            translateY: 0,
            ease: Power0.easeIn,
        }, "=-0.5")
            .to(".middle-logo", 0.2, {
                opacity: 1,
                ease: Linear.easeNone,
                onComplete: function () {
                    $(".split_logo").remove();
                }
            })
            .to(".middle-logo", 0.1, {
                filter: "drop-shadow(0px 0px 25px #fff)",
                ease: Power0.easeIn,
            })
            .to(".middle-logo", 0.2, {
                opacity: 1,
                translateY: 0,
                ease: Power0.easeOut,
            }, "=-0.1")
            .to(".middle-logo", 0.3, {
                filter: "drop-shadow(0px 0px 0px #fff)",
                ease: Power0.easeIn,
            })
            .to(".middle-logo", 0, {
                filter: "none",
                ease: Linear.easeNone,
            })
            .to(".header-txtlogo", 0.1, {
                opacity: 1,
                translateY: 0,
                ease: Linear.easeNone,
                onComplete: function () {
                    let home_txt_sl = $(".text_sl_item"), sl_counter = 0;
                    gsap.set(".text_sl_item", {
                        opacity: 0,
                        scale: 2,
                        x: "-50%",
                        y: "-50%",
                        top: "50%",
                        left: "50%",
                        transformOrigin: "50% 50%",
                        "-webkit-transform" : "translate(-50%, -50%)",
                        "-ms-transform":"translate(-50%, -50%)"
                    });
                    let fadeuptl = gsap.timeline();
                    $(".centerlogo").click(function () {
                        if (sl_counter >= home_txt_sl.length) {
                            // sl_counter = 0;
                            gsap.set(".centerlogo", { pointerEvents: "none" });
                        }
                        let E = home_txt_sl[sl_counter];
                        // console.log(sl_counter)

                        if (fadeuptl.isActive()) {
                            fadeuptl.clear();
                            gsap.set(".text_sl_item", {
                                opacity: 0,
                                scale: 2,
                                x: "-50%",
                                y: "-50%",
                                top: "50%",
                                left: "50%",
                                transformOrigin: "50% 50%",
                                "-webkit-transform" : "translate(-50%, -50%)",
                        "-ms-transform":"translate(-50%, -50%)"
                            });
                        }
                        fadeuptl.set(".text_sl_item", {
                            opacity: 0,
                            scale: 2,
                            x: "-50%",
                            y: "-50%",
                            top: "50%",
                            left: "50%",
                            transformOrigin: "50% 50%",
                            "-webkit-transform" : "translate(-50%, -50%)",
                        "-ms-transform":"translate(-50%, -50%)"
                        }).to(E, 0.5, {
                            opacity: 1,
                            scale: 1,
                            x: "-50%",
                            y: "-50%",
                            top: "50%",
                            left: "50%",
                            transformOrigin: "50% 50%",
                            ease: Power2.easeIn,
                        }).to(E, 0.5, {
                            delay: 4,
                            scale: 2,
                            opacity: 0,
                            x: "-50%",
                            y: "-50%",
                            top: "50%",
                            left: "50%",
                            transformOrigin: "50% 50%",
                            ease: Power2.easeOut,
                        })
                        sl_counter++;
                    });

                    $(".centerlogo").addClass("complete");
                    gsap.to(".centerlogo", 0.4, {
                        delay: 0.5,
                        marginBottom: 0
                    });

                    gsap.to(".header-txtlogo", 1, {
                        delay: 2,
                        opacity: 0,
                        onComplete: function () {
                            $(".header-txtlogo").remove();
                            all_nav_loading();
                            ribbon_nav_anim(true);
                        }
                    })
                }
            }, "-=0.7")
    }
    if ($(".home_loader").length) {
        home_logo_anim();
    }

    if ($(".sub_sl").length) {
        $(".sub_sl").slick({
            dots: false,
            arrows: true,
            speed: 900,
            infinite: false,
            slidesToShow: 4,
            slidesToScroll: 4,
            variableWidth: true,
        });
    }

    function resize_pos() {
        if ($(".main_section_nav").length) {
            $(".main_section_nav").css("top", $(".main_section").offset().top + $(".main_section").outerHeight()).show();
        }
        if ($(".sub_section_top").length) {
            if ($('.sub_section_top').is(':empty')) {
                $('.sub_section_top').addClass("empty");
                $('.sub_section_top').next().addClass("pb-0");
            }
        }
    }
    window.addEventListener("resize", resize_pos);

    //reveal.js init
    if ($(".reveal").length) {
        gsap.set(".reveal>.slides", {
            opacity: 1,
        });
        Reveal.initialize({
            hash: false,
            respondToHashChanges: true,
            hashOneBasedIndex: true,// default is zero based
            history: false, //need hash true
            keyboard: true,
            keyboardCondition: 'focused',
            mouseWheel: true,
            controls: false,//show arrow
            controlsTutorial: true,
            controlsBackArrows: 'faded',
            progress: false,
            controlsLayout: 'edges',// Determines where controls appear, "edges" or "bottom-right",
            transition: 'slide',// none/fade/slide/convex/concave/zoom
            backgroundTransition: 'fade', // none/fade/slide/convex/concave/zoom
            center: true,// Vertical centering of slides
            disableLayout: true, //Disables the default layout to create custom
            // autoSlide: 10000,//10sec.
            loop: false,
            // slideNumber: 'h.v',
            minScale: 1,
            maxScale: 1,
            vertical: false,
            horizontal: true,
            parallaxBackgroundHorizontal: 200,
            parallaxBackgroundVertical: 50,
            autoSlideStoppable: true,
            autoSlideMethod: Reveal.navigateNext,
            hideAddressBar: true,
            autoSlide: 0,
            dependencies: [ // Comment in/out as needed
                //{ src: 'plugin/zoom-js/zoom.min.js', async: true}, // Alt+click zoom on elements
            ],
        });
        Reveal.initialize().then(() => {
            // reveal.js is ready
            gsap.to(".reveal>.slides", 0.75, {
                opacity: 1,
            })
            setTimeout(() => {
                all_nav_loading();
                ribbon_nav_anim(true);
            }, 400);
        });

        Reveal.addEventListener('ready', function (event) {
            $(".main_section1 section.sub_section").each(function (index) {
                $(".list_scroll_nav li:eq(" + index + ") a").attr("href", "#/0/" + (index + 1));
            });
            if ($(".sub_sl").length) {
                $(".sub_sl a").on("click", function () {
                    $(".sub_sl").slick('slickGoTo', parseInt($(this).parent().attr("data-slick-index")));
                });
            }
            resize_pos();

            if ($(".list_scroll_nav").length) {
                $(".list_scroll_nav a").on("mouseenter", function (ev) {
                    ev.preventDefault();
                    ev.stopImmediatePropagation();
                    window.location = $(this).attr("href");
                })
            }

            if ($(".main_section_nav").length) {
                Reveal.configure({ mouseWheel: false });
            }
        });

        Reveal.addEventListener('slidechanged', function (event) {
            // event.previousSlide, event.currentSlide, event.indexh, event.indexv
            // console.log(Reveal.getState().indexh, Reveal.getState().indexv);
            if (Reveal.getState().indexh == 0) {
                $(".list_scroll_nav li").removeClass("active");
                $(".list_scroll_nav li:eq(" + Reveal.getState().indexv + ")").addClass("active");
                //slide progress
                let list_progress = ((Reveal.getState().indexv) / ($(".main_section1 section.sub_section").length - 1) * 100);
                gsap.to(".list_progress>span", 0.2, {
                    width: list_progress + "%",
                });

                if ($(".list_scroll_nav.sl").length) {
                    $(".sub_sl").slick('slickGoTo', Reveal.getState().indexv - 1);
                }
            }
            resize_pos();
        });

        if ($(".reveal_scroll_box").length) {
            $(".reveal_scroll_box").niceScroll({
                cursorcolor: "#e1a76f",
                horizrailenabled: false,
                cursorwidth: "4px",
                cursorborder: "0",
                cursorborderradius: "0px",
                autohidemode: false,
                dblclickzoom: false,
                gesturezoom: false,
                bouncescroll: true,
                scrollbarid: true,
                touchbehavior: true,
                emulatetouch: true,
                disableoutline: true,
                // railalign: "left",
                background: "#fff",
            });
        }
    }


    //page scroll progress
    if ($(".page_progress").length) {
        $("body, html").css("overflow", "auto");
        $("body").addClass("scroll_body");
        function progressFunction() {
            var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            var scrolled = (winScroll / height) * 100;
            document.getElementById("pageBar").style.width = scrolled + "%";
        }
        window.onscroll = function () { progressFunction() };

        $(".page_progress").sticky({ topSpacing: $(".main-header").height(), zIndex: 5 });
    }


    //sticky logo
    jQuery(window).scroll(function () {
        if (jQuery(window).scrollTop() > 1) {
            jQuery(".main-header").addClass('sticky');
        } else {
            jQuery(".main-header").removeClass('sticky');
        }
    });


    //mouse cursor
    if ($("#node").length) {
        $("a:not('.logo'), button").addClass("mouse_btn");
        var initCursor = new NodeCursor({
            cursor: true,
            node: true,
            cursor_velocity: 1,
            node_velocity: 0.15,
            native_cursor: 'none',
            element_to_hover: '.mouse_btn',
            cursor_class_hover: 'disable',
            node_class_hover: 'expand',
            hide_mode: false,
            hide_timing: 2000,
        });
    }

    if ($(".block_slider").length) {
        let blk_slide = $(".block_slider");
        // let tot_sl_count =
        blk_slide.slick({
            dots: false,
            arrows: true,
            speed: 900,
            slidesToShow: 2,
            responsive: [
                {
                    breakpoint: 991,
                    settings: {
                        slidesToShow: 1,
                    }
                },
            ]
        });

        if (window.innerWidth > 768) {
            var prevSlideInterval = null,
                nextSlideInterval = null;

            function prevSlideAnimation() { blk_slide.slick("slickPrev"); };
            function nextSlideAnimation() { blk_slide.slick("slickNext"); };

            blk_slide.find('.slick-prev').on('mouseenter', function () {
                prevSlideInterval = window.setInterval(function () { prevSlideAnimation() }, 200);
            });

            blk_slide.find('.slick-prev').on('mouseleave', function () {
                window.clearInterval(prevSlideInterval);
            });

            blk_slide.find('.slick-next').on('mouseenter', function () {
                nextSlideInterval = window.setInterval(function () { nextSlideAnimation() }, 200);
            });

            blk_slide.find('.slick-next').on('mouseleave', function () {
                window.clearInterval(nextSlideInterval);
            });
        }
        //slide progress
        blk_slide.on('afterChange', function (event, slick, currentSlide, nextSlide) {
            let list_progress = (currentSlide / (slick.$slides.length - 1) * 100);
            gsap.to(".slide_progress>span", 0.2, {
                width: list_progress + "%",
            });
        });
    }

    if ($(".quote_slider").length) {
        $(".quote_slider").slick({
            dots: false,
            arrows: true,
            speed: 900,
            slidesToShow: 1,
            fade: true,
        })
    }


    //attorny page -- animate background image
    if ($(".bg_animate").length) {
        $(".bg_animate").each(function () {
            let atr_trg = $(this).find("div");
            if (atr_trg.length > 1) {
                img_Crl(atr_trg);
            }
            else {
                gsap.set(atr_trg, { autoAlpha: 1 })
            }
        })
        function img_Crl(attr_trgt) {
            const imgs = gsap.utils.toArray(attr_trgt);
            const next = 3; // time to change
            const fade = 0; // fade time
            //only for the first
            gsap.set(imgs[0], { autoAlpha: 1 })
            function crossfade() {
                const action = gsap.timeline()
                    .to(imgs[0], { autoAlpha: 0, duration: fade })
                    .to(imgs[1], { autoAlpha: 1, duration: fade }, 0)
                imgs.push(imgs.shift());
                // start endless run
                gsap.delayedCall(next, crossfade);
            }
            // start the crossfade after next
            gsap.delayedCall(next, crossfade);
        }
    }

    //horinzontal scroll
    if ($(".scroll_outer").length) {
        $(".scroll_outer").each(function () {
            let _scroll_outer = $(this);
            let _scroll = $(this).find(".scroll");

            let scroll_pr = _scroll.niceScroll({
                horizrailenabled: false,
                cursorwidth: "0",
                cursoropacitymax: 0,
                cursorborder: "0",
                autohidemode: "hidden",
                dblclickzoom: false,
                gesturezoom: false,
                bouncescroll: true,
                scrollbarid: true,
                touchbehavior: true,
                emulatetouch: true,
                disableoutline: true,
            });
            _scroll.on("scroll resize load", () => {
                //    console.log(scroll_pr.scrollvaluemax, scroll_pr.scrollvaluemaxw, scroll_pr.scroll.y); //initial,max,current value
                let list_progress = (scroll_pr.scroll.y * 100) / scroll_pr.scrollvaluemax;
                gsap.to(_scroll_outer.find(".list_progress.hr>span"), 0.1, {
                    height: list_progress + "%",
                });
            });
        });
    }


    if ($(".atr_sl1").length) {
        let atr_sl = $(".atr_sl1"), atr_form = $('form.atr_filter select');
        atr_form.selectpicker();
        //slider
        atr_sl.slick({
            dots: false,
            arrows: true,
            speed: 900,
            infinite: true,
            slidesToShow: 5,
            slidesToScroll: 1,
            pauseOnHover: false,
            pauseOnFocus: false,
            // centerMode: true,
            // centerPadding: '0',
            lazyLoad: 'ondemand',
            responsive: [
                {
                    breakpoint: 991,
                    settings: {
                        slidesToShow: 3,
                    }
                },
                {
                    breakpoint: 767,
                    settings: {
                        slidesToShow: 1,
                    }
                },
            ]
        });

        //slider filter
        atr_form.on('change', function () {
            $('.atr_filter_clr').show();
            var filterClass = getFilterValue();
            atr_sl.slick('slickUnfilter');
            atr_sl.slick('slickFilter', filterClass);
            copy_content(atr_sl.find(".atr_sl_item.slick-current"));
            if ($(".atr_sl .atr_sl_item").length == 0) {
                $(".atr_sl_msg").fadeIn();
                $(".atr_sl_dtl1").html('');
                $(".atr_sl_dtl1>.atr_dtl").stop().slideUp();
            }
            else {
                $(".atr_sl_msg").fadeOut();
                copy_content(atr_sl.find(".atr_sl_item.slick-current"));
            }
        });
        $('.atr_filter_clr').on("click", function () {
            $(".atr_sl_msg").fadeOut();
            atr_sl.slick('slickUnfilter');
            atr_form.val('default');
            atr_form.selectpicker("refresh");
            $('.atr_filter_clr').hide();
            copy_content(atr_sl.find(".atr_sl_item.slick-current"));
        });
        function getFilterValue() {
            var values = $('form.atr_filter').map(function () {
                var groupVal = $(this).find('select').map(function () {
                    return $(this).val();
                }).get();
                return groupVal.join('');
            }).get();
            return values.filter(function (n) {
                return n !== "";
            }).join(',');
        }
        let _copy = $(".atr_sl_dtl1");
        function copy_content(_copy_el) {
            _copy.html($(_copy_el).find(".atr_dtl").clone());
            _copy.find(".atr_dtl").css("display", "none");
        }

        if (window.innerWidth < 768) {
            //change text on slide change
            copy_content(atr_sl.find(".atr_sl_item.slick-current"));
            atr_sl.on('afterChange', function (event, slick, currentSlide, nextSlide) {
                copy_content(atr_sl.find(".atr_sl_item.slick-current"));
            });
        }
        else {
            // //change text on mouse over
            $(".atr_sl_item a").on("mouseenter", function () {
                _copy.stop().slideDown().addClass("show");
                copy_content($(this).closest(".atr_sl_item"));
                _copy.find(".atr_dtl").stop().slideDown();
            });
            $(".atr_sl_item a").on("mouseout", function () {
                _copy.removeClass("show");
                _copy.find(".atr_dtl").stop().slideUp();
            });

            //mouse whell to next/back
            $(".atr_sl_wheel").on('wheel', (function (e) {
                e.preventDefault();
                if (e.originalEvent.deltaY < 0) {
                    atr_sl.slick('slickNext');
                } else {
                    atr_sl.slick('slickPrev');
                }
            }));

            let sl_time, sl_speed = 100;
            atr_sl.find(".slick-next").on("mouseenter", function () {
                sl_time = setInterval(function () {
                    atr_sl.slick('slickNext');
                }, sl_speed);
            });
            atr_sl.find(".slick-prev").on("mouseenter", function () {
                sl_time = setInterval(function () {
                    atr_sl.slick('slickPrev');
                }, sl_speed);
            });
            atr_sl.find(".slick-next").on("mouseout", function () {
                clearInterval(sl_time);
            });
            atr_sl.find(".slick-prev").on("mouseout", function () {
                clearInterval(sl_time);
            });
        }
    }


    if ($(".blg_sl1").length) {
        $(".blg_sl1").slick({
            dots: false,
            arrows: true,
            speed: 900,
            infinite: true,
            slidesToShow: 5,
            slidesToScroll: 1,
            pauseOnHover: false,
            pauseOnFocus: false,
            lazyLoad: 'ondemand',
            prevArrow: '<button class="reveal_nav_btn atr_nav_lft"> Prev<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="284.935px" height="284.936px" viewBox="0 0 284.935 284.936" style="enable-background:new 0 0 284.935 284.936;" xml:space="preserve"><path fill="currentColor" d="M110.488,142.468L222.694,30.264c1.902-1.903,2.854-4.093,2.854-6.567c0-2.474-0.951-4.664-2.854-6.563L208.417,2.857 C206.513,0.955,204.324,0,201.856,0c-2.475,0-4.664,0.955-6.567,2.857L62.24,135.9c-1.903,1.903-2.852,4.093-2.852,6.567 c0,2.475,0.949,4.664,2.852,6.567l133.042,133.043c1.906,1.906,4.097,2.857,6.571,2.857c2.471,0,4.66-0.951,6.563-2.857 l14.277-14.267c1.902-1.903,2.851-4.094,2.851-6.57c0-2.472-0.948-4.661-2.851-6.564L110.488,142.468z"></path></svg></button>',
            nextArrow: '<button class="reveal_nav_btn atr_nav_rt">Next<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="284.935px" height="284.936px" viewBox="0 0 284.935 284.936" style="enable-background:new 0 0 284.935 284.936;" xml:space="preserve"><path fill="currentColor" d="M222.701,135.9L89.652,2.857C87.748,0.955,85.557,0,83.084,0c-2.474,0-4.664,0.955-6.567,2.857L62.244,17.133 c-1.906,1.903-2.855,4.089-2.855,6.567c0,2.478,0.949,4.664,2.855,6.567l112.204,112.204L62.244,254.677 c-1.906,1.903-2.855,4.093-2.855,6.564c0,2.477,0.949,4.667,2.855,6.57l14.274,14.271c1.903,1.905,4.093,2.854,6.567,2.854 c2.473,0,4.663-0.951,6.567-2.854l133.042-133.044c1.902-1.902,2.854-4.093,2.854-6.567S224.603,137.807,222.701,135.9z"></path></svg></button>',
        }).on('afterChange', function (event, slick, currentSlide, nextSlide) {
            let list_progress = (currentSlide / (slick.$slides.length - 1) * 100);
            gsap.to(".slide_progress>span", 0.2, {
                width: list_progress + "%",
            });
        });
    }

    $('.copyright select').selectpicker();


    if ($(".insight_banner").length) {
        $(".insight_banner_sl1").slick({
            dots: false,
            arrows: true,
            speed: 1000,
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            pauseOnHover: false,
            pauseOnFocus: false,
            adaptiveHeight: true,
            lazyLoad: 'ondemand',
            asNavFor: ".insight_banner_sl2",
            nextArrow: $(".inst_nav_rt"),
            prevArrow: $(".inst_nav_lft")
        });
        $(".insight_banner_sl2").slick({
            dots: false,
            arrows: false,
            speed: 1000,
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            vertical: true,
            pauseOnHover: false,
            pauseOnFocus: false,
            lazyLoad: 'ondemand',
            asNavFor: ".insight_banner_sl1",
        });
    };



    if ($(".progress_sl_outer").length) {
        $(".progress_sl_outer").each(function () {
            let blk_slide_outer = $(this);
            let blk_slide = blk_slide_outer.find(".progress_sl");
            blk_slide.slick({
                dots: false,
                arrows: true,
                speed: 900,
                infinite: true,
                slidesToShow: 4,
                responsive: [
                    {
                        breakpoint: 991,
                        settings: {
                            slidesToShow: 3,
                        }
                    },
                    {
                        breakpoint: 767,
                        settings: {
                            slidesToShow: 2,
                        }
                    },
                ]
            });
            // var prevSlideInterval = null,
            //     nextSlideInterval = null;

            // function prevSlideAnimation() { blk_slide.slick("slickPrev"); };
            // function nextSlideAnimation() { blk_slide.slick("slickNext"); };

            // blk_slide.find('.slick-prev').on('mouseenter', function () {
            //     prevSlideInterval = window.setInterval(function () { prevSlideAnimation() }, 200);
            // });

            // blk_slide.find('.slick-prev').on('mouseleave', function () {
            //     window.clearInterval(prevSlideInterval);
            // });

            // blk_slide.find('.slick-next').on('mouseenter', function () {
            //     nextSlideInterval = window.setInterval(function () { nextSlideAnimation() }, 200);
            // });

            // blk_slide.find('.slick-next').on('mouseleave', function () {
            //     window.clearInterval(nextSlideInterval);
            // });
            //slide progress
            blk_slide.on('afterChange', function (event, slick, currentSlide, nextSlide) {
                let list_progress = (currentSlide / (slick.$slides.length - 1) * 100);
                gsap.to(blk_slide_outer.find(".slide_progress>span"), 0.2, {
                    width: list_progress + "%",
                });
            });
        });
    }


    if ($(".tab_container").length) {
        $(".tab_container").each(function () {
            let _tab_container = $(this);
            _tab_container.find("[data-tab-target]").on("click", function (e) {
                e.preventDefault();
                if (!$(this).hasClass("active")) {
                    _tab_container.find("[data-tab]").stop(true, true).fadeOut().removeClass("active");
                    _tab_container.find("[data-tab-target]").removeClass("active");
                    $(this).addClass("active");
                    let target_tab = _tab_container.find("[data-tab=" + $(this).attr("data-tab-target") + "]");
                    target_tab.stop(true, true).fadeIn().addClass("active");
                    // $('html, body').animate({
                    //     scrollTop: target_tab.offset().top - $(".main-header").height() - 25
                    // }, 2000);
                }
            });
        });
    }

})