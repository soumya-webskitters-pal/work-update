/*!
 * NodeCursor : jQuery version
 * Plugin URI: https://github.com/hmongouachon/NodeCursor
 * Version: 1.0.0
 */
!function (b) { NodeCursor = function (e) { var o, s, r, n, a = b.extend({}, { cursor: !0, node: !0, cursor_velocity: 1, node_velocity: .35, native_cursor: "default", element_to_hover: "disable", cursor_class_hover: "disable", node_class_hover: "disable", hide_mode: !0, hide_timing: 3e3 }, e), i = !1, t = 0, d = 0, c = 0, l = 0, m = 0, _ = 0, u = 0, v = 0; !0 === a.cursor && (s = b("#cursor")), !0 === a.node && (o = b("#node")); var h = s.width() / 2, w = s.width() / 2, g = o.width() / 2, C = o.width() / 2; function p() { i = !1 } b("body").css({ curosr: a.native_cursor }), b(document).mousemove(function (e) { (i = !0) === a.cursor && (t = e.pageX - h, d = e.pageY - w), !0 === a.node && (c = e.pageX - g, l = e.pageY - C), !0 === a.hide_mode && (clearTimeout(r), r = setTimeout(p, a.hide_timing)) }), n = requestAnimationFrame(function e() { !0 === i ? (!0 === a.cursor && (s.addClass("moving"), m += (t - m) * a.cursor_velocity, _ += (d - _) * a.cursor_velocity, s.css({ left: m + "px", top: _ + "px" })), !0 === a.node && (o.addClass("moving"), u += (c - u) * a.node_velocity, v += (l - v) * a.node_velocity, o.css({ left: u + "px", top: v + "px" }))) : (!0 === a.cursor && s.removeClass("moving"), !0 === a.node && o.removeClass("moving"), cancelAnimationFrame(n)), "disable" !== a.element_to_hover && (0 != b(a.element_to_hover + ":hover").length ? (!0 === a.cursor && "disable" !== a.cursor_class_hover && s.addClass(a.cursor_class_hover), !0 === a.node && "disable" !== a.node_class_hover && o.addClass(a.node_class_hover)) : (s.hasClass(a.cursor_class_hover) && s.removeClass(a.cursor_class_hover), o.hasClass(a.node_class_hover) && o.removeClass(a.node_class_hover))), n = requestAnimationFrame(e) }), window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame } }(jQuery);