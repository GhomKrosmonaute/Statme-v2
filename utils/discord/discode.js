const YAML = require('json-to-pretty-yaml')
const TOML = require('json2toml')

/**
 * Get code between tags
 * @param {object|string|number} code Automatically converted to data language.
 * @param {string} [lang] Data language (json)
 * @returns {string} code between tags
 */
module.exports = function (code, lang = 'json') {
  if(typeof code === 'object'){
    if(/ya?ml/i.test(lang)) code = YAML.stringify(code)
    if(/to?ml/i.test(lang)) code = TOML(code)
    if(/json/i.test(lang)) code = JSON.stringify(code,null,2)
  }
  return '```' + lang + '\n' + String(code).trim() + '\n```'
}