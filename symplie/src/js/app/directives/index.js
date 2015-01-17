'use strict';

var app = angular.module('SymplieApp');

app.directive('sympliemenu', require('./symplie-menu'));
app.directive('sympliebtn', require('./symplie-btn'));
app.directive('mdEditor', require('./md-editor'));
app.directive('mdViewer', require('./md-viewer'));