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
  $scope.order = 'createdAt';

  $scope.viewNote = function (note) {
    $scope.currentNote = note;
    $scope.symplieState = Constants.SymplieState.NOTEPAD;
    $scope.innerBtnOcticon = Constants.Octicon.PENCIL;
  }

  $scope.orderByCreatedDate = function () {
    if ($scope.order !== 'createdAt') {
      $scope.order = 'createdAt';
    }
  }

  $scope.orderByUpdatedDate = function () {
    if ($scope.order !== 'updatedAt') {
      $scope.order = 'updatedAt';
    }
  }
}