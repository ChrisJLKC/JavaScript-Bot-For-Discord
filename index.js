const {MessageEmbed, Client} = require("discord.js");
const client = new Client(); 
const ytdl = require("ytdl-core-discord");
const {token, PREFIX} = require("./config.json");
const fs = require('fs');

var servers = {};

var queue = new Map();

client.once("ready", () => { // notifies in console when bot is active on discord
    console.log('Ready!');
});

client.on("message", msg => { // makes sure bot is functioning in discord 
    if(msg.content === 'ping') {
        msg.reply('pong');
    }
});

client.on("guildMemberAdd", member => { // shows notification to when someone joins the server
    const channel_01 = member.guild.channels.cache.find(ch => ch.name === "general");
    const embed_03 = new MessageEmbed()

    .setTitle('New User!')
    .setColor(0x9819d2)
    .setDescription(`Welcome to the server, ${member}! Remember to stay safe!`);

    if(!channel) {
        console.log('Failed to know new member');
        return;
    }

    channel_01.send(embed_03);
});

client.on("message", async message => {
    let args = message.content.slice(PREFIX.length).trim().split(/ +/g); // Monitors link address, and allows a space between commands

    const connection = await message.member.voice.channel; //waits for user in voice channel

    urls = args[1]; //making sure the url is the second thing in the array

    async function play(connect, urls) {
        connect.play(await ytdl(urls), {type: 'opus'}); //turns a video into audio
    }

    switch (args[0]) {
        case 'play':
            if(message.member.voice.channel) { //makes sure user is in voice channel

                if(!args[1]) { // when there is no url
                    embed_05 = new MessageEmbed()

                    .setTitle('Warning!')
                    .setColor(0xa71818)
                    .setDescription('You have not applied a link!');

                    message.channel.send(embed_05);

                    return;
                }

                connection.join(); //joins the voice channel

                embed_06 = new MessageEmbed()

                .setTitle('Successfully Connected to Channel!')
                .setColor(0x14b21f);

                message.channel.send(embed_06);
                
                message.member.voice.channel.join().then(function(connect){
                    play(connect, urls); //adds conversion of url onto bot
                });            
                
            }

            else {
                embed_07 = new MessageEmbed() // if not on voice chat 

                .setTitle('Warning!')
                .setColor(0xa71818)
                .setDescription('You are not in a voice channel!');

                message.channel.send(embed_07);

                return;
            }
        break;

        case 'skip':
      
        break;

        case 'pause':

        break;

        case 'resume':
            
        break;

        case 'stop':
            connection.leave();
        break;

        case 'help': //helps user use all of the commands
            const embed_04 = new MessageEmbed()

            .setTitle('Bot Commands')
            .setColor(0xe18d0b)
            .setDescription('!play (plays music in voice channel) \n !stop (stops music in voice channel) \n !skip (skippes to the nest song in the queue)');

            message.channel.send(embed_04);  
        break;

        case '':

        break;

    }
});

client.login(token); // makes sure the token works with discord
