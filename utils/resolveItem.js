
/**
 * @param {module:"discord.js".Client} client
 * @param {string} [resolvable]
 * @returns {DiscordItem|void|null}
 */
module.exports = function resolveItem( client, resolvable ){
  if(!resolvable || resolvable.length < 3) return
  resolvable = resolvable.toLowerCase()
  return (
    client.guilds.resolve(resolvable) ||
    client.channels.resolve(resolvable) ||
    client.users.resolve(resolvable) ||
    client.guilds.cache.find( guild => {
      return guild.name.toLowerCase()
        .includes(resolvable) }) ||
    client.channels.cache.find( channel => {
      if(channel.type !== 'text') return
      return channel.name.toLowerCase()
        .includes(resolvable) }) ||
    client.users.cache.find( user => {
      return (
        user.username.toLowerCase().includes(resolvable) ||
        user.tag === resolvable
      )
    })
  )
}