'use strict';

var Q         = require('q'),
    Constants = require('../constants'),
    Utils     = {};

/* Licensing
------------------------------------------------------------------------------*/
  Utils.getAuthToken = function (interactive) {
    var deferred = Q.defer();

    chrome.identity.getAuthToken({ interactive: interactive }, function (token) {
      if (chrome.runtime.lastError) {
        deferred.reject(chrome.runtime.lastError);
      } else {
        deferred.resolve(token);
      }
    });

    return deferred.promise;
  };

  Utils.checkCwsLicense = function ($scope, interactive) {
    Utils.getCachedCwsLicense().then(function (cachedLicense) {
      var daysAgoLicenseCached,
          status;

      if (cachedLicense && cachedLicense.cachedAt) {
        daysAgoLicenseCached = Date.now() - parseInt(cachedLicense.cachedAt, 10);
        daysAgoLicenseCached = daysAgoLicenseCached / 1000 / 60 / 60 / 24;

        if (cachedLicense.accessLevel === Constants.CwsLicense.FULL &&
            daysAgoLicenseCached <= Constants.CwsLicense.FULL_CACHE_LENGTH) {
          status = Utils.verifyLicense($scope, cachedLicense);
        } else if (cachedLicense.accessLevel === Constants.CwsLicense.FREE_TRIAL &&
            daysAgoLicenseCached <= Constants.CwsLicense.TRIAL_CACHE_LENGTH) {
          status = Utils.verifyLicense($scope, cachedLicense);

          // If the free trial has expired refresh license to make sure user hasn't
          // made purchase after old trial license was cached.
          if (status === Constants.CwsLicense.FREE_TRIAL_EXPIRED) {
            Utils.refreshLicense($scope, interactive).then(function (license) {
              status = Utils.verifyLicense($scope, license);
              Utils.licenseNotification($scope, status);
            });
          }
        } else {
          Utils.refreshLicense($scope, interactive).then(function (license) {
            status = Utils.verifyLicense($scope, license);
            Utils.licenseNotification($scope, status);
          });
        }
      } else {
        Utils.refreshLicense($scope, interactive).then(function (license) {
          status = Utils.verifyLicense($scope, license);
          Utils.licenseNotification($scope, status);
        });
      }
    });
  };

  Utils.refreshLicense = function ($scope, interactive) {
    var deferred = Q.defer(),
        req   = new XMLHttpRequest()

    Utils.getAuthToken(interactive).then(function (token) {
      req.open('GET', Constants.CwsLicense.LICENSE_API_URL + chrome.runtime.id);
      req.setRequestHeader('Authorization', 'Bearer ' + token);
      req.onreadystatechange = function() {
        var license;

        if (req.readyState == 4) {
          license = JSON.parse(req.responseText);
          Utils.cacheCwsLicense(license);
          deferred.resolve(license);
        }
      };
      req.send();
    }).catch(function (err) {
      if (err.message === Constants.CwsLicense.INVALID_LOGIN) {
        Utils.signInCredentialsNotification($scope);
      } else {
        Utils.signInNotification($scope);
      }
      deferred.reject();
    });

    return deferred.promise;
  };

  Utils.verifyLicense = function ($scope, license) {
    var licenseStatus,
        daysAgoLicenseIssued;

    if (license.result && license.accessLevel == Constants.CwsLicense.FULL) {
      console.log('Full license. Thank you!');
      licenseStatus = Constants.CwsLicense.FULL;
    } else if (license.result && license.accessLevel == Constants.CwsLicense.FREE_TRIAL) {
      daysAgoLicenseIssued = Date.now() - parseInt(license.createdTime, 10);
      daysAgoLicenseIssued = daysAgoLicenseIssued / 1000 / 60 / 60 / 24;
      if (daysAgoLicenseIssued <= Constants.CwsLicense.FREE_TRIAL_LENGTH) {
        console.log('Free trial.');
        licenseStatus = Constants.CwsLicense.FREE_TRIAL;
      } else {
        console.log('Free trial expired.');
        licenseStatus = Constants.CwsLicense.FREE_TRIAL_EXPIRED;
      }
    } else {
      console.log('No license found.');
      licenseStatus = Constants.CwsLicense.NONE;
    }

    return licenseStatus;
  };

  Utils.licenseNotification = function ($scope, status) {
    if (status === Constants.CwsLicense.FREE_TRIAL_EXPIRED ||
        status === Constants.CwsLicense.NONE) {
      Utils.trialExpiredNotification($scope);
    }
  };

  Utils.cacheCwsLicense = function (license) {
    var deferred = Q.defer();

    license.cachedAt = Date.now();

    chrome.storage.sync.set({'SymplieCwsLicense': license}, function () {
      deferred.resolve();
    });

    return deferred.promise;
  };

  Utils.getCachedCwsLicense = function () {
    var deferred = Q.defer();

    chrome.storage.sync.get('SymplieCwsLicense', function (items) {
      deferred.resolve(items.SymplieCwsLicense);
    });

    return deferred.promise;
  };

/* Pop-Up Notifications
------------------------------------------------------------------------------*/
  Utils.signInCredentialsNotification = function ($scope) {
    $scope.$apply(function () {
      $scope.popUpTitle     = Constants.InvalidCredentials.TITLE;
      $scope.popUpMessage   = Constants.InvalidCredentials.MESSAGE;
      $scope.popUpOkBtn     = Constants.InvalidCredentials.OK_BTN;
      $scope.popUpCancelBtn = Constants.InvalidCredentials.CANCEL_BTN;
      $scope.popUpCancelAction = $scope.closePopUp;
      // Recheck in the license in interactive mode so that the user can sign in.
      $('.notification-pop-up.pop-up-wrapper').css('display', 'table');
      Utils.deblurPopUp();
    });
  };

  Utils.signInNotification = function ($scope) {
    $scope.$apply(function () {
      $scope.popUpTitle     = Constants.SignInCopy.TITLE;
      $scope.popUpMessage   = Constants.SignInCopy.MESSAGE;
      $scope.popUpOkBtn     = Constants.SignInCopy.OK_BTN;
      $scope.popUpCancelBtn = Constants.SignInCopy.CANCEL_BTN;
      // Recheck in the license in interactive mode so that the user can sign in.
      $scope.popUpOkAction  = function () { Utils.checkCwsLicense($scope, true); };
      $scope.popUpCancelAction = $scope.closePopUp;
      $('.notification-pop-up.pop-up-wrapper').css('display', 'table');
      Utils.deblurPopUp();
    });
  };

  Utils.trialExpiredNotification = function ($scope) {
    $scope.$apply(function () {
      $scope.popUpTitle        = Constants.LicenceCopy.TITLE;
      $scope.popUpMessage      = Constants.LicenceCopy.MESSAGE;
      $scope.popUpOkBtn        = Constants.LicenceCopy.OK_BTN;
      $scope.popUpCancelBtn    = Constants.LicenceCopy.CANCEL_BTN;
      $scope.popUpOkAction     = $scope.goToChromeWebStore;
      $scope.popUpCancelAction = $scope.closePopUp;
      $('.notification-pop-up.pop-up-wrapper').css('display', 'table');
      Utils.deblurPopUp();
    });
  };

  Utils.deblurPopUp = function () {
    setTimeout(function () {
      $('.pop-up-wrapper').css('-webkit-transform' , 'translate3d(0,0,0)')
                          .css('transform', 'translate3d(0,0,0)');
      $('.pop-up-wrapper *').css('-webkit-transform' , 'translate3d(0,0,0)')
                            .css('transform', 'translate3d(0,0,0)');
    }, 1000);
  };

/* Misc
------------------------------------------------------------------------------*/
  /**
   * Return the indexs in the notes array of the note with the given id.
   *
   * @param {Number} id The id of the note
   */
  Utils.getIndexOfNote = function (id, notes) {
    var noteIndex = -1;

    notes.forEach(function (note, index) {
      if (note.id === id) {
        noteIndex = index;
        return;
      }
    });

    return noteIndex;
  };
module.exports = Utils;