// // indexedDb.js
// const DB_NAME = 'fileStorageDB';
// const DB_VERSION = 1;
// const STORE_NAME = 'files';

// export const openDb = () => {
//   return new Promise((resolve, reject) => {
//     const request = indexedDB.open(DB_NAME, DB_VERSION);

//     request.onerror = (event) => {
//       console.error('IndexedDB error:', event.target.errorCode);
//       reject('IndexedDB error');
//     };

//     request.onsuccess = (event) => {
//       resolve(event.target.result);
//     };

//     request.onupgradeneeded = (event) => {
//       const db = event.target.result;
//       if (!db.objectStoreNames.contains(STORE_NAME)) {
//         db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
//       }
//     };
//   });
// };

// export const addFile = async (file) => {
//   const db = await openDb();
//   return new Promise((resolve, reject) => {
//     const transaction = db.transaction([STORE_NAME], 'readwrite');
//     const store = transaction.objectStore(STORE_NAME);
//     const request = store.add({ name: file.name, type: file.type, data: file });

//     request.onsuccess = () => resolve('File added successfully');
//     request.onerror = (event) => reject('Error adding file: ' + event.target.errorCode);
//   });
// };

// export const getFiles = async () => {
//   const db = await openDb();
//   return new Promise((resolve, reject) => {
//     const transaction = db.transaction([STORE_NAME], 'readonly');
//     const store = transaction.objectStore(STORE_NAME);
//     const request = store.getAll();

//     request.onsuccess = () => resolve(request.result);
//     request.onerror = (event) => reject('Error getting files: ' + event.target.errorCode);
//   });
// };

// src/db.js
import { openDB } from 'idb';

export const initDB = async () => {
  return openDB('PdfDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('pdfs')) {
        db.createObjectStore('pdfs', { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

export const savePDF = async (file) => {
  const db = await initDB();
  await db.add('pdfs', { file });
};

export const getAllPDFs = async () => {
  const db = await initDB();
  return await db.getAll('pdfs');
};
