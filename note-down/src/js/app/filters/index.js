'use strict';

var app = angular.module('SymplieApp');

app.filter('marked', require('./marked'));
app.filter('title', require('./title'));