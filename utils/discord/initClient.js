
const { Collection } = require('discord.js')
const { readdir } = require('fs').promises
const path = require('path')
const deleteItem = require('../database/deleteItem')
const update = require('../database/update')
const insertMessage = require('./insertMessage')

const prefix = '//'

const commandParser = message => {
  if(!message.content.startsWith(prefix)) return false
  const command = message.content.slice(prefix.length)
  const name = command.split(/\s+/)[0]
  const args = command.replace(name,'').trim()
  return { name: name.toLowerCase(), args, message }
}

/**
 * Set listeners
 * @param {module:"discord.js".Client} client
 * @param {Connection} db
 * @returns {module:"discord.js".Client}
 */
function initClient( client, db ){
  
  client.db = db
  client.refresh = Date.now()
  
  client.once('ready', async () => {
    client.commands = new Collection()
    try{
      const commandDir = await readdir(path.resolve(__dirname,'../../commands'))
      for(const commandFile of commandDir){
        const commandName = commandFile.replace(/\.js$/,'')
        const command = require(path.resolve(__dirname,'../../commands',commandFile))
        client.commands.set(commandName,command)
      }
      client.ready = true
      console.log('Client Ready')
    }catch(error){
      console.log('Client Error',error.message)
    }
  })
  
  client.on('message', async message => {
  
    if(!client.ready || message.system || !message.guild) return
  
    await insertMessage( db, message )
  
    // handle commands
    if(message.author.bot) return
    const userCommand = commandParser(message)
    if(!userCommand) return
    const command = client.commands.get(userCommand.name)
    try{
      if(command) command.bind(message)(userCommand.args)
    }catch(error){
      message.channel.send(`Error occurred on **${userCommand.name}** command: ${error.message}`)
    }
    
  })
  
  client.on('channelDelete', async channel => {
    await deleteItem( db, 'channel', channel.id)
  })
  
  client.on('guildDelete', async guild => {
    await deleteItem( db, 'guild', guild.id)
  })
  
  client.on('guildMemberRemove', async member => {
    await deleteItem( db, 'member', member.id)
  })
  
  client.on('messageDelete', async message => {
    await deleteItem( db, 'message', message.id)
  })
  
  client.on('userUpdate', async (oldUser, newUser) => {
    if(oldUser.username !== newUser.username)
      await update( db, 'user', { username: newUser.username })
  })
  
  client.on('channelUpdate', async (oldChannel, newChannel) => {
    if(oldChannel.name !== newChannel.name)
      await update( db, 'channel', { name: newChannel.name })
  })
  
  client.on('guildMemberUpdate', async (oldMember, newMember) => {
    if(oldMember.displayName !== newMember.displayName)
      await update( db, 'member', { display_name: newMember.displayName })
  })
  
  client.on('guildUpdate', async (oldGuild, newGuild) => {
    if(oldGuild.name !== newGuild.name)
      await update( db, 'guild', { name: newGuild.name })
  })
  
  return client
}

module.exports = initClient