
module.exports = function (code, lang = 'json') {
  return '```' + lang + '\n' + code + '\n```'
}