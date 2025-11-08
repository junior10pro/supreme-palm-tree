# DevOps Team Dashboard

Application React simple pour tester le pipeline CI/CD avec Jenkins et GitLab dans le cadre du TP Déploiement Automatisé sur AWS.

## 🚀 Description

Cette application affiche un tableau de bord pour l'équipe DevOps avec :
- Présentation du projet
- Liste des membres de l'équipe avec leurs rôles
- Compteur de déploiements réussis
- Status du pipeline en temps réel
- Technologies utilisées

## 📋 Prérequis

- Node.js (v14 ou supérieur)
- npm ou yarn

## 🔧 Installation

```bash
# Installer les dépendances
npm install
```

## 🏃 Démarrage

```bash
# Lancer en mode développement
npm start

# L'application sera accessible sur http://localhost:3000
```

## 🏗️ Build pour Production

```bash
# Créer le build de production
npm run build

# Les fichiers seront générés dans le dossier 'build/'
```

## 📁 Structure du Projet

```
devops-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── TeamMember.js       # Composant membre d'équipe
│   │   ├── DeploymentCounter.js # Compteur de déploiements
│   │   └── StatusBadge.js      # Badge de statut
│   ├── App.js                  # Composant principal
│   ├── App.css                 # Styles principaux
│   ├── index.js                # Point d'entrée
│   └── index.css               # Styles globaux
├── package.json
└── README.md
```

## 🧪 Tests du Pipeline

Pour tester le pipeline CI/CD, vous pouvez modifier :

1. **Le compteur de déploiements** : 
   - Fichier : `src/components/DeploymentCounter.js`
   - Ligne 9 : Changez `const deployments = 5;` par une autre valeur

2. **Les couleurs des cartes d'équipe** :
   - Fichier : `src/App.js`
   - Lignes 10-14 : Modifiez les codes couleur

3. **Le texte de présentation** :
   - Fichier : `src/App.js`
   - Section `project-info`

4. **Les noms des membres** :
   - Fichier : `src/App.js`
   - Remplacez "Membre 1", "Membre 2", etc. par les vrais noms

## 🔄 Workflow CI/CD

1. Faites vos modifications
2. Commitez : `git add . && git commit -m "Update deployment counter"`
3. Pushez : `git push origin main`
4. Le webhook GitLab déclenche Jenkins
5. Jenkins exécute le pipeline (build, test, deploy)
6. Ansible déploie l'application sur AWS
7. Vérifiez les changements sur l'URL de production

## 🛠️ Technologies

- **React 18** - Framework frontend
- **CSS3** - Styles avec animations et design professionnel
- **JavaScript ES6+** - Logique applicative

### Styles Disponibles

L'application propose 2 thèmes CSS professionnels :
- **App.css** (par défaut) - Style moderne et coloré
- **App-Professional.css** - Style corporate épuré

Consultez `GUIDE_STYLES.md` pour changer de style et personnaliser les couleurs.

## 📝 Notes pour le TP

Cette application est conçue pour être :
- ✅ Simple à comprendre et modifier
- ✅ Rapide à compiler (build léger)
- ✅ Visuelle (changements immédiatement visibles)
- ✅ Idéale pour tester le pipeline complet

## 👥 Équipe DevOps

- **Rôle 1** : Infrastructure Manager (AWS)
- **Rôle 2** : Configuration Manager (Ansible)
- **Rôle 3** : CI/CD Engineer (Jenkins)
- **Rôle 4** : Developer & QA
- **Rôle 5** : DevOps Lead

## 📄 Licence

Projet éducatif - TP DevOps
