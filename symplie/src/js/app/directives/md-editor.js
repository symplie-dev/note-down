'use strict';

var Constants = require('../constants'),
    cursorAlter = [Constants.KeyCode.PAGE_UP
                  ,Constants.KeyCode.PAGE_DOWN
                  ,Constants.KeyCode.END 
                  ,Constants.KeyCode.HOME
                  ,Constants.KeyCode.LEFT_ARROW
                  ,Constants.KeyCode.RIGHT_ARROW 
                  ,Constants.KeyCode.UP_ARROW 
                  ,Constants.KeyCode.DOWN_ARROW
                  ,Constants.KeyCode.INSERT];

module.exports = function() {
  return {
    replace: true,
    restrict: 'EA',
    scope: {
      note:               '=',
      addMarkdownElement: '=',
      unsaved:            '='
    },
    templateUrl: '/views/partials/md-editor.html',
    controller: ctrl,
    link: function ($scope, $element) { }
  };
};

function ctrl($scope) {
  $scope.tabAdvance     = false;
  $scope.tabAdvanceType = '';

  $scope.addMarkdownElement = function (type) {
    $scope.unsaved = true;
    
    switch (type) {
      case Constants.SymplieElement.HEADER:
        $scope.addHeader();
        break;
      case Constants.SymplieElement.BULLET:
        $scope.addListItem(Constants.Markdown.BULLET);
        break;
      case Constants.SymplieElement.TASK:
        $scope.addListItem(Constants.Markdown.TASK);
        break;
      case Constants.SymplieElement.LINK:
        $scope.addLink();
        break;
      case Constants.SymplieElement.QUOTE:
        $scope.addQuote();
        break;
      case Constants.SymplieElement.CODE:
        $scope.addCode();
        break;
      default:
        console.log('ERROR: Unknown Markdown element');
        break;
    }

    // Grab focus *after* the default behavior of the button click occurs
    setTimeout(function () {
      $('.md-editor').focus();
    }, 200);
  };

  $scope.cursorStart = function () {
    return $('.md-editor').caret();
  };

  $scope.addHeader = function () {
    var $input       = $('.md-editor'),
        pos          = $input.caret(),
        currMarkdown = $scope.note.markdown.replace(/[ \t\f\v]/gm, ''),
        txt          = $input.val(),
        preTxt       = txt.substring(0, pos),
        preLines     = prevLines(preTxt),
        txtToInsert  = Constants.EMPTY_STRING;

    if (preLines.currLine !== null &&
        preLines.currLine !== Constants.EMPTY_STRING) {
      txtToInsert += Constants.MD_BREAK;
    } else if (preLines.prevLine !== null &&
        preLines.prevLine !== Constants.EMPTY_STRING) {
      txtToInsert += Constants.NEW_LINE;
    }
    
    txtToInsert += Constants.Markdown.HEADER;

    $input.val(txt.slice(0,pos) + txtToInsert + txt.slice(pos, txt.length));
    $input.caret(pos + txtToInsert.length);
  };

  $scope.addListItem = function (type) {
    var $input = $('.md-editor'),
        pos = $input.caret(),
        txt    = $input.val(),
        block  = /(\n\n|^)[^]*?(?=($|\n\n))/g,
        preTxt = txt.substring(0, pos),
        list   = /^( *)([*+-]) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1[*+-] )\n*|\s*$)/,
        preLines = prevLines(preTxt),
        blocks,
        txtToInsert = '';

    blocks = preTxt.match(block) || [];
    
    if (blocks.length > 0) {
      if (list.test(blocks[blocks.length - 1].trim())) {
        if (preLines.currLine != null && preLines.currLine !== '') {
          txtToInsert += Constants.NEW_LINE;
        }
      } else {
        if (preLines.currLine != null && preLines.currLine !== '') {
          txtToInsert += Constants.MD_BREAK;
        } else if (preLines.prevLine != null && preLines.prevLine !== '') {
          txtToInsert += Constants.NEW_LINE;
        }
      }
    }
    
    txtToInsert += type;
    
    $input.val(txt.slice(0,pos) + txtToInsert + txt.slice(pos, txt.length));
    $input.caret(pos + txtToInsert.length);
  };

  $scope.addCode = function () {
    var $input = $('.md-editor'),
        pos = $input.caret(),
        txt    = $input.val(),
        preTxt = txt.substring(0, pos),
        preLines = prevLines(preTxt),
        txtToInsert = Constants.EMPTY_STRING,
        caretIncr = 3;

    if (preLines.currLine != null && preLines.currLine !== '') {
      txtToInsert += Constants.MD_BREAK;
      caretIncr += 2;
    } else if (preLines.prevLine != null && prevLines.prevLine !== '') {
      txtToInsert += Constants.NEW_LINE;
      caretIncr += 1;
    }

    txtToInsert += Constants.Markdown.CODE;

    $input.val(txt.slice(0, pos) + txtToInsert + txt.slice(pos, txt.length));
    $input.range(pos + caretIncr, pos + caretIncr + 'language'.length);

     $scope.tabAdvance = true;
    $scope.tabAdvanceType = 'code';
  };

  $scope.addLink = function () {
    var $input      = $('.md-editor'),
        pos         = $input.caret(),
        txt         = $input.val(),
        preTxt      = txt.substring(0, pos),
        postText    = txt.substring(pos),
        txtToInsert = Constants.Markdown.LINK,
        caretIncr   = 1;

    if (!(/(^|[^]*\s)$/.test(preTxt))) {
      txtToInsert = Constants.SPACE + txtToInsert;
      caretIncr += 1;
    }

    if (!/((^\s[^]*)|(^$))/.test(postText)) {
      txtToInsert += Constants.SPACE;
    }

    $input.val(txt.slice(0, pos) + txtToInsert + txt.slice(pos, txt.length));
    $input.range(pos + caretIncr, pos + caretIncr + 'text'.length);

    $scope.tabAdvance = true;
    $scope.tabAdvanceType = 'link';
  };

  $scope.addQuote = function () {
    var $input = $('.md-editor'),
        pos = $input.caret(),
        txt    = $input.val(),
        block  = /(\n\n|^)[^]*?(?=($|\n\n))/g,
        preTxt = txt.substring(0, pos),
        quote   = /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
        preLines = prevLines(preTxt),
        blocks,
        txtToInsert = '';

    blocks = preTxt.match(block) || [];
    
    if (blocks.length > 0) {
      if (quote.test(blocks[blocks.length - 1].trim())) {
        if (preLines.currLine != null && preLines.currLine !== '') {
          txtToInsert += Constants.NEW_LINE;
        }
      } else {
        if (preLines.currLine != null && preLines.currLine !== '') {
          txtToInsert += Constants.MD_BREAK;
        } else if (preLines.prevLine != null && preLines.prevLine !== '') {
          txtToInsert += Constants.NEW_LINE;
        }
      }
    }
    
    txtToInsert += Constants.Markdown.QUOTE;
    
    $input.val(txt.slice(0,pos) + txtToInsert + txt.slice(pos, txt.length));
    $input.caret(pos + txtToInsert.length);
  };

  $scope.handleKeyDown = function ($event) {
    if (cursorAlter.indexOf($event.keyCode) >= 0) {
      $scope.tabAdvance = false;
    } else {
      switch ($event.keyCode) {
        case Constants.KeyCode.TAB:
          console.log('tab')
          $scope.tab();
          $event.preventDefault();
          break;
        case Constants.KeyCode.BACKSPACE:
          $scope.unsaved = true;
          break;
        case Constants.KeyCode.DELETE:
          $scope.unsaved = true;
          $scope.tabAdvance = false;
          break;
        default:
          $scope.unsaved = true;
          break;
      }
    }
  };

  $scope.tab = function () {
    var $input = $('.md-editor'),
        txt    = txt = $input.val(),
        pos    = $input.range().end,
        start  = ($scope.tabAdvanceType === 'link')
                  ? ']('.length
                  : '\n'.length,
        end    = ($scope.tabAdvanceType === 'link')
                  ? '](address'.length
                  : start;

    if ($scope.tabAdvance) {
      $scope.tabAdvance = false;
      $input.range(pos + start, pos + end)
    }
  };
}

ctrl.$inject = ['$scope'];

function prevLines(str) {
  var lines = str.split(Constants.NEW_LINE),
      ret = {};
  
  if (lines.length > 0) {
      ret.currLine = lines[lines.length - 1].trim();
  } else {
      ret.currLine = null;
  }
  
  if (lines.length > 1) {
      ret.prevLine = lines[lines.length - 2].trim();
  } else {
      ret.prevLine = null;
  }
  
  return ret;
}