'use strict';
/**
 * Валидируем форму
 */
(function() {
  var browserCookies = require('browser-cookies');
  var i;
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
    reviewTextLabel.classList.toggle('invisible', isTextCorrect);
    reviewNameLabel.classList.toggle('invisible', isNameCorrect);
    reviewField.classList.toggle('invisible', isFormCorrect);

    reviewSubmit.disabled = !isFormCorrect;
  }

  reviewName.value = browserCookies.get('reviewName') || '';
  validateForm();

  /**
   * Пробегаемся по всем радиокнопкам в массиве-коллекции радиокнопок формы
   */
  for (i = 0; i < reviewMarkCollection.length; i++) {
    /**
     * Обращение к элементу коллекции по индексу
     */

    if (reviewMarkCollection[i].value === browserCookies.get('reviewCookieMark')) {
      console.log(reviewMarkCollection[i]);
      reviewMarkCollection[i].checked = true;
    }
    reviewMarkCollection[i].addEventListener('change', validateForm);
  }


  /**
   * При изменении каждого элемента проверяем всю форму, см. validateForm
   */
  reviewName.addEventListener('input', validateForm);
  reviewText.addEventListener('input', validateForm);

  formOpenButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.remove('invisible');
  };

  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.add('invisible');
  };

  /**
   * Вычисляем количество милисекунд, прошедших со дня моего рождения до текущей даты
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
     * @type {Date}
     */
    var currentYear = today.getFullYear();

    /**
     * Устанавливаем текущий год у дня рождения
     * @type {Date}
     */
    var birthday = new Date(currentYear, 12, 8);

    /**
     * Количество дней, прошедших со дня моего рождения
     * @type {number}
     */
    var daysFromMyBirthday;

    /**
     * Число для округления милисекунд до дней и обратно
     * @const
     * @type {number}
     */
    var MS_TO_DAYS_TO_MS = 1000 * 60 * 60 * 24;

    if (today.valueOf() < birthday.valueOf()) {
      birthday.setFullYear(today.getFullYear() - 1);
    }

    daysFromMyBirthday = Math.floor((today.valueOf() - birthday.valueOf()) / MS_TO_DAYS_TO_MS) * MS_TO_DAYS_TO_MS;

    return Math.floor(today.valueOf() / MS_TO_DAYS_TO_MS) * MS_TO_DAYS_TO_MS + daysFromMyBirthday;
  }

  /**
   * Записываем Куки перед отправкой формы
   * @param {submit} event
   */
  form.addEventListener('submit', function(event) {
    /**
     * Выбранная пользователем радиокнопка
     */
    var reviewCookieMark;
    event.preventDefault();

    browserCookies.set('reviewName', reviewName.value);
    console.log(reviewName, ' ', reviewName.value, {expires: getDateToExpire()});

    for (i = 0; i < reviewMarkCollection.length; i++) {
      if (reviewMarkCollection[i].checked) {
        reviewCookieMark = reviewMarkCollection[i];
        console.log(reviewMarkCollection[i], ' ', reviewMarkCollection[i].value);
        browserCookies.set('reviewCookieMark', reviewCookieMark.value, {expires: getDateToExpire()});
      }
    }

    this.submit();
  });
})();
