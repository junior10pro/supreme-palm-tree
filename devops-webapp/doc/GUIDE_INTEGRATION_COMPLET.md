# 🔧 GUIDE D'INTÉGRATION CI/CD COMPLET

## Vue d'ensemble du Workflow

```
Développeur → Push Code → GitLab → Webhook → Jenkins → Build → Ansible → Déploiement AWS
                                                          ↓
                                                      Tests OK ?
                                                          ↓
                                                     Application Live
```

## 📋 PRÉREQUIS

### Sur AWS
- ✅ 2 instances EC2 minimum :
  - 1 pour Jenkins
  - 1+ pour serveur(s) web
- ✅ Security Groups configurés :
  - Port 22 (SSH) ouvert pour Ansible
  - Port 80 (HTTP) ouvert pour le web
  - Port 8080 pour Jenkins
- ✅ Clés SSH (.pem) disponibles

### Sur GitLab
- ✅ Repository créé
- ✅ Code pushé
- ✅ Accès administrateur pour les webhooks

### Sur Jenkins
- ✅ Jenkins installé et accessible
- ✅ Plugins installés :
  - Git Plugin
  - GitLab Plugin
  - Ansible Plugin

---

## 🚀 ÉTAPE 1 : PRÉPARATION DU CODE

### 1.1 Initialiser le repository Git

```bash
cd devops-app
git init
git add .
git commit -m "Initial commit: DevOps Dashboard app"
```

### 1.2 Configurer GitLab

```bash
# Ajouter le remote GitLab
git remote add origin https://gitlab.com/VOTRE_USERNAME/devops-dashboard.git

# Pousser le code
git branch -M main
git push -u origin main
```

### 1.3 Personnaliser l'application

Avant de continuer, modifiez :
- `src/App.js` : Remplacez "Membre X" par vos vrais noms
- `ansible/inventory/hosts.ini` : Ajoutez vos IPs AWS
- `Jenkinsfile` : Remplacez VOTRE_IP_SERVEUR_WEB

---

## 🏗️ ÉTAPE 2 : CONFIGURATION JENKINS

### 2.1 Installation de Jenkins (si pas déjà fait)

Sur votre instance Jenkins EC2 :

```bash
# Mise à jour
sudo apt update

# Installation Java
sudo apt install -y openjdk-11-jdk

# Ajout du repository Jenkins
wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
sudo sh -c 'echo deb https://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'

# Installation Jenkins
sudo apt update
sudo apt install -y jenkins

# Démarrage
sudo systemctl start jenkins
sudo systemctl enable jenkins

# Récupération du mot de passe initial
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

Accédez à Jenkins : `http://JENKINS_IP:8080`

### 2.2 Installation des Plugins Jenkins

1. Allez dans **Manage Jenkins** → **Manage Plugins**
2. Onglet **Available**
3. Installez :
   - GitLab Plugin
   - Git Plugin
   - Ansible Plugin
   - Pipeline Plugin (normalement déjà installé)

### 2.3 Configuration des Credentials

1. **Manage Jenkins** → **Manage Credentials**
2. Cliquez sur **(global)**
3. **Add Credentials**

#### Pour GitLab :
- Kind: `Username with password`
- Username: votre username GitLab
- Password: votre token d'accès GitLab
- ID: `gitlab-credentials`

#### Pour SSH (serveurs web) :
- Kind: `SSH Username with private key`
- Username: `ubuntu`
- Private Key: Collez le contenu de votre fichier .pem
- ID: `aws-ssh-key`

### 2.4 Installation d'Ansible sur Jenkins

Sur le serveur Jenkins :

```bash
sudo apt update
sudo apt install -y software-properties-common
sudo add-apt-repository --yes --update ppa:ansible/ansible
sudo apt install -y ansible

# Vérification
ansible --version
```

### 2.5 Création du Pipeline Jenkins

1. **New Item** → Nom: `devops-dashboard-pipeline`
2. Type: **Pipeline**
3. Cochez **GitHub project** (ou GitLab) et ajoutez l'URL
4. Dans **Build Triggers** :
   - Cochez **Build when a change is pushed to GitLab**
   - Notez l'URL du webhook (ex: `http://JENKINS_IP:8080/project/devops-dashboard-pipeline`)
5. Dans **Pipeline** :
   - Definition: `Pipeline script from SCM`
   - SCM: `Git`
   - Repository URL: URL de votre repo GitLab
   - Credentials: Sélectionnez `gitlab-credentials`
   - Branch: `*/main`
   - Script Path: `Jenkinsfile`
6. **Save**

---

## 🔗 ÉTAPE 3 : CONFIGURATION DU WEBHOOK GITLAB

### 3.1 Dans GitLab

1. Allez dans votre projet GitLab
2. **Settings** → **Webhooks**
3. Remplissez :
   - **URL** : `http://JENKINS_IP:8080/project/devops-dashboard-pipeline`
   - **Secret Token** : (optionnel, à configurer aussi dans Jenkins)
   - **Trigger** : Cochez `Push events`
   - **Branch** : `main`
4. **Add webhook**

### 3.2 Test du Webhook

1. Cliquez sur **Test** → **Push events**
2. Vérifiez que Jenkins reçoit le webhook (HTTP 200)
3. Un build devrait se lancer dans Jenkins

---

## 📦 ÉTAPE 4 : CONFIGURATION ANSIBLE

### 4.1 Préparation des serveurs web

Sur CHAQUE serveur web AWS :

```bash
# Mise à jour
sudo apt update
sudo apt upgrade -y

# Installation Python (nécessaire pour Ansible)
sudo apt install -y python3 python3-pip
```

### 4.2 Test de connexion Ansible

Depuis le serveur Jenkins :

```bash
# Copier votre clé SSH
# Remplacez le chemin et l'IP par les vôtres

# Test ping Ansible
cd /var/lib/jenkins/workspace/devops-dashboard-pipeline
ansible webservers -i ansible/inventory/hosts.ini -m ping
```

Résultat attendu :
```
web-server-1 | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
```

### 4.3 Ajustements du Playbook

Ouvrez `ansible/playbooks/deploy.yml` et vérifiez :
- Les chemins sont corrects
- La version de Node.js convient
- Le nom du serveur Nginx

---

## ✅ ÉTAPE 5 : PREMIER DÉPLOIEMENT

### 5.1 Déploiement Manuel (Test)

Depuis Jenkins (ou en SSH sur le serveur Jenkins) :

```bash
cd /var/lib/jenkins/workspace/devops-dashboard-pipeline

# Test syntax
ansible-playbook ansible/playbooks/deploy.yml -i ansible/inventory/hosts.ini --syntax-check

# Dry run
ansible-playbook ansible/playbooks/deploy.yml -i ansible/inventory/hosts.ini --check

# Déploiement réel
ansible-playbook ansible/playbooks/deploy.yml -i ansible/inventory/hosts.ini
```

### 5.2 Vérification

```bash
# Sur le serveur web, vérifiez :
ls -la /var/www/devops-dashboard/build
sudo systemctl status nginx
curl http://localhost
```

### 5.3 Test via Pipeline

1. Faites un changement dans le code :
```bash
# Dans src/components/DeploymentCounter.js
# Changez const deployments = 5; en const deployments = 10;
```

2. Commitez et pushez :
```bash
git add .
git commit -m "Test pipeline: update deployment counter"
git push origin main
```

3. Surveillez Jenkins :
   - Le webhook devrait déclencher le build automatiquement
   - Suivez les logs en temps réel
   - Vérifiez chaque stage

4. Vérifiez le déploiement :
```bash
# Accédez à http://VOTRE_IP_SERVEUR_WEB
# Le compteur devrait afficher 10
```

---

## 🎯 ÉTAPE 6 : VALIDATION COMPLÈTE

### Checklist de Validation

#### Infrastructure AWS
- [ ] Les instances EC2 sont actives
- [ ] SSH fonctionne sur toutes les machines
- [ ] Les Security Groups permettent le trafic nécessaire
- [ ] Les clés SSH sont configurées

#### GitLab
- [ ] Le code est pushé sur le repository
- [ ] Le webhook est configuré et actif
- [ ] Les push déclenchent Jenkins

#### Jenkins
- [ ] Jenkins est accessible sur le port 8080
- [ ] Le pipeline est créé
- [ ] Les credentials sont configurés
- [ ] Ansible est installé sur le serveur Jenkins
- [ ] Le Jenkinsfile est lu depuis le repo

#### Ansible
- [ ] L'inventaire contient les bonnes IPs
- [ ] `ansible -m ping` fonctionne
- [ ] Le playbook s'exécute sans erreur
- [ ] Node.js et Nginx sont installés sur les serveurs web

#### Application
- [ ] Le site est accessible via HTTP
- [ ] Les changements de code se déploient automatiquement
- [ ] Le compteur et les informations s'affichent correctement

---

## 🐛 DÉPANNAGE

### Problème : Jenkins ne se déclenche pas

**Solution** :
```bash
# Vérifier les logs Jenkins
sudo tail -f /var/log/jenkins/jenkins.log

# Tester manuellement le webhook dans GitLab
# Settings → Webhooks → Test → Push events
```

### Problème : Ansible ne peut pas se connecter

**Solution** :
```bash
# Vérifier la clé SSH
ls -la ~/.ssh/

# Tester SSH manuellement
ssh -i votre-cle.pem ubuntu@IP_SERVEUR_WEB

# Vérifier l'inventaire
cat ansible/inventory/hosts.ini
```

### Problème : Le build npm échoue

**Solution** :
```bash
# Sur le serveur web
node --version  # Doit être >= 14
npm --version

# Réinstaller si nécessaire
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo bash -
sudo apt install -y nodejs
```

### Problème : Nginx ne sert pas l'application

**Solution** :
```bash
# Vérifier la configuration
sudo nginx -t

# Vérifier les logs
sudo tail -f /var/log/nginx/error.log

# Redémarrer Nginx
sudo systemctl restart nginx

# Vérifier le dossier build
ls -la /var/www/devops-dashboard/build/
```

---

## 📸 SCREENSHOTS À PRENDRE

Pour votre rapport final :

1. **AWS Console** :
   - Liste des instances EC2
   - Configuration des Security Groups
   - VPC et subnets

2. **GitLab** :
   - Repository avec les fichiers
   - Configuration du webhook
   - Historique des push events réussis

3. **Jenkins** :
   - Dashboard avec le pipeline
   - Vue détaillée d'un build réussi
   - Logs de chaque stage
   - Configuration du job

4. **Application** :
   - Page d'accueil du site
   - Section équipe avec vos noms
   - Console développeur (F12) sans erreurs

5. **Ansible** :
   - Résultat du `ansible -m ping`
   - Exécution réussie du playbook
   - Configuration Nginx

---

## 🎓 POUR LA PRÉSENTATION FINALE

### Structure Recommandée

1. **Introduction** (2 min)
   - Contexte et objectifs du TP
   - Présentation de l'équipe et des rôles

2. **Architecture** (3 min)
   - Schéma de l'infrastructure AWS
   - Workflow du pipeline CI/CD

3. **Démonstration Live** (8 min)
   - Modification du code en direct
   - Push vers GitLab
   - Déclenchement automatique du pipeline
   - Vérification du déploiement

4. **Difficultés et Solutions** (3 min)
   - Problèmes rencontrés
   - Comment vous les avez résolus

5. **Conclusion** (2 min)
   - Compétences acquises
   - Améliorations possibles

6. **Questions** (2 min)

---

## 🚀 FÉLICITATIONS !

Vous avez maintenant un pipeline CI/CD complet et fonctionnel !

Chaque push sur `main` déclenchera automatiquement :
1. Le webhook GitLab → Jenkins
2. Jenkins build l'application
3. Ansible déploie sur AWS
4. L'application est mise à jour en production

**C'est du vrai DevOps ! 🎉**
