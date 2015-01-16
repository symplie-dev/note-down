'use strict';

var app = angular.module('SymplieApp');

app.directive('symplieBtn', require('./symplie-btn'));
// app.directive('symplieInput', require('./symplie-input'));
app.directive('mdEditor', require('./md-editor'));
app.directive('mdViewer', require('./md-viewer'));