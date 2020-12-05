const qrcode = require('qrcode-terminal')
const { Client } = require('whatsapp-web.js')

const client = new Client()

client.on('qr', qr => {
    qrcode.generate(qr, { small: true })
})

client.on('ready', () => console.log('bot on !'))

// Create inbound and outbound events;

client.on('group_join', notification => {
    console.log('Detectamos um novo usuário no grupo !')
})

client.on('group_leave', notification => {
    console.log('Detectamos que um usuário saiu do grupo !')
})

// Listing creation event (Julio code here);

const Database = require('./database/db')
const renderList = (name, id) => `\n${id + 1} - ${name}` // Esta função é utilizada varias vezes ao código, não retire ela daqui
let list = ""

// Create list[x]
client.on('message', async msg => {
    const chat = await msg.getChat()
    const createList = (msg.body).toLocaleLowerCase().trim().replace(/( ){2,}/g, '$1').split(/:(.*)/, 2)

    const db = await Database
    const checkinglist = await db.all(`SELECT * FROM events`)

    if (createList[0] === '!create_list' && createList.length === 2 ) {

        createList.shift()
        const valuesList = createList[0].trim()
        list = `*${valuesList}*\n\n`
        
        if (checkinglist[0]) {
            chat.sendMessage(' Já temos uma lista cadastrada no banco de dados!')
            return
        }

        Database.then(async db => {
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

})

// consult list [x]
client.on('message', async msg => {
    const chat = await msg.getChat()
    const consultList = (msg.body).trim()
   
    const db = await Database
    const checkinglist = await db.all(`SELECT * FROM events`)

    if (consultList.toLocaleLowerCase() === "!consult_list") {
        if (!checkinglist[0]) {
            chat.sendMessage('Não temos uma lista no banco de dados!')
            return
        }

        list = checkinglist[0].title
        list += (checkinglist[0].participants).split(',').map(renderList).join(',').replace(/,/g, '')
        chat.sendMessage(list)
    }
})

// update list [x]
client.on('message', async msg => {
    const chat = await msg.getChat()
    const renameList = (msg.body).trim().replace(/( ){2,}/g, '$1').split(/:(.*)/, 2)

    const db = await Database
    const checkinglist = await db.all(`SELECT * FROM events`)

    if (renameList[0].toLocaleLowerCase() === '!rename_list' && renameList.length === 2 ) {
        renameList.shift()
        const newListValues = `*${renameList[0].trim()}*\n`
        list = newListValues
        list += (checkinglist[0].participants).split(',').map(renderList).join(',').replace(/,/g, '')
        
        if (!checkinglist[0]) {
            chat.sendMessage('Não temos uma lista no banco de dados!')
            return
        }
    
        Database.then(async db => {
            await db.all(`UPDATE events SET title = "${newListValues}" WHERE id = "${checkinglist[0].id}"`)
        })

        chat.sendMessage(list)
    }
})

// delete list [x]
client.on('message', async msg => {
    const chat = await msg.getChat()
    const deleteList = (msg.body).trim()
    
    const db = await Database
    const checkinglist = await db.all(`SELECT * FROM events`)

    if (deleteList.toLocaleLowerCase() === '!delete_list') {
        
        if (!checkinglist[0]) {
            chat.sendMessage('Não temos uma lista no banco de dados!')
            return
        }
        
        Database.then( async db => {
            await db.all(` DELETE FROM events WHERE id = "${checkinglist[0].id}" `)
        })

        chat.sendMessage(`Lista deletada`)
    }
})

// add participant [x]
client.on('message', async msg => {
    const chat = await msg.getChat()
    const contact = await msg.getContact()
    const addList = (msg.body).trim().replace(/( ){2,}/g, '$1').split(':')
    
    const db = await Database
    const checkinglist = await db.all(`SELECT * FROM events`)

    if (addList[0].toLocaleLowerCase() === '!add_list' && !checkinglist[0]) {
            chat.sendMessage('Não temos uma lista no banco de dados!')
            return
    }

    // Adicionando usuário que mandou mensagem na lista 
    if (addList[0].toLocaleLowerCase() === '!add_list' && addList.length === 1) {
        const currentParticipants = (checkinglist[0].participants).split(',')

        const participant =  contact.pushname
        currentParticipants.push(participant)
        if (!currentParticipants[0]) currentParticipants.shift()
        list = checkinglist[0].title
        list += currentParticipants.map(renderList).join(',').replace(/,/g, '')

        Database.then( async db => {
            await db.all(` UPDATE events SET participants = "${currentParticipants}" WHERE id = "${checkinglist[0].id}" `)
        })

        chat.sendMessage(list)
    }

    console.log(addList[0].toLocaleLowerCase() )
    console.log(addList[0])
    // Adicionando uma pessoa na lista
    if(addList[0].toLocaleLowerCase() === '!add_list' && addList.length >= 2 ) {
        addList.shift()
        const currentParticipants = (checkinglist[0].participants).split(',')

        const participant = addList[0]
        currentParticipants.push(participant)
        if (!currentParticipants[0]) currentParticipants.shift()
        list = checkinglist[0].title
        list += currentParticipants.map(renderList).join(',').replace(/,/g, '')

        Database.then(async db => {
            await db.all(`UPDATE events SET participants = "${currentParticipants}" WHERE id = "${checkinglist[0].id}" `)
        })
       
        chat.sendMessage(list)
    }
})

// rename participant [x]
client.on('message', async msg => {
    const chat = await msg.getChat()
    const renameParticipant = (msg.body).trim().replace(/( ){2,}/g, '$1').split(':')

    const db = await Database
    const checkinglist = await db.all(`SELECT * FROM events`)

    if (renameParticipant[0].toLocaleLowerCase() === "!rename_participant" && renameParticipant.length === 2) {
        renameParticipant.shift()

        const participantData = renameParticipant[0].split('-')
        const idParticipant = parseInt(participantData[0])
        const indice = idParticipant - 1
        const newName = participantData[1].trim()
        
        const currentParticipants = (checkinglist[0].participants).split(',')
        
        if (!checkinglist[0]) {
            chat.sendMessage('Não temos uma lista no banco de dados!')
            return
        }
        
        if (!(participantData.length === 2)) {
            chat.sendMessage('O comando está incorreto, mande um *!comands* no chat que eu irei te passar uma lista de comandos e como usá-los  ')
            return
        }
        
        if (idParticipant > currentParticipants.length || idParticipant <= 0  ) {
            chat.sendMessage('Não temos esse participante aqui')
            return
        }
        
        // Só coloquei esse trecho de código abaixo dos filtos pois eles precisam ser compilados após as validações acima terem sido feitas
        currentParticipants[indice] = newName
        list = checkinglist[0].title 
        list += currentParticipants.map(renderList).join(',').replace(/,/g, ' ')

        Database.then( async db => {
            await db.all(`UPDATE events SET participants = "${currentParticipants}" WHERE id = "${checkinglist[0].id}"`)
        })

        chat.sendMessage(list)
    } 
})

// delete participant [x]
client.on('message', async msg => {
    const chat = await msg.getChat()
    const removeParticipant = (msg.body).trim().replace(/( ){2,}/g, '$1').split(':')
    
    const db = await Database
    const checkinglist = await db.all(`SELECT * FROM events`)

    if (removeParticipant[0].toLocaleLowerCase() === '!remove_participant' && removeParticipant.length === 2) {
        removeParticipant.shift()
        
        const currentParticipants = (checkinglist[0].participants).split(',')
        const idParticipant = parseInt(removeParticipant[0])
        const indice = idParticipant - 1
        currentParticipants.splice(indice, 1)
        list = checkinglist[0].title
        list += currentParticipants.map(renderList).join(',').replace(/,/g, '')

        if (!checkinglist[0]) {
            chat.sendMessage('Não temos uma lista no banco de dados!')
            return
        }

        if (!parseInt(idParticipant)) {
            chat.sendMessage(' Isso não é um número ')
            return
        } 

        if (idParticipant > currentParticipants.length || idParticipant <= 0) {
            chat.sendMessage(' Não temos este participante na lista ')
            return
        }
        
            Database.then( async db => {
                db.all(`UPDATE events SET participants = "${currentParticipants}" WHERE id = "${checkinglist[0].id}"`)
            })
                        
            chat.sendMessage('Participante deletado com sucesso!')
            chat.sendMessage(list)
    }
})


// Event message that calls all members;
client.on('message', async msg => {
    if (msg.body === '#everyone') {
        const chat = await msg.getChat();

        let text = ''
        let mentions = []

        for (let participant of chat.participants) {
            const contact = await client.getContactById(participant.id._serialized)

            mentions.push(contact)
            text += `@${participant.id.user}`
        }

        chat.sendMessage(text, { mentions })
    }
})

client.initialize()