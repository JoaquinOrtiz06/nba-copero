import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, addDoc } from 'firebase/firestore';

export default function LeaderboardView() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Cargando ranking...");

  const fetchLeaders = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "leaderboard"));
      const querySnapshot = await getDocs(q);
      
      let list = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Si la base de datos está totalmente vacía, creamos un puntaje de prueba automáticamente
      if (list.length === 0) {
        setStatus("Creando puntaje de prueba en Firebase...");
        const testData = {
          managerName: "Mánager de Prueba 🏀",
          score: 1500,
          title: "Entrenador Novato",
          championships: 1,
          seasonsPlayed: 3
        };
        await addDoc(collection(db, "leaderboard"), testData);
        
        // Volvemos a consultar para mostrarlo
        const newSnap = await getDocs(q);
        list = newSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      }

      list.sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0));
      setLeaders(list);
      setStatus(`Se muestran ${list.length} mánagers.`);
    } catch (error) {
      console.error("Error:", error);
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaders();
  }, []);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-6 max-w-4xl mx-auto text-white">
      
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-wider">
            🌍 RANKING GLOBAL DE MÁNAGERS
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{status}</p>
        </div>
        <button 
          onClick={fetchLeaders}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
        >
          🔄 Actualizar
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 text-xs animate-pulse">
          Sincronizando...
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {leaders.map((item, idx) => {
            const isFirst = idx === 0;
            const isSecond = idx === 1;
            const isThird = idx === 2;

            return (
              <div 
                key={item.id || idx} 
                className={`flex justify-between items-center p-4 rounded-xl border transition-all ${
                  isFirst 
                    ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/60' 
                    : isSecond 
                    ? 'bg-gradient-to-r from-slate-800/40 via-slate-900 to-slate-900 border-slate-400/50' 
                    : isThird 
                    ? 'bg-gradient-to-r from-amber-900/20 via-slate-900 to-slate-900 border-amber-700/40' 
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 flex justify-center items-center font-mono font-black text-sm">
                    {isFirst ? '🥇' : isSecond ? '🥈' : isThird ? '🥉' : `#${idx + 1}`}
                  </div>
                  <div className="flex flex-col">
                    <strong className="text-base tracking-tight">{item.managerName || "Anónimo"}</strong>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      <span className="text-amber-400 font-semibold">{item.title || "DT"}</span> • 👑 {item.championships || 0} Anillos • 📅 {item.seasonsPlayed || 0} Temp.
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-lg font-black text-amber-400 tracking-tight">
                    {Number(item.score || 0).toLocaleString()}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-widest">
                    Pts Legado
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}