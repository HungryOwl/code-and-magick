'use strict';

define('galleryConstructor', ['../utils'], function(utils) {

  function Gallery(container, overlay, imgList) {
    var self = this;

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
     * Номер картинки, по которой кликнули
     */
    this.currentNumber = 0; //тут была наша пустая srcNumber

    /**
     * Создаем новый тег img в разметке галереи
     * @type {Image}
     */
    this.img = new Image();

    /**
     * Спанчик с номером скриншотика
     * @type {HTMLSpanElement}
     */
    this.pictureNumberElement = this.overlay.querySelector('.preview-number-current');

    /**
     * Массив строк - ссылок на наши фотографии (срц у имг)
     * @type {String[]}
     */
    this.pictures = [];

    /**
     * Принимает список Нод и сохраняет их параметры в массив
     */
    this.collectPictures = function() {
      var i;

      for (i = 0; i < imgList.length; i++) {
        self.pictures.push(imgList[i].getAttribute('src'));

        imgList[i].dataset.order = i;
      }
    };

    this.collectPictures();

    this.show = function(pictureNumber) {
      /**
       * Next
       */
      window.addEventListener('keydown', self.keyRightCheck);
      self.nextButton.addEventListener('click', self.next);

      /**
       * Prev
       */
      window.addEventListener('keydown', self.keyLeftCheck);
      self.prevButton.addEventListener('click', self.prev);

      window.addEventListener('keydown', self.keyEscCheck);

      self.closeButton.addEventListener('click', self.hide);

      self.showPicture(pictureNumber);
      utils.setBlockHidden(self.overlay, false);
    };

    /**
     * Показываем саму картинку
     * @param  {number} pictureNumber номер картинки в масиве, которую показываем
     */
    this.showPicture = function(pictureNumber) {
      self.currentNumber = pictureNumber;

      if (self.currentNumber > self.pictures.length - 1) {
        self.currentNumber = 0;
      }

      if (self.currentNumber < 0) {
        self.currentNumber = self.pictures.length - 1;
      }

      self.img.setAttribute('src', self.pictures[self.currentNumber]);

      self.pictureNumberElement.textContent = self.currentNumber + 1;
    };

    /**
     * Показываем следующую картинку
     */
    this.next = function() {
      self.showPicture(self.currentNumber + 1);
    };

    /**
     * Проверяем нажатие стрелочки вправо
     * @type {function}
     */
    this.keyRightCheck = utils.listenKey(39, this.next);

    /*ПОЧЕМУ ОНО РАБОТАЕТ ТОЛЬКО В ТАКОМ ПОРЯДКЕ, ТЕПЕРЬ ПОНИМАЮ =\\\ */

    /**
     * Показываем предыдущую картинку
     */
    this.prev = function() {
      self.showPicture(self.currentNumber - 1);
    };

    /**
     * Проверяем нажатие стрелочки влево
     * @type {function}
     */
    this.keyLeftCheck = utils.listenKey(37, this.prev);

    this.hide = function() {
      utils.setBlockHidden(self.overlay, true);

      window.removeEventListener('keydown', self.keyRightCheck);
      self.nextButton.removeEventListener('click', self.next);

      window.removeEventListener('keydown', self.keyLeftCheck);
      self.prevButton.removeEventListener('click', self.prev);

      window.removeEventListener('keydown', self.keyEscCheck);

      self.closeButton.removeEventListener('click', this.hide);
    };

    /**
     * Проверяем нажатие ESC
     * @type {function}
     */
    this.keyEscCheck = utils.listenKey(27, this.hide);

    this.onContainerClick = function(evt) {
      if (evt.target.dataset.order !== void 0) {
        self.show(Number(evt.target.dataset.order));
      }
    };

    this.container.addEventListener('click', this.onContainerClick);

    this.preview.appendChild(this.img);

    this.pictureNumberElement.innerHTML = '';
  }

  return Gallery;
});
