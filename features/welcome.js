const DiscordJS = require("discord.js");
const { MessageEmbed } = DiscordJS;
const userSchema = require("../models/user-schema");
const welcomeSchema = require("../models/welcome-schema");

const welcomeData = {};

module.exports = (client) => {
  client.on("guildMemberAdd", async (member) => {
    const { guild, id } = member;
    const guildiconurl = guild.iconURL();
    try {
      const text =
        "**Üdvözöllek a PUB Szerveren!**\n\n" +
        "Utad elkezdéséhez kérlek, add meg a Paladins felhasználóneved! Ezt a PUB szerver egyik szobájában tudod megtenni.\n" +
        "A felhasználóneved elég csak 1x megadnod, viszont, ha nevet változtatnál, az adott szobában használd a '/update' parancsot!\n" +
        "A szerver moderátorai időnként ellenőrzik, hogy a tényleges felhasználóneved kapcsoltad-e össze Discord profiloddal. Ha bármiben hibát találnak, megszüntethetik a kapcsolatod és saját döntésük szerint szankcionálhatnak is téged!\n" +
        "A paladins szerverek néha túlterheltek, ilyen esetekben nem tudunk kapcsolatot létesíteni. Ha valós nevet adtál meg, de nem fogadom el, légy türelemmel vagy fordulj segítségez!\n\n" +
        "**Apropó segítség...**\n" +
        "Rám bármikor írhatsz segítségért, hiszen a moderátoraink látják a beszélgetésünket és be is tudnak csatlakozni bármikor. Így könnyen el tudsz érni minket, ha kérdésed lenne. :)";
      const embed = new MessageEmbed()
        .setDescription(
          "Kérlek, csatlakoztasd a profilod paladins fiókodhoz, hogy részt vehess a PUB szerver eseményein! Ezt a szerveren a kijelölt szobában tudod megtenni."
        )
        .setColor("AQUA")
        .setTimestamp()
        .setAuthor({
          name: "PUB",
          iconURL: guildiconurl,
          url: "https://discord.gg/TSSAbPfDMk",
        });
      member.send(text);
      member.send({ embeds: [embed] });
    } catch (error) {
      throw error;
    }

    let profile;
    try {
      profile = await userSchema.findById(id);
      if (profile) {
        profile.update({ $inc: { joinCounter: 1 } });
      } else {
        profile = await userSchema.create({
          _id: id,
        });
        await profile.save();
      }
    } catch (error) {
      console.log(error);
    }

    let data = welcomeData[guild.id];

    if (!data) {
      const results = await welcomeSchema.findById(guild.id);
      if (!results) return;

      const { channelId, text } = results;
      const channel = guild.channels.cache.get(channelId);
      data = welcomeData[guild.id] = [channel, text];
    }

    data[0].send({
      content: data[1].replace(/@/g, `<@${id}>`),
    });
  });
};

module.exports.config = {
  displayName: "Welcome Message",
  dbName: "WELCOME MESSAGE",
};
