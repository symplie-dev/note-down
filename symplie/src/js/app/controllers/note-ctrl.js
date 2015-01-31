'use strict';

var Constants = require('../constants'),
    dao       = require('../database'),
    Utils     = require('../utils');

module.exports = function($scope) {
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
  $scope.unsaved         = false;

  $scope.backToMenu = function () {
    // Went back before saving, reset markdown content
    $scope.symplieState = Constants.SymplieState.MENU;
    $scope.notepadState = Constants.NotepadState.VIEW;
    $scope.innerBtnOcticon = Constants.Octicon.PLUS;
    $scope.selectedElement = Constants.EMPTY_STRING;
    $scope.unsaved = false;

    $scope.currentNote.updatedAt = Date.now();
    $scope.currentNote.updatedAt = Date.now();
    dao.updateNote($scope.currentNote);

    // Make sure we haven't left any element inputs on the viewing panel
    $('.textarea').remove();
  };

  // Declarations of functions shared across directives
  $scope.createElement = function () {};
  $scope.addMarkdownElement = function () {};

  $scope.goToChromeWebStore = function () {
    var win = window.open(Constants.CHROME_WEB_STORE, '_blank');
    win.focus();
  };

  $scope.exportNotesAsJson = function () {
    var jsonStr = JSON.stringify($scope.notes),
        // win = window.open('data:json;charset=utf-8,' + jsonStr, '_blank');
        win = window.open('data:application/json;' +
                (window.btoa
                  ? 'base64,' + btoa(jsonStr)
                  : jsonStr));

    win.focus();
  };

  $scope.popUpTitle     = Constants.EMPTY_STRING;
  $scope.popUpMessage   = Constants.EMPTY_STRING;
  $scope.popUpOkBtn     = Constants.EMPTY_STRING;
  $scope.popUpCancelBtn = Constants.EMPTY_STRING;

  // Asynchronously Check License
  setTimeout(function () {
    Utils.checkCwsLicense($scope);
  }, 1500);
};