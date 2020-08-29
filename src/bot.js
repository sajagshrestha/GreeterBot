require("dotenv").config();

const { Client, VoiceChannel } = require("discord.js");
const discordTTS = require("discord-tts");
const bot = new Client();
const PREFIX = "^";
bot.on("ready", () => {
  console.log(`${bot.user.username} has logged in`);
});

bot.on("message", (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith(PREFIX)) {
    const [MESSAGE_CMD, ...args] = message.content
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/);

    if (!message.member.voice.channel) {
      message.reply("you must be in a voice channel first");
    } else {
      const voiceChannel = message.member.voice.channel;
      if (MESSAGE_CMD === "summon") {
        voiceChannel
          .join()
          .then((connection) => {
            const stream = discordTTS.getVoiceStream("sup bitches?");
            const dispatcher = connection.play(stream);
            bot.on("voiceStateUpdate", (oldState, newState) => {
              const newUserChannel = newState.channel;
              const oldUserChannel = oldState.channel;
              if (oldUserChannel === null && newUserChannel !== null) {
                let msg = discordTTS.getVoiceStream(
                  `${newState.member.user.username} randi aayo`
                );
                let mydispatcher = connection.play(msg);
              } else if (newUserChannel === null) {
                let msg = discordTTS.getVoiceStream(
                  `${oldState.member.user.username} randi gaayo`
                );
                let mydispatcher = connection.play(msg);
              }
            });
          })
          .catch((error) => console.log(error));
      } else if (MESSAGE_CMD === "unsummon") {
        voiceChannel.leave();
      }
    }
  }
});

bot.login(process.env.DISCORD_BOT_TOKEN);
