var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
//On configure le programme avec les variables d'envirronement
const url = process.env.MONGODB_URI || "mongodb://localhost:27017/notes-api";
const JwtCle = process.env.JWT_KEY || 'secret';

router.post('/',function(req,res,next){
  //res.render('signup', { title: 'Notes-Pages' });
  if(req.body.password.length < 4){
    res.status(400).send({error: 'Le mot de passe doit contenir au moins 4 caractères'});
  }
  else if(!checkUser(req.body.user)){
    res.status(400).send({error: 'Votre identifiant ne doit contenir que des lettres minuscules non accentuées'});
  }
  else if(req.body.user.length <2 || req.body.user.length > 20){
    res.status(400).send({error: 'Votre identifiant doit contenir entre 2 et 20 caractères'})
  }
  else{
    signupFunction(req.body.user,req.body.password,res);
  }


});

module.exports = router;

function signupFunction(user,password,res){
  const MongoClient = require('mongodb').MongoClient;
  const assert = require('assert');
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
    if(await myCol.findOne({username:user})){
      res.status(400).send({error: 'Cet identifiant est déjà associé à un compte'});
    }
    else{
      await myCol.insertOne(myobj);
      const JWTToken = jwt.sign({
        email: user.email,
        _id: user._id
      },
      JwtCle,
       {
         expiresIn: '2h'
       });
       res.status(200).json({
          success: 'Welcome to the JWT Auth',
          token: JWTToken
        });
      res.send({error:"null",token:JWTToken});
    }
  } catch (err) {
    console.log(err.stack);
  }

  client.close();
})();
}

//On écris cette fonction pour checker que le mot est écris de lettre en a-z.
function checkUser(user){
  if(/^[a-z]+$/.test(user)){
      return true;
  }
  else {
     return false;
  }
}

/*function myConnect(){
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
}*/


//Etape n°1 : Réussir à créer un utilisateur dans la base de donnée.
  //Objectif 1 : Se connecter à la base au moment où le post est envoyé.
  //Objectif 2 : Réussir à creer un user test dans la base au moment du post.
  //Objectif 3 : Creer le user avec les informations que nous fournit l'utilisateur.
