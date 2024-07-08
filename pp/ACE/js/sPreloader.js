/*
 * sPreLoader - jQuery plugin
 * Create a Loading Screen to preloader images and content for you website
 *
 * Name:         sPreLoader.js -- modified
 * Author:       Siful Islam  -- modified by S.pal
 * Date:         06.08 .16 -- modified 30.5.2020
 * Version:      1.0 -- modified 1.1
 *
 */

//load flag
var load_complete = false;

(function ($) {
    var items = new Array(),
        errors = new Array(),

        onCompleteP = function () {
            //set scroll position
            if (window.location.href.indexOf("target") > -1) {
                // console.log("your url target to a section");
                let target = location.hash;
                $('html,body').animate({
                    scrollTop: $(target).offset().top
                }, 2000, function () {
                    location.hash = target;
                });
            } else {
                // console.log("your url target to the top");
                window.scrollTo(0, 0);
            }

            var preloaderOutTl = new TimelineMax();
            var els = $(".lodr_anim"),
                lodr_logo = $(".lodr_logo");
            preloaderOutTl
                .to(jBar, 0.3, {
                    // y: 100,
                    // autoAlpha: 0,
                    ease: Back.easeIn,
                    onComplete: function () {
                        //// top padding for nav bar
                        $(".main_nav").next().css("padding-top", $(".main_nav").height());

                        //banner - full height
                        if ($(".banner .top_bnr_section").length) {
                            $(".banner .top_bnr_section").css("height", "calc(100vh - " + $(".main_nav").height() + "px)");
                            els.removeClass("anim");

                        }
                    }
                })
                .to(els, 0.3, {
                    marginLeft: "-5vw",
                    left: "50%",
                    delay: 0.2,
                    backgroundColor: "#fff"
                })
                .to(lodr_logo, 0.5, {
                    opacity: 1,
                })
                .to(lodr_logo, 0.3, {
                    delay: 1,
                    opacity: 0,
                })
                .to(els, 0.5, {
                    left: "60%",
                    opacity: 0
                })
                .to(jOverlay, 0.7, {
                    xPercent: 100,
                    ease: Power4.easeInOut
                })
                .set($('body'), {
                    className: 'page_ready',
                    onComplete: function () {
                        load_complete = true;
                        $("body").css("overflow", "auto");

                        //reInit banner slick slide
                        if ($('.txt_slider').length) {
                            $('.txt_slider').slick('reinit');
                        }
                        setTimeout(function () {
                            jOverlay.remove();
                        }, 300);
                    }
                })
        },
        current = 0;


    var jpreOptions = {
        preMainSection: '#main-preloader',
        prePerText: '.preloader-percentage-text',
        preBar: '.preloader-bar',
        showPercentage: true,
        debugMode: false,
        splashFunction: function () {}
    }

    var getImages = function (element) {
        $(element).find('*:not(script)').each(function () {
            var url = "";

            if ($(this).css('background-image').indexOf('none') == -1) {
                url = $(this).css('background-image');
                if (url.indexOf('url') != -1) {
                    var temp = url.match(/url\((.*?)\)/);
                    url = temp[1].replace(/\"/g, '');
                }
            } else if ($(this).get(0).nodeName.toLowerCase() == 'img' && typeof ($(this).attr('src')) != 'undefined') {
                url = $(this).attr('src');
            }

            if (url.length > 0) {
                items.push(url);
            }
        });
    }

    var preloading = function () {
        for (var i = 0; i < items.length; i++) {
            loadImg(items[i]);
        }
    }

    var loadImg = function (url) {
        var imgLoad = new Image();
        $(imgLoad)
            .load(function () {
                completeLoading();
            })
            .error(function () {
                errors.push($(this).attr('src'));
                completeLoading();
            })
            .attr('src', url);
    }

    var completeLoading = function () {
        current++;

        var per = Math.round((current / items.length) * 100);
        $(jBar).stop().animate({
            width: per + '%'
        }, 500, 'linear');

        $("body").css("overflow", "hidden");


        if (jpreOptions.showPercentage) {
            //$(jPer).text(per + "%");
            //modiy
            // $(".main-preloader-inner").css({
            //     "width": "" + per + "%",
            //     left: 0,
            // });
        }

        if (current >= items.length) {

            current = items.length;

            if (jpreOptions.debugMode) {
                var error = debug();
            }

            loadComplete();
        }
    }



    var loadComplete = function () {
        $(jBar).stop().animate({
            width: '100%'
        }, 500, 'linear', function () {
            onCompleteP();
        });
    }

    var debug = function () {
        if (errors.length > 0) {
            var str = 'ERROR - IMAGE FILES MISSING!!!\n\r'
            str += errors.length + ' image files cound not be found. \n\r';
            str += 'Please check your image paths and filenames:\n\r';
            for (var i = 0; i < errors.length; i++) {
                str += '- ' + errors[i] + '\n\r';
            }
            return true;
        } else {
            return false;
        }
    }

    var createContainer = function (tar) {

        jOverlay = $(jpreOptions.preMainSection);
        jBar = jOverlay.find(jpreOptions.preBar);
        jPer = jOverlay.find(jpreOptions.prePerText);

    }

    $.fn.jpreLoader = function (options, callback) {
        if (options) {
            $.extend(jpreOptions, options);
        }
        if (typeof callback == 'function') {
            onCompleteP = callback;
        }

        createContainer(this);
        getImages(this);
        preloading();
        return this;
    };

})(jQuery);


//// enable-disable window scroll
//keyboard-key: left: 37, up: 38, right: 39, down: 40, spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {
    32: 1,
    33: 1,
    34: 1,
    35: 1,
    36: 1,
    37: 1,
    38: 1,
    39: 1,
    40: 1
};

function preventDefault(e) {
    e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}
// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
    window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
        get: function () {
            supportsPassive = true;
        }
    }));
} catch (e) {}
var wheelOpt = supportsPassive ? {
    passive: false
} : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
// call this to Disable
function disableScroll() {
    window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
    window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
    window.addEventListener('keydown', preventDefaultForScrollKeys, false);
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
}
// call this to Enable
function enableScroll() {
    window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
    window.removeEventListener('touchmove', preventDefault, wheelOpt);
    window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
    document.getElementsByTagName('body')[0].style.overflow = 'auto';
}


jQuery(document).ready(function () {
    if (jQuery("#main-preloader").length) {
        jQuery('body').jpreLoader();
    }
});