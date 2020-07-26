
const asyncQuery = require('./asyncQuery')

/**
 * Messages query builder
 * @param {Connection} db
 * @param {Object} [options]
 * @param {string} [options.select]
 * @param {string} options.from
 * @param {string[]} [options.order]
 * @param {string} [options.group]
 * @param {number} [options.limit]
 * @param {(WhereBetween|Where|Object.<string,*>)[]|Where|WhereBetween|Object.<string,*>|string} [options.where]
 * @param {boolean} [options.auto]
 * @returns {Promise<any>}
 */
function queryBuilder(db, options = {} ){
  
  const values = []
  const select = 'SELECT ' + (options.select.replace(/\w+/g,(fm)=>'`'+fm+'`') || '*')
  const from = 'FROM `' + options.from + '`'
  const order = options.order ? 'ORDER BY ' + options.order.join(', ') : ''
  const group = options.group ? 'GROUP BY ' + options.group : ''
  const limit = options.limit ? 'LIMIT ' + options.limit : ''
  
  let where = ''
  if(options.where){
    if(Array.isArray(options.where)){
      where = 'WHERE ' + options.where.map( w => {
        if(typeof w !== 'object')
          throw Error('bad options.where format')
        if(w.column && w.value) {
          values.push(w.value)
          return `${w.column} ${w.operator || '='} ?`
        }else if(w.column && w.values){
          values.push(...w.values)
          return `${w.column} BETWEEN ? AND ?`
        }else if(Object.keys(w).length === 1){
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
  
  const sql = `
    ${select}
    ${from}
    ${where}
    ${group}
    ${order}
    ${limit}
  `
  
  return asyncQuery( db, sql, values, options )
  
}

module.exports = queryBuilder

