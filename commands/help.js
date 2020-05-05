const { MessageEmbed } = require('discord.js')

module.exports = function () {
  const embed = new MessageEmbed()
    .setTitle('Command list')
    .setDescription(this.client.commands.keyArray().join(', '))
  this.channel.send(embed).catch()
}