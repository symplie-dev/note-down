'use strict';

var Constants  = require('../constants'),
    Q          = require('q'),
    SymplieDao = {};


SymplieDao.Constants = {};
SymplieDao.Constants.READ_ONLY  = 'readonly';
SymplieDao.Constants.READ_WRITE = 'readwrite';

// Only supporting webkit for now (as this is a **chrome** extension). More
// support to come... maybe
window.indexedDB = window.indexedDB || window.webkitIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;

SymplieDao.init = function () {
  var deferred      = Q.defer(),
      request       = indexedDB.open('symplie', 1),
      upgradeNeeded = false;

  request.onsuccess = function(evt) {
    // Only resolve if the onupgradeneeded event hasn't already fired
    if (!upgradeNeeded) {
      SymplieDao.db = evt.target.result;
      deferred.resolve();
    }
  };

  request.onerror = function(evt) {
    console.log('Error opening IndexedDB');
    deferred.reject(evt);
  };

  request.onupgradeneeded = function(evt) {
    upgradeNeeded = true;
    SymplieDao.db = evt.target.result;
    SymplieDao.initSchema().then(function () {
      deferred.resolve();
    }).catch(function (err) {
      deferred.reject(err);
    });
    return evt;
  };

  return deferred.promise;
};

SymplieDao.initSchema = function () {
  var objStore = SymplieDao.db.createObjectStore('notes', { autoIncrement: true }),
      deferred = Q.defer();

  // Create an index to search notes by date of creation
  objStore.createIndex('createdAt', 'createdAt', { unique: false });
  // Create an index to search notes by date last updated
  objStore.createIndex('updatedAt', 'updatedAt', { unique: false });

  objStore.transaction.oncomplete = function(event) {
    SymplieDao.insertNote({
      markdown:  Constants.WELCOME_NOTE,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }).then(function () {
      deferred.resolve();
    }).catch(function (err) {
      deferred.reject(err);
    });
  };

  return deferred.promise;
};

SymplieDao.insertNote = function (note) {
  var deferred = Q.defer(),
      tran     = SymplieDao.db.transaction(['notes'], SymplieDao.Constants.READ_WRITE),
      objStore,
      request;
      
  tran.oncomplete = function (evt) {
    deferred.resolve();
  };

  tran.onerror = function (evt) {
    deferred.reject(evt)
  };

  objStore = tran.objectStore('notes');

  request = objStore.add(note);

  return deferred.promise;
};

SymplieDao.getNotes = function () {
  var deferred = Q.defer(),
      objectStore = SymplieDao.db.transaction("notes").objectStore("notes"),
      notes = [];

  objectStore.openCursor().onsuccess = function(event) {
    var cursor = event.target.result;
    
    if (cursor) {
      notes.push(cursor.value);
      cursor.continue();
    }
    else {
      deferred.resolve(notes);
    }
  };

  return deferred.promise;
};

SymplieDao.updateNote = function (note) {
  var deferred = Q.defer();

  return deferred.promise;
};

module.exports = SymplieDao;