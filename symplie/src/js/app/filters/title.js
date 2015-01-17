'use strict';

var marked = require('marked');

module.exports = function () {
  return function (input) {
    var title = input.substr(0, 25);

    title = marked(title);

    return $(title).text() + '...';
  }
};