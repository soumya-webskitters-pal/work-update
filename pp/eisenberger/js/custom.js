"use strict";
const _mob_size = 991;

//body ready with noConflict
jQuery.noConflict()(function ($) {
    outerStyle();
    //resize function - call on body load and resize.
    function outerStyle() {
        // document.querySelector(".spray_container").style.height = window.innerHeight + "px";
        let win_height = window.innerHeight + "px";
        document.querySelector(".can_container").style.height = win_height;
        document.querySelector(".page_content_container").style.minHeight = win_height;
        document.body.style.minHeight = win_height;

        if (!document.querySelector(".can_container").classList.contains("home")) {
            document.body.style.paddingBottom = document.querySelector(".footer").clientHeight + 50 + "px";
        }

        if (window.innerWidth <= _mob_size) {
            $("[data-menu]").each(function () {
                $("[data-menu-target=" + $(this).attr("data-menu") + "]").css("backgroundColor", $(this).attr("data-color"));
            });
        }
        else {
            $("[data-menu-target]").css("backgroundColor", "transparent");
        }
    }
    window.addEventListener('resize', outerStyle);

    //click logo to goto home page
    $(".page_logo").on("click", function () {
        $("#fullpage").html('');
        $(".can_container").addClass("home");
        $(".spray_can").addClass("show");
        $(".navbar-toggler").addClass("collapsed");
        $("body").addClass("home");
        if (window.innerWidth <= _mob_size) {
            $(".spray_can").addClass("mob");
        }
        gsap.set(".spray_anim", { opacity: 1 });
        gsap.set(".dot", { opacity: 0 });
        $(".big_smile").hide();
        let n_path = $('.spray_anim line');
        n_path.each(function (i_cnt) {
            let cur_el = n_path.get(i_cnt);
            let length = cur_el.getTotalLength();
            $(this).css({
                'stroke-dashoffset': length + 1,
            });
        });
        setTimeout(function () {
            outerStyle();
            $(".spray_container").removeClass("hide");
            gsap.to(".spray_anim line", 0.25, {
                strokeDashoffset: 0,
                onComplete: function () {
                    gsap.to(".spray_anim", 0.2, { opacity: 0 });
                    gsap.set(".dot", { opacity: 1 });
                    gsap.from(".dot", 0.3, {
                        delay: 1, top: 0, left: 0, scale: 0, opacity: 0, rotate: 0,
                        onComplete: function () {
                            $(".lg-dot").addClass("anim");

                            if (window.innerWidth <= _mob_size) {
                                $(".spray_can").removeClass("mob").removeClass("show");
                            }
                        }
                    }, 0.1);
                }
            })
        }, 500);
    });

    //roll smile - animation
    let sm_tl = gsap.timeline({ pause: true, yoyo: true, })
        .to(".sm1>img", 1, { xPercent: -100, rotate: -360, ease: Power3.easeIn })
        .to(".sm1", 1, { xPercent: -100, }, "-=1")
        .to(".sm2>img", 1, { xPercent: -100, rotate: -360, ease: Power3.easeIn }, "-=1")
        .to(".sm2", 1, { xPercent: -100, }, "-=1");
    $(".big_smile").hide();



    //nav btn
    $(".navbar-toggler").on("click", function () {
        if ($(this).hasClass("collapsed")) {
            $(this).removeClass("collapsed");
            $(".spray_can").addClass("show");
        }
        else {
            $(this).addClass("collapsed");
            $(".spray_can").removeClass("show");
        }
    })
    $("[data-menu-target]").on("click", function () {
        window.location = $(this).children().attr("href");
        return false;
    });
    $("[data-menu-target],[data-menu]").on("click", function () {
        $(".can_container").removeClass("home");
        $(".spray_can").removeClass("show");
        $(".spray_container").addClass("hide");
        $(".navbar-toggler").addClass("collapsed");
        $("body").removeClass("home");
        outerStyle();
        $(".big_smile").fadeIn();
        sm_tl.reversed() ? sm_tl.play() : sm_tl.reverse();
    });
    $("[data-menu]").on("mouseenter", function () {
        $("[data-menu]").css("backgroundColor", "transparent");
        $(this).css("backgroundColor", $(this).attr("data-color"));
        if (window.innerWidth > _mob_size) {
            $("[data-menu-target]").removeClass("active").css("backgroundColor", "transparent");
            $("[data-menu-target=" + $(this).attr("data-menu") + "]").addClass("active").css("backgroundColor", $(this).attr("data-color"));
        }
        else {
            $("[data-menu-target]").removeClass("active");
            $("[data-menu-target=" + $(this).attr("data-menu") + "]").addClass("active");
        }
    });
    $("[data-menu-target]").on("mouseenter", function () {
        if (window.innerWidth > _mob_size) {
            $("[data-menu-target]").removeClass("active").css("backgroundColor", "transparent");
            $(this).addClass("active").css("backgroundColor", $("[data-menu=" + $(this).attr("data-menu-target") + "]").attr("data-color"));
        }
        else {
            $("[data-menu-target]").removeClass("active");
            $(this).addClass("active");
        }
        $("[data-menu=" + $(this).attr("data-menu-target") + "]").css("backgroundColor", $("[data-menu=" + $(this).attr("data-menu-target") + "]").attr("data-color"));
    });
    $("[data-menu], [data-menu-target]").on("mouseout", function () {
        if (window.innerWidth > _mob_size) {
            $("[data-menu-target]").removeClass("active").css("backgroundColor", "transparent");
        }
        else {
            $("[data-menu-target]").removeClass("active");
        }
        $("[data-menu]").css("backgroundColor", "transparent");
    });

    //pageloader
    jQuery(".bg,img,.body_bg").imagesLoaded({
        background: true,
    }).always(function () {
        gsap.set(".dot", { opacity: 0 });
        $(".dot").each(function (i) {
            let _scale = 1.6 + Math.random();
            if ($(this).hasClass("lg-dot") || $(this).hasClass("sm-dot")) {
                _scale = 1;
            }
            gsap.set($(this), {
                rotate: Math.random() * 15 * Math.PI,
                scale: _scale
            });
        });

        gsap.set($(".header"), { yPercent: -100, opacity: 0, });
        gsap.set($(".footer"), { opacity: 0, });
        let n_path = $('.spray_anim line');
        n_path.each(function (i_cnt) {
            let cur_el = n_path.get(i_cnt);
            let length = cur_el.getTotalLength();
            $(this).css({
                'stroke-dasharray': length + 1,
                'stroke-dashoffset': length + 1,
                'opacity': 1,
            });
        });
        if (window.innerWidth <= _mob_size) {
            $(".spray_can").addClass("mob");
        }
        setTimeout(function () {
            gsap.to($(".header"), 0.3, { yPercent: 0, opacity: 1, });
            gsap.to($(".footer"), 0.3, { opacity: 1, });
            gsap.set(".can_container", { opacity: 1 });
            gsap.set(".spray_anim", { opacity: 1 });
            gsap.set(".spray_can", { opacity: 1 });
            $(".spray_can").addClass("show");
            gsap.to(".spray_anim line", 0.25, {
                strokeDashoffset: 0,
                onComplete: function () {
                    gsap.set(".dot", { opacity: 1 });
                    gsap.to(".spray_anim", 0.2, { opacity: 0 });
                    gsap.from(".dot", 0.3, {
                        delay: 1, top: 0, left: 0, scale: 0, opacity: 0, rotate: 0,
                        onComplete: function () {
                            $(".lg-dot").addClass("anim");
                            if (window.innerWidth <= _mob_size) {
                                $(".spray_can").removeClass("mob").removeClass("show");
                            }
                        }
                    }, 0.1);
                }
            })
        }, 2000);
    });

    //end jquery ready
});