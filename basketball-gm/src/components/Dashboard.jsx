import { useState } from "react";
import TeamHeader from "./TeamHeader";
import NextGameCard from "./NextGameCard";
import RosterTable from "./RosterTable";
import PlayerDetail from "./PlayerDetail";
import PostseasonView from "./PostseasonView";
import TradeMarket from "./TradeMarket";
import TrophyCabinet from "./TrophyCabinet";
import HallOfFameModal from "./HallOfFameModal";
import LeaderboardView from "./LeaderboardView";
import { simulateGame } from './simulationEngine';
import { simulateLeagueDay } from './leagueEngine';
import { initPostseason, setupPlayoffBracket, simulateAIPlayoffMatch, advancePlayoffRound } from './playoffEngine';
import { calculateSeasonAwards } from "./awardsEngine";
import { mockTeam, mockPlayers } from "../data/mockPlayers";
import { mockConferenceTeams } from "../data/mockConference";

const REGULAR_SEASON_GAMES = 14;

export default function Dashboard() {
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [activeTab, setActiveTab] = useState('roster');

  const [conferenceStandings, setConferenceStandings] = useState(mockConferenceTeams);
  const [teamRecord, setTeamRecord] = useState({ wins: 0, losses: 0 });
  
  const [playersList, setPlayersList] = useState(
    mockPlayers.map(p => ({ 
      ...p, 
      energy: 100, 
      injuryGames: p.status === 'injured' ? 3 : 0, 
      isInfiltrated: false 
    }))
  );

  const [gameHistory, setGameHistory] = useState([]);
  const [lastGameResult, setLastGameResult] = useState(null);
  const [postseasonData, setPostseasonData] = useState(null);

  // Estados de Legado y Salón de la Fama
  const [seasonNumber, setSeasonNumber] = useState(1);
  const [trophies, setTrophies] = useState({ championships: 0, conferenceTitles: 0, regularSeasonTop: 0 });
  const [awardsHistory, setAwardsHistory] = useState([]);
  const [showHallOfFame, setShowHallOfFame] = useState(false);

  const [opponentIndex, setOpponentIndex] = useState(0);
  const opponentsList = mockConferenceTeams.filter(t => t.id !== 'dal');
  const currentOpponent = opponentsList[opponentIndex % opponentsList.length];

  const selectedPlayer = playersList.find((p) => p.id === selectedPlayerId) ?? null;
  const injuredPlayers = playersList.filter(p => p.status === 'injured');

  const totalMinutes = playersList.reduce((sum, p) => sum + (p.minutes || 0), 0);
  const isMinutesOverLimit = totalMinutes > 240;

  const totalGamesPlayed = gameHistory.length;
  const isRegularSeasonFinished = totalGamesPlayed >= REGULAR_SEASON_GAMES;
  const userRank = conferenceStandings.findIndex(t => t.id === 'dal') + 1;

  // 1. GUARDAR TEMPORADA Y AVANZAR A LA SIGUIENTE
  const handleNextSeason = () => {
    const seasonAwards = calculateSeasonAwards(playersList, conferenceStandings, teamRecord);
    
    let newTrophies = { ...trophies };
    if (userRank === 1) newTrophies.regularSeasonTop += 1;
    if (postseasonData?.playoffs?.champion?.id === 'dal') {
      newTrophies.championships += 1;
      newTrophies.conferenceTitles += 1;
    }

    setTrophies(newTrophies);
    setAwardsHistory(prev => [{ seasonNumber, awards: seasonAwards }, ...prev]);
    setSeasonNumber(prev => prev + 1);

    setTeamRecord({ wins: 0, losses: 0 });
    setConferenceStandings(mockConferenceTeams);
    setGameHistory([]);
    setLastGameResult(null);
    setPostseasonData(null);
    setOpponentIndex(0);
    setActiveTab('roster');

    setPlayersList(
      mockPlayers.map(p => ({ 
        ...p, 
        energy: 100, 
        injuryGames: 0, 
        status: 'healthy',
        isInfiltrated: false 
      }))
    );
  };

  // 2. BORRAR TODO Y REINICIAR CARRERA DESDE CERO
  const handleFullResetCareer = () => {
    setSeasonNumber(1);
    setTrophies({ championships: 0, conferenceTitles: 0, regularSeasonTop: 0 });
    setAwardsHistory([]);

    setTeamRecord({ wins: 0, losses: 0 });
    setConferenceStandings(mockConferenceTeams);
    setGameHistory([]);
    setLastGameResult(null);
    setPostseasonData(null);
    setOpponentIndex(0);
    setActiveTab('roster');

    setPlayersList(
      mockPlayers.map(p => ({ 
        ...p, 
        energy: 100, 
        injuryGames: 0, 
        status: 'healthy',
        isInfiltrated: false 
      }))
    );
  };

  const handleExecuteTrade = (oldPlayer, newPlayer) => {
    setPlayersList(prev => prev.map(p => {
      if (p.id === oldPlayer.id) {
        return {
          ...newPlayer,
          id: oldPlayer.id,
          minutes: oldPlayer.minutes,
          energy: 100,
          status: "healthy",
          stats: { pts: 12.0, reb: 4.0, ast: 3.0 }
        };
      }
      return p;
    }));
  };

  if (isRegularSeasonFinished && !postseasonData) {
    const initData = initPostseason(conferenceStandings);
    if (initData.phase === 'playoffs') {
      initData.playoffs.bracket = setupPlayoffBracket(
        conferenceStandings.slice(0, 6),
        conferenceStandings[6],
        conferenceStandings[7]
      );
    }
    setPlayersList(prev => prev.map(p => ({ ...p, energy: 100 })));
    setPostseasonData(initData);
    setActiveTab('postseason');
  }

  const handleUpdateMinutes = (playerId, change) => {
    setPlayersList(prev => prev.map(player => {
      if (player.id === playerId) {
        const currentMins = player.minutes || 0;
        if (change > 0 && totalMinutes >= 240) return player;
        const newMinutes = Math.max(0, Math.min(42, currentMins + change));
        return { ...player, minutes: newMinutes };
      }
      return player;
    }));
  };

  const handleInfiltrate = (playerId) => {
    setPlayersList(prev => prev.map(p => {
      if (p.id === playerId) {
        return { ...p, status: 'healthy', injuryGames: 0, isInfiltrated: true, ovr: Math.max(60, p.ovr - 5) };
      }
      return p;
    }));
  };

  const handleSetRest = (playerId) => {
    setPlayersList(prev => prev.map(p => {
      if (p.id === playerId) {
        return { ...p, injuryGames: 3, isInfiltrated: false };
      }
      return p;
    }));
  };

  const handleSimulate = () => {
    if (isRegularSeasonFinished || isMinutesOverLimit) return;

    const opponentTeam = {
      name: `${currentOpponent.city} ${currentOpponent.name}`,
      players: [
        { name: "P. Estrella", ovr: currentOpponent.ovr, status: "healthy", stats: { pts: 24.0, reb: 6.0, ast: 5.0 } },
        { name: "P. Titular A", ovr: currentOpponent.ovr - 2, status: "healthy", stats: { pts: 18.0, reb: 4.0, ast: 3.0 } },
        { name: "P. Titular B", ovr: currentOpponent.ovr - 4, status: "healthy", stats: { pts: 14.0, reb: 7.0, ast: 2.0 } },
        { name: "P. Rol C", ovr: currentOpponent.ovr - 6, status: "healthy", stats: { pts: 10.0, reb: 3.0, ast: 4.0 } },
        { name: "P. Rol D", ovr: currentOpponent.ovr - 8, status: "healthy", stats: { pts: 8.0, reb: 8.0, ast: 1.0 } },
      ]
    };

    const myTeam = { name: mockTeam.name, players: playersList };
    const isHomeGame = (gameHistory.length % 2 === 0);
    const result = simulateGame(myTeam, opponentTeam, isHomeGame, totalGamesPlayed);

    const newRecord = {
      wins: result.userWon ? teamRecord.wins + 1 : teamRecord.wins,
      losses: !result.userWon ? teamRecord.losses + 1 : teamRecord.losses
    };
    setTeamRecord(newRecord);

    const standingsWithUserUpdated = conferenceStandings.map(t => 
      t.id === 'dal' ? { ...t, wins: newRecord.wins, losses: newRecord.losses } : t
    );
    const nextStandings = simulateLeagueDay(standingsWithUserUpdated, 'dal');
    setConferenceStandings(nextStandings);

    let currentPlayers = playersList.map(p => {
      let newEnergy = p.energy;

      if (p.status === 'healthy') {
        const mins = p.minutes || 0;
        if (mins >= 30) {
          newEnergy = Math.max(70, p.energy - 6);
        } else if (mins >= 20) {
          newEnergy = Math.max(70, p.energy - 3);
        } else {
          newEnergy = Math.min(100, p.energy + 15);
        }
      } else {
        newEnergy = Math.min(100, p.energy + 25);
      }

      if (p.isInfiltrated) {
        return { ...p, status: 'injured', injuryGames: 2, isInfiltrated: false, ovr: p.ovr + 5, energy: newEnergy };
      }
      if (p.status === 'injured') {
        const remaining = p.injuryGames - 1;
        return { ...p, injuryGames: Math.max(0, remaining), status: remaining <= 0 ? 'healthy' : 'injured', energy: newEnergy };
      }
      return { ...p, energy: newEnergy };
    });

    if (result.newInjury) {
      currentPlayers = currentPlayers.map(p => {
        if (p.id === result.newInjury.id && !p.isInfiltrated) {
          return { ...p, status: 'injured', injuryGames: 3, isInfiltrated: false, minutes: 0 };
        }
        return p;
      });
    }

    const currentGamesCount = totalGamesPlayed + 1;

    const updatedPlayers = currentPlayers.map(player => {
      const matchStat = result.playerStats.find(p => p.id === player.id);
      if (!matchStat || player.status === "injured") return player;

      const newPts = ((player.stats.pts * (currentGamesCount - 1)) + matchStat.pts) / currentGamesCount;
      const newReb = ((player.stats.reb * (currentGamesCount - 1)) + matchStat.reb) / currentGamesCount;
      const newAst = ((player.stats.ast * (currentGamesCount - 1)) + matchStat.ast) / currentGamesCount;

      return {
        ...player,
        stats: {
          ...player.stats,
          pts: Number(newPts.toFixed(1)),
          reb: Number(newReb.toFixed(1)),
          ast: Number(newAst.toFixed(1))
        }
      };
    });

    setPlayersList(updatedPlayers);
    setGameHistory(prev => [result, ...prev]);
    setLastGameResult(result);
    setOpponentIndex(prev => prev + 1);
    setActiveTab('boxscore');
  };

  const handleSimulatePlayIn = (gameKey) => {
    if (!postseasonData) return;
    const pData = { ...postseasonData };

    if (gameKey === '7v8') {
      const g = pData.playIn.game7v8;
      const userIsHome = g.home.id === 'dal';
      const myTeam = { name: mockTeam.name, players: playersList };
      const oppTeam = { name: userIsHome ? g.away.name : g.home.name, players: [] };
      
      const res = simulateGame(myTeam, oppTeam, userIsHome);
      g.winner = res.userWon ? (userIsHome ? g.home : g.away) : (userIsHome ? g.away : g.home);
      g.loser = g.winner.id === g.home.id ? g.away : g.home;
      pData.playIn.seed7 = g.winner;

      const g910 = pData.playIn.game9v10;
      g910.winner = g910.home;
      pData.playIn.seed8 = g910.winner;

      pData.phase = 'playoffs';
      pData.playoffs.bracket = setupPlayoffBracket(
        conferenceStandings.slice(0, 6),
        pData.playIn.seed7,
        pData.playIn.seed8
      );
      setLastGameResult(res);
    } else if (gameKey === '9v10') {
      const g = pData.playIn.game9v10;
      const userIsHome = g.home.id === 'dal';
      const myTeam = { name: mockTeam.name, players: playersList };
      const oppTeam = { name: userIsHome ? g.away.name : g.home.name, players: [] };

      const res = simulateGame(myTeam, oppTeam, userIsHome);
      g.winner = res.userWon ? (userIsHome ? g.home : g.away) : (userIsHome ? g.away : g.home);
      g.loser = g.winner.id === g.home.id ? g.away : g.home;
      pData.playIn.seed8 = g.winner;

      if (pData.playIn.seed7) {
        pData.phase = 'playoffs';
        pData.playoffs.bracket = setupPlayoffBracket(
          conferenceStandings.slice(0, 6),
          pData.playIn.seed7,
          pData.playIn.seed8
        );
      }
      setLastGameResult(res);
    }

    setPostseasonData(pData);
  };

  const handleSimulatePlayoffMatch = (matchId) => {
    const pData = { ...postseasonData };
    const bracket = pData.playoffs.bracket;

    pData.playoffs.bracket = bracket.map(match => {
      if (match.winner) return match;

      const isUserMatch = match.home.id === 'dal' || match.away.id === 'dal';

      if (isUserMatch && match.id === matchId) {
        const userIsHome = match.home.id === 'dal';
        const oppData = userIsHome ? match.away : match.home;
        const myTeam = { name: mockTeam.name, players: playersList };
        
        const oppTeam = {
          name: oppData.name,
          players: [
            { name: "P. Estrella", ovr: oppData.ovr, status: "healthy", stats: { pts: 24.0, reb: 6.0, ast: 5.0 } },
            { name: "P. Titular A", ovr: oppData.ovr - 2, status: "healthy", stats: { pts: 18.0, reb: 4.0, ast: 3.0 } },
            { name: "P. Titular B", ovr: oppData.ovr - 4, status: "healthy", stats: { pts: 14.0, reb: 7.0, ast: 2.0 } },
            { name: "P. Rol C", ovr: oppData.ovr - 6, status: "healthy", stats: { pts: 10.0, reb: 3.0, ast: 4.0 } },
            { name: "P. Rol D", ovr: oppData.ovr - 8, status: "healthy", stats: { pts: 8.0, reb: 8.0, ast: 1.0 } },
          ]
        };

        const res = simulateGame(myTeam, oppTeam, userIsHome);

        if (res.userWon) {
          if (userIsHome) match.homeWins += 1; else match.awayWins += 1;
        } else {
          if (userIsHome) match.awayWins += 1; else match.homeWins += 1;
        }

        if (match.homeWins >= 2) match.winner = match.home;
        if (match.awayWins >= 2) match.winner = match.away;
        
        setLastGameResult(res);
        setGameHistory(prev => [res, ...prev]);

        setPlayersList(prev => prev.map(p => {
          let newEnergy = p.energy;
          if (p.status === 'healthy') {
            const mins = p.minutes || 0;
            newEnergy = mins >= 25 ? Math.max(30, p.energy - Math.round(mins * 0.45)) : Math.min(100, p.energy + 15);
          } else {
            newEnergy = Math.min(100, p.energy + 25);
          }
          return { ...p, energy: newEnergy };
        }));

      } else if (!isUserMatch) {
        return simulateAIPlayoffMatch(match);
      }

      return match;
    });

    setPostseasonData(pData);
  };

  const handleAdvanceRound = () => {
    if (!postseasonData) return;
    const updated = advancePlayoffRound(postseasonData.playoffs);
    setPostseasonData({
      ...postseasonData,
      playoffs: updated
    });
  };

  const currentTeamData = {
    ...mockTeam,
    record: teamRecord,
    conferenceRank: userRank
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <TeamHeader team={currentTeamData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mt-6">
        
        {/* COLUMNA IZQUIERDA */}
        <div className="lg:col-span-1 flex flex-col gap-5">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-4">
            
            {!isRegularSeasonFinished ? (
              <>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Próximo Encuentro</span>
                    <span className="text-[11px] font-mono text-amber-400 font-bold">Partida {totalGamesPlayed + 1}/{REGULAR_SEASON_GAMES}</span>
                  </div>
                  <h3 className="text-xl font-black text-white mt-0.5">
                    vs {currentOpponent.city} {currentOpponent.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    OVR Rival: <strong className="text-amber-400">{currentOpponent.ovr}</strong> • {gameHistory.length % 2 === 0 ? 'Local' : 'Visitante'}
                  </p>
                </div>

                <button 
                  onClick={handleSimulate}
                  disabled={isMinutesOverLimit}
                  className={`w-full font-black py-3 px-4 rounded-lg transition-all shadow-md cursor-pointer text-sm uppercase tracking-wide ${
                    isMinutesOverLimit
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      : 'bg-red-600 hover:bg-red-700 text-white hover:scale-[1.01]'
                  }`}
                >
                  {isMinutesOverLimit ? '⚠️ Ajustá Minutos (>240m)' : '🏀 Simular Partido'}
                </button>
              </>
            ) : (
              <div className="text-center py-2 flex flex-col gap-3">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
                    🏁 Temporada Finalizada
                  </span>
                  <p className="text-lg font-black text-white">Posición Final: #{userRank}</p>
                </div>

                {userRank <= 6 && (
                  <div className="p-2.5 bg-emerald-950/80 border border-emerald-500/50 rounded-lg text-emerald-300 text-xs font-bold">
                    🎉 ¡CLASIFICADO A PLAYOFFS DIRECTO!
                  </div>
                )}

                {userRank >= 7 && userRank <= 10 && (
                  <div className="p-2.5 bg-amber-950/80 border border-amber-500/50 rounded-lg text-amber-300 text-xs font-bold">
                    ⚔️ CLASIFICADO AL TORNEO PLAY-IN
                  </div>
                )}

                {userRank > 10 && (
                  <div className="p-2.5 bg-rose-950/80 border border-rose-500/50 rounded-lg text-rose-300 text-xs font-bold">
                    ❌ ELIMINADO DE LA TEMPORADA
                  </div>
                )}

                <button
                  onClick={handleNextSeason}
                  className="w-full bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-black py-2.5 px-4 rounded-lg text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer hover:scale-[1.02]"
                >
                  🔄 Iniciar Nueva Temporada
                </button>
              </div>
            )}

            {lastGameResult && (
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-center">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Último Marcador</span>
                <p className="text-base font-extrabold text-white mt-0.5">
                  {mockTeam.name} {lastGameResult.userScore} - {lastGameResult.oppScore} {lastGameResult.oppName}
                </p>
                <p className={`text-[11px] font-bold mt-0.5 ${lastGameResult.userWon ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {lastGameResult.userWon ? 'VICTORIA' : 'DERROTA'}
                </p>
              </div>
            )}
          </div>

          {/* DEPARTAMENTO MÉDICO */}
          {injuredPlayers.length > 0 && (
            <div className="bg-rose-950/40 border border-rose-900/60 p-4 rounded-xl text-rose-200">
              <span className="font-bold text-xs uppercase tracking-wider text-rose-400 block mb-2">
                🏥 Departamento Médico ({injuredPlayers.length})
              </span>

              {injuredPlayers.map(player => (
                <div key={player.id} className="text-xs bg-rose-900/20 p-2.5 rounded-lg border border-rose-800/30 mb-2 last:mb-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-white">{player.name}</span>
                    <span className="text-rose-300 font-mono text-[11px]">{player.injuryGames} p. baja</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-1.5 mt-2">
                    <button 
                      onClick={() => handleInfiltrate(player.id)}
                      className="bg-amber-600/80 hover:bg-amber-600 text-white font-bold py-1 px-1.5 rounded text-[10px] transition-colors cursor-pointer text-center"
                    >
                      💉 Infiltrar (-5 OVR)
                    </button>
                    <button 
                      onClick={() => handleSetRest(player.id)}
                      className="bg-rose-800/80 hover:bg-rose-800 text-white font-bold py-1 px-1.5 rounded text-[10px] transition-colors cursor-pointer text-center"
                    >
                      🛌 Reposo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <PlayerDetail
            player={selectedPlayer}
            onClose={() => setSelectedPlayerId(null)}
          />
        </div>

        {/* COLUMNA DERECHA */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          
          {/* BARRA DE PESTAÑAS */}
          <div className="flex items-center gap-1.5 border-b border-slate-800 pb-3 mb-4 flex-wrap">
            <button
              onClick={() => setActiveTab('roster')}
              className={`px-2.5 py-2 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'roster' 
                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              📋 Plantilla
            </button>

            <button
              onClick={() => setActiveTab('trades')}
              className={`px-2.5 py-2 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'trades' 
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              🔄 Mercado
            </button>

            <button
              onClick={() => setActiveTab('trophies')}
              className={`px-2.5 py-2 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'trophies' 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              🏆 Vitrina
            </button>

            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-2.5 py-2 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'leaderboard' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              🌍 Ranking
            </button>

            <button
              onClick={() => setActiveTab('boxscore')}
              className={`px-2.5 py-2 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'boxscore' 
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              📊 Box Score
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-2.5 py-2 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'history' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              📜 Historial
            </button>

            <button
              onClick={() => setActiveTab('standings')}
              className={`px-2.5 py-2 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'standings' 
                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              🏆 Posiciones
            </button>

            {isRegularSeasonFinished && (
              <button
                onClick={() => setActiveTab('postseason')}
                className={`px-2.5 py-2 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'postseason' 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                ⚔️ Playoff
              </button>
            )}
          </div>

          {/* VISTAS */}
          {activeTab === 'roster' && (
            <RosterTable
              players={playersList}
              selectedId={selectedPlayerId}
              onSelectPlayer={setSelectedPlayerId}
              onUpdateMinutes={handleUpdateMinutes}
            />
          )}

          {activeTab === 'trades' && (
            <TradeMarket
              userPlayers={playersList}
              conferenceTeams={opponentsList}
              onExecuteTrade={handleExecuteTrade}
              isRegularSeasonFinished={isRegularSeasonFinished}
            />
          )}

          {activeTab === 'trophies' && (
            <TrophyCabinet
              trophies={trophies}
              awardsHistory={awardsHistory}
              seasonNumber={seasonNumber}
              onOpenHallOfFame={() => setShowHallOfFame(true)}
            />
          )}

          {activeTab === 'leaderboard' && (
            <LeaderboardView />
          )}

          {activeTab === 'boxscore' && (
            <div>
              {lastGameResult ? (
                <div>
                  <div className="flex justify-between items-center mb-4 bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-xs font-bold text-slate-400 uppercase">Estadísticas vs {lastGameResult.oppName}</span>
                    <span className="text-xs text-slate-400 font-mono">ENERGÍA | OVR | PTS | REB | AST</span>
                  </div>

                  <div className="divide-y divide-slate-800">
                    {lastGameResult.playerStats.map((p) => {
                      const fullPlayerData = playersList.find(item => item.id === p.id);
                      const energy = fullPlayerData ? fullPlayerData.energy : 100;

                      return (
                        <div key={p.id} className="py-2.5 flex justify-between items-center text-sm hover:bg-slate-800/40 px-2 rounded transition-colors">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{p.name}</span>
                            <span className="text-xs text-slate-500 uppercase">{p.pos}</span>
                            
                            {p.status === "injured" && (
                              <span className="text-[10px] font-bold text-rose-400 bg-rose-950 px-1.5 py-0.5 rounded">
                                Baja
                              </span>
                            )}
                            
                            {p.isInfiltrated && (
                              <span className="text-[10px] font-bold text-amber-300 bg-amber-950 px-1.5 py-0.5 rounded border border-amber-500/60 flex items-center gap-1 animate-pulse">
                                💉 Infiltrado
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 font-mono text-sm">
                            <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                              energy < 65 ? 'text-rose-400 bg-rose-950' : energy < 80 ? 'text-amber-400 bg-amber-950' : 'text-emerald-400 bg-emerald-950'
                            }`}>
                              ⚡ {energy}%
                            </span>

                            <span className={`font-bold text-xs px-2 py-0.5 rounded ${
                              p.isInfiltrated 
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60' 
                                : 'bg-slate-800 text-slate-300'
                            }`}>
                              OVR {p.ovr}
                            </span>

                            <div className="font-bold text-emerald-400">
                              {p.pts} <span className="text-xs font-normal text-slate-400">pts</span>
                              <span className="text-slate-600 font-normal mx-1 font-sans">|</span>
                              {p.reb} <span className="text-xs font-normal text-slate-400">reb</span>
                              <span className="text-slate-600 font-normal mx-1 font-sans">|</span>
                              {p.ast} <span className="text-xs font-normal text-slate-400">ast</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 text-sm">
                  Simulá un partido para ver el reporte acá.
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              {gameHistory.length > 0 ? (
                <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1">
                  {gameHistory.map((game, index) => (
                    <div 
                      key={index} 
                      className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border-l-4 text-sm"
                      style={{ borderColor: game.userWon ? '#10b981' : '#f43f5e' }}
                    >
                      <div>
                        <span className="font-bold text-white">vs {game.oppName}</span>
                        <span className="text-xs text-slate-500 block">{game.isHome ? 'Local' : 'Visitante'} • {game.date}</span>
                      </div>
                      <div className="text-right font-mono font-bold">
                        <span className={game.userWon ? 'text-emerald-400' : 'text-rose-400'}>
                          {game.userScore} - {game.oppScore}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 text-sm">
                  Aún no hay partidos registrados.
                </div>
              )}
            </div>
          )}

          {activeTab === 'standings' && (
            <div>
              <div className="flex justify-between items-center mb-3 text-xs text-slate-400 px-2 font-bold uppercase tracking-wider">
                <span>POS / EQUIPO</span>
                <span className="font-mono">GAN - PER | %</span>
              </div>

              <div className="flex flex-col gap-1.5 max-h-[420px] overflow-y-auto pr-1">
                {conferenceStandings.map((team, idx) => {
                  const isUser = team.id === 'dal';
                  const isPlayoffZone = idx < 6;
                  const isPlayInZone = idx >= 6 && idx < 10;
                  const totalGames = team.wins + team.losses;
                  const winPct = totalGames > 0 ? ((team.wins / totalGames) * 100).toFixed(1) : "0.0";

                  return (
                    <div 
                      key={team.id}
                      className={`flex justify-between items-center p-2.5 rounded-lg text-sm border transition-colors ${
                        isUser 
                          ? 'bg-purple-950/60 border-purple-500/60 text-white font-bold' 
                          : 'bg-slate-950/60 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`font-mono font-extrabold text-xs w-5 text-center ${
                          isPlayoffZone ? 'text-emerald-400' : isPlayInZone ? 'text-amber-400' : 'text-slate-500'
                        }`}>
                          #{idx + 1}
                        </span>
                        <div>
                          <span className="font-bold">{team.city} {team.name}</span>
                          {isUser && <span className="ml-2 text-[10px] bg-purple-500/30 text-purple-300 px-1.5 py-0.5 rounded uppercase">Vos</span>}
                        </div>
                      </div>

                      <div className="font-mono text-xs text-right">
                        <span className="font-bold text-white">{team.wins}</span> - <span className="text-slate-400">{team.losses}</span>
                        <span className="ml-3 text-slate-500 font-normal">{winPct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex gap-4 text-[11px] text-slate-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Top 6 (Playoffs)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span> 7-10 (Play-In)</span>
              </div>
            </div>
          )}

          {activeTab === 'postseason' && postseasonData && (
            <PostseasonView 
              postseasonData={postseasonData} 
              userTeamId="dal" 
              onSimulatePlayInGame={handleSimulatePlayIn} 
              onSimulatePlayoffMatch={handleSimulatePlayoffMatch} 
              onAdvanceRound={handleAdvanceRound}
              onResetSeason={handleNextSeason}
            />
          )}

        </div>
      </div>

      {/* MODAL DEL SALÓN DE LA FAMA */}
      {showHallOfFame && (
        <HallOfFameModal
          trophies={trophies}
          awardsHistory={awardsHistory}
          seasonNumber={seasonNumber}
          onClose={() => setShowHallOfFame(false)}
          onRestartCareer={() => {
            setShowHallOfFame(false);
            handleFullResetCareer();
          }}
        />
      )}
    </div>
  );
}