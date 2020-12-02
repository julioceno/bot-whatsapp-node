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
//
//
//
//
//

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
