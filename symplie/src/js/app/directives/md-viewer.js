'use strict';

var Constants = require('../constants'),
    dao       = require('../database');

module.exports = function() {
  return {
    controller: ctrl,
    replace: true,
    restrict: 'EA',
    scope: {
      note:            '=',
      selectedElement: '=',
      createElement:   '=',
      unsaved:         '=',
      oldNoteContent:  '=',
      innerBtnOcticon: '=',
      notepadState:    '='
    },
    templateUrl: '/views/partials/md-viewer.html',
    link: function ($scope, $element) {
      $scope.enterPressed = false;
      // TODO: Known defect - if you have multiple identical tasks you will
      // run into issues because javascript .replace replaces first occurrence.

      
      // Listen for clicks on uncompleted tasks. Then change the underlying
      // markup to change the task to completed
      $('.md-viewer').on('click', 'ul li.task.uncompleted', function (evt) {
        var taskNum = getTaskNum($(evt.target)),
            completed,
            matches;

        matches = $scope.note.markdown.match(/^\s*[*+-]\s+\[[x ]\]\s*.*/gm) || [];
        completed = matches[taskNum].replace(/(^\s*[*+-]\s+)(\[[x ]\])(\s*.*)/, function ($1, $2, $3, $4) {
          return $2 + '[x]' + $4;
        });

        $scope.$apply(function () {
          $scope.note.markdown = $scope.note.markdown.replace(matches[taskNum], completed);
          $scope.oldNoteContent = $scope.note.markdown;
        });
        dao.updateNote($scope.note);
      });

      // Listen for clicks on completed tasks. Then change the underlying
      // markup to change the task to uncompleted
      $('.md-viewer').on('click', 'ul li.task.completed', function (evt) {
        var taskNum = getTaskNum($(evt.target)),
            completed,
            matches;

        matches = $scope.note.markdown.match(/^\s*[*+-]\s+\[[x ]\]\s*.*/gm) || [];
        completed = matches[taskNum].replace(/(^\s*[*+-]\s+)(\[[x ]\])(\s*.*)/, function ($1, $2, $3, $4) {
          return $2 + '[ ]' + $4;
        });

        $scope.$apply(function () {
          $scope.note.markdown = $scope.note.markdown.replace(matches[taskNum], completed);
          $scope.oldNoteContent = $scope.note.markdown;
        });
        dao.updateNote($scope.note);
      });

      $('.md-viewer').on('keyup', '.textarea', function (evt) {
        if (evt.which == 13) {
          if ($scope.enterPressed) {
            $scope.$apply(function () {
              $scope.notepadState = Constants.NotepadState.VIEW;
              $scope.innerBtnOcticon = Constants.Octicon.PENCIL;
              $scope.createElement();
              $scope.note.updatedAt = Date.now();
              $scope.oldNoteContent = $scope.note.markdown;
              $scope.enterPressed = false;
            });
          } else {
            $scope.enterPressed = true;
          }
        } else {
          $scope.enterPressed = false;
        }
      });
    }
  };
};

function ctrl($scope) {
  $scope.$watch('selectedElement', function () {
    $scope.createInput();
  });

  $scope.createInput = function () {
    switch ($scope.selectedElement) {
      case Constants.SymplieElement.PARAGRAPH:
        $scope.createParagraphInput();
        break;
      case Constants.SymplieElement.BULLET:
        $scope.createBulletInput();
        break;
      case Constants.SymplieElement.TODO:
        $scope.createToDoInput();
        break;
      default:
        break;
    }
  };


  $scope.createParagraphInput = function () {
    var newParagraph = '<div class="textarea" contentEditable="true"></div>';

    $('.md-viewer').append(newParagraph);
    $('.textarea').focus();
    $scope.unsaved = true;
  };

  $scope.createBulletInput = function () {
    var newList = [
        '<div class="textarea">',
          '<ul contentEditable="true">',
            '<li class="bullet first"><br/></li>',
          '</ul>',
        '</div>'].join(Constants.EMPTY_STRING);

    $('.md-viewer').append(newList);

    $('.textarea ul').focus();
    $scope.unsaved = true;
  };

  $scope.createToDoInput = function () {
    var newList = [
        '<div class="textarea">',
          '<ul contentEditable="true">',
            '<li class="task first"><br/></li>',
          '</ul>',
        '</div>'].join(Constants.EMPTY_STRING);

    $('.md-viewer').append(newList);

    $('.textarea ul').focus();
    $scope.unsaved = true;
  };

  $scope.createElement = function () {
    switch ($scope.selectedElement) {
      case Constants.SymplieElement.PARAGRAPH:
        $scope.addParagraphToMd();
        break;
      case Constants.SymplieElement.BULLET:
        $scope.addBulletListToMd();
        break;
      case Constants.SymplieElement.TODO:
        $scope.addToDoListToMd();
        break;
      default:
        console.log('ERROR: unknown state');
        break;
    }
  };

  $scope.addParagraphToMd = function () {
    var txt = $('.textarea').text();

    $('.textarea').remove();
    // Update in-memory variables
    $scope.note.markdown += Constants.MD_BREAK + txt;
    $scope.selectedElement = Constants.EMPTY_STRING;
    // Update model in DB
    dao.updateNote($scope.note);
    $scope.unsaved = false;
  };

  $scope.addBulletListToMd = function () {
    $scope.addListToMd(Constants.Markdown.BULLET_LIST);
  };

  $scope.addToDoListToMd = function () {
    $scope.addListToMd(Constants.Markdown.TODO_LIST);
  };

  $scope.addListToMd = function (markdownBulletType) {
    var txt       = Constants.EMPTY_STRING,
        $lines    = $('.textarea ul').children() || [],
        lineItems;

    // Add list items
    $.each($lines, function (index, line) {
      if ($(line).text().trim() !== Constants.EMPTY_STRING) {
        txt = txt + markdownBulletType + $(line).text() + '\n';
      }
    });

    // Trim trailing newline
    if (txt.length > 0) {
      txt = txt.slice(0, txt.length - 1);
    }

    $('.textarea').remove();

    $scope.note.markdown += ((lastChildIsList($('.md-viewer')))
        ? Constants.NEW_LINE
        : Constants.MD_BREAK
      ) + txt;
    $scope.selectedElement = Constants.EMPTY_STRING;
    // Update model in DB
    dao.updateNote($scope.note);
    $scope.unsaved = false;
  };

  $scope.markTaskComplete = function (taskNum) {
    console.log('task: ' + taskNum + ' complete');
  };

  $scope.markTaskUncomplete = function (taskNum) {
    console.log('task: ' + taskNum + ' uncomplete');
  }
}

function getFirstTextNode($elem) {
  var textNodes = $elem.contents().filter(function() {
    return this.nodeType === 3; // Node.TEXT_NODE
  });

  return $(textNodes[0]).text();
}

function lastChildIsList($elem) {
  if ($elem.children().length == 0) {
    return false;
  } else {
    return $elem.children().last().prop('tagName').toLowerCase() === 'ul';
  }
}

function getTaskNum($elem) {
  return $('.md-viewer ul li.task').index($elem);
}