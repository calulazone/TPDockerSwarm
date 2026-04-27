
### Partie A

#### Comment récupérez-vous le hostname dans Node.js ?
On récupère le hostname de cette façon : ```bash os.hostname()```

#### Quelle différence entre “listening on [localhost](http://localhost)” et “0.0.0.0” dans un conteneur ?
Localhost pointe uniquement vers la machine utilisée et est accessible que depuis l'intérieur du conteneur tandis que 0.0.0.0 écoute sur toutes les interfaces reseau du conteneur et peut être accessible depuis l'extérieur.

#### Quels fichiers doivent absolument être ignorés ? Pourquoi ?
Les fichiers à ignorer sont : 
- Les nodes modules car ils sont recréés dans l'image
- Le .env car c'est privé
- Les fichiers en lien avec Git

#### Comment valider que votre image finale ne contient pas d’artefacts de dev ?
On peut par exécuter une commande et regarder ensuite la présence de ces artefacts. ```bash docker run --rm -it mon-image sh```.
On pourrait également utiliser un outil spécialisé comme Dive.

### API Endpoints

- `GET /` : Retourne le hostname du conteneur au format JSON
- `GET /health` : Retourne un statut OK pour les probes de santé

### Tests

```bash
npm test
```

Les tests vérifient :
- Le endpoint `/` retourne le hostname correct au format JSON
- Le endpoint `/health` retourne le statut OK avec le code HTTP 200

### Docker

#### Build et exécution

```bash
# Build de l'image
docker build -t tp-docker-swarm .

# Exécution du conteneur
docker run -d -p 3000:3000 tp-docker-swarm
```

#### Docker Compose

```bash
# Démarrage avec docker-compose
docker-compose up -d

# Arrêt
docker-compose down
```

#### Fonctionnalités Docker

- **Multi-stage build** : Optimisation de la taille de l'image
- **Utilisateur non-root** : Sécurité renforcée
- **Health check intégré** : Vérification automatique de la santé du conteneur
- **Port configurable** : Via la variable d'environnement `PORT` (actuellement 3000)