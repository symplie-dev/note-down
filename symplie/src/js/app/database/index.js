'use strict';

var Constants  = require('../constants'),
    Q          = require('q'),
    SymplieDao = {};


SymplieDao.Constants = {};
SymplieDao.Constants.READ_ONLY  = 'readonly';
SymplieDao.Constants.READ_WRITE = 'readwrite';

// Only supporting webkit for now (as this is a **chrome** extension). More
// support to come... maybe
window.indexedDB      = window.indexedDB      || window.webkitIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
window.IDBKeyRange    = window.IDBKeyRange    || window.webkitIDBKeyRange;

/* IndexedDB initialization
------------------------------------------------------------------------------*/
  SymplieDao.init = function () {
    var deferred      = Q.defer(),
        request       = indexedDB.open('symplie'),
        upgradeNeeded = false;

    request.onsuccess = function(evt) {
      // Only resolve if the onupgradeneeded event hasn't already fired
      if (!upgradeNeeded) {
        SymplieDao.onUpgradeNeeded(evt).then(function () {
          deferred.resolve();
        });
      }
    };

    request.onerror = function(evt) {
      console.log('Error opening IndexedDB');
      deferred.reject(evt);
    };

    request.onupgradeneeded = function(evt) {
      upgradeNeeded = true;
      
      SymplieDao.onUpgradeNeeded(evt).then(function () {
        deferred.resolve();
      });

      return evt;
    };

    return deferred.promise;
  };

  SymplieDao.onUpgradeNeeded = function (evt) {
    var deferred = Q.defer();

    SymplieDao.db = evt.target.result;

    if (evt.oldVersion < 1) {        // Create all stores
      SymplieDao.initSchema().then(function () {
        deferred.resolve();
      }).catch(function (err) {
        console.log('Error intializing db:');
        console.log(err);
        deferred.reject(err);
      });
    } else if (evt.oldVersion < 2) { // Create settings store
      SymplieDao.initSettingsStore().then(function () {
        deferred.resolve();
      }).catch(function (err) {
        console.log('Error migrating DB to version 2:');
        console.log(err);
        deferred.reject(err);
      });
    } else {
      deferred.resolve();
    }

    return deferred.promise;
  };

  SymplieDao.initSchema = function () {
    var deferred = new Q.defer();

    SymplieDao.initNotesStore().then(function () {
      var dbVersion = parseInt(SymplieDao.db.version),
          request;

      SymplieDao.db.close();
      request = indexedDB.open('symplie', 2);

      request.onupgradeneeded = function (evt) {
        SymplieDao.db = evt.target.result;
        SymplieDao.initSettingsStore().then(function() {
          deferred.resolve();
        }).catch(function(err) {
          console.log('Error intializing settings object store:')
          console.log(err);
        });
      };
    }).catch(function (err) {
      console.log('Error initializing schema:')
      console.log(err);
    });

    return deferred.promise;
  };

/* Note object store methods
------------------------------------------------------------------------------*/
  SymplieDao.initNotesStore = function () {
    var objStore = SymplieDao.db.createObjectStore('notes', { autoIncrement: true }),
        deferred = Q.defer();

    // Create an index on the unique identifier
    objStore.createIndex('id', 'id', { unique: true });
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

  SymplieDao.getNote = function (id) {
    var deferred = Q.defer();

    SymplieDao.db.transaction('notes').objectStore('notes').get(id).onsuccess = function(evt) {
      deferred.resolve(evt.target.result);
    };

    return deferred.promise;
  };

  SymplieDao.insertNote = function (note) {
    var deferred = Q.defer(),
        tran     = SymplieDao.db.transaction(['notes'], SymplieDao.Constants.READ_WRITE),
        objStore,
        request;
        
    tran.oncomplete = function (evt) {
      deferred.resolve(note);
    };

    tran.onerror = function (evt) {
      deferred.reject(evt);
    };

    objStore = tran.objectStore('notes');

    request = objStore.add(note);

    // Add the unique identifier ID to the newly inserted note. This id is a one
    // to one mapping with the auto-generated key for the object store. This way
    // we can update the notes in the future based on this key. (There is probably
    // a better way to do this... this cannot be the right way)
    request.onsuccess = function (evt) {
      note.id = evt.target.result;
      objStore.put(note, note.id);
    };

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
    var deferred = Q.defer(),
        tran     = SymplieDao.db.transaction(['notes'], SymplieDao.Constants.READ_WRITE),
        objStore,
        request;

    tran.oncomplete = function (evt) {
      deferred.resolve();
    };

    tran.onerror = function (evt) {
      deferred.reject(evt);
    };

    objStore = tran.objectStore('notes');

    objStore.put(note, note.id);

    return deferred.promise;
  };

  SymplieDao.deleteNote = function (note) {
    var deferred = Q.defer(),
        request = SymplieDao.db.transaction(['notes'], SymplieDao.Constants.READ_WRITE)
                  .objectStore('notes')
                  .delete(note.id);

    request.onsuccess = function(event) {
      deferred.resolve(note);
    };

    request.onerror = function (event) {
      deferred.reject(event);
    };

    return deferred.promise;
  };

/* Settings object store methods
------------------------------------------------------------------------------*/
  SymplieDao.initSettingsStore = function () {
    var objStore = SymplieDao.db.createObjectStore('settings', { autoIncrement: true }),
        deferred = Q.defer();

    objStore.transaction.oncomplete = function(event) {
      SymplieDao.insertSettings(Constants.DEFAULT_SETTINGS).then(function () {
        deferred.resolve();
      }).catch(function (err) {
        deferred.reject(err);
      });
    };

    return deferred.promise;
  };

  SymplieDao.insertSettings = function (settings) {
    var deferred = Q.defer(),
        tran     = SymplieDao.db.transaction(['settings'], SymplieDao.Constants.READ_WRITE),
        objStore,
        request;
        
    tran.oncomplete = function (evt) {
      deferred.resolve(settings);
    };

    tran.onerror = function (evt) {
      deferred.reject(evt);
    };

    objStore = tran.objectStore('settings');
    request  = objStore.add(settings);

    return deferred.promise;
  };

  SymplieDao.updateSettings = function (settings) {
    var deferred = Q.defer(),
        tran     = SymplieDao.db.transaction(['settings'], SymplieDao.Constants.READ_WRITE),
        objStore,
        request;

    tran.oncomplete = function (evt) {
      deferred.resolve();
    };

    tran.onerror = function (evt) {
      console.log('Error updating settings');
      console.log(evt);
      deferred.reject(evt);
    };

    objStore = tran.objectStore('settings');

    objStore.put(settings, 1);

    return deferred.promise;
  };

  SymplieDao.getSettings = function () {
    var deferred = Q.defer();

    SymplieDao.db.transaction('settings').objectStore('settings').get(1).onsuccess = function(evt) {
      deferred.resolve(evt.target.result);
    };

    return deferred.promise;
  }

module.exports = SymplieDao;