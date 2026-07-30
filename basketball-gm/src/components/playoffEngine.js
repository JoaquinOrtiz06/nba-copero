// src/components/playoffEngine.js

import { simulateGame } from './simulationEngine';

export function initPostseason(standings) {
  const userRank = standings.findIndex(t => t.id === 'dal') + 1;
  const isPlayIn = userRank >= 7 && userRank <= 10;

  return {
    phase: isPlayIn ? 'playin' : 'playoffs',
    playIn: {
      game7v8: { home: standings[6], away: standings[7], winner: null, loser: null },
      game9v10: { home: standings[8], away: standings[9], winner: null, loser: null },
      finalGame: { home: null, away: null, winner: null },
      seed7: null,
      seed8: null,
    },
    playoffs: {
      round: "Cuartos de Conferencia",
      roundKey: "quarterfinals",
      bracket: [],
      champion: null
    }
  };
}

export function setupPlayoffBracket(top6Teams, seed7, seed8) {
  const seeds = [...top6Teams, seed7, seed8];
  return [
    { id: 'm1', home: seeds[0], away: seeds[7], homeWins: 0, awayWins: 0, winner: null }, // #1 vs #8
    { id: 'm2', home: seeds[3], away: seeds[4], homeWins: 0, awayWins: 0, winner: null }, // #4 vs #5
    { id: 'm3', home: seeds[2], away: seeds[5], homeWins: 0, awayWins: 0, winner: null }, // #3 vs #6
    { id: 'm4', home: seeds[1], away: seeds[6], homeWins: 0, awayWins: 0, winner: null }, // #2 vs #7
  ];
}

export function simulateAIPlayoffMatch(match) {
  if (match.winner) return match;

  const homeOvr = match.home.ovr || 82;
  const awayOvr = match.away.ovr || 82;

  const diff = homeOvr - awayOvr;
  const homeWinProb = 0.50 + (diff * 0.05);

  if (Math.random() < homeWinProb) {
    match.homeWins += 1;
  } else {
    match.awayWins += 1;
  }

  if (match.homeWins >= 2) match.winner = match.home;
  if (match.awayWins >= 2) match.winner = match.away;

  return match;
}

export function advancePlayoffRound(playoffsData) {
  const currentBracket = playoffsData.bracket;
  const allFinished = currentBracket.every(m => m.winner !== null);

  if (!allFinished) return playoffsData;

  if (playoffsData.roundKey === 'quarterfinals') {
    const winners = currentBracket.map(m => m.winner);
    const semiBracket = [
      { id: 's1', home: winners[0], away: winners[1], homeWins: 0, awayWins: 0, winner: null },
      { id: 's2', home: winners[2], away: winners[3], homeWins: 0, awayWins: 0, winner: null },
    ];

    return {
      ...playoffsData,
      round: "Semifinales de Conferencia",
      roundKey: "semifinals",
      bracket: semiBracket
    };
  } 
  
  if (playoffsData.roundKey === 'semifinals') {
    const winners = currentBracket.map(m => m.winner);
    const finalBracket = [
      { id: 'f1', home: winners[0], away: winners[1], homeWins: 0, awayWins: 0, winner: null }
    ];

    return {
      ...playoffsData,
      round: "Final de Conferencia",
      roundKey: "finals",
      bracket: finalBracket
    };
  }

  if (playoffsData.roundKey === 'finals') {
    const champ = currentBracket[0].winner;
    return {
      ...playoffsData,
      round: "¡Campeón!",
      roundKey: "completed",
      champion: champ
    };
  }

  return playoffsData;
}