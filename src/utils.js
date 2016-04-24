'use strict';

/**
 * Модуль utils (первый параметр - омя модуля)
 * loadImg - загрузка картинок
 * callServer - загрузка ответа с сервера в виде строки
 */
define('utils', function() {
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
   * Ищет шаблон и клонирует
   * @param  {string} template      селектор самого шаблона
   * @param  {string} innerSelector имя конкретного шаблона
   * @return {HTMLElement}          склонированный элемент (кусок разметки)
   */
  function getTemplateClone(template, innerSelector) {
    /**
     * Наш шаблончик с разметкой
     * @type {HTMLElement}
     */
    var templateElement = document.querySelector(template);

    /**
     * Клонируемое содержимое из template
     */
    var elementToClone;

    /**
     * Клонируем или с content или сам template
     */
    if ('content' in templateElement) {
      elementToClone = templateElement.content.querySelector(innerSelector);
    } else {
      elementToClone = templateElement.querySelector(innerSelector);
    }

    return elementToClone;
  }

  /**
   * Троттлим что-то
   * @param  {callback} callback    функция, которая будет троттлиться
   * @param  {number}   time        время троттлинга
   */
  function throttle(callback, time) {
    /**
     * controlDate контрольная дата, с которой начинается троттлинг
     * @type {Date}
     */
    var controlDate = new Date();

    return function() {
      var currentDate = new Date();

      if (currentDate.valueOf() - controlDate.valueOf() >= time) {
        callback();
        controlDate = new Date();
      }
    };
  }

  /**
   * Делаем блок невидимым
   * @param  {HTMLElement} blockToToggle  куда навешиваем класс
   * @param  {boolean}     whenToToggle   условие, по которому тогглим
   */
  function setBlockHidden(blockToToggle, whenToToggle) {
    blockToToggle.classList.toggle('invisible', whenToToggle);
  }

  /**
   * Переключаем наши картинки
   * @callback SwitchPicture
   */

  /**
   * Возвращаем функцию!! (подумай, почему, см. gallery)
   * @param  {number}   keyCode   код клавиши
   * @param  {SwitchPicture} callback  вызывем коллбэк по нажатию
   * @return {function}           проверяем, та ли нажата клавиша
   */
  function listenKey(keyCode, callback) {
    return function(evt) {
      if (evt.keyCode === keyCode) {
        callback();
      }
    };
  }

  /**
   * Объект с названиями функций (в значениях объекта - сами функции)
   */
  return {
    loadImg: loadImg,
    callServer: callServer,
    getTemplateClone: getTemplateClone,
    throttle: throttle,
    setBlockHidden: setBlockHidden,
    listenKey: listenKey
  };
});
