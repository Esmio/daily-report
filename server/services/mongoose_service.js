const mongoose = require('mongoose');

const uri = 'mongodb://127.0.0.1:27017/daily_report';

mongoose.Promise = global.Promise;

mongoose.set('useFindAndModify', false);

mongoose.connect(process.env.MONGO_URI || uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.on('open', () => {
  console.log('connected!');
})