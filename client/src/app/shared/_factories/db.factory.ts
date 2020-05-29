// @ts-ignore
import PouchDB from 'pouchdb';
// @ts-ignore
import PouchDBFind from 'pouchdb-find';
import * as cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';
import * as PouchDBUpsert from 'pouchdb-upsert';
import debugPouch from 'pouchdb-debug';
PouchDB.plugin(debugPouch);
PouchDB.plugin(PouchDBFind);
PouchDB.plugin(PouchDBUpsert);
PouchDB.plugin(cordovaSqlitePlugin);
PouchDB.plugin(window['PouchReplicationStream'].plugin);
PouchDB.adapter('writableStream', window['PouchReplicationStream'].adapters.writableStream);
PouchDB.defaults({auto_compaction: true, revs_limit: 1});

const OPEN_DATABASE_FLAGS = 6

export function DB(name, key = ''):PouchDB {

  function openCallback (connectionId) {
    console.log('open connection id: ' + connectionId)
  }

  function errorCallback (e) {
    console.log('UNEXPECTED SQLitePlugin ERROR: ' + e)
  }

  let pouchDBOptions = <any>{};
  if (window['isCordovaApp'] && window['sqlitePlugin'] && !localStorage.getItem('ran-update-v3.8.0')) {
    pouchDBOptions = {
      adapter: 'cordova-sqlite',
      location: 'default',
      androidDatabaseImplementation: 2
    };
    if (key) {
      pouchDBOptions.key = key
    }
  }
  return new PouchDB(name, pouchDBOptions);
}


