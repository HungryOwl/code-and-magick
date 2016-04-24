'use strict';

define('gallery', ['./utils'], function(utils) {
  var photoGallery = document.querySelector('.photogallery');

  /**
   * Галерея со скриншотами игры
   * @type {HTMLElement}
   */
  var galleryContainer = document.querySelector('.overlay-gallery');

  /**
   * Крестик, по которому закрывается галерея
   * @type {HTMLElement}
   */
  var closeGallery = galleryContainer.querySelector('.overlay-gallery-close');

  /**
   * Следующий скриншот (стрелочка)
   * @type {HTMLElement}
   */
  var nextPicture = galleryContainer.querySelector('.overlay-gallery-control-right');

  /**
   * Предыдущий скриншот (стрелочка)
   * @type {HTMLElemen}
   */
  var prevPicture = galleryContainer.querySelector('.overlay-gallery-control-left');

  /**
   * Массив строк - ссылок на наши фотографии
   * @type {String[]}
   */
  var galleryPictures = [];

  /**
   * Блок с основной картинкой
   * @type {HTMLElement}
   */
  var pictureContainer = galleryContainer.querySelector('.overlay-gallery-preview');

  /**
   * Номер картинки, по которой кликнули
   */
  var srcNumber;

  /**
   * Создаем новый тег img в разметке
   * @type {Image}
   */
  var img = new Image();

  /**
   * Проверяем нажатие стрелочки вправо
   * @type {function}
   */
  var keyRightCheck = utils.listenKey(39, switchNextPicture);

  /**
   * Проверяем нажатие стрелочки влево
   * @type {function}
   */
  var keyLeftCheck = utils.listenKey(37, switchPrevPicture);

  /**
   * Проверяем нажатие ESC
   * @type {function}
   */
  var keyEscCheck = utils.listenKey(27, hideGallery);

  /**
   * Спанчик с номером скриншотика
   * @type {HTMLSpanElement}
   */
  var pictureNumberElement = galleryContainer.querySelector('.preview-number-current');

  /**
   * Все теги img
   * @type {HTMLCollection}
   */
  var imgContainers = photoGallery.querySelectorAll('img');

  /**
   * Принимает список Нод и сохраняет их параметры в массив
   * @param  {HTMLCollection} nodeList Список <img>-ов со ссылками
   */
  function collectPictures(nodeList) {
    var i;

    for (i = 0; i < nodeList.length; i++) {
      galleryPictures.push(nodeList[i].getAttribute('src'));

      nodeList[i].dataset.order = i;
    }
  }

  /**
   * Показываем галерею
   * @type {number}
   */
  function showGallery(pictureNumber) {
    /**
     * Next
     */
    window.addEventListener('keydown', keyRightCheck);
    nextPicture.addEventListener('click', switchNextPicture);

    /**
     * Prev
     */
    window.addEventListener('keydown', keyLeftCheck);
    prevPicture.addEventListener('click', switchPrevPicture);

    window.addEventListener('keydown', keyEscCheck);

    closeGallery.addEventListener('click', hideGallery);

    showPicture(pictureNumber);
    utils.setBlockHidden(galleryContainer, false);
  }

  function hideGallery() {
    utils.setBlockHidden(galleryContainer, true);

    window.removeEventListener('keydown', keyRightCheck);
    nextPicture.removeEventListener('click', switchNextPicture);

    window.removeEventListener('keydown', keyLeftCheck);
    prevPicture.removeEventListener('click', switchPrevPicture);

    window.removeEventListener('keydown', keyEscCheck);

    closeGallery.removeEventListener('click', hideGallery);
  }

  /**
   * Показываем саму картинку
   * @param  {number} pictureNumber номер картинки в масиве, которую показываем
   */
  function showPicture(pictureNumber) {
    srcNumber = pictureNumber;

    if (srcNumber > galleryPictures.length - 1) {
      srcNumber = 0;
    }

    if (srcNumber < 0) {
      srcNumber = galleryPictures.length - 1;
    }

    img.setAttribute('src', galleryPictures[srcNumber]);

    pictureNumberElement.textContent = srcNumber + 1;
  }

  /**
   * Показываем следующую картинку
   */
  function switchNextPicture() {
    showPicture(srcNumber + 1);
  }

  /**
   * Показываем предыдущую картинку
   */
  function switchPrevPicture() {
    showPicture(srcNumber - 1);
  }

  function onContainerClick(evt) {
    if (evt.target.dataset.order !== void 0) {
      showGallery(Number(evt.target.dataset.order));
    }
  }

  photoGallery.addEventListener('click', onContainerClick);

  pictureContainer.appendChild(img);
  pictureNumberElement.innerHTML = '';

  collectPictures(imgContainers);
});
