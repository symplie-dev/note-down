'use strict';

var marked = require('marked'),
    Constants = require('../constants'),
    renderer  = require('./renderer');

module.exports = function () {
  return function (note) {

    if (note) {
      var title = note.markdown.substr(0, 25);

      title = marked(title, { renderer: renderer });

      return $(title).text() + '...';
    } else {
      return Constants.EMPTY_STRING;
    }
  }
};