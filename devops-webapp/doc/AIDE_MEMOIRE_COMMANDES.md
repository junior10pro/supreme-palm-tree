# 📝 AIDE-MÉMOIRE - Commandes Essentielles

## 🔧 COMMANDES LOCALES (Développement)

### Démarrage de l'application
```bash
cd devops-app
npm install        # Installation des dépendances
npm start          # Démarrage en mode dev (port 3000)
npm run build      # Build de production
```

### Git - Workflow de base
```bash
# Voir les changements
git status
git diff

# Ajouter et commiter
git add .
git commit -m "Description du changement"

# Pousser vers GitLab (déclenche le pipeline)
git push origin main

# Voir l'historique
git log --oneline -10
```

---

## ☁️ COMMANDES AWS (Via AWS CLI)

### EC2 - Gestion des instances
```bash
# Lister toutes les instances
aws ec2 describe-instances --region eu-west-1

# Lister seulement les instances en cours d'exécution
aws ec2 describe-instances \
  --region eu-west-1 \
  --filters "Name=instance-state-name,Values=running" \
  --query 'Reservations[].Instances[].{ID:InstanceId,IP:PublicIpAddress,Name:Tags[?Key==`Name`]|[0].Value}'

# Obtenir l'IP publique d'une instance
aws ec2 describe-instances \
  --region eu-west-1 \
  --instance-ids i-XXXXXXXXXX \
  --query 'Reservations[].Instances[].PublicIpAddress' \
  --output text

# Démarrer/Arrêter une instance
aws ec2 start-instances --instance-ids i-XXXXXXXXXX
aws ec2 stop-instances --instance-ids i-XXXXXXXXXX
```

### Security Groups
```bash
# Lister les Security Groups
aws ec2 describe-security-groups --region eu-west-1

# Détails d'un Security Group spécifique
aws ec2 describe-security-groups \
  --group-ids sg-XXXXXXXXXX \
  --region eu-west-1
```

### Connexion SSH aux instances
```bash
# Depuis votre machine locale
ssh -i /chemin/vers/votre-cle.pem ubuntu@IP_PUBLIQUE

# Copier des fichiers vers l'instance
scp -i votre-cle.pem fichier.txt ubuntu@IP_PUBLIQUE:/home/ubuntu/

# Copier depuis l'instance vers votre machine
scp -i votre-cle.pem ubuntu@IP_PUBLIQUE:/chemin/fichier.txt ./
```

---

## 🤖 COMMANDES ANSIBLE

### Tests de connectivité
```bash
# Ping tous les serveurs
ansible all -i ansible/inventory/hosts.ini -m ping

# Ping uniquement les webservers
ansible webservers -i ansible/inventory/hosts.ini -m ping

# Tester avec verbosité
ansible all -i ansible/inventory/hosts.ini -m ping -vvv
```

### Commandes ad-hoc utiles
```bash
# Vérifier l'espace disque sur tous les serveurs
ansible all -i ansible/inventory/hosts.ini -m shell -a "df -h"

# Vérifier la version de Node.js
ansible webservers -i ansible/inventory/hosts.ini -m shell -a "node --version"

# Redémarrer Nginx sur tous les webservers
ansible webservers -i ansible/inventory/hosts.ini -m systemd -a "name=nginx state=restarted" --become

# Vérifier le status de Nginx
ansible webservers -i ansible/inventory/hosts.ini -m shell -a "systemctl status nginx" --become
```

### Exécution des Playbooks
```bash
# Vérifier la syntaxe du playbook
ansible-playbook ansible/playbooks/deploy.yml -i ansible/inventory/hosts.ini --syntax-check

# Dry run (simulation, pas d'exécution réelle)
ansible-playbook ansible/playbooks/deploy.yml -i ansible/inventory/hosts.ini --check

# Exécution normale
ansible-playbook ansible/playbooks/deploy.yml -i ansible/inventory/hosts.ini

# Exécution avec verbosité
ansible-playbook ansible/playbooks/deploy.yml -i ansible/inventory/hosts.ini -v
ansible-playbook ansible/playbooks/deploy.yml -i ansible/inventory/hosts.ini -vvv

# Exécuter seulement certains tags
ansible-playbook ansible/playbooks/deploy.yml -i ansible/inventory/hosts.ini --tags "nginx"

# Liste les tags disponibles
ansible-playbook ansible/playbooks/deploy.yml -i ansible/inventory/hosts.ini --list-tags
```

---

## 🏗️ COMMANDES JENKINS

### Depuis le serveur Jenkins (SSH)

```bash
# Status de Jenkins
sudo systemctl status jenkins
sudo systemctl start jenkins
sudo systemctl stop jenkins
sudo systemctl restart jenkins

# Logs Jenkins en temps réel
sudo tail -f /var/log/jenkins/jenkins.log

# Récupérer le mot de passe initial
sudo cat /var/lib/jenkins/secrets/initialAdminPassword

# Espace de travail des jobs
ls -la /var/lib/jenkins/workspace/

# Voir les fichiers d'un job spécifique
ls -la /var/lib/jenkins/workspace/devops-dashboard-pipeline/
```

### Via Jenkins CLI (optionnel)
```bash
# Télécharger Jenkins CLI
wget http://JENKINS_IP:8080/jnlpJars/jenkins-cli.jar

# Lister les jobs
java -jar jenkins-cli.jar -s http://JENKINS_IP:8080/ list-jobs

# Déclencher un build
java -jar jenkins-cli.jar -s http://JENKINS_IP:8080/ build devops-dashboard-pipeline
```

---

## 🌐 COMMANDES NGINX (Sur les serveurs web)

### Gestion du service
```bash
# Status
sudo systemctl status nginx

# Démarrer/Arrêter/Redémarrer
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo systemctl reload nginx  # Recharge la config sans couper les connexions

# Activer au démarrage
sudo systemctl enable nginx
```

### Configuration
```bash
# Tester la configuration
sudo nginx -t

# Voir la configuration active
sudo nginx -T

# Éditer la configuration du site
sudo nano /etc/nginx/sites-available/devops-dashboard

# Lister les sites disponibles
ls -la /etc/nginx/sites-available/

# Lister les sites activés
ls -la /etc/nginx/sites-enabled/
```

### Logs
```bash
# Logs d'accès en temps réel
sudo tail -f /var/log/nginx/access.log

# Logs d'erreur en temps réel
sudo tail -f /var/log/nginx/error.log

# Logs spécifiques à l'application
sudo tail -f /var/log/nginx/devops-dashboard_access.log
sudo tail -f /var/log/nginx/devops-dashboard_error.log

# Dernières 50 lignes des logs
sudo tail -50 /var/log/nginx/error.log
```

---

## 📦 COMMANDES NODE.JS/NPM (Sur les serveurs)

### Vérification des versions
```bash
node --version
npm --version
```

### Gestion de l'application
```bash
# Se placer dans le répertoire
cd /var/www/devops-dashboard

# Installer les dépendances
npm install

# Build
npm run build

# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install

# Voir les dépendances installées
npm list --depth=0
```

---

## 🔍 COMMANDES DE DIAGNOSTIC

### Vérifier les ports ouverts
```bash
# Sur n'importe quel serveur
sudo netstat -tulpn | grep LISTEN

# Vérifier spécifiquement
sudo netstat -tulpn | grep :80    # Nginx
sudo netstat -tulpn | grep :8080  # Jenkins
sudo netstat -tulpn | grep :22    # SSH
```

### Vérifier l'espace disque
```bash
df -h                    # Espace disque global
du -sh /var/www/*        # Taille des applications web
du -sh /var/lib/jenkins  # Taille du répertoire Jenkins
```

### Vérifier la mémoire
```bash
free -h           # Mémoire RAM
top               # Processus en temps réel (q pour quitter)
htop              # Version améliorée de top (si installé)
```

### Tester la connexion réseau
```bash
# Depuis n'importe quelle machine
ping IP_CIBLE

# Test HTTP
curl http://IP_SERVEUR_WEB
curl -I http://IP_SERVEUR_WEB  # Seulement les headers

# Test depuis l'extérieur
wget http://IP_SERVEUR_WEB -O /dev/null
```

### Logs système
```bash
# Logs système généraux
sudo journalctl -xe

# Logs d'un service spécifique
sudo journalctl -u nginx -f
sudo journalctl -u jenkins -f

# Logs depuis les 10 dernières minutes
sudo journalctl --since "10 minutes ago"
```

---

## 🐛 COMMANDES DE DÉPANNAGE RAPIDE

### Application ne charge pas
```bash
# 1. Vérifier que Nginx tourne
sudo systemctl status nginx

# 2. Vérifier que le dossier build existe
ls -la /var/www/devops-dashboard/build/

# 3. Vérifier les permissions
sudo chown -R www-data:www-data /var/www/devops-dashboard/build/

# 4. Vérifier les logs Nginx
sudo tail -50 /var/log/nginx/error.log

# 5. Test local
curl http://localhost
```

### Pipeline Jenkins échoue
```bash
# 1. Vérifier les logs Jenkins
sudo tail -100 /var/log/jenkins/jenkins.log

# 2. Vérifier l'espace disque
df -h

# 3. Tester Ansible manuellement
ansible all -i ansible/inventory/hosts.ini -m ping

# 4. Relancer le job manuellement depuis Jenkins UI
```

### Ansible ne se connecte pas
```bash
# 1. Vérifier la clé SSH
ls -la ~/.ssh/
chmod 600 ~/.ssh/votre-cle.pem

# 2. Test SSH direct
ssh -i ~/.ssh/votre-cle.pem ubuntu@IP_SERVEUR -v

# 3. Vérifier l'inventaire
cat ansible/inventory/hosts.ini

# 4. Test avec verbosité max
ansible all -i ansible/inventory/hosts.ini -m ping -vvvv
```

---

## 📊 COMMANDES DE MONITORING

### Surveiller les processus
```bash
# Processus Node.js
ps aux | grep node

# Processus Nginx
ps aux | grep nginx

# Processus Jenkins
ps aux | grep jenkins
```

### Surveiller les logs en temps réel (multiples fenêtres)
```bash
# Terminal 1: Logs Nginx
sudo tail -f /var/log/nginx/access.log

# Terminal 2: Logs d'application
sudo tail -f /var/log/nginx/devops-dashboard_error.log

# Terminal 3: Logs système
sudo journalctl -f
```

---

## 💡 TIPS & ASTUCES

### Alias utiles à ajouter dans ~/.bashrc
```bash
alias ans='ansible-playbook -i ansible/inventory/hosts.ini'
alias ansping='ansible all -i ansible/inventory/hosts.ini -m ping'
alias jlogs='sudo tail -f /var/log/jenkins/jenkins.log'
alias nlogs='sudo tail -f /var/log/nginx/error.log'
alias nreload='sudo systemctl reload nginx'
```

### Raccourcis Git
```bash
# Configuration
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'

# Utilisation
git st  # au lieu de git status
git co main  # au lieu de git checkout main
```

---

## 🆘 EN CAS DE PROBLÈME CRITIQUE

```bash
# 1. Sauvegarder les logs
mkdir ~/logs-backup-$(date +%Y%m%d)
sudo cp /var/log/nginx/* ~/logs-backup-$(date +%Y%m%d)/
sudo cp /var/log/jenkins/jenkins.log ~/logs-backup-$(date +%Y%m%d)/

# 2. Redémarrer tous les services
sudo systemctl restart nginx
sudo systemctl restart jenkins

# 3. Vérifier l'état global
sudo systemctl status nginx
sudo systemctl status jenkins
df -h
free -h

# 4. Test de connectivité complet
ansible all -i ansible/inventory/hosts.ini -m ping
curl http://localhost
```

---

## 📞 BESOIN D'AIDE ?

1. Vérifiez les logs (toujours la première étape !)
2. Consultez ce guide
3. Recherchez l'erreur sur Google/StackOverflow
4. Demandez à l'équipe
5. Contactez le formateur

**Bon DevOps ! 🚀**
