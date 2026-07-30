// src/components/awardsEngine.js

export function calculateSeasonAwards(playersList, standings, teamRecord) {
  const healthyPlayers = [...playersList];

  // 1. MVP (Jugador con mayor promedio de puntos + valoración)
  const mvp = healthyPlayers.reduce((best, current) => {
    const currentScore = (current.stats.pts * 1.5) + current.stats.reb + current.stats.ast;
    const bestScore = (best.stats.pts * 1.5) + best.stats.reb + best.stats.ast;
    return currentScore > bestScore ? current : best;
  }, healthyPlayers[0]);

  // 2. DPOY (Defensor del Año - Prioriza Rebotes y OVR de Interiores)
  const dpoy = healthyPlayers.reduce((best, current) => {
    return (current.stats.reb > best.stats.reb) ? current : best;
  }, healthyPlayers[0]);

  // 3. SEXTO HOMBRE DEL AÑO (Jugador con menos de 25m que más aporta)
  const benchPlayers = healthyPlayers.filter(p => (p.minutes || 0) < 25);
  const sixthMan = benchPlayers.length > 0 
    ? benchPlayers.reduce((best, current) => (current.stats.pts > best.stats.pts ? current : best), benchPlayers[0])
    : null;

  // 4. ENTRENADOR DEL AÑO (Si tenés >65% de victorias)
  const totalGames = teamRecord.wins + teamRecord.losses;
  const winPct = totalGames > 0 ? (teamRecord.wins / totalGames) : 0;
  const isCOY = winPct >= 0.65;

  return {
    mvp: { name: mvp.name, stats: `${mvp.stats.pts} PTS | ${mvp.stats.reb} REB | ${mvp.stats.ast} AST` },
    dpoy: { name: dpoy.name, stats: `${dpoy.stats.reb} REB Promedio` },
    sixthMan: sixthMan ? { name: sixthMan.name, stats: `${sixthMan.stats.pts} PTS desde la Banca` } : null,
    coy: isCOY ? { name: "Vos (Director Técnico)", stats: `${(winPct * 100).toFixed(1)}% Victorias` } : null
  };
}