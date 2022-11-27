const conf = require('./conf')

// eslint-disable-next-line import/order
const jwt = require('jsonwebtoken')

function getTokenPayload(header) {
  const [type, token] = header?.split(' ') || []

  if (type?.toLowerCase() !== 'bearer' || !token) return null

  try {
    return jwt.verify(token, conf.JWT_SECRET_KEY)
  } catch {
    return null
  }
}

module.exports = {
  getTokenPayload,
}
