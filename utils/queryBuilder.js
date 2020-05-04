
const asyncQuery = require('./asyncQuery')

/**
 * Messages query builder
 * @param {Connection} db
 * @param {Object} [options]
 * @param {string} [options.select]
 * @param {string[]} [options.order]
 * @param {number} [options.limit]
 * @param {(Where|Object.<string,*>)[]|Where|Object.<string,*>|string} [options.where]
 * @param {boolean} [options.auto]
 * @param {Array} [options.values]
 * @returns {Promise<any>}
 */
function queryBuilder(db, options = {} ){
  
  const values = []
  const select = 'SELECT ' + (options.select || '*') + ' FROM message'
  const order = options.order ? 'ORDER BY ' + options.order.join(', ') : ''
  const limit = options.limit ? 'LIMIT ' + options.limit : ''
  
  let where = ''
  if(options.where){
    if(Array.isArray(options.where)){
      where = 'WHERE ' + options.where.map( w => {
        if(w.column){
          values.push(w.value)
          return `${w.column} ${w.operator || '='} ?`
        }else if(
          typeof w === 'object' &&
          Object.keys(w).length === 1
        ){
          const key = Object.keys(w)[0]
          values.push(w[key])
          return `${key} = ?`
        }
      }).join(' AND ')
    }else if(options.where.column){
      where = `WHERE ${options.where.column} ${options.where.operator || '='} ?`
    }else if(typeof options.where === 'object'){
      where = 'WHERE ' + Object.entries(options.where).map( entry => {
        values.push(entry[1])
        return `${entry[0]} = ?`
      }).join(' AND ')
    }else if(typeof options.where === 'string'){
      where = `WHERE ${options.where}`
    }else{
      throw TypeError('bad options.where format')
    }
  }
  
  const sql = `${select} ${where} ${order} ${limit}`
  
  return asyncQuery( db, sql, values, options )
  
}

module.exports = queryBuilder

