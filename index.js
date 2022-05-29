const DiscordJS = require("discord.js");
const WOKCommands = require("wokcommands");
const path = require("path");
const dotenv = require("dotenv");

const { Intents } = DiscordJS;

dotenv.config();

const client = new DiscordJS.Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
});

client.on("ready", () => {
  console.log("The bot is ready!");

  new WOKCommands(client, {
    commandDir: path.join(__dirname, "commands"),
    featureDir: path.join(__dirname, "features"),
    botOwners: ["282548643142172672"],
    testServers: ["870593485114318898"],
    mongoUri: process.env.MONGO_URI,
  });
});

client.login(process.env.TOKEN);
