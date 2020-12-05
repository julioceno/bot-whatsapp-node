const Database = require('sqlite-async')

async function execute(db) {

    return await db.exec(` CREATE TABLE IF NOT EXISTS events(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            participants TEXT
    );`) 
}

module.exports = Database.open(__dirname + '/database.db.sqlite').then(execute)