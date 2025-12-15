/**
 * Observatório de Riscos Fiscais - Módulo de Gráficos
 * Visualizações interativas com ECharts
 */

// Instâncias dos gráficos
let charts = {};

// Paleta de cores institucional
const CORES = {
    primaria: '#1a365d',
    secundaria: '#2c5282',
    sucesso: '#276749',
    perigo: '#c53030',
    alerta: '#c05621',
    info: '#2b6cb0',
    neutro: '#4a5568',
    
    // Gradientes para mapas
    ganhos: ['#f0fff4', '#c6f6d5', '#68d391', '#38a169', '#276749'],
    perdas: ['#fff5f5', '#fed7d7', '#fc8181', '#e53e3e', '#c53030'],
    
    // Níveis de risco
    risco: {
        critical: '#c53030',
        high: '#dd6b20',
        medium: '#d69e2e',
        low: '#38a169'
    },
    
    // Níveis de renda
    renda: {
        baixa: '#48bb78',
        media: '#4299e1',
        alta: '#9f7aea'
    }
};

/**
 * Inicializar todos os gráficos
 */
function inicializarGraficos() {
    console.log('📈 Inicializando gráficos...');
    
    setTimeout(() => {
        criarGraficoMapaBrasil();
        criarGraficoProporcao();
        criarGraficoRendaSaldo();
        criarGraficoReceitaComparativo();
        criarGraficoMatrizRisco();
        criarGraficoRanking();
        criarGraficoProjecao();
        criarGraficoImpactoRegiao();
        preencherTabelaImpactoUF();
    }, 100);
}

/**
 * Gráfico de Impacto Redistributivo por Região
 */
function criarGraficoImpactoRegiao() {
    const container = document.getElementById('chartImpactoRegiao');
    if (!container) return;
    
    charts.impactoRegiao = echarts.init(container);
    
    // Calcular totais por região
    const regioes = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'];
    const dadosPorRegiao = regioes.map(regiao => {
        const ufsDaRegiao = DADOS_UF.filter(d => {
            const info = UF_INFO[d.uf];
            return info && info.regiao === regiao;
        });
        const ganhos = ufsDaRegiao.reduce((acc, d) => acc + d.ganhos, 0);
        const perdas = ufsDaRegiao.reduce((acc, d) => acc + Math.abs(d.perdas), 0);
        const ganhadores = ufsDaRegiao.reduce((acc, d) => acc + d.ganhadores, 0);
        const totalMun = ufsDaRegiao.reduce((acc, d) => acc + d.totalMun, 0);
        return { regiao, ganhos, perdas, ganhadores, totalMun, saldo: ganhos - perdas };
    });
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: function(params) {
                const regiao = params[0].axisValue;
                const dados = dadosPorRegiao.find(d => d.regiao === regiao);
                if (!dados) return '';
                const saldo = dados.ganhos - dados.perdas;
                return `<strong>${regiao}</strong><br/>
                        Ganhos: R$ ${(dados.ganhos / 1000).toFixed(1)} bi<br/>
                        Perdas: R$ ${(dados.perdas / 1000).toFixed(1)} bi<br/>
                        <strong>Saldo: ${saldo >= 0 ? '+' : ''}R$ ${(saldo / 1000).toFixed(1)} bi</strong><br/>
                        Municípios Ganhadores: ${dados.ganhadores} de ${dados.totalMun}`;
            }
        },
        legend: {
            data: ['Ganhos', 'Perdas'],
            top: 10
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            top: '60',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: regioes,
            axisLabel: { fontSize: 12, fontWeight: 'bold' }
        },
        yAxis: {
            type: 'value',
            name: 'R$ bilhões',
            axisLabel: {
                formatter: function(val) {
                    return (val / 1000).toFixed(0);
                }
            }
        },
        series: [
            {
                name: 'Ganhos',
                type: 'bar',
                data: dadosPorRegiao.map(d => d.ganhos),
                itemStyle: { color: CORES.sucesso },
                label: {
                    show: true,
                    position: 'top',
                    formatter: function(params) {
                        return 'R$ ' + (params.value / 1000).toFixed(1) + ' bi';
                    },
                    fontSize: 10
                }
            },
            {
                name: 'Perdas',
                type: 'bar',
                data: dadosPorRegiao.map(d => d.perdas),
                itemStyle: { color: CORES.perigo },
                label: {
                    show: true,
                    position: 'top',
                    formatter: function(params) {
                        return 'R$ ' + (params.value / 1000).toFixed(1) + ' bi';
                    },
                    fontSize: 10
                }
            }
        ]
    };
    
    charts.impactoRegiao.setOption(option);
    window.addEventListener('resize', () => charts.impactoRegiao?.resize());
}

/**
 * Preencher Tabela de Impacto por UF
 */
function preencherTabelaImpactoUF() {
    const tbody = document.getElementById('tabelaImpactoUFBody');
    if (!tbody) return;
    
    const dadosOrdenados = [...DADOS_UF].sort((a, b) => (b.ganhos + b.perdas) - (a.ganhos + a.perdas));
    
    tbody.innerHTML = dadosOrdenados.map(d => {
        const saldo = d.ganhos + d.perdas;
        const saldoClass = saldo >= 0 ? 'positive' : 'negative';
        const percentBeneficiados = d.percentGanhadores;
        
        return `
            <tr>
                <td><strong>${d.uf}</strong></td>
                <td>${UF_INFO[d.uf]?.regiao || d.regiao}</td>
                <td class="text-right positive">+${formatarNumero(d.ganhos)}</td>
                <td class="text-right negative">-${formatarNumero(Math.abs(d.perdas))}</td>
                <td class="text-right ${saldoClass}">${saldo >= 0 ? '+' : ''}${formatarNumero(saldo)}</td>
                <td class="text-center">${formatarNumero(d.ganhadores)} / ${d.totalMun}</td>
                <td class="text-center">
                    <div class="progress-inline">
                        <div class="progress-bar-mini" style="width: ${percentBeneficiados}%; background: ${percentBeneficiados >= 70 ? '#38a169' : percentBeneficiados >= 50 ? '#d69e2e' : '#c53030'}"></div>
                        <span>${percentBeneficiados}%</span>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Mapa do Brasil - Impacto por UF
 */
function criarGraficoMapaBrasil() {
    const container = document.getElementById('chartMapaBrasil');
    if (!container) return;
    
    charts.mapaBrasil = echarts.init(container);
    
    // Dados para o gráfico de barras horizontal (simulando mapa)
    const dadosOrdenados = [...DADOS_UF].sort((a, b) => b.ganhos - a.ganhos);
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: function(params) {
                const d = DADOS_UF.find(x => x.uf === params[0].name);
                if (!d) return '';
                return `<strong>${UF_INFO[d.uf]?.nome || d.uf}</strong><br/>
                        Ganhos: R$ ${formatarNumero(d.ganhos)} mi<br/>
                        Perdas: R$ ${formatarNumero(Math.abs(d.perdas))} mi<br/>
                        Ganhadores: ${d.ganhadores} (${d.percentGanhadores}%)<br/>
                        Perdedores: ${d.perdedores}`;
            }
        },
        legend: {
            data: ['Ganhos', 'Perdas'],
            top: 10
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '50',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            axisLabel: {
                formatter: function(val) {
                    return (val / 1000).toFixed(0) + ' bi';
                }
            }
        },
        yAxis: {
            type: 'category',
            data: dadosOrdenados.map(d => d.uf),
            axisLabel: { fontSize: 11 }
        },
        series: [
            {
                name: 'Ganhos',
                type: 'bar',
                stack: 'total',
                data: dadosOrdenados.map(d => d.ganhos),
                itemStyle: { color: CORES.sucesso }
            },
            {
                name: 'Perdas',
                type: 'bar',
                stack: 'total',
                data: dadosOrdenados.map(d => d.perdas),
                itemStyle: { color: CORES.perigo }
            }
        ]
    };
    
    charts.mapaBrasil.setOption(option);
    
    window.addEventListener('resize', () => charts.mapaBrasil?.resize());
}

/**
 * Gráfico de Proporção Ganhadores vs Perdedores
 */
function criarGraficoProporcao() {
    const container = document.getElementById('chartProporcao');
    if (!container) return;
    
    charts.proporcao = echarts.init(container);
    
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
        },
        series: [{
            type: 'pie',
            radius: ['50%', '75%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 8,
                borderColor: '#fff',
                borderWidth: 2
            },
            label: {
                show: true,
                position: 'center',
                formatter: function() {
                    return '{total|' + TOTAIS_UF.total.totalMun + '}\n{label|municípios}';
                },
                rich: {
                    total: { fontSize: 28, fontWeight: 'bold', color: CORES.primaria },
                    label: { fontSize: 12, color: CORES.neutro }
                }
            },
            data: [
                { value: TOTAIS_UF.total.ganhadores, name: 'Ganhadores', itemStyle: { color: CORES.sucesso }},
                { value: TOTAIS_UF.total.perdedores, name: 'Perdedores', itemStyle: { color: CORES.perigo }}
            ]
        }]
    };
    
    charts.proporcao.setOption(option);
    window.addEventListener('resize', () => charts.proporcao?.resize());
}

/**
 * Gráfico de Saldo por Nível de Renda
 */
function criarGraficoRendaSaldo() {
    const container = document.getElementById('chartRendaSaldo');
    if (!container) return;
    
    charts.rendaSaldo = echarts.init(container);
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: function(params) {
                const p = params[0];
                return `${p.name}<br/>Saldo: R$ ${formatarNumero(p.value)} mi`;
            }
        },
        grid: {
            left: '3%',
            right: '10%',
            bottom: '3%',
            top: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['Baixa Renda', 'Média Renda', 'Alta Renda'],
            axisLabel: { fontSize: 12 }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: function(val) {
                    return (val / 1000).toFixed(0) + ' bi';
                }
            }
        },
        series: [{
            type: 'bar',
            data: [
                { value: TOTAIS_RENDA.baixa.saldo, itemStyle: { color: CORES.sucesso }},
                { value: TOTAIS_RENDA.media.saldo, itemStyle: { color: CORES.perigo }},
                { value: TOTAIS_RENDA.alta.saldo, itemStyle: { color: CORES.perigo }}
            ],
            label: {
                show: true,
                position: 'top',
                formatter: function(params) {
                    const val = params.value;
                    return (val >= 0 ? '+' : '') + (val / 1000).toFixed(1) + ' bi';
                },
                fontSize: 12,
                fontWeight: 'bold'
            },
            barWidth: '50%'
        }]
    };
    
    charts.rendaSaldo.setOption(option);
    window.addEventListener('resize', () => charts.rendaSaldo?.resize());
}

/**
 * Gráfico Comparativo Pré vs Pós Reforma
 */
function criarGraficoReceitaComparativo() {
    const container = document.getElementById('chartReceitaComparativo');
    if (!container) return;
    
    charts.receitaComp = echarts.init(container);
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        },
        legend: {
            data: ['Pré-reforma', 'Pós-reforma'],
            top: 5
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '50',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['Baixa Renda', 'Média Renda', 'Alta Renda']
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: function(val) {
                    return (val / 1000).toFixed(0) + ' bi';
                }
            }
        },
        series: [
            {
                name: 'Pré-reforma',
                type: 'bar',
                data: [TOTAIS_RENDA.baixa.preReforma, TOTAIS_RENDA.media.preReforma, TOTAIS_RENDA.alta.preReforma],
                itemStyle: { color: CORES.neutro }
            },
            {
                name: 'Pós-reforma',
                type: 'bar',
                data: [TOTAIS_RENDA.baixa.posReforma, TOTAIS_RENDA.media.posReforma, TOTAIS_RENDA.alta.posReforma],
                itemStyle: { color: CORES.primaria }
            }
        ]
    };
    
    charts.receitaComp.setOption(option);
    window.addEventListener('resize', () => charts.receitaComp?.resize());
}

/**
 * Matriz de Risco por Categoria
 */
function criarGraficoMatrizRisco() {
    const container = document.getElementById('chartMatrizRisco');
    if (!container) return;
    
    charts.matrizRisco = echarts.init(container);
    
    // Dados das categorias
    const categorias = [
        { nome: 'Total', ...TOTAIS_UF.total },
        { nome: 'Capitais', ...TOTAIS_UF.capitais },
        { nome: 'G-100', ...TOTAIS_UF.g100 },
        { nome: 'PIBpc<25K', ...TOTAIS_UF.pibpc25k },
        { nome: 'Pop>80K', ...TOTAIS_UF.pop80k }
    ];
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        },
        legend: {
            data: ['% Ganhadores', '% Perdedores'],
            top: 10
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '60',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: categorias.map(c => c.nome)
        },
        yAxis: {
            type: 'value',
            max: 100,
            axisLabel: { formatter: '{value}%' }
        },
        series: [
            {
                name: '% Ganhadores',
                type: 'bar',
                stack: 'percent',
                data: categorias.map(c => c.percentGanhadores),
                itemStyle: { color: CORES.sucesso },
                label: {
                    show: true,
                    position: 'inside',
                    formatter: '{c}%',
                    color: '#fff'
                }
            },
            {
                name: '% Perdedores',
                type: 'bar',
                stack: 'percent',
                data: categorias.map(c => 100 - c.percentGanhadores),
                itemStyle: { color: CORES.perigo },
                label: {
                    show: true,
                    position: 'inside',
                    formatter: function(params) {
                        return params.value > 5 ? params.value + '%' : '';
                    },
                    color: '#fff'
                }
            }
        ]
    };
    
    charts.matrizRisco.setOption(option);
    window.addEventListener('resize', () => charts.matrizRisco?.resize());
}

/**
 * Ranking de UFs
 */
function criarGraficoRanking() {
    const container = document.getElementById('chartRanking');
    if (!container) return;
    
    charts.ranking = echarts.init(container);
    atualizarGraficoRanking('eficiencia');
    
    window.addEventListener('resize', () => charts.ranking?.resize());
}

function atualizarGraficoRanking(metrica) {
    if (!charts.ranking) return;
    
    let dadosOrdenados;
    let titulo;
    
    switch(metrica) {
        case 'ganho':
            dadosOrdenados = [...DADOS_UF].sort((a, b) => (b.ganhos + b.perdas) - (a.ganhos + a.perdas));
            titulo = 'Saldo Líquido (Ganhos - Perdas)';
            break;
        case 'resiliencia':
            dadosOrdenados = [...DADOS_UF].sort((a, b) => b.percentGanhadores - a.percentGanhadores);
            titulo = '% Municípios Ganhadores';
            break;
        default: // eficiencia
            dadosOrdenados = [...DADOS_UF].sort((a, b) => {
                const efA = a.ganhos / (Math.abs(a.perdas) || 1);
                const efB = b.ganhos / (Math.abs(b.perdas) || 1);
                return efB - efA;
            });
            titulo = 'Índice de Eficiência (Ganhos/Perdas)';
    }
    
    const top15 = dadosOrdenados.slice(0, 15);
    
    const option = {
        title: {
            text: titulo,
            textStyle: { fontSize: 14, color: CORES.neutro },
            left: 'center',
            top: 5
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        },
        grid: {
            left: '3%',
            right: '10%',
            bottom: '3%',
            top: '50',
            containLabel: true
        },
        xAxis: {
            type: 'value'
        },
        yAxis: {
            type: 'category',
            data: top15.map(d => d.uf).reverse(),
            axisLabel: { fontSize: 11 }
        },
        series: [{
            type: 'bar',
            data: top15.map(d => {
                let valor;
                switch(metrica) {
                    case 'ganho':
                        valor = d.ganhos + d.perdas;
                        break;
                    case 'resiliencia':
                        valor = d.percentGanhadores;
                        break;
                    default:
                        valor = d.ganhos / (Math.abs(d.perdas) || 1);
                }
                return {
                    value: valor,
                    itemStyle: { 
                        color: valor >= 0 || metrica === 'resiliencia' ? CORES.sucesso : CORES.perigo 
                    }
                };
            }).reverse(),
            label: {
                show: true,
                position: 'right',
                formatter: function(params) {
                    if (metrica === 'resiliencia') return params.value + '%';
                    if (metrica === 'ganho') return 'R$ ' + formatarNumero(params.value) + ' mi';
                    return params.value.toFixed(2);
                }
            }
        }]
    };
    
    charts.ranking.setOption(option);
}

/**
 * Gráfico de Projeções
 */
function criarGraficoProjecao() {
    const container = document.getElementById('chartProjecao');
    if (!container) return;
    
    charts.projecao = echarts.init(container);
    atualizarGraficoProjecao('base');
    
    window.addEventListener('resize', () => charts.projecao?.resize());
}

function atualizarGraficoProjecao(cenario) {
    if (!charts.projecao) return;
    
    const dados = PROJECOES.cenarios[cenario];
    
    const option = {
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                let html = `<strong>${params[0].axisValue}</strong><br/>`;
                params.forEach(p => {
                    html += `${p.seriesName}: R$ ${formatarNumero(p.value)} mi<br/>`;
                });
                return html;
            }
        },
        legend: {
            data: ['Baixa Renda', 'Média Renda', 'Alta Renda'],
            top: 10
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '60',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: PROJECOES.anos,
            boundaryGap: false
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: function(val) {
                    return (val / 1000).toFixed(0) + ' bi';
                }
            }
        },
        series: [
            {
                name: 'Baixa Renda',
                type: 'line',
                data: dados.baixa,
                smooth: true,
                itemStyle: { color: CORES.renda.baixa },
                areaStyle: { opacity: 0.1 }
            },
            {
                name: 'Média Renda',
                type: 'line',
                data: dados.media,
                smooth: true,
                itemStyle: { color: CORES.renda.media },
                areaStyle: { opacity: 0.1 }
            },
            {
                name: 'Alta Renda',
                type: 'line',
                data: dados.alta,
                smooth: true,
                itemStyle: { color: CORES.renda.alta },
                areaStyle: { opacity: 0.1 }
            }
        ]
    };
    
    charts.projecao.setOption(option);
}

/**
 * Atualizar todos os gráficos com dados filtrados
 */
function atualizarTodosGraficos() {
    // Redimensionar gráficos locais
    Object.values(charts).forEach(chart => {
        if (chart && typeof chart.resize === 'function') {
            chart.resize();
        }
    });
    
    // Redimensionar gráficos do TaxReformDashboard
    const chartIds = ['chartComparativoCarga', 'chartArrecadacao', 'chartArrecadacaoUF', 'chartEvolucaoArrecadacao', 'chartProjecao'];
    chartIds.forEach(id => {
        const container = document.getElementById(id);
        if (container) {
            const chart = echarts.getInstanceByDom(container);
            if (chart) {
                chart.resize();
            }
        }
    });
}

console.log('📈 Observatório - Módulo de gráficos carregado');
