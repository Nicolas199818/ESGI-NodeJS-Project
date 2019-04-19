var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const url = process.env.MONGODB_URI || "mongodb://localhost:27017/notes-api";
const JwtCle = process.env.JWT_KEY || 'secret';

/* GET users listing. */
router.get('/', function(req, res, next) {
  //Objectif 1 : Checker s'il y a un token dans l'entête. S'il n'y a pas de tocken --> une erreur.
  const token = req.get('x-access-token');

  try{
    var decode = jwt.verify(token,JwtCle);
    getNotesFunction(user,password,res,decode)
  }catch(err){
    res.status(403).send({error:"Utilisateur non connecte"});
  }


});

module.exports = router;


function getNotesFunction(user,password,res,decode){
  /*const MongoClient = require('mongodb').MongoClient;
  const assert = require('assert');
  // Database Name
  const dbName = 'notes-api';

  (async function() {

  const client = new MongoClient(url);

  try {
    // Use connect method to connect to the Server
    await client.connect();
    const db = client.db(dbName);
    //On chercher la liste des notes avec le userame
    //On récupère le username
    var username = decode.userName
    //Maintenant, on prend la liste de notes avec le username.



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
})();*/
}
