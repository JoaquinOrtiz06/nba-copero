export default function PlayerDetailPanel({ player, onClose }) {
  if (!player) return null;

  return (
    <div className="bg-court-900 border border-court-700 rounded-xl p-6 relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-court-400 hover:text-court-200 transition-colors text-sm font-mono"
      >
        cerrar ✕
      </button>

      <p className="font-mono text-xs tracking-[0.2em] text-court-400 uppercase mb-1">
        Ficha del jugador
      </p>
      <h2 className="font-display text-3xl uppercase text-court-200 mb-1">
        {player.name}
      </h2>
      <p className="text-court-400 text-sm mb-6">
        {player.pos} · {player.age} años ·{" "}
        {player.status === "injured" ? (
          <span className="text-loss">Lesionado</span>
        ) : (
          <span className="text-win">Apto</span>
        )}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Stat label="Overall" value={player.ovr} highlight />
        <Stat label="Salario" value={`$${player.salary}M`} />
        <Stat label="Minutos" value={player.minutes} />
        <Stat label="Puntos" value={player.stats.pts} />
        <Stat label="Rebotes" value={player.stats.reb} />
        <Stat label="Asistencias" value={player.stats.ast} />
      </div>

      <div>
        <p className="font-mono text-xs text-court-400 uppercase mb-1">% de tiro de campo</p>
        <div className="h-2 rounded-full bg-court-800 overflow-hidden">
          <div
            className="h-full bg-hardwood rounded-full"
            style={{ width: `${player.stats.fg}%` }}
          />
        </div>
        <p className="font-mono text-xs text-court-400 mt-1">{player.stats.fg}%</p>
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }) {
  return (
    <div>
      <p className="font-mono text-xs text-court-400 uppercase mb-0.5">{label}</p>
      <p
        className={
          "font-display text-2xl " + (highlight ? "text-scoreboard" : "text-court-200")
        }
      >
        {value}
      </p>
    </div>
  );
}
