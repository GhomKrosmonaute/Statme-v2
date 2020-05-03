const queryBuilder = require('./queryBuilder')
const getUserRate = require('./getUserRate')

async function getUserStats( db, user ){
  
  const dayDuration = 1000 * 60 * 60 * 24
  
  const total = await queryBuilder( db, {
    select: 'COUNT(*) AS total',
    auto: true
  })
  
  const rates = {
    total: {
      day: await getUserRate( db, user, { total: true } ),
      week: await getUserRate( db, user, { total: true, by: dayDuration * 7 } ),
      month: await getUserRate( db, user, { total: true, by: dayDuration * 31 } ),
      year: await getUserRate( db, user, { total: true, by: dayDuration * 365 } )
    },
    each: {
      day: await getUserRate( db, user ),
      week: await getUserRate( db, user, { by: dayDuration * 7 } ),
      month: await getUserRate( db, user, { by: dayDuration * 31 } ),
      year: await getUserRate( db, user, { by: dayDuration * 365 } )
    }
  }
  
  return {
    total,
    rates
  }
  
}

module.exports = getUserStats
