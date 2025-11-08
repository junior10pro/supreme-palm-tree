import React from 'react';

function TeamMember({ name, role, color }) {
  return (
    <div className="team-member" style={{ borderLeftColor: color }}>
      <h3>{name}</h3>
      <p className="role">{role}</p>
      <div className="role-badge" style={{ backgroundColor: color }}>
        {role.split(' ')[0]}
      </div>
    </div>
  );
}

export default TeamMember;
