import React from 'react';
import TeamMember from './components/TeamMember';
import DeploymentCounter from './components/DeploymentCounter';
import StatusBadge from './components/StatusBadge';
import './App.css';

function App() {
  const teamMembers = [
    { name: 'Holali David GAVI', role: 'Jenkins CI/CD Engineer, Developer & QA', color: '#22c55e' },
    { name: 'Joseph ESSOMBA ATANGANA', role: 'DevOps Lead', color: '#3b82f6' },
    { name: 'Kevin (Wendyam) SEBEGO', role: 'AWS Infrastructure Manager', color: '#f59e0b' },
    { name: 'Abdourahman ABOUBAKARY', role: 'Ansible Configuration Manager', color: '#a855f7' },
  ];

  return (
    <div className="App">
      <header className="app-header">
        <div className="brand">
          <h1>DevOps Team Dashboard</h1>
          <p className="subtitle">TP Déploiement Automatisé — AWS • Ansible • Jenkins</p>
        </div>
        <div className="header-status">
          <StatusBadge />
        </div>
      </header>

      <main className="app-main">
        <section className="panel project-info">
          <h2>À propos du projet</h2>
          <p>
            Infrastructure sur AWS avec automatisation du déploiement via Ansible
            et pipeline CI/CD Jenkins. Cette application est déployée automatiquement
            à chaque push sur la branche principale.
          </p>
        </section>

        <section className="panel deployment-section">
          <h2>Déploiements</h2>
          <DeploymentCounter />
        </section>

        <section className="panel team-section">
          <div className="section-head">
            <h2>Équipe DevOps</h2>
          </div>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <TeamMember
                key={index}
                name={member.name}
                role={member.role}
                color={member.color}
              />
            ))}
          </div>
        </section>

        <section className="panel tech-stack">
          <h2>Stack</h2>
          <div className="tech-badges">
            <span className="tech-badge">AWS EC2</span>
            <span className="tech-badge">Ansible</span>
            <span className="tech-badge">Jenkins</span>
            <span className="tech-badge">GitLab</span>
            <span className="tech-badge">React</span>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>© 2025 DevOps Team — TP Déploiement Automatisé</p>
      </footer>
    </div>
  );
}

export default App;
