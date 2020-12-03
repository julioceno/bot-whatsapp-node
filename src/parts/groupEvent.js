import client from '../bot'
import client from '../bot'

async function groupJoin(notification) {
    const chat = await notification.getChat()

    if (chat.name == 'Help other devs [ADM]  🧡🚀') {
        client.on('message', msg => {
            return msg.reply('test')
        })
    }
}

export default groupJoin