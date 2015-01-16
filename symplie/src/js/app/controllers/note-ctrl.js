'use strict';

var Constants = require('../constants');

module.exports = function($scope) {
  $scope.note = {
    markdown: Constants.EMPTY_STRING
  };
  
  $scope.state           = Constants.SymplieState.VIEW ;
  $scope.inputState      = null;
  $scope.selectedElement = Constants.EMPTY_STRING;

  // Declarations of functions shared across directives
  $scope.createElement = function () {};
};