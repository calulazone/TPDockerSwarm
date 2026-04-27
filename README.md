
## Partie A

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

#### Quelle stratégie de tags adoptez-vous : latest, SHA, semver ?
On utilise latest et sha, latest pour développer/tester et sha pour déployer sur Swarm

#### Pourquoi un tag immuable est préférable pour un déploiement fiable ?
Un tag immuable comme le SHA garantit que chaque nœud Swarm pull exactement la même image, peu importe le moment. Cela rend les déploiements reproductibles et les rollbacks précis.







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


## Partie D

```
GitHub (push main)
        |
        v
GitHub Actions
        |
        |-- 1. Build & Push --> Docker Hub
        |-- 2. Tests Jest
        |-- 3. SSH via Tailscale --> VM Swarm
                                        |
                                        v
                                docker service update
                                        |
                                        v
                                pull image depuis Docker Hub
                                service tourne sur port 3000
```

## Authentification

**GitHub Actions -> Docker Hub**
- Access Token Docker Hub stocké dans GitHub Secrets (`DOCKERHUB_TOKEN`)

**GitHub Actions -> VM Swarm**
- Paire de clés SSH 
- Clé privée dans GitHub Secrets (`SSH_PRIVATE_KEY`)
- Clé publique dans `~/.ssh/authorized_keys` sur la VM
- Connexion réseau via Tailscale

**Swarm -> Docker Hub**
- Registre public

## Ports exposés

| Port | Service | Exposition |
|------|---------|------------|
| 3000 | Application Node.js | Swarm ingress |
| 22 | SSH | Tailscale uniquement |

## Risques et mitigations

| Risque | Mitigation |
|--------|------------|
| Secrets dans l'image | `.dockerignore` + variables injectées au runtime |
| Tag `latest` mutable | Déploiement par SHA de commit |
| SSH exposé publiquement | SSH accessible via Tailscale uniquement |
| Conteneur en root | User non-root `nextjs` (uid 1001) |

## Pourquoi exposer Docker en TCP sans TLS est dangereux

Si le daemon Docker est exposé en TCP sans TLS,
n'importe qui pouvant atteindre ce port obtient un accès root complet à la machine,
sans aucune authentification.

## Runner atteint le manager vs Manager atteint le runner

Dans notre approche, c'est le runner GitHub Actions qui initie la connexion SSH
vers la VM. La VM n'expose aucun port public et n'a pas besoin de connaître GitHub.

Dans le sens inverse, la VM devrait exposer une API accessible
depuis GitHub, ce qui augmente la surface d'attaque.

On préfère donc que la CI pousse vers la VM.