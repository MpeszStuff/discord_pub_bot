const DJS = require("discord.js");
const userSchema = require("../../models/user-schema");

const {
  getPlayerIdByName,
  getPlayerIdsByGamertag,
} = require("../../tools/paladins-api");

const platforms = ["pc", "ps4", "xbox", "switch"];

module.exports = {
  category: "User",
  description: "Paladins fiók összekapcsolása Discord fiókkal",

  slash: "both",

  minArgs: 2,
  expectedArgs: "<paladins_name> <platform>",
  expectedArgsTypes: ["STRING", "STRING"],

  options: [
    {
      name: "paladins_name",
      description: "Érvényes Paladins felhasználóneved",
      required: true,
      type: "STRING",
    },
    {
      name: "platform",
      description: "Válassz platformot!",
      required: true,
      type: "STRING",
      choices: platforms.map((platform) => ({
        name: platform,
        value: platform.toUpperCase(),
      })),
    },
  ],

  callback: async ({ message, interaction, member, args }) => {
    if (interaction) {
      if (interaction.channelId !== process.env.COMMANDSCHANNEL)
        return `❌ Kérlek a kijelölt szobát használd! <#${process.env.COMMANDSCHANNEL}>`;
    }

    let username = "";
    let platform = "";
    if (message.content.includes('"')) {
      let msg = message.content.substring(message.content.indexOf('"'), message.content.lastIndexOf('"')+1)
      username = msg.replace(/"/g, '')

      platform = message.content.replace(/"/g,'')
      platform = (platform.replace(username, '')).split(' ')[1]
      
      console.log(username)
      console.log(platform)
    } else {
      username = args.shift() || "unknownplayername";
      platform = args.shift().toLocaleLowerCase() || "pc";
    }

    if (!platforms.includes(platform.toLocaleLowerCase())) {
      return `❌ Ismeretlen platform. Ezek közül lehet választani: ${platforms.join(
        ', '
      )}"`;
    }
    // Check if user exist and if so it's already has an account connected
    // if true: throw an error to the user
    let filter = {};
    if (interaction) {
      filter = { _id: interaction.user.id };
    } else {
      filter = { _id: message.author.id };
    }
    let profile = await userSchema.findOne(filter);
    if (!profile)
      return "**Hiba** ❌: Nem találunk a PUB szerver adatbázisában!";
    if (profile.paladinsId !== null)
      return `**Hiba** ❌: Már szerepel egy feljegyzés ehhez a discord fiókhoz. Ha frissíteni szeretnéd a neved, kérlek, használd a "/update" parancsot!`;

    // Check user's platform
    // User's selected platform is PC

    // Check if username exist
    // if false: throw an error to the user
    let playerId;
    if (platform === "pc") {
      playerId = await getPlayerIdByName(username);
    } else {
      // User's selected platform is not PC
      let platformIndex = "";
      switch (platform) {
        case "xbox":
          platformIndex = "10";
          break;
        case "switch":
          platformIndex = "22";
          break;
        case "ps4":
          platformIndex = "9";
          break;
      }
      playerId = await getPlayerIdsByGamertag(username, platformIndex);
    }

    if (playerId === 0)
      return `**Hiba** ❌: Felhasználónév (${username}) nem található!`;

    // Check if username has been claimed already
    // if true: throw an error to the user
    const update = {
      paladinsId: playerId,
      userName: username,
    };

    const paladinsIdFilter = {
      paladinsId: playerId,
    };

    profile = await userSchema.findOne(paladinsIdFilter);

    if (!profile) {
      try {
        profile = await userSchema.findOneAndUpdate(filter, update);
        profile = await userSchema.findOne(filter);

        const role = member.guild.roles.cache.find(
          (role) => role.name === "Verified"
        );

        if (member.user.id !== "282548643142172672") {
          await member.setNickname(profile.userName);
        }
        await member.roles.add(role);

        return `**Sikeres kapcsolatteremtés!** ✅ Paladins fiókod: ${profile.userName} (${profile.paladinsId})\nA <#870593485114318901> szobában tudsz magadra különböző rangokat kérni, illetve a szabályzatunkat is ott tudod elfogadni.`;
      } catch (error) {
        return "**Hiba** ❌: Nincs jogom módosításokat végezni rajtad.";
      }
    } else {
      return `**Hiba** ❌: Ez a paladins profilt már valaki használja a szerveren (${username})!`;
    }
  },
};
