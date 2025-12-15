/**
 * EcoPublic - Módulo de Análise Inteligente
 * Algoritmo de detecção de ineficiência e geração de recomendações
 */

/**
 * Gerar análise completa baseada nos dados filtrados
 */
function gerarAnaliseInteligente() {
    const dados = DADOS_FILTRADOS;
    const totais = calcularTotais(dados);

    // Gerar alertas críticos
    gerarAlertasCriticos(dados);

    // Gerar recomendações
    gerarRecomendacoes(dados, totais);

    // Calcular economia potencial
    calcularEconomiaPotencial(dados, totais);
}

/**
 * Gerar alertas para programas em situação crítica
 */
function gerarAlertasCriticos(dados) {
    const container = document.getElementById('alertasCriticos');
    if (!container) return;

    const criticos = dados
        .filter(p => p.nivelAlerta === 'critico')
        .sort((a, b) => a.indiceEficiencia - b.indiceEficiencia);

    if (criticos.length === 0) {
        container.innerHTML = `
            <div class="alert-item success">
                <i class="fas fa-check-circle"></i>
                <div>
                    <strong>Nenhum programa em situação crítica</strong>
                    <p>Todos os programas filtrados estão dentro dos parâmetros aceitáveis de eficiência.</p>
                </div>
            </div>
        `;
        return;
    }

    let html = '';
    criticos.slice(0, 5).forEach((p, index) => {
        const diasEstimados = Math.round((100 - p.metaFisica) / 2);
        html += `
            <div class="alert-item critical">
                <div class="alert-rank">${index + 1}º</div>
                <div class="alert-content">
                    <strong>${p.nome}</strong>
                    <p class="alert-ministry">${p.ministerioNome}</p>
                    <div class="alert-metrics">
                        <span><i class="fas fa-money-bill"></i> ${formatarMoeda(p.empenhado)}</span>
                        <span><i class="fas fa-percentage"></i> Exec. Fin.: ${p.execucaoFinanceira.toFixed(1)}%</span>
                        <span><i class="fas fa-bullseye"></i> Meta Física: ${p.metaFisica}%</span>
                    </div>
                    <div class="alert-analysis">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>Índice de Eficiência: <strong>${p.indiceEficiencia.toFixed(3)}</strong> - 
                        Gasto de ${formatarMoeda(p.liquidado)} com apenas ${p.metaFisica}% de entrega física.</span>
                    </div>
                </div>
            </div>
        `;
    });

    if (criticos.length > 5) {
        html += `
            <div class="alert-more">
                <i class="fas fa-info-circle"></i>
                E mais ${criticos.length - 5} programa(s) em situação crítica.
            </div>
        `;
    }

    container.innerHTML = html;
}

/**
 * Gerar recomendações de otimização
 */
function gerarRecomendacoes(dados, totais) {
    const container = document.getElementById('recomendacoes');
    if (!container) return;

    const recomendacoes = [];

    // 1. Análise de programas com alta execução financeira e baixa física
    const altaFinBaixaFis = dados.filter(p => 
        p.execucaoFinanceira > 80 && p.metaFisica < 40
    );
    
    if (altaFinBaixaFis.length > 0) {
        const valorTotal = altaFinBaixaFis.reduce((acc, p) => acc + p.empenhado, 0);
        recomendacoes.push({
            tipo: 'critical',
            icone: 'fas fa-pause-circle',
            titulo: 'Suspender novos empenhos',
            descricao: `${altaFinBaixaFis.length} programa(s) com execução financeira acima de 80% mas entrega física abaixo de 40%.`,
            acao: `Recomenda-se suspender novos empenhos até regularização da execução física. Valor envolvido: ${formatarMoeda(valorTotal)}.`,
            programas: altaFinBaixaFis.map(p => p.nome)
        });
    }

    // 2. Programas com execução estagnada
    const estagnados = dados.filter(p => 
        p.execucaoFinanceira > 60 && p.metaFisica < 30
    );
    
    if (estagnados.length > 0) {
        recomendacoes.push({
            tipo: 'warning',
            icone: 'fas fa-search',
            titulo: 'Auditoria de processos recomendada',
            descricao: `${estagnados.length} programa(s) apresentam possível estagnação operacional.`,
            acao: 'Sugere-se auditoria nos processos de aquisição e contratação para identificar gargalos.',
            programas: estagnados.map(p => p.nome)
        });
    }

    // 3. Ministérios com desempenho abaixo da média
    const grupos = agruparPorMinisterio(dados);
    const ministeriosProblematicos = Object.values(grupos).filter(m => 
        m.metaFisicaMedia < 50 && m.empenhado > 1000000000
    );

    if (ministeriosProblematicos.length > 0) {
        recomendacoes.push({
            tipo: 'attention',
            icone: 'fas fa-building',
            titulo: 'Revisão ministerial',
            descricao: `${ministeriosProblematicos.length} ministério(s) com meta física média abaixo de 50%.`,
            acao: 'Recomenda-se revisão da capacidade de execução e possível remanejamento de recursos.',
            programas: ministeriosProblematicos.map(m => m.nome)
        });
    }

    // 4. Oportunidade de remanejamento
    const eficientes = dados.filter(p => p.nivelAlerta === 'normal' && p.metaFisica > 85);
    const ineficientes = dados.filter(p => p.nivelAlerta === 'critico');
    
    if (eficientes.length > 0 && ineficientes.length > 0) {
        const valorRemanejar = ineficientes.reduce((acc, p) => acc + p.gastoIneficiente, 0);
        recomendacoes.push({
            tipo: 'success',
            icone: 'fas fa-exchange-alt',
            titulo: 'Oportunidade de remanejamento',
            descricao: `${eficientes.length} programa(s) eficientes identificados para receber recursos.`,
            acao: `Potencial de ${formatarMoeda(valorRemanejar)} para remanejamento de programas ineficientes para programas com alta capacidade de entrega.`,
            programas: eficientes.slice(0, 3).map(p => p.nome)
        });
    }

    // 5. Alerta de concentração de riscos
    const ministerioComMaisCriticos = Object.entries(
        dados.filter(p => p.nivelAlerta === 'critico')
            .reduce((acc, p) => {
                acc[p.ministerioSigla] = (acc[p.ministerioSigla] || 0) + 1;
                return acc;
            }, {})
    ).sort((a, b) => b[1] - a[1])[0];

    if (ministerioComMaisCriticos && ministerioComMaisCriticos[1] >= 2) {
        const minInfo = MINISTERIOS.find(m => m.sigla === ministerioComMaisCriticos[0]);
        recomendacoes.push({
            tipo: 'warning',
            icone: 'fas fa-exclamation-circle',
            titulo: 'Concentração de problemas',
            descricao: `${minInfo?.nome || ministerioComMaisCriticos[0]} concentra ${ministerioComMaisCriticos[1]} programas em situação crítica.`,
            acao: 'Recomenda-se investigação de causas sistêmicas no órgão.',
            programas: []
        });
    }

    // Renderizar recomendações
    if (recomendacoes.length === 0) {
        container.innerHTML = `
            <div class="recommendation-item success">
                <div class="rec-icon"><i class="fas fa-thumbs-up"></i></div>
                <div class="rec-content">
                    <h4>Situação saudável</h4>
                    <p>Os dados filtrados não apresentam anomalias significativas que demandem intervenção imediata.</p>
                </div>
            </div>
        `;
        return;
    }

    let html = '';
    recomendacoes.forEach((rec, index) => {
        html += `
            <div class="recommendation-item ${rec.tipo}">
                <div class="rec-icon"><i class="${rec.icone}"></i></div>
                <div class="rec-content">
                    <h4>${rec.titulo}</h4>
                    <p>${rec.descricao}</p>
                    <p class="rec-action"><strong>Ação recomendada:</strong> ${rec.acao}</p>
                    ${rec.programas.length > 0 ? `
                        <details class="rec-programs">
                            <summary>Ver programas relacionados (${rec.programas.length})</summary>
                            <ul>
                                ${rec.programas.map(p => `<li>${p}</li>`).join('')}
                            </ul>
                        </details>
                    ` : ''}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

/**
 * Calcular economia potencial
 */
function calcularEconomiaPotencial(dados, totais) {
    const container = document.getElementById('economiaPotencial');
    if (!container) return;

    // Calcular diferentes cenários de economia
    const economiaConservadora = totais.gastoIneficienteTotal * 0.3;
    const economiaModerada = totais.gastoIneficienteTotal * 0.5;
    const economiaOtimista = totais.gastoIneficienteTotal * 0.7;

    // Programas críticos
    const criticos = dados.filter(p => p.nivelAlerta === 'critico');
    const valorCriticos = criticos.reduce((acc, p) => acc + p.empenhado, 0);
    const potencialCriticos = criticos.reduce((acc, p) => acc + p.gastoIneficiente, 0);

    // Percentual do orçamento
    const percentualAfetado = (valorCriticos / totais.totalEmpenhado * 100) || 0;

    const html = `
        <div class="savings-summary">
            <div class="savings-main">
                <span class="savings-label">Economia Potencial Estimada</span>
                <span class="savings-value">${formatarMoeda(economiaModerada)}</span>
                <span class="savings-note">Cenário moderado de otimização</span>
            </div>
        </div>

        <div class="savings-scenarios">
            <h4><i class="fas fa-chart-line"></i> Cenários de Otimização</h4>
            
            <div class="scenario-item">
                <div class="scenario-header">
                    <span class="scenario-name">🟢 Conservador</span>
                    <span class="scenario-value">${formatarMoeda(economiaConservadora)}</span>
                </div>
                <div class="scenario-bar">
                    <div class="scenario-fill" style="width: 30%; background: #168821;"></div>
                </div>
                <p class="scenario-desc">Otimização de 30% do gasto ineficiente identificado</p>
            </div>

            <div class="scenario-item">
                <div class="scenario-header">
                    <span class="scenario-name">🟡 Moderado</span>
                    <span class="scenario-value">${formatarMoeda(economiaModerada)}</span>
                </div>
                <div class="scenario-bar">
                    <div class="scenario-fill" style="width: 50%; background: #FFCD07;"></div>
                </div>
                <p class="scenario-desc">Otimização de 50% do gasto ineficiente identificado</p>
            </div>

            <div class="scenario-item">
                <div class="scenario-header">
                    <span class="scenario-name">🔴 Otimista</span>
                    <span class="scenario-value">${formatarMoeda(economiaOtimista)}</span>
                </div>
                <div class="scenario-bar">
                    <div class="scenario-fill" style="width: 70%; background: #E52207;"></div>
                </div>
                <p class="scenario-desc">Otimização de 70% do gasto ineficiente identificado</p>
            </div>
        </div>

        <div class="savings-impact">
            <h4><i class="fas fa-info-circle"></i> Impacto Identificado</h4>
            <div class="impact-grid">
                <div class="impact-item">
                    <span class="impact-value">${criticos.length}</span>
                    <span class="impact-label">Programas Críticos</span>
                </div>
                <div class="impact-item">
                    <span class="impact-value">${formatarMoeda(valorCriticos)}</span>
                    <span class="impact-label">Valor Envolvido</span>
                </div>
                <div class="impact-item">
                    <span class="impact-value">${percentualAfetado.toFixed(1)}%</span>
                    <span class="impact-label">do Orçamento Filtrado</span>
                </div>
            </div>
        </div>

        <div class="savings-disclaimer">
            <i class="fas fa-exclamation-triangle"></i>
            <p><strong>Nota:</strong> Estimativas baseadas em algoritmo de detecção de ineficiência. 
            Valores reais dependem de análise detalhada de cada programa e fatores externos 
            não contemplados nesta modelagem.</p>
        </div>
    `;

    container.innerHTML = html;
}

/**
 * Gerar texto de sugestão de IA para cortes
 */
function gerarTextoSugestaoIA() {
    const dados = DADOS_FILTRADOS;
    const criticos = dados.filter(p => p.nivelAlerta === 'critico')
        .sort((a, b) => a.indiceEficiencia - b.indiceEficiencia);

    if (criticos.length === 0) {
        return "Não foram identificados programas com necessidade urgente de revisão orçamentária.";
    }

    let texto = "🤖 ANÁLISE AUTOMATIZADA DE EFICIÊNCIA ORÇAMENTÁRIA\n\n";
    texto += "Com base na análise dos indicadores de execução física versus financeira, ";
    texto += `foram identificados ${criticos.length} programa(s) que demandam atenção imediata:\n\n`;

    criticos.slice(0, 3).forEach((p, i) => {
        texto += `${i + 1}. ${p.nome} (${p.ministerioSigla})\n`;
        texto += `   • Situação: Execução financeira de ${p.execucaoFinanceira.toFixed(1)}% com apenas ${p.metaFisica}% de meta física\n`;
        texto += `   • Valor empenhado: ${formatarMoeda(p.empenhado)}\n`;
        texto += `   • Recomendação: Suspender novos empenhos e realizar auditoria operacional\n\n`;
    });

    texto += "AÇÕES RECOMENDADAS:\n";
    texto += "1. Convocar gestores dos programas críticos para prestação de contas\n";
    texto += "2. Avaliar remanejamento de recursos para programas com melhor desempenho\n";
    texto += "3. Implementar monitoramento mensal de execução física\n";

    return texto;
}

console.log('🧠 EcoPublic - Módulo de análise inteligente carregado');
