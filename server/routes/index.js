var express = require('express');
var router = express.Router();

const User = require('../models/mongo/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', (req, res, next) => {
  (async () => {
    const { username, password } = req.body;
    const user = await User.login(username, password);
    const now = Date.now();
    const token = await JWT.sign({
      _id: user._id,
      iat: now,
      expire: now + 24 * 60 * 60 * 1000,
    }, JWT_SECRET);
    return {
      code: 0,
      data: {
        user,
        token
      }
    }
  })()
    .then(r => {
      res.header('Access-Control-Allow-Origin', ['*']);
      res.json(r);
    })
    .catch(e => {
      console.error('post /login', e)
      next(e)
    })
})

module.exports = router;
