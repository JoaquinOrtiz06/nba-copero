// src/data/teamsPlayersData.js

export const teamsDatabase = {
  dal: [
    { id: 1, name: "L. Dončić", pos: "PG", age: 27, ovr: 96, salary: 43.0, minutes: 36, stats: { pts: 33.9, reb: 9.2, ast: 9.8 }, status: "healthy" },
    { id: 2, name: "K. Irving", pos: "SG", age: 34, ovr: 90, salary: 41.0, minutes: 34, stats: { pts: 25.6, reb: 5.0, ast: 5.2 }, status: "healthy" },
    { id: 3, name: "P. Washington", pos: "SF", age: 27, ovr: 80, salary: 15.5, minutes: 30, stats: { pts: 11.7, reb: 6.2, ast: 1.5 }, status: "healthy" },
    { id: 4, name: "A. Davis", pos: "PF", age: 33, ovr: 93, salary: 43.2, minutes: 34, stats: { pts: 24.7, reb: 12.6, ast: 3.5 }, status: "healthy" },
    { id: 5, name: "D. Lively II", pos: "C", age: 22, ovr: 81, salary: 5.0, minutes: 28, stats: { pts: 8.8, reb: 6.9, ast: 1.1 }, status: "healthy" },
    { id: 6, name: "K. Thompson", pos: "SG", age: 36, ovr: 81, salary: 15.8, minutes: 22, stats: { pts: 14.2, reb: 3.1, ast: 2.1 }, status: "healthy" },
    { id: 7, name: "D. Gafford", pos: "C", age: 27, ovr: 79, salary: 12.4, minutes: 20, stats: { pts: 11.0, reb: 7.6, ast: 1.0 }, status: "healthy" },
    { id: 8, name: "M. Kleber", pos: "PF", age: 34, ovr: 75, salary: 11.0, minutes: 14, stats: { pts: 4.4, reb: 3.3, ast: 1.6 }, status: "healthy" },
    { id: 9, name: "D. Exum", pos: "SG", age: 31, ovr: 76, salary: 3.1, minutes: 12, stats: { pts: 7.8, reb: 2.7, ast: 2.9 }, status: "healthy" },
    { id: 10, name: "J. Hardy", pos: "PG", age: 24, ovr: 74, salary: 2.1, minutes: 10, stats: { pts: 7.3, reb: 1.8, ast: 1.5 }, status: "healthy" }
  ],
  okc: [
    { id: 201, name: "S. Gilgeous-Alexander", pos: "PG", age: 28, ovr: 96, salary: 35.8 },
    { id: 202, name: "C. Holmgren", pos: "C", age: 24, ovr: 88, salary: 10.8 },
    { id: 203, name: "J. Williams", pos: "SF", age: 25, ovr: 86, salary: 4.7 },
    { id: 204, name: "A. Caruso", pos: "SG", age: 32, ovr: 80, salary: 9.8 },
    { id: 205, name: "I. Hartenstein", pos: "C", age: 28, ovr: 81, salary: 29.0 }
  ],
  min: [
    { id: 301, name: "A. Edwards", pos: "SG", age: 25, ovr: 93, salary: 42.1 },
    { id: 302, name: "J. Randle", pos: "PF", age: 31, ovr: 85, salary: 28.9 },
    { id: 303, name: "R. Gobert", pos: "C", age: 34, ovr: 85, salary: 43.8 },
    { id: 304, name: "N. Reid", pos: "C", age: 26, ovr: 81, salary: 14.0 }
  ],
  den: [
    { id: 401, name: "N. Jokić", pos: "C", age: 31, ovr: 97, salary: 51.4 },
    { id: 402, name: "J. Murray", pos: "PG", age: 29, ovr: 87, salary: 36.0 },
    { id: 403, name: "A. Gordon", pos: "PF", age: 30, ovr: 83, salary: 22.8 },
    { id: 404, name: "M. Porter Jr.", pos: "SF", age: 28, ovr: 82, salary: 35.8 }
  ],
  lal: [
    { id: 501, name: "L. James", pos: "SF", age: 41, ovr: 94, salary: 48.7 },
    { id: 502, name: "D. Russell", pos: "PG", age: 30, ovr: 81, salary: 18.6 },
    { id: 503, name: "A. Reaves", pos: "SG", age: 28, ovr: 82, salary: 13.0 },
    { id: 504, name: "R. Hachimura", pos: "PF", age: 28, ovr: 78, salary: 17.0 }
  ],
  phx: [
    { id: 601, name: "K. Durant", pos: "PF", age: 37, ovr: 94, salary: 51.1 },
    { id: 602, name: "D. Booker", pos: "SG", age: 29, ovr: 92, salary: 49.3 },
    { id: 603, name: "B. Beal", pos: "PG", age: 33, ovr: 84, salary: 50.2 },
    { id: 604, name: "J. Nurkić", pos: "C", age: 31, ovr: 79, salary: 18.1 }
  ],
  gsw: [
    { id: 701, name: "S. Curry", pos: "PG", age: 38, ovr: 95, salary: 55.7 },
    { id: 702, name: "D. Green", pos: "PF", age: 36, ovr: 83, salary: 24.1 },
    { id: 703, name: "A. Wiggins", pos: "SF", age: 31, ovr: 81, salary: 26.2 },
    { id: 704, name: "J. Kuminga", pos: "PF", age: 23, ovr: 82, salary: 7.6 }
  ],
  sac: [
    { id: 801, name: "D. Sabonis", pos: "C", age: 30, ovr: 89, salary: 40.5 },
    { id: 802, name: "D. Fox", pos: "PG", age: 28, ovr: 88, salary: 34.8 },
    { id: 803, name: "D. DeRozan", pos: "SF", age: 36, ovr: 86, salary: 23.4 },
    { id: 804, name: "M. Monk", pos: "SG", age: 28, ovr: 81, salary: 17.4 }
  ],
  nop: [
    { id: 901, name: "Z. Williamson", pos: "PF", age: 26, ovr: 88, salary: 36.7 },
    { id: 902, name: "B. Ingram", pos: "SF", age: 28, ovr: 85, salary: 36.0 },
    { id: 903, name: "D. Murray", pos: "PG", age: 29, ovr: 86, salary: 25.5 },
    { id: 904, name: "C. McCollum", pos: "SG", age: 34, ovr: 82, salary: 33.3 }
  ],
  lac: [
    { id: 1001, name: "K. Leonard", pos: "SF", age: 35, ovr: 91, salary: 49.3 },
    { id: 1002, name: "J. Harden", pos: "PG", age: 36, ovr: 86, salary: 33.6 },
    { id: 1003, name: "I. Zubac", pos: "C", age: 29, ovr: 82, salary: 11.7 },
    { id: 1004, name: "N. Powell", pos: "SG", age: 33, ovr: 80, salary: 19.2 }
  ],
  // 🌟 SAN ANTONIO SPURS (Con Wembanyama)
  sas: [
    { id: 1101, name: "V. Wembanyama", pos: "C", age: 22, ovr: 92, salary: 12.7 },
    { id: 1102, name: "C. Paul", pos: "PG", age: 41, ovr: 81, salary: 11.0 },
    { id: 1103, name: "D. Vassell", pos: "SG", age: 25, ovr: 82, salary: 29.3 },
    { id: 1104, name: "H. Barnes", pos: "PF", age: 34, ovr: 78, salary: 18.0 },
    { id: 1105, name: "S. Castle", pos: "PG", age: 21, ovr: 77, salary: 9.1 }
  ],
  // MEMPHIS GRIZZLIES
  mem: [
    { id: 1201, name: "J. Morant", pos: "PG", age: 26, ovr: 90, salary: 36.7 },
    { id: 1202, name: "J. Jackson Jr.", pos: "PF", age: 26, ovr: 86, salary: 25.2 },
    { id: 1203, name: "D. Bane", pos: "SG", age: 28, ovr: 84, salary: 34.0 },
    { id: 1204, name: "M. Smart", pos: "PG", age: 32, ovr: 79, salary: 20.2 }
  ],
  // HOUSTON ROCKETS
  hou: [
    { id: 1301, name: "A. Sengün", pos: "C", age: 24, ovr: 86, salary: 5.4 },
    { id: 1302, name: "J. Green", pos: "SG", age: 24, ovr: 83, salary: 9.8 },
    { id: 1303, name: "F. VanVleet", pos: "PG", age: 32, ovr: 82, salary: 42.8 },
    { id: 1304, name: "J. Smith Jr.", pos: "PF", age: 23, ovr: 80, salary: 9.7 }
  ],
  // UTAH JAZZ
  uta: [
    { id: 1401, name: "L. Markkanen", pos: "PF", age: 29, ovr: 86, salary: 18.0 },
    { id: 1402, name: "C. Sexton", pos: "SG", age: 27, ovr: 81, salary: 18.1 },
    { id: 1403, name: "J. Clarkson", pos: "PG", age: 34, ovr: 78, salary: 14.0 },
    { id: 1404, name: "J. Collins", pos: "PF", age: 28, ovr: 79, salary: 26.5 }
  ],
  // PORTLAND TRAIL BLAZERS
  por: [
    { id: 1501, name: "J. Grant", pos: "PF", age: 32, ovr: 81, salary: 29.7 },
    { id: 1502, name: "A. Simons", pos: "SG", age: 27, ovr: 81, salary: 25.8 },
    { id: 1503, name: "D. Ayton", pos: "C", age: 28, ovr: 80, salary: 34.0 },
    { id: 1504, name: "S. Henderson", pos: "PG", age: 22, ovr: 77, salary: 10.2 }
  ]
};