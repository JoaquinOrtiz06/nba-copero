import React from 'react';

export default function TeamHeader({ team }) {
  const salaryPercent = Math.round((team.salaryUsed / team.salaryCap) * 100);
  const isOverTax = team.salaryUsed > team.salaryCap;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex justify-between items-center">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-black text-white tracking-wider uppercase">{team.name}</h1>
          <span className="text-xs font-mono font-bold bg-slate-800 text-slate-400 px-2.5 py-1 rounded-md border border-slate-700">
            #{team.conferenceRank} EN LA CONFERENCIA
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">{team.city} • Conferencia Oeste</p>
      </div>

      <div className="flex items-center gap-6">
        {/* RÉCORD */}
        <div className="text-right">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Récord</span>
          <span className="font-mono text-2xl font-black text-white">
            <span className="text-emerald-400">{team.record.wins}</span> - <span className="text-rose-400">{team.record.losses}</span>
          </span>
        </div>

        {/* TOPE SALARIAL CON INDICADOR DE IMPUESTO AL LUJO */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 w-52">
          <div className="flex justify-between items-center text-[10px] font-bold uppercase mb-1">
            <span className="text-slate-400">Masa Salarial</span>
            <span className={isOverTax ? "text-amber-400" : "text-emerald-400"}>
              {salaryPercent}% {isOverTax && "⚠️ TAX"}
            </span>
          </div>

          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all ${isOverTax ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(100, salaryPercent)}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
            <span>${team.salaryUsed}M</span>
            <span>Cap: ${team.salaryCap}M</span>
          </div>
        </div>
      </div>
    </div>
  );
}