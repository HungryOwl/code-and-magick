'use strict';

/**
 * Параллакс для облаков
 */
define('parallaxClouds', function() {
  var clouds = document.querySelector('.header-clouds');
  var cloudsComputedStyle = getComputedStyle(clouds);
  var CurrentXcoordinate = parseInt(cloudsComputedStyle.backgroundPositionX, 10);

  /**
   * Двигаем облака
   */
  function moveClouds() {
    var cloudsCurrentPosition = clouds.getBoundingClientRect();
    var step = cloudsCurrentPosition.top / 10;
    clouds.style.backgroundPositionX = CurrentXcoordinate + step + '%';
  }

  window.addEventListener('scroll', moveClouds);

  /**
   * Прекращаем движение облаков
   */
  function stopMoving() {
    var cloudsCurrentPosition = clouds.getBoundingClientRect();
    if (cloudsCurrentPosition.bottom < 0) {
      window.removeEventListener('scroll', moveClouds);
    } else {
      window.addEventListener('scroll', moveClouds);
    }
  }

  return {
    stopMoving: stopMoving
  };
});
