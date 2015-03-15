'use strict';

var Constants = require('../constants'),
    dao       = require('../database'),
    Utils     = require('../utils');

var ctrl = function($scope, $location) {
  $scope.notes       = [];
  $scope.currentNote = null;
  $scope.settings    = Constants.DEFAULT_SETTINGS;

  dao.init().then(function () {
    dao.getNotes().then(function (notes) {
      $scope.$apply(function () {
        $scope.notes = notes;
        // Default to the newest note
        $scope.currentNote = $scope.notes[$scope.notes.length - 1];
      });
    }).catch(function (err) {
      console.log('Error: failed to get notes');
    });

    dao.getSettings().then(function (settings) {
      $scope.$apply(function () {
        $scope.settings = settings;
        
        var fullscreen = $location.search()['fullscreen'];

        if (fullscreen == 'true') {
          $('body').addClass('fullscreen');
        };
        
      });
    }).catch(function (err) {
      console.log('Error: failed to get settings');
    });
  }).catch(function (err) {
    console.log('init failed');
    console.log(err);
  });
  
  $scope.symplieState    = Constants.SymplieState.MENU;
  $scope.notepadState    = Constants.NotepadState.VIEW;
  $scope.inputState      = null;
  $scope.selectedElement = Constants.EMPTY_STRING;
  $scope.innerBtnOcticon = Constants.Octicon.PENCIL;
  $scope.unsaved         = false;

  $scope.backToMenu = function () {
    $scope.symplieState = Constants.SymplieState.MENU;
    $scope.notepadState = Constants.NotepadState.VIEW;
    $scope.innerBtnOcticon = Constants.Octicon.PLUS;
    $scope.selectedElement = Constants.EMPTY_STRING;
    $scope.unsaved = false;

    // $scope.currentNote.updatedAt = Date.now();
    // $scope.currentNote.updatedAt = Date.now();
    // dao.updateNote($scope.currentNote);

    // Make sure we haven't left any element inputs on the viewing panel
    $('.textarea').remove();
  };

  // Declarations of functions shared across directives
  $scope.createElement = function () {};
  $scope.addMarkdownElement = function () {};

  $scope.goToChromeWebStore = function () {
    var win = window.open(Constants.CHROME_WEB_STORE, '_blank');
    win.focus();
  };

  $scope.fullScreen = function () {
    chrome.tabs.create({ url: chrome.extension.getURL('views/index.html#/?fullscreen=true') });
  };

  $scope.exportNotesAsJson = function () {
    var jsonStr = JSON.stringify($scope.notes),
        // win = window.open('data:json;charset=utf-8,' + jsonStr, '_blank');
        win = window.open('data:application/json;' +
                (window.btoa
                  ? 'base64,' + btoa(jsonStr)
                  : jsonStr));

    win.focus();
  };

  $scope.closePopUp = function () {
    $('.pop-up-wrapper').css('display', 'none');
  };

  $scope.popUpTitle     = Constants.EMPTY_STRING;
  $scope.popUpMessage   = Constants.EMPTY_STRING;
  $scope.popUpOkBtn     = Constants.EMPTY_STRING;
  $scope.popUpCancelBtn = Constants.EMPTY_STRING;

  $scope.showSettingsPopUp = function () {
    $scope.popUpTitle        = 'Settings';
    $scope.popUpOkAction     = $scope.saveSettings;
    $scope.popUpCancelAction = $scope.closePopUp;
    $('.settings-pop-up.pop-up-wrapper').css('display', 'table');
    Utils.deblurPopUp();
  };

  $scope.saveSettings = function () {
    dao.updateSettings($scope.settings);
    $scope.closePopUp();
  };

  $scope.cancelSettingsUpdate = function () {
    dao.getSettings().then(function (settings) {
      $scope.$apply(function () {
        $scope.settings = settings;
      });
    }).catch(function (err) {
      console.log('Error: failed to get settings');
    });
    $scope.closePopUp();
  };

  // Asynchronously Check License
  setTimeout(function () {
    Utils.checkCwsLicense($scope);
  }, 1500);
};

ctrl.$inject = ['$scope', '$location'];

module.exports = ctrl;