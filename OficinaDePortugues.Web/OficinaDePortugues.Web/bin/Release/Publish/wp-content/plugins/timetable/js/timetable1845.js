jQuery(document).ready(function($){
	var $timetable = $(),	//allows to determine which timetable should be used
		tt_atts;	//value depends on the active timetable
	
	$(".tt_tabs_navigation a").click(function(event){
		var $this = $(this);
		$this.parent().parent().find("li").removeClass("ui-tabs-active");
		$this.parent().addClass("ui-tabs-active");
	});
	
	$(".tt_tabs").tabs({
		event: "change",
		show: true,
		create: function(event, ui){
			$timetable = ui.panel.closest(".tt_wrapper");
			if($timetable.find(".tt_tabs_navigation.all_filters").length 
				&& window.location.href.indexOf("book-event-hour-")===-1)
			{
				if(ui.tab.length && $timetable.find(".tt_tabs_navigation.events_categories_filter a[href='" + ui.tab[0].children[0].hash + "']").length)
					$timetable.find(".tt_tabs_navigation.events_categories_filter a[href='" + ui.tab[0].children[0].hash + "']").parent().addClass("ui-tabs-active");
				else
					$timetable.find(".tt_tabs_navigation.events_categories_filter li:first-child a").parent().addClass("ui-tabs-active");
				
				if(ui.tab.length && $timetable.find(".tt_tabs_navigation.events_filter a[href='" + ui.tab[0].children[0].hash + "']").length)
					$timetable.find(".tt_tabs_navigation.events_filter a[href='" + ui.tab[0].children[0].hash + "']").parent().addClass("ui-tabs-active");
				else
					$timetable.find(".tt_tabs_navigation.events_filter li:first-child a").parent().addClass("ui-tabs-active");
			}
			
//			scroll to active timetable
			var param_fragment = escape_str($.param.fragment());
			if($('#' + param_fragment).length)
				$("html, body").animate({scrollTop: $('#' + param_fragment).closest(".tt_wrapper").offset().top-80}, 400);
		}
	});
	
	//browser history
	$(".tt_tabs .ui-tabs-nav a").click(function(){
		if($(this).attr("href").substr(0,4)!="http")
			$.bbq.pushState($(this).attr("href"));
		else
			window.location.href = $(this).attr("href");
	});
	
	//dropdown navigation
	$(".tabs_box_navigation").mouseover(function(){
		$(this).find("ul").removeClass("tabs_box_navigation_hidden");
	});
	
	$(".tabs_box_navigation a").click(function(event){
		if($.param.fragment()==$(this).attr("href").replace("#", "") || ($.param.fragment()=="" && $(this).attr("href").replace("#", "").substr(0, 10)=="all-events"))
			event.preventDefault();
		$(this).parent().parent().find(".selected").removeClass("selected");
		$(this).parent().addClass("selected");
		$(this).parent().parent().parent().children("label").text($(this).text());
		$(this).parent().parent().addClass("tabs_box_navigation_hidden");
	});
	
	$(".tt_tabs_navigation:not(.all_filter) a, .tabs_box_navigation:not(.all_filter) a").click(function(event){
		event.preventDefault();
		var $this = $(this),
			hash,
			newHref,
			sharpIdx,
			event_str,
			events_category_str,
			all_events_str;
		
		$timetable = $this.closest(".tt_wrapper");
		all_events_str = "all-events" + (typeof($timetable.attr("id"))!="undefined" ? "-" + $timetable.attr("id") : "");
		
		hash = $this.attr("href");
		sharpIdx = (window.location.href.indexOf("#")!==-1 ? window.location.href.indexOf("#") : window.location.href.length);
		event_str = ($timetable.find(".events_filter .selected a").length ? $timetable.find(".events_filter .selected a").attr("href").replace("#", "") : ($timetable.find(".events_filter .ui-tabs-active a").length ? $timetable.find(".events_filter .ui-tabs-active a").attr("href").replace("#", "") : ""));
		events_category_str = ($timetable.find(".events_categories_filter .selected a").length ? $timetable.find(".events_categories_filter .selected a").attr("href").replace("#", "") : ($timetable.find(".events_categories_filter .ui-tabs-active a").length ? $timetable.find(".events_categories_filter .ui-tabs-active a").attr("href").replace("#", "") : ""));
		$timetable.find(".tt_error_message").addClass("tt_hide");
		if(event_str!=="" && events_category_str!=="")
		{
			if((event_str!==all_events_str && events_category_str!==all_events_str && $timetable.find("[id='" + event_str + "'][class*='tt-event-category-" + events_category_str.toLowerCase() +"']").length) || (events_category_str===all_events_str))
			{
				newHref = escape_str(window.location.href.substr(0, sharpIdx)) + decodeURIComponent("#" + event_str);
				if(window.location.href!=newHref)
					window.location.href = newHref;
			}
			else if(event_str===all_events_str && events_category_str!==all_events_str)
			{
				newHref = escape_str(window.location.href.substr(0, sharpIdx)) + decodeURIComponent("#" + events_category_str);
				if(window.location.href!=newHref)
					window.location.href = newHref;
			}
			else
			{
				var scrollTop = $(document).scrollTop();
				newHref = escape_str(window.location.href.substr(0, sharpIdx)) + "#";
				if(window.location.href!=newHref)
					window.location.href = newHref;
				$timetable.find(".tt_tabs").tabs("option", "collapsible", true);
				$timetable.find(".tt_tabs").tabs("option", "active", false);
				$timetable.find(".tt_error_message").removeClass("tt_hide");
				$("html, body").scrollTop(scrollTop);
			}
		}
		else
		{
			newHref = escape_str(window.location.href.substr(0, sharpIdx)) + decodeURIComponent(hash);
			if(window.location.href!=newHref)
				window.location.href = newHref;
			//window.location.hash is causing issues on Safari, because of that
			//it's necessary to use window.location.href
		}			
	});
	
	//hashchange
	$(window).bind("hashchange", function(event){
		var param_fragment = escape_str($.param.fragment());
		//some browsers will have the URL fragment already encoded, 
		//while others will not, thus it's necessary to handle both cases.
	
		//URL fragment is already encoded:
		$(".tabs_box_navigation a[href='#" + param_fragment + "']").trigger("click");
		$(".tt_tabs .ui-tabs-nav [href='#" + param_fragment + "']").trigger("change");
		//URL fragment must be encoded:
		$(".tabs_box_navigation a[href='#" + encodeURIComponent(param_fragment) + "']").trigger("click");
		$(".tt_tabs .ui-tabs-nav [href='#" + encodeURIComponent(param_fragment) + "']").trigger("change");
	}).trigger("hashchange");
	
	//tooltip
	$(".tt_tooltip").bind("mouseover click", function(){
		var $this = $(this),
			$attach_to = $this,
			$tooltip_text,
			position,
			top,
			left;
			
		if($this.is(".event_container"))
			$attach_to = $this.parent();
		$tooltip_text = $this.children(".tt_tooltip_text");

		$tooltip_text.css("width", $this.outerWidth() + "px");
		$tooltip_text.css("height", $tooltip_text.height() + "px");
		
		if($('body').hasClass('rtl'))
		{
			//RTL MODE, TD is static
			position = $attach_to.position();
			top = position.top-$tooltip_text.innerHeight() + "px";
			left = position.left + "px";
		}
		else
		{
			//LTR MODE, TD is relative
			top = -($tooltip_text.parent().offset().top-$attach_to.offset().top+$tooltip_text.innerHeight()) + "px";
			left = "0px";
		}
		
		$tooltip_text.css({
			"top":  top,
			"left": left
		});
	});
	
	//Handle hover booking buttons in RTL mode
	$("body.rtl .booking_hover_buttons td.event").bind("mouseover click", function(){
		var $td = $(this),
			button_height = 50,	/* fixed value */
			height,
			width;
		
		if($td.hasClass("tt_single_event"))
		{
			height = Math.ceil($td[0].getBoundingClientRect().height);
			width = Math.ceil($td[0].getBoundingClientRect().width);
			$td.find(".event_hour_booking_wrapper.on_hover").css({
				'top': $td.position().top+height-button_height,
				'left': $td.position().left,
				//On FF elements may have fractional height/width,
				//we need to get the exact value and round it up.
				'width': width,
			});
		}
		else
		{
			$td.find(".event_container").each(function() {
				var $event_container = $(this),
					$booking_wrapper = $event_container.find(".event_hour_booking_wrapper.on_hover");
				
				height = Math.ceil($event_container[0].getBoundingClientRect().height);
				width = Math.ceil($event_container[0].getBoundingClientRect().width);
				$booking_wrapper.css({
					'top': $event_container.position().top+height-button_height,
					'left': $event_container.position().left,
					//On FF elements may have fractional height/width,
					//we need to get the exact value and round it up.
					'width': width,
				});
			});
		}
	});
	
	//upcoming events
	$(".tt_upcoming_events").each(function(){
		var self = $(this),
			autoscroll = 0,
			elementClasses = self.attr("class").split(" ");
		
		for(var i=0; i<elementClasses.length; i++)
		{
			if(elementClasses[i].indexOf("autoscroll-")!=-1)
				autoscroll = elementClasses[i].replace("autoscroll-", "");
		}
		self.carouFredSel({
			direction: "up",
			items: {
				visible: (self.children().length>2 ? 3 : self.children().length),
				height: "variable"
			},
			scroll: {
				items: 1,
				easing: "swing",
				pauseOnHover: true
			},
			prev: {button: self.next().children("#upcoming_event_prev")},
			next: {button: self.next().children("#upcoming_event_next")},
			auto: {
				play: (parseInt(autoscroll) ? true : false)
			}
		});
		
		self.find("li a.tt_upcoming_events_event_container, li>span").hover(function(){
			self.trigger("configuration", ["debug", false, true]);
		},
		function(){
			setTimeout(function(){
				self.trigger("configuration", ["debug", false, true]);
			}, 1);
		});
	});
	$(window).resize(function(){
		$(".tt_upcoming_events").trigger("configuration", ["debug", false, true]);
	});
	
	//timetable row heights
	/*var maxHeight = Math.max.apply(null, $(".timetable:visible tr td:first-child").map(function ()
	{
		return $(this).height();
	}).get());
	$(".timetable:visible tr td").css("height", maxHeight);
	//timetable height fix
	$(".timetable .event").each(function(){
		if($(this).children(".event_container").length>1)
		{
			var childrenHeight = 0;
			$(this).children(".event_container").not(":last").each(function(){
				childrenHeight += $(this).innerHeight();
			});
			var height = $(this).height()-childrenHeight-($(this).parent().parent().width()<=750 ? 9 : 22);
			if(height>$(this).children(".event_container").last().height())
				$(this).children(".event_container").last().css("height", height + "px");
		}
	});*/
	
	//show/hide event hours on mobile device
	$(document.body).on("click", ".tt_timetable.small .plus.box_header", function(event) {
		var $this = $(this),
			$list = $this.next("ul.tt_items_list");
		$list.slideDown(500);
		$this.removeClass("plus");
		$this.addClass("minus");
	});
	$(document.body).on("click", ".tt_timetable.small .minus.box_header", function(event) {
		var $this = $(this),
			$list = $this.next("ul.tt_items_list");
		$list.slideUp(500, function() {
			$this.removeClass("minus");
			$this.addClass("plus");
		});
	});
	
	if($(".tt_booking").length && in_iframe())
	{
		$(".tt_booking").addClass("in_iframe");
	}
	
	$(document.body).on("click touchstart", ".event_hour_booking", function(event) {
		event.preventDefault();
		var $this = $(this),
			$booking_popup = $this.closest('.tt_wrapper').find('.tt_booking'),
			$booking_popup_message = $booking_popup.find(".tt_booking_message"),
			$booking_popup_preloader = $booking_popup.find(".tt_preloader"),
			event_hour_id = $this.attr("data-event-hour-id"),
			redirect_url = window.location.href;
			
		$timetable = $this.closest(".tt_wrapper");
		tt_atts = $.parseJSON($timetable.find(".timetable_atts").val());
		
		if(redirect_url.indexOf("#")===-1)
			redirect_url = redirect_url + "#book-event-hour-" + event_hour_id;
		else
			redirect_url = redirect_url.substr(0, redirect_url.indexOf("#")) + "#book-event-hour-" + event_hour_id;
		
		if($this.hasClass("unavailable") || $this.hasClass("booked"))
			return;
		
		$booking_popup_message.html("");
		open_booking_popup();
		$booking_popup_preloader.removeClass("tt_hide");
		resize_booking_popup();
		$booking_popup_message.attr("data-event-hour-id", event_hour_id);
		
		$.post(tt_config.ajaxurl,
			{
				action: "timetable_ajax_event_hour_details",
				redirect_url: redirect_url,
				event_hour_id: event_hour_id,
				time_format: tt_atts.time_format,
				booking_popup_message_template: tt_atts.booking_popup_message,
				booking_popup_label: tt_atts.booking_popup_label,
				cancel_popup_label: tt_atts.cancel_popup_label,
				continue_popup_label: tt_atts.continue_popup_label,
				login_popup_label: tt_atts.login_popup_label,
			},
			function(result){
				var indexStart,
					indexEnd;
				/* assign event handler, fix for bug occuring on Android devices */
				$booking_popup.on("click touchstart", handle_booking_popup_message_click_touch);
				$booking_popup_preloader.addClass("tt_hide");
				indexStart = result.indexOf("timetable_start")+15;
				indexEnd = result.indexOf("timetable_end")-indexStart;
				result = $.parseJSON(result.substr(indexStart, indexEnd));
				if(typeof(result.msg!=="undefined"))
				{
					if(!result.error)
						$booking_popup_message.html(result.msg);
					else
					{
						$booking_popup_message.html("<p>" + result.msg + "</p><div><a href='#' class='tt_btn cancel'>" + tt_atts.cancel_popup_label + "</a></div>");
					}
					resize_booking_popup();
				}
			},
			"html"
		);
	});
	
	$(document.body).on("click touchstart", ".tt_booking .tt_btn.book", function(event)
	{
		event.preventDefault();
		var $this = $(this),			
			$booking_popup = $timetable.find(".tt_booking"),
			$booking_popup_message = $booking_popup.find(".tt_booking_message"),
			$booking_popup_preloader = $booking_popup.find(".tt_preloader"),
			event_hour_id = $booking_popup_message.attr("data-event-hour-id");
		
		$booking_popup_message.html("");
		$booking_popup_preloader.removeClass("tt_hide");
		resize_booking_popup();
		
		$.post(tt_config.ajaxurl,
			{
				action: "timetable_ajax_event_hour_booking",
				event_hour_id: event_hour_id,
				time_format: tt_atts.time_format,
				available_slots_singular_label: tt_atts.available_slots_singular_label,
				available_slots_plural_label: tt_atts.available_slots_plural_label,
				continue_popup_label: tt_atts.continue_popup_label,
				booking_popup_thank_you_message_template: tt_atts.booking_popup_thank_you_message,
			},
			function(result){
				var indexStart,
					indexEnd,
					booked_button_html;
				
				$booking_popup_preloader.addClass("tt_hide");
				indexStart = result.indexOf("timetable_start")+15;
				indexEnd = result.indexOf("timetable_end")-indexStart;
				result = $.parseJSON(result.substr(indexStart, indexEnd));
				if(typeof(result.msg!=="undefined"))
				{
					if(!result.error)
					{
						$booking_popup_message.html(result.msg);
						booked_button_html = 
							"<a href='#'" + 
							" class='event_hour_booking id-" + event_hour_id + " booked " + tt_atts.show_booking_button + "'" + 
							" style='" + (tt_atts.booked_text_color.length && tt_atts.booked_text_color.toUpperCase()!="AAAAAA" ? " color:#" + tt_atts.booked_text_color + " !important;" : "") + (tt_atts.booked_bg_color.length && tt_atts.booked_bg_color.toUpperCase()!="EEEEEE" ? "' background-color:#'" + tt_atts.booked_bg_color + " !important;" : "") + "'" + 
							" title='" + tt_atts.booked_label + "'>" + 
								tt_atts.booked_label + 
							"</a>";
						
						$timetable.find(".event_hour_booking.id-" + event_hour_id).replaceWith(booked_button_html);
						
						if(typeof(result.available_slots_label)!=="undefined")
						{
							if(result.remaining_places>0)
								$timetable.find(".available_slots.id-" + event_hour_id + "").html(result.available_slots_label);
							else
								$timetable.find(".available_slots.id-" + event_hour_id + "").remove();
						}
					}
					else
					{
						$booking_popup_message.html("<p>" + result.msg + "</p><div><a href='#' class='tt_btn cancel'>" + tt_atts.cancel_popup_label + "</a></div>");
					}
					resize_booking_popup();
				}
			},
			"html"
		);
	});
	
	function handle_booking_popup_message_click_touch(event)
	{
		var $this = $(this),
			target = $(event.target);
		if(target.is($this))
			close_booking_popup();
	}
	
	function handle_orinentation_change()
	{
		var no_change_count_to_end = 100,
			no_end_timeout = 1000;
		
		(function () {
			var orientationchange_interval,
				orientationchange_timeout,
				end_timming,
				last_inner_width,
				last_inner_height,
				no_change_count;

			end_timming = function ()
			{
				clearInterval(orientationchange_interval);
				clearTimeout(orientationchange_timeout);

				orientationchange_interval = null;
				orientationchange_timeout = null;

				//orientationchange has ended
				resize_booking_popup();
			};

			orientationchange_interval = setInterval(function ()
			{
				if (window.innerWidth === last_inner_width && window.innerHeight === last_inner_height)
				{
					no_change_count++;

					if (no_change_count === no_change_count_to_end)
					{
						end_timming();
					}
				}
				else
				{
					last_inner_width = window.innerWidth;
					last_inner_height = window.innerHeight;
					no_change_count = 0;
				}
			});
			orientationchange_timeout = setTimeout(function () {
				end_timming();
			}, no_end_timeout);
		})();
	}
	
	$(document.body).on("click touchstart", ".tt_btn.cancel, .tt_btn.continue", function(event) {
		event.preventDefault();
		close_booking_popup();
	});
	
	function open_booking_popup()
	{
		var	$booking_popup = $timetable.find(".tt_booking"),
			$booking_popup_wrapper = $booking_popup.find(".tt_booking_message_wrapper");
		$booking_popup.removeClass("tt_hide");
		
		if($booking_popup.hasClass("in_iframe"))
		{
			var offset_top = parent.document.body.scrollTop,
				window_heigh = parent.window.innerHeight,
				popup_height = $booking_popup_wrapper.outerHeight(),
				margin_top;

			margin_top = ((window_heigh-popup_height)/2 + offset_top);
			$booking_popup_wrapper.css({
				'margin-top': margin_top + "px",
			});
		}
	}
	
	function close_booking_popup()
	{
		var $booking_popup = $timetable.find(".tt_booking");
		/* remove event handler, fix for bug occuring on Android devices */
		$booking_popup.off("click touchstart", handle_booking_popup_message_click_touch);
		$booking_popup.addClass("tt_hide");
		$booking_popup.find(".tt_booking_message_wrapper").css({
			"height": "",
			"margin-top": "",
		});
		if(window.location.href.indexOf("book-event-hour-")!==-1)
		{
			window.location.href = escape_str(window.location.href.substr(0, window.location.href.indexOf("#"))) + "#";
		}
	}
	
	function resize_booking_popup()
	{
		
		var	$booking_popup = $timetable.find(".tt_booking"),
			$booking_popup_wrapper = $booking_popup.find(".tt_booking_message_wrapper"),
			popup_message_height = $booking_popup_wrapper.outerHeight(),
			popup_message_height_auto = $booking_popup_wrapper.css("height", "").outerHeight(),
			window_height = ($booking_popup.hasClass("in_iframe") ? parent.window.innerHeight : $(window).outerHeight()),
			popup_message_height_new;
	
		if(popup_message_height_auto+40<window_height)
		{
			popup_message_height_new = popup_message_height_auto;
			$booking_popup_wrapper.css({
				"overflow-y": ""
			});
		}
		else
		{
			popup_message_height_new = window_height-40;
			$booking_popup_wrapper.css({
				"overflow-y": "scroll"
			});
		}
		
		if($booking_popup.hasClass("in_iframe"))
		{
			var offset_top = parent.document.body.scrollTop,
				margin_top;
			
			margin_top = ((window_height-popup_message_height_new)/2 + offset_top);

			$booking_popup_wrapper.animate({"margin-top": margin_top + "px"}, 200);
		}
		
		$booking_popup_wrapper.css("height", popup_message_height);
		if(popup_message_height!=popup_message_height_new)
			$booking_popup_wrapper.stop(false, true).animate({"height": popup_message_height_new}, 200);
	}
	$(window).resize(resize_booking_popup);
	window.addEventListener("orientationchange", handle_orinentation_change);
	
	if(window.location.href.indexOf("book-event-hour-")!==-1)
	{ 
		var event_hour_id = window.location.href.substr(window.location.href.indexOf("book-event-hour-")+16),
			$booking_link = $("a.event_hour_booking.id-" + event_hour_id).eq(0);
		if($booking_link.length)
		{
			$("html, body").animate({scrollTop: $booking_link.offset().top-80}, 400);
			$booking_link.click();
		}
	}
	
	function escape_str($text)
	{
		return $("<div/>").text($text).html();
	}
	
	$("form.tt_generate_pdf").on("submit", function(event) {
		var $this = $(this),
			$timetable_copy,
			timetable_html;
		
		$timetable = $this.closest(".tt_wrapper");
		
		$timetable_copy = $timetable.find(".tt_tabs div.ui-tabs-panel:visible .tt_timetable.small").clone();
		$timetable_copy.find("*").attr("style", "");	//helps to remove the colors
		timetable_html = $timetable_copy[0].outerHTML;
		if($("body").hasClass("rtl"))
			timetable_html = "<div class='rtl'>" + timetable_html + "</div>";
		$this.find("textarea[name='tt_pdf_html_content']").val(timetable_html);
		return true;
	});
	
	function in_iframe()
	{
		try {
			return window.self !== window.top;
		} catch (e) {
			return true;
		}
	}
});