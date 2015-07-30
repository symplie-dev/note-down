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
      innerBtnOcticon: '=',
      notepadState:    '='
    },
    templateUrl: '/views/partials/md-viewer.html',
    link: link
  };
};

function ctrl($scope) { }
ctrl.$inject = ['$scope'];

function link($scope, $element) {
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
    if (matches[taskNum]) {
      completed = matches[taskNum].replace(/(^\s*[*+-]\s+)(\[[x ]\])(\s*.*)/, function ($1, $2, $3, $4) {
        return $2 + '[x]' + $4;
      });

      $scope.$apply(function () {
        $scope.note.markdown = $scope.note.markdown.replace(matches[taskNum], completed);
      });
      dao.updateNote($scope.note);
    }
  });

  // Listen for clicks on completed tasks. Then change the underlying
  // markup to change the task to uncompleted
  $('.md-viewer').on('click', 'ul li.task.completed', function (evt) {
    var taskNum = getTaskNum($(evt.target)),
        completed,
        matches;

    matches = $scope.note.markdown.match(/^\s*[*+-]\s+\[[x ]\]\s*.*/gm) || [];
    if (matches[taskNum]) {
      completed = matches[taskNum].replace(/(^\s*[*+-]\s+)(\[[x ]\])(\s*.*)/, function ($1, $2, $3, $4) {
        return $2 + '[ ]' + $4;
      });

      $scope.$apply(function () {
        $scope.note.markdown = $scope.note.markdown.replace(matches[taskNum], completed);
      });
      dao.updateNote($scope.note);
    }
  });
}
link.$inject = ['$scope', '$element'];

function getTaskNum($elem) {
  return $('.md-viewer ul li.task').index($elem);
}