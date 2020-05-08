const { MessageEmbed, MessageAttachment } = require('discord.js')
const YAML = require('json-to-pretty-yaml')
const moment = require('moment')
const getUserStats = require('../utils/getUserStats')
const getGraphic = require('../utils/getGraphic')
const discode = require('../utils/discode')
const { TIME } = require('../utils/enums')
const secret = require('../secret.json')

moment.locale('fr')

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
    options.from = 1578383060000
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
  
  let target = this.author
  if(user.length > 2) target = (
    this.mentions.members.first() ||
    this.mentions.users.first() ||
    this.guild.members.cache.find( member => {
      return member.displayName.toLowerCase()
        .includes(user.toLowerCase())
    }) || this.client.users.cache.find( u => {
      return u.username.toLowerCase()
        .includes(user.toLowerCase())
    }) || this.author
  )
  
  const url = secret.baseURL + '/dashboard/user/' + target.id
  const apiURL = secret.baseURL + '/api/user/' + target.id
  
  const stats = await getUserStats( this.client.db, target, options)
  const buffer = getGraphic(stats, {width: 450, height: 200}).toBuffer()
  const attachment = new MessageAttachment(buffer, 'graph.png')
  
  delete stats.rates
  delete stats.per
  const optionsToShow = {}
  for(const key in options){
    if(key === 'to' || key === 'from')
      optionsToShow[key] = moment(options[key]).fromNow()
    else optionsToShow[key] = options[key]
  }
  
  const embed = new MessageEmbed()
    .setAuthor(
      `Graph | ${target.username || target.user.username}`,
      target.avatarURL ?
        target.avatarURL({ dynamic:true }) :
        target.user.avatarURL({ dynamic:true }),
      url
    )
    .setDescription(`You can get better statistic on [website](${secret.baseURL}) or by [API](${apiURL}) usage.`)
    .attachFiles([attachment])
    .setImage('attachment://graph.png')
    .addField('Statistics:', discode(YAML.stringify(stats),'yml'), true)
    .addField('Options:', discode(YAML.stringify(optionsToShow),'yml'), true)
    .setFooter(
      '[[--user|-u] <name>] [--last|-l [<times>] <Y|M|W>] [--by|-b <M|W|D>] [--all|-a]',
      this.client.user.avatarURL({ dynamic:true })
    )
  this.channel.send(embed).catch()
}

module.exports = graph