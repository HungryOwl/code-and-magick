'use strict';

define( 'getReviewElement', ['../utils'], function(utils) {
  /**
   * Ищем img в слконированном элементе, отрабатываем для него состояние загрузки, ошибки, таймаута
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
     * @param {boolean} error
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

    utils.loadImg(data.author.picture, onImageLoad);

    return review;
  }

  /**
   * Генерируем новый DOM-элемент
   * @param  {Object} data
   * @param  {HTMLElement} container - контейнер, внутри которого рисуем DOM-элемент
   * @return {HTMLElement} новый отрисованный DOM-элемент
   */
  function getReviewElement(data) {
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

    return element;
  }

  /**
   * Клонируемое содержимое из template
   */
  var elementToClone = utils.getTemplateClone('#review-template', '.review');

  return getReviewElement;
});
