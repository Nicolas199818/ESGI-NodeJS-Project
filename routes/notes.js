var express = require('express');
var router = express.Router();

const fs = require('fs');
const jwt = require('jsonwebtoken');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// URL de connexion
const url = 'mongodb://localhost:27017/notes-api';
// Nom de la base
const dbName = 'notes-api';

router.delete('/:id', function(req, res, next) {
  
  var idUser = "" //Récupération de l'id par obtenue grâce a la connexion
  const noteId = req.params.id.split('id=')[1]; //Récupération de l'id de la note obtenue lors de la requête

  async function() {

      const client = new MongoClient(url);
      await client.connect();

      try {
        const token = req.get('x-access-token');
        await jwt.verify(token, JWT_KEY, async function(err, decoded){
          if(err){
            res.status(401).send({error: "Utilisateur non connecté", note: {}})
          }else{
            const db = client.db(dbName);
            const col = db.collection('notes');
            docs.findOne({_id:ObjectId(noteId)}).toArray()
            if(docs.userId != idUser){
               res.status(403).send({error: "Accès non autorisé à cette note", note: {}})
            }
            if(!await docs.deleteOne({_id:ObjectId(noteId), userId: ObjectId(idUser) })){
               res.status(404).send({error: "Cet identifiant est inconnu", note: {}})
            }
            else{
                res.status(200).send({error: null});
            }

          } 
        });    
      } catch (err) {
       console.log(err.stack);
      }
      client.close();
      } 
});

router.patch('/:id', function(req, res, next) {
  
  const idUser = "" //Récupération de l'id par obtenue grâce a la connexion
  const noteId = req.params.id.split('id=')[1]; //Récupération de l'id de la note obtenue lors de la requête
  var currentTime = getDateDay();
  const newNote = req.body.content;

  async function() {

    const client = new MongoClient(url);
    await client.connect();

    try {
      const token = req.get('x-access-token');
      await jwt.verify(token, JWT_KEY, async function(err, decoded){
        if(err){
          res.status(401).send({error: "Utilisateur non connecté", note: {}})
        }else{
          const db = client.db(dbName);
          const col = db.collection('notes');
          docs.findOne({_id:ObjectId(noteId)}).toArray()
          if(docs.userId != idUser){
            res.status(403).send({error: "Accès non autorisé à cette note", note: {}})
          }
          if(!await docs.deleteOne({_id:ObjectId(noteId), userId: ObjectId(idUser)})){
            res.status(404).send({error: "Cet identifiant est inconnu", note: {}})            }
          else{
            await db.collection('notes').update(
                        { _id: ObjectId(noteId) },
                        {
                          $set: {
                            content: newNote,
                            lastUpdatedAt: getDateDay()
                          }
                        });
                      const updatedNote = await db.collection('notes').find({ _id: ObjectId(noteId) }).toArray();
                      res.status(200).send({error: null, note: updatedNote});
          }
        } 
      });    
    } catch (err) {
     console.log(err.stack);
    }
    client.close();
  }
}); 

function getDateDay(){
      var today = new Date();

      var seconds = today.getSeconds();
      var minutes = today.getMinutes();
      var hours = today.getHours();
      var day = today.getDate();
      var month = today.getMonth() + 1;
      var year = today.getFullYear();

      if (day < 10) {
        day = '0' + day;
      }
      if (month < 10) {
        month = '0' + month;
      }
      var todayAsString = day + '/' + month + '/' + yyyy + ' ' + hours + ':' + minutes + ':' + seconds;
      return todayAsString;
}
router.get('/', function(req, res, next) {
  //Objectif 1 : Checker s'il y a un token dans l'entête. S'il n'y a pas de tocken --> une erreur.

});

function signupFunction(user,password,res){
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

module.exports = router;