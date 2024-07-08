var anim_timer;

//reset all element
//seed
TweenMax.set(".seed", {
	bottom: '100%',
	opacity: 0.4,
});

//small tree
TweenMax.set(".small_tree", {
	opacity: 0,
});
TweenMax.set("#tree", {
	scale: 0,
	transformOrigin: "center bottom"
});
TweenMax.set("#leaf-rb", {
	scale: 0,
	rotation: '-60cw',
	y: -15,
	transformOrigin: "left bottom"
});
TweenMax.set("#leaf-rm", {
	scale: 0,
	rotation: '-50cw',
	y: 30,
	transformOrigin: "left bottom"
});
TweenMax.set("#leaf-lb", {
	scale: 0,
	rotation: '60cw',
	y: -80,
	transformOrigin: "right bottom"
});
TweenMax.set("#leaf-lm", {
	scale: 0,
	rotation: '40cw',
	y: -90,
	transformOrigin: "right bottom"
});
TweenMax.set("#leaf-top", {
	scale: 0,
	transformOrigin: "center bottom"
});



//big tree
TweenMax.set(".cls-2_tree1", {
	opacity: 0,
});

TweenMax.set(".cls-1_tree1", {
	scale: 0,
	transformOrigin: "right bottom"
});
TweenMax.set(".cls-1_tree0", {
	scale: 0,
	transformOrigin: "left bottom"
});
TweenMax.set(".cls-8_tree", {
	scale: 0,
	transformOrigin: "center bottom"
});
TweenMax.set(".cls-7_tree", {
	scale: 0,
	transformOrigin: "left bottom"
});

TweenMax.set(".main_tree", {
	scale: 0,
	transformOrigin: "center bottom"
});


/*========================
\\\\ animate elements ////
==========================*/
//STEP 1 ANIMATE
function anim_1() {
	var animation_seed = new TimelineMax({
		paused: true
	});
	animation_seed.to(".seed", 1.5, {
		opacity: 1,
		bottom: '0',
		ease: Linear.easeNone,
	});
	animation_seed.play();
}
$("#step1").click(function () {
	anim_1();
});
// $("#step1_reverse").click(function () {
// 	animation_seed.reverse();
// });


//STEP 2 ANIMATE
function anim_2() {
	var animation_just_grow = new TimelineMax({
		paused: true
	});
	animation_just_grow.set(".seed", {
		scale: 0.5,
		opacity: 1,
		bottom: '0',
		transformOrigin: "center bottom",
	});
	animation_just_grow.to(".seed", 1, {
		scale: 0,
		onComplete: function () {
			animation_just_grow.set(".small_tree", {
				opacity: 1,
			});
			animation_just_grow.to("#tree", 0.8, {
				scale: 0.6,
				transformOrigin: "center bottom", ease: Linear.easeNone,
				onComplete: function () {
					animation_just_grow.to(".seed", 0.5, {
						scale: 0,
						bottom: '-2%',
					});
				}
			});
			animation_just_grow.to("#tree", 0.8, {
				scale: 1,
				transformOrigin: "center bottom",
			});
			animation_just_grow.to("#leaf-top", 1.5, {
				scale: 1,
				transformOrigin: "center bottom",
			});
		}
	}, 0);
	animation_just_grow.play();
}
$("#step2").click(function () {
	anim_2();
});


//STEP 3 ANIMATE
function anim_3() {
	var animation_small_tree = new TimelineMax({
		paused: true
	});
	animation_small_tree.fromTo("#leaf-lb", 1, {
		scale: 0,
		rotation: '60cw',
		y: -80,
		transformOrigin: "right bottom",
	}, {
		scale: 1,
		rotation: '0',
		y: 0,
		transformOrigin: "right bottom",
		onComplete: function () {
			TweenMax.to("#leaf-rb", 1, {
				scale: 1,
				rotation: '0',
				y: 0,
				transformOrigin: "left bottom",
				onComplete: function () {
					TweenMax.to("#leaf-lm", 1, {
						scale: 1,
						rotation: '0',
						y: 0,
						transformOrigin: "right bottom",
						onComplete: function () {
							TweenMax.to("#leaf-rm", 1, {
								scale: 1,
								rotation: '0',
								y: 0,
								transformOrigin: "left bottom",
							})
						}
					})
				}
			});
		}
	}, 0);
	animation_small_tree.play();
}
$("#step3").click(function () {
	anim_3();
});


//STEP 4 ANIMATE
function anim_4() {
	var animation_big_tree_grow = new TimelineMax({
		paused: true
	});
	animation_big_tree_grow.fromTo("#Layer_1_sm_tree", 2, {
		scaleX: 1,
		opacity: 1,
		transformOrigin: "center bottom",
	}, {
		scaleX: 0,
		opacity: 0,
		transformOrigin: "center bottom",
	}, 0);
	animation_big_tree_grow.fromTo(".main_tree", 2.5, {
		scale: 0,
	}, {
		scale: 0.7
	}, 0);
	animation_big_tree_grow.play();
}
$("#step4").click(function () {
	anim_4();
});


//STEP 5 ANIMATE
function anim_5() {
	var animation_big_tree = new TimelineMax({
		paused: true
	});
	animation_big_tree.fromTo(".main_tree", 2.5, {
		scale: 0.7,
	}, {
		scale: 1,
		onComplete: function () {
			animation_big_tree.to(".cls-1_tree0", 0.5, {
				scale: 1,
				onComplete: function () {
					animation_big_tree.to(".cls-8_tree", 1, { scale: 1, });
				}
			});
			animation_big_tree.to(".cls-7_tree", 0.3, {
				scale: 1,
				onComplete: function () {
					animation_big_tree.to(".cls-1_tree1", 0.3, {
						scale: 1,
					});
					animation_big_tree.to(".cls-1_tree5", 0.9, {
						opacity: 1,
					});
				}
			});
		}
	}, 0);
	animation_big_tree.fromTo("cls-2_tree1", 0.3, {
		opacity: 0.4,
	}, {
		opacity: 1,
	}, 0);
	animation_big_tree.play();
}
$("#step5").click(function () {
	anim_5();
});