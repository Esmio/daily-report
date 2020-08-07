const express = require('express');
const router = express.Router();
const reportsRouter = require('./reports');

router.use('/report', reportsRouter);

module.exports = router;