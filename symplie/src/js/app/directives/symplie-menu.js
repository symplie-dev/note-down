'use strict';

var Constants = require('../constants');

module.exports = function() {
  return {
    restrict: 'EA',
    scope: {
      notes:           '=',
      currentNote:     '=',
      symplieState:    '=',
      innerBtnOcticon: '='
    },
    templateUrl: '/views/partials/symplie-menu.html',
    controller: ctrl,
    link: function ($scope, $element) { }
  };
};

function ctrl($scope) {
  $scope.viewNote = function (index) {
    $scope.currentNote = $scope.notes[index];
    $scope.symplieState = Constants.SymplieState.NOTEPAD;
    $scope.innerBtnOcticon = Constants.Octicon.PENCIL;
  }
}