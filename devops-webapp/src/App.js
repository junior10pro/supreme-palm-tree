import React from 'react';
import TeamMember from './components/TeamMember';
import DeploymentCounter from './components/DeploymentCounter';
import StatusBadge from './components/StatusBadge';
import MonitoringDashboard from './components/MonitoringDashboard';  // nouveau composant
import './App.css';

function App() {
  const teamMembers = [
    { name: 'Holali David GAVI', role: 'Jenkins CI/CD Engineer, Developer & QA', color: '#45B7D1' },
    { name: 'Joseph ESSOMBA ATANGANA', role: 'DevOps Lead', color: '#98D8C8' },
    { name: 'Kevin (Wendyam) SEBEGO', role: 'AWS Infrastructure Manager', color: '#FF6B6B' },
    { name: 'Abdourahman ABOUBAKARY', role: 'Ansible Configuration Manager', color: '#4ECDC4' },
  ];

  return (
    <div className="App">
      {/* HEADER */}
      <header className="app-header">
        <h1>DevOps Team Dashboard</h1>
        <p className="subtitle">TP Déploiement Automatisé - AWS, Ansible & Jenkins</p>
        <StatusBadge />
      </header>

      {/* MAIN CONTENT */}
      <main className="app-main">

        {/* === PROJECT INFO === */}
        <section className="project-info">
          <h2>À Propos du Projet</h2>
          <p>
            Infrastructure complète sur AWS avec automatisation du déploiement via Ansible
            et pipeline CI/CD avec Jenkins. Cette application est déployée automatiquement
            à chaque push sur la branche principale.
          </p>
        </section>

        {/* === DEPLOYMENT COUNTER === */}
        <section className="deployment-section">
          <DeploymentCounter />
        </section>

        {/* === MONITORING DASHBOARD === */}
        <section className="monitoring-section">
          <h2>Infrastructure Monitoring</h2>
          <MonitoringDashboard />
        </section>

        {/* === TEAM SECTION === */}
        <section className="team-section">
          <h2>Notre Équipe DevOps</h2>
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

        {/* === TECH STACK === */}
        <section className="tech-stack">
          <h2>Technologies Utilisées</h2>
          <div className="tech-badges">
            <span className="tech-badge">AWS EC2</span>
            <span className="tech-badge">Ansible</span>
            <span className="tech-badge">Jenkins</span>
            <span className="tech-badge">GitLab</span>
            <span className="tech-badge">React</span>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="app-footer">
        <p>© 2025 DevOps Team | TP Déploiement Automatisé</p>
      </footer>
    </div>
  );
}

export default App;
