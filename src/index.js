const qrcode = require('qrcode-terminal')
const { Client } = require('whatsapp-web.js')

const client = new Client()

client.on('qr', qr => {
    qrcode.generate(qr, { small: true })
})

client.on('ready', () => {
    console.log('bot on !')
})

// Create the welcome event;


/* Create the call disclosure event;

function checkList(contact, msgs, ...list) {
    for (let i = 0; i < list.length; i++) {
        if (contact == list[i]) {
            msgs.reply('Você já está na lista :)')
        } else {
            list.push(contact)
            msgs.reply('Você entrou na lista :)')
        }
    }
}

client.on('message', async msg => {
    if (msg.body == '#entrar') {
        const chat = await msg.getChat()
        
        let text = ''
        let mentions = []

        for (let participant of chat.participants) {
            const contact = await client.getContactById(participant.id._serialized)
            checkList(contact, msg, mentions)
        }

        chat.sendMessage(text, { mentions })

    }
})
 */

// Event message that calls all members;

client.on('message', async msg => {
    if (msg.body === '#everyone') {
        const chat = await msg.getChat();

        let text = ''
        let mentions = []

        for (let participant of chat.participants) {
            const contact = await client.getContactById(participant.id._serialized)

            mentions.push(contact)
            text += `@${participant.id.user}  `
        }

        chat.sendMessage(text, { mentions })
    }
})




client.initialize()
