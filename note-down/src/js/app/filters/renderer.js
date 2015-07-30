'use strict';

var marked    = require('marked'),
    renderer  = new marked.Renderer();

renderer.customTaskCounter = 0;

renderer.listitem = function(text) {
  if (/^\s*\[[x ]\]\s*/.test(text)) {
      renderer.customTaskCounter++;
      text = text
        .replace(/^\s*\[ \]\s*/, ' class="task uncompleted">')
        .replace(/^\s*\[x\]\s*/, ' class="task completed">');
      return '<li' + text + '</li> ';
  } else {
      return '<li class="bullet">' + text + '</li> ';
  }
};

module.exports = renderer;