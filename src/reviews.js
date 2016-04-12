'use strict';
/**
 * Список фильтров
 * @type {[type]}
 */
var reviewsFilterBlock = document.querySelector('.reviews-filter');

/**
 * Блок, в который помещаются отзывы
 * @type {?__?}
 */
var reviewsContainer = document.querySelector('.reviews-list');

/**
 * Наш шаблончик с разметкой
 * @type {?__?}
 */
var templateElement = document.querySelector('#review-template');
console.log(templateElement);

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
 * Генерируем новый DOM-элемент
 * @param  {Object} data
 * @param  {HTMLElement} container
 * @return {HTMLElement} новый отрисованный DOM-элемент
 */
var getReviewElement = function(data, container) {
  var element = elementToClone.cloneNode(true);
  var elementImg = element.querySelector('.review-author');
  var elementRating = element.querySelector('.review-rating');
  var userAvatarImage = new Image();
  var imageLoadTimeout;
  var IMAGE_SIZE = 124;
  var RATING_WIDTH = 30;
  var IMAGE_TIMEOUT = 10000;

  elementImg.width = IMAGE_SIZE;
  elementImg.height = IMAGE_SIZE;

  container.appendChild(element);
  elementRating.style.width = data.rating * RATING_WIDTH + 'px';

  element.querySelector('.review-text').textContent = data.description;

  /**
   * Пихаем картинку в наш склонированный img если она загрузилась
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
    element.classList.add('.review-load-failure');
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
    element.classList.add('.review-load-failure');
  }, IMAGE_TIMEOUT);

  return element;
};

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


