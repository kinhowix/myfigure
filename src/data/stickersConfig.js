export const stickerGroups = [
  { id: 'specials', name: 'Especiais (FIFA/Intro)', prefix: 'FWC', hasZero: true, count: 9 },
  { id: 'arg', name: 'Argentina', prefix: 'ARG', count: 20 },
  { id: 'aus', name: 'Austrália', prefix: 'AUS', count: 20 },
  { id: 'aut', name: 'Áustria', prefix: 'AUT', count: 20 },
  { id: 'bel', name: 'Bélgica', prefix: 'BEL', count: 20 },
  { id: 'bra', name: 'Brasil', prefix: 'BRA', count: 20 },
  { id: 'cam', name: 'Camarões', prefix: 'CAM', count: 20 },
  { id: 'can', name: 'Canadá', prefix: 'CAN', count: 20 },
  { id: 'chi', name: 'Chile', prefix: 'CHI', count: 20 },
  { id: 'col', name: 'Colômbia', prefix: 'COL', count: 20 },
  { id: 'crc', name: 'Costa Rica', prefix: 'CRC', count: 20 },
  { id: 'cro', name: 'Croácia', prefix: 'CRO', count: 20 },
  { id: 'den', name: 'Dinamarca', prefix: 'DEN', count: 20 },
  { id: 'ecu', name: 'Equador', prefix: 'ECU', count: 20 },
  { id: 'egy', name: 'Egito', prefix: 'EGY', count: 20 },
  { id: 'eng', name: 'Inglaterra', prefix: 'ENG', count: 20 },
  { id: 'esp', name: 'Espanha', prefix: 'ESP', count: 20 },
  { id: 'fra', name: 'França', prefix: 'FRA', count: 20 },
  { id: 'ger', name: 'Alemanha', prefix: 'GER', count: 20 },
  { id: 'gha', name: 'Gana', prefix: 'GHA', count: 20 },
  { id: 'ita', name: 'Itália', prefix: 'ITA', count: 20 },
  { id: 'jpn', name: 'Japão', prefix: 'JPN', count: 20 },
  { id: 'kor', name: 'Coreia do Sul', prefix: 'KOR', count: 20 },
  { id: 'ksa', name: 'Arábia Saudita', prefix: 'KSA', count: 20 },
  { id: 'mar', name: 'Marrocos', prefix: 'MAR', count: 20 },
  { id: 'mex', name: 'México', prefix: 'MEX', count: 20 },
  { id: 'ned', name: 'Holanda', prefix: 'NED', count: 20 },
  { id: 'nga', name: 'Nigéria', prefix: 'NGA', count: 20 },
  { id: 'per', name: 'Peru', prefix: 'PER', count: 20 },
  { id: 'pol', name: 'Polônia', prefix: 'POL', count: 20 },
  { id: 'por', name: 'Portugal', prefix: 'POR', count: 20 },
  { id: 'qat', name: 'Catar', prefix: 'QAT', count: 20 },
  { id: 'sen', name: 'Senegal', prefix: 'SEN', count: 20 },
  { id: 'srb', name: 'Sérvia', prefix: 'SRB', count: 20 },
  { id: 'sui', name: 'Suíça', prefix: 'SUI', count: 20 },
  { id: 'swe', name: 'Suécia', prefix: 'SWE', count: 20 },
  { id: 'tun', name: 'Tunísia', prefix: 'TUN', count: 20 },
  { id: 'uru', name: 'Uruguai', prefix: 'URU', count: 20 },
  { id: 'usa', name: 'Estados Unidos', prefix: 'USA', count: 20 },
  { id: 'wal', name: 'País de Gales', prefix: 'WAL', count: 20 },
  // Para completar as 48 seleções, adicionei placeholders genéricos que você pode editar depois
  { id: 't41', name: 'Time 41', prefix: 'T41', count: 20 },
  { id: 't42', name: 'Time 42', prefix: 'T42', count: 20 },
  { id: 't43', name: 'Time 43', prefix: 'T43', count: 20 },
  { id: 't44', name: 'Time 44', prefix: 'T44', count: 20 },
  { id: 't45', name: 'Time 45', prefix: 'T45', count: 20 },
  { id: 't46', name: 'Time 46', prefix: 'T46', count: 20 },
  { id: 't47', name: 'Time 47', prefix: 'T47', count: 20 },
  { id: 't48', name: 'Time 48', prefix: 'T48', count: 20 },
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
