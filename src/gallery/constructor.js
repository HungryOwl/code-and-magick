'use strict';

define('galleryConstructor', ['../utils'], function(utils) {

  function Gallery(container, overlay, imgList) {
    /**
     * Наш секшн со скринами на главной
     * @type {HTMLElement}
     */
    this.container = container; //внешняя галерея - контейнер photoGallery

    /**
     * Галерея со скриншотами игры
     * @type {HTMLElement}
     */
    this.overlay = overlay; // внутренняя галерея - контейнер galleryContainer

    this
      .collectElements()
      .initImage()
      .collectPictures(imgList)
      .bindListeners()
      .onHashChange();

    window.addEventListener('hashchange', this.onHashChange);

    this.container.addEventListener('click', this.onContainerClick);
  }

  Gallery.prototype.initImage = function() {
    /**
     * Номер картинки, по которой кликнули
     */
    this.currentNumber = 0; //тут была наша пустая srcNumber

    /**
     * Создаем новый тег img в разметке галереи
     * @type {Image}
     */
    this.img = new Image();

    this.preview.appendChild(this.img);

    return this;
  };

  Gallery.prototype.bindListeners = function() {
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);

    this.changeUrl = this.changeUrl.bind(this);
    this.onClose = this.onClose.bind(this);

    this.keyRightCheck = this.keyRightCheck.bind(this);
    this.keyLeftCheck = this.keyLeftCheck.bind(this);
    this.keyEscCheck = this.keyEscCheck.bind(this);

    this.onContainerClick = this.onContainerClick.bind(this);
    this.onHashChange = this.onHashChange.bind(this);

    return this;
  };

  Gallery.prototype.collectElements = function() {
    /**
     * Крестик, по которому закрывается галерея
     * @type {HTMLElement}
     */
    this.closeButton = this.overlay.querySelector('.overlay-gallery-close');

    /**
     * Следующий скриншот (стрелочка)
     * @type {HTMLElement}
     */
    this.nextButton = this.overlay.querySelector('.overlay-gallery-control-right');

    /**
     * Предыдущий скриншот (стрелочка)
     * @type {HTMLElemen}
     */
    this.prevButton = this.overlay.querySelector('.overlay-gallery-control-left');

    /**
     * Блок с основной картинкой в галерее
     * @type {HTMLElement}
     */
    this.preview = this.overlay.querySelector('.overlay-gallery-preview');

    /**
     * Спанчик с номером скриншотика
     * @type {HTMLSpanElement}
     */
    this.pictureNumberElement = this.overlay.querySelector('.preview-number-current');
    this.pictureNumberElement.innerHTML = '';

    return this;
  };

  Gallery.prototype.URL_MATCHER = /#photo\/(\S+)/;

  /**
   * Принимает список Нод и сохраняет их параметры в массив
   */
  Gallery.prototype.collectPictures = function(imgList) {
    this.pictures = Array.prototype.map.call(imgList, function(imgItem) {
      imgItem.dataset.gallery = true;

      return imgItem.getAttribute('src');
    });

    return this;
  };

  /**
   * Добавляем хэш в адресную строку
   * @param  [string] photoUrl часть нашего хэша
   */
  Gallery.prototype.changeUrl = function(photoUrl) {
    if (photoUrl) {
      window.location.hash = 'photo/' + photoUrl;
    } else {
      window.location.hash = '';
    }
  };

  Gallery.prototype.onClose = function() {
    this.changeUrl();
  };

  /**
   * Показываем следующую картинку
   */
  Gallery.prototype.next = function() {
    var nextSrc = this.pictures[this.currentNumber + 1] || this.pictures[0];
    this.changeUrl(nextSrc);
  };

  /**
   * Проверяем нажатие стрелочки вправо
   */
  Gallery.prototype.keyRightCheck = utils.listenKey(39, Gallery.prototype.next);

  /**
   * Показываем предыдущую картинку
   */
  Gallery.prototype.prev = function() {
    var prevSrc = this.pictures[this.currentNumber - 1] || this.pictures[this.pictures.length - 1];
    this.changeUrl(prevSrc);
  };

  /**
   * Проверяем нажатие стрелочки влево
   */
  Gallery.prototype.keyLeftCheck = utils.listenKey(37, Gallery.prototype.prev);

  /**
   * Проверяем нажатие ESC
   */
  Gallery.prototype.keyEscCheck = utils.listenKey(27, Gallery.prototype.changeUrl); //нажимаем на esc, чистим хэш

  /**
   * Показываем галерею
   * @param  {number} pictureNumber номер переданной картинки
   */
  Gallery.prototype.show = function(pictureNumber) {
    /**
     * Next
     */
    window.addEventListener('keydown', utils.listenKey(39, this.next));
    this.nextButton.addEventListener('click', this.next);

    /**
     * Prev
     */
    window.addEventListener('keydown', this.keyLeftCheck);
    this.prevButton.addEventListener('click', this.prev);

    window.addEventListener('keydown', this.keyEscCheck);

    this.closeButton.addEventListener('click', this.onClose); //клик на крестик

    this.showPicture(pictureNumber);
    utils.setBlockHidden(this.overlay, false);
  };

  Gallery.prototype.hide = function() {
    utils.setBlockHidden(this.overlay, true);

    window.removeEventListener('keydown', utils.listenKey(39, this.next));
    this.nextButton.removeEventListener('click', this.next);

    window.removeEventListener('keydown', this.keyLeftCheck);
    this.prevButton.removeEventListener('click', this.prev);

    window.removeEventListener('keydown', this.keyEscCheck);

    this.closeButton.removeEventListener('click', this.hide);
  };

  /**
   * Показываем саму картинку
   * @param  {number} pictureNumber номер картинки в масиве, которую показываем
   */
  Gallery.prototype.showPicture = function(pictureNumber) {
    this.currentNumber = pictureNumber;

    this.img.setAttribute('src', this.pictures[this.currentNumber]);

    this.pictureNumberElement.textContent = this.currentNumber + 1;
  };

  /**
   * Берем из массива сорцев нужную строку и пихаем ее в changeUrl
   * @param  {MouseEvent} evt объект, описывающий наше событие
   */
  Gallery.prototype.onContainerClick = function(evt) {
    if (evt.target.dataset.gallery) {
      evt.preventDefault();
      this.changeUrl(evt.target.getAttribute('src'));
    }
  };

  /**
   * Вскрываем нашу галерею по изменению хэша
   */
  Gallery.prototype.onHashChange = function() {
    var hash = window.location.hash;
    var photoUrl;
    var urlMatchHash = this.URL_MATCHER.exec(hash);
    var pictureIndex;

    if (urlMatchHash) {
      photoUrl = urlMatchHash[1];
      pictureIndex = this.pictures.indexOf(photoUrl);

      if (pictureIndex !== -1) {
        this.show(pictureIndex);
      }
    } else {
      this.hide();
    }

    return this;
  };

  return Gallery;
});

