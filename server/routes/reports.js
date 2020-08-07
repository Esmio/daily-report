const express = require('express');
const router = express.Router();
const auth = require('../middelwares/auth_user');
const Errors = require('../errors');

const Report = require('../models/mongo/report');

router.route('/create')
  .post(auth(), (req, res, next) => {
    (async () => {
      const { userId, content } = req.body;
      const created = await Report.create({
        userId,
        content,
      })
      return {
        code: 0,
        data: {
          created,
        }
      }    
    })()
      .then(r => {
        res.header('Access-Control-Allow-Origin', ['*']);
        res.json(r);
      })
      .catch(e => {
        console.log('post /api/report/create')
      })
  })

  module.exports = router;