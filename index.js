const Discord = require('discord.js');
const client = new Discord.Client(); 
const ytdl = require('ytdl-core');

const token = 'TOKEN';

var servers = {};

const PREFIX = 1;

client.once('ready', () => {
    console.log('Ready!');
});

client.once('reconnecting', () => {
    console.log('Reconnecting!');
});

client.once('disconnect', () => {
    console.log('Disconnect!');
});

client.on('message', msg => {
    if(msg.content === 'ping') {
        msg.reply('pong');
    }
});

client.on('message', message => {
    let args = message.content.substring(PREFIX.length).split(' ');

    switch (args[0]) {
        case 'play':

            function play(connection, message){
                var server = servers[message.guild.id];
                server.dispatcher = connnection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));

                server.queue.shift();

                server.dispatcher.on("end", function() {
                    if(server.queue[0]){
                        play(connection, message);
                    }

                    else {
                        connection.disconnect();
                    }
                })
            }

            if(!args[1]) {
                message.channel.send("You need to provide a link address");
                return
            }

            if(!message.member.voiceChannel) {
                message.channel.send("You need to be in a voice channel");
                return;
            }

            if(!servers[message.guild.id]) servers[message.guild.id] = { // Produces a queue for songs
                queue: []
            }

            var servers = servers[message.guild.id]; // Adding server to the Array of servers above 

            server.queue.push(args[1]);

            if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
                play(connection, message);
            })

        break;
    }
})

client.login(token);
