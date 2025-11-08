# 📚 INDEX - DevOps Dashboard Project

## 🎯 Vue d'Ensemble

Bienvenue dans le projet **DevOps Dashboard** ! Ce projet contient tout ce dont vous avez besoin pour mettre en place un pipeline CI/CD complet avec AWS, Ansible, et Jenkins.

---

## 📁 STRUCTURE DES FICHIERS

### 📖 Documentation Principale

1. **START_HERE.md** (Ce fichier)
   - Point d'entrée du projet
   - Vue d'ensemble et navigation

2. **RECAP_PROJET.md**
   - Résumé complet du projet
   - Fonctionnalités de l'application
   - Points forts pour le TP

3. **GUIDE_INTEGRATION_COMPLET.md** ⭐ ESSENTIEL
   - Guide pas-à-pas pour l'intégration complète
   - Configuration AWS, GitLab, Jenkins, Ansible
   - Checklist de validation
   - Dépannage

4. **AIDE_MEMOIRE_COMMANDES.md**
   - Toutes les commandes utiles
   - Classées par catégorie
   - Tips et astuces
   - Commandes de dépannage

### 🚀 Application React

5. **devops-app/**
   - Application React complète
   - Prête à être déployée
   - 16 fichiers au total

---

## 🗂️ CONTENU DU DOSSIER `devops-app/`

```
devops-app/
│
├── 📄 README.md              # Documentation de l'application
├── 📄 QUICKSTART.md          # Démarrage rapide
├── 📄 package.json           # Configuration npm
├── 📄 .gitignore             # Fichiers à ignorer
├── 📄 Jenkinsfile            # Pipeline Jenkins
│
├── 📁 public/
│   └── 📄 index.html         # Template HTML
│
├── 📁 src/
│   ├── 📄 index.js           # Point d'entrée React
│   ├── 📄 index.css          # Styles globaux
│   ├── 📄 App.js             # Composant principal ⭐
│   ├── 📄 App.css            # Styles de l'app
│   │
│   └── 📁 components/
│       ├── 📄 TeamMember.js        # Composant membre équipe
│       ├── 📄 DeploymentCounter.js # Compteur déploiements
│       └── 📄 StatusBadge.js       # Badge statut pipeline
│
└── 📁 ansible/
    ├── 📁 inventory/
    │   └── 📄 hosts.ini      # Inventaire Ansible ⚙️
    │
    └── 📁 playbooks/
        └── 📄 deploy.yml     # Playbook de déploiement ⚙️
```

**Légende** :
- ⭐ = Fichier à personnaliser en priorité
- ⚙️ = Configuration à adapter à votre infrastructure

---

## 🚦 PAR OÙ COMMENCER ?

### Étape 1 : Lecture Rapide (10 min)
1. ✅ Lisez ce fichier (INDEX.md)
2. ✅ Parcourez **RECAP_PROJET.md** pour comprendre le projet
3. ✅ Ouvrez **devops-app/QUICKSTART.md** pour tester l'app localement

### Étape 2 : Test Local (15 min)
```bash
cd devops-app
npm install
npm start
```
→ L'application s'ouvre sur http://localhost:3000

### Étape 3 : Personnalisation (10 min)
Modifiez ces fichiers avec vos informations :

1. **devops-app/src/App.js** (lignes 10-14)
   ```javascript
   // Remplacez "Membre 1" par votre vrai nom
   { name: 'Alice Dupont', role: 'Infrastructure Manager (AWS)', color: '#FF6B6B' },
   ```

2. **devops-app/ansible/inventory/hosts.ini**
   ```ini
   [webservers]
   web-server-1 ansible_host=VOTRE_IP_EC2 ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/votre-cle.pem
   ```

3. **devops-app/Jenkinsfile** (ligne 56)
   ```groovy
   curl -f http://VOTRE_IP_SERVEUR_WEB || exit 1
   ```

### Étape 4 : Intégration Complète (2-4 heures)
Suivez **GUIDE_INTEGRATION_COMPLET.md** étape par étape :
1. Configuration AWS
2. Configuration Jenkins
3. Configuration du webhook GitLab
4. Configuration Ansible
5. Premier déploiement
6. Tests et validation

---

## 📋 CHECKLIST RAPIDE

### Avant de Commencer
- [ ] AWS : J'ai accès à la console AWS
- [ ] AWS : J'ai créé au moins 2 instances EC2
- [ ] AWS : J'ai récupéré mes clés SSH (.pem)
- [ ] GitLab : J'ai créé un repository
- [ ] Local : J'ai Node.js installé (node --version)
- [ ] Local : J'ai Git installé (git --version)

### Configuration Infrastructure
- [ ] VPC et subnets créés
- [ ] Security Groups configurés (SSH, HTTP, Jenkins)
- [ ] Connexion SSH fonctionnelle sur toutes les instances
- [ ] Jenkins installé sur une instance
- [ ] Ansible installé sur le serveur Jenkins

### Configuration Application
- [ ] L'app fonctionne en local (npm start)
- [ ] Le build fonctionne (npm run build)
- [ ] J'ai remplacé "Membre X" par les vrais noms
- [ ] J'ai mis à jour hosts.ini avec mes IPs
- [ ] Code pushé sur GitLab

### Configuration Pipeline
- [ ] Jenkins accessible via le navigateur
- [ ] Plugins installés (Git, GitLab, Ansible)
- [ ] Credentials configurés dans Jenkins
- [ ] Pipeline créé dans Jenkins
- [ ] Webhook GitLab configuré
- [ ] Test webhook réussi

### Déploiement
- [ ] ansible -m ping fonctionne
- [ ] Playbook s'exécute sans erreur
- [ ] Nginx installé sur serveur web
- [ ] Application accessible via HTTP
- [ ] Push déclenche le pipeline automatiquement

---

## 🎯 OBJECTIFS DU TP

### Objectif Principal
✅ Créer un pipeline CI/CD complet et automatisé

### Objectifs Techniques
- ✅ Provisionner une infrastructure AWS
- ✅ Configurer des serveurs avec Ansible
- ✅ Mettre en place Jenkins avec pipeline
- ✅ Automatiser le déploiement
- ✅ Intégrer Git avec webhooks

### Livrables Attendus
1. Infrastructure AWS opérationnelle
2. Application React déployée
3. Pipeline Jenkins fonctionnel
4. Playbooks Ansible
5. Documentation complète avec screenshots

---

## 📖 GUIDES DÉTAILLÉS

### Pour la Configuration
→ Consultez **GUIDE_INTEGRATION_COMPLET.md**
- 6 étapes détaillées
- Exemples de commandes
- Solutions aux problèmes courants
- Checklist de validation

### Pour les Commandes
→ Consultez **AIDE_MEMOIRE_COMMANDES.md**
- Commandes AWS CLI
- Commandes Ansible
- Commandes Jenkins
- Commandes Nginx
- Commandes de diagnostic

### Pour l'Application
→ Consultez **devops-app/README.md**
- Description de l'application
- Installation et démarrage
- Structure du projet
- Tests du pipeline

---

## 🎓 RÉPARTITION DES RÔLES

### Rôle 1 : Infrastructure Manager (AWS)
**Responsabilités** :
- Créer le VPC et les subnets
- Lancer les instances EC2
- Configurer les Security Groups
- Gérer les clés SSH

**Fichiers concernés** :
- hosts.ini (pour les IPs)

### Rôle 2 : Configuration Manager (Ansible)
**Responsabilités** :
- Créer/adapter les playbooks
- Gérer l'inventaire
- Tester les connexions
- Automatiser la configuration

**Fichiers concernés** :
- ansible/inventory/hosts.ini
- ansible/playbooks/deploy.yml

### Rôle 3 : CI/CD Engineer (Jenkins)
**Responsabilités** :
- Installer et configurer Jenkins
- Créer le pipeline
- Configurer les credentials
- Intégrer avec Git et Ansible

**Fichiers concernés** :
- Jenkinsfile

### Rôle 4 : Developer & QA
**Responsabilités** :
- Personnaliser l'application
- Tester localement
- Valider les déploiements
- Documenter les tests

**Fichiers concernés** :
- src/App.js
- src/components/*.js
- Tests et validation

### Rôle 5 : DevOps Lead
**Responsabilités** :
- Coordonner l'équipe
- Gérer la documentation
- Préparer la présentation
- Assurer la communication

**Fichiers concernés** :
- README.md
- Documentation générale

---

## 🔧 MODIFICATIONS RAPIDES POUR TESTER

### Test 1 : Changer le Compteur (2 min)
```javascript
// Fichier: src/components/DeploymentCounter.js
// Ligne 9: Changez le nombre
const deployments = 10; // Au lieu de 5
```

### Test 2 : Changer une Couleur (2 min)
```javascript
// Fichier: src/App.js
// Ligne 10: Changez la couleur
{ name: 'Membre 1', role: 'Infrastructure Manager', color: '#00FF00' }
```

### Test 3 : Ajouter du Texte (3 min)
```javascript
// Fichier: src/App.js
// Section project-info: Ajoutez une phrase
<p>
  Infrastructure complète sur AWS... [texte existant]
  Cette version a été déployée par notre équipe le {new Date().toLocaleDateString()}.
</p>
```

Après chaque modification :
```bash
git add .
git commit -m "Test: description du changement"
git push origin main
```
→ Le pipeline se déclenche automatiquement !

---

## 🐛 PROBLÈMES COURANTS

### "npm: command not found"
**Solution** : Installez Node.js
```bash
# Sur Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo bash -
sudo apt install -y nodejs
```

### "Cannot connect to instance"
**Solution** : Vérifiez votre Security Group et clé SSH
```bash
# Test de connexion
ssh -i votre-cle.pem ubuntu@IP_INSTANCE -v
```

### "Pipeline fails at Build stage"
**Solution** : Vérifiez que Node.js est installé sur Jenkins
```bash
# Sur le serveur Jenkins
node --version
npm --version
```

### "Ansible cannot connect"
**Solution** : Vérifiez permissions de la clé SSH
```bash
chmod 600 ~/.ssh/votre-cle.pem
```

Pour plus de solutions → **AIDE_MEMOIRE_COMMANDES.md** section "Dépannage"

---

## 📸 SCREENSHOTS IMPORTANTS À PRENDRE

Pour votre documentation finale :

1. **AWS Console**
   - Liste des instances EC2 en cours d'exécution
   - Configuration des Security Groups
   - Vue du VPC

2. **GitLab**
   - Repository avec tous les fichiers
   - Configuration du webhook
   - Historique des webhooks (succès)

3. **Jenkins**
   - Dashboard avec le pipeline
   - Exécution réussie du pipeline
   - Logs détaillés de chaque stage

4. **Application**
   - Page d'accueil complète
   - Section de l'équipe avec vos vrais noms
   - Compteur de déploiements

5. **Ligne de Commande**
   - ansible -m ping réussi
   - Exécution du playbook Ansible
   - curl vers l'application déployée

---

## 🎉 PRÊT À COMMENCER !

### Ordre Recommandé

1. **Lisez** ce fichier (✅ Fait !)
2. **Testez** l'app en local (devops-app/QUICKSTART.md)
3. **Personnalisez** les fichiers avec vos infos
4. **Suivez** le guide d'intégration complet
5. **Documentez** avec des screenshots
6. **Testez** le pipeline automatique
7. **Préparez** la présentation

### Ressources à Garder Ouvertes

Pendant votre travail, gardez ces fichiers ouverts :
- **GUIDE_INTEGRATION_COMPLET.md** → Pour suivre les étapes
- **AIDE_MEMOIRE_COMMANDES.md** → Pour les commandes
- **devops-app/README.md** → Pour l'application

---

## 💡 CONSEILS FINAUX

1. **Travaillez en équipe** : Chaque rôle est important
2. **Documentez tout** : Prenez des notes et screenshots
3. **Testez régulièrement** : Faites des commits fréquents
4. **Communiquez** : Partagez vos avancées et problèmes
5. **Amusez-vous** : C'est un super projet pour apprendre !

---

## 📞 BESOIN D'AIDE ?

1. Consultez **AIDE_MEMOIRE_COMMANDES.md** section "Dépannage"
2. Vérifiez les logs (toujours !)
3. Demandez à vos coéquipiers
4. Recherchez l'erreur sur Google
5. Contactez le formateur

---

## ✨ BONNE CHANCE !

Vous avez tout ce qu'il faut pour réussir ce TP !

**N'oubliez pas** : Le plus important n'est pas que tout fonctionne parfaitement du premier coup, mais de comprendre comment les différentes pièces s'assemblent pour créer un pipeline CI/CD complet.

🚀 **Let's DevOps !**

---

**Date de création** : November 2025
**Version** : 1.0
**Projet** : TP DevOps - Déploiement Automatisé sur AWS
