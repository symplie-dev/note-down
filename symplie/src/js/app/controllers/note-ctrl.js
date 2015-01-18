'use strict';

var Constants = require('../constants'),
    dao       = require('../database');

module.exports = function($scope) {
  // $scope.currentNote = {
  //   markdown: Constants.WELCOME_NOTE,
  //   createdAt: Date.now(),
  //   updatedAt: Date.now()
  // };

  $scope.notes = [];
  $scope.currentNote = null;

  dao.init().then(function () {
    dao.getNotes().then(function (notes) {
      $scope.$apply(function () {
        $scope.notes = notes;
      });
    }).catch(function (err) {
      console.log('error: failed to get notes')
    });
  }).catch(function (err) {
    console.log('init failed');
    console.log(err);
  });
  
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