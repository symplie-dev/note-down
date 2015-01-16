'use strict';

module.exports = function() {
  return {
    restrict: 'EA',
    scope: {
      note: '='
    },
    templateUrl: '/views/partials/md-editor.html',
    controller: ctrl,
    link: function ($scope, $element) { }
  };
};

function ctrl($scope) { }