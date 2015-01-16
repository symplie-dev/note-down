'use strict';

var Constants = {};

Constants.EMPTY_STRING = '';
Constants.MD_BREAK = '\n\n';

Constants.SymplieState                = {};
Constants.SymplieState.VIEW           = 'view';
Constants.SymplieState.CHOOSE_ELEMENT = 'choose-element';
Constants.SymplieState.NEW_ELEMENT    = 'new-element';
Constants.SymplieState.MARKDOWN       = 'markdown';

Constants.SymplieElement           = {};
Constants.SymplieElement.TODO      = 'to-do';
Constants.SymplieElement.PARAGRAPH = 'paragraph';
Constants.SymplieElement.BULLET    = 'bullet';

Constants.Octicon          = {};
Constants.Octicon.CHECK    = 'octicon-check';
Constants.Octicon.DOT      = 'octicon-primitive-dot';
Constants.Octicon.EYE      = 'octicon-eye';
Constants.Octicon.MARKDOWN = 'octicon-markdown';
Constants.Octicon.PENCIL   = 'octicon-pencil';
Constants.Octicon.PLUS     = 'octicon-plus';

Constants.Markdown = {}
Constants.Markdown.BULLET_LIST = '* ';
Constants.Markdown.TODO_LIST = '* [ ] ';

module.exports = Constants;