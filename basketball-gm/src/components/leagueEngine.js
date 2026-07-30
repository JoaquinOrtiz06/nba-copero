// src/components/leagueEngine.js

/**
 * Simula los resultados del resto de la liga para avanzar la jornada
 */
export function simulateLeagueDay(teamsList, userTeamId) {
  // Filtramos los equipos que no son del usuario
  const otherTeams = teamsList.filter(t => t.id !== userTeamId);

  // Emparejamos a los otros 14 equipos al azar para simular 7 partidos
  const shuffled = [...otherTeams].sort(() => 0.5 - Math.random());

  const updatedTeams = teamsList.map(team => ({ ...team }));

  for (let i = 0; i < shuffled.length; i += 2) {
    if (i + 1 >= shuffled.length) break;

    const teamA = updatedTeams.find(t => t.id === shuffled[i].id);
    const teamB = updatedTeams.find(t => t.id === shuffled[i + 1].id);

    if (teamA && teamB) {
      // Cálculo de victoria según OVR y suerte
      const probA = teamA.ovr / (teamA.ovr + teamB.ovr);
      const rand = Math.random();

      if (rand < probA) {
        teamA.wins += 1;
        teamB.losses += 1;
      } else {
        teamB.wins += 1;
        teamA.losses += 1;
      }
    }
  }

  // Ordenamos la tabla por Victorias (y luego por OVR)
  return updatedTeams.sort((a, b) => b.wins - a.wins || b.ovr - a.ovr);
}