import React from 'react';

function StatusBadge() {
  const now = new Date();
  const formattedDate = now.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="status-badge">
      <div className="status-indicator">
        <span className="status-dot"></span>
        <span className="status-text">Pipeline Actif</span>
      </div>
      <p className="last-update">Dernière mise à jour : {formattedDate}</p>
    </div>
  );
}

export default StatusBadge;
