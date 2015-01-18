'use strict';

var Constants = require('../constants'),
    Q         = require('q'),
    SymplieDB = {};

  // Only supporting webkit for now (as this is a **chrome** extension). More
  // support to come... maybe
  window.indexedDB = window.indexedDB || window.webkitIndexedDB;
  window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
  window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;

SymplieDB.Constants = {};
SymplieDB.Constants.READ_ONLY  = 'readonly';
SymplieDB.Constants.READ_WRITE = 'readwrite';

SymplieDB.init = function (cb) {
  var dao,
      request = indexedDB.open('symplie', 1);

  cb = cb || function () {};

  request.onsuccess = function(evt) {
    dao = evt.target.result;
    cb();
  };

  request.onerror = function(evt) {
    console.log('Error opening IndexedDB');
    console.log(evt);
    cb();
  };

  request.onupgradeneeded = function(evt) {
    console.log('onupgradeneeded fired');

    var objStore;

    dao      = evt.target.result;
    objStore = dao.createObjectStore('notes', { autoIncrement: true });

    // Create an index to search notes by date of creation
    objStore.createIndex('createdAt', 'createdAt', { unique: false });
    // Create an index to search notes by date last updated
    objStore.createIndex('updatedAt', 'updatedAt', { unique: false });

    // Add the welcome note to the db
    objStore.transaction.oncomplete = function(event) {
      console.log('adding notes')
      // var notesObjStore = dao.transaction('notes', SymplieDB.Constants.READ_WRITE)
      //                        .objectStore('notes'),
      //     addRequest;

      // addRequest = notesObjStore.add({
      //   markdown:  Constants.WELCOME_NOTE,
      //   createdAt: Date.now(),
      //   updatedAt: Date.now()
      // });

      var newNoteTran = dao.transaction(['notes'], SymplieDB.Constants.READ_WRITE),
          newNoteObjStore ,
          request;
      
      newNoteTran.oncomplete = function() {
        console.log('transaction complete');
        SymplieDB.getNotes();
      };

      newNoteObjStore = newNoteTran.objectStore("notes");
      request = newNoteObjStore.add({
        markdown:  Constants.WELCOME_NOTE,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });

      request.onsuccess = function(event) {
        console.log('added note successfully')

        console.log(event.target.result)
        console.log(event);
        
        cb();
      };

      // addRequest.onsucess = function (evt) {
      //   console.log('added successfully')
      // };

      // addRequest.onerror = function (evt) {
      //   console.log('added failed');
      // };

      
    };

    dao.onerror = function(event) {
      alert("Database error: " + event.target.errorCode);
    };

    SymplieDB.dao = dao;
  };
};

SymplieDB.getAllItemsInStore = function (storeName, callback) {
  var tran  = SymplieDB.dao.transaction(storeName, SymplieDB.Constants.READ_ONLY),
      store = tran.objectStore(storeName),
      cursorRequest,
      items = [];

  tran.oncomplete = function(evt) {  
    callback(items);
  };

  cursorRequest = store.openCursor();

  cursorRequest.onerror = function(error) {
      console.log(error);
  };

  cursorRequest.onsuccess = function(evt) {                    
      var cursor = evt.target.result;

      console.log(cursor);

      if (cursor) {
          items.push(cursor.value);
          cursor.continue();
      }
  };
}

SymplieDB.getNotes = function (callback) {
  // SymplieDB.getAllItemsInStore('notes', callback);
  var objectStore = SymplieDB.dao.transaction("notes").objectStore("notes"),
      notes = [];

  objectStore.openCursor().onsuccess = function(event) {
    var cursor = event.target.result;
    if (cursor) {
      notes.push(cursor.value);
      cursor.continue();
    }
    else {
      console.log('notes:');
      console.log(notes);
    }
  };
}

// SymplieDB.insertNote = function (note) {
//   var tran     = SymplieDB.dao.transaction(["notes"], SymplieDB.Constants.READ_WRITE),
//       objStore = tran.objectStore("notes"),
//       request  = objStore.add(note);
// };

module.exports = SymplieDB;