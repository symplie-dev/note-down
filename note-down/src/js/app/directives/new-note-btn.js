'use strict';

var Constants = require('../constants'),
    dao       = require('../database');

module.exports = function() {
  return {
    controller: ctrl,
    link: link,
    replace: true,
    restrict: 'EA',
    scope: {
      symplieState:       '=',
      notepadState:       '=',
      innerBtnOcticon:    '=',
      notes:              '=',
      currentNote:        '=',
      addMarkdownElement: '=',
      unsaved:            '=',
      settings:           '='
    },
    templateUrl: '/views/partials/new-note-btn.html'
  };
};

function ctrl($scope) {
  /**
   * When the center button is clicked, the notepadState must change. The next notepadState is
   * dependent on the current notepadState.
   */
  $scope.centerBtnHandler = function () {
    $scope.newNote();
    $scope.symplieState = Constants.SymplieState.NOTEPAD;
    $scope.innerBtnOcticon = Constants.Octicon.EYE;
    $scope.notepadState = Constants.NotepadState.MARKDOWN;
    $scope.focusMdEditor();
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

  $scope.focusMdEditor = function () {
    setTimeout(function () {
      $('.md-editor').focus();
    }, 200);
  };
}
ctrl.$inject = ['$scope'];

function link($scope, $element) {
  centerNewNoteBtn();

  !function () {
    $(window).on('resize', function () {
      centerNewNoteBtn();
    });
  }()
}
link.$inject = ['$scope', '$element'];

function centerNewNoteBtn() {
  var $btnWrapper = $('.new-note-btn-wrapper'),
      left        = ($('.symplie-menu-wrapper').width() / 2) -
                      ($btnWrapper.width() / 2);
  
  $btnWrapper.css('left', left + 'px');
}