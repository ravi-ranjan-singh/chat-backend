const Cryptr = require("cryptr")

module.exports = decyptId = (id) => new Cryptr('myTotalySecretKey').decrypt(id)


