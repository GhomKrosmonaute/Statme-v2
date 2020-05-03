
const asyncQuery = require('./asyncQuery')

/**
 * Messages query builder
 * @param {Connection} db
 * @param {Object} [options]
 * @param {string} [options.select]
 * @param {string[]} [options.sortBy]
 * @param {number} [options.limit]
 * @param {Object|string} [options.where]
 * @param {boolean} [options.auto]
 * @param {Array} [options.values]
 * @returns {Promise<any>}
 */
function queryBuilder(db, options = {} ){
  
  const select = 'SELECT ' + (options.select || '*') + ' FROM messages'
  const sortBy = options.sortBy ? 'ORDER BY ' + options.sortBy.join(', ') : ''
  const limit = options.limit ? 'LIMIT ' + options.limit : ''
  const where = options.where ? 'WHERE ' + (
    typeof options.where === 'string' ?
      options.where :
      Object.keys(options.where).map( key => {
        return key + ' = ?'
      }).join(' AND ')
  ) : ''
  
  const sql = `${select} ${where} ${sortBy} ${limit}`.trim()
  const values = !!where ? (
    typeof options.where === 'string' ?
      options.values || [] :
      Object.values(options.where)
  ) : []
  
  return asyncQuery( db, sql, values, options )
  
}

module.exports = queryBuilder

