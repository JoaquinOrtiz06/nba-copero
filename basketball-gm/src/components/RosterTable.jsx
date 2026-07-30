import React from 'react';

export default function RosterTable({ players, selectedId, onSelectPlayer, onUpdateMinutes }) {
  const totalMinutes = players.reduce((sum, p) => sum + (p.minutes || 0), 0);
  const isOverLimit = totalMinutes > 240;

  // Solo consideramos para el TOP 5 a los jugadores que NO estén lesionados
  const healthyPlayers = players.filter(p => p.status !== 'injured');
  const sortedHealthyByMins = [...healthyPlayers].sort((a, b) => (b.minutes || 0) - (a.minutes || 0));

  const top5Ids = sortedHealthyByMins.slice(0, 5).map(p => p.id);
  const sixthManId = sortedHealthyByMins[5] ? sortedHealthyByMins[5].id : null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">📋 Plantilla y Rotación</h2>
          <p className="text-xs text-slate-400">Ajustá los minutos para cuidar la energía (Máximo 240m)</p>
        </div>
        <div className={`text-xs font-mono px-3 py-1.5 rounded-lg border font-bold ${
          totalMinutes === 240 
            ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400' 
            : isOverLimit
            ? 'bg-rose-950/80 border-rose-500/80 text-rose-300 animate-pulse'
            : 'bg-amber-950/60 border-amber-500/50 text-amber-400'
        }`}>
          Minutos: {totalMinutes}/240 {isOverLimit && "⚠️ EXCEDIDO"}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
            <tr>
              <th className="p-3">Jugador</th>
              <th className="p-3 text-center">POS</th>
              <th className="p-3 text-center">OVR</th>
              <th className="p-3 text-center">Energía</th>
              <th className="p-3 text-center">Minutos</th>
              <th className="p-3 text-center">PTS</th>
              <th className="p-3 text-center">Rol Táctico</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {players.map((player) => {
              const isSelected = player.id === selectedId;
              const isInjured = player.status === 'injured';
              
              // Roles limpios sin romper alineación
              const isStarter = !isInjured && top5Ids.includes(player.id);
              const isSixthMan = !isInjured && !isStarter && player.id === sixthManId && (player.minutes || 0) >= 18;

              const energy = player.energy !== undefined ? player.energy : 100;

              return (
                <tr 
                  key={player.id}
                  onClick={() => onSelectPlayer(player.id)}
                  className={`hover:bg-slate-800/50 transition-colors cursor-pointer ${
                    isSelected ? 'bg-sky-950/40 border-l-4 border-sky-400' : ''
                  }`}
                >
                  {/* Nombre y Tag de Estado */}
                  <td className="p-3">
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{player.name}</span>
                      {isInjured && (
                        <span className="text-[10px] font-extrabold bg-rose-950 text-rose-400 px-2 py-0.5 rounded border border-rose-800/80">
                          Baja
                        </span>
                      )}
                      {player.isInfiltrated && (
                        <span className="text-[10px] font-extrabold bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-500/60">
                          💉
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-3 text-center font-mono text-xs text-slate-400">{player.pos}</td>
                  <td className="p-3 text-center font-bold font-mono text-amber-400">{player.ovr}</td>

                  {/* Energía ⚡ */}
                  <td className="p-3 text-center">
                    <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded inline-block min-w-[55px] ${
                      energy < 65 ? 'text-rose-400 bg-rose-950/80' : energy < 80 ? 'text-amber-400 bg-amber-950/80' : 'text-emerald-400 bg-emerald-950/80'
                    }`}>
                      ⚡ {energy}%
                    </span>
                  </td>

                  {/* Selector de Minutos Prolijo */}
                  <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between bg-slate-950 py-1 px-2 rounded-lg border border-slate-800 w-28 mx-auto">
                      <button
                        onClick={() => onUpdateMinutes(player.id, -2)}
                        disabled={player.minutes <= 0}
                        className="text-slate-400 hover:text-white disabled:opacity-20 font-black px-2 py-0.5 rounded cursor-pointer hover:bg-slate-800 transition-colors"
                      >
                        -
                      </button>
                      <span className="font-mono font-bold text-white text-xs">
                        {player.minutes || 0}m
                      </span>
                      <button
                        onClick={() => onUpdateMinutes(player.id, 2)}
                        disabled={totalMinutes >= 240 || player.minutes >= 42}
                        className="text-slate-400 hover:text-white disabled:opacity-20 font-black px-2 py-0.5 rounded cursor-pointer hover:bg-slate-800 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </td>

                  <td className="p-3 text-center font-mono text-xs text-slate-300">{player.stats.pts}</td>

                  {/* Badges de Rol Estandarizados (Mismo Ancho exacto) */}
                  <td className="p-3 text-center">
                    {isInjured ? (
                      <span className="inline-flex items-center justify-center w-24 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-950/60 text-rose-400 border border-rose-900/60">
                        🏥 Baja
                      </span>
                    ) : isStarter ? (
                      <span className="inline-flex items-center justify-center w-24 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-950 text-purple-300 border border-purple-800">
                        ⭐ Titular
                      </span>
                    ) : isSixthMan ? (
                      <span className="inline-flex items-center justify-center w-24 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-950 text-amber-300 border border-amber-800/80">
                        🔥 6º Hombre
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-24 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800/80 text-slate-400">
                        Banca
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}