import qrcode from 'qrcode-terminal'
import { Client } from 'whatsapp-web.js'

import everyone from './parts/everyone'
import { groupJoin } from './parts/groupEvent'

const client = new Client()

// basic settings;

client.on('qr', qr => {
    qrcode.generate(qr, { small: true })
})

client.on('ready', () => console.log('bot on !'))

// group event;

client.on('group_join', async notification => {
    console.log('Usuário entrou !')
    groupJoin()
})

// everyone event;

client.on('message', async (msg) => everyone(msg))



// bot start;
client.initialize()

export default client