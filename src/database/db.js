import db from 'sqlite-async'

async function execute() {

    return await db.exec(` CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            participants TEXT
    );`) 
}

export default db.open(__dirname + '/database.sqlite').then(execute)