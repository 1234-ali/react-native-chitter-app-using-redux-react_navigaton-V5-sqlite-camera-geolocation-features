import SQLite  from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({
  name: 'drafts.db',
  // location: '~www/drafts.db',
  // createFromLocation : '~www/drafts.db'
});

export const init = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql( 
          'CREATE TABLE IF NOT EXISTS drafts (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, imageUri TEXT NOT NULL, date TEXT NOT NULL);',
        [],
        () => {
          resolve(res);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  console.log(promise)
  return promise;
};

export const insertDraft = (title, imageUri, date) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {
          tx.executeSql(
            `INSERT INTO drafts (title, imageUri, date) VALUES (?, ?, ?);`,
            [title, imageUri, date],
            (_, result) => {
              console.log(_);
              resolve(result);
              // console.log(_);
              
            },
            (_, err) => {
              reject(err);
              console.log(err)
            }
          );
        });
    });

    return promise;
};

export const fetchDraft = () => {
    const promise = new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM drafts',
          [],
          (_, result) => {
            resolve(result);
          },
          (_, err) => {
            reject(err);
          }
        );
      });
    });

    return promise;
};