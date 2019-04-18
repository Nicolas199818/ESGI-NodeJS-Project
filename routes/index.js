var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  myConnect();
  res.render('index', { title: 'Nodes-API' });
});



module.exports = router;


function myConnect(){
  const MongoClient = require('mongodb').MongoClient;
  const assert = require('assert');

  (async function() {
  // Connection URL
  const url = 'mongodb://localhost:27017/notes-api';
  // Database Name
  const dbName = 'notes-api';
  const client = new MongoClient(url);

  try {
    // Use connect method to connect to the Server
    await client.connect();

    const db = client.db(dbName);
  } catch (err) {
    console.log(err.stack);
  }

  client.close();
})();
}
