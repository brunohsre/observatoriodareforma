/**
 * Observatório de Riscos Fiscais - Script Principal
 * Controle de navegação, filtros e interações
 */

// Estado da aplicação
let estadoAtual = {
    secao: 'visao-geral',
    filtros: {
        ano: '2022',
        regiao: '',
        uf: '',
        renda: '',
        categoria: ''
    },
    cenario: 'base'
};

/**
 * Inicialização da aplicação
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Observatório de Riscos Fiscais - Iniciando...');
    
    // Popular filtros
    popularFiltros();
    
    // Configurar navegação
    configurarNavegacao();
    
    // Configurar botões de ação
    configurarBotoes();
    
    // Carregar dados iniciais
    carregarDados();
    
    // Inicializar gráficos
    inicializarGraficos();
    
    // Preencher alertas
    preencherAlertas();
    
    // Configurar benchmarking
    configurarBenchmarking();
    
    console.log('✅ Observatório - Aplicação iniciada!');
});

/**
 * Popular opções dos filtros
 */
function popularFiltros() {
    const selectUF = document.getElementById('filterUF');
    if (selectUF) {
        selectUF.innerHTML = '<option value="">Todos os Estados</option>';
        Object.keys(UF_INFO).sort().forEach(uf => {
            const option = document.createElement('option');
            option.value = uf;
            option.textContent = `${uf} - ${UF_INFO[uf].nome}`;
            selectUF.appendChild(option);
        });
    }
    
    // Benchmarking selects
    const selects = ['benchmarkUF1', 'benchmarkUF2'];
    selects.forEach(id => {
        const select = document.getElementById(id);
        if (select) {
            select.innerHTML = '';
            Object.keys(UF_INFO).sort().forEach(uf => {
                const option = document.createElement('option');
                option.value = uf;
                option.textContent = `${UF_INFO[uf].nome} (${uf})`;
                select.appendChild(option);
            });
        }
    });
    
    // Valores padrão
    const uf1 = document.getElementById('benchmarkUF1');
    const uf2 = document.getElementById('benchmarkUF2');
    if (uf1) uf1.value = 'SP';
    if (uf2) uf2.value = 'MG';
}

/**
 * Configurar navegação entre seções
 */
function configurarNavegacao() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const secao = this.dataset.section;
            navegarPara(secao);
        });
    });
}

function navegarPara(secao) {
    // Atualizar estado
    estadoAtual.secao = secao;
    
    // Atualizar navegação
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.section === secao);
    });
    
    // Mostrar seção correspondente
    document.querySelectorAll('.section').forEach(section => {
        section.classList.toggle('active', section.id === `section-${secao}`);
    });
    
    // Atualizar visibilidade dos filtros
    if (typeof atualizarVisibilidadeFiltros === 'function') {
        atualizarVisibilidadeFiltros(secao);
    }
    
    // Redimensionar gráficos após transição
    setTimeout(() => {
        atualizarTodosGraficos();
        
        // Re-inicializar gráficos específicos por seção
        if (secao === 'reforma-numeros') {
            reinicializarGraficosReforma();
        }
        
        // Re-inicializar gráficos da seção Impacto na Arrecadação
        if (secao === 'impacto-arrecadacao') {
            if (typeof inicializarGraficosImpacto === 'function') {
                inicializarGraficosImpacto();
            }
        }
        
        // Re-inicializar gráficos da seção Timeline da Transição
        if (secao === 'timeline-transicao') {
            if (typeof inicializarGraficosTimeline === 'function') {
                inicializarGraficosTimeline();
            }
        }
    }, 150);
}

/**
 * Reinicializar gráficos da seção Reforma em Números
 * Garante que os gráficos sejam renderizados quando a seção se torna visível
 */
function reinicializarGraficosReforma() {
    // Comparativo Sistema Atual vs IVA Dual
    const chartComparativo = document.getElementById('chartComparativoCarga');
    if (chartComparativo) {
        // Dispose existing chart if any and create new one
        let existingChart = echarts.getInstanceByDom(chartComparativo);
        if (existingChart) {
            existingChart.dispose();
        }
        const chart = echarts.init(chartComparativo);
        chart.setOption({
            title: {
                text: 'Comparativo: Sistema Atual vs IVA Dual',
                subtext: 'Composição da carga tributária',
                left: 'center',
                textStyle: { color: '#1a365d', fontSize: 14 }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: function(params) {
                    let html = `<strong>${params[0].axisValue}</strong><br/>`;
                    let total = 0;
                    params.forEach(p => {
                        if (p.value > 0) {
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
                bottom: 5,
                textStyle: { fontSize: 10 }
            },
            grid: { left: '3%', right: '4%', bottom: '18%', top: '18%', containLabel: true },
            xAxis: {
                type: 'category',
                data: ['Sistema Atual (5 tributos)', 'IVA Dual (3 tributos)'],
                axisLabel: { fontWeight: 'bold', fontSize: 11 }
            },
            yAxis: { type: 'value', name: 'Alíquota (%)', max: 40, axisLabel: { formatter: '{value}%' } },
            series: [
                { name: 'PIS', type: 'bar', stack: 'total', data: [1.65, 0], itemStyle: { color: '#1a365d' } },
                { name: 'COFINS', type: 'bar', stack: 'total', data: [7.6, 0], itemStyle: { color: '#2c5282' } },
                { name: 'IPI', type: 'bar', stack: 'total', data: [5.0, 0], itemStyle: { color: '#3182ce' } },
                { name: 'ICMS', type: 'bar', stack: 'total', data: [18.0, 0], itemStyle: { color: '#48bb78' } },
                { name: 'ISS', type: 'bar', stack: 'total', data: [3.5, 0], itemStyle: { color: '#38a169' } },
                { name: 'CBS', type: 'bar', stack: 'total', data: [0, 8.8], itemStyle: { color: '#1a365d' } },
                { name: 'IBS', type: 'bar', stack: 'total', data: [0, 17.7], itemStyle: { color: '#48bb78' } }
            ]
        });
        window.addEventListener('resize', () => chart.resize());
    }
    
    // Arrecadação por Tributo
    const chartArrecadacao = document.getElementById('chartArrecadacao');
    if (chartArrecadacao) {
        // Dispose existing chart if any and create new one
        let existingChart = echarts.getInstanceByDom(chartArrecadacao);
        if (existingChart) {
            existingChart.dispose();
        }
        const chart = echarts.init(chartArrecadacao);
        chart.setOption({
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
                textStyle: { fontSize: 10 }
            },
            series: [{
                name: 'Arrecadação',
                type: 'pie',
                radius: ['35%', '65%'],
                center: ['40%', '55%'],
                avoidLabelOverlap: true,
                itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
                label: { show: false },
                emphasis: { label: { show: true, fontSize: 12, fontWeight: 'bold' } },
                data: [
                    { name: 'COFINS', value: 318.2, itemStyle: { color: '#2c5282' } },
                    { name: 'IRPJ', value: 312.8, itemStyle: { color: '#1a365d' } },
                    { name: 'CSLL', value: 145.2, itemStyle: { color: '#3182ce' } },
                    { name: 'PIS/PASEP', value: 82.1, itemStyle: { color: '#4299e1' } },
                    { name: 'Imp. Importação', value: 64.2, itemStyle: { color: '#48bb78' } },
                    { name: 'IPI', value: 45.6, itemStyle: { color: '#38a169' } }
                ]
            }]
        });
        window.addEventListener('resize', () => chart.resize());
    }
    
    console.log('📊 Gráficos da seção Reforma em Números reinicializados');
}

/**
 * Configurar botões de ação
 */
function configurarBotoes() {
    // Botões de visualização do mapa
    document.querySelectorAll('.btn-chart[data-view]').forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.dataset.view;
            this.parentElement.querySelectorAll('.btn-chart').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            // Atualizar visualização
        });
    });
    
    // Botões de métrica do ranking
    document.querySelectorAll('.btn-chart[data-metric]').forEach(btn => {
        btn.addEventListener('click', function() {
            const metric = this.dataset.metric;
            this.parentElement.querySelectorAll('.btn-chart').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            atualizarGraficoRanking(metric);
        });
    });
    
    // Botões de cenário
    document.querySelectorAll('.scenario-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const cenario = this.dataset.scenario;
            document.querySelectorAll('.scenario-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            estadoAtual.cenario = cenario;
            atualizarGraficoProjecao(cenario);
        });
    });
    
    // Ordenação de tabelas
    document.querySelectorAll('.data-table.sortable th[data-sort]').forEach(th => {
        th.addEventListener('click', function() {
            const coluna = this.dataset.sort;
            ordenarTabela('tabelaUF', coluna);
        });
    });
}

/**
 * Carregar dados nas tabelas e componentes
 */
function carregarDados() {
    // Tabela principal por UF
    preencherTabelaUF();
    
    // Tabela por renda/UF
    preencherTabelaRendaUF();
    
    // Tabela completa
    preencherTabelaCompleta();
}

function preencherTabelaUF() {
    const tbody = document.getElementById('tabelaUFBody');
    if (!tbody) return;
    
    const dados = aplicarFiltrosAosDados(DADOS_UF);
    
    tbody.innerHTML = dados.map(d => {
        const risco = calcularRisco(d);
        const riscoClass = {
            'critical': 'critical',
            'high': 'high',
            'medium': 'medium',
            'low': 'low'
        }[risco];
        
        const riscoLabel = {
            'critical': 'CRÍTICO',
            'high': 'ALTO',
            'medium': 'MÉDIO',
            'low': 'BAIXO'
        }[risco];
        
        return `
            <tr>
                <td><strong>${d.uf}</strong> <small class="text-muted">${UF_INFO[d.uf]?.regiao || ''}</small></td>
                <td class="text-right positive">+${formatarNumero(d.ganhos)}</td>
                <td class="text-right negative">${formatarNumero(d.perdas)}</td>
                <td class="text-center">${formatarNumero(d.ganhadores)}</td>
                <td class="text-center">${formatarNumero(d.perdedores)}</td>
                <td class="text-center">${formatarNumero(d.totalMun)}</td>
                <td class="text-center">
                    <div class="progress-inline">
                        <div class="progress-bar-mini" style="width: ${d.percentGanhadores}%"></div>
                        <span>${d.percentGanhadores}%</span>
                    </div>
                </td>
                <td><span class="risk-badge ${riscoClass}">${riscoLabel}</span></td>
            </tr>
        `;
    }).join('');
}

function preencherTabelaRendaUF() {
    const tbody = document.getElementById('tabelaRendaUFBody');
    if (!tbody) return;
    
    tbody.innerHTML = DADOS_RENDA_UF.map(d => {
        const variacao = ((d.posReforma - d.preReforma) / d.preReforma * 100).toFixed(1);
        const variacaoClass = d.saldo >= 0 ? 'positive' : 'negative';
        
        return `
            <tr class="renda-${d.renda.toLowerCase()}">
                <td><span class="renda-badge ${d.renda.toLowerCase()}">${d.renda}</span></td>
                <td><strong>${d.uf}</strong></td>
                <td class="text-right">R$ ${formatarNumero(d.pibpc)}</td>
                <td class="text-right">R$ ${formatarNumero(d.preReforma)}</td>
                <td class="text-right">R$ ${formatarNumero(d.posReforma)}</td>
                <td class="text-right ${variacaoClass}">${d.saldo >= 0 ? '+' : ''}${formatarNumero(d.saldo)}</td>
                <td class="text-center ${variacaoClass}">${d.saldo >= 0 ? '+' : ''}${variacao}%</td>
            </tr>
        `;
    }).join('');
}

function preencherTabelaCompleta() {
    const tbody = document.getElementById('tabelaCompletaBody');
    if (!tbody) return;
    
    tbody.innerHTML = DADOS_UF.map(d => {
        const rendaUF = DADOS_RENDA_UF.find(r => r.uf === d.uf);
        const pibpc = rendaUF ? rendaUF.pibpc : '-';
        const renda = rendaUF ? rendaUF.renda : '-';
        
        return `
            <tr>
                <td><strong>${d.uf}</strong></td>
                <td>${d.regiao.charAt(0).toUpperCase() + d.regiao.slice(1)}</td>
                <td><span class="renda-badge ${renda.toLowerCase()}">${renda}</span></td>
                <td class="text-right">R$ ${formatarNumero(pibpc)}</td>
                <td class="text-right positive">+${formatarNumero(d.ganhos)}</td>
                <td class="text-right negative">${formatarNumero(d.perdas)}</td>
                <td class="text-center">${d.ganhadores}</td>
                <td class="text-center">${d.perdedores}</td>
                <td class="text-center">${d.percentGanhadores}%</td>
            </tr>
        `;
    }).join('');
}

/**
 * Aplicar filtros aos dados
 */
function aplicarFiltros() {
    estadoAtual.filtros = {
        ano: document.getElementById('filterAno')?.value || '2022',
        regiao: document.getElementById('filterRegiao')?.value || '',
        uf: document.getElementById('filterUF')?.value || '',
        renda: document.getElementById('filterRenda')?.value || '',
        categoria: document.getElementById('filterCategoria')?.value || ''
    };
    
    carregarDados();
    
    // Atualizar gráficos
    setTimeout(() => {
        atualizarTodosGraficos();
    }, 100);
}

function aplicarFiltrosAosDados(dados) {
    return dados.filter(d => {
        if (estadoAtual.filtros.regiao && d.regiao !== estadoAtual.filtros.regiao) return false;
        if (estadoAtual.filtros.uf && d.uf !== estadoAtual.filtros.uf) return false;
        return true;
    });
}

function limparFiltros() {
    document.getElementById('filterAno').value = '2022';
    document.getElementById('filterRegiao').value = '';
    document.getElementById('filterUF').value = '';
    document.getElementById('filterRenda').value = '';
    document.getElementById('filterCategoria').value = '';
    
    aplicarFiltros();
}

/**
 * Filtrar tabela de UF por busca
 */
function filtrarTabelaUF() {
    const termo = document.getElementById('searchUF')?.value.toLowerCase() || '';
    const linhas = document.querySelectorAll('#tabelaUFBody tr');
    
    linhas.forEach(linha => {
        const texto = linha.textContent.toLowerCase();
        linha.style.display = texto.includes(termo) ? '' : 'none';
    });
}

/**
 * Ordenar tabela
 */
function ordenarTabela(tabelaId, coluna) {
    // Implementação simplificada de ordenação
    console.log(`Ordenando ${tabelaId} por ${coluna}`);
}

/**
 * Preencher alertas de risco
 */
function preencherAlertas() {
    // Alertas críticos
    const alertsCriticos = document.getElementById('alertsCriticos');
    if (alertsCriticos) {
        const criticos = DADOS_UF
            .filter(d => calcularRisco(d) === 'critical' || calcularRisco(d) === 'high')
            .sort((a, b) => a.percentGanhadores - b.percentGanhadores)
            .slice(0, 5);
        
        alertsCriticos.innerHTML = criticos.length ? criticos.map(d => `
            <div class="alert-item">
                <strong>${UF_INFO[d.uf]?.nome || d.uf}</strong>
                <p>Apenas ${d.percentGanhadores}% dos municípios são ganhadores</p>
                <small>Perdas de R$ ${formatarNumero(Math.abs(d.perdas))} milhões</small>
            </div>
        `).join('') : '<p class="no-alerts">Nenhum alerta crítico no momento</p>';
    }
    
    // Pontos de atenção
    const alertsAtencao = document.getElementById('alertsAtencao');
    if (alertsAtencao) {
        alertsAtencao.innerHTML = `
            <div class="alert-item">
                <strong>Concentração de Perdas</strong>
                <p>São Paulo concentra 58% das perdas totais (R$ 29,3 bi)</p>
            </div>
            <div class="alert-item">
                <strong>Capitais em Risco</strong>
                <p>41% das capitais terão redução de receita</p>
            </div>
            <div class="alert-item">
                <strong>Transição 2026-2032</strong>
                <p>Período crítico de adaptação ao novo sistema</p>
            </div>
        `;
    }
}

/**
 * Configurar benchmarking
 */
function configurarBenchmarking() {
    gerarBenchmark();
}

function gerarBenchmark() {
    const uf1 = document.getElementById('benchmarkUF1')?.value || 'SP';
    const uf2 = document.getElementById('benchmarkUF2')?.value || 'MG';
    
    const dados1 = DADOS_UF.find(d => d.uf === uf1);
    const dados2 = DADOS_UF.find(d => d.uf === uf2);
    
    if (!dados1 || !dados2) return;
    
    const container = document.getElementById('benchmarkCards');
    if (!container) return;
    
    container.innerHTML = `
        <div class="benchmark-comparison">
            <div class="benchmark-card">
                <h4>${UF_INFO[uf1]?.nome || uf1}</h4>
                <div class="benchmark-stats">
                    <div class="stat">
                        <span class="label">Ganhos</span>
                        <span class="value positive">+R$ ${formatarNumero(dados1.ganhos)} mi</span>
                    </div>
                    <div class="stat">
                        <span class="label">Perdas</span>
                        <span class="value negative">R$ ${formatarNumero(Math.abs(dados1.perdas))} mi</span>
                    </div>
                    <div class="stat">
                        <span class="label">% Ganhadores</span>
                        <span class="value">${dados1.percentGanhadores}%</span>
                    </div>
                    <div class="stat">
                        <span class="label">Municípios</span>
                        <span class="value">${dados1.totalMun}</span>
                    </div>
                </div>
            </div>
            <div class="benchmark-vs">
                <i class="fas fa-exchange-alt"></i>
            </div>
            <div class="benchmark-card">
                <h4>${UF_INFO[uf2]?.nome || uf2}</h4>
                <div class="benchmark-stats">
                    <div class="stat">
                        <span class="label">Ganhos</span>
                        <span class="value positive">+R$ ${formatarNumero(dados2.ganhos)} mi</span>
                    </div>
                    <div class="stat">
                        <span class="label">Perdas</span>
                        <span class="value negative">R$ ${formatarNumero(Math.abs(dados2.perdas))} mi</span>
                    </div>
                    <div class="stat">
                        <span class="label">% Ganhadores</span>
                        <span class="value">${dados2.percentGanhadores}%</span>
                    </div>
                    <div class="stat">
                        <span class="label">Municípios</span>
                        <span class="value">${dados2.totalMun}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function atualizarBenchmark() {
    gerarBenchmark();
}

/**
 * Exportar dados
 */
function exportarDados(tipo) {
    let csv;
    let filename;
    
    switch(tipo) {
        case 'uf':
            csv = gerarCSV('uf');
            filename = 'observatorio_dados_uf.csv';
            break;
        case 'renda':
            csv = gerarCSV('renda');
            filename = 'observatorio_dados_renda.csv';
            break;
        default:
            csv = gerarCSV('uf');
            filename = 'observatorio_dados.csv';
    }
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

function mostrarAPI() {
    alert('Documentação da API em desenvolvimento.\n\nEndpoint: /api/v1/dados\nFormatos: JSON, CSV\nFiltros: ano, uf, regiao, renda');
}

/* ========================================
   ASSISTENTE IA - CHAT
======================================== */

/**
 * Enviar mensagem do usuário
 */
function enviarMensagem() {
    const input = document.getElementById('chatInput');
    const mensagem = input.value.trim();
    
    if (!mensagem) return;
    
    // Adicionar mensagem do usuário
    adicionarMensagem(mensagem, 'user');
    input.value = '';
    
    // Mostrar indicador de digitação
    mostrarDigitando();
    
    // Processar e responder
    setTimeout(() => {
        removerDigitando();
        const resposta = processarPergunta(mensagem);
        adicionarMensagem(resposta, 'assistant');
    }, 1000 + Math.random() * 1000);
}

/**
 * Enviar sugestão pré-definida
 */
function enviarSugestao(pergunta) {
    document.getElementById('chatInput').value = pergunta;
    enviarMensagem();
}

/**
 * Adicionar mensagem ao chat
 */
function adicionarMensagem(texto, tipo) {
    const container = document.getElementById('chatMessages');
    const agora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${tipo}`;
    
    const icone = tipo === 'assistant' ? 'fa-robot' : 'fa-user';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas ${icone}"></i>
        </div>
        <div class="message-content">
            <div class="message-text">
                ${texto}
            </div>
            <span class="message-time">${agora}</span>
        </div>
    `;
    
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

/**
 * Mostrar indicador de digitação
 */
function mostrarDigitando() {
    const container = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typingIndicator';
    typingDiv.className = 'message assistant';
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    container.appendChild(typingDiv);
    container.scrollTop = container.scrollHeight;
}

function removerDigitando() {
    const typing = document.getElementById('typingIndicator');
    if (typing) typing.remove();
}

/**
 * Processar pergunta e gerar resposta
 */
function processarPergunta(pergunta) {
    const p = pergunta.toLowerCase();
    
    // ============ PERGUNTAS SOBRE A REFORMA TRIBUTÁRIA ============
    
    // IBS - Imposto sobre Bens e Serviços
    if (p.includes('o que é o ibs') || p.includes('ibs') && (p.includes('funciona') || p.includes('o que'))) {
        return gerarRespostaIBS();
    }
    
    // CBS - Contribuição sobre Bens e Serviços
    if (p.includes('cbs') && (p.includes('o que') || p.includes('funciona'))) {
        return gerarRespostaCBS();
    }
    
    // Split Payment
    if (p.includes('split payment') || p.includes('pagamento dividido')) {
        return gerarRespostaSplitPayment();
    }
    
    // Cashback
    if (p.includes('cashback') || p.includes('devolução')) {
        return gerarRespostaCashback();
    }
    
    // Imposto Seletivo
    if (p.includes('imposto seletivo') || p.includes('imposto do pecado') || p.includes(' is ') && p.includes('imposto')) {
        return gerarRespostaImpostoSeletivo();
    }
    
    // Comitê Gestor
    if (p.includes('comit') || p.includes('gestor')) {
        return gerarRespostaComiteGestor();
    }
    
    // Transição
    if (p.includes('transi') && (p.includes('quando') || p.includes('começa') || p.includes('inicia') || p.includes('período'))) {
        return gerarRespostaTransicao();
    }
    
    // Não-cumulatividade
    if (p.includes('cumulativ') || p.includes('não-cumulativ') || p.includes('não cumulativ')) {
        return gerarRespostaNaoCumulatividade();
    }
    
    // Cesta Básica
    if (p.includes('cesta') || p.includes('básica') || p.includes('aliment')) {
        return gerarRespostaCestaBasica();
    }
    
    // Alíquotas
    if (p.includes('alíquota') || p.includes('aliquota') || p.includes('reduzida')) {
        return gerarRespostaAliquotas();
    }
    
    // EC 132/2023
    if (p.includes('ec 132') || p.includes('emenda') || p.includes('constitucion')) {
        return gerarRespostaEC132();
    }
    
    // ============ PERGUNTAS SOBRE DADOS E UFs ============
    
    // Buscar dados de UF específica
    const ufMatch = p.match(/\b(ac|al|am|ap|ba|ce|df|es|go|ma|mg|ms|mt|pa|pb|pe|pi|pr|rj|rn|ro|rr|rs|sc|se|sp|to)\b/i);
    if (ufMatch) {
        const uf = ufMatch[1].toUpperCase();
        return gerarRespostaUF(uf);
    }
    
    // Perguntas sobre regiões
    if (p.includes('nordeste')) return gerarRespostaRegiao('nordeste');
    if (p.includes('sudeste')) return gerarRespostaRegiao('sudeste');
    if (p.includes('sul') && !p.includes('resultado')) return gerarRespostaRegiao('sul');
    if (p.includes('norte') && !p.includes('sul')) return gerarRespostaRegiao('norte');
    if (p.includes('centro-oeste') || p.includes('centro oeste')) return gerarRespostaRegiao('centro-oeste');
    
    // Perguntas sobre níveis de renda
    if (p.includes('baixa renda') || p.includes('municípios pobres') || p.includes('municipios pobres')) {
        return gerarRespostaRenda('baixa');
    }
    if (p.includes('alta renda') || p.includes('municípios ricos') || p.includes('municipios ricos')) {
        return gerarRespostaRenda('alta');
    }
    
    // Perguntas sobre ganhadores/perdedores
    if (p.includes('mais ganham') || p.includes('maiores ganhos') || p.includes('quem ganha')) {
        return gerarRespostaMaioresGanhos();
    }
    if (p.includes('mais perdem') || p.includes('maiores perdas') || p.includes('quem perde')) {
        return gerarRespostaMaioresPerdas();
    }
    
    // Perguntas sobre capitais
    if (p.includes('capita')) {
        return gerarRespostaCapitais();
    }
    
    // Perguntas sobre riscos
    if (p.includes('risco')) {
        return gerarRespostaRiscos();
    }
    
    // Comparações
    if (p.includes('compar') || p.includes(' vs ') || p.includes(' x ')) {
        return gerarRespostaComparacao(p);
    }
    
    // Resumo geral
    if (p.includes('resumo') || p.includes('visão geral') || p.includes('principais') || p.includes('impacto')) {
        return gerarRespostaResumo();
    }
    
    // Metodologia
    if (p.includes('metodologia') || p.includes('como funciona') || p.includes('calcula')) {
        return gerarRespostaMetodologia();
    }
    
    // Resposta padrão
    return gerarRespostaPadrao();
}

// ============ NOVAS FUNÇÕES DE RESPOSTA SOBRE A REFORMA ============

function gerarRespostaIBS() {
    return `
        <p>📋 <strong>IBS - Imposto sobre Bens e Serviços</strong></p>
        <p>O IBS é um imposto <strong>subnacional</strong> que substituirá o ICMS (estadual) e o ISS (municipal).</p>
        <ul>
            <li>⚡ <strong>Alíquota estimada:</strong> 17,7%</li>
            <li>🏛️ <strong>Gestão:</strong> Comitê Gestor do IBS (estados e municípios)</li>
            <li>🎯 <strong>Princípio:</strong> Tributação no destino (onde o bem/serviço é consumido)</li>
            <li>💳 <strong>Recolhimento:</strong> Via Split Payment automático</li>
        </ul>
        <p><strong>Características principais:</strong></p>
        <ul>
            <li>✅ Não-cumulatividade plena</li>
            <li>✅ Crédito amplo (tudo gera crédito)</li>
            <li>✅ Fim da guerra fiscal entre estados</li>
            <li>✅ Legislação única nacional</li>
        </ul>
        <p>⏰ <strong>Transição:</strong> 2026 (teste 0,1%) → 2029-2032 (graduação) → 2033 (plena)</p>
    `;
}

function gerarRespostaCBS() {
    return `
        <p>💰 <strong>CBS - Contribuição sobre Bens e Serviços</strong></p>
        <p>A CBS é uma contribuição <strong>federal</strong> que substituirá o PIS e a COFINS.</p>
        <ul>
            <li>⚡ <strong>Alíquota estimada:</strong> 8,8%</li>
            <li>🏛️ <strong>Gestão:</strong> Receita Federal do Brasil (RFB)</li>
            <li>🎯 <strong>Incidência:</strong> Sobre o valor agregado em cada etapa</li>
        </ul>
        <p><strong>Vantagens em relação ao PIS/COFINS:</strong></p>
        <ul>
            <li>✅ Sistema não-cumulativo pleno</li>
            <li>✅ Base de cálculo unificada</li>
            <li>✅ Fim das múltiplas regras setoriais</li>
            <li>✅ Direito a crédito amplo</li>
        </ul>
        <p>⏰ <strong>Transição:</strong> 2026 (teste 0,9%) → 2028 (substitui PIS/COFINS totalmente)</p>
    `;
}

function gerarRespostaSplitPayment() {
    return `
        <p>💳 <strong>Split Payment - Pagamento Dividido</strong></p>
        <p>O Split Payment é um mecanismo <strong>automático de recolhimento</strong> de impostos no momento do pagamento.</p>
        <p><strong>Como funciona:</strong></p>
        <ol>
            <li>Cliente faz pagamento (cartão, PIX, boleto)</li>
            <li>Sistema identifica automaticamente o valor do IBS/CBS</li>
            <li>O valor do imposto vai direto para o Fisco</li>
            <li>O vendedor recebe apenas o valor líquido</li>
        </ol>
        <p><strong>Benefícios:</strong></p>
        <ul>
            <li>✅ Reduz sonegação fiscal</li>
            <li>✅ Simplifica obrigações acessórias</li>
            <li>✅ Elimina discussões sobre creditamento</li>
            <li>✅ Garante arrecadação em tempo real</li>
        </ul>
        <p>⚙️ <strong>Implementação:</strong> Obrigatório para todos os meios de pagamento eletrônicos a partir de 2026.</p>
    `;
}

function gerarRespostaCashback() {
    return `
        <p>💵 <strong>Cashback Tributário</strong></p>
        <p>O Cashback é a <strong>devolução de impostos</strong> para famílias de baixa renda.</p>
        <p><strong>Quem tem direito:</strong></p>
        <ul>
            <li>👥 Famílias no CadÚnico (Cadastro Único)</li>
            <li>💰 Renda per capita até ½ salário mínimo</li>
            <li>📋 Beneficiários do Bolsa Família</li>
        </ul>
        <p><strong>Quanto é devolvido:</strong></p>
        <ul>
            <li>🔵 <strong>CBS:</strong> 100% devolvido</li>
            <li>🟢 <strong>IBS:</strong> 20% devolvido (mínimo)</li>
        </ul>
        <p><strong>Itens contemplados:</strong></p>
        <ul>
            <li>⚡ Energia elétrica</li>
            <li>🔥 Gás de cozinha (GLP)</li>
            <li>📶 Telecomunicações</li>
            <li>💧 Água e esgoto</li>
        </ul>
        <p>👥 <strong>Impacto:</strong> ~73 milhões de brasileiros beneficiados.</p>
    `;
}

function gerarRespostaImpostoSeletivo() {
    return `
        <p>🚭 <strong>IS - Imposto Seletivo</strong></p>
        <p>O Imposto Seletivo, conhecido como <strong>"Imposto do Pecado"</strong>, incide sobre produtos que causam danos à saúde ou ao meio ambiente.</p>
        <p><strong>Produtos tributados:</strong></p>
        <ul>
            <li>🚬 <strong>Cigarros e tabaco</strong></li>
            <li>🍺 <strong>Bebidas alcoólicas</strong></li>
            <li>🥤 <strong>Bebidas açucaradas</strong></li>
            <li>🚗 <strong>Veículos poluentes</strong></li>
            <li>🛢️ <strong>Petróleo e derivados</strong></li>
            <li>⛏️ <strong>Mineração</strong></li>
        </ul>
        <p><strong>Características:</strong></p>
        <ul>
            <li>⚡ Alíquotas variáveis por produto</li>
            <li>🎯 Função extrafiscal (desestimular consumo)</li>
            <li>🏛️ Competência federal</li>
            <li>💰 Receita pode ser vinculada a políticas de saúde/meio ambiente</li>
        </ul>
    `;
}

function gerarRespostaComiteGestor() {
    return `
        <p>🏛️ <strong>Comitê Gestor do IBS</strong></p>
        <p>Órgão responsável pela <strong>administração do IBS</strong>, com representantes dos estados e municípios.</p>
        <p><strong>Competências principais:</strong></p>
        <ul>
            <li>📝 Regulamentação do IBS</li>
            <li>💳 Operação do Split Payment</li>
            <li>🔄 Distribuição das receitas entre estados e municípios</li>
            <li>📊 Contencioso administrativo (julgamentos)</li>
            <li>🔍 Fiscalização e cobrança</li>
        </ul>
        <p><strong>Composição:</strong></p>
        <ul>
            <li>👔 27 representantes dos estados (1 por UF)</li>
            <li>🏙️ 27 representantes dos municípios</li>
            <li>⚖️ Deliberações por maioria absoluta</li>
        </ul>
        <p>📅 <strong>Criação:</strong> 2025 (ano preparatório para início em 2026).</p>
    `;
}

function gerarRespostaTransicao() {
    return `
        <p>📅 <strong>Período de Transição (2026-2033)</strong></p>
        <p>A reforma será implementada <strong>gradualmente</strong> para evitar choques na arrecadação.</p>
        <p><strong>Cronograma:</strong></p>
        <table style="width:100%; border-collapse: collapse; margin: 1rem 0;">
            <tr style="background:#f5f5f5;"><th style="padding:0.5rem;">Ano</th><th style="padding:0.5rem;">CBS</th><th style="padding:0.5rem;">IBS</th><th style="padding:0.5rem;">PIS/COFINS/ICMS/ISS</th></tr>
            <tr><td style="padding:0.5rem; text-align:center;">2026-2027</td><td style="padding:0.5rem; text-align:center;">0,9%</td><td style="padding:0.5rem; text-align:center;">0,1%</td><td style="padding:0.5rem; text-align:center;">Mantidos</td></tr>
            <tr style="background:#f9f9f9;"><td style="padding:0.5rem; text-align:center;">2028</td><td style="padding:0.5rem; text-align:center;">8,8%</td><td style="padding:0.5rem; text-align:center;">0,1%</td><td style="padding:0.5rem; text-align:center;">PIS/COFINS extintos</td></tr>
            <tr><td style="padding:0.5rem; text-align:center;">2029-2032</td><td style="padding:0.5rem; text-align:center;">8,8%</td><td style="padding:0.5rem; text-align:center;">↑ 10%/ano</td><td style="padding:0.5rem; text-align:center;">ICMS/ISS ↓ 10%/ano</td></tr>
            <tr style="background:#d4edda;"><td style="padding:0.5rem; text-align:center;"><strong>2033+</strong></td><td style="padding:0.5rem; text-align:center;"><strong>8,8%</strong></td><td style="padding:0.5rem; text-align:center;"><strong>17,7%</strong></td><td style="padding:0.5rem; text-align:center;"><strong>Extintos</strong></td></tr>
        </table>
        <p>🎯 <strong>Total em 2033:</strong> 26,5% (IVA Dual)</p>
    `;
}

function gerarRespostaNaoCumulatividade() {
    return `
        <p>🔄 <strong>Não-Cumulatividade Plena</strong></p>
        <p>Um dos principais ganhos da reforma é a <strong>não-cumulatividade plena</strong> do IBS e CBS.</p>
        <p><strong>O que isso significa:</strong></p>
        <ul>
            <li>✅ Todo imposto pago nas etapas anteriores gera crédito</li>
            <li>✅ Não há "efeito cascata" (imposto sobre imposto)</li>
            <li>✅ Crédito amplo: bens, serviços, insumos, investimentos</li>
        </ul>
        <p><strong>Comparação:</strong></p>
        <table style="width:100%; border-collapse: collapse; margin: 1rem 0;">
            <tr style="background:#f5f5f5;"><th style="padding:0.5rem;">Sistema Atual</th><th style="padding:0.5rem;">Novo Sistema (IVA)</th></tr>
            <tr><td style="padding:0.5rem;">Crédito restrito</td><td style="padding:0.5rem;">Crédito amplo</td></tr>
            <tr style="background:#f9f9f9;"><td style="padding:0.5rem;">Cumulatividade parcial</td><td style="padding:0.5rem;">Não-cumulatividade plena</td></tr>
            <tr><td style="padding:0.5rem;">Múltiplas regras</td><td style="padding:0.5rem;">Regra única</td></tr>
        </table>
        <p>💡 <strong>Resultado:</strong> Redução do custo tributário e maior competitividade.</p>
    `;
}

function gerarRespostaCestaBasica() {
    return `
        <p>🛒 <strong>Cesta Básica Nacional</strong></p>
        <p>A reforma cria a <strong>Cesta Básica Nacional de Alimentos</strong> com <strong>alíquota zero</strong>.</p>
        <p><strong>Itens com alíquota zero:</strong></p>
        <ul>
            <li>🍚 Arroz, feijão, farinhas</li>
            <li>🍞 Pães franceses</li>
            <li>🥛 Leite em pó, líquido e fórmulas infantis</li>
            <li>🧈 Manteiga, margarina</li>
            <li>🥚 Ovos</li>
            <li>🥩 Carnes (bovina, suína, aves, peixes)</li>
            <li>🥬 Legumes, verduras e frutas</li>
            <li>☕ Café, açúcar</li>
            <li>🫒 Óleo de soja</li>
        </ul>
        <p><strong>Impacto:</strong></p>
        <ul>
            <li>💰 Redução do preço final dos alimentos</li>
            <li>👥 Beneficia especialmente famílias de baixa renda</li>
            <li>📉 Estimativa de redução de até 15% no custo da cesta básica</li>
        </ul>
    `;
}

function gerarRespostaAliquotas() {
    return `
        <p>📊 <strong>Alíquotas do IVA Dual</strong></p>
        <p><strong>Alíquota padrão (referência):</strong></p>
        <ul>
            <li>🔵 <strong>CBS:</strong> 8,8%</li>
            <li>🟢 <strong>IBS:</strong> 17,7%</li>
            <li>⚡ <strong>Total:</strong> 26,5%</li>
        </ul>
        <p><strong>Alíquotas reduzidas (60% de redução):</strong></p>
        <ul>
            <li>🏥 Saúde e medicamentos</li>
            <li>📚 Educação</li>
            <li>🚌 Transporte público</li>
            <li>🌾 Produtos agropecuários</li>
            <li>🎭 Cultura e eventos</li>
        </ul>
        <p><strong>Alíquota zero:</strong></p>
        <ul>
            <li>🛒 Cesta Básica Nacional</li>
            <li>💊 Medicamentos essenciais</li>
            <li>🧑‍🦽 Produtos para PcD</li>
        </ul>
        <p><strong>Isenções:</strong> Exportações, operações internas da administração pública.</p>
    `;
}

function gerarRespostaEC132() {
    return `
        <p>📜 <strong>EC 132/2023 - Reforma Tributária</strong></p>
        <p>A <strong>Emenda Constitucional 132/2023</strong> foi promulgada em <strong>20/12/2023</strong> e representa a maior reforma tributária da história do Brasil.</p>
        <p><strong>Principais mudanças:</strong></p>
        <ul>
            <li>🔄 Substitui 5 tributos (PIS, COFINS, IPI, ICMS, ISS) por 3 (CBS, IBS, IS)</li>
            <li>🎯 Tributação no destino (onde se consome)</li>
            <li>💳 Split Payment obrigatório</li>
            <li>💵 Cashback para baixa renda</li>
            <li>🛒 Cesta Básica com alíquota zero</li>
        </ul>
        <p><strong>Regulamentação:</strong></p>
        <ul>
            <li>📋 LC 214/2025 - Regras do IBS/CBS</li>
            <li>🏛️ Comitê Gestor do IBS</li>
        </ul>
        <p><strong>Links oficiais:</strong></p>
        <ul>
            <li><a href="https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc132.htm" target="_blank">EC 132/2023</a></li>
            <li><a href="https://www.gov.br/fazenda/pt-br/acesso-a-informacao/acoes-e-programas/reforma-tributaria" target="_blank">Portal da Reforma (MF)</a></li>
        </ul>
    `;
}

/**
 * Gerar resposta sobre UF específica
 */
function gerarRespostaUF(uf) {
    const dados = DADOS_UF.find(d => d.uf === uf);
    const info = UF_INFO[uf];
    const rendaInfo = DADOS_RENDA_UF.find(d => d.uf === uf);
    
    if (!dados) return `<p>Desculpe, não encontrei dados para a UF "${uf}".</p>`;
    
    const saldo = dados.ganhos + dados.perdas;
    const status = saldo >= 0 ? 'ganhador líquido' : 'perdedor líquido';
    const statusClass = saldo >= 0 ? 'positivo' : 'negativo';
    
    let html = `<p>📍 <strong>${info?.nome || uf}</strong> - Região ${info?.regiao || dados.regiao}</p>`;
    html += `<p>Com a reforma tributária, ${info?.nome || uf} é um <strong>${status}</strong>.</p>`;
    html += `<ul>`;
    html += `<li>💰 <strong>Ganhos:</strong> R$ ${formatarNumero(dados.ganhos)} milhões</li>`;
    html += `<li>📉 <strong>Perdas:</strong> R$ ${formatarNumero(Math.abs(dados.perdas))} milhões</li>`;
    html += `<li>📊 <strong>Saldo:</strong> ${saldo >= 0 ? '+' : ''}R$ ${formatarNumero(saldo)} milhões</li>`;
    html += `<li>🏘️ <strong>Municípios:</strong> ${dados.totalMun} (${dados.ganhadores} ganhadores, ${dados.perdedores} perdedores)</li>`;
    html += `<li>✅ <strong>% Ganhadores:</strong> ${dados.percentGanhadores}%</li>`;
    html += `</ul>`;
    
    if (rendaInfo) {
        html += `<p>📈 <strong>Nível de Renda:</strong> ${rendaInfo.renda} (PIBpc: R$ ${formatarNumero(rendaInfo.pibpc)})</p>`;
    }
    
    const risco = calcularRisco(dados);
    const riscoTexto = { critical: 'CRÍTICO', high: 'ALTO', medium: 'MÉDIO', low: 'BAIXO' }[risco];
    html += `<p>⚠️ <strong>Nível de Risco Fiscal:</strong> ${riscoTexto}</p>`;
    
    return html;
}

/**
 * Gerar resposta sobre região
 */
function gerarRespostaRegiao(regiao) {
    const ufsRegiao = DADOS_UF.filter(d => d.regiao === regiao);
    const totalGanhos = ufsRegiao.reduce((acc, d) => acc + d.ganhos, 0);
    const totalPerdas = ufsRegiao.reduce((acc, d) => acc + d.perdas, 0);
    const totalMun = ufsRegiao.reduce((acc, d) => acc + d.totalMun, 0);
    const totalGanhadores = ufsRegiao.reduce((acc, d) => acc + d.ganhadores, 0);
    const saldo = totalGanhos + totalPerdas;
    
    const nomeRegiao = regiao.charAt(0).toUpperCase() + regiao.slice(1);
    
    let html = `<p>🗺️ <strong>Região ${nomeRegiao}</strong></p>`;
    html += `<p>A região ${nomeRegiao} possui ${ufsRegiao.length} estados e ${formatarNumero(totalMun)} municípios.</p>`;
    html += `<ul>`;
    html += `<li>💰 <strong>Ganhos totais:</strong> R$ ${formatarNumero(totalGanhos)} milhões</li>`;
    html += `<li>📉 <strong>Perdas totais:</strong> R$ ${formatarNumero(Math.abs(totalPerdas))} milhões</li>`;
    html += `<li>📊 <strong>Saldo:</strong> ${saldo >= 0 ? '+' : ''}R$ ${formatarNumero(saldo)} milhões</li>`;
    html += `<li>✅ <strong>Municípios ganhadores:</strong> ${formatarNumero(totalGanhadores)} (${Math.round(totalGanhadores/totalMun*100)}%)</li>`;
    html += `</ul>`;
    html += `<p><strong>Estados:</strong> ${ufsRegiao.map(d => d.uf).join(', ')}</p>`;
    
    return html;
}

/**
 * Gerar resposta sobre nível de renda
 */
function gerarRespostaRenda(nivel) {
    const totais = TOTAIS_RENDA[nivel];
    const ufs = DADOS_RENDA_UF.filter(d => d.renda.toLowerCase() === nivel);
    
    const nomeNivel = nivel.charAt(0).toUpperCase() + nivel.slice(1);
    const impacto = totais.saldo >= 0 ? 'beneficiados' : 'prejudicados';
    
    let html = `<p>💰 <strong>Municípios de ${nomeNivel} Renda</strong></p>`;
    html += `<p>Os municípios de ${nivel} renda são <strong>${impacto}</strong> pela reforma tributária.</p>`;
    html += `<ul>`;
    html += `<li>📊 <strong>PIBpc médio:</strong> R$ ${formatarNumero(totais.pibpcMedio)}</li>`;
    html += `<li>📈 <strong>Receita pré-reforma:</strong> R$ ${formatarNumero(totais.preReforma)} milhões</li>`;
    html += `<li>📉 <strong>Receita pós-reforma:</strong> R$ ${formatarNumero(totais.posReforma)} milhões</li>`;
    html += `<li>💵 <strong>Saldo:</strong> ${totais.saldo >= 0 ? '+' : ''}R$ ${formatarNumero(totais.saldo)} milhões</li>`;
    html += `</ul>`;
    html += `<p><strong>Estados nesta categoria:</strong> ${ufs.map(d => d.uf).join(', ')}</p>`;
    
    return html;
}

/**
 * Gerar resposta sobre maiores ganhos
 */
function gerarRespostaMaioresGanhos() {
    const top5 = [...DADOS_UF].sort((a, b) => b.ganhos - a.ganhos).slice(0, 5);
    
    let html = `<p>🏆 <strong>Estados com Maiores Ganhos</strong></p>`;
    html += `<p>Os 5 estados que mais ganham com a reforma:</p>`;
    html += `<ol>`;
    top5.forEach((d, i) => {
        html += `<li><strong>${UF_INFO[d.uf]?.nome || d.uf}:</strong> +R$ ${formatarNumero(d.ganhos)} milhões</li>`;
    });
    html += `</ol>`;
    html += `<p>💡 Esses estados concentram a maior parte dos municípios beneficiados pela redistribuição tributária.</p>`;
    
    return html;
}

/**
 * Gerar resposta sobre maiores perdas
 */
function gerarRespostaMaioresPerdas() {
    const top5 = [...DADOS_UF].sort((a, b) => a.perdas - b.perdas).slice(0, 5);
    
    let html = `<p>⚠️ <strong>Estados com Maiores Perdas</strong></p>`;
    html += `<p>Os 5 estados com maiores perdas projetadas:</p>`;
    html += `<ol>`;
    top5.forEach((d, i) => {
        html += `<li><strong>${UF_INFO[d.uf]?.nome || d.uf}:</strong> R$ ${formatarNumero(Math.abs(d.perdas))} milhões</li>`;
    });
    html += `</ol>`;
    html += `<p>⚡ São Paulo concentra 58% de todas as perdas projetadas.</p>`;
    
    return html;
}

/**
 * Gerar resposta sobre capitais
 */
function gerarRespostaCapitais() {
    const dados = TOTAIS_UF.capitais;
    
    let html = `<p>🏛️ <strong>Impacto nas Capitais</strong></p>`;
    html += `<p>Das 27 capitais brasileiras:</p>`;
    html += `<ul>`;
    html += `<li>✅ <strong>${dados.ganhadores} capitais</strong> são ganhadoras (${dados.percentGanhadores}%)</li>`;
    html += `<li>❌ <strong>${dados.perdedores} capitais</strong> são perdedoras (${100-dados.percentGanhadores}%)</li>`;
    html += `<li>💰 <strong>Ganhos totais:</strong> R$ ${formatarNumero(dados.ganhos)} milhões</li>`;
    html += `<li>📉 <strong>Perdas totais:</strong> R$ ${formatarNumero(Math.abs(dados.perdas))} milhões</li>`;
    html += `</ul>`;
    html += `<p>⚠️ As capitais representam um <strong>ponto de atenção</strong> na transição, com risco fiscal elevado devido à concentração de perdas.</p>`;
    
    return html;
}

/**
 * Gerar resposta sobre riscos
 */
function gerarRespostaRiscos() {
    const criticos = DADOS_UF.filter(d => calcularRisco(d) === 'critical' || calcularRisco(d) === 'high');
    
    let html = `<p>⚠️ <strong>Análise de Riscos Fiscais</strong></p>`;
    html += `<p>Principais riscos identificados na transição tributária:</p>`;
    html += `<ul>`;
    html += `<li>🔴 <strong>Risco de Concentração:</strong> 5 UFs concentram 67% das perdas</li>`;
    html += `<li>🟠 <strong>Risco Capitais:</strong> 41% das capitais são perdedoras</li>`;
    html += `<li>🟡 <strong>Risco Populacional:</strong> Municípios >80k hab: 72% ganhadores</li>`;
    html += `<li>🟢 <strong>Municípios Pequenos:</strong> PIBpc<25k: 98% beneficiados</li>`;
    html += `</ul>`;
    html += `<p><strong>Estados em situação crítica/alta:</strong> ${criticos.map(d => d.uf).join(', ')}</p>`;
    
    return html;
}

/**
 * Gerar resposta de comparação
 */
function gerarRespostaComparacao(pergunta) {
    // Tentar encontrar duas UFs na pergunta
    const ufs = pergunta.match(/\b(ac|al|am|ap|ba|ce|df|es|go|ma|mg|ms|mt|pa|pb|pe|pi|pr|rj|rn|ro|rr|rs|sc|se|sp|to)\b/gi);
    
    if (ufs && ufs.length >= 2) {
        const uf1 = ufs[0].toUpperCase();
        const uf2 = ufs[1].toUpperCase();
        const d1 = DADOS_UF.find(d => d.uf === uf1);
        const d2 = DADOS_UF.find(d => d.uf === uf2);
        
        if (d1 && d2) {
            let html = `<p>⚖️ <strong>Comparação: ${UF_INFO[uf1]?.nome} vs ${UF_INFO[uf2]?.nome}</strong></p>`;
            html += `<table style="width:100%; border-collapse: collapse; margin: 1rem 0;">`;
            html += `<tr style="background:#f5f5f5;"><th style="padding:0.5rem; text-align:left;">Indicador</th><th style="padding:0.5rem;">${uf1}</th><th style="padding:0.5rem;">${uf2}</th></tr>`;
            html += `<tr><td style="padding:0.5rem;">Ganhos</td><td style="padding:0.5rem; text-align:center;">R$ ${formatarNumero(d1.ganhos)} mi</td><td style="padding:0.5rem; text-align:center;">R$ ${formatarNumero(d2.ganhos)} mi</td></tr>`;
            html += `<tr style="background:#f9f9f9;"><td style="padding:0.5rem;">Perdas</td><td style="padding:0.5rem; text-align:center;">R$ ${formatarNumero(Math.abs(d1.perdas))} mi</td><td style="padding:0.5rem; text-align:center;">R$ ${formatarNumero(Math.abs(d2.perdas))} mi</td></tr>`;
            html += `<tr><td style="padding:0.5rem;">% Ganhadores</td><td style="padding:0.5rem; text-align:center;">${d1.percentGanhadores}%</td><td style="padding:0.5rem; text-align:center;">${d2.percentGanhadores}%</td></tr>`;
            html += `<tr style="background:#f9f9f9;"><td style="padding:0.5rem;">Municípios</td><td style="padding:0.5rem; text-align:center;">${d1.totalMun}</td><td style="padding:0.5rem; text-align:center;">${d2.totalMun}</td></tr>`;
            html += `</table>`;
            return html;
        }
    }
    
    return `<p>Para fazer uma comparação, mencione duas UFs ou regiões. Por exemplo: "Compare SP e MG" ou "Nordeste vs Sudeste".</p>`;
}

/**
 * Gerar resumo geral
 */
function gerarRespostaResumo() {
    const t = TOTAIS_UF.total;
    
    let html = `<p>📊 <strong>Resumo da Reforma Tributária</strong></p>`;
    html += `<p>Principais números da EC 132/2023:</p>`;
    html += `<ul>`;
    html += `<li>🏘️ <strong>${formatarNumero(t.totalMun)} municípios</strong> analisados</li>`;
    html += `<li>✅ <strong>${formatarNumero(t.ganhadores)}</strong> municípios ganhadores (${t.percentGanhadores}%)</li>`;
    html += `<li>❌ <strong>${formatarNumero(t.perdedores)}</strong> municípios perdedores (${100-t.percentGanhadores}%)</li>`;
    html += `<li>💰 <strong>R$ ${formatarNumero(t.ganhos/1000)} bi</strong> em ganhos totais</li>`;
    html += `<li>📉 <strong>R$ ${formatarNumero(Math.abs(t.perdas)/1000)} bi</strong> em perdas totais</li>`;
    html += `</ul>`;
    html += `<p><strong>Impacto por renda:</strong></p>`;
    html += `<ul>`;
    html += `<li>🟢 <strong>Baixa renda:</strong> +R$ 22,6 bi (beneficiados)</li>`;
    html += `<li>🟡 <strong>Média renda:</strong> -R$ 9,2 bi</li>`;
    html += `<li>🔴 <strong>Alta renda:</strong> -R$ 13,4 bi</li>`;
    html += `</ul>`;
    
    return html;
}

/**
 * Gerar resposta sobre metodologia
 */
function gerarRespostaMetodologia() {
    let html = `<p>📐 <strong>Metodologia do Observatório</strong></p>`;
    html += `<p>O Observatório utiliza metodologia inspirada no <strong>Fiscal Transparency Code do FMI</strong>:</p>`;
    html += `<ul>`;
    html += `<li><strong>Índice de Risco Fiscal (IRF):</strong> Baseado no % de perdedores e ratio perdas/ganhos</li>`;
    html += `<li><strong>Classificação de Renda:</strong> PIBpc < 25k (Baixa), 25-40k (Média), > 40k (Alta)</li>`;
    html += `<li><strong>Níveis de Risco:</strong> Crítico, Alto, Médio e Baixo</li>`;
    html += `</ul>`;
    html += `<p><strong>Fontes de dados:</strong> Simulações baseadas em estruturas do SIOP e projeções da reforma (EC 132/2023).</p>`;
    html += `<p>⚠️ <em>Nota: Os dados apresentados são simulados para fins de demonstração.</em></p>`;
    
    return html;
}

/**
 * Resposta padrão
 */
function gerarRespostaPadrao() {
    return `
        <p>Entendi sua pergunta! Posso ajudá-lo com informações sobre:</p>
        <p><strong>📋 Reforma Tributária:</strong></p>
        <ul>
            <li><strong>IBS/CBS:</strong> "O que é o IBS e como funciona?"</li>
            <li><strong>Split Payment:</strong> "O que é Split Payment?"</li>
            <li><strong>Cashback:</strong> "Como funciona o Cashback?"</li>
            <li><strong>Imposto Seletivo:</strong> "O que é o Imposto do Pecado?"</li>
            <li><strong>Transição:</strong> "Quando começa a transição?"</li>
            <li><strong>Alíquotas:</strong> "Quais são as alíquotas?"</li>
            <li><strong>Cesta Básica:</strong> "O que muda na cesta básica?"</li>
        </ul>
        <p><strong>📊 Impactos por UF:</strong></p>
        <ul>
            <li>📍 <strong>Estados:</strong> "Qual o impacto em SP?" ou "Dados do Ceará"</li>
            <li>🗺️ <strong>Regiões:</strong> "Como fica o Nordeste?"</li>
            <li>🏆 <strong>Rankings:</strong> "Quem mais ganha?" ou "Maiores perdas"</li>
            <li>⚖️ <strong>Comparações:</strong> "Compare SP e MG"</li>
        </ul>
        <p>Clique em uma das perguntas sugeridas ou digite sua dúvida!</p>
    `;
}

console.log('⚙️ Observatório - Script principal carregado');
console.log('🤖 Assistente IA - Módulo de chat carregado');
