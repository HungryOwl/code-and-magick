'use strict';

define('baseDom', function() {

  function DOMComponent(template, innerSelector, parentNode) {
    this.templateElement = document.querySelector(template);

    this.elementToClone(template, innerSelector);

    this.element = this.elementToClone.cloneNode(true);

    this.append(parentNode);

    this.onClick = this.onClick.bind(this);
  }

  DOMComponent.prototype.elementToClone = function(template, innerSelector) {
    if ('content' in this.templateElement) {
      this.elementToClone = this.templateElement.content.querySelector(innerSelector);
    } else {
      this.elementToClone = this.templateElement.querySelector(innerSelector);
    }

    return this;
  };

  DOMComponent.prototype.append = function(parentNode) {
    parentNode.appendChild(this.element);
    this.element.addEventListener('click', this.onClick);

    return this;
  };

  DOMComponent.prototype.onClick = function() {
    console.log('я кликнул по', this.element);
  };

  DOMComponent.prototype.remove = function(parentNode) {
    this.element.removeEventListener('click', this.onClick);
    parentNode.removeChild(this.element);
    this.element = '';
  };

  return DOMComponent;
});
