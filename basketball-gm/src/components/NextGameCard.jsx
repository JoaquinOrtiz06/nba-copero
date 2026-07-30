export default function NextGameCard({ game }) {
  const date = new Date(game.date + "T00:00:00");
  const formatted = date.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="bg-court-900 border border-court-700 rounded-xl p-6 flex flex-col justify-between">
      <p className="font-mono text-xs tracking-[0.2em] text-court-400 uppercase mb-4">
        Próximo partido
      </p>
      <div className="mb-6">
        <p className="text-court-400 text-sm mb-1">
          {game.home ? "vs" : "@"}
        </p>
        <p className="font-display text-2xl uppercase text-court-200">
          {game.opponent}
        </p>
        <p className="text-court-400 text-sm mt-2 capitalize">{formatted}</p>
      </div>
      <button className="w-full bg-scoreboard hover:bg-scoreboard-dim transition-colors text-court-950 font-semibold rounded-lg py-2.5 text-sm">
        Preparar rotaciones
      </button>
    </div>
  );
}
