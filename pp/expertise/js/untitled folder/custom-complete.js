/*
//calc. line position
function recalc_line_pos() {
	//--calculate top
	var target_sec_top = $("#pagepiling .section").find(".circle-pic");
	var sec_pos_offset_top = target_sec_top.offset();
	var sec_pos_top_set = sec_pos_offset_top.top + (target_sec_top.height() / 2);
	//console.log(sec_pos_top_set);

	//--calculate left
	//var sec_pos_offset_left = sec_pos_offset_top.left + (target_sec_top.width() / 2);

	//--calculate height
	var target_sec_bottom = $("#pagepiling .section").last().find(".circle-pic");
	var sec_pos_offset_bottom = target_sec_bottom.offset();
	var sec_pos_bottom_height = sec_pos_offset_bottom.top + (target_sec_bottom.height() / 2) - sec_pos_top_set;
	//console.log(sec_pos_bottom_height);
	jQuery(".page_progress").css({
		"top": "" + sec_pos_top_set + "px",
		"height": "" + sec_pos_bottom_height + "px"
	});
	// jQuery("#mySVG").css({
	// 	"height": "" + sec_pos_bottom_height + "px"
	// });
}
//END - calc. line position

$(document).ready(function () {
	recalc_line_pos();
});
*/

/*--create svg--*/
//create svg function

//get position--
var item_name = [];

$(".pulsating-circle").each(function (index) {
	item_name[index] = this.id;
	//console.log(index + ": " + this.id);
});
//console.log(item_name);

for (var i = 0; i < item_name.length - 1; i++) {
	//console.log(i);
	create_svg(item_name[i], item_name[i + 1]);
}


//calculation done here
function create_svg(div_one, div_two) {
	var div1 = $("#" + div_one);
	var div2 = $("#" + div_two);
	//console.log(div_one, div_two);

	var x1 = div1.offset().left + (div1.width() / 2);
	var y1 = div1.offset().top + (div1.height() / 2);
	var x2 = div2.offset().left + (div2.width() / 2);
	var y2 = div2.offset().top + (div2.height() / 2);
	//console.log(x1 + " " + y1 + "," + x2 + " " + y2);
	var window_width = $(window).width();

	//console.log(x1+"/"+y1+","+x2+"/"+y2);

	//Make an SVG Container
	var svgContainer = d3.select("body").append("svg")
		.attr("width", window_width)
		.attr("height", y2)
		.attr("id", "page_line");
	//Draw the line
	svgContainer.append("polyline")
		.style("stroke", "#fff")
		.style("stroke-width", "2")
		.style("fill", "none")
		.style("stroke-dasharray", "4")
		.style("opacity", ".5")
		.attr(
			"points",
			"" + (x1) + " " + (y1) + "," +
			"" + (x1 - (x1 * 0.05)) + " " + (y1 + (y1 * 0.10)) + "," +
			"" + (x2 + (x2 * 0.05)) + " " + (y2 - (y2 * 0.10)) + "," +
			"" + (x2) + " " + (y2) + ""
		)
		.attr(
			"id", "polyline_path"
		);
}

function call_svg() {
	create_svg();
	/*if (!document.querySelector("#page_line")) {
		create_svg();
		svg_scroll();
	} else {
		document.querySelector("#page_line").remove();
		create_svg();
		svg_scroll();
	}*/
}

//call function
window.addEventListener('load', call_svg);
window.addEventListener('resize', call_svg);
/*--END create svg--*/



/*--svg scroll effect--*/

function svg_scroll() {
	// Get the id of the <path> element and the length of <path>
	var svg_shape_el = document.getElementById("polyline_path");
	var svg_length = svg_shape_el.getTotalLength();
	console.log(svg_length);

	// The start position of the drawing
	svg_shape_el.style.strokeDasharray = svg_length;

	// Hide the "svg_shape_el" by offsetting dash. Remove this line to show the "svg_shape_el" before scroll draw
	svg_shape_el.style.strokeDashoffset = svg_length;

	// Find scroll percentage on scroll (using cross-browser properties), and offset dash same amount as percentage scrolled
	window.addEventListener("scroll", svgScrollFunction);

	function svgScrollFunction() {
		var scrollpercent = (document.body.scrollTop + document.documentElement.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight);
		console.log(document.documentElement.scrollTop);
		var draw = svg_length * scrollpercent;
		console.log("draw:" + draw);
		// Reverse the drawing (when scrolling upwards)
		svg_shape_el.style.strokeDashoffset = svg_length - draw;
	}
}
/*--END svg scroll effect--*/