const DJS = require("discord.js");
const { ICommand } = require("wokcommands");
const welcomeSchema = require("../../models/welcome-schema");

module.exports = {
  category: "Config",
  description: "Üdvözlő üzenet beállítása",

  permissions: ["ADMINISTRATOR"],

  minArgs: 2,
  expectedArgs: "<channel> <text>",

  slash: true,
  testOnly: true,

  options: [
    {
      name: "channel",
      description: "Üdvözlő szoba.",
      required: true,
      type: DJS.Constants.ApplicationCommandOptionTypes.CHANNEL,
    },
    {
      name: "text",
      description: "Üdvözlő üzenet",
      required: true,
      type: DJS.Constants.ApplicationCommandOptionTypes.STRING,
    },
  ],

  callback: async ({ guild, message, interaction, args }) => {
    if (!guild) return "Kérlek, szerveren használd a parancsot!";

    const target = message
      ? message.mentions.channels.first()
      : interaction.options.getChannel("channel");
    if (!target || target.type !== "GUILD_TEXT") {
      return "Kérlek, jelölj meg egy szöveges csatornát!";
    }

    let text = interaction?.options.getString("text");
    if (message) {
      args.shift();
      text = args.join(" ");
    }

    await welcomeSchema.findOneAndUpdate(
      {
        _id: guild.id,
      },
      {
        _id: guild.id,
        text,
        channelId: target.id,
      },
      {
        upsert: true,
      }
    );

    return "Üdvözlő szoba sikeresen be lett állítva! ✅";
  },
};
