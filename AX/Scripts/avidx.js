var navigationState, feedState, guiders;
(function() {
	kendo.cultures["en-US"] = {
		name: "en-US",
		numberFormat: {
			pattern: ["-n"],
			decimals: 2,
			",": ",",
			".": ".",
			groupSize: [3],
			percent: {
				pattern: ["-n %", "n %"],
				decimals: 2,
				",": ",",
				".": ".",
				groupSize: [3],
				symbol: "%"
			},
			currency: {
				pattern: ["($n)", "$n"],
				decimals: 2,
				",": ",",
				".": ".",
				groupSize: [3],
				symbol: "$"
			}
		},
		customNumberFormat: "{0:0.##}",
		calendars: {
			standard: {
				days: {
					names: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
					namesAbbr: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
					namesShort: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
				},
				months: {
					names: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""],
					namesAbbr: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""]
				},
				AM: ["AM", "am", "AM"],
				PM: ["PM", "pm", "PM"],
				patterns: {
					d: "M/d/yyyy",
					D: "dddd, MMMM dd, yyyy",
					F: "dddd, MMMM dd, yyyy h:mm:ss tt",
					g: "M/d/yyyy h:mm tt",
					G: "M/d/yyyy h:mm:ss tt",
					m: "MMMM dd",
					M: "MMMM dd",
					s: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
					t: "h:mm tt",
					T: "h:mm:ss tt",
					u: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
					y: "MMMM, yyyy",
					Y: "MMMM, yyyy"
				},
				"/": "/",
				":": ":",
				firstDay: 0
			}
		}
	}
})(this), $.cookie("navigation_state") != null ? navigationState = $.cookie("navigation_state") : ($.cookie("navigation_state", "navigation-pinned", {
	expires: 300,
	path: "/"
}), navigationState = "navigation-pinned"), $.cookie("feed_state") != null ? feedState = $.cookie("feed_state") : ($.cookie("feed_state", "feed-visible", {
	expires: 300,
	path: "/"
}), feedState = "feed-hidden"), window.kendo !== undefined && (kendo.ui.ComboBox.fn.options.animation = !1, kendo.ui.DropDownList.fn.options.animation = !1, kendo.ui.DatePicker.fn.options.animation = !1), $(document).ready(function() {
	$("#sidemenu").addClass(navigationState), $("#main").addClass(navigationState), navigationState == "pop-out" ? ($(".navigation-control i").attr("class", "icon-chevron-right"), $(".navigation-control span").text("Show")) : $(".navigation-control i").attr("class", "icon-chevron-left"), $(".navigation-control").click(function() {
		return $("#sidemenu").hasClass("navigation-pinned") == !0 ? ($("#sidemenu").animate({
			left: "-=140"
		}, 150, function() {
			$(this).removeClass("navigation-pinned").addClass("pop-out").removeAttr("style"), $(window).trigger("resize")
		}), $("#main").removeClass("navigation-pinned").animate({
			left: "-=150"
		}, 120, function() {
			$(this).addClass("pop-out").removeAttr("style"), $.cookie("navigation_state", "pop-out", {
				expires: 300,
				path: "/"
			})
		}), $(".navigation-control i").removeClass("icon-chevron-left").addClass("icon-chevron-right"), $(".navigation-control span").text("Show")) : ($("#sidemenu").removeClass("pop-out").addClass("navigation-pinned").css("left", "-140px").show().animate({
			left: "+=140"
		}, 120, function() {
			$(this).removeAttr("style"), $(window).trigger("resize")
		}), $("#main").animate({
			left: "+=140"
		}, 120, function() {
			$(this).removeClass("pop-out").addClass("navigation-pinned").removeAttr("style"), $.cookie("navigation_state", "navigation-pinned", {
				expires: 300,
				path: "/"
			})
		}), $(".navigation-control i").removeClass("icon-chevron-right").addClass("icon-chevron-left"), $(".navigation-control span").text("Hide")), !1
	}), $(".profile").popover({
		position: "bottom",
		width: 150,
		hideOnEsc: !0,
		cssClass: "global-help-popover",
		html: $(".profile .user-menu")
	}), $("#asBadge").mouseup(function() {
		return app.toggleActivityStream(), !1
	}), $("#pinFeed").live("click", function() {
		return app.pinActivityStream(), $(window).trigger("resize"), !1
	}), $("#hideFeed").live("click", function() {
		return app.hideActivityStream(), $(window).trigger("resize"), !1
	}), window.feed && feedState == "feed-pinned" && app.pinActivityStream(), $("body, .k-icon.k-plus, .k-icon.k-minus").live("mouseup", function(n) {
		app.closeOpenMenus(n)
	}), $("#header .quick-add, #header .global-search, #header .global-help").tipsy({
		live: !0,
		delayIn: 500,
		gravity: "e"
	})
}), window.app = function(n) {
	function o(n) {
		for(var h = {}, i, e, c, t, f = n.match(u), r = 0, s = f.length; r < s; r++) i = f[r], e = i.indexOf(":"), c = i.substring(0, e), t = i.substring(e + 1), t.charAt(0) == "{" ? t = o(t) : t.charAt(0) == "[" && (t = t.substring(1, t.length - 1).split(";")), h[c] = t;
		return h
	}
	var t = {},
		i = [],
		e = /^\/Date\((.*?)\)\/$/,
		h = /^\d+$/,
		s, r, u, f;
	return t.intMaxValue = 2147483647, t.intMinValue = -2147483648, t.assignedToMaxLength = 22, t.assignedToSubstringLength = 19, t.getPath, t.setConfirmUnload = function(n, t, i) {
		"onbeforeunload" in window && (i = i ? i : kendo.culture().strings.unsavedChanges, window.onbeforeunload = n ?
		function() {
			return typeof t == "function" && t(), i
		} : null)
	}, t.isUnloadConfirmOn = function() {
		return "onbeforeunload" in window && window.onbeforeunload
	}, t.getWorkItemUrl = function(n, t, i) {
		var r = n;
		return t && i && (r = i + "/" + t + "/" + r), "#item/" + r
	}, t.clearHash = function() {
		document.location.hash && (document.location.hash = "")
	}, t.toDate = function(n) {
		var t = e.exec(n);
		return new Date(parseInt(t[1]))
	}, t.toDateFromServer = function(n, t, i) {
		return n = parseInt(n), t = parseInt(t) - 1, i = parseInt(i), new Date(n, t, i)
	}, t.daysInRange = function(n, t) {
		var r = n.getTime(),
			u = t.getTime(),
			i = [];
		for(loopTime = r; loopTime <= u; loopTime += 864e5) i.push(new Date(loopTime));
		return i
	}, t.toLocalDate = function(n) {
		var i = e.exec(n),
			t = -((new Date).getTimezoneOffset() / 60) * 36e5;
		return new Date(parseInt(i[1]) + t)
	}, t.toISODate = function(n) {
		return kendo.toString(n, "yyyy-MM-dd")
	}, t.fromISODate = function(n) {
		return kendo.parseDate(n, "yyyy-MM-dd")
	}, t.isoDateReviver = function(n) {
		var t, i;
		return typeof n == "string" && (t = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)(?:([\+-])(\d{2})\:(\d{2}))?Z?$/.exec(n), t) ? (i = Date.UTC(+t[1], +t[2] - 1, +t[3], +t[4], +t[5], +t[6]), new Date(i)) : n
	}, t.boolToYesNo = function(n) {
		return n === !0 ? kendo.culture().strings.yes : n === !1 ? kendo.culture().strings.no : ""
	}, t.pluralize = function(n, t, i) {
		return Math.abs(n) === 1 ? t : i
	}, t.encodeQuot = function(n) {
		return n ? n.replace(/"/g, "&quot;") : n
	}, t.makeAltTemplate = function(n, t) {
		return t || (t = 'class="k-alt"'), n.replace("<tr", "<tr " + t)
	}, t.QueryString = function(n) {
		var r, t, i;
		if(n == "") return {};
		for(r = {}, t = 0; t < n.length; ++t)(i = n[t].split("="), i.length == 2) && (r[i[0]] = decodeURIComponent(i[1].replace(/\+/g, " ")));
		return r
	}(window.location.search.substr(1).split("&")), t.currentUser = {
		UserID: 0
	}, t.showLoading = function(t) {
		t || (n("#loadingContainer").length == 0 && n("body").append('<div id="loadingContainer"></div>'), t = n("#loadingContainer"));
		var i = t.children("span.k-loading-image.avidx-loading-image");
		i.length == 0 && (t.append("<span class='k-loading-image avidx-loading-image'>&nbsp;</span>"), i = t.children("span.k-loading-image.avidx-loading-image")), i.show()
	}, t.hideLoading = function(t) {
		t || (t = n("#loadingContainer"));
		var i = t.children("span.k-loading-image.avidx-loading-image");
		i.length > 0 && i.hide()
	}, t.refresh = function() {
		n(".feedback-message").hide(), window.top.location.reload()
	}, t.setupRefreshButton = function(i) {
		var r = n("#refresh");
		t.hideLoading(), r.unbind("click"), r.click(function() {
			n(this).unbind("click"), t.showLoading(), i()
		})
	}, t.showUpdateMessage = function(t, i, r, u) {
		r != !1 && (r = r || !0);
		var f = u;
		f || (n("body").find(".feedback-message").length == 0 && n("body").append('<div class="feedback-message" style="display: none;"></div>'), f = n("body").find(".feedback-message")), t == "saving" ? (f.removeClass("success").removeClass("error").removeClass("warning"), f.text(i || kendo.culture().strings.saving), f.clearQueue(), f.stop(), f.fadeTo("fast", .8), app.showLoading(f)) : t == "cancel" ? (f.clearQueue(), f.stop(), f.fadeTo("fast", 0), app.hideLoading(f)) : setTimeout(function() {
			f.addClass(t), app.hideLoading(f), f.text(i), r && f.append('&nbsp;<a href="JavaScript:void(0)" onClick="app.refresh();">' + kendo.culture().strings.refresh + "</a>"), f.clearQueue(), f.stop(), f.fadeTo("fast", 1), t == "warning" ? f.delay(4e3).fadeTo("slow", 0) : t !== "error" && f.delay(2e3).fadeTo("fast", 0)
		}, 200)
	}, t.clickButtonOnEscape = function(t, i) {
		return t.which && t.which == 27 || t.keyCode && t.keyCode == 27 ? (n(i).click(), !1) : !0
	}, t.clickButtonOnEnter = function(t, i) {
		return t.which && t.which == 13 || t.keyCode && t.keyCode == 13 ? (n(i).click(), !0) : !0
	}, t.toggleActivityStream = function() {
		var i = n("#feed");
		i.hasClass("feed-visible") ? t.hideActivityStream() : i.hasClass("feed-hidden") ? t.showActivityStream() : i.hasClass("feed-pinned") && feed.updateFeed()
	}, t.showActivityStream = function() {
		n("#feed, #page").removeClass("feed-hidden").removeClass("feed-pinned").addClass("feed-visible"), n("#hideFeed").hide(), n("#pinFeed").show(), n.cookie("feed_state", "feed-visible", {
			expires: 300,
			path: "/"
		}), feed.isVisible(!0)
	}, t.hideActivityStream = function() {
		n("#page, #feed").removeClass("feed-pinned").removeClass("feed-visible").addClass("feed-hidden"), n("#hideFeed").hide(), n("#pinFeed").show(), n.cookie("feed_state", "feed-hidden", {
			expires: 300,
			path: "/"
		}), feed.isVisible(!1)
	}, t.pinActivityStream = function() {
		n("#page, #feed").removeClass("feed-hidden").removeClass("feed-visible").addClass("feed-pinned"), n("#pinFeed").hide(), n("#hideFeed").show(), n.cookie("feed_state", "feed-pinned", {
			expires: 300,
			path: "/"
		}), feed.isVisible(!0)
	}, t.closeOpenMenus = function(t) {
		var i = t.srcElement ? t.srcElement : t.target;
		window.feed && n(i).closest("#feed").length == 0 && n("#feed").hasClass("feed-visible") && app.hideActivityStream(), n(i).closest(".parent-item-wrapper").hasClass("open") || n(".parent-item-wrapper.open").removeClass("open").find(".parent-item-menu").hide(), n(i).closest(".add-work-type-wrapper").hasClass("open") || n(".add-work-type-wrapper").removeClass("open").find(".add-work-type-menu").hide(), n(i).parent().hasClass("user-menu-expander") || n("#header .profile").addClass("closed")
	}, t.setCaretPosition = function(n, t) {
		if(n.setSelectionRange) n.focus(), n.setSelectionRange(t, t);
		else if(n.createTextRange) {
			var i = n.createTextRange();
			i.collapse(!0), i.moveEnd("character", t), i.moveStart("character", t), i.select()
		}
	}, t.tryParseInt = function(n, t) {
		return h.test(n) ? parseInt(n) : t
	}, t.formatNumber = function(n) {
		return n === 0 || n === "0" ? 0 : n && !isNaN(n) ? kendo.format(kendo.culture().customNumberFormat, parseFloat(parseFloat(n).toFixed(2))) : ""
	}, t.formatNumberWithNone = function(n) {
		return this.formatNumber(n) || kendo.culture().strings.none
	}, t.addPerms = function(r) {
		n.isArray(r) && r.length != 0 && n.each(r, function() {
			if(this.hasOwnProperty("ProjectID") && this.hasOwnProperty("OperationType")) {
				var r = t.tryParseInt(this.ProjectID, null),
					n = t.tryParseInt(this.OperationType, 0);
				n > 0 && !t.hasPerm(r, n) && i.push({
					ProjectID: r,
					OperationType: n
				})
			}
		})
	}, t.hasPerm = function(r, u) {
		if(!n.isArray(i) || i.length == 0) return !1;
		var f = !1;
		return r = t.tryParseInt(r, null), r ? n.each(i, function() {
			if(this.ProjectID && this.ProjectID === r && this.OperationType === u) {
				f = !0;
				return
			}
		}) : n.each(i, function() {
			if(!this.ProjectID && this.OperationType === u) {
				f = !0;
				return
			}
		}), f
	}, t.getFeedbackPortalUrl = function(n, t) {
		return this.FeedbackPortalUrl ? kendo.format("{0}/{1}/Feedback/Details/{2}", this.FeedbackPortalUrl, n, t) : ""
	}, t.tagsToString = function(n) {
		for(var i = "", t = 0; t < n.length; t++) i = i + (t == 0 ? "" : ", ") + n[t].name;
		return i
	}, t.proxy = function(t, i) {
		var r = i._app_proxied;
		return(r || (r = {}, i._app_proxied = r), n.isFunction(r[t])) ? r[t] : r[t] = function() {
			t.apply(i, arguments)
		}
	}, t.isIE = navigator.appName == "Microsoft Internet Explorer", s = /^\s*(?:\{(?:.|\n)*\}|\[(?:.|\n)*\])\s*$/, r = /^\{(\d+)(:[^\}]+)?\}/, t.parseOption = function(value) {
		if(value === "null") value = null;
		else if(value === "true") value = !0;
		else if(value === "false") value = !1;
		else if(isNaN(parseFloat(value))) {
			if(s.test(value) && !r.test(value)) try {
				value = eval("(" + value + ")")
			} catch(e) {
				window.console.log("error parsing: " + value), window.console.log(e)
			}
		} else value = parseFloat(value);
		return value
	}, u = /[A-Za-z0-9_\-]+:(\{([^}]*)\}|[^,}]+)/g, f = /\s/g, t.parseBindings = function(n) {
		return o(n.replace(f, ""))
	}, t
}(jQuery), $.extend({
	appAjax: function(n, t, i, r, u, f, e) {
		var h = $.isFunction(r) ? r : $.noop,
			c = $.isFunction(i) ? i : function() {
				return i
			},
			o = $.isFunction(u) ? u : app.showUpdateMessage,
			f = f || "application/json; charset=utf-8",
			s = e && e.showSaving === !1 ? !1 : !0;
		s && t != "GET" && app.showUpdateMessage("saving"), $.ajax({
			url: n,
			cache: !1,
			type: t,
			contentType: f,
			data: c(),
			error: function(n) {
				var r, f, u;
				n.status != 0 && n.status != 200 && (r = n.responseText, f = n.getResponseHeader("Content-Type"), f && f.indexOf("application/json") > -1 && (u = jQuery.parseJSON(r), r = typeof u == "string" ? u : $.isArray(u) ? u.join("<br/>") : $.map(u, function(n) {
					return n
				}).join("<br/>")), r || (r = kendo.format("{0} {1}", kendo.culture().strings.serverError, kendo.format(kendo.culture().strings.httpStatusCode, n.status))), o("error", r, n))
			},
			success: function(n) {
				window.setTimeout(function() {
					h(n)
				}, 10)
			}
		})
	},
	equalArrays: function(n, t) {
		var f, r, i, u;
		if((!n || n.length == 0) && (!t || t.length == 0)) return !0;
		if(f = n && t && n.length == t.length, !f) return !1;
		for(r = !1, i = 0; i < t.length; i++) {
			for(r = !1, u = 0; u < n.length; u++) if(n[u] == t[i]) {
				r = !0;
				break
			}
			if(!r) return !1
		}
		return !0
	},
	iterateTree: function(n, t, i) {
		var r, f, u;
		if(n) for(r = 0; r < n.length; r++) if((f = i(n[r]), f === !1) || n[r][t] && n[r][t].length > 0 && (u = this.iterateTree(n[r][t], t, i), u === !1)) return !1
	}
}), $.fn.outerHtml = function() {
	return $("<div></div>").html(this.clone()).html()
}, Date.prototype.getWeek = function() {
	var n = new Date(this.getFullYear(), 0, 1);
	return Math.ceil(((this - n) / 864e5 + n.getDay() + 1) / 7)
}, typeof String.prototype.startsWith != "function" && (String.prototype.startsWith = function(n) {
	return this.lastIndexOf(n, 0) === 0
}), guiders = function(n) {
	var t = {},
		i;
	return t.version = "1.2.8", t._defaultSettings = {
		attachTo: null,
		autoFocus: !1,
		buttons: [{
			name: "Close"
		}],
		buttonCustomHTML: "",
		classString: null,
		closeOnEscape: !1,
		description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
		highlight: null,
		isHashable: !0,
		offset: {
			top: null,
			left: null
		},
		onClose: null,
		onHide: null,
		onShow: null,
		overlay: !1,
		position: 0,
		title: "Sample title goes here",
		width: 400,
		xButton: !1
	}, t._htmlSkeleton = ["<div class='guider'>", "  <div class='guider_content'>", "    <h1 class='guider_title'></h1>", "    <div class='guider_close'></div>", "    <p class='guider_description'></p>", "    <div class='guider_buttons'>", "    </div>", "  </div>", "  <div class='guider_arrow'>", "  </div>", "</div>"].join(""), t._arrowSize = 42, t._backButtonTitle = "Back", t._buttonElement = "<a></a>", t._buttonAttributes = {
		href: "javascript:void(0);"
	}, t._closeButtonTitle = "Close", t._currentGuiderID = null, t._guiders = {}, t._lastCreatedGuiderID = null, t._nextButtonTitle = "Next", t._offsetNameMapping = {
		topLeft: 11,
		top: 12,
		topRight: 1,
		rightTop: 2,
		right: 3,
		rightBottom: 4,
		bottomRight: 5,
		bottom: 6,
		bottomLeft: 7,
		leftBottom: 8,
		left: 9,
		leftTop: 10
	}, t._windowHeight = 0, t._addButtons = function(i) {
		var e = i.elem.find(".guider_buttons"),
			f, r, u, s, o;
		if(i.buttons === null || i.buttons.length === 0) {
			e.remove();
			return
		}
		for(f = i.buttons.length - 1; f >= 0; f--) if(r = i.buttons[f], u = n(t._buttonElement, n.extend({
			"class": "guider_button",
			html: r.name
		}, t._buttonAttributes, r.html || {})), typeof r.classString != "undefined" && r.classString !== null && u.addClass(r.classString), e.append(u), s = r.name.toLowerCase(), r.onclick) u.bind("click", r.onclick);
		else switch(s) {
		case t._closeButtonTitle.toLowerCase():
			u.bind("click", function() {
				if(t.hideAll(), i.onClose) i.onClose(i, !1)
			});
			break;
		case t._nextButtonTitle.toLowerCase():
			u.bind("click", function() {
				!i.elem.data("locked") && t.next()
			});
			break;
		case t._backButtonTitle.toLowerCase():
			u.bind("click", function() {
				!i.elem.data("locked") && t.prev()
			})
		}
		i.buttonCustomHTML !== "" && (o = n(i.buttonCustomHTML), i.elem.find(".guider_buttons").append(o)), i.buttons.length === 0 && e.remove()
	}, t._addXButton = function(i) {
		var u = i.elem.find(".guider_close"),
			r = n("<div></div>", {
				"class": "x_button",
				role: "button"
			});
		u.append(r), r.click(function() {
			if(t.hideAll(), i.onClose) i.onClose(i, !0)
		})
	}, t._wireEscape = function(i) {
		n(document).keydown(function(n) {
			if(n.keyCode == 27 || n.which == 27) {
				if(t.hideAll(), i.onClose) i.onClose(i, !0);
				return !1
			}
		})
	}, t._unWireEscape = function() {
		n(document).unbind("keydown")
	}, t._attach = function(i) {
		var l;
		if(typeof i == "object") {
			var h = n(i.attachTo),
				f = i.elem.innerHeight(),
				u = i.elem.innerWidth();
			if(i.position === 0 || h.length === 0) {
				i.elem.css("position", "fixed"), i.elem.css("top", (n(window).height() - f) / 3 + "px"), i.elem.css("left", (n(window).width() - u) / 2 + "px");
				return
			}
			var v = h.offset(),
				s = v.top,
				c = v.left,
				y = n("body").outerHeight(!0) - n("body").outerHeight(!1);
			s -= y, t._offsetNameMapping[i.position] && (i.position = t._offsetNameMapping[i.position]);
			var o = h.innerHeight(),
				e = h.innerWidth(),
				r = .9 * t._arrowSize,
				p = {
					1: [-r - f, e - u],
					2: [0, r + e],
					3: [o / 2 - f / 2, r + e],
					4: [o - f, r + e],
					5: [r + o, e - u],
					6: [r + o, e / 2 - u / 2],
					7: [r + o, 0],
					8: [o - f, -u - r],
					9: [o / 2 - f / 2, -u - r],
					10: [0, -u - r],
					11: [-r - f, 0],
					12: [-r - f, e / 2 - u / 2]
				},
				a = p[i.position];
			return s += a[0], c += a[1], l = "absolute", h.css("position") == "fixed" && (l = "fixed", s -= n(window).scrollTop(), c -= n(window).scrollLeft()), i.offset.top !== null && (s += i.offset.top), i.offset.left !== null && (c += i.offset.left), i.elem.css({
				position: l,
				top: s,
				left: c
			})
		}
	}, t._guiderById = function(n) {
		if(typeof t._guiders[n] == "undefined") throw "Cannot find guider with id " + n;
		return t._guiders[n]
	}, t._showOverlay = function() {
		n("#guider_overlay").fadeIn("fast", function() {
			this.style.removeAttribute && this.style.removeAttribute("filter")
		})
	}, t._highlightElement = function(t) {
		n(t).addClass("guider_highlight")
	}, t._dehighlightElement = function(t) {
		n(t).removeClass("guider_highlight")
	}, t._hideOverlay = function() {
		n("#guider_overlay").fadeOut("fast")
	}, t._initializeOverlay = function() {
		n("#guider_overlay").length === 0 && n('<div id="guider_overlay"></div>').hide().appendTo("body")
	}, t._styleArrow = function(i) {
		var u = i.position || 0,
			f, o;
		if(u) {
			f = n(i.elem.find(".guider_arrow")), o = {
				1: "guider_arrow_down",
				2: "guider_arrow_left",
				3: "guider_arrow_left",
				4: "guider_arrow_left",
				5: "guider_arrow_up",
				6: "guider_arrow_up",
				7: "guider_arrow_up",
				8: "guider_arrow_right",
				9: "guider_arrow_right",
				10: "guider_arrow_right",
				11: "guider_arrow_down",
				12: "guider_arrow_down"
			}, f.addClass(o[u]);
			var s = i.elem.innerHeight(),
				e = i.elem.innerWidth(),
				r = t._arrowSize / 2,
				h = {
					1: ["right", r],
					2: ["top", r],
					3: ["top", s / 2 - r],
					4: ["bottom", r],
					5: ["right", r],
					6: ["left", e / 2 - r],
					7: ["left", r],
					8: ["bottom", r],
					9: ["top", s / 2 - r],
					10: ["top", r],
					11: ["left", r],
					12: ["left", e / 2 - r]
				},
				u = h[i.position];
			f.css(u[0], u[1] + "px")
		}
	}, t._showIfHashed = function(n) {
		var u = "guider=",
			r = window.location.hash.indexOf(u),
			i;
		r !== -1 && (i = window.location.hash.substr(r + u.length), n.id.toLowerCase() === i.toLowerCase() && t.show(n.id))
	}, t.reposition = function() {
		var n = t._guiders[t._currentGuiderID];
		t._attach(n)
	}, t.next = function() {
		var n = t._guiders[t._currentGuiderID],
			i, u, r;
		typeof n != "undefined" && (n.elem.data("locked", !0), i = n.next || null, i !== null && i !== "" && (u = t._guiderById(i), r = u.overlay ? !0 : !1, t.hideAll(r, !0), n && n.highlight && t._dehighlightElement(n.highlight), t.show(i)))
	}, t.prev = function() {
		var r = t._guiders[t._currentGuiderID],
			n, i, f, u;
		typeof r != "undefined" && r.prev !== null && (n = t._guiders[r.prev], n.elem.data("locked", !0), i = n.id || null, i !== null && i !== "" && (f = t._guiderById(i), u = f.overlay ? !0 : !1, t.hideAll(u, !0), n && n.highlight && t._dehighlightElement(n.highlight), t.show(i)))
	}, t.createGuider = function(i) {
		var r, u;
		return(i === null || i === undefined) && (i = {}), myGuider = n.extend({}, t._defaultSettings, i), myGuider.id = myGuider.id || String(Math.floor(Math.random() * 1e3)), r = n(t._htmlSkeleton), myGuider.elem = r, typeof myGuider.classString != "undefined" && myGuider.classString !== null && myGuider.elem.addClass(myGuider.classString), myGuider.elem.css("width", myGuider.width + "px"), u = r.find(".guider_title"), u.html(myGuider.title), r.find(".guider_description").html(myGuider.description), t._addButtons(myGuider), myGuider.xButton && t._addXButton(myGuider), r.hide(), r.appendTo("body"), r.attr("id", myGuider.id), typeof myGuider.attachTo != "undefined" && myGuider !== null && t._attach(myGuider) && t._styleArrow(myGuider), t._initializeOverlay(), t._guiders[myGuider.id] = myGuider, t._lastCreatedGuiderID != null && (myGuider.prev = t._lastCreatedGuiderID), t._lastCreatedGuiderID = myGuider.id, myGuider.isHashable && t._showIfHashed(myGuider), t
	}, t.hideAll = function(i, r) {
		r = r || !1, n(".guider:visible").each(function(i, u) {
			var f = t._guiderById(n(u).attr("id"));
			if(f.onHide) f.onHide(f, r)
		}), n(".guider").fadeOut("fast");
		var u = t._guiders[t._currentGuiderID];
		return u && u.highlight && t._dehighlightElement(u.highlight), typeof i != "undefined" && i === !0 || t._hideOverlay(), t
	}, t.show = function(i) {
		var r;
		if(!i && t._lastCreatedGuiderID && (i = t._lastCreatedGuiderID), r = t._guiderById(i), r.overlay && (t._showOverlay(), r.highlight && t._highlightElement(r.highlight)), r.closeOnEscape ? t._wireEscape(r) : t._unWireEscape(r), r.onShow) r.onShow(r);
		t._attach(r), r.elem.fadeIn("fast").data("locked", !1), t._currentGuiderID = i;
		var s = t._windowHeight = n(window).height(),
			f = n(window).scrollTop(),
			u = r.elem.offset(),
			h = r.elem.height(),
			e = f + s < u.top + h,
			o = u.top < f;
		return r.autoFocus && (e || o) && setTimeout(t.scrollToCurrent, 10), n(r.elem).trigger("guiders.show"), t
	}, t.scrollToCurrent = function() {
		var i = t._guiders[t._currentGuiderID];
		if(typeof i != "undefined") {
			var f = t._windowHeight,
				o = n(window).scrollTop(),
				r = i.elem.offset(),
				u = i.elem.height(),
				e = Math.round(Math.max(r.top + u / 2 - f / 2, 0));
			window.scrollTo(0, e)
		}
	}, i = undefined, n(window).resize(function() {
		typeof i != "undefined" && clearTimeout(i), i = setTimeout(function() {
			i = undefined, typeof t != "undefined" && t.reposition()
		}, 20)
	}), t
}.call(this, jQuery), function(n) {
	function t(t) {
		if(typeof t.data == "string") {
			var r = t.handler,
				i = t.data.toLowerCase().split(" ");
			t.handler = function(t) {
				var o, h;
				if(this === t.target || !/textarea|select/i.test(t.target.nodeName) && t.target.type !== "text") {
					var f = t.type !== "keypress" && n.hotkeys.specialKeys[t.which],
						s = String.fromCharCode(t.which).toLowerCase(),
						c, u = "",
						e = {};
					for(t.altKey && f !== "alt" && (u += "alt+"), t.ctrlKey && f !== "ctrl" && (u += "ctrl+"), t.metaKey && !t.ctrlKey && f !== "meta" && (u += "meta+"), t.shiftKey && f !== "shift" && (u += "shift+"), f ? e[u + f] = !0 : (e[u + s] = !0, e[u + n.hotkeys.shiftNums[s]] = !0, u === "shift+" && (e[n.hotkeys.shiftNums[s]] = !0)), o = 0, h = i.length; o < h; o++) if(e[i[o]]) return r.apply(this, arguments)
				}
			}
		}
	}
	n.hotkeys = {
		version: "0.8",
		specialKeys: {
			8: "backspace",
			9: "tab",
			13: "return",
			16: "shift",
			17: "ctrl",
			18: "alt",
			19: "pause",
			20: "capslock",
			27: "esc",
			32: "space",
			33: "pageup",
			34: "pagedown",
			35: "end",
			36: "home",
			37: "left",
			38: "up",
			39: "right",
			40: "down",
			45: "insert",
			46: "del",
			96: "0",
			97: "1",
			98: "2",
			99: "3",
			100: "4",
			101: "5",
			102: "6",
			103: "7",
			104: "8",
			105: "9",
			106: "*",
			107: "+",
			109: "-",
			110: ".",
			111: "/",
			112: "f1",
			113: "f2",
			114: "f3",
			115: "f4",
			116: "f5",
			117: "f6",
			118: "f7",
			119: "f8",
			120: "f9",
			121: "f10",
			122: "f11",
			123: "f12",
			144: "numlock",
			145: "scroll",
			191: "/",
			224: "meta"
		},
		shiftNums: {
			"`": "~",
			1: "!",
			2: "@",
			3: "#",
			4: "$",
			5: "%",
			6: "^",
			7: "&",
			8: "*",
			9: "(",
			0: ")",
			"-": "_",
			"=": "+",
			";": ": ",
			"'": '"',
			",": "<",
			".": ">",
			"/": "?",
			"\\": "|"
		}
	}, n.each(["keydown", "keyup", "keypress"], function() {
		n.event.special[this] = {
			add: t
		}
	})
}(jQuery), function(n) {
	var t = function(t, i) {
			this.options = i, this.element = t, this.$element = n(t), this.$popover = {}, this.padding = 18, this.resultCancel = null, this.opened = !1, this._hideOnClickEnabled = !0, this.$focusedElement = null, this.init()
		};
	t.prototype.init = function() {
		var n = this;
		n.options = n.getOptions(n.options), n.predefinedPosition = n.options.position, n.$element.addClass("popover-trigger-element"), n.options.trigger && (n.$element.bind("click", function(t) {
			if(!n._hideOnClickEnabled) {
				n._hideOnClickEnabled = !0;
				return
			}
			n.opened && n.options.hideOnClick ? n.hide() : n.show(t)
		}), n.$element.is(":input") && n.$element.bind("focus", function(t) {
			n._hideOnClickEnabled = !1, n.opened && n.options.hideOnClick ? n.hide() : n.show(t)
		}))
	}, t.prototype.getOptions = function(t) {
		return n.extend({}, n.fn.popover.defaults, t, {})
	}, t.prototype.extendOptions = function(t) {
		return n.extend({}, this.options, t, {})
	}, t.prototype.callback = function(n) {
		typeof n == "function" && n.call(this)
	}, t.prototype.toggle = function() {
		this.opened ? this.hide() : this.show()
	}, t.prototype.show = function(t, i) {
		var r = this,
			u = r.options,
			o = r.$element,
			f = {},
			e = {};
		i && (r.options = r.extendOptions(i), u = r.options), r.$popover[0] || (r.$popover = n(u.template).addClass(u.theme + " " + u.cssClass).css("width", u.width + "px").find(".popover-content").append(u.html).end(), f = r.$popover, e = r._detectPosition(t), n("body").append(f.css(e.popover)), f.find(".arrow").css(e.arrow), r.callback(u.opening), this.resultCancel = null, f.addClass(u.position).show(), n("html").bind("keyup", n.proxy(r._onDocKeyUpProxyHandler, r)), r.options.modal || (f.find(":input").bind("focus", function() {
			r.$focusedElement = n(this)
		}).bind("blur", function() {
			r.$focusedElement = null
		}), n("html").bind("mousedown mousewheel", n.proxy(r._onDocClickProxyHandler, r)), n(window).bind("resize", n.proxy(r._onDocScrollResizeHandler, r)), n(r.btnEl).parents().bind("scroll", n.proxy(r._onDocScrollResizeHandler, r)), n(window).bind("blur", n.proxy(r._onDocScrollResizeHandler, r))), r.callback(u.open), r.opened = !0, o.addClass("popover-opened"))
	}, t.prototype._onDocClickProxyHandler = function(t) {
		var f = this.$popover,
			u = this.$element,
			r = n(t.target).parents(),
			i;
		n(t.target)[0] !== f[0] && ((i = r.filter(f), i.length > 0) || n(t.target)[0] !== u[0] && ((i = r.filter(u), i.length > 0) || (i = r.filter(".k-list-container"), i.length > 0) || (this.$focusedElement && this.$focusedElement.blur(), this.hide())))
	}, t.prototype._onDocKeyUpProxyHandler = function(n) {
		n.which === 27 && (this.resultCancel = !0, this.hide())
	}, t.prototype._onDocScrollResizeHandler = function() {
		this.$focusedElement && this.$focusedElement.blur(), this.hide()
	}, t.prototype._onKeyUpHandler = function(n) {
		n.keyCode === 27 && this.hide()
	}, t.prototype._detectPosition = function() {
		var n = this,
			t = {};
		n.options.position = n.predefinedPosition;
		switch(n.predefinedPosition) {
		case "top":
			t = n._positionTop();
			break;
		case "left":
			t = n._positionLeft();
			break;
		case "right":
			t = n._positionRight();
			break;
		default:
			t = n._positionBottom()
		}
		return t
	}, t.prototype._positionLeft = function(n) {
		var r = this.$element,
			i = r.offset(),
			t = {};
		return t.popover = {
			left: i.left - this.options.width,
			top: i.top
		}, n || (t.popover = this._adjustPositionToViewPortX(t.popover)), t.popover = this._adjustPositionToViewPortY(t.popover), t.arrow = {
			top: Math.abs(i.top + r.outerHeight() / 2 - t.popover.top)
		}, t
	}, t.prototype._positionTop = function(t) {
		var u = this.$element,
			r = u.offset(),
			f = n(window).height(),
			i = {};
		return i.popover = {
			left: r.left - this.options.width / 2 + u.outerWidth() / 2,
			bottom: f - r.top
		}, i.popover = this._adjustPositionToViewPortX(i.popover), t || (i.popover = this._adjustPositionToViewPortY(i.popover)), i.arrow = this._calculateArrowPositionX(r, u.outerWidth(), i.popover), i
	}, t.prototype._positionRight = function(n) {
		var i = this.$element,
			r = i.offset(),
			t = {};
		return t.popover = {
			left: r.left + i.outerWidth(),
			top: r.top
		}, n || (t.popover = this._adjustPositionToViewPortX(t.popover)), t.popover = this._adjustPositionToViewPortY(t.popover), t.arrow = {
			top: Math.abs(r.top + i.outerHeight() / 2 - t.popover.top)
		}, t
	}, t.prototype._positionBottom = function(n) {
		var i = this.$element,
			r = i.offset(),
			t = {};
		return t.popover = {
			left: r.left - this.options.width / 2 + i.outerWidth() / 2,
			top: r.top + i.outerHeight()
		}, t.popover = this._adjustPositionToViewPortX(t.popover), n || (t.popover = this._adjustPositionToViewPortY(t.popover)), t.arrow = this._calculateArrowPositionX(r, i.outerWidth(), t.popover), t
	}, t.prototype._calculateArrowPositionX = function(t, i, r) {
		var u = {},
			f = t.left + i / 2;
		return u = r.right > 0 ? {
			left: Math.abs(f - n(document).width() + this.options.width + r.right)
		} : {
			left: Math.abs(f - r.left)
		}
	}, t.prototype._adjustPositionToViewPortX = function(t) {
		var i = n(document).width();
		return t.left + this.options.width > i ? this.options.position === "right" ? (this.options.position = "left", t = this._positionLeft(!0).popover) : (t.right = this.padding, t.left = "auto") : t.left < 0 && (this.options.position === "left" ? (this.options.position = "right", t = this._positionRight(!0).popover) : t.left = this.padding), t
	}, t.prototype._adjustPositionToViewPortY = function(t) {
		var i = n(window).height();
		return i - t.top < t.top && (t.top + this.options.tolerance > i ? (this.options.position = "top", t = this._positionTop(!0).popover) : t.top <= 0 ? this.options.position === "top" ? (this.options.position = "bottom", t = this._positionBottom(!0).popover) : t.top = this.padding : t.bottom + this.options.tolerance >= i && this.options.position === "top" && (this.options.position = "bottom", t = this._positionBottom(!0).popover)), t
	}, t.prototype.hide = function(t) {
		var i = this;
		t && (i.options = i.getOptions(t)), i.opened && (n("html").unbind("keyup", i._onDocKeyUpProxyHandler), i.options.modal || (n("html").unbind("mousedown mousewheel", i._onDocClickProxyHandler), n(window).unbind("resize", i._onDocScrollResizeHandler), n(i.btnEl).parents().unbind("scroll", i._onDocScrollResizeHandler), n(window).unbind("blur", i._onDocScrollResizeHandler)), i.callback(i.options.close), i.$popover.hide(), i.$popover.remove(), i.$popover = {}, i.opened = !1, i.$element.removeClass("popover-opened"))
	}, t.prototype.destroy = function() {
		this.hide(), this.$element.unbind("click").removeData("popover").removeClass("popover-trigger-element"), n(document).unbind("keyup", this._onKeyUpHandler)
	}, n.fn.popover = function(i, r) {
		return this.each(function() {
			var f = n(this),
				u = f.data("popover"),
				e = typeof i == "object" && i;
			u || f.data("popover", u = new t(this, e)), typeof i == "string" && u[i](null, r)
		})
	}, t.prototype.setContent = function(n) {
		this.$popover.find(".popover-content").html(n)
	}, n.fn.popover.defaults = {
		theme: "info",
		position: "top",
		cssClass: "",
		hideOnEsc: !1,
		hideOnClick: !0,
		template: '<div class="popover"><div class="arrow"></div><div class="popover-content"></div></div>',
		tolerance: 200,
		trigger: !0,
		modal: !1,
		width: 300,
		html: ""
	}
}(jQuery), function(n) {
	var t = function(t, i) {
			this.options = i, this.element = t, this.$element = n(t), this.enabled = !0, this.expanded = !0, this.init()
		};
	t.prototype.init = function() {
		var n = this,
			i = n.$element,
			t = {};
		n.options = n.getOptions(n.options), t = n.options, n.maxHeight = t.height, i.addClass("show-more-element").css("overflow", "hidden").wrap('<div class="show-more-wrap expanded"></div>').after('<a href="javascript:void(0)" class="show-more-button"><span class="more">' + t.moreText + '</span><span class="less">' + t.lessText + "</span></a>"), n.$wrap = i.parent("div.show-more-wrap").css("margin", i.css("margin")), n.$btn = n.$wrap.find("a.show-more-button"), n.collapse(), n.$btn.click(function(t) {
			t.preventDefault(), n.toggle()
		})
	}, t.prototype.getOptions = function(t) {
		return n.extend({}, n.fn.showMore.defaults, t, {})
	}, t.prototype.toggle = function() {
		this.expanded ? this.collapse() : this.expand()
	}, t.prototype.disable = function() {
		this.$wrap.addClass("show-more-disabled"), this.enabled = !1
	}, t.prototype.enable = function() {
		this.$wrap.removeClass("show-more-disabled"), this.enabled = !0
	}, t.prototype.expand = function() {
		var r = this,
			n = this.$element,
			i = n.height(),
			t = n[0].scrollHeight;
		i !== t ? (this.enabled || this.enable(), n.css({
			height: i + "px",
			maxHeight: "none"
		}).stop().animate({
			height: t
		}, "fast", function() {
			r.$wrap.removeClass("collapsed").addClass("expanded"), r.expanded = !0
		})) : (this.disable(), this.$element.css({
			height: "",
			maxHeight: "none"
		}))
	}, t.prototype.collapse = function() {
		var i = this,
			t = this.$element,
			u = t.height(),
			n = this.options.height,
			r = t[0].scrollHeight;
		r > n ? (this.enabled || this.enable(), this.$element.css({
			maxHeight: "none",
			height: u + "px"
		}).stop().animate({
			height: n
		}, "fast", function() {
			i.$wrap.removeClass("expanded").addClass("collapsed"), i.expanded = !1
		})) : (this.disable(), this.$element.css({
			height: "",
			maxHeight: "none"
		}))
	}, n.fn.showMore = function(i, r) {
		return this.each(function() {
			var f = n(this),
				u = f.data("showMore"),
				e = typeof i == "object" && i;
			u || f.data("showMore", u = new t(this, e)), typeof i == "string" && u[i](null, r)
		})
	}, n.fn.showMore.defaults = {
		height: 100,
		moreText: "Show more",
		lessText: "Show less"
	}
}(jQuery)