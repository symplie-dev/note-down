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
    templateUrl: '/views/partials/symplie-btn.html'
  };
};

function ctrl($scope) {
  /**
   * When the center button is clicked, the notepadState must change. The next notepadState is
   * dependent on the current notepadState.
   */
  $scope.centerBtnHandler = function () {
    switch ($scope.notepadState) {
      case Constants.NotepadState.VIEW:
        $scope.notepadState = Constants.NotepadState.MARKDOWN;
        $scope.innerBtnOcticon = Constants.Octicon.EYE;
        $scope.focusMdEditor();
        break;
      case Constants.NotepadState.MARKDOWN:
        $scope.notepadState = Constants.NotepadState.VIEW;
        $scope.innerBtnOcticon = Constants.Octicon.PENCIL;
        $('.md-editor').focusout();
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
}
ctrl.$inject = ['$scope'];

function link($scope, $element) {
  centerSymplieBtn();

  !function () {
    $('.tooltipped').on('mouseenter', function (evt) {
      $('.tooltipped').removeClass('active');
      $(this).addClass('active');
    }).on('mouseleave', function (evt) {
      $('.tooltipped').removeClass('active');
    });

    $(window).on('resize', function () {
      centerSymplieBtn();

      if ($(window).width() > 749 &&
          $scope.symplieState === Constants.SymplieState.MENU) {
        $scope.$apply(function () {
          $scope.symplieState = Constants.SymplieState.NOTEPAD;
          $scope.notepadState = Constants.NotepadState.VIEW;
          $scope.innerBtnOcticon = Constants.Octicon.PENCIL;
        });
      }
    });
  }();
}
link.$inject = ['$scope', '$element'];

function centerSymplieBtn() {
  var $btnWrapper = $('.symplie-btn-wrapper'),
      left        = ($('.symplie-note-pnl').width() / 2) -
                      ($btnWrapper.width() / 2);

  if ($(window).width() > 749) {
    left += $('.symplie-menu-wrapper').width()
  }
  
  $btnWrapper.css('left', left + 'px');
}