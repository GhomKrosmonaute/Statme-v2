const { MessageEmbed, MessageAttachment } = require('discord.js')
const getUserStats = require('../utils/getUserStats')
const getGraphic = require('../utils/getGraphic')

module.exports = async function () {
  const stats = await getUserStats( this.client.db, this.author )
  const buffer = getGraphic(stats, {width: 300, height: 100}).toBuffer()
  const attachment = new MessageAttachment(buffer, 'graph.png')
  const embed = new MessageEmbed()
    .setTitle('User Graph')
    .setDescription('User stats for last month, divide by day')
    .attachFiles([attachment])
    .setImage('attachment://graph.png')
  this.channel.send(embed).catch()
}