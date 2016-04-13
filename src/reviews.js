'use strict';

(function() {
/**
 * Список фильтров
 * @type {HTMLElement}
 */
  var reviewsFilterBlock = document.querySelector('.reviews-filter');

  /**
   * Блок, в который помещаются отзывы
   * @type {HTMLElement}
   */
  var reviewsContainer = document.querySelector('.reviews-list');

  /**
   * Наш шаблончик с разметкой
   * @type {HTMLElement}
   */
  var templateElement = document.querySelector('#review-template');

  /**
   * Клонируемое содержимое из template
   */
  var elementToClone;

  /**
   * Клонируем или с content или сам  template
   */
  if('content' in templateElement) {
    elementToClone = templateElement.content.querySelector('.review');
  } else {
    elementToClone = templateElement.querySelector('.review');
  }

  /**
   * Загружаем картинку и отрабатываем все состяния с помощью коллбэка
   * @param  {string}   url
   * @param  {LoadImageCallback} callback
   */
  function loadImg(url, callback) {
    var img = new Image();
    var imgTimeout;
    var IMAGE_TIMEOUT = 10000;

    img.addEventListener('load', function() {
      clearTimeout(imgTimeout);
      callback(false);
    });

    img.addEventListener('error', function() {
      clearTimeout(imgTimeout);
      callback(true);
    });

    imgTimeout = setTimeout(function() {
      callback(true);
    }, IMAGE_TIMEOUT);

    img.src = url;
  }

  /**
   * Загружаем картинку, отрабатываем состояние загрузки, ошибки, таймаута
   * @param  {Object} data
   * @param  {HTMLElement} review
   * @return {HTMLElement} review
   */
  function getReviewImg(data, review) {
    var elementImg = review.querySelector('.review-author');
    var IMAGE_SIZE = 124;

    elementImg.alt = data.author.name;

    /**
     * Добавляем класс, если картинка не загрузилась
     * Передаем URL и задаем размеры в случае ее загрузки
     * @param {boolean}
     */
    function onImageLoad(error) {
      if (error) {
        review.classList.add('review-load-failure');
      } else {
        elementImg.src = data.author.picture;
        elementImg.width = IMAGE_SIZE;
        elementImg.height = IMAGE_SIZE;
      }
    }

    loadImg(data.author.picture, onImageLoad);

    return review;
  }

  /**
   * Генерируем новый DOM-элемент
   * @param  {Object} data
   * @param  {HTMLElement} container - контейнер, внутри которого рисуем DOM-элемент
   * @return {HTMLElement} новый отрисованный DOM-элемент
   */
  function getReviewElement(data, container) {
    var element = elementToClone.cloneNode(true);
    var elementRating = element.querySelector('.review-rating');
    var rating;

    rating = {
      2: 'two',
      3: 'three',
      4: 'four',
      5: 'five'
    };

    if (data.rating !== 1) {
      elementRating.classList.add('review-rating-' + rating[data.rating]);
    }

    element.querySelector('.review-text').textContent = data.description;
    getReviewImg(data, element);

    container.appendChild(element);

    return element;
  }

  /**
   * Прячем список фильтров перед отрисовкой отзывов
   */
  reviewsFilterBlock.classList.add('invisible');

  /**
   * Проходимся по всему массиву и для каждого объекта генерируем новый DOM-элемент
   * см. getReviewElement
   */
  window.reviews.forEach(function(review) {
    getReviewElement(review, reviewsContainer);
  });

  /**
   * Возвращаем фильтры
   */
  reviewsFilterBlock.classList.remove('invisible');
})();

