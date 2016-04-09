'use strict';

(function() {
  var i;
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');

  var form = document.querySelector('.review-form');

  /*Ищем элементы формы в самой форме с помощью свойства elements? elements ищет по имени
  элемента формы = по атрибуту name*/
  var reviewName = form.elements['review-name'];
  var reviewText = form.elements['review-text'];

  /*Идем в форме с помощью querySelector потому что review-fields НЕ поле формы*/
  var reviewField = form.querySelector('.review-fields');

  var reviewNameLabel = reviewField.querySelector('.review-fields-name');
  var reviewTextLabel = reviewField.querySelector('.review-fields-text');

  var reviewSubmit = form.querySelector('.review-submit');

  /*Кладем в переменную коллекцию радиобаттонов формы*/
  var reviewMarkCollection = form.elements['review-mark'];

  /*Функция проверки корректности заполнения любого поля, возвращает логическое значение*/
  function isInputCorrect(element) {
    return ! element.required || Boolean(element.value.trim());
  }

  function validateForm() {
    var isTextCorrect, isNameCorrect, isFormCorrect;

    /*Выставляем required если reviewMarkCollection.value < 3 true*/
    reviewText.required = reviewMarkCollection.value < 3;

    isTextCorrect = isInputCorrect(reviewText);
    isNameCorrect = isInputCorrect(reviewName);
    isFormCorrect = isTextCorrect && isNameCorrect;

    /*Toggle добавляет и убирает класс при выполнении условия, trim - метод,
    улаюяющий лишние пробелы в конце и начале строки*/
    reviewTextLabel.classList.toggle('invisible', isTextCorrect);

    /*Toggle добавляет и убирает класс при выполнении условия, trim - метод, улаюяющий лишние пробелы в конце и начале строки*/
    reviewNameLabel.classList.toggle('invisible', isNameCorrect);

    reviewField.classList.toggle('invisible', isFormCorrect);

    reviewSubmit.disabled = !isFormCorrect;

    /*var a = !(isFormCorrect);

    if (a === true) {
      reviewSubmit.disabled = true;
    } else {
      reviewSubmit.disabled = false;
    }*/
  }

  validateForm();

  for (i = 0; i < reviewMarkCollection.length; i++) {
    /*Обращение к элементу коллекции с помощью массива!!11*/
    reviewMarkCollection[i].addEventListener('change', validateForm);
  }

  /*При изменении каждого элемента будет проверяться вся форма, см. функцию validateForm*/
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
})();
