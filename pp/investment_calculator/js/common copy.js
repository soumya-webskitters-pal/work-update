"use strict";

jQuery.noConflict()(function ($) {
  if ($(".investment_calculator").length) {
    // document start
    let investment_amount = $("#monthly_investment_text"),
      investment_time = $("#time_period_text"),
      future_balance = $("#future_balance");

    let pp_txt = $("#principal_txt"),
      int_txt = $("#interest_txt"),
      tt_txt = $("#total_txt");

    let chart = Highcharts.chart("invest_chart", {
      title: false,
      credits: false,
      colors: ["#6DC05F", "#22224C"],
      background: "red",
      chart: {
        type: "pie",
        height: future_balance.parents(".chart_inner").width(),
        width: future_balance.parents(".chart_inner").width(),
      },
      tooltip: {
        valuePrefix: "$",
      },
      legend: false,
      // {
      //   align: "left",
      //   verticalAlign: "top",
      //   x: 0,
      //   y: 0,
      //   itemHoverStyle: {
      //     color: "red",
      //   },
      //    floating: true,
      // },
      plotOptions: {
        pie: {
          clip: true,
          allowPointSelect: false,
          cursor: "pointer",
          dataLabels: false,
          showInLegend: true,
        },
      },
      series: [
        {
          name: "Amount",
          colorByPoint: true,
          innerSize: "86%",

          data: [
            {
              name: "Invested Amount",
              y: callFn().invested_amount,
            },
            {
              name: "Est. Return",
              y: callFn().est_return,
            },
          ],
        },
      ],
    });

    window.addEventListener("resize", function () {
      chart.update({
        chart: {
          height: future_balance.parents(".chart_inner").width(),
          width: future_balance.parents(".chart_inner").width(),
        },
      });
    });

    $(".range_control").each((idx, el) => {
      let range_sl = $(el).find(".range_slider");
      let _inp = $(el).find("input[type='text']");
      range_sl.attr("data-start", trim_val(_inp.val()));

      let _range = noUiSlider.create(range_sl.get(0), {
        connect: "lower",
        start:
          range_sl.attr("data-start") != undefined
            ? Number(range_sl.attr("data-start"))
            : 0,
        step:
          range_sl.attr("data-step") != undefined
            ? Number(range_sl.attr("data-step"))
            : 1,
        range: {
          min:
            range_sl.attr("data-min") != undefined
              ? Number(range_sl.attr("data-min"))
              : 0,
          max:
            range_sl.attr("data-max") != undefined
              ? Number(range_sl.attr("data-max"))
              : 100,
        },
        format: wNumb({
          decimals: 0,
          thousand: ",",
          suffix:
            range_sl.attr("data-suffix") != undefined
              ? " " + range_sl.attr("data-suffix")
              : "",
          prefix:
            range_sl.attr("data-prefix") != undefined
              ? range_sl.attr("data-prefix")
              : "",
        }),
        // tooltips: true,
      });
      _range.on("update", (val) => {
        _inp.val(val);

        callFn();
        updateChart();
      });

      _inp.on("change", function () {
        _inp.text($(this).val().toLocaleString());
        _range.set($(this).val());

        callFn();
        updateChart();
      });

      _inp.on("click", function () {
        $(this).select();
      });

      // console.log(_range);
    });

    $(".chart_legend li").on("mouseenter", function () {
      let i = $(this).index();
      chart.series[0].data[i].setState("hover");
    });
    $(".chart_legend li").on("mouseleave", function () {
      let i = $(this).index();
      chart.series[0].data[i].setState("none");
    });

    function trim_val(inVal) {
      let val = inVal.toLowerCase().trim();
      if (val.search("year") >= 0) {
        val = Number(val.replace(" years", "").trim());
      } else if (val.search("$") >= 0) {
        val = Number(val.replace("$", "").replace(/,/g, "").trim());
      } else {
        val = 0;
      }
      return val;
    }
    function callFn() {
      var p = trim_val(investment_amount.val()), // principal
        t = trim_val(investment_time.val()); //time

      var slab_amount = 50000,
        r = 0.12; //anual interest rate

      var principal = p,
        interest = 0,
        balance = principal;

      if (r) {
        if (balance >= slab_amount) {
          r = 0.36;
        } else {
          r = 0.12;
        }
        var x = Math.pow(1 + r, t),
          compound_interest = p * x;
        interest = Number((compound_interest - principal).toFixed(2));
        balance = Number(compound_interest.toFixed(0));
        //  p = balance;
      }
      future_balance.text("$" + balance.toLocaleString());
      pp_txt.find("p").text("$" + p.toLocaleString());
      int_txt.find("p").text("$" + interest.toLocaleString());
      int_txt.find("h5>span").text("(" + r * 100 + "% Anual)");
      tt_txt.find("p").text("$" + balance.toLocaleString());

      return {
        invested_amount: p,
        est_return: balance,
      };
    }

    function updateChart() {
      chart.update({
        series: [
          {
            data: [
              {
                y: callFn().invested_amount,
              },
              {
                y: callFn().est_return,
              },
            ],
          },
        ],
      });
    }
  }
});
