'use strict';

var Q         = require('q'),
    Constants = require('../constants'),
    Utils     = {};

Utils.getAuthToken = function () {
  var deferred = Q.defer();

  chrome.identity.getAuthToken(function (token) {
    deferred.resolve(token);
  });

  return deferred.promise;
};

Utils.checkCwsLicense = function () {
  var deferred = Q.defer();

  Utils.getCachedCwsLicense().then(function (cachedLicense) {
    var daysAgoLicenseCached;

    if (cachedLicense && cachedLicense.cachedAt) {
      daysAgoLicenseCached = Date.now() - parseInt(cachedLicense.cachedAt, 10);
      daysAgoLicenseCached = daysAgoLicenseCached / 1000 / 60 / 60 / 24;

      if (cachedLicense.accessLevel === Constants.CwsLicense.FULL &&
          daysAgoLicenseCached <= Constants.CwsLicense.FULL_CACHE_LENGTH) {
        Utils.verifyLicense(cachedLicense);
      } else if (cachedLicense.accessLevel === Constants.CwsLicense.FREE_TRIAL &&
          daysAgoLicenseCached <= Constants.CwsLicense.TRIAL_CACHE_LENGTH) {
        Utils.verifyLicense(cachedLicense);
      } else {
        Utils.refreshLicense().then(function (license) {
          Utils.verifyLicense(license);
        });
      }
    } else {
      Utils.refreshLicense().then(function (license) {
        Utils.verifyLicense(license);
      });
    }
  });

  return deferred.promise;
};

Utils.refreshLicense = function () {
  var deferred = Q.defer(),
      req   = new XMLHttpRequest()

  Utils.getAuthToken().then(function (token) {
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
    console.log(err);
    deferred.reject(err);
  });

  return deferred.promise;
};

Utils.verifyLicense = function (license) {
  var licenseStatus,
      daysAgoLicenseIssued;

  if (license.result && license.accessLevel == Constants.CwsLicense.FULL) {
    // Full license
  } else if (license.result && license.accessLevel == Constants.CwsLicense.FREE_TRIAL) {
    daysAgoLicenseIssued = Date.now() - parseInt(license.createdTime, 10);
    daysAgoLicenseIssued = daysAgoLicenseIssued / 1000 / 60 / 60 / 24;
    if (daysAgoLicenseIssued <= Constants.CwsLicense.FREE_TRIAL_LENGTH) {
      // Free Trial
    } else {  // Free trial expired
      $('.pop-up-wrapper').css('display', 'table');
    }
  } else {  // No license found
    $('.pop-up-wrapper').css('display', 'table');
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

module.exports = Utils;