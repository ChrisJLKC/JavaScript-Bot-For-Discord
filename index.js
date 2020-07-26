const Discord = require('discord.js');
const client = new Discord.Client();

const token = 'NzM2ODg4NjQ2NzE1NzAzNDA4.Xx1XCA.RfIEJJWd4xXxm1enELBt4ZObJI0';

client.on('Ready', () =>{
    console.log('Ready!');
})

client.on('message', msg => {
    if(msg.content === 'ping') {
        msg.reply('pong');
    }
})

client.login(token);