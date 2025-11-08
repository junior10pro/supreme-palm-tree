import React, { useState, useEffect } from 'react';

function DeploymentCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Simule la récupération du nombre de déploiements
    // Vous pouvez modifier cette valeur pour tester le pipeline
    const deployments = 5; // Changez ce nombre pour voir les mises à jour
    setCount(deployments);
  }, []);

  return (
    <div className="deployment-counter">
      <h2>Déploiements Réussis</h2>
      <div className="counter-display">
        <span className="counter-number">{count}</span>
      </div>
      <p className="counter-label">Total depuis le début du projet</p>
    </div>
  );
}

export default DeploymentCounter;
