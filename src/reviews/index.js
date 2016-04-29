'use strict';

define('reviews', ['../utils', './review'], function(utils, Review) {
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
   * Массив отрисованных объектов-отзывов из конструктора
   * @type {Array}
   */
  var renderedReviews = [];

  /**
   * Отфильтрованный массив
   * @type {Array.<Object>}
   */
  var filteredReviews = [];

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
   * Имя фильтра в локалсторедже
   * @type {String}
   */
  var filterStorageKey = 'filter';

  /**
   * Количество отрисованных отзывов
   * @const {Number}
   */
  var PAGE_SIZE = 3;

  /**
   * Номер страницы отзывов, которую сейчас рисуем
   * @type {Number}
   */
  var pageNumber = 0;

  /**
   * Кнопка показа отзывов
   * @type {HTMLElement}
   */
  var showMoreButton = document.querySelector('.reviews-controls-more');

  /**
   * Отрисовываем отзывы, отчищая перед этим контейнер
   * @param  {Array.<Object>} reviews - наш массив со списком отелей
   * @param {boolean} replace true - очищаем контейнер
   *                          false - не очищаем
   */
  function renderReviews(someReviews, replace) {
    if (replace) {
      renderedReviews.forEach(function(reviewElement) {
        reviewElement.remove();
      });

      renderedReviews = [];
    }

    /**
     * Проходимся по всему массиву и для каждого объекта генерируем новый DOM-элемент
     * см. getReviewElement
     */
    someReviews.forEach(function(data) {
      var review = new Review(data);
      renderedReviews.push(review);
      reviewsContainer.appendChild(review.element);
    });
  }

  /**
   * Сортируем данные под фильтры в исходном массиве
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
   * Отрисовка отзывов постранично
   */
  function loadNextReviewsPage() {
    var from = pageNumber * PAGE_SIZE;
    var to = from + PAGE_SIZE;

    if (from < filteredReviews.length) {
      renderReviews(filteredReviews.slice(from, to), pageNumber === 0);

      pageNumber++;

      showMoreButton.classList.toggle('invisible', to >= filteredReviews.length);
    }
  }

  /**
   * Отрисовываем наши страницы по клику на кнопку "показать отзывы"
   */
  function enableMoreButton() {
    showMoreButton.addEventListener('click', loadNextReviewsPage);
  }

  /**
   * Настраиваем фильтры по атрибуту for у метки
   * Перерисовываем отзывы на основе нового массива
   * И проверяем, досупна ли кнопка загрузки отзывов
   * @param {string} filter атрибут for у метки, см. setFiltrationEnabled(this.for)
   */
  function setFilter(filter) {
    localStorage.setItem(filterStorageKey, filter);
    pageNumber = 0;

    filteredReviews = getFilteredReviews(reviews, filter);

    loadNextReviewsPage();
  }

  /**
   * Ищем все наши метки и вешаем на них фильтры по событию click
   */
  function enableFilters() {
    reviewsFilterBlock.addEventListener('click', function(evt) {
      if (evt.target.classList.contains('reviews-filter-item')) {
        setFilter(evt.target.getAttribute('for'));
      }
    });
  }

  /**
   * Ищем прелоадер, вешаем на него нужный класс
   * @type {HTMLElement}
   */
  reviewsContainer.classList.add('reviews-list-loading');

  /**
   * Прячем список фильтров перед отрисовкой отзывов
   */
  reviewsFilterBlock.classList.add('invisible');

  utils.callServer(REVIEWS_LOAD_URL, function(error, reviewsData) {
    /**
     * Кнопка фильтра отзывов
     * @type {HTMLInputElement} инпут с id фильтра
     */
    var filterButton;
    var savedFilter = localStorage.getItem(filterStorageKey);

    reviewsContainer.classList.remove('reviews-list-loading');

    if (error) {
      reviewsContainer.classList.add('reviews-load-failure');
    } else {
      reviews = reviewsData;

      /**
       * Возвращаем фильтры
       */
      reviewsFilterBlock.classList.remove('invisible');

      enableFilters();

      setFilter(savedFilter || DEFAULT_FILTER);

      filterButton = reviewsFilterBlock.querySelector('#' + savedFilter);

      if (filterButton) {
        filterButton.checked = true;
      }

      enableMoreButton();
    }
  });
});
