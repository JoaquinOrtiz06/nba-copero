import React from 'react';

export default function PostseasonView({ 
  postseasonData, 
  userTeamId, 
  onSimulatePlayInGame, 
  onSimulatePlayoffMatch,
  onAdvanceRound 
}) {
  const { phase, playIn, playoffs } = postseasonData;

  const isRoundFinished = playoffs.bracket.length > 0 && playoffs.bracket.every(m => m.winner !== null);
  const isFinals = playoffs.roundKey === 'finals';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col gap-6">
      
      {/* CABECERA */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
            🏆 {phase === 'playin' ? 'Torneo Play-In' : playoffs.round}
          </h2>
          <p className="text-xs text-slate-400">
            {phase === 'playin' ? 'Partido a eliminación directa' : 'Series al mejor de 3 partidos (el primero a 2 victorias avanza)'}
          </p>
        </div>

        {/* BOTÓN PARA AVANZAR DE RONDA */}
        {phase === 'playoffs' && isRoundFinished && !playoffs.champion && (
          <button
            onClick={onAdvanceRound}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-4 py-2 rounded-lg text-xs uppercase tracking-wider transition-all animate-bounce cursor-pointer shadow-lg"
          >
            🚀 {isFinals ? 'Coronar al Campeón 🏆' : 'Avanzar a la Siguiente Ronda ➔'}
          </button>
        )}
      </div>

      {/* VISTA 1: PLAY-IN */}
      {phase === 'playin' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
              Partido 7º vs 8º (Ganador pasa a Playoffs)
            </span>
            <div className="flex justify-between items-center font-bold text-white text-sm">
              <span className={playIn.game7v8.home.id === userTeamId ? 'text-purple-400 font-extrabold' : ''}>
                #{7} {playIn.game7v8.home.name}
              </span>
              <span className="text-xs text-slate-500 font-mono">VS</span>
              <span className={playIn.game7v8.away.id === userTeamId ? 'text-purple-400 font-extrabold' : ''}>
                #{8} {playIn.game7v8.away.name}
              </span>
            </div>

            {!playIn.game7v8.winner ? (
              <button 
                onClick={() => onSimulatePlayInGame('7v8')}
                className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 rounded text-xs uppercase cursor-pointer"
              >
                ⚔️ Simular Partido 7v8
              </button>
            ) : (
              <div className="text-center bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-xs font-bold p-1.5 rounded">
                Clasificado Seed #7: {playIn.game7v8.winner.name}
              </div>
            )}
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">
              Partido 9º vs 10º (Perdedor Eliminado)
            </span>
            <div className="flex justify-between items-center font-bold text-white text-sm">
              <span className={playIn.game9v10.home.id === userTeamId ? 'text-purple-400 font-extrabold' : ''}>
                #{9} {playIn.game9v10.home.name}
              </span>
              <span className="text-xs text-slate-500 font-mono">VS</span>
              <span className={playIn.game9v10.away.id === userTeamId ? 'text-purple-400 font-extrabold' : ''}>
                #{10} {playIn.game9v10.away.name}
              </span>
            </div>

            {!playIn.game9v10.winner ? (
              <button 
                onClick={() => onSimulatePlayInGame('9v10')}
                className="w-full bg-rose-700 hover:bg-rose-600 text-white font-bold py-2 rounded text-xs uppercase cursor-pointer"
              >
                ⚔️ Simular Partido 9v10
              </button>
            ) : (
              <div className="text-center bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-bold p-1.5 rounded">
                Eliminado: {playIn.game9v10.loser.name}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VISTA 2: PLAYOFFS */}
      {phase === 'playoffs' && (
        <div className="flex flex-col gap-4">
          
          {/* PANTALLA DE CAMPEÓN */}
          {playoffs.champion ? (
            <div className="bg-gradient-to-b from-amber-950 via-slate-950 to-amber-950 border-2 border-amber-500 p-8 rounded-2xl text-center shadow-2xl flex flex-col items-center gap-4 relative overflow-hidden">
              <span className="text-6xl animate-bounce">🏆</span>
              <div>
                <span className="text-xs font-black text-amber-400 uppercase tracking-widest block mb-1">
                  CONFERENCE CHAMPIONS
                </span>
                <h3 className="text-4xl font-black text-white uppercase tracking-tight">
                  {playoffs.champion.name}
                </h3>
              </div>
              <div className="bg-amber-500/20 text-amber-300 border border-amber-500/50 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                👑 Reyes de la Conferencia
              </div>
            </div>
          ) : isFinals ? (
            
            /* DISEÑO DE FINAL DE CONFERENCIA CORREGIDO */
            <div className="bg-gradient-to-b from-amber-950/40 via-slate-950 to-slate-950 border-2 border-amber-500/80 p-6 rounded-2xl shadow-2xl flex flex-col gap-6 relative">
              <div className="flex justify-between items-center border-b border-amber-500/30 pb-3">
                <span className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
                  🔥 THE CONFERENCE FINALS • BEST OF 3
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">
                  El primero a 2 victorias
                </span>
              </div>

              {playoffs.bracket.map((match) => (
                <div key={match.id} className="flex flex-col gap-6">
                  
                  {/* ALINEACIÓN HORIZONTAL PROLIJA */}
                  <div className="grid grid-cols-12 items-center text-center gap-3">
                    
                    {/* EQUIPO LOCAL */}
                    <div className="col-span-5 bg-slate-900/90 p-5 rounded-xl border border-slate-800 flex flex-col gap-1 items-center justify-center">
                      <span className={`text-xl font-black ${match.home.id === userTeamId ? 'text-purple-400' : 'text-white'}`}>
                        {match.home.name}
                      </span>
                      <span className="text-xs text-slate-500 font-mono font-bold">OVR {match.home.ovr}</span>
                    </div>

                    {/* MARCADOR DE SERIE HORIZONTAL (2 - 0) */}
                    <div className="col-span-2 flex items-center justify-center">
                      <div className="bg-amber-950/90 border border-amber-500/70 px-4 py-2 rounded-xl shadow-lg flex items-center justify-center gap-2 font-mono text-2xl font-black text-amber-300 whitespace-nowrap">
                        <span>{match.homeWins}</span>
                        <span className="text-amber-500/60 font-sans font-light">-</span>
                        <span>{match.awayWins}</span>
                      </div>
                    </div>

                    {/* EQUIPO VISITANTE */}
                    <div className="col-span-5 bg-slate-900/90 p-5 rounded-xl border border-slate-800 flex flex-col gap-1 items-center justify-center">
                      <span className={`text-xl font-black ${match.away.id === userTeamId ? 'text-purple-400' : 'text-white'}`}>
                        {match.away.name}
                      </span>
                      <span className="text-xs text-slate-500 font-mono font-bold">OVR {match.away.ovr}</span>
                    </div>

                  </div>

                  {/* BOTÓN O CARTEL DE GANADOR */}
                  {!match.winner ? (
                    <button 
                      onClick={() => onSimulatePlayoffMatch(match.id)}
                      className="w-full bg-gradient-to-r from-amber-600 via-red-600 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-white font-black py-3.5 rounded-xl text-sm uppercase tracking-wider cursor-pointer shadow-xl transition-all hover:scale-[1.01]"
                    >
                      🏀 Simular Partido {match.homeWins + match.awayWins + 1} de la Final
                    </button>
                  ) : (
                    <div className="text-center text-sm font-black text-amber-300 bg-amber-950/80 border border-amber-500 p-3 rounded-xl shadow-lg">
                      🏆 ¡{match.winner.name} gana la Final de Conferencia!
                    </div>
                  )}
                </div>
              ))}
            </div>

          ) : (

            /* VISTA CUARTOS / SEMIS */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {playoffs.bracket.map((match) => {
                const isUserMatch = match.home.id === userTeamId || match.away.id === userTeamId;

                return (
                  <div 
                    key={match.id}
                    className={`bg-slate-950 p-4 rounded-xl border flex flex-col justify-between gap-3 ${
                      isUserMatch ? 'border-purple-500/80 bg-purple-950/20 shadow-purple-900/20 shadow-lg' : 'border-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs font-bold text-slate-400 border-b border-slate-800/80 pb-2">
                      <span>Cruce al Mejor de 3</span>
                      <span className="font-mono text-amber-400">Gana 2 partidos</span>
                    </div>

                    <div className="flex justify-between items-center text-sm font-bold my-1">
                      <span className={match.home.id === userTeamId ? 'text-purple-400 font-black text-base' : 'text-white'}>
                        {match.home.name}
                      </span>

                      <div className="font-mono text-lg font-black bg-slate-900 px-3 py-1 rounded-lg border border-slate-800 text-emerald-400 flex items-center gap-1">
                        <span>{match.homeWins}</span>
                        <span className="text-slate-600">-</span>
                        <span>{match.awayWins}</span>
                      </div>

                      <span className={match.away.id === userTeamId ? 'text-purple-400 font-black text-base' : 'text-white'}>
                        {match.away.name}
                      </span>
                    </div>

                    {!match.winner ? (
                      <button 
                        onClick={() => onSimulatePlayoffMatch(match.id)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg text-xs uppercase cursor-pointer transition-all hover:scale-[1.01]"
                      >
                        🏀 Simular Partido {match.homeWins + match.awayWins + 1}
                      </button>
                    ) : (
                      <div className="text-center text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 p-2 rounded-lg">
                        ✅ Ganador de la Serie: {match.winner.name}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
}