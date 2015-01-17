'use strict';

var Constants = require('../constants');

module.exports = function() {
  return {
    controller: ctrl,
    link: function ($scope, $element) { },
    replace: true,
    restrict: 'EA',
    scope: {
      symplieState:    '=',
      notepadState:    '=',
      innerBtnOcticon: '=',
      selectedElement: '=',
      createElement:   '=',
      notes:           '=',
      currentNote:     '='
    },
    templateUrl: '/views/partials/symplie-btn.html'
  };
};

function ctrl($scope) {
  /**
   * When the center button is clicked, the notepadState must change. The next notepadState is
   * dependent on the current notepadState.
   */
  $scope.centerBtnHandler = function () {
    if ($scope.symplieState == Constants.SymplieState.MENU) {
      $scope.newNote();
      $scope.symplieState = Constants.SymplieState.NOTEPAD;
      $scope.innerBtnOcticon = Constants.Octicon.PENCIL;
    } else if ($scope.symplieState == Constants.SymplieState.NOTEPAD) {
      switch ($scope.notepadState) {
        case Constants.NotepadState.VIEW:
          $scope.notepadState = Constants.NotepadState.CHOOSE_ELEMENT;
          $scope.innerBtnOcticon = Constants.Octicon.MARKDOWN;
          break;
        case Constants.NotepadState.CHOOSE_ELEMENT:
          $scope.notepadState = Constants.NotepadState.MARKDOWN;
          $scope.innerBtnOcticon = Constants.Octicon.EYE;
          break;
        case Constants.NotepadState.NEW_ELEMENT:
          $scope.notepadState = Constants.NotepadState.VIEW;
          $scope.innerBtnOcticon = Constants.Octicon.PENCIL;
          $scope.createElement();
          $scope.currentNote.updatedDate = Date.now();
          break;
        case Constants.NotepadState.MARKDOWN:
          $scope.notepadState = Constants.NotepadState.VIEW;
          $scope.innerBtnOcticon = Constants.Octicon.PENCIL;
          $scope.currentNote.updatedDate = Date.now();
          break;
        default:
          console.log('ERROR: Unknown state - ' + $scope.notepadState);
          $scope.notepadState = Constants.NotepadState.VIEW;
          $scope.innerBtnOcticon = Constants.Octicon.PENCIL;
          break;
      }
    } else {
      console.log('ERROR: unknown state - ' + $scope.symplieState);
    }
  };

  $scope.cancelChooseElement = function () {
    $scope.notepadState = Constants.NotepadState.VIEW;
    $scope.innerBtnOcticon = Constants.Octicon.PENCIL;
  };

  $scope.newElement = function () {
    $scope.notepadState = Constants.NotepadState.NEW_ELEMENT;
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

  $scope.newNote = function () {
    $scope.notes.push({
      createdDate: Date.now(),
      updatedDate: Date.now(),
      markdown:    Constants.EMPTY_STRING
    });

    $scope.currentNote = $scope.notes[$scope.notes.length - 1];
  };
};