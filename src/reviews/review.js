'use strict';

define('review', ['./template', '../baseDom', '../utils'], function(getReviewElement, DOMComponent, utils) {
  /**
   * Конструктор отзыва
   * @param {object} data Данные, полученные по xhr
   * @constructor
   */
  function Review(data) {
    this.data = data;
    this.element = getReviewElement(this.data);

    this.quiz = this.element.querySelector('.review-quiz');

    this.onQuizClick = this.onQuizClick.bind(this);

    this.quiz.addEventListener('click', this.onQuizClick);
  }

  utils.inherit(Review, DOMComponent);

  Review.prototype.onQuizClick = function(evt) {
    var quizActive = this.quiz.querySelector('.review-quiz-answer-active');

    if (evt.target.classList.contains('review-quiz-answer')) {
      if (quizActive) {
        quizActive.classList.remove('review-quiz-answer-active');
      }

      evt.target.classList.add('review-quiz-answer-active');
    }
  };

  Review.prototype.remove = function() {
    this.quiz.removeEventListener('click', this.onQuizClick);
    DOMComponent.prototype.remove.call(this);
  };

  return Review;
});
