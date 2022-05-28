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
    console.log("Felhasználók:");
    guild.members.fetch().then((members) => {
      console.log(members);
      members.forEach((m) => {
        console.log(m);
      });
    });

    return "Felhasználók logolva";
  },
};
