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

    this.URL_MATCHER = /#photo\/(\S+)/;

    /**
     * Принимает список Нод и сохраняет их параметры в массив
     */
    this.collectPictures = function() {
      var i;

      for (i = 0; i < imgList.length; i++) {
        self.pictures.push(imgList[i].getAttribute('src'));

        imgList[i].dataset.gallery = true;
      }
    };

    this.collectPictures();

    /**
     * Добавляем хэш в адресную строку
     * @param  [string] photoUrl часть нашего хэша
     */
    this.changeUrl = function(photoUrl) {
      if (photoUrl) {
        window.location.hash = 'photo/' + photoUrl;
      } else {
        window.location.hash = '';
      }
    };

    this.onClose = function() {
      self.changeUrl();
    };

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

      self.closeButton.addEventListener('click', self.onClose); //клик на крестик

      self.showPicture(pictureNumber);
      utils.setBlockHidden(self.overlay, false);
    };

    /**
     * Показываем саму картинку
     * @param  {number} pictureNumber номер картинки в масиве, которую показываем
     */
    this.showPicture = function(pictureNumber) {
      self.currentNumber = pictureNumber;

      self.img.setAttribute('src', self.pictures[self.currentNumber]);

      self.pictureNumberElement.textContent = self.currentNumber + 1;
    };

    /**
     * Показываем следующую картинку
     */
    this.next = function() {
      var nextSrc = self.pictures[self.currentNumber + 1] || self.pictures[0];
      self.changeUrl(nextSrc);
    };

    /**
     * Проверяем нажатие стрелочки вправо
     * @type {Function}
     */
    this.keyRightCheck = utils.listenKey(39, this.next);

    /**
     * Показываем предыдущую картинку
     */
    this.prev = function() {
      var prevSrc = self.pictures[self.currentNumber - 1] || self.pictures[self.pictures.length - 1];
      self.changeUrl(prevSrc);
    };

    /**
     * Проверяем нажатие стрелочки влево
     * @type {Function}
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
    this.keyEscCheck = utils.listenKey(27, self.changeUrl); //нажимаем на esc, чистим хэш

    /**
     * Берем из массива сорцев нужную строку и пихаем ее в changeUrl
     * @param  {MouseEvent} evt объект, описывающий наше событие
     */
    this.onContainerClick = function(evt) {
      if (evt.target.dataset.gallery) {
        evt.preventDefault();
        self.changeUrl(evt.target.getAttribute('src'));
      }
    };

    /**
     * [onHashChange description]
     */
    this.onHashChange = function() {
      var hash = window.location.hash;
      var photoUrl;
      var urlMatchHash = self.URL_MATCHER.exec(hash);
      var pictureIndex;

      if (urlMatchHash) {
        photoUrl = urlMatchHash[1];
        pictureIndex = self.pictures.indexOf(photoUrl);

        if (pictureIndex !== -1) {
          self.show(pictureIndex);
        }
      } else {
        self.hide();
      }
    };

    this.pictureNumberElement.innerHTML = '';

    this.onHashChange();

    window.addEventListener('hashchange', self.onHashChange);

    this.container.addEventListener('click', this.onContainerClick);

    this.preview.appendChild(this.img);
  }

  return Gallery;
});
