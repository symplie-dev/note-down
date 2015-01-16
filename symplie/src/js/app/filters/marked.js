'use strict';

var marked   = require('marked'),
    renderer = new marked.Renderer();

renderer.listitem = function(text) {
  if (/^\s*\[[x ]\]\s*/.test(text)) {
      text = text
        .replace(/^\s*\[ \]\s*/, '<span class="checkbox octicon octicon-check unchecked"></span>')
        .replace(/^\s*\[x\]\s*/, '<span class="checkbox octicon octicon-check"></span>');
      return '<li>' + text + '</li>';
  } else {
      return '<li><span class="octicon octicon-primitive-dot bullet"></span>' + text + '</li>';
  }
};

module.exports = function () {
  return function (input) {
    return marked(input, { renderer: renderer });
  }
};