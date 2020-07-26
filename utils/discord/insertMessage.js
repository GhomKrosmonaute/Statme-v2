const insert = require('../database/insert')

/**
 * insertMessage and return insertion index
 * @param {Connection} db
 * @param {Message} message
 * @returns {Promise<number>} Message insertion index
 */
async function insertMessage( db, message ){
  
  const user_index = await insert( db, 'user', {
    id: message.author.id,
    username: message.author.username,
    bot: !!message.author.bot,
    created_timestamp: message.author.createdTimestamp
  })
  
  const guild_index = await insert( db, 'guild', {
    id: message.guild.id,
    name: message.guild.name,
    created_timestamp: message.guild.createdTimestamp
  })
  
  const member_index = await insert( db, 'member', {
    user_index,
    guild_index,
    id: message.member.id,
    display_name: message.member.displayName,
    created_timestamp: message.member.joinedTimestamp
  })
  
  const channel_index = await insert( db, 'channel', {
    guild_index,
    id: message.channel.id,
    name: message.channel.name,
    created_timestamp: message.channel.createdTimestamp
  })

  return await insert( db, 'message', {
    member_index,
    channel_index,
    id: message.id,
    length: message.content.length,
    words: message.content.split(/\s+/).length,
    created_timestamp: message.createdTimestamp
  })
  
}

module.exports = insertMessage;