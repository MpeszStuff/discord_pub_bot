const { MessageEmbed } = require("discord.js");
const userSchema = require("../../models/user-schema");

module.exports = {
  category: "Admin",
  description: "Szerveren lévő felhasználók teljes resetelése",

  slash: true,
  testOnly: true,
  guildOnly: true,

  ownerOnly: true,

  callback: async ({ guild }) => {
    guild.members.fetch().then((members) => {
      members.forEach((m) => {
        console.log(m);
      });
    });

    return "Felhasználók logolva";
  },
};
