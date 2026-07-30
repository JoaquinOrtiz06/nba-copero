export default function PlayerDetail({ player, onClose }) {
  if (!player) {
    return (
      <div className="bg-court-900 border border-court-700 rounded-xl p-6 h-full flex items-center justify-center text-center">
        <p className="text-court-400 text-sm">
          Hacé click en un jugador de la plantilla para ver su ficha.
        </p>
      </div>
    );
  }

  const { name, pos, age, ovr, salary, minutes, stats, status } = player;

  return (
    <div className="bg-court-900 border border-court-700 rounded-xl p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-court-400 uppercase mb-1">
            {pos} · {age} años
          </p>
          <h2 className="font-display text-2xl uppercase text-court-200">{name}</h2>
        </div>
        <button
          onClick={onClose}
          className="text-court-400 hover:text-court-200 transition-colors text-sm"
        >
          ✕
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-lg bg-court-800 border border-court-700 flex items-center justify-center">
          <span className="font-display text-2xl text-scoreboard">{ovr}</span>
        </div>
        <div>
          <p className="text-court-400 text-xs uppercase font-mono mb-1">Overall</p>
          {status === "injured" ? (
            <span className="inline-flex items-center gap-1.5 text-loss text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-loss" />
              Lesionado
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-win text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-win" />
              Disponible
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <Stat label="Puntos" value={stats.pts} />
        <Stat label="Rebotes" value={stats.reb} />
        <Stat label="Asistencias" value={stats.ast} />
        <Stat label="% Tiro" value={`${stats.fg}%`} />
      </div>

      <div className="border-t border-court-700 pt-4 flex justify-between text-sm">
        <div>
          <p className="text-court-400 text-xs uppercase font-mono mb-1">Minutos</p>
          <p className="font-mono text-court-200">{minutes} min</p>
        </div>
        <div className="text-right">
          <p className="text-court-400 text-xs uppercase font-mono mb-1">Salario</p>
          <p className="font-mono text-court-200">${salary}M</p>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-court-800 rounded-lg px-3 py-2">
      <p className="text-court-400 text-xs uppercase font-mono mb-0.5">{label}</p>
      <p className="font-mono text-court-200 text-lg">{value}</p>
    </div>
  );
}
