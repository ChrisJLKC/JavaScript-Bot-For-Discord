const Discord = require('discord.js');
const client = new Discord.Client();

const token = 'TOKEN';

client.on('Ready', () =>{
    console.log('Ready!');
})

client.on('message', msg => {
    if(msg.content === 'ping') {
        msg.reply('pong');
    }
})

client.login(token);
