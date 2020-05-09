const { MessageEmbed, MessageAttachment } = require('discord.js')
const YAML = require('json-to-pretty-yaml')
const moment = require('moment')
const getUserStats = require('../utils/getUserStats')
const getGraphic = require('../utils/getGraphic')
const discode = require('../utils/discode')
const { TIME } = require('../utils/enums')
const secret = require('../secret.json')

moment.locale('en')

function resolveT(T){
  const key = Object.keys(TIME).find( k => {
    return k.startsWith(T.toUpperCase())
  })
  return {
    key, value: TIME[key]
  }
}

async function graph(args) {
  
  const options = {}
  
  const userRegex = /--?u(?:ser)?\s+([^-]+)/i
  const lastRegex = /--?l(?:ast)?\s+(?:(\d+)\s+)?([YMW])/i
  const byRegex = /--?by?\s+([MWD])/i
  const allRegex = /--?a(?:ll)?/i
  
  let user = ''
  if(userRegex.test(args)) {
    user = userRegex.exec(args)[1].trim()
    options.user = user
  }
  
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
  
  const target = user.length > 2 ? (
    this.mentions.members.first() ||
    this.mentions.users.first() ||
    this.guild.members.cache.find( member => {
      return member.displayName.toLowerCase()
        .includes(user.toLowerCase())
    }) || this.client.users.cache.find( u => {
      return u.username.toLowerCase()
        .includes(user.toLowerCase())
    }) || this.author
  ) : this.author
  
  const url = secret.baseURL + '/dashboard/user/' + target.id
  const apiURL = secret.baseURL + '/api/user/' + target.id
  
  const stats = await getUserStats( this.client.db, target, options)
  const buffer = getGraphic(stats).toBuffer()
  const attachment = new MessageAttachment(buffer, 'graph.png')
  
  const optionsToShow = {
    user: target.username || target.user.username,
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
      `Graph | ${optionsToShow.user}`,
      target.avatarURL ?
        target.avatarURL({ dynamic:true }) :
        target.user.avatarURL({ dynamic:true }),
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
      '[[--user|-u] <name>] [--last|-l [<times>] <Y|M|W>] [--by|-b <M|W|D>] [--all|-a]',
      'attachment://shell.png'
    )
  this.channel.send(embed).catch()
}

module.exports = graph