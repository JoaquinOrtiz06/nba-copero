// src/components/legacyEngine.js

export function calculateLegacyScore(trophies, awardsHistory, seasonNumber) {
  let score = 0;

  // 1. Puntos por Trofeos Colectivos
  score += trophies.championships * 1500;       // Cada Anillo NBA vale mucho
  score += trophies.conferenceTitles * 600;     // Título de conferencia
  score += trophies.regularSeasonTop * 300;     // Líder de conferencia

  // 2. Puntos por Premios Individuales de tus jugadores
  awardsHistory.forEach(season => {
    if (season.awards.mvp) score += 400;
    if (season.awards.dpoy) score += 250;
    if (season.awards.sixthMan) score += 150;
    if (season.awards.coy) score += 300; // Coach of the Year
  });

  // 3. Experiencia acumulada (Temporadas dirigidas)
  score += (seasonNumber - 1) * 100;

  // Determinar Rango o Título de Legado
  let title = "Entrenador Novato";
  if (score >= 5000) title = "Leyenda Histórica de la NBA (GOAT Coach)";
  else if (score >= 3000) title = "Mánager Salón de la Fama (Hall of Famer)";
  else if (score >= 1500) title = "Entrenador Élite Consolidado";
  else if (score >= 500) title = "Técnico Respetado en la Liga";

  return { score, title };
}