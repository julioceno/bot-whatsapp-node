const Database = require('./db')

Database.then( async db => {
    // await db.run(`
    //     INSERT INTO events(
    //         title
    //     ) VALUES (
    //         "Baska 21/07 Sexta 14:00 municipal"
    //     );
    // `)

    const event = await db.all(`SELECT * FROM events`)
    console.log(event)

    const addList = await db.all(`UPDATE events SET title = "julio" WHERE id = "1"`)

})