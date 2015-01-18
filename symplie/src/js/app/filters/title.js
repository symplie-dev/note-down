'use strict';

var marked = require('marked'),
    Constants = require('../constants');

module.exports = function () {
  return function (note) {

    if (note) {
      console.log(note);
      var title = note.markdown.substr(0, 25);

      title = marked(title);

      return $(title).text() + '...';
    } else {
      return Constants.EMPTY_STRING;
    }
  }
};