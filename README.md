# ESGI-NodeJS-Project

Ce projet correspond à une API de gestion de notes.

## Installation
Pour modifier l'api en fonction de vos besoins :

Cloner la repository git :

```git clone https://github.com/Nicolas199818/ESGI-NodeJS-Project.git```

Afin de pouvoir tester, vous pouvez utilisez docker pour la base de données mongodb.

Etape 1 : Télécharger l'image docker mongodb

```docker pull mongo:4```

Etape 2 : Exécuter le serveur mongodb

```docker run --rm --publish 27017:27017 --name nodejs-ex-2-1 mongo:4```
