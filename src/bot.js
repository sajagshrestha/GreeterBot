require("dotenv").config();

const { Client } = require("discord.js");

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
						const stream = discordTTS.getVoiceStream(
							"I am the new mangobyte?"
						);

						connection.play(stream);
						bot.on("voiceStateUpdate", (oldState, newState) => {
							const newUserChannel = newState.channel;
							const oldUserChannel = oldState.channel;
							if (
								oldUserChannel === null &&
								newUserChannel !== null
							) {
								let newUserName = discordTTS.getVoiceStream(
									`${newState.member.user.username}`
								);
								let onJoinGreeting = discordTTS.getVoiceStream(
									"Well hello there, it's"
								);
								let greetingDispatcher = connection.play(
									onJoinGreeting
								);
								//play gretting
								greetingDispatcher.on("finish", () => {
									connection.play(newUserName);
								});
							} else if (newUserChannel === null) {
								let olUserName = discordTTS.getVoiceStream(
									`${oldState.member.user.username}`
								);
								let onleaveGreeting = discordTTS.getVoiceStream(
									"Farewell! ,"
								);
								//play farewell
								let farewlelDsipatcher = connection.play(
									onleaveGreeting
								);
								farewlelDsipatcher.on("finish", () => {
									connection.play(olUserName);
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
