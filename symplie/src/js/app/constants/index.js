'use strict';

var Constants = {};

Constants.EMPTY_STRING  = '';
Constants.NEW_LINE      = '\n';
Constants.MD_BREAK      = '\n\n';
Constants.SPACE         = ' ';
Constants.TAB_TO_SPACES = '    ';

Constants.CHROME_WEB_STORE = 'https://chrome.google.com/webstore/detail/symplie/kjadigajmcobihfbbhmdeljohoccbejk';

Constants.DB_VERSION = 2;

Constants.CwsLicense                    = {};
Constants.CwsLicense.LICENSE_API_URL    = 'https://www.googleapis.com/chromewebstore/v1.1/userlicenses/';
Constants.CwsLicense.FULL               = 'FULL';
Constants.CwsLicense.FREE_TRIAL         = 'FREE_TRIAL';
Constants.CwsLicense.FREE_TRIAL_EXPIRED = 'FREE_TRIAL_EXPIRED';
Constants.CwsLicense.NONE               = 'NONE';
Constants.CwsLicense.FREE_TRIAL_LENGTH  = 7;             // 7 days
Constants.CwsLicense.FULL_CACHE_LENGTH  = 10;            // 10 days
Constants.CwsLicense.TRIAL_CACHE_LENGTH = 0.5; // 5 seconds
Constants.CwsLicense.INVALID_LOGIN      = 'OAuth2 request failed: Invalid credentials.';

Constants.Regex = {};
Constants.Regex.TASK = /^\s*\[[x ]\]\s*/gm;

Constants.SymplieState         = {};
Constants.SymplieState.MENU    = 'menu';
Constants.SymplieState.NOTEPAD = 'notepad';

Constants.NotepadState          = {};
Constants.NotepadState.VIEW     = 'view';
Constants.NotepadState.MARKDOWN = 'markdown';

Constants.SymplieElement        = {};
Constants.SymplieElement.HEADER = 'header';
Constants.SymplieElement.TASK   = 'task';
Constants.SymplieElement.BULLET = 'bullet';
Constants.SymplieElement.LINK   = 'link';
Constants.SymplieElement.QUOTE  = 'quote';
Constants.SymplieElement.CODE   = 'code';

Constants.Octicon          = {};
Constants.Octicon.CHECK    = 'octicon-check';
Constants.Octicon.DOT      = 'octicon-primitive-dot';
Constants.Octicon.EYE      = 'octicon-eye';
Constants.Octicon.MARKDOWN = 'octicon-markdown';
Constants.Octicon.PENCIL   = 'octicon-pencil';
Constants.Octicon.PLUS     = 'octicon-plus';

Constants.Markdown        = {}
Constants.Markdown.HEADER = '### ';
Constants.Markdown.BULLET = '* ';
Constants.Markdown.TASK   = '* [ ] ';
Constants.Markdown.QUOTE  = '> ';
Constants.Markdown.CODE   = '```language\n\n```\n';
Constants.Markdown.LINK   = '[text](address)';

Constants.KeyCode = {};
Constants.KeyCode.BACKSPACE   = 8;
Constants.KeyCode.TAB         = 9;
Constants.KeyCode.ENTER       = 13;
Constants.KeyCode.PAGE_UP     = 33;
Constants.KeyCode.PAGE_DOWN   = 34;
Constants.KeyCode.END         = 35;
Constants.KeyCode.HOME        = 36;
Constants.KeyCode.LEFT_ARROW  = 37;
Constants.KeyCode.RIGHT_ARROW = 38;
Constants.KeyCode.UP_ARROW    = 39;
Constants.KeyCode.DOWN_ARROW  = 40;
Constants.KeyCode.INSERT      = 45;
Constants.KeyCode.DELETE      = 46;

Constants.LicenceCopy            = {};
Constants.LicenceCopy.TITLE      = 'Trial Expired';
Constants.LicenceCopy.MESSAGE    = 'Although the trial period is unlimited, please purchase Symplie in the Chrome Web Store for continued use.';
Constants.LicenceCopy.OK_BTN     = 'Purchase';
Constants.LicenceCopy.CANCEL_BTN = 'Cancel';

Constants.InvalidCredentials            = {};
Constants.InvalidCredentials.TITLE      = 'Sign In';
Constants.InvalidCredentials.MESSAGE    = 'You must be signed into Chrome with the account you used to purchase Symplie. Go to chrome://chrome-signin to sign in.';
Constants.InvalidCredentials.OK_BTN     = null;
Constants.InvalidCredentials.CANCEL_BTN = 'Cancel';

Constants.SignInCopy            = {};
Constants.SignInCopy.TITLE      = 'Sign In';
Constants.SignInCopy.MESSAGE    = 'You\'re not signed into Chrome. Although the trial period is unlimited, please purchase Symplie in the Chrome Web Store for continued use.';
Constants.SignInCopy.OK_BTN     = 'Sign In';
Constants.SignInCopy.CANCEL_BTN = 'Cancel';

Constants.DEFAULT_SETTINGS = {
  'sort':              'updatedAt',
  'showMdBtns':        true,
  'showMdBtnTooltips': true,
  'editorFont':        'Source Code Pro',
  'theme':             Constants.EMPTY_STRING,
  'currentNoteId':     -1
}

Constants.WELCOME_NOTE = [
'#### Welcome to Symplie',
Constants.EMPTY_STRING,
'_Symplie is a lightweight, distraction-free notepad',
'powered by [Markdown][1]._',
Constants.EMPTY_STRING,
'If you\'re unfamiliar with Markdown, checkout this',
'[cheatsheet][2]. If you don\'t care what markdown is and',
'just want to take notes fast, click the edit button to',
'give quick access to common note taking elements (task',
'lists, bulleted lists and plain old text)',
Constants.EMPTY_STRING,
'![Quick edit button][3]',
Constants.EMPTY_STRING,
'---',
Constants.EMPTY_STRING,
'* **Create beautiful notes:** Symplie uses [GitHub\'s][4]',
'  clean and modern markdown styling.',
'* **Visually consistent:** Symplie organizes your notes',
'  in a consistent manner so you can focus on content.',
'* **Distraction free:** No ads or overly complex tool',
'  bars; just you and a simple note-taking surface.',
Constants.EMPTY_STRING,
'---',
Constants.EMPTY_STRING,
'_Because Symplie is powered by Markdown, you also have',
'the ability to include expressive code snippets with',
'syntax highlighting._',
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
'#### Editing an Example Note',
Constants.EMPTY_STRING,
'![Editing Note][5]',
Constants.EMPTY_STRING,
'---',
Constants.EMPTY_STRING,
'* [x] Download Symplie',
'* [ ] Write your first note with Symplie',
Constants.EMPTY_STRING,
'---',
Constants.EMPTY_STRING,
'###### Created by SYMPLIE',
Constants.EMPTY_STRING,
'[1]: http://daringfireball.net/projects/markdown/ "Markdown"',
'[2]: https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet "Cheatsheet"',
'[3]: https://31.media.tumblr.com/27e6735c01e1b534a10dc70fb0f3501a/tumblr_inline_nir9kqKlNJ1sx0sfq.gif "Quick Edit"',
'[4]: https://github.com/ "GitHub"',
'[5]: https://31.media.tumblr.com/444d12729dc6a5e814253ea6a44aa79c/tumblr_inline_nira1bnOjt1sx0sfq.gif "Example Edit"'
].join(Constants.NEW_LINE);

module.exports = Constants;