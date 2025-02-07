'use strict';
var demo = (function (window, undefined) {
  var loader = document.getElementById("loader");
  TweenMax.to(loader, 0.5, {
    opacity: 1,
    onComplete: function () {
      loader.style.pointerEvents = "none";
      clearTimeout(loadTime);
      loader.remove();
      document.body.classList.add("loaded");
      //console.clear();
    }
  });

  var SELECTORS = {
    pattern: '.pattern',
    card: '.card',
    cardImage: '.card_image',
    cardClose: '.card_btn-close',
  };
  var CLASSES = {
    patternHidden: 'pattern-hidden',
    polygon: 'polygon',
    polygonHidden: 'polygon-hidden'
  };

  var polygonMap = {
    paths: null,
    points: null
  };

  var layout = {};

  /*-- Initialise demo--*/
  function init() {
    // For options see: https://github.com/qrohlf/Trianglify
    var pattern = Trianglify({
      width: window.innerWidth,
      height: window.innerHeight,
      cell_size: 50,
      variance: 1,
      stroke_width: 0.5,
      color_function: function (x, y) {
        return '#163558';
      }
    }).svg(); // Render as SVG.

    _mapPolygons(pattern);

    _bindCards();
  };

  function _mapPolygons(pattern) {
    $(SELECTORS.pattern).append(pattern);
    polygonMap.paths = [].slice.call(pattern.childNodes);

    polygonMap.points = [];

    polygonMap.paths.forEach(function (polygon) {

      // Hide polygons by adding CSS classes to each svg path (used attrs because of IE).
      $(polygon).attr('class', CLASSES.polygon);

      var rect = polygon.getBoundingClientRect();

      var point = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };

      polygonMap.points.push(point);
    });

    // All polygons are hidden now, display the pattern container.
    $(SELECTORS.pattern).removeClass(CLASSES.patternHidden);
  };

  /*-- Bind Card elements--*/
  function _bindCards() {

    var elements = $(SELECTORS.card);

    $.each(elements, function (card, i) {

      var instance = new Card(i, card);

      layout[i] = {
        card: instance
      };

      var cardImage = $(card).find(SELECTORS.cardImage);
      var cardClose = $(card).find(SELECTORS.cardClose);

      $(cardImage).on('click', _playSequence.bind(this, true, i));
      $(cardClose).on('click', _playSequence.bind(this, false, i));
    });
  };

  /*-- Create a sequence for the open or close animation and play.--*/
  function _playSequence(isOpenClick, id, e) {

    var card = layout[id].card;

    // Prevent when card already open and user click on image.
    if (card.isOpen && isOpenClick) return;

    // Create timeline for the whole sequence.
    var sequence = new TimelineLite({ paused: true });

    var tweenOtherCards = _showHideOtherCards(id);

    if (!card.isOpen) {
      sequence.add(tweenOtherCards);
      sequence.add(card.openCard(_onCardMove), 0);

    } else {
      // Close sequence.
      var closeCard = card.closeCard();
      var position = closeCard.duration() * 0.8; // 80% of close card tween.

      sequence.add(closeCard);
      sequence.add(tweenOtherCards, position);
    }

    sequence.play();
  };

  /*-- Show/Hide all other cards--*/
  function _showHideOtherCards(id) {

    var TL = new TimelineLite;

    var selectedCard = layout[id].card;

    for (var i in layout) {

      var card = layout[i].card;

      // When called with `openCard`.
      if (card.id !== id && !selectedCard.isOpen) {
        TL.add(card.hideCard(), 0);
      }

      // When called with `closeCard`.
      if (card.id !== id && selectedCard.isOpen) {
        TL.add(card.showCard(), 0);
      }
    }

    return TL;
  };

  /*-- Callback to be executed on Tween update, whatever a polygon--*/
  function _onCardMove(track) {

    var radius = track.width / 2;

    var center = {
      x: track.x,
      y: track.y
    };

    polygonMap.points.forEach(function (point, i) {

      if (_detectPointInCircle(point, radius, center)) {
        $(polygonMap.paths[i]).attr('class', CLASSES.polygon + ' ' + CLASSES.polygonHidden);
      } else {
        $(polygonMap.paths[i]).attr('class', CLASSES.polygon);
      }
    });
  }

  /*-- Detect if a point is inside a circle area.--*/
  function _detectPointInCircle(point, radius, center) {

    var xp = point.x;
    var yp = point.y;

    var xc = center.x;
    var yc = center.y;

    var d = radius * radius;

    var isInside = Math.pow(xp - xc, 2) + Math.pow(yp - yc, 2) <= d;

    return isInside;
  };

  // Expose methods.
  return {
    init: init
  };

})(window);

window.onload = demo.init;

