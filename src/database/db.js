import db from 'sqlite-async'

<<<<<<< HEAD
async function execute(database) {

    return await database.exec(` CREATE TABLE IF NOT EXISTS events(
=======
async function execute() {

    return await db.exec(` CREATE TABLE IF NOT EXISTS events (
>>>>>>> master
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            participants TEXT
    );`) 
}

export default db.open(__dirname + '/database.sqlite').then(execute)