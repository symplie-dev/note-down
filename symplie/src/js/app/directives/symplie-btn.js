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
      symplieState:       '=',
      notepadState:       '=',
      innerBtnOcticon:    '=',
      notes:              '=',
      currentNote:        '=',
      addMarkdownElement: '=',
      unsaved:            '='
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
    if ($scope.symplieState === Constants.SymplieState.MENU) {
      $scope.newNote();
      $scope.symplieState = Constants.SymplieState.NOTEPAD;
      $scope.innerBtnOcticon = Constants.Octicon.EYE;
      $scope.notepadState = Constants.NotepadState.MARKDOWN;
      $scope.focusMdEditor();
    } else if ($scope.symplieState == Constants.SymplieState.NOTEPAD) {
      switch ($scope.notepadState) {
        case Constants.NotepadState.VIEW:
          $scope.notepadState = Constants.NotepadState.MARKDOWN;
          $scope.innerBtnOcticon = Constants.Octicon.EYE;
          $scope.focusMdEditor();
          break;
        case Constants.NotepadState.MARKDOWN:
          $scope.notepadState = Constants.NotepadState.VIEW;
          $scope.innerBtnOcticon = Constants.Octicon.PENCIL;
          // Update model in DB (TODO: Better logic to find out when there is a change)
          $scope.currentNote.updatedAt = Date.now();
          $scope.currentNote.updatedAt = Date.now();
          dao.updateNote($scope.currentNote);
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

  $scope.bounceBtn = function ($event) {
    if ($(event.target).hasClass('octicon')) {
      $($event.target).parent().addClass('bounce animated')
        .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
          $(this).removeClass('bounce animated');
        });
    } else {
      $($event.target).addClass('bounce animated')
        .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
          $(this).removeClass('bounce animated');
        });
    }
  };

  $scope.focusMdEditor = function () {
    setTimeout(function () {
      $('.md-editor').focus();
    }, 200);
  };
};