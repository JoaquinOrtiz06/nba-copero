import React, { useState } from 'react';
import { calculateLegacyScore } from './legacyEngine';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function HallOfFameModal({ trophies, awardsHistory, seasonNumber, onRestartCareer, onClose }) {
  const { score, title } = calculateLegacyScore(trophies, awardsHistory, seasonNumber);
  
  const [managerName, setManagerName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSaveScore = async (e) => {
    e.preventDefault();
    if (!managerName.trim() || submitted) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "leaderboard"), {
        managerName: managerName.trim(),
        score: score,
        title: title,
        championships: trophies.championships,
        conferenceTitles: trophies.conferenceTitles,
        seasonsPlayed: seasonNumber - 1,
        createdAt: new Date()
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Error al guardar en el ranking:", error);
      alert("Hubo un error al guardar tu puntaje. Verificá tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border-2 border-amber-500/80 rounded-2xl max-w-lg w-full p-8 shadow-2xl flex flex-col items-center text-center gap-5 relative overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* BOTÓN DE CIERRE "X" */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all cursor-pointer z-10"
            title="Cerrar sin guardar"
          >
            ✕
          </button>
        )}

        {/* DECORACIÓN DORADA */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600"></div>

        <span className="text-5xl animate-bounce mt-2">🏛️</span>

        <div>
          <span className="text-xs font-black text-amber-400 uppercase tracking-widest block mb-1">
            SALÓN DE LA FAMA — RETIRO DEL DT
          </span>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">
            Carrera Finalizada
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Has completado tu ciclo en los banquillos de la NBA.</p>
        </div>

        {/* TARJETA DE PUNTAJE GLOBAL */}
        <div className="w-full bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Puntaje Total de Legado</span>
          <span className="text-3xl font-black text-amber-400 font-mono">{score} <span className="text-sm font-normal text-slate-500">PTS</span></span>
          <div className="mt-1 bg-amber-500/10 border border-amber-500/30 py-1.5 px-3 rounded-lg text-amber-300 text-xs font-bold">
            🏅 {title}
          </div>
        </div>

        {/* RESUMEN DE PALMARÉS */}
        <div className="grid grid-cols-3 gap-3 w-full text-xs">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 block">👑 Anillos</span>
            <strong className="text-white text-base font-mono">{trophies.championships}</strong>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 block">🏆 Conferencias</span>
            <strong className="text-white text-base font-mono">{trophies.conferenceTitles}</strong>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 block">📅 Temporadas</span>
            <strong className="text-white text-base font-mono">{seasonNumber - 1}</strong>
          </div>
        </div>

        {/* SECCIÓN DE ENVÍO A LA LEADERBOARD ONLINE */}
        {!submitted ? (
          <form onSubmit={handleSaveScore} className="w-full bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider text-left">
              🌐 Registrarse en el Ranking Mundial
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Tu Nombre o Apodo de DT"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                maxLength={20}
                required
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-bold focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-lg text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Subir Puntaje'}
              </button>
            </div>
          </form>
        ) : (
          <div className="w-full bg-emerald-950/60 border border-emerald-500/50 p-3 rounded-xl text-emerald-300 text-xs font-bold text-center">
            ✅ ¡Puntaje subido con éxito al Salón de la Fama Mundial!
          </div>
        )}

        {/* BOTÓN PARA REINICIAR / NUEVA CARRERA */}
        <button
          onClick={onRestartCareer}
          className="w-full bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-xl transition-all hover:scale-[1.01]"
        >
          🔄 Iniciar Nueva Carrera (Reset Total)
        </button>

      </div>
    </div>
  );
}