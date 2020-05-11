import SQLite  from 'react-native-sqlite-storage';
SQLite.DEBUG(true);
SQLite.enablePromise(true);

export const init = () => {
  let db;
  return new Promise((resolve) => {
    console.log("Plugin integrity check ...");
    SQLite.echoTest()
      .then(() => {
        console.log("Integrity check passed ...");
        console.log("Opening database ...");
        SQLite.openDatabase(
          'drafts.db',
          '1.0',
          'SQLite React Offline Database',
          '200000'
        )
          .then(DB => {
            db = DB;
            console.log("Database OPEN");
            db.executeSql('SELECT 1 FROM drafts LIMIT 1').then(() => {
                console.log("Database is ready ... executing query ...");
            }).catch((error) =>{
                console.log("Received error: ", error);
                console.log("Database not yet ready ... populating data");
                db.transaction((tx) => {
                    tx.executeSql('CREATE TABLE IF NOT EXISTS drafts (id INTEGER PRIMARY KEY NOT NULL, userId TEXT NOT NULL, title TEXT NOT NULL, imageUri TEXT NOT NULL, date TEXT NOT NULL)');
                }).then(() => {
                    console.log("Table created successfully");
                }).catch(error => {
                    console.log(error);
                });
            });
            resolve(db);
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.log("echoTest failed - plugin not functional");
      });
    });
};


export const insertDraft = (userId, title, imageUri, date) => {
  const promise = new Promise((resolve, reject) => {
    init().then((db) => {
      db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO drafts (userId, title, imageUri, date) VALUES (?, ?, ?, ?);`,
          [userId, title, imageUri, date],
          (_, result) => {
            resolve(result);
          },
          (_, err) => {
            reject(err);
          }
        );
      });
    });
  });

  return promise;
};


export const fetchDraft = (id) => {
    const promise = new Promise((resolve, reject) => {

    const draft = [];
    init().then((db) => {
      db.transaction((tx) => {
        tx.executeSql('SELECT * FROM drafts WHERE userId = ?', [id]).then(([tx,results]) => {
          console.log("Query completed");
          var len = results.rows.length;
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            const { id, userId, title, imageUri, date } = row;
            draft.push({
              id,
              userId,
              title,
              imageUri,
              date
            });
          }
          resolve(draft);
        });
      })
    }).catch((err) => {
      console.log(err);
    });
  });  

    return promise;
};

export const dropDraft = (id) => {
  const promise = new Promise((resolve) => {
    init().then((db) => {
      db.transaction((tx) => {
        tx.executeSql('DELETE FROM drafts WHERE id = ?', [id]).then(([tx, results]) => {
          console.log(results);
          resolve(results);
        });
      })
    }).catch((err) => {
      console.log(err);
    });
  });  

  return promise;
};


export const draftUpdated = (id, userId, title, image, date) => {
  const promise = new Promise((resolve) => {
    init().then((db) => {
      db.transaction((tx) => {
        tx.executeSql('UPDATE drafts SET userId = ?, title = ?, imageUri = ?, date = ? WHERE id = ?', [userId, title, image, date, id]).then(([tx, results]) => {
          resolve(results);
        });
      })
    }).catch((err) => {
      console.log(err);
    });
  });  

  return promise;
}