import React from 'react';

export default function TrophyCabinet({ trophies, awardsHistory, seasonNumber, onOpenHallOfFame }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col gap-6">
      
      {/* CABECERA CON EL BOTÓN DEL SALÓN DE LA FAMA */}
      <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
            🏛️ Vitrina de Trofeos & Hall of Fame
          </h2>
          <p className="text-xs text-slate-400">Palmarés histórico de tu carrera como Entrenador Principal (Temporada Actual #{seasonNumber}).</p>
        </div>

        <button
          onClick={onOpenHallOfFame}
          className="bg-amber-600 hover:bg-amber-500 text-white font-black px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg hover:scale-[1.02] flex items-center gap-2"
        >
          📜 Ver Salón de la Fama (Reporte DT)
        </button>
      </div>

      {/* VITRINA DE TROFEOS COLECTIVOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* TROFEO 1: ANILLO NBA */}
        <div className="bg-gradient-to-b from-amber-950/40 to-slate-950 p-5 rounded-xl border border-amber-500/40 text-center flex flex-col items-center justify-center gap-2">
          <span className="text-4xl">👑</span>
          <span className="text-2xl font-black text-amber-400 font-mono">{trophies.championships}</span>
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Anillos de Campeón</span>
        </div>

        {/* TROFEO 2: CONFERENCIA */}
        <div className="bg-gradient-to-b from-purple-950/40 to-slate-950 p-5 rounded-xl border border-purple-500/40 text-center flex flex-col items-center justify-center gap-2">
          <span className="text-4xl">🏆</span>
          <span className="text-2xl font-black text-purple-400 font-mono">{trophies.conferenceTitles}</span>
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Títulos de Conferencia</span>
        </div>

        {/* TROFEO 3: MEJOR RÉCORD */}
        <div className="bg-gradient-to-b from-emerald-950/40 to-slate-950 p-5 rounded-xl border border-emerald-500/40 text-center flex flex-col items-center justify-center gap-2">
          <span className="text-4xl">🛡️</span>
          <span className="text-2xl font-black text-emerald-400 font-mono">{trophies.regularSeasonTop}</span>
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Líder Temporada Regular</span>
        </div>

      </div>

      {/* PREMIOS INDIVIDUALES ACUMULADOS POR TEMPORADA */}
      <div className="flex flex-col gap-3 mt-2">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
          📜 Galardones de Temporada
        </h3>

        {awardsHistory.length > 0 ? (
          <div className="flex flex-col gap-3 max-h-[340px] overflow-y-auto pr-1">
            {awardsHistory.map((item, idx) => (
              <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest border-b border-slate-800 pb-1 flex justify-between items-center">
                  <span>📅 Temporada #{item.seasonNumber}</span>
                </span>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mt-1">
                  <div>
                    <span className="text-slate-500 block">👑 MVP:</span>
                    <strong className="text-white block">{item.awards.mvp.name}</strong>
                    <span className="text-[10px] text-slate-400 font-mono">{item.awards.mvp.stats}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">🛡️ DPOY:</span>
                    <strong className="text-white block">{item.awards.dpoy.name}</strong>
                    <span className="text-[10px] text-slate-400 font-mono">{item.awards.dpoy.stats}</span>
                  </div>

                  {item.awards.sixthMan ? (
                    <div>
                      <span className="text-slate-500 block">⚡ 6º Hombre:</span>
                      <strong className="text-white block">{item.awards.sixthMan.name}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">{item.awards.sixthMan.stats}</span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-slate-500 block">⚡ 6º Hombre:</span>
                      <span className="text-slate-600 italic">Ninguno</span>
                    </div>
                  )}

                  {item.awards.coy ? (
                    <div>
                      <span className="text-slate-500 block">👔 Coach of the Year:</span>
                      <strong className="text-emerald-400 block">{item.awards.coy.name}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">{item.awards.coy.stats}</span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-slate-500 block">👔 Coach of the Year:</span>
                      <span className="text-slate-600 italic">No adjudicado</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-950 p-8 rounded-xl border border-slate-800 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
            <span>🏆</span>
            <p>Aún no completaste ninguna temporada para registrar galardones en el historial.</p>
          </div>
        )}
      </div>
    </div>
  );
}