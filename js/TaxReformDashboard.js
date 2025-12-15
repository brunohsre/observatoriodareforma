/**
 * TaxReformDashboard.js
 * Componente: "Reforma Tributária em Números"
 * Dashboard interativo com dados da reforma tributária brasileira
 * 
 * @author Observatório da Reforma Tributária Brasileira
 * @version 1.0.0
 * @license MIT
 */

const TaxReformDashboard = (function() {
    'use strict';

    // =========================================
    // ESTADO DO COMPONENTE
    // =========================================
    let state = {
        dataLoaded: false,
        currentYear: new Date().getFullYear(),
        lastUpdate: null,
        error: null
    };

    // =========================================
    // DADOS DA CARGA TRIBUTÁRIA
    // =========================================
    const CARGA_TRIBUTARIA = {
        sistemaAtual: {
            nome: 'Sistema Atual (PIS/COFINS/IPI/ICMS/ISS)',
            tributos: [
                { 
                    nome: 'PIS', 
                    aliquota: 1.65, 
                    esfera: 'Federal',
                    cor: '#1a365d',
                    arrecadacao2024: 82.1
                },
                { 
                    nome: 'COFINS', 
                    aliquota: 7.6, 
                    esfera: 'Federal',
                    cor: '#2c5282',
                    arrecadacao2024: 318.2
                },
                { 
                    nome: 'IPI', 
                    aliquota: 5.0, // média ponderada
                    esfera: 'Federal',
                    cor: '#3182ce',
                    arrecadacao2024: 45.6
                },
                { 
                    nome: 'ICMS', 
                    aliquota: 18.0, // média
                    esfera: 'Estadual',
                    cor: '#48bb78',
                    arrecadacao2024: 780.0
                },
                { 
                    nome: 'ISS', 
                    aliquota: 3.5, // média
                    esfera: 'Municipal',
                    cor: '#38a169',
                    arrecadacao2024: 120.0
                }
            ],
            totalAliquota: 35.75,
            caracteristicas: ['Cumulatividade parcial', 'Guerra fiscal', '5 tributos', 'Complexidade alta', '27 legislações ICMS', '5.570 legislações ISS']
        },
        sistemaNovo: {
            nome: 'IVA Dual (CBS + IBS + IS)',
            tributos: [
                { 
                    nome: 'CBS', 
                    aliquota: 8.8, 
                    esfera: 'Federal',
                    cor: '#1a365d',
                    descricao: 'Contribuição sobre Bens e Serviços'
                },
                { 
                    nome: 'IBS', 
                    aliquota: 17.7, 
                    esfera: 'Subnacional',
                    cor: '#48bb78',
                    descricao: 'Imposto sobre Bens e Serviços'
                },
                { 
                    nome: 'IS', 
                    aliquota: 'Variável', 
                    esfera: 'Federal',
                    cor: '#ed8936',
                    descricao: 'Imposto Seletivo (desestímulo)'
                }
            ],
            totalAliquota: 26.5,
            caracteristicas: ['Não-cumulatividade plena', 'Fim da guerra fiscal', '3 tributos', 'Simplicidade', 'Legislação única IBS', 'Split Payment automático']
        },
        aliquotaReferencia: 26.5, // Alíquota neutra estimada pelo MF
        fonteAliquota: 'Ministério da Fazenda - Nota Técnica nº 01/2024'
    };

    // =========================================
    // TIMELINE DA TRANSIÇÃO (EC 132/2023 + LC 214/2025)
    // =========================================
    const TIMELINE_TRANSICAO = [
        {
            ano: 2023,
            titulo: 'Aprovação da EC 132/2023',
            descricao: 'Emenda Constitucional aprovada em 20/12/2023',
            status: 'completed',
            icone: 'fa-gavel',
            cor: '#48bb78',
            detalhes: [
                'Criação do IBS e CBS',
                'Extinção gradual de PIS/COFINS/IPI/ICMS/ISS',
                'Criação do Imposto Seletivo',
                'Estabelecimento do período de transição'
            ]
        },
        {
            ano: 2024,
            titulo: 'Regulamentação (LC 214/2025)',
            descricao: 'Lei Complementar aprovada em 16/01/2025',
            status: 'completed',
            icone: 'fa-file-signature',
            cor: '#48bb78',
            detalhes: [
                'Definição das alíquotas de teste',
                'Regras do Split Payment',
                'Critérios do Cashback',
                'Cesta Básica Nacional definida'
            ]
        },
        {
            ano: 2025,
            titulo: 'Preparação Final',
            descricao: 'Implementação de sistemas e adaptação',
            status: 'current',
            icone: 'fa-cogs',
            cor: '#4299e1',
            detalhes: [
                'Criação do Comitê Gestor do IBS',
                'Desenvolvimento do Split Payment',
                'Cadastro Nacional de Contribuintes',
                'Testes de sistemas'
            ]
        },
        {
            ano: 2026,
            titulo: 'Início do Período de Teste',
            descricao: 'CBS: 0,9% | IBS: 0,1%',
            status: 'pending',
            icone: 'fa-flask',
            cor: '#718096',
            detalhes: [
                'Alíquota de teste CBS: 0,9%',
                'Alíquota de teste IBS: 0,1%',
                'Compensação integral com PIS/COFINS',
                'Avaliação de impactos'
            ],
            aliquotas: { CBS: 0.9, IBS: 0.1 }
        },
        {
            ano: 2027,
            titulo: 'Continuação do Teste',
            descricao: 'Manutenção das alíquotas de teste',
            status: 'pending',
            icone: 'fa-flask',
            cor: '#718096',
            detalhes: [
                'Análise dos resultados de 2026',
                'Ajustes nos sistemas',
                'Preparação para transição plena'
            ],
            aliquotas: { CBS: 0.9, IBS: 0.1 }
        },
        {
            ano: 2028,
            titulo: 'CBS Substitui PIS/COFINS',
            descricao: 'CBS: 8,8% | Extinção PIS/COFINS | IPI zerado*',
            status: 'pending',
            icone: 'fa-exchange-alt',
            cor: '#718096',
            detalhes: [
                'CBS assume alíquota plena: 8,8%',
                'Extinção total de PIS e COFINS',
                'IPI zerado (exceto ZFM)',
                'IBS mantém 0,1%'
            ],
            aliquotas: { CBS: 8.8, IBS: 0.1, PIS_COFINS: 0 }
        },
        {
            ano: 2029,
            titulo: 'Início Transição IBS (10%)',
            descricao: 'IBS: 10% da alíquota | ICMS/ISS: 90%',
            status: 'pending',
            icone: 'fa-arrow-right',
            cor: '#718096',
            detalhes: [
                'IBS assume 10% da alíquota final',
                'ICMS e ISS reduzidos em 10%',
                'Início do Fundo de Desenvolvimento Regional'
            ],
            aliquotas: { CBS: 8.8, IBS: 1.77, ICMS_ISS: 90 }
        },
        {
            ano: 2030,
            titulo: 'Transição IBS (20%)',
            descricao: 'IBS: 20% | ICMS/ISS: 80%',
            status: 'pending',
            icone: 'fa-arrow-right',
            cor: '#718096',
            aliquotas: { CBS: 8.8, IBS: 3.54, ICMS_ISS: 80 }
        },
        {
            ano: 2031,
            titulo: 'Transição IBS (30%)',
            descricao: 'IBS: 30% | ICMS/ISS: 70%',
            status: 'pending',
            icone: 'fa-arrow-right',
            cor: '#718096',
            aliquotas: { CBS: 8.8, IBS: 5.31, ICMS_ISS: 70 }
        },
        {
            ano: 2032,
            titulo: 'Transição IBS (40%)',
            descricao: 'IBS: 40% | ICMS/ISS: 60%',
            status: 'pending',
            icone: 'fa-arrow-right',
            cor: '#718096',
            aliquotas: { CBS: 8.8, IBS: 7.08, ICMS_ISS: 60 }
        },
        {
            ano: 2033,
            titulo: 'IVA Dual em Plena Vigência',
            descricao: 'CBS: 8,8% + IBS: 17,7% = 26,5%',
            status: 'pending',
            icone: 'fa-flag-checkered',
            cor: '#9f7aea',
            detalhes: [
                'IVA Dual totalmente implementado',
                'Extinção completa de ICMS e ISS',
                'Alíquota total estimada: 26,5%',
                'Sistema tributário unificado'
            ],
            aliquotas: { CBS: 8.8, IBS: 17.7, total: 26.5 }
        }
    ];

    // =========================================
    // FUNÇÕES DE RENDERIZAÇÃO
    // =========================================

    /**
     * Renderiza o widget de comparativo de carga tributária
     */
    function renderComparativoCarga(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const chart = echarts.init(container);
        
        // Dados para o gráfico de barras empilhadas
        const sistemaAtual = CARGA_TRIBUTARIA.sistemaAtual.tributos;
        const sistemaNovo = CARGA_TRIBUTARIA.sistemaNovo.tributos;

        const option = {
            title: {
                text: 'Comparativo: Sistema Atual vs IVA Dual',
                subtext: 'Alíquotas por esfera (% do valor)',
                left: 'center',
                textStyle: { color: '#1a365d', fontSize: 16 }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: function(params) {
                    let html = `<strong>${params[0].axisValue}</strong><br/>`;
                    let total = 0;
                    params.forEach(p => {
                        if (typeof p.value === 'number' && p.value > 0) {
                            html += `${p.marker} ${p.seriesName}: ${p.value}%<br/>`;
                            total += p.value;
                        }
                    });
                    html += `<strong>Total: ${total.toFixed(1)}%</strong>`;
                    return html;
                }
            },
            legend: {
                data: ['PIS', 'COFINS', 'IPI', 'ICMS', 'ISS', 'CBS', 'IBS'],
                bottom: 10,
                textStyle: { fontSize: 11 }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                top: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['Sistema Atual', 'IVA Dual (2033)'],
                axisLabel: { fontWeight: 'bold', fontSize: 12 }
            },
            yAxis: {
                type: 'value',
                name: 'Alíquota (%)',
                max: 40,
                axisLabel: { formatter: '{value}%' }
            },
            series: [
                // Sistema Atual
                { name: 'PIS', type: 'bar', stack: 'tributos', data: [1.65, 0], itemStyle: { color: '#1a365d' } },
                { name: 'COFINS', type: 'bar', stack: 'tributos', data: [7.6, 0], itemStyle: { color: '#2c5282' } },
                { name: 'IPI', type: 'bar', stack: 'tributos', data: [5.0, 0], itemStyle: { color: '#3182ce' } },
                { name: 'ICMS', type: 'bar', stack: 'tributos', data: [18.0, 0], itemStyle: { color: '#48bb78' } },
                { name: 'ISS', type: 'bar', stack: 'tributos', data: [3.5, 0], itemStyle: { color: '#38a169' } },
                // IVA Dual
                { name: 'CBS', type: 'bar', stack: 'tributos', data: [0, 8.8], itemStyle: { color: '#1a365d' } },
                { name: 'IBS', type: 'bar', stack: 'tributos', data: [0, 17.7], itemStyle: { color: '#48bb78' } }
            ],
            aria: {
                enabled: true,
                decal: { show: true }
            }
        };

        chart.setOption(option);
        window.addEventListener('resize', () => chart.resize());

        return chart;
    }

    /**
     * Renderiza o relógio/timeline de transição interativo
     */
    function renderTimelineTransicao(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const anoAtual = new Date().getFullYear();

        let html = `
            <div class="timeline-transicao" role="region" aria-label="Timeline da Transição Tributária">
                <div class="timeline-header">
                    <h4><i class="fas fa-clock"></i> Relógio da Transição (2023-2033)</h4>
                    <div class="timeline-progress">
                        <div class="progress-bar" style="width: ${calcularProgressoTransicao()}%"></div>
                        <span class="progress-label">${calcularProgressoTransicao()}% concluído</span>
                    </div>
                </div>
                <div class="timeline-scroll" tabindex="0" aria-label="Use as setas para navegar na timeline">
                    <div class="timeline-track">
        `;

        TIMELINE_TRANSICAO.forEach((item, index) => {
            const isActive = item.ano === anoAtual;
            const isPast = item.ano < anoAtual;
            const statusClass = isPast ? 'completed' : (isActive ? 'current' : 'pending');
            
            html += `
                <div class="timeline-item ${statusClass}" 
                     data-ano="${item.ano}"
                     role="listitem"
                     aria-label="${item.ano}: ${item.titulo}"
                     tabindex="0">
                    <div class="timeline-marker" style="background-color: ${item.cor}">
                        <i class="fas ${item.icone}"></i>
                    </div>
                    <div class="timeline-content">
                        <span class="timeline-year">${item.ano}</span>
                        <h5>${item.titulo}</h5>
                        <p>${item.descricao}</p>
                        ${item.aliquotas ? renderAliquotasWidget(item.aliquotas) : ''}
                    </div>
                </div>
            `;
        });

        html += `
                    </div>
                </div>
                <div class="timeline-nav">
                    <button class="timeline-nav-btn" onclick="TaxReformDashboard.scrollTimeline(-1)" aria-label="Anterior">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="timeline-nav-btn" onclick="TaxReformDashboard.scrollTimeline(1)" aria-label="Próximo">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Scroll automático para o ano atual
        setTimeout(() => {
            const currentItem = container.querySelector('.timeline-item.current');
            if (currentItem) {
                currentItem.scrollIntoView({ behavior: 'smooth', inline: 'center' });
            }
        }, 100);
    }

    /**
     * Renderiza mini widget de alíquotas
     */
    function renderAliquotasWidget(aliquotas) {
        let html = '<div class="aliquotas-mini">';
        if (aliquotas.CBS !== undefined) {
            html += `<span class="aliquota-tag cbs">CBS: ${aliquotas.CBS}%</span>`;
        }
        if (aliquotas.IBS !== undefined) {
            html += `<span class="aliquota-tag ibs">IBS: ${aliquotas.IBS}%</span>`;
        }
        if (aliquotas.total !== undefined) {
            html += `<span class="aliquota-tag total">Total: ${aliquotas.total}%</span>`;
        }
        html += '</div>';
        return html;
    }

    /**
     * Renderiza o widget de impacto orçamentário com dados do SIOP
     */
    async function renderImpactoOrcamentario(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let dadosRCL, dadosArrecadacao;
        
        try {
            // Tentar obter dados do GovernmentDataService
            if (window.GovernmentDataService) {
                dadosRCL = await GovernmentDataService.getReceitaCorrenteLiquida();
                dadosArrecadacao = await GovernmentDataService.getArrecadacaoFederal(2024);
            }
        } catch (error) {
            console.warn('Usando dados estáticos para impacto orçamentário:', error);
        }

        // Dados para exibição
        const rcl2024 = dadosRCL?.dados?.[2024]?.valor || 2218.4;
        const rcl2025 = dadosRCL?.dados?.[2025]?.valor || 2385.0;
        const arrecadacaoTotal = dadosArrecadacao?.total || 2345.6;
        const ultimaAtualizacao = dadosRCL?.ultimaAtualizacao || '2024-12-31';
        const fonte = dadosRCL?.fonte || 'Secretaria do Tesouro Nacional';
        const isRealtime = dadosRCL?.isRealtime || false;

        const html = `
            <div class="impacto-orcamentario-card" role="region" aria-label="Impacto Orçamentário">
                ${!isRealtime ? `
                    <div class="data-warning" role="alert">
                        <i class="fas fa-info-circle"></i>
                        <span>Dados oficiais de ${formatarData(ultimaAtualizacao)}. Fonte: ${fonte}</span>
                    </div>
                ` : ''}
                
                <div class="big-number-cards">
                    <div class="big-number-card primary">
                        <div class="big-number-icon">
                            <i class="fas fa-chart-pie" aria-hidden="true"></i>
                        </div>
                        <div class="big-number-content">
                            <span class="big-number-label">Receita Corrente Líquida (2024)</span>
                            <span class="big-number-value">R$ ${formatarBilhoes(rcl2024)}</span>
                            <span class="big-number-detail">
                                <i class="fas fa-arrow-up" aria-hidden="true"></i> 
                                +8,03% vs 2023
                            </span>
                        </div>
                    </div>
                    
                    <div class="big-number-card success">
                        <div class="big-number-icon">
                            <i class="fas fa-coins" aria-hidden="true"></i>
                        </div>
                        <div class="big-number-content">
                            <span class="big-number-label">Arrecadação Tributária Federal</span>
                            <span class="big-number-value">R$ ${formatarBilhoes(arrecadacaoTotal)}</span>
                            <span class="big-number-detail">Acumulado 2024 (estimativa)</span>
                        </div>
                    </div>
                    
                    <div class="big-number-card info">
                        <div class="big-number-icon">
                            <i class="fas fa-percentage" aria-hidden="true"></i>
                        </div>
                        <div class="big-number-content">
                            <span class="big-number-label">Alíquota Neutra IVA Dual</span>
                            <span class="big-number-value">${CARGA_TRIBUTARIA.aliquotaReferencia}%</span>
                            <span class="big-number-detail">CBS 8,8% + IBS 17,7%</span>
                        </div>
                    </div>
                    
                    <div class="big-number-card warning">
                        <div class="big-number-icon">
                            <i class="fas fa-calendar-alt" aria-hidden="true"></i>
                        </div>
                        <div class="big-number-content">
                            <span class="big-number-label">Projeção RCL 2025</span>
                            <span class="big-number-value">R$ ${formatarBilhoes(rcl2025)}</span>
                            <span class="big-number-detail">PLOA 2025</span>
                        </div>
                    </div>
                </div>
                
                <div class="fonte-dados">
                    <small>
                        <i class="fas fa-database" aria-hidden="true"></i> 
                        Fonte: ${fonte} | Atualização: ${formatarData(ultimaAtualizacao)}
                    </small>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    /**
     * Renderiza gráfico de arrecadação por tributo
     */
    async function renderArrecadacaoPorTributo(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const chart = echarts.init(container);
        
        let dadosArrecadacao;
        try {
            if (window.GovernmentDataService) {
                dadosArrecadacao = await GovernmentDataService.getArrecadacaoFederal(2024);
            }
        } catch (error) {
            console.warn('Usando dados estáticos para arrecadação:', error);
        }

        const tributos = dadosArrecadacao?.tributos || {
            'PIS/PASEP': 82.1,
            'COFINS': 318.2,
            'IPI': 45.6,
            'Imposto de Importação': 64.2,
            'IRPJ': 312.8,
            'CSLL': 145.2
        };

        const option = {
            title: {
                text: 'Arrecadação Federal por Tributo (2024)',
                subtext: 'R$ bilhões - Fonte: Receita Federal',
                left: 'center',
                textStyle: { color: '#1a365d', fontSize: 14 }
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}: R$ {c} bi ({d}%)'
            },
            legend: {
                orient: 'vertical',
                right: 10,
                top: 'center',
                textStyle: { fontSize: 11 }
            },
            series: [
                {
                    name: 'Arrecadação',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['40%', '55%'],
                    avoidLabelOverlap: true,
                    itemStyle: {
                        borderRadius: 8,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: false
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 14,
                            fontWeight: 'bold'
                        }
                    },
                    data: Object.entries(tributos).map(([nome, valor], index) => ({
                        name: nome,
                        value: valor,
                        itemStyle: {
                            color: ['#1a365d', '#2c5282', '#3182ce', '#4299e1', '#48bb78', '#38a169'][index]
                        }
                    }))
                }
            ],
            aria: {
                enabled: true,
                decal: { show: true }
            }
        };

        chart.setOption(option);
        window.addEventListener('resize', () => chart.resize());

        return chart;
    }

    // =========================================
    // FUNÇÕES AUXILIARES
    // =========================================

    function calcularProgressoTransicao() {
        const anoInicio = 2023;
        const anoFim = 2033;
        const anoAtual = Math.min(new Date().getFullYear(), anoFim);
        return Math.round(((anoAtual - anoInicio) / (anoFim - anoInicio)) * 100);
    }

    function formatarBilhoes(valor) {
        if (valor >= 1000) {
            return (valor / 1000).toFixed(2) + ' tri';
        }
        return valor.toFixed(1) + ' bi';
    }

    function formatarData(dataStr) {
        const data = new Date(dataStr);
        return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    function scrollTimeline(direction) {
        const track = document.querySelector('.timeline-scroll');
        if (track) {
            const scrollAmount = 300;
            track.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
        }
    }

    // =========================================
    // INICIALIZAÇÃO
    // =========================================

    async function init(options = {}) {
        const {
            comparativoId = 'chartComparativoCarga',
            timelineId = 'timelineTransicao',
            impactoId = 'impactoOrcamentario',
            arrecadacaoId = 'chartArrecadacao'
        } = options;

        try {
            // Renderizar componentes
            if (document.getElementById(comparativoId)) {
                renderComparativoCarga(comparativoId);
            }
            
            if (document.getElementById(timelineId)) {
                renderTimelineTransicao(timelineId);
            }
            
            if (document.getElementById(impactoId)) {
                await renderImpactoOrcamentario(impactoId);
            }
            
            if (document.getElementById(arrecadacaoId)) {
                await renderArrecadacaoPorTributo(arrecadacaoId);
            }

            state.dataLoaded = true;
            state.lastUpdate = new Date();
            
            console.log('📊 TaxReformDashboard inicializado com sucesso');
        } catch (error) {
            state.error = error.message;
            console.error('Erro ao inicializar TaxReformDashboard:', error);
        }
    }

    // =========================================
    // INTERFACE PÚBLICA
    // =========================================
    return {
        init,
        renderComparativoCarga,
        renderTimelineTransicao,
        renderImpactoOrcamentario,
        renderArrecadacaoPorTributo,
        scrollTimeline,
        
        // Dados
        CARGA_TRIBUTARIA,
        TIMELINE_TRANSICAO,
        
        // Estado
        getState: () => ({ ...state })
    };
})();

// Exportar para uso global
window.TaxReformDashboard = TaxReformDashboard;

console.log('📈 TaxReformDashboard carregado');
