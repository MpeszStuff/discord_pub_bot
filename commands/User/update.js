const { MessageEmbed } = require("discord.js");
const userSchema = require("../../models/user-schema");
const { getPlayer } = require("../../tools/paladins-api");

module.exports = {
  category: "Moderation",
  description: "Privát üzenet küldése",

  slash: false,
  testOnly: true,
  guildOnly: true,

  cooldown: "3d",

  callback: async ({ message, member }) => {
    if (message.channel.id !== process.env.COMMANDSCHANNEL)
      return `Kérlek a kijelölt szobát használd! <#${process.env.COMMANDSCHANNEL}>`;

    const filter = {
      _id: message.author.id,
    };

    let profile = await userSchema.findOne(filter);
    if (!profile)
      return "**Hiba** ❌: Először csatlakozz a PUB Discord szerverre, majd létesíts kapcsolatot a /connect paranccsal!";

    if (profile.paladinsId === null)
      return "**Hiba** ❌: Még nincs Paladins fiókhoz társítva ez a Discord profil. Használd a /connect parancsot!";

    const paladinsUser = await getPlayer(profile.paladinsId);
    const newUsername = paladinsUser["hz_player_name"];

    if (!newUsername)
      return "**Hiba** ❌: Valószínűleg nem elérhetőek a játékszerverek, vagy hiba keletkezett az adatbázisban";
    try {
      const role = member.guild.roles.cache.find(
        (role) => role.name === "Verified"
      );
      if (!role)
        return `**Hiba** ❌: Nem található VERIFIED rang a szerveren. Értesíts egy Admint!`;

      member.setNickname(newUsername);
      member.roles.add(role);
      return `**Sikeres frissítés!** ✅`;
    } catch (error) {
      return "**Hiba** ❌: Nincs jogom módosításokat végezni rajtad";
    }
  },
};
