const { MessageEmbed } = require("discord.js");
const userSchema = require("../../models/user-schema");

module.exports = {
  category: "Moderation",
  description: "Privát üzenet küldése",

  slash: false,
  testOnly: true,
  guildOnly: true,

  minArgs: 2,
  expectedArgs: "<user-id> <message>",
  expectedArgsTypes: ["STRING", "STRING"],

  requiredPermissions: ["KICK_MEMBERS"],

  callback: async ({ message, args, client }) => {
    const userId = args.shift();
    const msg = args.join(" ");

    const user = client.users.cache.find((u) => u.id === userId);
    if (!user) return `**Hiba** ❌: Felhasználó nem található`;

    try {
      user.send(msg);
      if (message.attachments.size !== 0) {
        user.send({
          files: Array.from(message.attachments.values()),
          content: "`Melléklet`:",
        });
      }
    } catch (err) {
      console.log(err);
      return `**Hiba** ❌: Nem tudok üzenetet küldeni a felhasználónak.`;
    }

    return `Üzenet elküldve a felhasználónak! ✅`;
  },
};
