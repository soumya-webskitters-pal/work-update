/*
 * sPreLoader - jQuery plugin
 * Create a Loading Screen to preloader images and content for you website
 *
 * Name:         sPreLoader.js -- modified
 * Author:       Siful Islam  -- modified by S.pal
 * Date:         06.08 .16 -- modified 10.8.2020
 * Version:      1.0 -- modified 1.1
 *
 */

//disable scroll on load
disableScroll();
$("html").addClass("disable_scroll");

//load flag
var load_complete = false;

(function ($) {
    var items = new Array(),
        errors = new Array(),
        onCompleteP = function () {},
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

        if (jpreOptions.showPercentage) {
            $(jPer).text(per + "%");
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
            TweenMax.to(jOverlay, 0.9, {
                delay: 0.6,
                opacity: 0,
                ease: "back",
                onComplete: function () {
                    jOverlay.remove();
                    //set scroll pos to top
                    //  window.scrollTo(0, 0);
                    enableScroll();
                    $("html").removeClass("disable_scroll");
                    if (jQuery(window).width() <= 991) {
                        TweenMax.set(".main_nav .navbar-collapse", {
                            top: "-100%",
                            visibility: "hidden",
                            opacity: 0
                        });
                    } else {
                        TweenMax.set(".main_nav .navbar-collapse", {
                            top: "auto",
                            visibility: "visible",
                            opacity: 1
                        });
                    }
                }
            });
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



//enable-disable window scroll
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
}
// call this to Enable
function enableScroll() {
    window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
    window.removeEventListener('touchmove', preventDefault, wheelOpt);
    window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}


jQuery(document).ready(function () {
    if (jQuery("#main-preloader").length) {
        jQuery('body').jpreLoader();
    }
});