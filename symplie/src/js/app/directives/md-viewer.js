'use strict';

var Constants = require('../constants');

module.exports = function() {
  return {
    controller: ctrl,
    replace: true,
    restrict: 'EA',
    scope: {
      note:            '=',
      selectedElement: '=',
      createElement:   '='
      // createParagraph: '=',
      // createBullet:    '=',
      // createToDo:      '='
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
        '<div class="textarea-wrapper">',
          '<div class="bullet-gutter">',
            '<div class="octicon octicon-primitive-dot bullet"></div>',
          '</div>',
          '<div class="textarea bullet-list" contentEditable="true"></div>',
        '</div>'].join(Constants.EMPTY_STRING);

    $('.md-viewer').append(newList);

    $('.textarea').on('keyup', function (evt) {
      var code =  evt.keyCode ? evt.keyCode : evt.which;

      if(code == 13) {
        $('.bullet-gutter').append('<div class="octicon octicon-primitive-dot bullet"></div>');
      } else if (code == 8 || code == 46) {
        console.log('backspace')
        console.log($('.bullet-gutter').children().length + ' -- ' + $('.textarea').children().length)
        if ($('.bullet-gutter').children().length - 1 > $('.textarea').children().length) {
          $('.bullet-gutter .bullet:last-child').remove();
        }
      }
    });

    $('.textarea').focus();
  };

  $scope.createToDoInput = function () {
    var newList = [
        '<div class="textarea-wrapper">',
          '<div class="bullet-gutter">',
            '<div class="checkbox"></div>',
          '</div>',
          '<div class="textarea bullet-list" contentEditable="true"></div>',
        '</div>'].join(Constants.EMPTY_STRING);

    $('.md-viewer').append(newList);

    $('.textarea').on('keyup', function (evt) {
      var code =  evt.keyCode ? evt.keyCode : evt.which;

      if(code == 13) {
        $('.bullet-gutter').append('<div class="checkbox"></div>');
      } else if (code == 8 || code == 46) {
        if ($('.bullet-gutter').children().length - 1 > $('.textarea').children().length) {
          $('.bullet-gutter .checkbox:last-child').remove();
        }
      }
    });

    $('.textarea').focus();
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

    $scope.note.markdown += Constants.MD_BREAK + txt;
    $scope.selectedElement = Constants.EMPTY_STRING;
  };

  $scope.addBulletListToMd = function () {
    $scope.addListToMd(Constants.Markdown.BULLET_LIST);
  };

  $scope.addToDoListToMd = function () {
    $scope.addListToMd(Constants.Markdown.TODO_LIST);
  };

  $scope.addListToMd = function (markdownBulletType) {
    var txt       = Constants.EMPTY_STRING,
        $lines    = $('.textarea').children() || [],
        lineItems;

    // Add list items contained in the DOM elements in our .textarea div
    $.each($lines, function (index, line) {
      var matches = $(line).text().match(/^(\s){2,}/) || [];

      if (matches.length > 0) {
        txt = txt + $(line).text() + '\n';
      } else {
        txt = txt + markdownBulletType + $(line).text() + '\n';
      }
    });

    // Add on first bullet that's not contained in a DOM element
    txt = markdownBulletType + getFirstTextNode($('.textarea')) +
      '\n' + txt;

    // Trim trailing newline
    txt = txt.slice(0, txt.length - 1);

    $('.textarea-wrapper').remove();

    $scope.note.markdown += ((lastChildIsList($('.md-viewer'))) ? '\n' : Constants.MD_BREAK) + txt;
    $scope.selectedElement = Constants.EMPTY_STRING;
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