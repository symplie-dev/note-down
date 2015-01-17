'use strict';

var Constants = require('../constants');

module.exports = function($scope) {
  $scope.currentNote = {
    markdown: Constants.WELCOME_NOTE,
    createdDate: Date.now(),
    updatedDate: Date.now()
  };

  $scope.notes = [];
  $scope.notes.push($scope.currentNote);
  
  $scope.symplieState    = Constants.SymplieState.MENU;
  $scope.notepadState    = Constants.NotepadState.VIEW;
  $scope.inputState      = null;
  $scope.selectedElement = Constants.EMPTY_STRING;
  $scope.innerBtnOcticon = Constants.Octicon.PLUS;

  $scope.backToMenu = function () {
    $scope.symplieState = Constants.SymplieState.MENU;
    $scope.notepadState = Constants.NotepadState.VIEW;
    $scope.innerBtnOcticon = Constants.Octicon.PLUS;
  };

  // Declarations of functions shared across directives
  $scope.createElement = function () {};
};