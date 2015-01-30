'use strict';

var Constants = require('../constants'),
    dao       = require('../database');

module.exports = function() {
  return {
    controller: ctrl,
    replace: true,
    restrict: 'EA',
    scope: {
      title:           '=',
      message:         '=',
      okBtnLbl:        '=',
      cancelBtnLbl:    '=',
      okBtnAction:     '=',
      cancelBtnAction: '='
    },
    templateUrl: '/views/partials/pop-up.html',
    link: function ($scope, $element) { }
  };
};

function ctrl($scope) { }