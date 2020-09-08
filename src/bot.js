require("dotenv").config();
const fs = require("fs");
const path = require("path");
const dirPath = path.join(__dirname, "/khatey.mp3");
const { Client, VoiceChannel } = require("discord.js");
const ytdl = require("ytdl-core");

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

            connection.play(dirPath);
            bot.on("voiceStateUpdate", (oldState, newState) => {
              const newUserChannel = newState.channel;
              const oldUserChannel = oldState.channel;
              if (oldUserChannel === null && newUserChannel !== null) {
                let msg = discordTTS.getVoiceStream(
                  `${newState.member.user.username}`
                );
                let msgL = discordTTS.getVoiceStream("aayo");
                let mydispatcher = connection.play(msg);
                mydispatcher.on("finish", () => {
                  let secondDispatcher = connection.play(dirPath);
                  secondDispatcher.on("finish", () => {
                    connection.play(msgL);
                  });
                });
              } else if (newUserChannel === null) {
                let msg = discordTTS.getVoiceStream(
                  `${oldState.member.user.username}`
                );
                let msgL = discordTTS.getVoiceStream("gaayo");
                let mydispatcher = connection.play(msg);
                mydispatcher.on("finish", () => {
                  let secondDispatcher = connection.play(dirPath);
                  secondDispatcher.on("finish", () => {
                    connection.play(msgL);
                  });
                });
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
