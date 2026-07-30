import React, { useState } from 'react';
import { teamsDatabase } from '../data/teamsPlayersData';

export default function TradeMarket({ userPlayers, conferenceTeams, onExecuteTrade, isRegularSeasonFinished }) {
  const [selectedUserPlayerId, setSelectedUserPlayerId] = useState(userPlayers[0]?.id || null);
  const [selectedTeamId, setSelectedTeamId] = useState(conferenceTeams[0]?.id || 'okc');
  const [selectedTargetPlayer, setSelectedTargetPlayer] = useState(null);
  const [tradeMessage, setTradeMessage] = useState(null);

  const userPlayer = userPlayers.find(p => p.id === Number(selectedUserPlayerId));
  const targetTeam = conferenceTeams.find(t => t.id === selectedTeamId);

  const targetTeamPlayers = teamsDatabase[selectedTeamId] || [];

  const handleProposeTrade = () => {
    if (isRegularSeasonFinished || !userPlayer || !selectedTargetPlayer) return;

    const ovrDiff = selectedTargetPlayer.ovr - userPlayer.ovr;
    
    if (ovrDiff > 3) {
      setTradeMessage({
        success: false,
        text: `❌ Rechazado: ${targetTeam.name} no entrega a ${selectedTargetPlayer.name} (OVR ${selectedTargetPlayer.ovr}) a cambio de ${userPlayer.name} (OVR ${userPlayer.ovr}).`
      });
    } else {
      setTradeMessage({
        success: true,
        text: `✅ ¡Traspaso Cerrado! Bienvenido ${selectedTargetPlayer.name} a los Dallas Mavericks.`
      });

      onExecuteTrade(userPlayer, selectedTargetPlayer);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col gap-6">
      <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
            🔄 Mercado de Traspasos (NBA Trades)
          </h2>
          <p className="text-xs text-slate-400">Intercambiá jugadores reales de la liga para reforzar tu plantilla.</p>
        </div>

        {isRegularSeasonFinished && (
          <span className="bg-rose-950 text-rose-300 border border-rose-800 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider animate-pulse">
            🔒 Trade Deadline Passed
          </span>
        )}
      </div>

      {isRegularSeasonFinished ? (
        <div className="bg-slate-950 p-8 rounded-xl border border-slate-800 text-center flex flex-col items-center gap-3">
          <span className="text-4xl">🚫</span>
          <h3 className="text-lg font-black text-white uppercase">Mercado de Traspasos Cerrado</h3>
          <p className="text-xs text-slate-400 max-w-md">
            Llegaste a la Posttemporada (Play-In / Playoffs). Por reglamento de la NBA, la ventana de intercambios cerró hasta la próxima temporada.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* ENTREGAS */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">📤 Entregas (Dallas Mavericks)</span>
              
              <select
                value={selectedUserPlayerId}
                onChange={(e) => setSelectedUserPlayerId(e.target.value)}
                className="bg-slate-900 text-white font-bold text-sm p-2.5 rounded-lg border border-slate-700 outline-none cursor-pointer"
              >
                {userPlayers.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.pos}) - OVR {p.ovr} - ${p.salary}M
                  </option>
                ))}
              </select>

              {userPlayer && (
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80 text-xs flex flex-col gap-1">
                  <span className="font-bold text-white text-sm">{userPlayer.name}</span>
                  <span className="text-slate-400">Posición: <strong className="text-white">{userPlayer.pos}</strong> • OVR: <strong className="text-amber-400">{userPlayer.ovr}</strong></span>
                  <span className="text-slate-400">Salario: <strong className="text-emerald-400">${userPlayer.salary}M</strong></span>
                </div>
              )}
            </div>

            {/* RECIBES */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">📥 Recibes (Franquicia Rival)</span>
              
              <select
                value={selectedTeamId}
                onChange={(e) => {
                  setSelectedTeamId(e.target.value);
                  setSelectedTargetPlayer(null);
                }}
                className="bg-slate-900 text-white font-bold text-sm p-2.5 rounded-lg border border-slate-700 outline-none cursor-pointer"
              >
                {conferenceTeams.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.city} {t.name} (OVR {t.ovr})
                  </option>
                ))}
              </select>

              <div className="flex flex-col gap-1.5 max-h-[220px] overflow-y-auto pr-1">
                {targetTeamPlayers.map(p => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedTargetPlayer(p)}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex justify-between items-center ${
                      selectedTargetPlayer?.id === p.id 
                        ? 'bg-amber-950/60 border-amber-500 text-white font-bold' 
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <span className="font-bold">{p.name}</span>
                      <span className="text-slate-500 ml-2 font-mono">{p.pos}</span>
                    </div>
                    <div className="font-mono text-amber-400 font-bold flex items-center gap-2">
                      <span>OVR {p.ovr}</span>
                      <span className="text-emerald-400 font-normal text-[11px]">${p.salary}M</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {tradeMessage && (
            <div className={`p-3 rounded-lg text-xs font-bold text-center border ${
              tradeMessage.success 
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' 
                : 'bg-rose-950/80 border-rose-500 text-rose-300'
            }`}>
              {tradeMessage.text}
            </div>
          )}

          <button
            onClick={handleProposeTrade}
            disabled={!selectedTargetPlayer}
            className={`w-full font-black py-3 rounded-xl uppercase tracking-wider text-sm transition-all shadow-lg ${
              selectedTargetPlayer 
                ? 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer hover:scale-[1.01]' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            🤝 Proponer Intercambio Oficial
          </button>
        </>
      )}
    </div>
  );
}