'use strict';

var marked    = require('marked'),
    Constants = require('../constants'),
    renderer  = require('./renderer'),
    hljs      = require('highlight.js');

marked.setOptions({
  highlight: function (code, lang) {
    if (hljs.listLanguages().indexOf(lang) >= 0) {
      return hljs.highlight(lang, code, true).value;
    }
              
    return code;
  }
});

module.exports = function () {
  return function (note) {
    if (note) {
      return marked(note.markdown, { renderer: renderer });
    } else {
      return Constants.EMPTY_STRING;
    }
  }
};