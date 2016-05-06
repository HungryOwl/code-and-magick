'use strict';

define('baseDom', ['./utils'], function(utils) {

  function DOMComponent(template, innerSelector, parentNode) {
    this.remove = this.remove.bind(this);
    this.append = this.append.bind(this);

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
