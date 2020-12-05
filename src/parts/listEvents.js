import db from '../database/db'
import client from '../bot'

const renderList = (name, id) => `\n${id + 1} - ${name}`
let list = ''

/* List configuration */

// Create list;
async function createList(msg) {
    const chat = await msg.getChat()
    const listTable = (msg.body).toLocaleLowerCase().trim().replace(/( ){2,}/g, '$1').split(/:(.*)/, 2)

    const checkinglist = await db.all(`SELECT * FROM events`)

    if (createList[0] === '/create_list' && listTable.length === 2 ) {

        createList.shift()
        const valuesList = createList[0].trim()
        list = `*${valuesList}*\n\n`
        
        if (checkinglist[0]) {
             return chat.sendMessage('🤖 Já temos uma lista cadastrada no banco de dados !')
            
        }

        db.then(async db => {
            await db.run(`
                INSERT INTO events(
                    title,
                    participants
                ) VALUES (
                    "${list}",
                    ""
                );
            `)
        })
       
        chat.sendMessage(list) 
    }
}

// Consult list;
async function consultList(msg) {
    const chat = await msg.getChat()
    const consultList = (msg.body).trim()
   
    const checkinglist = await db.all(`SELECT * FROM events`)

    if (consultList.toLocaleLowerCase() === "/consult_list") {
        if (!checkinglist[0]) {
            return chat.sendMessage('🤖 Não temos uma lista no banco de dados !')
        }

        list = checkinglist[0].title
        list += (checkinglist[0].participants).split(',').map(renderList).join(',').replace(/,/g, '')
        chat.sendMessage(list)
    }
}

// Update list;
async function updateList(msg) {
    const chat = await msg.getChat()
    const renameList = (msg.body).trim().replace(/( ){2,}/g, '$1').split(/:(.*)/, 2)

    const checkinglist = await db.all(`SELECT * FROM events`)

    if (renameList[0].toLocaleLowerCase() === '/rename_list' && renameList.length === 2 ) {
        renameList.shift()
        const newListValues = `*${renameList[0].trim()}*\n`
        list = newListValues
        list += (checkinglist[0].participants).split(',').map(renderList).join(',').replace(/,/g, '')
        
        if (!checkinglist[0]) {
            return chat.sendMessage('🤖 Não temos uma lista no banco de dados !')
        }
    
        db.then(async db => {
            await db.all(`UPDATE events SET title = "${newListValues}" WHERE id = "${checkinglist[0].id}"`)
        })

        chat.sendMessage(list)
    }
}

// Delete list;
async function deleteList(msg) {
    const chat = await msg.getChat()
    const deleteList = (msg.body).trim()
    
    const checkinglist = await db.all(`SELECT * FROM events`)

    if (deleteList.toLocaleLowerCase() === '/delete_list') {
        
        if (!checkinglist[0]) {
            return chat.sendMessage('🤖 Não temos uma lista no banco de dados !')
        }
        
        db.then( async db => {
            await db.all(` DELETE FROM events WHERE id = "${checkinglist[0].id}" `)
        })

        chat.sendMessage(`Lista deletada`)
    }
}

/* Configuration of the participants */

// Add participant;
async function addParticipant(msg) {
    const chat = await msg.getChat()
    const contact = await msg.getContact()
    const addList = (msg.body).trim().replace(/( ){2,}/g, '$1').split(':')
    
    const checkinglist = await db.all(`SELECT * FROM events`)

    if (addList[0].toLocaleLowerCase() === '/add_list' && !checkinglist[0]) {
           return chat.sendMessage('🤖 Não temos uma lista no banco de dados !')
    }

    // Adicionando usuário que mandou mensagem na lista 
    if (addList[0].toLocaleLowerCase() === '/add_list' && addList.length === 1) {
        const currentParticipants = (checkinglist[0].participants).split(',')

        const participant =  contact.pushname
        currentParticipants.push(participant)
        if (!currentParticipants[0]) currentParticipants.shift()
        list = checkinglist[0].title
        list += currentParticipants.map(renderList).join(',').replace(/,/g, '')

        db.then( async db => {
            await db.all(` UPDATE events SET participants = "${currentParticipants}" WHERE id = "${checkinglist[0].id}" `)
        })

        chat.sendMessage(list)
    }

    // Add a person;
    if(addList[0].toLocaleLowerCase() === '/add_list' && addList.length >= 2 ) {
        addList.shift()
        const currentParticipants = (checkinglist[0].participants).split(',')

        const participant = addList[0]
        currentParticipants.push(participant)
        if (!currentParticipants[0]) currentParticipants.shift()
        list = checkinglist[0].title
        list += currentParticipants.map(renderList).join(',').replace(/,/g, '')

        db.then(async db => {
            await db.all(`UPDATE events SET participants = "${currentParticipants}" WHERE id = "${checkinglist[0].id}" `)
        })
       
        chat.sendMessage(list)
    }
}

// Rename participant;
async function renameParticipant(msg) {
    const chat = await msg.getChat()
    const renameParticipant = (msg.body).trim().replace(/( ){2,}/g, '$1').split(':')

    const checkinglist = await db.all(`SELECT * FROM events`)

    if (renameParticipant[0].toLocaleLowerCase() === "/rename_participant" && renameParticipant.length === 2) {
        renameParticipant.shift()

        const participantData = renameParticipant[0].split('-')
        const idParticipant = parseInt(participantData[0])
        const indice = idParticipant - 1
        const newName = participantData[1].trim()
        
        const currentParticipants = (checkinglist[0].participants).split(',')
        
        if (!checkinglist[0]) {
           return chat.sendMessage('🤖 Não temos uma lista no banco de dados !')
        }
        
        if (!(participantData.length === 2)) {
            return chat.sendMessage('O comando está incorreto, mande um */commands* no chat que eu irei te passar uma lista de comandos e como usá-los  ')
        }
        
        if (idParticipant > currentParticipants.length || idParticipant <= 0  ) {
            return chat.sendMessage('🤖 Não temos esse participante aqui !')
        }
        
        currentParticipants[indice] = newName
        list = checkinglist[0].title 
        list += currentParticipants.map(renderList).join(',').replace(/,/g, ' ')

        db.then( async db => {
            await db.all(`UPDATE events SET participants = "${currentParticipants}" WHERE id = "${checkinglist[0].id}"`)
        })

        chat.sendMessage(list)
    } 
}

// Delete participant;
async function deleteParticipant(msg) {
    const chat = await msg.getChat()
    const removeParticipant = (msg.body).trim().replace(/( ){2,}/g, '$1').split(':')
    
    const checkinglist = await db.all(`SELECT * FROM events`)

    if (removeParticipant[0].toLocaleLowerCase() === '/remove_participant' && removeParticipant.length === 2) {
        removeParticipant.shift()
        
        const currentParticipants = (checkinglist[0].participants).split(',')
        const idParticipant = parseInt(removeParticipant[0])
        const indice = idParticipant - 1
        currentParticipants.splice(indice, 1)
        list = checkinglist[0].title
        list += currentParticipants.map(renderList).join(',').replace(/,/g, '')

        if (!checkinglist[0]) {
            return chat.sendMessage('🤖 Não temos uma lista no banco de dados !')
        }

        if (!parseInt(idParticipant)) {
           return chat.sendMessage('🤖 Isso não é um número !')
        } 

        if (idParticipant > currentParticipants.length || idParticipant <= 0) {
            return chat.sendMessage('🤖 Não temos este participante na lista !')
        }
        
            db.then( async db => {
                db.all(`UPDATE events SET participants = "${currentParticipants}" WHERE id = "${checkinglist[0].id}"`)
            })
                        
            chat.sendMessage('🤖 Participante deletado com sucesso !')
            chat.sendMessage(list)
    }
}

export {
    createList, 
    consultList, 
    updateList, 
    deleteList, 
    addParticipant,
    renameParticipant,
    deleteParticipant
}

