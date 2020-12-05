<<<<<<< HEAD
const qrcode = require('qrcode-terminal')
const { Client } = require('whatsapp-web.js')

const client = new Client()
=======
<<<<<<< Updated upstream
import qrcode from 'qrcode-terminal'
import { Client } from 'whatsapp-web.js'

import everyone from './parts/everyone'
import { groupJoin } from './parts/groupEvent'
=======
import { Client } from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal'
>>>>>>> Stashed changes

import { createList, consultList, updateList, deleteList, addParticipant, renameParticipant, deleteParticipant } from './parts/listEvents'
import everyoneEvent from './parts/everyoneEvent'
>>>>>>> master

// basic settings;

client.on('qr', qr => {
    qrcode.generate(qr, { small: true })
})

client.on('ready', () => console.log('bot on !'))

<<<<<<< HEAD

import { createList, consultList, updateList, deleteList, addParticipant, renameParticipant, deleteParticipant } from './parts/listEvents'
import everyoneEvent from './parts/everyoneEvent'

=======
// group event;

<<<<<<< Updated upstream
client.on('group_join', async notification => {
    console.log('Usuário entrou !')
    groupJoin()
})
=======
>>>>>>> master
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
<<<<<<< HEAD

// Rename list participant;
client.on('message', async msg => renameParticipant(msg))

// Delete list participant;
client.on('message', async msg => deleteParticipant(msg))


// Event message that calls all members;
client.on('message', async msg => everyoneEvent(msg))

//bot start;
=======
>>>>>>> Stashed changes

// everyone event;

client.on('message', async (msg) => everyone(msg))



// bot start;
>>>>>>> master
client.initialize()

export default client