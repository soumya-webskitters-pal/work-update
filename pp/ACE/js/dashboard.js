(function ($) {
  // Chart.js scripts
  if ($("#myAreaChart").length) {
    // -- Set new default font family and font color to mimic Bootstrap's default styling
    Chart.defaults.global.defaultFontFamily = '"futuraBT",-apple-system,system-ui,BlinkMacSystemFont,Roboto,sans-serif';
    Chart.defaults.global.defaultFontColor = '#000';
    // -- Area Chart Example
    var ctx = document.getElementById("myAreaChart");
    var myLineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ["Mar 1", "Mar 2", "Mar 3", "Mar 4", "Mar 5", "Mar 6", "Mar 7", "Mar 8", "Mar 9", "Mar 10", "Mar 11", "Mar 12", "Mar 13"],
        datasets: [{
          label: "Sessions",
          lineTension: 0.3,
          backgroundColor: "rgba(241, 225, 156, 0.3)",
          borderColor: "rgba(183, 137, 44, 1) ",
          pointRadius: 5,
          pointBackgroundColor: "rgba(183, 137, 44, 1) ",
          pointBorderColor: "rgba(241, 225, 156, 1)",
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(183, 137, 44, 1) ",
          pointHitRadius: 20,
          pointBorderWidth: 2,
          data: [10000, 30162, 26263, 18394, 18287, 28682, 31274, 33259, 25849, 24159, 32651, 31984, 38451],
        }],
      },
      options: {
        scales: {
          xAxes: [{
            time: {
              unit: 'date'
            },
            gridLines: {
              display: false
            },
            ticks: {
              maxTicksLimit: 7
            }
          }],
          yAxes: [{
            ticks: {
              min: 0,
              max: 40000,
              maxTicksLimit: 5
            },
            gridLines: {
              color: "rgba(0, 0, 0, .125)",
            }
          }],
        },
        legend: {
          display: false
        }
      }
    });
  }

  // Configure tooltips for collapsed side navigation
  $('.navbar-sidenav [data-toggle="tooltip"]').tooltip({
    template: '<div class="tooltip navbar-sidenav-tooltip" role="tooltip" style="pointer-events: none;"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
  })

  function stickey_nav() {
    if (jQuery(window).scrollTop() > 1) {
      jQuery('#mainNav').addClass('scroll_nav');
      jQuery('body').addClass('srink');
    } else {
      jQuery('#mainNav').removeClass('scroll_nav');
      jQuery('body').removeClass('srink');
    }
  }
  // sticky function call
  stickey_nav();


  //custom scroll
  if ($(".scroll_inner").length) {
    $(".scroll_inner").niceScroll(".wrap", {
      cursorwidth: "8px",
      background: "rgba(0, 0, 0,0.05)",
      cursorcolor: 'rgba(183, 137, 44,1)',
      cursorborder: '1px solid transparent',
      cursorborderradius: 10,
      horizrailenabled: false,
      cursoropacitymin: 1,
    });
  }

  //// window scroll function
  $(window).scroll(function () {
    // sticky function call
    stickey_nav();
  });

  ////window resize
  $(window).on("resize", function () {
    // sticky function call
    stickey_nav();

    //custom scroll resize
    if ($(".scroll_inner").length) {
      setTimeout(function () {
        $(".scroll_inner").getNiceScroll().resize();
      }, 300)
    }
  });

  $(".nav-tabs .nav-tab").click(function (e) {
    //custom scroll resize
    if ($(".scroll_inner").length) {
      setTimeout(function () {
        $(".scroll_inner").getNiceScroll().resize();
      }, 300)
    }
  });

  // Toggle the side navigation
  $("#sidenavToggler").click(function (e) {
    e.preventDefault();
    $("body").toggleClass("sidenav-toggled");
    $(".navbar-sidenav .nav-link-collapse").addClass("collapsed");
    $(".navbar-sidenav .sidenav-second-level, .navbar-sidenav .sidenav-third-level").removeClass("show");

    //custom scroll resize
    if ($(".scroll_inner").length) {
      setTimeout(function () {
        $(".scroll_inner").getNiceScroll().resize();
      }, 300)
    }
  });

  // Force the toggled class to be removed when a collapsible nav link is clicked
  $(".navbar-sidenav .nav-link-collapse").click(function (e) {
    e.preventDefault();
    $("body").removeClass("sidenav-toggled");

    //custom scroll resize
    if ($(".scroll_inner").length) {
      setTimeout(function () {
        $(".scroll_inner").getNiceScroll().resize();
      }, 300)
    }

  });

  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  $('body.fixed-nav .navbar-sidenav, body.fixed-nav .sidenav-toggler, body.fixed-nav .navbar-collapse').on('mousewheel DOMMouseScroll', function (e) {
    var e0 = e.originalEvent,
      delta = e0.wheelDelta || -e0.detail;
    this.scrollTop += (delta < 0 ? 1 : -1) * 30;
    e.preventDefault();
  });
  // Scroll to top button appear
  $(document).scroll(function () {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 200) {
      $('a.scroll-to-top').fadeIn();
    } else {
      $('a.scroll-to-top').fadeOut();
    }
  });

  // Configure tooltips globally
  $('[data-toggle="tooltip"]').tooltip();

  // Smooth scrolling using jQuery easing
  $(document).on('click', 'a.scroll-to-top', function (event) {
    $('html, body').stop().animate({
      scrollTop: 0
    }, 1000);
    event.preventDefault();
  });


  $(".show_search").click(function () {
    $(".search_itm").fadeToggle();
  });



  //mob navigation animation
  var estado = 0;
  $("#mainNav .navbar-toggler").click(function () {
    $(".search_itm").fadeOut();

    disableScroll();
    // let vw = $(window).width();
    let delay_time = 0.3;
    // $(this).toggleClass('open');
    // console.log(estado);
    if (estado === 0) {
      // TweenMax.to($("#bg-menu-mobile"), 1, {
      //   // x: -vw,
      //   height: "auto",
      //   ease: Expo.easeInOut
      // });
      $("#mainNav .navbar-collapse .navbar-nav li").each(function () {
        TweenMax.to($(this), 1.2, {
          // x: -vw,
          x: "-100%",
          // scaleX: 1,
          delay: delay_time,
          ease: Expo.easeInOut
        });
        delay_time += .04;
      });
      estado = 1;
    } else {
      estado = 0;
      // TweenMax.to($("#bg-menu-mobile"), 1.2, {
      //   // x: 0,
      //   height: 0,
      //   ease: Expo.easeInOut
      // });
      $("#mainNav .navbar-collapse .navbar-nav li").each(function () {
        TweenMax.to($(this), 1, {
          x: 0,
          delay: delay_time,
          ease: Expo.easeInOut
        });
        delay_time += .02;
      });
      enableScroll();
    }
  });



  $(".notification_itm .dropdown-toggle,  .user_ac .dropdown-toggle").click(function () {
    $(".search_itm").fadeOut();
  });

})(jQuery); // End of use strict