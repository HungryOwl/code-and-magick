'use strict';

define('baseDom', ['./utils'], function(utils) {

  function DOMComponent(template, innerSelector, parentNode) {
    this.templateElement = document.querySelector(template);

    this.elementToClone(template, innerSelector);

    this.element = this.elementToClone.cloneNode(true);

    this.append(parentNode);
  }

  DOMComponent.prototype.elementToClone = function(template, innerSelector) {
    utils.getTemplateClone(template, innerSelector);

    return this;
  };

  DOMComponent.prototype.append = function(parentNode) {
    parentNode.appendChild(this.element);

    return this;
  };

  DOMComponent.prototype.remove = function() {
    this.element.parentNode.removeChild(this.element);
  };

  return DOMComponent;
});
