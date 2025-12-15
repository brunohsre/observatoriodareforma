/**
 * Observatório de Riscos Fiscais da Reforma Tributária
 * Dataset completo baseado em dados reais da reforma
 */

// ===========================================
// DADOS POR UF - Efeito Redistributivo 2022
// ===========================================
const DADOS_UF = [
    { uf: 'AC', regiao: 'norte', ganhos: 212, perdas: 0, ganhadores: 22, perdedores: 0, totalMun: 22, percentGanhadores: 100 },
    { uf: 'AL', regiao: 'nordeste', ganhos: 1011, perdas: -81, ganhadores: 97, perdedores: 5, totalMun: 102, percentGanhadores: 95 },
    { uf: 'AM', regiao: 'norte', ganhos: 430, perdas: -1290, ganhadores: 47, perdedores: 15, totalMun: 62, percentGanhadores: 76 },
    { uf: 'AP', regiao: 'norte', ganhos: 301, perdas: -47, ganhadores: 13, perdedores: 3, totalMun: 16, percentGanhadores: 81 },
    { uf: 'BA', regiao: 'nordeste', ganhos: 3998, perdas: -1864, ganhadores: 383, perdedores: 34, totalMun: 417, percentGanhadores: 92 },
    { uf: 'CE', regiao: 'nordeste', ganhos: 2173, perdas: -479, ganhadores: 174, perdedores: 10, totalMun: 184, percentGanhadores: 95 },
    { uf: 'DF', regiao: 'centro-oeste', ganhos: 832, perdas: 0, ganhadores: 1, perdedores: 0, totalMun: 1, percentGanhadores: 100 },
    { uf: 'ES', regiao: 'sudeste', ganhos: 289, perdas: -1579, ganhadores: 31, perdedores: 47, totalMun: 78, percentGanhadores: 40 },
    { uf: 'GO', regiao: 'centro-oeste', ganhos: 1938, perdas: -633, ganhadores: 167, perdedores: 79, totalMun: 246, percentGanhadores: 68 },
    { uf: 'MA', regiao: 'nordeste', ganhos: 2094, perdas: -792, ganhadores: 204, perdedores: 13, totalMun: 217, percentGanhadores: 94 },
    { uf: 'MG', regiao: 'sudeste', ganhos: 6326, perdas: -3407, ganhadores: 744, perdedores: 109, totalMun: 853, percentGanhadores: 87 },
    { uf: 'MS', regiao: 'centro-oeste', ganhos: 431, perdas: -768, ganhadores: 32, perdedores: 47, totalMun: 79, percentGanhadores: 41 },
    { uf: 'MT', regiao: 'centro-oeste', ganhos: 468, perdas: -1009, ganhadores: 66, perdedores: 75, totalMun: 141, percentGanhadores: 47 },
    { uf: 'PA', regiao: 'norte', ganhos: 2892, perdas: -1218, ganhadores: 130, perdedores: 14, totalMun: 144, percentGanhadores: 90 },
    { uf: 'PB', regiao: 'nordeste', ganhos: 1115, perdas: -144, ganhadores: 215, perdedores: 8, totalMun: 223, percentGanhadores: 96 },
    { uf: 'PE', regiao: 'nordeste', ganhos: 2247, perdas: -1470, ganhadores: 172, perdedores: 12, totalMun: 184, percentGanhadores: 93 },
    { uf: 'PI', regiao: 'nordeste', ganhos: 1372, perdas: -102, ganhadores: 212, perdedores: 12, totalMun: 224, percentGanhadores: 95 },
    { uf: 'PR', regiao: 'sul', ganhos: 4233, perdas: -1152, ganhadores: 361, perdedores: 38, totalMun: 399, percentGanhadores: 90 },
    { uf: 'RJ', regiao: 'sudeste', ganhos: 4191, perdas: -3237, ganhadores: 57, perdedores: 35, totalMun: 92, percentGanhadores: 62 },
    { uf: 'RN', regiao: 'nordeste', ganhos: 1093, perdas: -211, ganhadores: 150, perdedores: 17, totalMun: 167, percentGanhadores: 90 },
    { uf: 'RO', regiao: 'norte', ganhos: 197, perdas: -83, ganhadores: 29, perdedores: 23, totalMun: 52, percentGanhadores: 56 },
    { uf: 'RR', regiao: 'norte', ganhos: 112, perdas: -9, ganhadores: 10, perdedores: 5, totalMun: 15, percentGanhadores: 67 },
    { uf: 'RS', regiao: 'sul', ganhos: 4103, perdas: -632, ganhadores: 386, perdedores: 111, totalMun: 497, percentGanhadores: 78 },
    { uf: 'SC', regiao: 'sul', ganhos: 1919, perdas: -940, ganhadores: 171, perdedores: 124, totalMun: 295, percentGanhadores: 58 },
    { uf: 'SE', regiao: 'nordeste', ganhos: 519, perdas: -119, ganhadores: 66, perdedores: 9, totalMun: 75, percentGanhadores: 88 },
    { uf: 'SP', regiao: 'sudeste', ganhos: 6941, perdas: -29257, ganhadores: 480, perdedores: 165, totalMun: 645, percentGanhadores: 74 },
    { uf: 'TO', regiao: 'norte', ganhos: 439, perdas: -64, ganhadores: 119, perdedores: 20, totalMun: 139, percentGanhadores: 86 }
];

// Totais consolidados
const TOTAIS_UF = {
    total: { ganhos: 51876, perdas: -50588, ganhadores: 4539, perdedores: 1030, totalMun: 5569, percentGanhadores: 82 },
    capitais: { ganhos: 2757, perdas: -21940, ganhadores: 16, perdedores: 11, totalMun: 27, percentGanhadores: 59 },
    g100: { ganhos: 9008, perdas: -47, ganhadores: 106, perdedores: 2, totalMun: 108, percentGanhadores: 98 },
    pibpc25k: { ganhos: 12305, perdas: -68, ganhadores: 1471, perdedores: 24, totalMun: 1495, percentGanhadores: 98 },
    pop80k: { ganhos: 22042, perdas: -40498, ganhadores: 290, perdedores: 115, totalMun: 405, percentGanhadores: 72 }
};

// ===========================================
// DADOS POR NÍVEL DE RENDA E UF
// ===========================================
const DADOS_RENDA_UF = [
    // BAIXA RENDA
    { renda: 'Baixa', uf: 'MA', pibpc: 15294, preReforma: 12848, posReforma: 15111, saldo: 2263 },
    { renda: 'Baixa', uf: 'PI', pibpc: 17185, preReforma: 6386, posReforma: 9408, saldo: 3022 },
    { renda: 'Baixa', uf: 'PB', pibpc: 17402, preReforma: 8361, posReforma: 10089, saldo: 1728 },
    { renda: 'Baixa', uf: 'CE', pibpc: 18168, preReforma: 19224, posReforma: 22533, saldo: 3309 },
    { renda: 'Baixa', uf: 'AC', pibpc: 18420, preReforma: 1948, posReforma: 2371, saldo: 423 },
    { renda: 'Baixa', uf: 'AL', pibpc: 18858, preReforma: 6946, posReforma: 8752, saldo: 1806 },
    { renda: 'Baixa', uf: 'SE', pibpc: 19583, preReforma: 5163, posReforma: 6134, saldo: 971 },
    { renda: 'Baixa', uf: 'PE', pibpc: 20094, preReforma: 23736, posReforma: 23837, saldo: 102 },
    { renda: 'Baixa', uf: 'RN', pibpc: 20253, preReforma: 8134, posReforma: 10360, saldo: 2226 },
    { renda: 'Baixa', uf: 'BA', pibpc: 20496, preReforma: 37426, posReforma: 40233, saldo: 2807 },
    { renda: 'Baixa', uf: 'AP', pibpc: 21432, preReforma: 1508, posReforma: 2251, saldo: 743 },
    { renda: 'Baixa', uf: 'PA', pibpc: 24868, preReforma: 22185, posReforma: 25375, saldo: 3190 },
    { renda: 'Baixa', uf: 'RR', pibpc: 25388, preReforma: 1745, posReforma: 1799, saldo: 54 },
    { renda: 'Baixa', uf: 'TO', pibpc: 27448, preReforma: 4964, posReforma: 5610, saldo: 647 },
    
    // MÉDIA RENDA
    { renda: 'Média', uf: 'RO', pibpc: 28722, preReforma: 6463, posReforma: 5918, saldo: -546 },
    { renda: 'Média', uf: 'AM', pibpc: 30225, preReforma: 15248, posReforma: 10136, saldo: -5112 },
    { renda: 'Média', uf: 'GO', pibpc: 31507, preReforma: 26451, posReforma: 27259, saldo: 808 },
    { renda: 'Média', uf: 'MG', pibpc: 32067, preReforma: 78182, posReforma: 78772, saldo: 590 },
    { renda: 'Média', uf: 'ES', pibpc: 34066, preReforma: 18612, posReforma: 13007, saldo: -5605 },
    { renda: 'Média', uf: 'RS', pibpc: 41228, preReforma: 47696, posReforma: 54395, saldo: 6699 },
    { renda: 'Média', uf: 'PR', pibpc: 42414, preReforma: 47372, posReforma: 54804, saldo: 7432 },
    { renda: 'Média', uf: 'RJ', pibpc: 43408, preReforma: 62145, posReforma: 71817, saldo: 9672 },
    
    // ALTA RENDA
    { renda: 'Alta', uf: 'MS', pibpc: 43649, preReforma: 15346, posReforma: 12120, saldo: -3226 },
    { renda: 'Alta', uf: 'SC', pibpc: 48159, preReforma: 38300, posReforma: 38358, saldo: 58 },
    { renda: 'Alta', uf: 'MT', pibpc: 50663, preReforma: 21423, posReforma: 16476, saldo: -4947 },
    { renda: 'Alta', uf: 'SP', pibpc: 51365, preReforma: 250756, posReforma: 215554, saldo: -35202 },
    { renda: 'Alta', uf: 'DF', pibpc: 87016, preReforma: 12751, posReforma: 18841, saldo: 6090 }
];

// Totais por nível de renda
const TOTAIS_RENDA = {
    baixa: { pibpcMedio: 18454, preReforma: 153865, posReforma: 176454, saldo: 22588 },
    media: { pibpcMedio: 29383, preReforma: 151665, posReforma: 142502, saldo: -9164 },
    alta: { pibpcMedio: 47330, preReforma: 495789, posReforma: 482364, saldo: -13425 },
    total: { pibpcMedio: 34639, preReforma: 801319, posReforma: 801319, saldo: 0 }
};

// ===========================================
// INFORMAÇÕES DAS UFs
// ===========================================
const UF_INFO = {
    'AC': { nome: 'Acre', regiao: 'Norte', capital: 'Rio Branco' },
    'AL': { nome: 'Alagoas', regiao: 'Nordeste', capital: 'Maceió' },
    'AM': { nome: 'Amazonas', regiao: 'Norte', capital: 'Manaus' },
    'AP': { nome: 'Amapá', regiao: 'Norte', capital: 'Macapá' },
    'BA': { nome: 'Bahia', regiao: 'Nordeste', capital: 'Salvador' },
    'CE': { nome: 'Ceará', regiao: 'Nordeste', capital: 'Fortaleza' },
    'DF': { nome: 'Distrito Federal', regiao: 'Centro-Oeste', capital: 'Brasília' },
    'ES': { nome: 'Espírito Santo', regiao: 'Sudeste', capital: 'Vitória' },
    'GO': { nome: 'Goiás', regiao: 'Centro-Oeste', capital: 'Goiânia' },
    'MA': { nome: 'Maranhão', regiao: 'Nordeste', capital: 'São Luís' },
    'MG': { nome: 'Minas Gerais', regiao: 'Sudeste', capital: 'Belo Horizonte' },
    'MS': { nome: 'Mato Grosso do Sul', regiao: 'Centro-Oeste', capital: 'Campo Grande' },
    'MT': { nome: 'Mato Grosso', regiao: 'Centro-Oeste', capital: 'Cuiabá' },
    'PA': { nome: 'Pará', regiao: 'Norte', capital: 'Belém' },
    'PB': { nome: 'Paraíba', regiao: 'Nordeste', capital: 'João Pessoa' },
    'PE': { nome: 'Pernambuco', regiao: 'Nordeste', capital: 'Recife' },
    'PI': { nome: 'Piauí', regiao: 'Nordeste', capital: 'Teresina' },
    'PR': { nome: 'Paraná', regiao: 'Sul', capital: 'Curitiba' },
    'RJ': { nome: 'Rio de Janeiro', regiao: 'Sudeste', capital: 'Rio de Janeiro' },
    'RN': { nome: 'Rio Grande do Norte', regiao: 'Nordeste', capital: 'Natal' },
    'RO': { nome: 'Rondônia', regiao: 'Norte', capital: 'Porto Velho' },
    'RR': { nome: 'Roraima', regiao: 'Norte', capital: 'Boa Vista' },
    'RS': { nome: 'Rio Grande do Sul', regiao: 'Sul', capital: 'Porto Alegre' },
    'SC': { nome: 'Santa Catarina', regiao: 'Sul', capital: 'Florianópolis' },
    'SE': { nome: 'Sergipe', regiao: 'Nordeste', capital: 'Aracaju' },
    'SP': { nome: 'São Paulo', regiao: 'Sudeste', capital: 'São Paulo' },
    'TO': { nome: 'Tocantins', regiao: 'Norte', capital: 'Palmas' }
};

// ===========================================
// SÉRIE HISTÓRICA (SIMULADA)
// ===========================================
const SERIE_HISTORICA = {
    anos: [2020, 2021, 2022, 2023, 2024],
    receitas: {
        baixa: [140000, 145000, 153865, 162000, 176454],
        media: [145000, 148000, 151665, 148000, 142502],
        alta: [480000, 488000, 495789, 490000, 482364]
    }
};

// ===========================================
// PROJEÇÕES 2025-2032
// ===========================================
const PROJECOES = {
    anos: [2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032],
    cenarios: {
        base: {
            baixa: [176454, 182000, 188000, 194000, 200000, 206000, 212000, 218000, 225000],
            media: [142502, 144000, 146000, 148000, 150000, 152000, 154000, 156000, 158000],
            alta: [482364, 478000, 474000, 470000, 466000, 462000, 458000, 454000, 450000]
        },
        otimista: {
            baixa: [176454, 185000, 195000, 205000, 216000, 227000, 239000, 251000, 264000],
            media: [142502, 148000, 154000, 160000, 167000, 174000, 181000, 188000, 196000],
            alta: [482364, 485000, 488000, 491000, 494000, 497000, 500000, 503000, 506000]
        },
        pessimista: {
            baixa: [176454, 178000, 180000, 182000, 184000, 186000, 188000, 190000, 192000],
            media: [142502, 140000, 138000, 136000, 134000, 132000, 130000, 128000, 126000],
            alta: [482364, 470000, 458000, 446000, 434000, 422000, 410000, 398000, 386000]
        }
    }
};

// ===========================================
// FUNÇÕES DE UTILIDADE
// ===========================================

function formatarMoeda(valor, prefixo = 'R$ ') {
    const abs = Math.abs(valor);
    const sinal = valor < 0 ? '-' : '';
    
    if (abs >= 1000000000) {
        return sinal + prefixo + (abs / 1000000000).toFixed(1) + ' tri';
    } else if (abs >= 1000000) {
        return sinal + prefixo + (abs / 1000000).toFixed(1) + ' bi';
    } else if (abs >= 1000) {
        return sinal + prefixo + (abs / 1000).toFixed(1) + ' mi';
    }
    return sinal + prefixo + abs.toFixed(0);
}

function formatarMoedaMi(valor) {
    return formatarMoeda(valor * 1000000);
}

function formatarNumero(valor) {
    return new Intl.NumberFormat('pt-BR').format(valor);
}

function calcularRisco(dados) {
    // Calcula nível de risco baseado em múltiplos fatores
    const percentPerdedores = 100 - dados.percentGanhadores;
    const ratioPerda = Math.abs(dados.perdas) / (dados.ganhos || 1);
    
    if (percentPerdedores > 50 || ratioPerda > 2) return 'critical';
    if (percentPerdedores > 30 || ratioPerda > 1) return 'high';
    if (percentPerdedores > 15 || ratioPerda > 0.5) return 'medium';
    return 'low';
}

function getRegiaoUFs(regiao) {
    return DADOS_UF.filter(d => d.regiao === regiao).map(d => d.uf);
}

function getNivelRendaUF(uf) {
    const dado = DADOS_RENDA_UF.find(d => d.uf === uf);
    return dado ? dado.renda.toLowerCase() : 'media';
}

// Estado global dos dados filtrados
let dadosFiltrados = {
    uf: [...DADOS_UF],
    renda: [...DADOS_RENDA_UF]
};

// Exportar para CSV
function gerarCSV(tipo) {
    let headers, rows;
    
    if (tipo === 'uf') {
        headers = ['UF', 'Região', 'Ganhos (R$ mi)', 'Perdas (R$ mi)', 'Ganhadores', 'Perdedores', 'Total Municípios', '% Ganhadores'];
        rows = DADOS_UF.map(d => [
            d.uf, d.regiao.toUpperCase(), d.ganhos, d.perdas, d.ganhadores, d.perdedores, d.totalMun, d.percentGanhadores
        ]);
    } else if (tipo === 'renda') {
        headers = ['Nível Renda', 'UF', 'PIBpc 2020', 'Pré-reforma (R$ mi)', 'Pós-reforma (R$ mi)', 'Saldo (R$ mi)'];
        rows = DADOS_RENDA_UF.map(d => [
            d.renda, d.uf, d.pibpc, d.preReforma, d.posReforma, d.saldo
        ]);
    }
    
    return [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
}

console.log('📊 Observatório de Riscos Fiscais - Dados carregados');
console.log(`   • ${DADOS_UF.length} UFs`);
console.log(`   • ${DADOS_RENDA_UF.length} registros por renda/UF`);
