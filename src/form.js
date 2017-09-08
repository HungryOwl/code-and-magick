'use strict';
/**
 * Валидируем форму
 */
define('form', ['./utils', 'browser-cookies'], function(utils, browserCookies) {
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');

  /**
   * Ищем саму форму в document
   * @const
   * @type {HTMLFormElement}
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement
   */
  var form = document.querySelector('.review-form');

  /**
   * Ищем элементы формы в форме с пом-ю свойства elements по атрибуту name элемента формы
   * @const
   * @type {HTMLInputElement}
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement
   */
  var reviewName = form.elements['review-name'];
  var reviewText = form.elements['review-text'];

  /**
   * Ищем блок "Осталось заполнить" в форме с помощью querySelector т.к. он - НЕ поле формы
   */
  var reviewField = form.querySelector('.review-fields');

  /**
   * @const
   * @type {HTMLLabelElement}
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement
   */
  var reviewNameLabel = reviewField.querySelector('.review-fields-name');
  var reviewTextLabel = reviewField.querySelector('.review-fields-text');

  /**
   * Кнопка отправки формы
   * @const
   * @type {HTMLButtonElement}
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement
   */
  var reviewSubmit = form.querySelector('.review-submit');

  /**
   * Кладем в константу коллекцию радиобаттонов формы
   * @const
   * @type {RadioNodeList}
   * @see https://developer.mozilla.org/en-US/docs/Web/API/RadioNodeList
   */
  var reviewMarkCollection = form.elements['review-mark'];

  var COOKIE_REVIEW_NAME = 'review-name';
  var COOKIE_REVIEW_MARK = 'review-mark';

  var textWarningWindow, nameWarningWindow;

  function showError(input) {
    return function() {
      var reviewWarning;
      var reviewNode = input.parentNode.querySelector('.review-require-warning');

      if (!reviewNode && !input.validity.valid) {
        reviewWarning = document.createElement('div');
        reviewWarning.classList.add('review-require-warning');
        reviewWarning.textContent = input.validationMessage;
        utils.setBlockHidden(reviewWarning, input.validity.valid);
        input.parentNode.appendChild(reviewWarning);
      }

      if (reviewNode) {
        reviewWarning = reviewNode;
        utils.setBlockHidden(reviewWarning, input.validity.valid);
      }
    };
  }
  
  /**
   * Проверяем, правильно ли заполнено любое поле
   * @param {HTMLInputElement|HTMLTextAreaElement} element Проверяемый инпут
   * @returns {Boolean} Верно ли он заполнен
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement
   */
  function isInputCorrect(element) {
    return !element.required || Boolean(element.value.trim());
  }

  /**
   * Проверяем, правильно ли заполнена вся форма
   */
  function validateForm() {
    var isTextCorrect, isNameCorrect, isFormCorrect;

    /**
     * Выставляем required если reviewMarkCollection.value < 3 = true
     */
    reviewText.required = reviewMarkCollection.value < 3;

    isTextCorrect = isInputCorrect(reviewText);
    isNameCorrect = isInputCorrect(reviewName);
    isFormCorrect = isTextCorrect && isNameCorrect;

    /**
     * Меняем класс при выполнении условия
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
     * С помощью метода trim подчищаем строку от лишних пробелов в начале и в конце
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim
     */
    utils.setBlockHidden(reviewTextLabel, isTextCorrect);
    utils.setBlockHidden(reviewNameLabel, isNameCorrect);
    utils.setBlockHidden(reviewField, isFormCorrect);

    reviewSubmit.disabled = !isFormCorrect;
  }

  /**
   * Вычисляем количество дней, прошедших со дня моего рождения до текущей даты
   * @return {number}
   */
  function getDateToExpire() {
    /**
     * Сегодняшняя дата
     * @type {Date}
     */
    var today = new Date();

    /**
     * Вычисляем текущий год
     * @type {number}
     */
    var currentYear = today.getFullYear();

    /**
     * Устанавливаем текущий год у дня рождения
     * @type {Date}
     */
    var birthday = new Date(currentYear, 11, 8);

    /**
     * Число милисекунд в дне
     * @const
     * @type {number}
     */
    var MS_IN_DAY = 1000 * 60 * 60 * 24;

    if (today < birthday) {
      birthday.setFullYear(currentYear - 1);
    }

    return Math.floor((today - birthday) / MS_IN_DAY);
  }

  function onOpenClick() {
    utils.setBlockHidden(formContainer, false);
  }

  function onCloseClick() {
    utils.setBlockHidden(formContainer, true);
  }

  textWarningWindow = showError(reviewText);
  nameWarningWindow = showError(reviewName);

  reviewName.value = browserCookies.get(COOKIE_REVIEW_NAME) || reviewName.value;
  reviewMarkCollection.value = browserCookies.get(COOKIE_REVIEW_MARK) || reviewMarkCollection.value;

  validateForm();

  /**
   * Пробегаемся по всем радиокнопкам и вешаем листенеры с валидацией формы
   */
  Array.prototype.forEach.call(reviewMarkCollection, function(mark) {
    mark.addEventListener('change', validateForm);
    mark.addEventListener('change', textWarningWindow);
  });

  /**
   * При изменении каждого элемента проверяем всю форму, см. validateForm
   */
  reviewName.addEventListener('input', validateForm);
  reviewText.addEventListener('input', validateForm);

  reviewText.addEventListener('change', textWarningWindow);
  reviewName.addEventListener('change', nameWarningWindow);

  /**
   * Записываем Куки перед отправкой формы
   */
  form.addEventListener('submit', function() {
    var cookieOptExpires = {expires: getDateToExpire()};

    browserCookies.set(COOKIE_REVIEW_NAME, reviewName.value, cookieOptExpires);
    browserCookies.set(COOKIE_REVIEW_MARK, reviewMarkCollection.value, cookieOptExpires);
  });

  formOpenButton.addEventListener('click', onOpenClick);
  formCloseButton.addEventListener('click', onCloseClick);
});
