export const stickerGroups = [
  { id: 'specials', name: 'Especiais (FIFA/Intro)', prefix: 'FWC', hasZero: true, count: 9 },
  // Grupo A
  { id: 'kor', name: 'Coréia do Sul', prefix: 'KOR', count: 20 },
  { id: 'mex', name: 'México', prefix: 'MEX', count: 20 },
  { id: 'cze', name: 'República Tcheca', prefix: 'CZE', count: 20 },
  { id: 'rsa', name: 'África do Sul', prefix: 'RSA', count: 20 },
  // Grupo B
  { id: 'bih', name: 'Bósnia', prefix: 'BIH', count: 20 },
  { id: 'can', name: 'Canadá', prefix: 'CAN', count: 20 },
  { id: 'qat', name: 'Catar', prefix: 'QAT', count: 20 },
  { id: 'sui', name: 'Suíça', prefix: 'SUI', count: 20 },
  // Grupo C
  { id: 'bra', name: 'Brasil', prefix: 'BRA', count: 20 },
  { id: 'sco', name: 'Escócia', prefix: 'SCO', count: 20 },
  { id: 'hai', name: 'Haiti', prefix: 'HAI', count: 20 },
  { id: 'mar', name: 'Marrocos', prefix: 'MAR', count: 20 },
  // Grupo D
  { id: 'usa', name: 'Estados Unidos', prefix: 'USA', count: 20 },
  { id: 'par', name: 'Paraguai', prefix: 'PAR', count: 20 },
  { id: 'aus', name: 'Austrália', prefix: 'AUS', count: 20 },
  { id: 'tur', name: 'Turquia', prefix: 'TUR', count: 20 },
  // Grupo E
  { id: 'ger', name: 'Alemanha', prefix: 'GER', count: 20 },
  { id: 'cuw', name: 'Curaçao', prefix: 'CUW', count: 20 },
  { id: 'civ', name: 'Costa do Marfim', prefix: 'CIV', count: 20 },
  { id: 'ecu', name: 'Equador', prefix: 'ECU', count: 20 },
  // Grupo F
  { id: 'ned', name: 'Holanda', prefix: 'NED', count: 20 },
  { id: 'jpn', name: 'Japão', prefix: 'JPN', count: 20 },
  { id: 'swe', name: 'Suécia', prefix: 'SWE', count: 20 },
  { id: 'tun', name: 'Tunísia', prefix: 'TUN', count: 20 },
  // Grupo G
  { id: 'bel', name: 'Bélgica', prefix: 'BEL', count: 20 },
  { id: 'egy', name: 'Egito', prefix: 'EGY', count: 20 },
  { id: 'irn', name: 'Irã', prefix: 'IRN', count: 20 },
  { id: 'nzl', name: 'Nova Zelândia', prefix: 'NZL', count: 20 },
  // Grupo H
  { id: 'esp', name: 'Espanha', prefix: 'ESP', count: 20 },
  { id: 'cpv', name: 'Cabo Verde', prefix: 'CPV', count: 20 },
  { id: 'ksa', name: 'Arábia Saudita', prefix: 'KSA', count: 20 },
  { id: 'uru', name: 'Uruguai', prefix: 'URU', count: 20 },
  // Grupo I
  { id: 'fra', name: 'França', prefix: 'FRA', count: 20 },
  { id: 'sen', name: 'Senegal', prefix: 'SEN', count: 20 },
  { id: 'irq', name: 'Iraque', prefix: 'IRQ', count: 20 },
  { id: 'nor', name: 'Noruega', prefix: 'NOR', count: 20 },
  // Grupo J
  { id: 'arg', name: 'Argentina', prefix: 'ARG', count: 20 },
  { id: 'alg', name: 'Argélia', prefix: 'ALG', count: 20 },
  { id: 'aut', name: 'Áustria', prefix: 'AUT', count: 20 },
  { id: 'jor', name: 'Jordânia', prefix: 'JOR', count: 20 },
  // Grupo K
  { id: 'por', name: 'Portugal', prefix: 'POR', count: 20 },
  { id: 'cod', name: 'Congo DR', prefix: 'COD', count: 20 },
  { id: 'uzb', name: 'Uzbequistão', prefix: 'UZB', count: 20 },
  { id: 'col', name: 'Colômbia', prefix: 'COL', count: 20 },
  // Grupo L
  { id: 'eng', name: 'Inglaterra', prefix: 'ENG', count: 20 },
  { id: 'cro', name: 'Croácia', prefix: 'CRO', count: 20 },
  { id: 'gha', name: 'Gana', prefix: 'GHA', count: 20 },
  { id: 'pan', name: 'Panamá', prefix: 'PAN', count: 20 },
  { id: 'cc', name: 'Coca-Cola', prefix: 'CC', count: 12 }
];

// Helper para gerar todas as figurinhas vazias para contagem e inicialização
export const generateEmptyStickersMap = () => {
  const map = {};
  
  stickerGroups.forEach(group => {
    // Caso tenha figurinha 00
    if (group.hasZero) {
      map[`00`] = { count: 0, note: '' };
    }
    
    // Gerar as figurinhas numéricas do grupo
    for (let i = 1; i <= group.count; i++) {
      const code = `${group.prefix} ${i}`;
      map[code] = { count: 0, note: '' };
    }
  });

  return map;
};

// Obter total real de figurinhas baseadas no config
export const getTotalStickersCount = () => {
  let total = 0;
  stickerGroups.forEach(group => {
    if (group.hasZero) total += 1;
    total += group.count;
  });
  return total;
};
