var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  //Objectif 1 : Checker s'il y a un token dans l'entête. S'il n'y a pas de tocken --> une erreur.

});

module.exports = router;


function signupFunction(user,password,res){
  const MongoClient = require('mongodb').MongoClient;
  const assert = require('assert');
  // Connection URL
  const url = 'mongodb://localhost:27017/notes-api';
  // Database Name
  const dbName = 'notes-api';

  (async function() {

  const client = new MongoClient(url);

  try {
    // Use connect method to connect to the Server
    await client.connect();
    const db = client.db(dbName);
    //On stocke d'abord la connexion.
    //On check si le nom existe dans la base.
    //Si oui erreur. Si non on insère.

    var myobj = { username: user, password: password };
    var myCol = db.collection("users");
    if(!await myCol.findOne({username:user})){
      res.status(400).send({error: 'Cet identifiant est inconnu'})
    }
    else{
      const JWTToken = jwt.sign({
        email: user.email,
        _id: user._id
      },
      'secret',
       {
         expiresIn: '2h'
       });
       res.status(200).json({
          success: 'Welcome to the JWT Auth',
          token: JWTToken
        });
    }
  } catch (err) {
    console.log(err.stack);
  }

  client.close();
})();
}
