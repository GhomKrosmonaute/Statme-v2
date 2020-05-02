
const asyncQuery = require('./asyncQuery')

/**
 * Messages query generator
 * @param db
 * @param {Object} [options]
 * @param {string} [options.select]
 * @param {string[]} [options.sortBy]
 * @param {number} [options.limit]
 * @param {Object} [options.where]
 * @param {boolean} [options.auto]
 * @returns {Promise<any>}
 */
module.exports = async function getMessages( db, options = {} ){
  
  const select = 'SELECT ' + (options.select || '*') + ' FROM messages'
  const sortBy = options.sortBy ? 'ORDER BY ' + options.sortBy.join(', ') : ''
  const limit = options.limit ? 'LIMIT ' + options.limit : ''
  const where = options.where ? 'WHERE ' + Object.keys(options.where).map( key => {
    return key + ' = ?'
  }).join(' AND ') : ''
  
  const sql = `${select} ${where} ${sortBy} ${limit}`.trim()
  const values = !!where ? Object.values(options.where) : []
  
  return asyncQuery( db, sql, values, options )
  
}

