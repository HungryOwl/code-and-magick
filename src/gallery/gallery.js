'use strict';

define('gallery', ['./constructor'], function(Gallery) {
  /**
   * Внешняя галерея со скриншотами игры
   * @type {HTMLElement}
   */
  var photoGallery = document.querySelector('.photogallery');

  /**
   * Внутренняя галерея, в которой показывается по одному скриншоту
   * @type {HTMLElement}
   */
  var galleryContainer = document.querySelector('.overlay-gallery');

  var imgNodeList = photoGallery.querySelectorAll('img');

  new Gallery(photoGallery, galleryContainer, imgNodeList); // eslint-disable-line no-new
});
