const express = require('express')
const router = express.Router()
require('./routes/customer')(router)
require('./routes/creditor')(router)
require('./routes/purchase')(router)
require('./routes/sales')(router)
require('./routes/product')(router)
require('./routes/pettySales')(router)
require('./routes/suspense')(router)
require('./routes/address')(router)
require('./routes/creditDue')(router)
require('./routes/credit')(router)
require('./routes/account')(router)
require('./routes/tally')(router)

module.exports = router
