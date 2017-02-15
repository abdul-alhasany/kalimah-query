# Kalimah Query

Kalimah Query is small addition to jQuery (~4kb minified) that adds extra functions to jQuery library. jQuery is an extensible tool but lacks certain common features that developer need to use regularly which are not incorporated into jQuery code. Therefore, Kalimah Query adds functionality to three parts of jQuery:

 * Selectors
 * Events
 * Functions

## Selectors
#### inView
Retrive elements that are viisble in full or in part inside the viewport.
```
jQuery(".image:inView").css("border-width", "20px");
```

#### inViewFull
Retrive elements that are fully visible inside the viewport.
```
jQuery(".image:inViewFull").css("border-width", "20px");
```

#### external
Retrive all links that link to external websites. 

```
jQuery('a:external').css("color", "green");
```

#### containsi
Same as "jQuery :contains" but case insenstive.

Demo: https://jsfiddle.net/kalimahapps/39a88mcd/1/

## Events
#### inView
Same as inView selector with the addition that the event is triggered on each scroll.


#### inViewFull
Same as inViewFull selector with the addition that the event is triggered on each scroll.

#### clickOutside Event
This event will handle clicks outside selected element.

#### resizeOnce Event
Fire resize event once only (every 100ms).

#### Keys events
Handle various key events. Events include:

```
enterKey
spaceKey
tabKey
altKey
ctrlKey
shiftKey
escKey
numKey
insertKey
pgDownKey
scrolLock
homeKey
pgUpKey
delKey
endKey
backspaceKey
```
Each events coorspondes to the relevant key (as spcified in the key name).

```
jQuery(".textInput").on("enterKey altKey shiftKey insertKey pgDownKey", function(e) {
  alert(e.type);
  return false;
});
```

#### Scroll Events
There are four scroll events that could be utilized using Kalimah Query.

```
scrollUp
scrollDown
scrollLeft
scrollRight
```

```
jQuery(window).on("scrollRight scrollDown scrollLeft scrollUp", function(e) {
  console.log(e.type);
});
```

#### Swipe Events
There are four swipe events that could be utilized using Kalimah Query.
```
swipeUp
swipeDown
swipeLeft
swipeRight
```

```
jQuery("list li").on("swipeRight", function(e) {
  console.log("Item swiped");
});
```

#### Drag Event
Handles item drage. The function returned (as shown below) returns an extra paramters (obj) which includes the state of the element (dragStart, dragging, dragEnd) and the x,y position relative to viewport.
```
jQuery("div").on("drag", function(e, obj) {
  jQuery(this).css({
    'position': 'fixed',
    'top': obj.y,
    'left': obj.x,
    'transform': 'translate(-50%, -50%)'
  });
});
```

## Functions
#### firstWord()
Retrive first word in a paragraph.
```
jQuery("p").firstWord().css("background-color", "red");
```

### Credit:

* https://j11y.io/javascript/extending-jquerys-selector-capabilities/
* http://benalman.com/news/2010/03/jquery-special-events/
* http://stackoverflow.com/a/5490021/529024
* http://www.jameswiseman.com/blog/2010/04/19/creating-a-jquery-custom-selector/
