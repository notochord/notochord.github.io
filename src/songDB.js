import * as idb from 'idb';
import Song from 'notochord-song';
import BlueSkiesSerialized from 'notochord-song/blueSkies.mjs';

if (!('indexedDB' in window)) {
  throw new Error('This browser does not support IndexedDB');
}

// because IDBObserver isn't standardized yet
const observers = [];
export function observe(cb) {
  observers.push(cb);
}
function notifyObservers() {
  observers.forEach(observer => observer());
}

const dbPromise = idb.openDb('songDB', 1, upgradeDb => {
  if (!upgradeDb.objectStoreNames.contains('songs')) {
    let songs = upgradeDb.createObjectStore('songs', {keyPath: 'uid', autoIncrement:true});
    songs.put(BlueSkiesSerialized);
  }
});

async function getStore(writeAccess) {
  const db = await dbPromise;
  const tx = db.transaction('songs', writeAccess ? 'readwrite' : 'readonly');
  return tx.objectStore('songs');
}

export async function getSong(uid) {
  const store = await getStore();
  const serialized = await store.get(uid);
  return new Song(serialized);
}

export async function getAllSongs() {
  const store = await getStore();
  const serialized = await store.getAll();
  return serialized.map(s => new Song(s));
}

export async function getAllKeys() {
  const store = await getStore();
  return store.getAllKeys();
}

export async function putSong(song) {
  const store = await getStore(true);
  const uid = store.put(song.serialize());
  if (!song.get('uid')) song.set('uid', uid);
  notifyObservers();
}

export async function putSongs(songs) {
  const store = await getStore(true);
  for(const song of songs) {
    const uid = store.put(song.serialize());
    if (!song.get('uid')) song.set('uid', uid);
  }
  notifyObservers();
}

export async function deleteSongs(uids) {
  const store = await getStore(true);
  for(const uid of uids) store.delete(uid);
  notifyObservers();
}

// @todo do we want to delete songs? nahh our users don't make mistakes