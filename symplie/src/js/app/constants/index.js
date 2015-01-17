'use strict';

var Constants = {};

Constants.EMPTY_STRING = '';
Constants.NEW_LINE = '\n';
Constants.MD_BREAK = '\n\n';

Constants.SymplieState         = {};
Constants.SymplieState.MENU    = 'menu';
Constants.SymplieState.NOTEPAD = 'notepad';

Constants.NotepadState                = {};
Constants.NotepadState.VIEW           = 'view';
Constants.NotepadState.CHOOSE_ELEMENT = 'choose-element';
Constants.NotepadState.NEW_ELEMENT    = 'new-element';
Constants.NotepadState.MARKDOWN       = 'markdown';

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

Constants.Markdown             = {}
Constants.Markdown.BULLET_LIST = '* ';
Constants.Markdown.TODO_LIST   = '* [ ] ';

Constants.WELCOME_NOTE = [
'#### Welcome to Symplie',
Constants.EMPTY_STRING,
'_Symplie is a lightweight, distraction-free notepad powered by [Markdown][1]._',
Constants.EMPTY_STRING,
'If you\'re unfamiliar with Markdown, checkout this [cheatsheet][2]. If you don\'t',
'care what markdown is and just want to take notes fast, click the edit button to',
'give quick access to common note taking elements (task lists, bulleted lists and',
'plain old text)',
Constants.EMPTY_STRING,
'---',
Constants.EMPTY_STRING,
'* **Create beautiful notes:** Symplie uses [GitHub\'s][3] clean and modern',
'markdown styling.',
'* **Visually consistent:** Symplie organizes your notes in a consistent manner',
'so you can focus on content.',
'* **Distraction free:** No ads or overly complex tool bars; just you and a',
'simple note-taking surface.',
Constants.EMPTY_STRING,
'---',
Constants.EMPTY_STRING,
'_Because Symplie is powered by Markdown, you also have the ability to include',
'expressive code snippets with syntax highlighting._',
Constants.EMPTY_STRING,
'```javascript',
'  !function () {',
'    // Print to console',
'    console.log(\'Symplie awesome!\');',
'  }',
'```',
Constants.EMPTY_STRING,
'---',
Constants.EMPTY_STRING,
'###### Created by SYMPLIE, 2014',
Constants.EMPTY_STRING,
'[1]: http://daringfireball.net/projects/markdown/ "Markdown"',
'[2]: https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet "Cheatsheet"',
'[3]: https://github.com/ "GitHub"'
].join(Constants.NEW_LINE);

module.exports = Constants;