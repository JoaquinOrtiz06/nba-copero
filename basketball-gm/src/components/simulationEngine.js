// src/components/simulationEngine.js

function getTeamStats(players) {
  const healthyPlayers = players.filter(p => p.status !== "injured");
  if (healthyPlayers.length === 0) return { avgOvr: 60 };

  const totalEffectiveOvr = healthyPlayers.reduce((sum, p) => {
    const energy = p.energy !== undefined ? p.energy : 100;
    
    // Penalización de energía mucho más leve (máximo -3 OVR)
    let fatiguePenalty = 0;
    if (energy < 70) {
      fatiguePenalty = Math.round((70 - energy) / 10);
    }

    const effectiveOvr = Math.max(65, p.ovr - fatiguePenalty);
    return sum + effectiveOvr;
  }, 0);

  const avgOvr = totalEffectiveOvr / healthyPlayers.length;
  return { avgOvr };
}

function randomVariance(min = -10, max = 10) {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  const score = z * 3.0; 
  return Math.max(min, Math.min(max, score));
}

function generatePlayerBoxScore(players, totalTeamScore) {
  const healthyPlayers = players.filter(p => p.status !== "injured");
  const totalWeight = healthyPlayers.reduce((sum, p) => sum + (p.stats?.pts || 10), 0);

  let currentTotalPts = 0;

  const boxScore = players.map((player) => {
    if (player.status === "injured") {
      return { 
        id: player.id, name: player.name, pos: player.pos, ovr: player.ovr, 
        pts: 0, reb: 0, ast: 0, status: "injured" 
      };
    }

    const share = (player.stats?.pts || 10) / (totalWeight || 1);
    const factor = 0.85 + Math.random() * 0.3;
    
    let pts = Math.round(totalTeamScore * share * factor);
    currentTotalPts += pts;

    let reb = Math.max(0, Math.round((player.stats?.reb || 3) + (Math.random() * 4 - 2)));
    let ast = Math.max(0, Math.round((player.stats?.ast || 3) + (Math.random() * 4 - 2)));

    return {
      id: player.id, name: player.name, pos: player.pos, ovr: player.ovr,
      isInfiltrated: player.isInfiltrated || false,
      pts, reb, ast, status: "healthy"
    };
  });

  const diff = totalTeamScore - currentTotalPts;
  const firstHealthy = boxScore.find(p => p.status !== "injured");
  if (firstHealthy) {
    firstHealthy.pts += diff;
  }

  return boxScore;
}

export function simulateGame(userTeam, opponentTeam, isHome = true, gameIndex = 0) {
  const userStats = getTeamStats(userTeam.players);
  
  const startDate = new Date(2025, 9, 22); 
  const gameDate = new Date(startDate);
  gameDate.setDate(startDate.getDate() + (gameIndex * 3));

  const formattedDate = gameDate.toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'short' 
  });
  
  let oppAvgOvr = 82;
  if (opponentTeam.players && opponentTeam.players.length > 0) {
    oppAvgOvr = opponentTeam.players.reduce((sum, p) => sum + (p.ovr || 80), 0) / opponentTeam.players.length;
  }

  const basePace = 106;
  const homeAdvantage = 2.0;

  // Multiplicador de calidad ajustado a favor del talento del usuario
  const userQualityBonus = (userStats.avgOvr - 80) * 1.35;
  const oppQualityBonus = (oppAvgOvr - 80) * 1.1; 

  const userLuck = randomVariance();
  const oppLuck = randomVariance();

  let userScore = Math.round(basePace + userQualityBonus + (isHome ? homeAdvantage : 0) + userLuck);
  let oppScore = Math.round(basePace + oppQualityBonus + (!isHome ? homeAdvantage : 0) + oppLuck);

  if (userScore === oppScore) {
    if (Math.random() > 0.5) {
      userScore += Math.floor(Math.random() * 4) + 2;
    } else {
      oppScore += Math.floor(Math.random() * 4) + 2;
    }
  }

  const userWon = userScore > oppScore;

  let newInjury = null;
  const healthyUserPlayers = userTeam.players.filter(p => p.status !== "injured");

  if (Math.random() < 0.05 && healthyUserPlayers.length > 0) {
    const randomIndex = Math.floor(Math.random() * healthyUserPlayers.length);
    newInjury = healthyUserPlayers[randomIndex];
  }

  const playerStats = generatePlayerBoxScore(userTeam.players, userScore);

  return {
    userScore,
    oppScore,
    oppName: opponentTeam.name,
    isHome,
    userWon,
    playerStats,
    newInjury,
    date: formattedDate
  };
}