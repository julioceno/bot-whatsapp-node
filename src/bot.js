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

// basic settings;

client.on('qr', qr => {
    qrcode.generate(qr, { small: true })
})

client.on('ready', () => console.log('bot on !'))

// group event;

<<<<<<< Updated upstream
client.on('group_join', async notification => {
    console.log('Usuário entrou !')
    groupJoin()
})
=======
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
>>>>>>> Stashed changes

// everyone event;

client.on('message', async (msg) => everyone(msg))



// bot start;
client.initialize()

export default client