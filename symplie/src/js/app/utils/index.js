'use strict';

var Q         = require('q'),
    Constants = require('../constants'),
    Utils     = {};

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
    var daysAgoLicenseCached;

    if (cachedLicense && cachedLicense.cachedAt) {
      daysAgoLicenseCached = Date.now() - parseInt(cachedLicense.cachedAt, 10);
      daysAgoLicenseCached = daysAgoLicenseCached / 1000 / 60 / 60 / 24;

      if (cachedLicense.accessLevel === Constants.CwsLicense.FULL &&
          daysAgoLicenseCached <= Constants.CwsLicense.FULL_CACHE_LENGTH) {
        Utils.verifyLicense($scope, cachedLicense);
      } else if (cachedLicense.accessLevel === Constants.CwsLicense.FREE_TRIAL &&
          daysAgoLicenseCached <= Constants.CwsLicense.TRIAL_CACHE_LENGTH) {
        Utils.verifyLicense($scope, cachedLicense);
      } else {
        Utils.refreshLicense($scope, interactive).then(function (license) {
          Utils.verifyLicense($scope, license);
        });
      }
    } else {
      Utils.refreshLicense($scope, interactive).then(function (license) {
        Utils.verifyLicense($scope, license);
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
    }
    req.send();
  }).catch(function (err) {
    Utils.signInNotification($scope);
    deferred.reject();
  });

  return deferred.promise;
};

Utils.verifyLicense = function ($scope, license) {
  var licenseStatus,
      daysAgoLicenseIssued;

  if (license.result && license.accessLevel == Constants.CwsLicense.FULL) {
    console.log('Full license. Thank you!')
  } else if (license.result && license.accessLevel == Constants.CwsLicense.FREE_TRIAL) {
    daysAgoLicenseIssued = Date.now() - parseInt(license.createdTime, 10);
    daysAgoLicenseIssued = daysAgoLicenseIssued / 1000 / 60 / 60 / 24;
    if (daysAgoLicenseIssued <= Constants.CwsLicense.FREE_TRIAL_LENGTH) {
      console.log('Free trial.');
    } else {
      console.log('Free trial expired.');
      Utils.trialExpiredNotification($scope);
    }
  } else {
    console.log('No license found.');
    Utils.trialExpiredNotification($scope);
  }

  return licenseStatus;
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

Utils.signInNotification = function ($scope) {
  $scope.$apply(function () {
    $scope.popUpTitle     = Constants.SignInCopy.TITLE;
    $scope.popUpMessage   = Constants.SignInCopy.MESSAGE;
    $scope.popUpOkBtn     = Constants.SignInCopy.OK_BTN;
    $scope.popUpCancelBtn = Constants.SignInCopy.CANCEL_BTN;
    // Recheck in the license in interactive mode so that the user can sign in.
    $scope.popUpOkAction  = function () { Utils.checkCwsLicense($scope, true); };
    $('.pop-up-wrapper').css('display', 'table');
  });
};

Utils.trialExpiredNotification = function ($scope) {
  $scope.$apply(function () {
    $scope.popUpTitle        = Constants.LicenceCopy.TITLE;
    $scope.popUpMessage      = Constants.LicenceCopy.MESSAGE;
    $scope.popUpOkBtn        = Constants.LicenceCopy.OK_BTN;
    $scope.popUpCancelBtn    = Constants.LicenceCopy.CANCEL_BTN;
    $scope.popUpOkAction     = $scope.goToChromeWebStore;
    $scope.popUpCancelAction = $scope.exportNotesAsJson;
    $('.pop-up-wrapper').css('display', 'table');
  });
};

module.exports = Utils;