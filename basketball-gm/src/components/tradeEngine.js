// src/components/tradeEngine.js

// Evalúa si un equipo de la IA aceptaría el intercambio
export function evaluateTrade(userPlayer, targetPlayer) {
  // 1. Diferencia de valor por OVR
  const ovrDiff = targetPlayer.ovr - userPlayer.ovr;

  // 2. Si el jugador objetivo es significativamente mejor (>3 OVR), lo rechazan
  if (ovrDiff > 3) {
    return {
      accepted: false,
      reason: `Rechazado: ${targetPlayer.name} (OVR ${targetPlayer.ovr}) es una pieza clave y no lo cambian por ${userPlayer.name} (OVR ${userPlayer.ovr}).`
    };
  }

  // 3. Control Salarial (Margen del 20%)
  const salaryRatio = userPlayer.salary / (targetPlayer.salary || 1);
  if (salaryRatio < 0.75 || salaryRatio > 1.35) {
    return {
      accepted: false,
      reason: `Rechazado por tope salarial: Los sueldos de $${userPlayer.salary}M y $${targetPlayer.salary}M no encajan en la masa salarial.`
    };
  }

  return {
    accepted: true,
    reason: `¡Traspaso Aceptado! Ambas franquicias llegaron a un acuerdo por el intercambio.`
  };
}