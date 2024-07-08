"use strict";

//// detect device orientation
function detect_orientation() {
    document.body.classList.remove("mobileLandscapeView");
    document.body.classList.remove("mobilePotraitView");
    document.body.classList.remove("smallView");

    if (window.outerWidth > window.outerHeight && window.outerWidth <= 767) {
        document.body.classList.add("mobileLandscapeView");
    }
    if (window.outerWidth < window.outerHeight && window.outerWidth <= 767) {
        document.body.classList.add("mobilePotraitView");
    }
    if (window.outerHeight <= 360) {
        document.body.classList.add("smallView");
    }
}

detect_orientation();
window.addEventListener('orientationchange', detect_orientation);

// window.addEventListener("orientationchange", function() {
//     console.log(screen.orientation);
//     location.reload();
// }, false);


//// Detect Safari
if ((navigator.userAgent.indexOf("Safari") > -1) && (navigator.userAgent.indexOf("Chrome") <= -1)) {
    document.body.classList.add("SafariBrowser");
}

const iOS = /^iP/.test(navigator.platform);
if (iOS) {
    document.body.classList.add("iphone");
} else {
    document.body.classList.add("android");
}

//// reset scroll position:
window.history.scrollRestoration = "manual";
window.scrollTo(0, 0);

// //// prevent from scroll
// document.addEventListener('wheel', preventScroll, { passive: false });

// function preventScroll(e) {
//     e.preventDefault();
//     e.stopPropagation();
//     return false;
// }

//// check if the device is mobile or not
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // console.log("mobile device");

} else {
    // console.log("not mobile device");

}

function checkElements(els) {
    var element = document.querySelector(els);
    if (typeof (element) != 'undefined' && element != null) {
        return true;
    }
    else {
        return false;
    }
}

///toggle mobile search box
if (checkElements("#m_srch_trigger")) {
    document.getElementById("m_srch_trigger").addEventListener("click", function () {
        if (this.classList.contains("active")) {
            this.classList.remove("active");
            document.getElementById("m_srch_trigger_box").classList.remove("active");
        }
        else {
            this.classList.add("active");
            document.getElementById("m_srch_trigger_box").classList.add("active");
        }
    });
}

// mobile toggle navigation
if (checkElements("#hamburger_menu")) {
    document.getElementById("hamburger_menu").addEventListener("click", function(){
        if (this.classList.contains("active")) {
            this.classList.remove("active");
            document.getElementById("navigation").classList.remove("active");
            document.getElementById("menu_overlay").classList.remove("active");
            document.body.classList.remove("open_menu");
        }
        else {
            this.classList.add("active");
            document.getElementById("navigation").classList.add("active");
            document.getElementById("menu_overlay").classList.add("active");
            document.body.classList.add("open_menu");
        }
    })

    document.getElementById("menu_overlay").addEventListener("click", function(){
        document.getElementById("hamburger_menu").classList.remove("active");
        document.getElementById("navigation").classList.remove("active");
        document.getElementById("menu_overlay").classList.remove("active");
        document.body.classList.remove("open_menu");
    })
}

///toggle notification
if (checkElements("#nof_btn")) {
    document.getElementById("nof_btn").addEventListener("click", function () {
        // let overlay;
        if (this.classList.contains("active")) {
            this.classList.remove("active");
            this.nextElementSibling.classList.remove("active");
        }
        else {
            this.classList.add("active");
            this.nextElementSibling.classList.add("active");
        }
    });
    window.addEventListener('mouseup', function (event) {
        let pol = document.getElementById('nof_btn');
        if (event.target != pol && event.target.parentNode != pol) {
            pol.classList.remove("active");
            pol.nextElementSibling.classList.remove('active');
        }
    });
}

///dashboard chart1
if (checkElements("#chart0")) {
    new ApexCharts(document.getElementById("chart0"),
        {
            series: [{
                name: 'Revenue',
                data: [31, 40, 28, 51, 42, 109, 100, 85, 44, 56, 95],
            },],
            chart: {
                type: 'area',
                height: 225,
                redrawOnParentResize: true,
                redrawOnWindowResize: true,
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: 'smooth',
                width: 3,
                fill: '#00E396',
            },

            xaxis: {
                type: 'date',
                tickAmount: 11,
                categories: ["Sep 1st", "Sep 4th", "Sep 7th", "Sep 10th", "Sep 13th", "Sep 16th", "Sep 19th", "Sep 21th", "Sep 24th", "Sep 27th", "Sep 30th"],
                labels: {
                    show: true,
                    rotate: 0,
                    // trim: true,
                    style: {
                        colors: "#000000",
                        fontSize: '12px',
                        fontFamily: 'Cabin, sans-serif',
                        fontWeight: 600,
                    },
                },
            },
            yaxis: {
                tickAmount: 5,
                labels: {
                    show: true,
                    style: {
                        colors: "#000000",
                        fontSize: '12px',
                        fontFamily: 'Cabin, sans-serif',
                        fontWeight: 600,
                    },
                },
            },
            tooltip: {
                x: {
                    format: 'dd/MM/yy',
                },
            },
            yaxis: {
                title: {
                    text: '$',
                    style: {
                        color: "#525050",
                        fontSize: '20px',
                        fontFamily: 'Cabin, sans-serif',
                        fontWeight: 600,
                    },
                }
            },
            fill: {
                opacity: 1,
                colors: ['#00E396', '#fff'],
                gradient: {
                    shade: 'light',
                    type: "vertical",
                    shadeIntensity: 0.5,
                    gradientToColors: undefined,
                    inverseColors: true,
                    opacityFrom: 0.7,
                    opacityTo: 0.2,
                },
            },
            responsive: [{
                breakpoint: 1600,
                options: {

                },
            }]
        }).render();
}

///dashboard chart2
if (checkElements("#chart1")) {
    new ApexCharts(document.getElementById("chart1"), {
        series: [{
            name: 'Approved',
            data: [0, 55, 57, 56, 61, 58, 63, 60, 66, 45, 78, 30],
        }, {
            name: 'Rejected',
            data: [76, 85, 101, 98, 87, 105, 91, 114, 94, 56, 12, 56],
        }, {
            name: 'Pending',
            data: [35, 41, 36, 26, 45, 48, 52, 53, 41, 95, 44, 85],
        }],
        chart: {
            type: 'bar',
            height: 400,
            redrawOnParentResize: true,
            redrawOnWindowResize: true,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded',
                borderRadius: 12,
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: false,
        },
        grid: {
            show: false,
        },
        xaxis: {
            categories: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            tickAmount: 12,
            labels: {
                show: true,
                rotate: 0,
                trim: true,
                style: {
                    colors: "#000000",
                    fontSize: '12px',
                    fontFamily: 'Cabin, sans-serif',
                    fontWeight: 600,
                },
            },
            axisBorder: {
                show: false,
                color: '#456456',
                height: 1,
                width: '100%',
                offsetX: 0,
                offsetY: 0
            },
        },
        yaxis: {
            tickAmount: 8,
            title: {
                text: 'Per Month',
                style: {
                    color: "#525050",
                    fontSize: '20px',
                    fontFamily: 'Cabin, sans-serif',
                    fontWeight: 600,
                },
            },
            labels: {
                show: true,
                style: {
                    colors: "#000000",
                    fontSize: '12px',
                    fontFamily: 'Cabin, sans-serif',
                    fontWeight: 600,
                },
            },
        },
        fill: {
            opacity: 1,
            colors: ['#008FFB', '#90C1E7', '#D1E3F1'],
            
        },
        stroke: {
            width: 3,
            colors: ['#008FFB', '#90C1E7', '#D1E3F1'],
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return "$ " + val + " thousands"
                }
            }
        },
        legend: {
            fontSize: '14px',
            fontFamily: 'Cabin, sans-serif',
            fontWeight: 600,
            labels: {
                colors: "#525050",
            },
            markers: {
                fillColors: ['#008FFB', '#90C1E7', '#D1E3F1'],
                radius: 12,
            },
            itemMargin: {
                horizontal: 30,
                vertical: 0
            },
        },
        // xaxis: {
        //     title: {
        //         text: 'My Submissions',
        //         display: true,
        //         style: {
        //             color: "#525050",
        //             fontSize: '20px',
        //             fontFamily: 'Cabin, sans-serif',
        //             fontWeight: 600,
        //         },
        //     }
        // },
        // responsive: [{
        //     breakpoint: 1600,
        //     options: {
        //         chart: {
        //             height: 200,
        //         },
        //         yaxis: {
        //             title: {
        //                 style: {
        //                     fontSize: '16px',
        //                 },
        //             },
        //         },
        //         legend: {
        //             fontSize: '12px',
        //             itemMargin: {
        //                 horizontal: 15,
        //             },
        //         },
        //     },
        // }]
    }).render();
}

//// date picker
if (checkElements(".dateSelector")) {
    flatpickr(".dateSelector", {
        altInput: true,
        altFormat: "j F, Y",
        dateFormat: "Y/m/d",
    });
}

if (checkElements("#calender_range")) {
    flatpickr("#calender_range", {
        mode: "range",
        altInput: true,
        altFormat: "j F, Y",
        dateFormat: "Y/m/d",
        inline: true,
    });
}



// pass range value
if(checkElements("#apply_range")){
    document.getElementById("calender_range_value").value = document.getElementById("calender_range").value;
    document.getElementById("apply_range").addEventListener("click", function(){
        document.getElementById("calender_range_value").value = document.getElementById("calender_range").value;
        document.getElementById("calender_range_toggle").classList.remove("active");
    })
}

// clear range value 
if (checkElements("#range_clear")){
    document.getElementById("range_clear").addEventListener("click", function(){
        document.getElementById("calender_range").value = "";
        document.querySelector(".calender_range input[readonly='readonly']").value = "";
        document.getElementById("calender_range_value").value = document.getElementById("calender_range").value;
        document.getElementById("calender_range_toggle").classList.remove("active");

        document.querySelectorAll(".flatpickr-day").forEach(el => {
            el.classList.remove('startRange');
            el.classList.remove('selected');
            el.classList.remove('inRange');
            el.classList.remove('endRange');
        })
    })
}

// toggle calender wrapper
if (checkElements("#calender_range_value")) {
    document.getElementById("calender_range_value").addEventListener("click", function(){
        // this.classList.add("active");
        document.getElementById("calender_range_toggle").classList.add("active");
    })
}
// Hide calender when clicked outside
if(checkElements("#calender_range_toggle")){
    window.addEventListener('mouseup',function(e){
        var calender_range_toggle = document.getElementById("calender_range_toggle");
        if (!calender_range_toggle.contains(e.target)) {
            calender_range_toggle.classList.remove("active");
        }
    });
}


////// custom tab
if (checkElements("[data-tab-target]")) {
    document.querySelectorAll("[data-tab-target]").forEach(function (el) {
        let el_btns = el.querySelectorAll("li>a");
        el_btns.forEach(function (el_btn, el_index) {
            el_btn.addEventListener("click", function () {
                el_btns.forEach(function (e) {
                    e.classList.remove("active");
                });
                this.classList.add("active");
                let tab_name = this.parentElement.parentElement.dataset.tabTarget;
                let pr_panel_el_parent = document.querySelectorAll("[data-tab-parent='" + tab_name + "']");
                pr_panel_el_parent.forEach(function (el_each) {
                    let pr_panel_el = el_each.querySelectorAll(".tab_panel");
                    pr_panel_el.forEach(function (e) {
                        e.style.display = "none";
                        e.classList.remove("active");
                    });
                    pr_panel_el[el_index].style.display = "block";
                    pr_panel_el[el_index].classList.add("active");
                });

                
            });
        });
    });
}

//// list and grid view
if (checkElements("#list_view") && checkElements("#grid_view") && checkElements(".view_box")) {
    //list view
    document.getElementById("list_view").addEventListener("click", function () {
        document.getElementById("grid_view").classList.remove("active");
        document.querySelector(".grid_view_box").classList.remove("active_view");
        this.classList.add("active");
        document.querySelector(".list_view_box").classList.add("active_view");
    });

    //grid view
    document.getElementById("grid_view").addEventListener("click", function () {
        document.getElementById("list_view").classList.remove("active");
        document.querySelector(".list_view_box").classList.remove("active_view");
        this.classList.add("active");
        document.querySelector(".grid_view_box").classList.add("active_view");
        skeletons_v4();

    });
}

////tooltips
if (checkElements("[data-tip]")) {
    let exampleEl = document.querySelectorAll("[data-bs-toggle='tooltip']");
    exampleEl.forEach(function (each_tp) {
        let tooltip = new bootstrap.Tooltip(each_tp, {
            fallbackPlacements: ['top', 'bottom'],
        });
        //tooltip.show()
    })

}

// simple inline popup
if (checkElements("[data-pop-block]")) {
    document.querySelectorAll("[data-pop-block]").forEach(function (each_el_pop, index) {
        let this_val = each_el_pop.dataset.popBlock;
        each_el_pop.querySelector("[data-btn='" + this_val + "']").addEventListener("click", function () {
            this.classList.add('not-allowed');
            each_el_pop.querySelector("[data-modal='" + this_val + "']").style.display = "block";
            each_el_pop.querySelector("[data-modal='" + this_val + "']").classList.add("active");
            each_el_pop.querySelector("[data-text='" + this_val + "']").value = "";
            if (each_el_pop.classList.contains("data-goto")) {
                setTimeout(()=>{
                    document.querySelectorAll(".modal")[0].scrollTo(0, each_el_pop.querySelector("[data-cancel='" + this_val + "']").getBoundingClientRect().y+1000);
                  },100)
            }
        });
        each_el_pop.querySelector("[data-cancel='" + this_val + "']").addEventListener("click", function () {
            each_el_pop.querySelector("[data-btn='" + this_val + "']").classList.remove('not-allowed');
            each_el_pop.querySelector("[data-modal='" + this_val + "']").style.display = "none";
            each_el_pop.querySelector("[data-modal='" + this_val + "']").classList.remove('active');
        });
    });
}

// remove notification
if (checkElements("[data-notify-close]")) {
    document.querySelectorAll("[data-notify-close]").forEach(function (elt) {
        let parent = elt.closest(".notify_list"),
            parent2 = parent.closest(".box_model_notification");
        elt.addEventListener("click", function () {
            this.parentElement.remove();
            setTimeout(() => {
                if (parent.children.length <= 0) {
                    parent.closest(".per_day_notif").remove();
                    if (parent2.children.length <= 0) {
                        let node = document.createElement("div");
                        node.classList.add("no_data_found");

                        let nodeIconWrap = document.createElement("div");
                        nodeIconWrap.classList.add("iconwrap");
                        node.appendChild(nodeIconWrap);
                        let nodeIcon = document.createElement("img");
                        nodeIcon.src = "images/no-found.png";

                        // nodeIcon.classList.add("far");
                        // nodeIcon.classList.add("fa-smile-beam");
                        nodeIconWrap.appendChild(nodeIcon);

                        let textNodeElement = document.createElement("h3");
                        let textnode = document.createTextNode("Oops!");
                        textNodeElement.appendChild(textnode);
                        node.appendChild(textNodeElement);

                        let textNodePara = document.createElement("p");
                        let textNodeParaInfo = document.createTextNode("No data found");
                        textNodePara.appendChild(textNodeParaInfo);
                        node.appendChild(textNodePara);

                        parent2.appendChild(node);
                    }
                }
            }, 50)
        });
    });
}

//custom dropdown
if (checkElements(".selectize")) {
    document.querySelectorAll(".selectize").forEach(function (select) {
        NiceSelect.bind(select);
    });
    // document.querySelectorAll("[data-dropdown]").forEach(function (eel) {
    //     eel.querySelectorAll(".dropdown-menu li a").forEach(function (els) {
    //         els.addEventListener("click", function () {
    //             eel.querySelector("[data-bs-toggle]").innerText = this.innerText;
    //         });
    //     })
    // });
}

//chnage profile image
if (checkElements("[data-profile-image]")) {
    document.querySelectorAll("[data-profile-image]").forEach(function (eel) {
        eel.querySelector("input[type='file']").addEventListener("change", function (e) {
            eel.querySelector("img").src = URL.createObjectURL(e.target.files[0])
        });
    });
}

// show file name
if(checkElements("#inquiry_file")) {
    function bytesToSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
        if (bytes === 0) return 'n/a'
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
        if (i === 0) return `${bytes} ${sizes[i]}`
        return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
    }
    document.getElementById("uploaded_file_info").style.visibility = "hidden";
    document.getElementById("inquiry_file").addEventListener("change",function(e){
        document.getElementById("uploaded_file_info").style.visibility = "visible";
        document.querySelector('.file_name').innerHTML = e.target.files[0].name;
        document.querySelector('.file_size').innerHTML = bytesToSize(e.target.files[0].size);
    })
    document.getElementById("file_del").addEventListener("click", function(){
        document.getElementById("inquiry_file").value = "";
        document.querySelector('.file_name').innerHTML = "";
        document.querySelector('.file_size').innerHTML = "";
        document.getElementById("uploaded_file_info").style.visibility = "hidden";
    })
}

//editable input
if (checkElements("[data-editable]")) {
    document.querySelectorAll("[data-editable]").forEach(function (exl) {
        exl.querySelector("[data-edit]").addEventListener("click", function (e) {
            this.classList.add("hide");
            exl.querySelector("[data-save]").classList.remove("hide");
            exl.querySelectorAll(".data-input").forEach(function (ee) {
                ee.disabled = false;
                ee.focus();
                ee.classList.remove("disabled");
            });
        });
        exl.querySelector("[data-save]").addEventListener("click", function (e) {
            this.classList.add("hide");
            exl.querySelector("[data-edit]").classList.remove("hide");
            exl.querySelectorAll(".data-input").forEach(function (ee) {
                ee.disabled = true;
                ee.classList.add("disabled");
            });
        });
    });
}

// Mask Password With Asterisk While Typing
if (checkElements("[data-mask]")) {
    document.querySelectorAll("[data-mask]").forEach(function (ee) {
        let esl = ee.querySelector("input[type='password']");
        for (let i = 0; i < esl.value.length; i++) {
            esl.nextElementSibling.innerHTML = "*" + esl.nextElementSibling.innerHTML;
        }
        esl.addEventListener('keyup', (q) => {
            const dummyText = Array(q.target.value.length).fill('*').join('');
            q.target.nextElementSibling.innerHTML = dummyText;
        });
    });
}

// alert when acknowledge video
var handleAcknowledge = () => {
    swal({
      title: "Successfully Saved!",
        icon: "success",
        button: "Ok",
    });
};


// skeletons effect
if (checkElements(".skeleton")) {
    const skeletons = document.querySelectorAll('.skeleton')
    skeletons.forEach((skeletonem) => {
        setTimeout(() => {
            skeletonem.classList.remove('skeleton')
        }, 4000)
    })
}

// skeletons effect
function skeletons_v1() {
    if (checkElements(".all .skeleton_v1")) {
        const skeletons = document.querySelectorAll('.all .skeleton_v1')
        skeletons.forEach((skeletonem) => {
            setTimeout(() => {
                skeletonem.classList.remove('skeleton_v1')
            }, 4000)
        })
    }
}

function skeletons_v2() {
    if (checkElements(".appr .skeleton_v1")) {
        const skeletons = document.querySelectorAll('.appr .skeleton_v1')
        skeletons.forEach((skeletonem) => {
            setTimeout(() => {
                skeletonem.classList.remove('skeleton_v1')
            }, 4000)
        })
    }
}

function skeletons_v3() {
    if (checkElements(".rec .skeleton_v1")) {
        const skeletons = document.querySelectorAll('.rec .skeleton_v1')
        skeletons.forEach((skeletonem) => {
            setTimeout(() => {
                skeletonem.classList.remove('skeleton_v1')
            }, 4000)
        })
    }
}


function skeletons_v4() {
    if (checkElements(".grid_view_box_selection .skeleton_v1")) {
        const skeletons = document.querySelectorAll('.grid_view_box_selection .skeleton_v1')
        skeletons.forEach((skeletonem) => {
            setTimeout(() => {
                skeletonem.classList.remove('skeleton_v1')
            }, 4000)
        })
    }
}

skeletons_v1();


if (checkElements(".nav_tab_selecton")) {
    document.getElementById("nav_tab_selecton_all").addEventListener("click", function(){
        skeletons_v1();
    })

    document.getElementById("nav_tab_selecton_appr").addEventListener("click", function(){
        skeletons_v2();
    })

    document.getElementById("nav_tab_selecton_rej").addEventListener("click", function(){
        skeletons_v3();
    })
}

// password controller
// function handlePasswordController(e) {
//     var element = document.querySelector(e);
//     console.log(element);
//     if (this.classList.contains("active")) {
//         this.classList.remove("active");
//     }
//     else {
//         this.classList.add("active");
//     }
    
// }

if (checkElements("[data-toggle-password]")) {
    document.querySelectorAll("[data-toggle-password]").forEach(function (el) {
        let togglePasswordBtns = el.querySelectorAll(".toggle_open_eye")
        let togglePasswordFields = el.childNodes[3];
        togglePasswordBtns.forEach(function (togglePasswordBtn) {
            togglePasswordBtn.addEventListener("click", function () {
                // console.log(togglePasswordFields);
                togglePasswordBtns.forEach(function (e) {
                    if (e.classList.contains("active")) {
                        e.classList.remove("active")
                        togglePasswordFields.setAttribute("type", "password");
                    }
                    else {
                        e.classList.add("active")
                        togglePasswordFields.setAttribute("type", "text");
                    }
                })
            })
        })
    })
}