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
      createElement:   '='
    },
    templateUrl: '/views/partials/md-viewer.html',
    link: function ($scope, $element) { }
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
      txt = txt + markdownBulletType + $(line).text() + '\n';
    });

    // Trim trailing newline
    txt = txt.slice(0, txt.length - 1);

    $('.textarea-wrapper').remove();

    $scope.note.markdown += ((lastChildIsList($('.md-viewer')))
        ? Constants.EMPTY_STRING
        : '\n'
      ) + txt;
    $scope.selectedElement = Constants.EMPTY_STRING;
    // Update model in DB
    dao.updateNote($scope.note);
  };
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