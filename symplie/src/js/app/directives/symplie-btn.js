'use strict';

var Constants = require('../constants'),
    dao       = require('../database');

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
      currentNote:     '=',
      unsaved:         '=',
      oldNoteContent:  '='
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
      $scope.innerBtnOcticon = Constants.Octicon.MARKDOWN;
      $scope.notepadState = Constants.NotepadState.CHOOSE_ELEMENT;
    } else if ($scope.symplieState == Constants.SymplieState.NOTEPAD) {
      switch ($scope.notepadState) {
        case Constants.NotepadState.VIEW:
          $scope.notepadState = Constants.NotepadState.CHOOSE_ELEMENT;
          $scope.innerBtnOcticon = Constants.Octicon.MARKDOWN;
          break;
        case Constants.NotepadState.CHOOSE_ELEMENT:
          $scope.notepadState = Constants.NotepadState.MARKDOWN;
          $scope.innerBtnOcticon = Constants.Octicon.EYE;
          $scope.unsaved = true;
          setTimeout(function () {
            $('textarea.md-editor').focus();
          }, 400);
          break;
        case Constants.NotepadState.NEW_ELEMENT:
          $scope.notepadState = Constants.NotepadState.VIEW;
          $scope.innerBtnOcticon = Constants.Octicon.PENCIL;
          $scope.createElement();
          $scope.currentNote.updatedAt = Date.now();
          $scope.oldNoteContent = $scope.currentNote.markdown;
          break;
        case Constants.NotepadState.MARKDOWN:
          $scope.notepadState = Constants.NotepadState.VIEW;
          $scope.innerBtnOcticon = Constants.Octicon.PENCIL;
          $scope.currentNote.updatedAt = Date.now();
          // Update model in DB (TODO: Better logic to find out when there is a change)
          $scope.currentNote.updatedAt = Date.now();
          dao.updateNote($scope.currentNote);
          // Update old note content
          $scope.oldNoteContent = $scope.currentNote.markdown;
          $scope.unsaved = false;
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

  $scope.newHeaderInput = function () {
    $scope.newElement();
    $scope.selectedElement = Constants.SymplieElement.HEADER;
  };

  $scope.newNote = function () {
    var note = {
      markdown:  Constants.EMPTY_STRING,
      createdAt: Date.now(),
      updatedAt: Date.now()
      
    };

    dao.insertNote(note);

    $scope.notes.push(note);

    $scope.currentNote = $scope.notes[$scope.notes.length - 1];
  };
};