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

  if('content' in templateElement) {
    elementToClone = templateElement.content.querySelector('.review');
  } else {
    elementToClone = templateElement.querySelector('.review');
  }

  /**
   * Прячем список фильтров перед отрисовкой отзывов
   */
  reviewsFilterBlock.classList.add('invisible');

  /**
   * Загружаем картинку, отрабатываем состояние загрузки, ошибки, таймаута
   * @param  {Object} data
   * @param  {HTMLElement} clonedElement
   * @return {HTMLElement} clonedElement
   */
  var getReviewImg = function(data, clonedElement) {
    var elementImg = clonedElement.querySelector('.review-author');
    var userAvatarImage = new Image();
    var imageLoadTimeout;
    var IMAGE_TIMEOUT = 10000;
    var IMAGE_SIZE = 124;

    elementImg.width = IMAGE_SIZE;
    elementImg.height = IMAGE_SIZE;

    elementImg.alt = data.author.name;

    /**
     * Помещаем картинку в наш склонированный img если она загрузилась
     * Убираем таймаут
     */
    userAvatarImage.addEventListener('load', function() {
      clearTimeout(imageLoadTimeout);
      elementImg.src = userAvatarImage.src;
    });

    /**
     * Ставим класс review-load-failure на склонированный элемент, если она НЕ загрузилась
     */
    userAvatarImage.addEventListener('error', function() {
      clonedElement.classList.add('.review-load-failure');
    });

    /**
     * Грузим картинку
     */
    userAvatarImage.src = data.author.picture;

    /**
     * Устанавливаем таймаут, кладем в переменную imageLoadTimeout его id
     * @type {number}
     */
    imageLoadTimeout = setTimeout(function() {
      elementImg.src = '';
      clonedElement.classList.add('.review-load-failure');
    }, IMAGE_TIMEOUT);

    return clonedElement;
  };

  /**
   * Генерируем новый DOM-элемент
   * @param  {Object} data
   * @param  {HTMLElement} container - контейнер, внутри которого рисуем DOM-элемент
   * @return {HTMLElement} новый отрисованный DOM-элемент
   */
  var getReviewElement = function(data, container) {
    var element = elementToClone.cloneNode(true);
    var elementRating = element.querySelector('.review-rating');
    var RATING_WIDTH = 30;

    elementRating.style.width = data.rating * RATING_WIDTH + 'px';
    element.querySelector('.review-text').textContent = data.description;

    getReviewImg(data, element);

    container.appendChild(element);

    return element;
  };


  /**
   * Проходимся по всему массиву и для каждого объекта генерируем новый DOM-элемент
   * см. getReviewElement
   */
  window.reviews.forEach(function(review) {
    getReviewElement(review, reviewsContainer);
    console.log(review);
  });

  /**
   * Возвращаем фильтры
   */
  reviewsFilterBlock.classList.remove('invisible');
})();

