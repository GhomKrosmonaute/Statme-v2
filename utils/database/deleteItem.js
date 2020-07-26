/**
 * @param {Connection} db
 * @param {string} table
 * @param {string} id
 * @returns {Promise<void>}
 */
async function deleteItem( db, table, id ){
  await query( db, "DELETE FROM `" + table + "` WHERE `id` = ?", [id])
}

module.exports = deleteItem