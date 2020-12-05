import client from '../bot'

async function everyoneEvent(msg) {
    if (msg.body == '/everyone') {
        const chat = await msg.getChat()

        let text = ''
        let mentions = []

        for (let participant of chat.participants) {
            const contact = await client.getContactById(participant.id._serialized)

            mentions.push(contact)
            text += `@${participant.id.user} `
        }
        msg.reply('🎙️ Chamando todos os membros para você...')
        setTimeout(() => {
            chat.sendMessage(text, { mentions })
        }, 5000);
    }
}

export default everyoneEvent