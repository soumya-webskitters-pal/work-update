/*--------------------------------
---svg animation tatal function---
---------------------------------*/

/*--create path - svg--*/
//create svg function
function all_svg() {

	if (!document.querySelector("#page_line") && !document.querySelector("#page_line_stay")) {
		call_svg();
		svg_scroll();
	} else {
		document.querySelector("#page_line").remove();
		document.querySelector("#page_line_stay").remove();
		call_svg();
		svg_scroll();
	}

	function call_svg() {
		//get position--
		var item_name = [],
			svg_pos = [];
		var svg_height = 0,
			window_width = 0,
			svg_flag = 0;

		$(".pulsating-circle").each(function (index) {
			item_name[index] = this.id;
			//console.log(index + ": " + this.id);
		});

		//console.log(item_name);

		for (var i = 0; i < item_name.length - 1; i++) {
			//console.log(i);
			calculate_svg(item_name[i], item_name[i + 1]);
			svg_flag = 1;

			var last_item_pos = $("#" + item_name[item_name.length - 1]);
			//console.log(last_item_pos);
			svg_height = last_item_pos.offset().top + (last_item_pos.height() / 2);
		}

		if (svg_flag) {
			create_svg();
		}

		//calculation done here
		function calculate_svg(div_one, div_two) {
			var div1 = $("#" + div_one);
			var div2 = $("#" + div_two);
			//console.log(div_one, div_two);

			var x1 = div1.offset().left + (div1.width() / 2);
			var y1 = div1.offset().top + (div1.height() / 2);
			var x2 = div2.offset().left + (div2.width() / 2);
			var y2 = div2.offset().top + (div2.height() / 2);
			//console.log(x1 + " " + y1 + "," + x2 + " " + y2);
			window_width = $(window).width();
			//console.log(x1+"/"+y1+","+x2+"/"+y2);

			//create point
			svg_pos.push(x1, y1, (x1 - (x1 * 0.05)), (y1 + (y1 * 0.10)), (x2 + (x2 * 0.05)), (y2 - (y2 * 0.10)), x2, y2);
			//console.log(svg_pos);
		}

		//create svg
		function create_svg() {
			//mockup svg for all time
			//Make an SVG Container
			var svgContainer1 = d3.select("body").append("svg")
				.attr("width", window_width)
				.attr("height", svg_height)
				.attr("id", "page_line_stay")
				.attr("class", "page_line_class");
			//Draw the line
			svgContainer1.append("polyline")
				.style("stroke", "#fff")
				.style("stroke-width", "2")
				.style("fill", "none")
				.style("stroke-dasharray", "6")
				.style("opacity", ".5")
				.attr(
					"points", svg_pos
				)
				.attr(
					"class", "polyline_path_stay"
				);


			//--svg for animation
			//Make an SVG Container
			var svgContainer = d3.select("body").append("svg")
				.attr("width", window_width)
				.attr("height", svg_height)
				.attr("id", "page_line")
				.attr("class", "page_line_class");
			//Draw the line
			svgContainer.append("polyline")
				.style("stroke", "#fff")
				.style("stroke-width", "2")
				.style("fill", "none")
				.attr(
					"points", svg_pos
				)
				.attr(
					"class", "polyline_path"
				);
		}
	}
}

//call function
window.addEventListener('load', all_svg);
window.addEventListener('resize', all_svg);
/*--END create path - svg--*/


/*--svg scroll effect--*/
function svg_scroll() {
	// Get the id of the <path> element and the length of <path>
	var svg_shape_el = document.querySelector(".polyline_path");
	var svg_length = svg_shape_el.getTotalLength();
	//console.log(svg_length);

	// The start position of the drawing
	svg_shape_el.style.strokeDasharray = svg_length;

	// Hide the "svg_shape_el" by offsetting dash. Remove this line to show the "svg_shape_el" before scroll draw
	svg_shape_el.style.strokeDashoffset = svg_length;

	// Find scroll percentage on scroll (using cross-browser properties), and offset dash same amount as percentage scrolled
	window.addEventListener("scroll", svgScrollFunction);

	function svgScrollFunction() {
		var scrollpercent = (document.body.scrollTop + document.documentElement.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight);
		//console.log(document.documentElement.scrollTop);
		var draw = svg_length * scrollpercent;
		//console.log("draw:" + draw);
		// Reverse the drawing (when scrolling upwards)
		svg_shape_el.style.strokeDashoffset = (svg_length - draw);
	}
}
/*--END svg scroll effect--*/

/*------------------------------------
---END svg animation tatal function---
-------------------------------------*/