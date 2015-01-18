'use strict';

var marked    = require('marked'),
    Constants = require('../constants'),
    renderer  = new marked.Renderer();

marked.setOptions({
  highlight: function (code) {
    return require('highlight.js').highlightAuto(code).value;
  }
});

renderer.listitem = function(text) {
  if (/^\s*\[[x ]\]\s*/.test(text)) {
      text = text
        .replace(/^\s*\[ \]\s*/, ' class="task">')
        .replace(/^\s*\[x\]\s*/, ' class="task completed">');
      return '<li' + text + '</li>';
  } else {
      return '<li class="bullet">' + text + '</li>';
  }
};

module.exports = function () {
  return function (note) {
    if (note) {
      return marked(note.markdown, { renderer: renderer,  });
    } else {
      return Constants.EMPTY_STRING;
    }
  }
};