'use strict';

var Constants = require('../constants');

module.exports = function() {
  return {
    controller: ctrl,
    link: function ($scope, $element) { },
    replace: true,
    restrict: 'EA',
    scope: {
      state:           '=',
      selectedElement: '=',
      createElement:   '='
      // createParagraph: '=',
      // createBullet:    '=',
      // createToDo:      '='
    },
    templateUrl: '/views/partials/symplie-btn.html'
  };
};

function ctrl($scope) {
  $scope.innerBtnOcticon = Constants.Octicon.PENCIL;
  /**
   * When the center button is clicked, the state must change. The next state is
   * dependent on the current state.
   */
  $scope.centerBtnHandler = function () {
    switch ($scope.state) {
      case Constants.SymplieState.VIEW:
        $scope.state = Constants.SymplieState.CHOOSE_ELEMENT;
        $scope.innerBtnOcticon = Constants.Octicon.MARKDOWN;
        break;
      case Constants.SymplieState.CHOOSE_ELEMENT:
        $scope.state = Constants.SymplieState.MARKDOWN;
        $scope.innerBtnOcticon = Constants.Octicon.EYE;
        break;
      case Constants.SymplieState.NEW_ELEMENT:
        $scope.state = Constants.SymplieState.VIEW;
        $scope.innerBtnOcticon = Constants.Octicon.PENCIL;
        $scope.createElement();
        break;
      case Constants.SymplieState.MARKDOWN:
        $scope.state = Constants.SymplieState.VIEW;
        $scope.innerBtnOcticon = Constants.Octicon.PENCIL;
        break;
      default:
        $scope.state = Constants.SymplieState.VIEW;
        $scope.innerBtnOcticon = Constants.Octicon.PENCIL;
        break;
    }
  };

  $scope.cancelChooseElement = function () {
    $scope.state = Constants.SymplieState.VIEW;
    $scope.innerBtnOcticon = Constants.Octicon.PENCIL;
  };

  $scope.newElement = function () {
    $scope.state = Constants.SymplieState.NEW_ELEMENT;
    $scope.innerBtnOcticon = Constants.Octicon.PLUS;
  };

  $scope.newParagraphInput = function () {
    $scope.newElement();
    $scope.selectedElement = Constants.SymplieElement.PARAGRAPH;
  };

  $scope.newBulletInput = function () {
    $scope.newElement();
    $scope.selectedElement = Constants.SymplieElement.BULLET;
  };

  $scope.newToDoInput = function () {
    $scope.newElement();
    $scope.selectedElement = Constants.SymplieElement.TODO;
  };
};