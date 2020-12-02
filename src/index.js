const qrcode = require('qrcode-terminal')
const { Client } = require('whatsapp-web.js')

const client = new Client()

client.on('qr', qr => {
    qrcode.generate(qr, { small: true })
})

client.on('ready', () => console.log('bot on !'))

// Create the welcome event;



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
