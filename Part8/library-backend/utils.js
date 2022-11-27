const crypto = require('crypto')

function genId() {
  return crypto.randomUUID()
}

module.exports = { genId }
