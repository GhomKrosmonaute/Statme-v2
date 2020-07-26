
const Discord = require('discord.js')

module.exports = function resolveType( item ){
  if(item instanceof Discord.User) return 'user'
  if(item instanceof Discord.Guild) return 'guild'
  if(item instanceof Discord.GuildMember) return 'member'
  if(item instanceof Discord.TextChannel) return 'channel'
}