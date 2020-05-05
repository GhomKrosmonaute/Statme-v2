
const { Collection } = require('discord.js')
const { TIME } = require('./enums')
const queryBuilder = require('./queryBuilder')
const { readdir } = require('fs').promises
const path = require('path')

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
      const commandDir = await readdir(path.resolve(__dirname,'../commands'))
      for(const commandFile of commandDir){
        const commandName = commandFile.replace(/\.js$/,'')
        const command = require(path.resolve(__dirname,'../commands',commandFile))
        client.commands.set(commandName,command)
      }
      client.ready = true
      console.log('Client Ready')
    }catch(error){
      console.log('Client Error',error.message)
    }
  })
  
  client.on('message', async message => {
    
    if(message.system || !message.guild) return
    
    // match emojis
    const emojiMatch = /<a?:\w+:\d+>/g.exec(message.content)
    
    // prepare insert data
    const post = {
      id: message.id,
      user_id: message.author.id,
      guild_id: message.guild.id,
      channel_id: message.channel.id,
      content_length: message.content.length,
      word_count: message.content.split(/\s+/).length,
      emote_count: emojiMatch ? emojiMatch.length : 0,
      mention_count: message.mentions.members.size,
      has_everyone: message.mentions.everyone,
      has_embed: message.embeds.length > 0,
      has_url: /https?:\/\/.+/i.test(message.content)
    }
    
    // insert to database
    db.query('INSERT INTO message SET ?', post, async error => {
      if(error) console.error(error)
      if(Date.now() > client.refresh + TIME.DAY){
        client.refresh = Date.now()
        const total = await queryBuilder( db, {
          select: 'count(*)', auto: true
        })
        const surplus = total - 100000000
        if(surplus > 0){
          db.query('DELETE FROM `message` ORDER BY `created_timestamp` ASC LIMIT ' + surplus, (err, res) => {
            if(err) console.error(err); console.log('DELETED',res)
          })
        }
      }
    })
  
    // handle commands
    if(!client.ready || message.author.bot) return
    const userCommand = commandParser(message)
    if(!userCommand) return
    const command = client.commands.get(userCommand.name)
    try{
      if(command) command.bind(message)(userCommand.args)
    }catch(error){
      message.channel.send(`Une erreur est survenue avec la Kommande ${userCommand.name}: ${error.message}`)
    }
    
  })
  
  return client
}

module.exports = initClient