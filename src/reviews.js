'use strict';

(function() {
/**
 * Список фильтров
 * @type {HTMLElement}
 */
  var reviewsFilterBlock = document.querySelector('.reviews-filter');

  /**
   * Блок, в который помещаются отзывы и выступающий в роли прелоадера
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
   * Грузим отсюда список отелей по XMLHttpRequest
   * @type {String}
   */
  var REVIEWS_LOAD_URL = '//o0.github.io/assets/json/reviews.json';

  /**
   * Переменная, в которую кладем наш массив, полученный по xhr
   * @type {Array.<Object>}
   */
  var reviews = [];

  /**
   * Список for у меток, по которым фильтруем
   * @type {Object}
   */
  var Filter = {
    'All': 'reviews-all',
    'DATA': 'reviews-recent',
    'RATING_GOOD': 'reviews-good',
    'RATING_BAD': 'reviews-bad',
    'POPULAR': 'reviews-popular'
  };

  /**
   * Дефолтный фильтр
   * @type {String}
   */
  var DEFAULT_FILTER = Filter.ALL;

  /**
   * Коллбэк, отрабатывающий при загрузке/ошибке загрузки/таймауте загрузки картинки
   * @callback LoadImageCallback
   * @param {boolean} error - true при ошибке и таймауте, false при успешной загрузке, см. функцию onImageLoad
   */

  /**
   * Создаем картинку через конструктор, загружаем ее и отрабатываем все состяния с помощью коллбэка
   * @param {string} url
   * @param {LoadImageCallback} callback
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
   * Отрабатываем состояния загрузки и ошибки
   * @callback LoadXhrCallback
   * @param {Boolean} error - Если скрипт не загрузился, error = true, при успехе error = false
   * @param {Array<Object>} - В случае успешной загрузки обрабатываем наш массив объектов
   */

  /**
   * Грузим наш xhr с сервера и получаем список отзывов с сервера по ссылке
   * @param  {String}           url       Ссылка, по которой грузим нужный скрипт
   * @param  {LoadXhrCallback}  callback  Коллбэк, отрабатывающий возможные события загрузки скрипта
   */
  function callServer(url, callback) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function(event) {
      callback(false, JSON.parse(event.target.response));
    });

    xhr.addEventListener('error', function() {
      callback(true);
    });

    xhr.addEventListener('timeout', function() {
      callback(true);
    });

    xhr.open('GET', url);

    xhr.timeout = 10000;
    xhr.send();
  }

  /**
   * Отрисовываем отзывы, отчищая перед этим контейнер
   * @param  {Array.<Object>} reviews - наш массив со списком отелей
   */
  function renderReviews(someReviews) {
    reviewsContainer.innerHTML = '';

    /**
     * Проходимся по всему массиву и для каждого объекта генерируем новый DOM-элемент
     * см. getReviewElement
     */
    someReviews.forEach(function(review) {
      getReviewElement(review, reviewsContainer);
    });
  }

  /**
   * Перефигачиваем данные под фильтры в исходном массиве
   * @param  {Array<Object>} reviews исходный массив
   * @param  {string} filter наш фильтр по атрибуту for, см. setFiltrationEnabled(this.for)
   */
  function getFilteredReviews(someReviews, filter) {
    /**
     * Дата последнего отзыва
     */
    var lastReviewDate;
    var reviewsToFilter = someReviews.slice(0);

    switch(filter) {
      case Filter.DATA:
        reviewsToFilter.sort(function(a, b) {
          return new Date(b.date) - new Date(a.date);
        });

        lastReviewDate = new Date(reviewsToFilter[0].date);

        /**
         * За две недели до последнего отзыва
         */
        lastReviewDate.setDate(lastReviewDate.getDate() - 14);

        reviewsToFilter = reviewsToFilter.filter(function(review) {
          return new Date(review.date) >= lastReviewDate;
        });
        break;

      case Filter.RATING_GOOD:
        reviewsToFilter = reviewsToFilter
          .filter(function(review) {
            return review.rating >= 3;
          })
          .sort(function(a, b) {
            return b.rating - a.rating;
          });
        break;

      case Filter.RATING_BAD:
        reviewsToFilter = reviewsToFilter
          .filter(function(review) {
            return review.rating < 3;
          })
          .sort(function(a, b) {
            return a.rating - b.rating;
          });
        break;

      case Filter.POPULAR:
        reviewsToFilter.sort(function(a, b) {
          return b.review_usefulness - a.review_usefulness;
        });
        break;
    }
    return reviewsToFilter;
  }

  /**
   * Настраиваем фильтры по атрибуту for у метки
   * И перерисовываем отзывы на основе нового массива
   * @param {string} filter атрибут for у метки, см. setFiltrationEnabled(this.for)
   */
  function setFilterEnabled(filter) {
    var filteredReviews = getFilteredReviews(reviews, filter);
    renderReviews(filteredReviews);
  }

  /**
   * Ищем все наши метки и вешаем на них фильтры по событию click
   */
  function setFiltersEnabled() {
    var i;
    var reviewFilters = document.querySelectorAll('.reviews-filter-item');
    for (i = 0; i < reviewFilters.length; i++) {
      reviewFilters[i].addEventListener('click', function() {
        setFilterEnabled(this.getAttribute('for'));
      });
    }
  }

  /**
   * Ищем прелоадер, вешаем на него нужный класс
   * @type {HTMLElement}
   */
  reviewsContainer.classList.add('reviews-list-loading');

  /**
   * Клонируем или с content или сам template
   */
  if('content' in templateElement) {
    elementToClone = templateElement.content.querySelector('.review');
  } else {
    elementToClone = templateElement.querySelector('.review');
  }

  /**
   * Прячем список фильтров перед отрисовкой отзывов
   */
  reviewsFilterBlock.classList.add('invisible');

  callServer(REVIEWS_LOAD_URL, function(error, reviewsData) {
    reviewsContainer.classList.remove('reviews-list-loading');

    if (error) {
      reviewsContainer.classList.add('reviews-load-failure');
    } else {
      reviews = reviewsData;

      /**
       * Возвращаем фильтры
       */
      reviewsFilterBlock.classList.remove('invisible');

      setFiltersEnabled(true);
      setFilterEnabled(DEFAULT_FILTER);
    }
  });
})();
