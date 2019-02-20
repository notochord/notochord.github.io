import * as idb from 'idb';

if (!('indexedDB' in window)) {
  throw new Error('This browser does not support IndexedDB');
}

const BLUE_SKIES = {
  'title': 'Blue Skies',
  'composer': 'Irving Berlin',
  'timeSignature': [4,4],
  'key': 'C',
  'measures': [
    {
      'beats': ['A-'], // The first beat of every measure must be set.
      'repeatStart': true,
      'maxRepeats': 1
    },
    {
      'beats': ['E']
    },
    {
      'beats': ['A-7']
    },
    {
      'beats': ['A-6']
    },
    {
      'beats': ['CM7', undefined, 'A7']
    },
    {
      'beats': ['D-7', undefined, 'G7']
    },
    {
      'beats': ['C6'],
      'ending': 1
    },
    {
      'beats': ['Bdim', undefined, 'E7'],
      'repeatEnd': true,
      'ending': 1
    },
    {
      'beats': ['C6'],
      'ending': 2
    },
    {
      'beats': ['C6'],
      'ending': 2
    }
  ]
};

// because IDBObserver isn't standardized yet
const observers = [];
export function observe(cb) {
  observers.push(cb);
}

const dbPromise = idb.openDb('songDB', 1, upgradeDb => {
  if (!upgradeDb.objectStoreNames.contains('songs')) {
    let songs = upgradeDb.createObjectStore('songs', {keyPath: 'uid', autoIncrement:true});
    songs.put(BLUE_SKIES);
  }
});

export async function getSong(uid) {
  const db = await dbPromise;
  const tx = db.transaction('songs', 'readonly');
  const store = tx.objectStore('songs');
  return store.get(uid);
}

export async function getAllSongs() {
  const db = await dbPromise;
  const tx = db.transaction('songs', 'readonly');
  const store = tx.objectStore('songs');
  return store.getAll();
}

export async function putSong(data, uid) {
  const db = await dbPromise;
  const tx = db.transaction('songs', 'readwrite');
  const store = tx.objectStore('songs');
  store.put(data, uid);
  observers.forEach(observer => observer(data));
  return tx.complete;
}

// @todo do we want to delete songs? nahh our users don't make mistakes