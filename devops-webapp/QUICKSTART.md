# 🚀 Guide de Démarrage Rapide

## Installation et Premier Lancement

### 1️⃣ Installer les dépendances
```bash
cd devops-app
npm install
```

### 2️⃣ Lancer l'application en développement
```bash
npm start
```
L'application s'ouvrira automatiquement sur http://localhost:3000

### 3️⃣ Créer le build de production
```bash
npm run build
```
Les fichiers de production seront dans le dossier `build/`

## 🧪 Tests Rapides du Pipeline

### Test 1 : Modifier le compteur
1. Ouvrez `src/components/DeploymentCounter.js`
2. Ligne 9 : Changez `const deployments = 5;` en `const deployments = 10;`
3. Commitez et pushez
4. Vérifiez que le pipeline se lance
5. Confirmez que le nouveau nombre s'affiche

### Test 2 : Changer une couleur
1. Ouvrez `src/App.js`
2. Ligne 10 : Changez `color: '#FF6B6B'` en `color: '#00FF00'`
3. Commitez et pushez
4. Vérifiez le déploiement

### Test 3 : Ajouter vos vrais noms
1. Ouvrez `src/App.js`
2. Lignes 10-14 : Remplacez "Membre 1" par votre vrai nom
3. Commitez et pushez

## 📦 Déploiement avec Ansible

Le playbook Ansible devra :
1. Installer Node.js sur le serveur web
2. Copier les fichiers de l'application
3. Lancer `npm install`
4. Lancer `npm run build`
5. Configurer Nginx pour servir le dossier `build/`

## 🔧 Commandes Utiles

```bash
# Vérifier la syntaxe
npm run build

# Nettoyer le cache
npm cache clean --force

# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

## 📋 Checklist Avant Premier Push

- [ ] Les dépendances sont installées (`npm install`)
- [ ] L'application démarre localement (`npm start`)
- [ ] Le build fonctionne (`npm run build`)
- [ ] Vous avez remplacé "Membre X" par vos vrais noms
- [ ] Le fichier est commité dans Git
- [ ] Le repository GitLab est configuré

## ❓ Problèmes Courants

**Erreur "command not found: npm"**
→ Installez Node.js : https://nodejs.org/

**Port 3000 déjà utilisé**
→ L'application vous proposera un autre port automatiquement

**Erreur lors du build**
→ Vérifiez que toutes les dépendances sont installées

## 🎯 Prêt pour le Pipeline !

Votre application est maintenant prête à être intégrée dans le pipeline Jenkins/GitLab/Ansible !
