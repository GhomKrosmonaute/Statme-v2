
const Discord = require('discord.js')

/**
 * @param {DiscordItem} item
 * @returns {?ItemType}
 */
module.exports = function resolveType( item ){
  if(item instanceof Discord.User) return 'user'
  if(item instanceof Discord.Guild) return 'guild'
  if(item instanceof Discord.TextChannel) return 'channel'
}