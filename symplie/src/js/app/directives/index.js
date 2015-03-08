'use strict';

var app = angular.module('SymplieApp');

app.directive('sympliemenu', require('./symplie-menu'));
app.directive('newnotebtn', require('./new-note-btn'));
app.directive('sympliebtn', require('./symplie-btn'));
app.directive('mdEditor', require('./md-editor'));
app.directive('mdViewer', require('./md-viewer'));
app.directive('popUp', require('./pop-up'));
app.directive('settingsPopUp', require('./settings-pop-up'));