const qrcode = require('qrcode-terminal')
const { Client } = require('whatsapp-web.js')

const client = new Client()

// basic settings;

client.on('qr', qr => {
    qrcode.generate(qr, { small: true })
})

client.on('ready', () => console.log('bot on !'))


import { createList, consultList, updateList, deleteList, addParticipant, renameParticipant, deleteParticipant } from './parts/listEvents'
import everyoneEvent from './parts/everyoneEvent'

// Create list;
client.on('message', async msg => createList(msg))

// Consult list;
client.on('message', async msg => consultList(msg))

// Update list;
client.on('message', async msg => updateList(msg))

// Delete list;
client.on('message', async msg => deleteList(msg))

// Add list participant;
client.on('message', async msg => addParticipant(msg))

// Rename list participant;
client.on('message', async msg => renameParticipant(msg))

// Delete list participant;
client.on('message', async msg => deleteParticipant(msg))


// Event message that calls all members;
client.on('message', async msg => everyoneEvent(msg))

//bot start;
client.initialize()

export default client