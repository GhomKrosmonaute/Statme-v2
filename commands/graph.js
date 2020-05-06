const { MessageEmbed, MessageAttachment } = require('discord.js')
const getUserStats = require('../utils/getUserStats')
const getGraphic = require('../utils/getGraphic')
const secret = require('../secret.json')

module.exports = async function () {
  const stats = await getUserStats( this.client.db, this.author )
  const buffer = getGraphic(stats, {width: 400, height: 200}).toBuffer()
  const attachment = new MessageAttachment(buffer, 'graph.png')
  const embed = new MessageEmbed()
    .setTitle('User Graph')
    .setURL(secret.baseURL + '/dashboard/user/' + this.author.id)
    .setDescription('User stats for last month, divide by day')
    .attachFiles([attachment])
    .setImage('attachment://graph.png')
  this.channel.send(embed).catch()
}