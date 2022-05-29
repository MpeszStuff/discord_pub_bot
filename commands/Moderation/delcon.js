const { MessageEmbed } = require("discord.js");
const userSchema = require("../../models/user-schema");

module.exports = {
  category: "Moderation",
  description: "Felhasználó kapcsolatának megszüntetése",

  slash: true,
  testOnly: true,
  guildOnly: true,

  minArgs: 2,
  expectedArgs: "<user> <reason>",
  expectedArgsTypes: ["USER", "STRING"],

  requiredPermissions: ["KICK_MEMBERS"],

  callback: async ({ interaction, args, client, guild }) => {
    let userId = args.shift();
    const reason = args.join(" ");
    let user;

    user = interaction.options.getUser("user");
    if (!user) {
      userId = userId.replace(/[<@!>]/g, "");
      user = await client.users.fetch(userId);

      if (!user) return `**Hiba** ❌: A felhasználó már nincs a szerveren.`;
    }

    userId = user.id;

    const filter = {
      _id: userId,
    };
    const update = {
      paladinsId: null,
      userName: "default",
    };

    let profile = await userSchema.findOne(filter);

    if (!profile)
      return `**Hiba** ❌: Felhasználó nem található az adatbázisban.`;

    let updatedProfile = await userSchema.findOneAndUpdate(filter, update);

    const member = await guild?.members.fetch(userId);
    const verified_role = guild?.roles.cache.find(
      (role) => role.name === "Verified"
    );
    const member_role = guild?.roles.cache.find(
      (role) => role.name === "Member"
    );

    if (!verified_role)
      return {
        custom: true,
        content: `**Hiba** ❌: "Verified" rang nem található.`,
        ephemeral: true,
      };
    if (member.roles.cache.some((r) => r.name === "Member"))
      member.roles.remove(member_role);
    member.roles.remove(verified_role);

    try {
      // Message for the targeted user
      const targetEmbed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Kapcsolatodat egy moderátor megszüntette")
        .setDescription(
          `A Discord és Paladins profiljaid mostantól nincsenek kapcsolatban egymással. Bármikor újra csatlakoztathatod a kettőt a "/connect" parancs használatával.\n\nIndok:\n ${args.join(
            " "
          )}`
        )
        .setTimestamp()
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.avatarURL(),
          url: "https://discord.gg/TSSAbPfDMk",
        });
      user.send({ embeds: [targetEmbed] });
    } catch (error) {
      return {
        custom: true,
        content: `Sikeresen megszünt ${user.username} felhasználó kapcsolata, de nem kapott erről értesítőt!`,
        ephemeral: true,
      };
    }

    // Message for the moderator

    return {
      custom: true,
      content: `Sikeresen megszüntetted ${user.username} felhasználó kapcsolatát! ✅`,
      ephemeral: true,
    };
  },
};
