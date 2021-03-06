// Generated by CoffeeScript 1.6.2
(function() {
  var debugPane, gesturePane, pauseAnimations, quickScroll, scrollToTop, _animationsPaused, _debug, _defaultAnimationPauseMs, _sentMessage, _smoothingFactor, _translationFactor;

  _translationFactor = 20;

  _smoothingFactor = 4;

  _debug = false;

  _animationsPaused = false;

  _defaultAnimationPauseMs = 200;

  _sentMessage = false;

  if (_debug) {
    debugPane = document.createElement('div');
    debugPane.style.backgroundColor = 'rgba(255,255,255,0.7)';
    debugPane.style.bottom = '10px';
    debugPane.style.left = '10px';
    debugPane.style.position = 'fixed';
    document.body.appendChild(debugPane);
    gesturePane = document.createElement('div');
    gesturePane.style.backgroundColor = 'rgba(255,255,255,0.7)';
    gesturePane.style.top = '10px';
    gesturePane.style.left = '10px';
    gesturePane.style.position = 'fixed';
    document.body.appendChild(gesturePane);
  }

  chrome.runtime.sendMessage({
    init_script: true
  });

  Leap.loop({
    enableGestures: true
  }, function(frame) {
    var direction, duration, fingers, firstGesture, hands, speed, state, type, verticalDistance;

    if (!_sentMessage) {
      chrome.runtime.sendMessage({
        has_leap: true
      });
      _sentMessage = true;
    }
    if (_debug) {
      debugPane.innerHTML = frame.dump();
    }
    fingers = frame.fingers;
    hands = frame.hands;
    if (fingers.length === 0) {
      return;
    }
    if (frame.gestures.length > 0) {
      firstGesture = frame.gestures[0];
      if (_debug) {
        gesturePane.innerHTML = '<div>' + _animationsPaused + JSON.stringify(firstGesture) + '</div>' + gesturePane.innerHTML;
      }
      if (_animationsPaused) {
        return;
      }
      speed = firstGesture.speed || 0;
      if (firstGesture.direction) {
        direction = {
          x: firstGesture.direction[0],
          z: firstGesture.direction[1],
          y: firstGesture.direction[2]
        };
      }
      state = firstGesture.state || '';
      type = firstGesture.type;
      duration = (firstGesture.duration || 0) / 60000;
      if (type === 'keyTap' && fingers.length < 3) {
        return quickScroll('down');
      } else if (type === 'swipe' && state === 'stop') {
        verticalDistance = firstGesture.position[1] - firstGesture.startPosition[1];
        if (verticalDistance > 100 && speed > 100 && fingers.length > 2) {
          if (hands.length === 2) {
            return scrollToTop();
          } else {
            return quickScroll('up');
          }
        }
      }
    }
  });

  scrollToTop = function() {
    window.scrollBy(-document.height);
    return pauseAnimations();
  };

  quickScroll = function(dir, pause) {
    var factor;

    if (pause == null) {
      pause = _defaultAnimationPauseMs;
    }
    factor = dir === 'up' ? -1 : 1;
    window.scrollBy(0, (window.innerHeight - 120) * factor);
    return pauseAnimations(pause);
  };

  pauseAnimations = function(pause) {
    var _this = this;

    if (pause == null) {
      pause = _defaultAnimationPauseMs;
    }
    _animationsPaused = true;
    return setTimeout((function() {
      return _animationsPaused = false;
    }), pause);
  };

}).call(this);
