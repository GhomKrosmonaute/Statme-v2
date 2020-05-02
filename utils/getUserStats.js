const getMessages = require('./getMessages')
const getUserRate = require('./getUserRate')

module.exports = async function getUserStats( db, user ){
  
  const dayDuration = 1000 * 60 * 60 * 24
  
  const total = await getMessages( db, {
    select: 'COUNT(*) AS total',
    auto: true
  })
  
  const rates = {
    day: await getUserRate( db, user ),
    week: await getUserRate( db, user, { by: dayDuration * 7 } ),
    month: await getUserRate( db, user, { by: dayDuration * 31 } ),
    year: await getUserRate( db, user, { by: dayDuration * 365 } )
  }
  
  return {
    total,
    rates
  }
  
}
