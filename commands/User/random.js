const DJS = require("discord.js");

module.exports = {
  category: "Utility",
  description: "Véletlenszerű Champion",

  permissions: ["ADMINISTRATOR"],

  slash: "both",
  testOnly: true,

  callback: async ({ args, channel }) => {
    const option = args.shift().toLowerCase();
    const champions = require("../../tools/champions.json");
    var selected = "null";

    if (option === "damage" || option === "dmg") {
      selected =
        champions.damages[Math.floor(Math.random() * champions.damages.length)];
    } else if (option === "tank" || option === "frontline") {
      selected =
        champions.tanks[Math.floor(Math.random() * champions.tanks.length)];
    } else if (option === "support" || option === "healer") {
      selected =
        champions.supports[
          Math.floor(Math.random() * champions.supports.length)
        ];
    } else if (option === "flank") {
      selected =
        champions.flanks[Math.floor(Math.random() * champions.flanks.length)];
    } else if (option === "dps") {
      var len = 0;
      var lengths = [];
      lengths.push(champions.flanks.length);
      lengths.push(champions.damages.length);
      lengths.push(champions.supports.length);
      lengths.push(champions.tanks.length);

      for (let i = 0; i < lengths.length; i++) {
        if (lengths[i] > lengths[len]) len = i;
      }

      var temp = [];
      for (let i = 0; i < lengths[len]; i++) {
        if (i <= champions.damages.length) {
          temp.push(champions.damages[i]);
        }
        if (i <= champions.flanks.length) {
          temp.push(champions.flanks[i]);
        }
        if (i <= champions.supports.length) {
          temp.push(champions.supports[i]);
        }
        if (i <= champions.tanks.length) {
          temp.push(champions.tanks[i]);
        }
      }

      selected = temp[Math.floor(Math.random() * temp.length)];
    } else {
      var len = champions.damages.length;
      if (len < champions.flanks.length) len = champions.flanks.length;

      var temp = [];
      for (let i = 0; i < len; i++) {
        if (i <= champions.damages.length) {
          temp.push(champions.damages[i]);
        }
        if (i <= champions.flanks.length) {
          temp.push(champions.flanks[i]);
        }
      }

      selected = temp[Math.floor(Math.random() * temp.length)];
    }

    var selected_link = selected.split(" ").join("-");
    selected_link = selected_link.split("'").join("").toLowerCase();

    const embed = new DJS.MessageEmbed()
      .setColor("RANDOM")
      .setTitle(selected)
      .setImage(
        `https://webcdn.hirezstudios.com/paladins/champion-icons/${selected_link}.jpg`
      );

    channel.send({ embeds: [embed] });
    return;
  },
};
