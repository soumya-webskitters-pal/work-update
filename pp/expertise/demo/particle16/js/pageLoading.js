/*--How to use preloader--*/
/*
pageLoading({
    // background color of the progress bar
    barColor: 'rgb(240, 87, 87)',
    // top position of the progress bar
    barTop: '100px',
    // top position of the percentage text
    textTop: '200px',
    // background color of the loading overlay
    backColor: 'rgb(4, 12, 20)',
    // background color of the progress bar
    backBarColor: 'rgba(240, 87, 87,0.5)',
    // text inside the progress bar
    text: 'Loading <b>{process} %</b>',
    // show of hide the percentage text
    textVisible: true,
    loadOut: true
});
*/
/*--end preloader--*/

(function ($, window) {
    var pageLoadingidTime = true;
    var pageLoading_LoadS = 0;
    var pageLoading_Speed = 1;

    function pageLoading_Load(pageLoading_valueText) {

        if (pageLoadingidTime == true) {
            if (pageLoading_LoadS == 600) {
                pageLoading_Speed = 10;
            } else if (pageLoading_LoadS == 850) {
                pageLoading_Speed = 200;
            } else if (pageLoading_LoadS == 990) {
                pageLoading_Speed = 400;
            }
        } else {
            pageLoading_Speed = 1;
            pageLoading_LoadS = pageLoading_LoadS + 10;
        }
        if (pageLoading_LoadS >= 1000) {
            console.log("page Loaded");
            // console.clear();

            //custom  code--
            $("#main").css("opacity", 1);
            $("div.pageLoadingid11,div.pageLoadingid12,div.pageLoadingid13,div.pageLoadingid14").fadeOut(500);
            setInterval(() => {
                $("div.pageLoadingid11,div.pageLoadingid12,div.pageLoadingid13,div.pageLoadingid14").remove();
            }, 800);
            clearInterval();
            //--end--

            return false;
        }
        var pageLoading_loadingText = pageLoading_valueText.replace("{process}", Math.floor(pageLoading_LoadS / 10));
        $(".pageLoadingid12").html(pageLoading_loadingText);
        $(".pageLoadingid13").width((pageLoading_LoadS / 10) + '%');
        setTimeout(function () {
            pageLoading_Load(pageLoading_valueText)
        }, pageLoading_Speed);
        pageLoading_LoadS++;
    }

    function pageLoading(options) {
        var pageLoading_defaultText = 'Loading... <b>%{process}</b>';
        if (typeof options === 'object') {
            if ($("div.pageLoadingid11").length == 0) {
                $("body").prepend("<div class='loaderTotalBar pageLoadingid11'></div> ");
                $("body").prepend("<div class='loaderTextBox pageLoadingid12'></div> ");
                $("body").prepend("<div class='loaderBar pageLoadingid13'></div> ");
                $("body").prepend("<div class='preloader pageLoadingid14'></div> ");
                $("body").css("visibility", "visible");
            }
            pageLoadingidTime = true;
            pageLoading_LoadS = 0;
            pageLoading_Speed = 1;
            if ("barColor" in options)
                $("div.pageLoadingid13").css("background-color", options.barColor).css('box-shadow', '0 0 10px ' + options.barColor);
            if ("barTop" in options) {
                $("div.pageLoadingid13,div.pageLoadingid11").css("top", options.barTop);
            }
            if ("loadOut" in options) {
                if (options.loadOut == true) {
                    $(window).load(function () {
                        pageLoadingidTime = false;
                    });
                }
            }
            if ("textTop" in options) {
                $("div.pageLoadingid12").css("top", options.textTop);
            }
            if ("text" in options) {
                pageLoading_defaultText = options.text;
            }
            if ("backColor" in options) {
                $("div.pageLoadingid14").css("background-color", options.backColor);
            }
            if ("backBarColor" in options) {
                $("div.pageLoadingid11").css("background-color", options.backBarColor);
            }
            if ("textVisible" in options) {
                if (options.textVisible == false) {
                    $("div.pageLoadingid12").css("display", "none")
                }
            }
        } else if (typeof options === 'string') {
            pageLoadingidTime = false;
        } else {
            pageLoading({
                show: 'on'
            });
        }
        pageLoading_Load(pageLoading_defaultText);
    }
    window.pageLoading = pageLoading;
})(jQuery, window);