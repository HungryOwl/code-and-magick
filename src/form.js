'use strict';
/**
 * Валидируем форму
 */
(function() {
  var i;
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');

  var browserCookies = require('browser-cookies');

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
   * Записываем Куки перед отправкой формы
   * @param  {Date}
   * @return {[type]}
   */
  form.addEventListener('submit', function(event) {
    event.preventDefault();

    var myBirthday = new Date('1985-12-8');
    var todayDay = new Date();
    var daysFromMyBirthday;
    var dateToExpire;
    /*var formattedDateToExpire;*/
    var reviewCookieMark;

    myBirthday.setFullYear(todayDay.getFullYear());

    if (todayDay.valueOf() < myBirthday.valueOf()) {
      myBirthday.setFullYear(todayDay.getFullYear() - 1);
    }

    daysFromMyBirthday = (todayDay.valueOf() - myBirthday.valueOf());
    dateToExpire = Date.now() + daysFromMyBirthday;
    /*formattedDateToExpire = new Date(dateToExpire).toUTCString();*/

    console.log('todayDay = ', todayDay);
    console.log('myBirthday ', myBirthday);
    console.log('daysFromMyBirthday ', daysFromMyBirthday);
    console.log('dateToExpire ', dateToExpire);
    /*console.log('formattedDateToExpire ', formattedDateToExpire);*/

    browserCookies.set('reviewName', reviewName.value);
    console.log(reviewName, ' ', reviewName.value, {expires: dateToExpire});

    for (i = 0; i < reviewMarkCollection.length; i++) {
      if (reviewMarkCollection[i].checked) {
        reviewCookieMark = reviewMarkCollection[i];
        console.log(reviewMarkCollection[i], ' ', reviewMarkCollection[i].value);
        browserCookies.set('reviewCookieMark', reviewCookieMark.value, {expires: dateToExpire});
      }
    }

    /*this.submit();*/
  });
})();
