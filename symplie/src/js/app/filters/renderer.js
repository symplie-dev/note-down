'use strict';

var marked    = require('marked'),
    renderer  = new marked.Renderer();

renderer.listitem = function(text) {
  if (/^\s*\[[x ]\]\s*/.test(text)) {
      text = text
        .replace(/^\s*\[ \]\s*/, ' class="task">')
        .replace(/^\s*\[x\]\s*/, ' class="task completed">');
      return '<li' + text + '</li> ';
  } else {
      return '<li class="bullet">' + text + '</li> ';
  }
};

module.exports = renderer;