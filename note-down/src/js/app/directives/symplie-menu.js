'use strict';

var Constants = require('../constants'),
    dao       = require('../database'),
    Utils     = require('../utils');

module.exports = function() {
  return {
    restrict: 'EA',
    scope: {
      notes:           '=',
      currentNote:     '=',
      symplieState:    '=',
      notepadState:    '=',
      innerBtnOcticon: '=',
      unsaved:         '='
    },
    templateUrl: '/views/partials/symplie-menu.html',
    controller: ctrl,
    link: link
  };
};

function ctrl($scope, $rootScope) {
  $scope.order = 'createdAt';

  $scope.viewNote = function (note) {
    // Save previous note if user tries to select another note before the
    // autosave kicks in
    if ($scope.unsaved) {
      $scope.currentNote.updatedAt = Date.now();
      $scope.currentNote.updatedAt = Date.now();
      dao.updateNote($scope.currentNote);
      $scope.unsaved = false;
    }

    $scope.cancelDeleteNote();
    $scope.currentNote = note;
    $scope.symplieState = Constants.SymplieState.NOTEPAD;
    $scope.notepadState = Constants.NotepadState.VIEW;
    $scope.innerBtnOcticon = Constants.Octicon.PENCIL;
    $scope.oldNoteContent = $scope.currentNote.markdown;
  }

  $scope.orderByCreatedDate = function () {
    $scope.cancelDeleteNote();
    if ($scope.order !== 'createdAt') {
      $scope.order = 'createdAt';
    }
  }

  $scope.orderByUpdatedDate = function () {
    $scope.cancelDeleteNote();
    if ($scope.order !== 'updatedAt') {
      $scope.order = 'updatedAt';
    }
  }

  $scope.showDeleteBtn = function ($event) {
    $('.note-list-item-layer1').children('.note-delete').removeClass('show');
    $($event.target).parent().children('.note-delete').addClass('show');
  };

  $scope.hideDeleteBtn = function ($event) {
    $($event.target).parent().children('.note-delete').removeClass('show');
  };

  $scope.deleteNoteFirst = function ($event) {
    $event.stopPropagation();
    $($event.target).parent().parent().parent().addClass('reveal');
  }

  $scope.cancelDeleteNote = function () {
    $('.note-list-item-layer1').removeClass('reveal')
  };

  $scope.finalDeleteNote = function (note, $event) {
    dao.deleteNote(note).then(function () {
      var noteIndex;

      $scope.removeNoteFromList(note);
      $($event.target).parent().parent().css('display', 'block');
      if ($('.order-0').length > 0) {
        noteIndex = Utils.getIndexOfNote(parseInt($('.order-0').attr('note-id'), 10), $scope.notes);
        if (noteIndex >= 0) {
          $scope.currentNote = $scope.notes[noteIndex];
        } else {
          $scope.currentNote = { markdown: '' };
        }
      } else {
        $scope.currentNote = { markdown: '' };
      }
    }).catch(function (err) {
      console.log('ERROR');
      console.log(err);
    });

    $('.note-list-item-layer1').removeClass('reveal');
  }

  $scope.removeNoteFromList = function (delNote) {
    var length = $scope.notes.length,
        i;

    for (i = 0; i < length; i++) {
      if ($scope.notes[i].id === delNote.id) {
        $scope.notes.splice(i, 1);
        break;
      }
    }

    // Force angular digest to avoid weird rendering issue where the list item
    // was only removed after moving the mouse. (Again probably a better way
    // to accomplish this.)
    $rootScope.$digest();
  };
}
ctrl.$inject = ['$scope', '$rootScope'];

function link($scope, $element) {
  !function () {
    setMenuListHeight();

    $(window).on('resize', function () {
      setMenuListHeight();
    });
  }()
}
link.$inject = ['$scope', '$element'];

function setMenuListHeight() {
  var height = $(window).height() - $('.header-wrapper').height() - 
        $('.list-btn-wrapper').height();

  if (height < 50) {
    height = 50;
  }

  $('.note-list').css('height', height + 'px');
}