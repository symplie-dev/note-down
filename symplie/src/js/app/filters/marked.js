'use strict';

var marked    = require('marked'),
    Constants = require('../constants'),
    renderer  = require('./renderer');

marked.setOptions({
  highlight: function (code) {
    return require('highlight.js').highlightAuto(code).value;
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