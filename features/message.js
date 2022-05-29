const { MessageEmbed } = require("discord.js");

module.exports = (client) => {
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.channel.type !== "DM") return;

    const guild = client.guilds.cache.get("870593485114318898");
    if (!guild) return console.log("Hiba: GUILD nem található");

    const dm_channel = guild.channels.cache.get("872064217581228072");
    if (!guild) return console.log("Hiba: DM_CHANNEL nem található");

    const dm_embed = new MessageEmbed()
      .setAuthor({
        name: message.author.username,
        iconURL: message.author.avatarURL(),
      })
      .setDescription(message.content)
      .setColor("RANDOM")
      .setTimestamp()
      .setFooter({
        text: `ID: ${message.author.id}`,
      });

    dm_channel.send({ embeds: [dm_embed] });
    if (message.attachments.size !== 0) {
      dm_channel.send({
        files: Array.from(message.attachments.values()),
        content: "`Melléklet`:",
      });
    }

    if (message.content.includes("https://tenor.com")) {
      let msg = message.content.split(" ");
      let index = -1;
      let i = 0;

      while (index < 0) {
        if (msg[i].includes("https://tenor.com")) index = i;
        i++;
      }

      dm_channel.send(msg[index]);
    }
  });
};

module.exports.config = {
  displayName: "Direct Message",
  dbName: "DIRECT MESSAGE",
};
