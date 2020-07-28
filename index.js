const {MessageEmbed, Client} = require("discord.js");
const client = new Client(); 
const ytdl = require("ytdl-core");
const {token, PREFIX} = require("./config.json")

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

client.on("guildMemberAdd", member => {
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

client.on("message", message => {
    let args = message.content.slice(PREFIX.length).trim().split(/ +/g); // Monitors link address, and allows a space between commands

    switch (args[0]) {
        case 'play':

            if(!args[0]) { //makes sure that there is a link

                const embed_04 = new MessageEmbed()

                .setTitle('Warning!')
                .setColor(0xbd1313)
                .setDescription('Need a link address!');

                message.channel.send(embed_04);
                return;
            }

            let url = args.splice(1).join(' '); //gets infomation for selected

            if(!url.match(/(youtube.com|youtu.be)\/(watch)?(\?v=)?(\S+)?/)) { //makes sure it is a link from youtube

                const embed_05 = new MessageEmbed()

                .setTitle('Warning!')
                .setColor(0xbd1313)
                .setDescription('Please provide a valid Youtube link!');
                
                message.channel.send(embed_05);

                return;
            }

            let serverQueue = queue.get(message.guild.id); // starts a queue of songs
            let vc = message.member.voice; // finding the voice channel

            if(!vc) {

                const embed_06 = new MessageEmbed() // when member is not in channel

                .setTitle('Warning!')
                .setColor(0xbd1313)
                .setDescription('You are not in a voice channel!');

                message.channel.send(embed_06);

                return;
            }

            if(!vc.channel.permissionsFor(client.user).has('CONNECT') || !vc.channel.permissionsFor(client.user).has('SPEAK')) {

                const embed_07 = new MessageEmbed() // makes sure that the bot can access the channel

                .setTitle('Warning!')
                .setColor(0xbd1313)
                .setDescription('Do not have permission to that channel!');
                
                message.channel.send(embed_07);

                return;

            }

            let songinfo = ytdl.getInfo(url).then(); // getting info of video link
            let song = { // visualising the song info
                title: songinfo.title, 
                url: songinfo.video_url
            }

            if(!serverQueue) {
                let queueConst = { //determines where the message and music have to go in the server
                    textChannel: message.channel,
                    voiceChannel: vc.channel,
                    connection: null,
                    songs: [],
                    volume: 5,
                    playing: true
                };

                queue.set(message.guild.id, queueConst); // applying a new song
                queueConst.songs.push(song); // pushing the queue one down to accomadate the new song

                try {
                    let connection = vc.channel.join().then(); //bot trying to connect to the voice channel
                    queueConst.connection = connection
                    playSong(message.guild, queueConst.songs[0]) //playing the song
                } catch (error) {  // when detecting an error with the music
                    console.log(error);
                    queue.delete(message.guild.id);

                    const embed_08 = new MessageEmbed()

                    .setTitle('Warning!')
                    .setColor(0xbd1313)
                    .setDescription('There was an error playing the song! Error: ' + error);

                    message.channel.send(embed_08);

                    return;
                }
            } 
            
            else {
                serverQueue.songs.push(song); // adds the song to the queue

                const embed_09 = new MessageEmbed() //shwos the user the song added

                .setTitle('Added!')
                .setColor(0x1b9f31)
                .setDescription(`${song.title} has been added to the queue!`);

                message.channel.send(embed_09);

                return;
            }

        break;

        case 'skip':
      
        break;

        case 'stop':

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

/**
 * 
 * @param {Discord.Guild} guild //making sure the bot knows which one is which
 * @param {Object} song 
 */
async function playSong(guild, song) { // fetches the queue of song displayed by the user
    let serverQueue = queue.get(guild.id);

    if(!song){ // if there is no more songs, it will leave
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection.play(ytdl(song.url)).on('end', () => { //when the song plays in the voice channel
        serverQueue.songs.shift();
        playSong(guild, serverQueue.songs[0]);
    })
    .on('error', () => {
        console.log(error)
    })

    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5); // volume increments
}

client.login(token); // makes sure the token works with discord
