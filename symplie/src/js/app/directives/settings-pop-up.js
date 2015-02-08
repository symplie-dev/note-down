'use strict';

var Constants = require('../constants'),
    dao       = require('../database');

module.exports = function() {
  return {
    controller: ctrl,
    replace: true,
    restrict: 'EA',
    scope: {
      okBtnAction:     '=',
      cancelBtnAction: '=',
      settings:        '=',
      exportNotes:     '='
    },
    templateUrl: '/views/partials/settings-pop-up.html',
    link: function ($scope, $element) { }
  };
};

function ctrl($scope) {
  $scope.$watch('settings.showMdBtns', function () {
    if (!$scope.settings.showMdBtns) {
      $scope.settings.showMdBtnTooltips = false;
    }
  });
}