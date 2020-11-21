const { Client } = require('whatsapp-web.js');
const client = new Client();

const message = ['test', 'test2'];

client.on('qr', qr => {
    console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
    console.log('Client is ready !');
});

client.on('message', msg => {
    for (let i = 0; i < message.length; i++) {
        if (msg.body == message[i]) {
            switch (message[i]) {
                case 'test':
                    return msg.reply('Chatbot successfully connected !');
                case 'test2':
                    return msg.reply('Chatbot working perfectly !');
            }
        }
    }
});

client.initialize();