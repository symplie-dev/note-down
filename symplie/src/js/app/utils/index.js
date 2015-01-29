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

Utils.getCwsLicense = function () {
  var deferred = Q.defer(),
      req   = new XMLHttpRequest();

  Utils.getAuthToken().then(function (token) {
    req.open('GET', Constants.CwsLicense.LICENSE_API_URL + chrome.runtime.id);
    req.setRequestHeader('Authorization', 'Bearer ' + token);
    req.onreadystatechange = function() {
      if (req.readyState == 4) {
        deferred.resolve(JSON.parse(req.responseText));
      }
    }
    req.send();
  }).catch(function (err) {
    console.log('ERROR!');
    console.log(err);
    deferred.reject(err);
  });

  return deferred.promise;
};

Utils.verifyLicense = function (license) {
  var licenseStatus,
      daysAgoLicenseIssued;

  if (license.result && license.accessLevel == Constants.CwsLicense.FULL) {
    console.log("Fully paid & properly licensed.");
    licenseStatus = "FULL";
  } else if (license.result && license.accessLevel == Constants.CwsLicense.FREE_TRIAL) {
    daysAgoLicenseIssued = Date.now() - parseInt(license.createdTime, 10);
    daysAgoLicenseIssued = daysAgoLicenseIssued / 1000 / 60 / 60 / 24;
    if (daysAgoLicenseIssued <= Constants.CwsLicense.FREE_TRIAL_LENGTH) {
      console.log("Free trial, still within trial period");
      licenseStatus = "FREE_TRIAL";
    } else {
      console.log("Free trial, trial period expired.");
      licenseStatus = "FREE_TRIAL_EXPIRED";
      $('.pop-up-wrapper').css('display', 'table');
    }
  } else {
    console.log("No license ever issued.");
    licenseStatus = Constants.CwsLicense.NONE;
    $('.pop-up-wrapper').css('display', 'table');
  }
};

module.exports = Utils;