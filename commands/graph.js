const { MessageEmbed, MessageAttachment } = require('discord.js')
const moment = require('moment')
const resolveType = require('../utils/resolveType')
const getStats = require('../utils/getStats')
const getGraphic = require('../utils/getGraphic')
const discode = require('../utils/discord/discode')
const { TIME } = require('../utils/enums')
const secret = require('../secret.json')

function resolveT(T){
  const key = Object.keys(TIME).find( k => {
    return k.startsWith(T.toUpperCase())
  })
  return {
    key, value: TIME[key]
  }
}

const idRegex = /--?i(?:d)?\s+(\d+)/i
const nameRegex = /--?n(?:ame)?\s+(?:([^"\s]+)|(?:"(.+)"))(?:\s|$)/i
const lastRegex = /--?l(?:ast)?\s+(?:(\d+)\s+)?([YMW])/i
const byRegex = /--?by?\s+([MWD])/i
const allRegex = /--?a(?:ll)?/i
// TODO: type regex

async function graph( args ) {
  
  const options = {}
  
  let resolvable
  if(idRegex.test(args)){
    resolvable = idRegex.exec(args)[1].trim()
  }else if(nameRegex.test(args)) {
    const match = nameRegex.exec(args)
    resolvable = (match[1]||match[2]).trim()
  }
  
  // TODO: use type regex
  const id = await query( this.client.db, `
    SELECT
      guild.id as guild_id,
      
    FROM message
    LEFT JOIN
  `)
  
  // TODO: if type === ? then do that
  const resolved = (
    this.client.guilds.cache.get(id) ||
    await this.client.channels.fetch(id, false) ||
    await this.client.users.fetch(id, false)
  )
  
  const item = resolved || this.author
  const type = resolveType(item)
  
  if(allRegex.test(args)) {
    options.all = true
    options.to = Date.now()
  
  }else{
    if(lastRegex.test(args)) {
      let [,times,T] = lastRegex.exec(args)
      if(!times) times = 1
      options.from = Date.now() - (resolveT(T).value * times)
      options.to = Date.now()
    }
  }
  
  if(byRegex.exec(args)) {
    const T = byRegex.exec(args)[1]
    options.per = resolveT(T).key
  }
  
  const url = secret.baseURL + '/dashboard/' + item.id
  const apiURL = secret.baseURL + '/api/' + item.id
  
  const stats = await getStats( this.client.db, item, type, options)
  const buffer = getGraphic(stats).toBuffer()
  const attachment = new MessageAttachment(buffer, 'graph.png')
  
  const optionsToShow = {
    name: item.name || item.username,
    from: moment(stats.from).format('DD MMMM YYYY'),
    to: moment(stats.to).format('DD MMMM YYYY'),
    per: stats.per
  }
  
  const statsToShow = {
    total: stats.total,
    average: stats.average,
    min: stats.min,
    max: stats.max
  }
  
  const embed = new MessageEmbed()
    .setAuthor(
      `${type[0].toUpperCase()+type.slice(1)} Graph | ${optionsToShow.name}`,
      item.avatarURL ? item.avatarURL({ dynamic:true }) : (
        item.iconURL ? item.iconURL({ dynamic:true }) : (
          this.client.user.avatarURL({ dynamic:true })
        )
      ),
      url
    )
    .setDescription(
      `You can get better statistic on [website](${secret.baseURL}) or by [API](${apiURL}) usage.\n` +
      `Git repository: https://github.com/CamilleAbella/Statme-v2`
    )
    .attachFiles([attachment, 'public/images/shell.png'])
    .setImage('attachment://graph.png')
    .addField(`Statistics by ${optionsToShow.per.toLowerCase()}:`, discode(statsToShow,'yml'), true)
    .addField('Options:', discode(optionsToShow,'yml'), true)
    .setColor('')
    .setFooter(
      '([[--id|-i] <id>] | [[--name|-n] (<name>|"<spaced name>")]) [--last|-l [<times>] <Y|M|W>] [--by|-b <M|W|D>] [--all|-a]',
      'attachment://shell.png'
    )
  this.channel.send(embed).catch()
}

module.exports = graph