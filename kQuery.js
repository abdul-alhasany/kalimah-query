// https://j11y.io/javascript/extending-jquerys-selector-capabilities/
// http://benalman.com/news/2010/03/jquery-special-events/
//http://stackoverflow.com/a/5490021/529024
// http://www.jameswiseman.com/blog/2010/04/19/creating-a-jquery-custom-selector/

// Check whether element is currently within the viewport:
$.extend($.expr[':'], {
	'inViewFull' : function (elem) {

		var element = $(elem)[0];
		var bounds = element.getBoundingClientRect();
		return bounds.top > 0 && bounds.bottom < window.innerHeight;
	},
	'inView' : function (elem) {

		var element = $(elem)[0];
		var bounds = element.getBoundingClientRect();

		return bounds.bottom > 0 && bounds.top < window.innerHeight;

	},
	// Check whether links are external:
	// (Only works with elements that have href):
	external : function (a, i, m) {
		if (!a.href) {
			return false;
		}

		var hostname = window.location.hostname;

		if (m[3] != '')
			hostname = m[3];

		return a.hostname && a.hostname == hostname;
	},

	'containsi' : function (elem, i, match, array) {
		return jQuery(elem).text().toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
	}
});
// A collection of elements to which the clickoutside event is bound.
var elems = $([]);

// Clicking outside element event
$.event.special.clickOutside = {
	setup : function () {
		// Add this element to the internal collection.
		elems = elems.add(this);

		// If this is the first element to which the event has been bound,
		// bind a handler to document to catch all 'click' events.
		if (elems.length === 1) {
			$(document).on('click', function (event) {

				// Iterate over all elements in the internal collection.
				$(elems).each(function () {
					var elem = $(this);

					// If this element isn't the clicked element, and this element doesn't
					// contain the clicked element, then the clicked element is considered
					// outside, and the event should be triggered!
					if (this !== event.target && !elem.has(event.target).length) {

						// Use triggerHandler instead of trigger so that the event doesn't
						// bubble. Pass the 'click' event.target so that the 'clickoutside'
						// event.target can be overridden.
						elem.triggerHandler('clickOutside', [event.target]);
					}
				});
			});
		}
	}
}

/* Key Events*/
var keys = {
	'enterKey' : 13,
	'spaceKey' : 32,
	'tabKey' : 9,
	'altKey' : 18,
	'ctrlKey' : 17,
	'shiftKey' : 16,
	'escKey' : 27,
	'numKey' : 144,
	'scrolLock' : 145,
	'insertKey' : 45,
	'homeKey' : 36,
	'pgUpKey' : 33,
	'pgDownKey' : 34,
	'delKey' : 46,
	'endKey' : 35,
	'backspaceKey' : 8
};

$.map(
	Object.keys(keys),
	function (event_name) {
	$.event.special[event_name] = {
		delegateType : "keydown",
		bindType : "keydown",
		handle : function (event) {
			var handleObj = event.handleObj;
			var targetData = jQuery.data(event.target);
			var ret = null;

			if (event.keyCode == keys[event_name]) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply(this, arguments);
				event.type = handleObj.type;
				return ret;
			}
		}
	};
});

/* Resize once */
var doit;
$.event.special.resizeOnce = {
	delegateType : "resize",
	bindType : "resize",
	handle : function (event) {
		var handleObj = event.handleObj;
		var targetData = jQuery.data(event.target);
		var ret = null;

		clearTimeout(doit);
		doit = setTimeout(function () {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply(this, arguments);
				event.type = handleObj.type;

			}, 100);

		return ret;
	}
};
/* Scroll Events */
var scrollDirections = ['scrollUp', 'scrollDown', 'scrollLeft', 'scrollRight'];
$.map(
	scrollDirections,
	function (event_name) {
	$.event.special[event_name] = {
		delegateType : "scroll",
		bindType : "scroll",
		handle : function (event) {
			var handleObj = event.handleObj;
			var targetData = jQuery.data(event.target);
			var ret = null;

			var element = jQuery(event.target);

			var st = jQuery(window).scrollTop();
			var sl = jQuery(window).scrollLeft();

			var lastScrollTop = element.data("data-scrollTop") || 0;
			var lastScrollLeft = element.data("data-scrollLeft") || 0;
			var triggerd = false;

			if ((st > lastScrollTop && event_name == 'scrollDown') || (st < lastScrollTop && event_name == 'scrollUp')) {
				triggerd = true;
				element.data("data-scrollTop", st);
			}

			if ((sl > lastScrollLeft && event_name == 'scrollRight') || (sl < lastScrollLeft && event_name == 'scrollLeft')) {
				triggerd = true;
				element.data("data-scrollLeft", sl);
			}

			if (triggerd) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply(this, arguments);
				event.type = handleObj.type;
				return ret;
			}
		}
	};
});

/* Functions */
jQuery.fn.firstWord = function () {
	var element = jQuery(this[0]) // It's your element
		var text = element.text();

	// Get the first word
	var word = text.substr(0, text.indexOf(" "));

	// Creat new element
	var newElement = jQuery("<span>" + word + "</span>");

	// Modifiy the text, remove the first word from the text
	var newText = text.substr(word.length);
	element.text(newText);

	// prepend element and return to be able to style it
	element.prepend(newElement);

	return newElement; // This is needed so others can keep chaining off of this
};

/* Swipe Events */
var swipeDirections = ['swipeUp', 'swipeDown', 'swipeLeft', 'swipeRight'];
$.map(
	swipeDirections,
	function (event_name) {
	$.event.special[event_name] = {
		setup : function (event) {
			var elem = jQuery(this);

			elem.on('mousedown touchstart', function (e) {
				xDown = e.pageX;
				yDown = e.pageY;
			})
			.on('mouseup touchend', function (e) {
				xUp = e.pageX;
				yUp = e.pageY;

				var dx = xUp - xDown;
				var dy = yUp - yDown;

				var dir = '';

				if (Math.abs(dx) >= 30) {
					dir = dx > 0 ? 'Right' : 'Left'
				} else if (Math.abs(dy) >= 30) {
					dir = dy > 0 ? 'Up' : 'Down'
				}

				if (event_name == 'swipe' + dir && elem.data("data-drag") != true) {
					elem.triggerHandler('swipe' + dir);
				}
			});
		}
	}
});

$.event.special.drag = {
	setup : function (event) {
		var elem = jQuery(this);
		elem.data("data-drag", false);

		elem.on('mousedown touchstart', function (e) {
			xDown = e.pageX;
			yDown = e.pageY;

			elem.data("data-drag", true);

		}).on('mousemove touchmove', function (e) {

			if (elem.data("data-drag") == true) {
				var dragStart = elem.data("data-dragging");
				if (typeof dragStart == 'undefined' || dragStart == false) {
					elem.triggerHandler('drag', {
						'state' : 'dragStart'
					});
					elem.data("data-dragging", true);
				}

				var obj = {
					x : e.pageX,
					y : e.pageY,
					'state' : 'dragging'
				};

				elem.triggerHandler('drag', obj);
			}
		}).on('mouseup touchend', function (e) {
			var dragEnd = elem.data("data-dragging");

			if (dragEnd == true) {
				elem.triggerHandler('drag', {
					'state' : 'dragEnd'
				});
				elem.data("data-dragging", false);
			}

			if (elem.data("data-drag") == true)
				elem.data("data-drag", false);
		});

		jQuery(document).mouseleave(function () {
			var dragEnd = elem.data("data-dragging");

			if (dragEnd == true) {
				elem.triggerHandler('drag', {
					'state' : 'dragEnd'
				});
				elem.data("data-dragging", false);
			}

			if (elem.data("data-drag") == true)
				elem.data("data-drag", false);
		});
	}
}
