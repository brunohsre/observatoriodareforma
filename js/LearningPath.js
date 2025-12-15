/**
 * LearningPath.js
 * Componente: "Trilha de Aprendizagem" (Gamificação)
 * Sistema educacional gamificado sobre a reforma tributária
 * 
 * @author Observatório da Reforma Tributária Brasileira
 * @version 1.0.0
 * @license MIT
 */

const LearningPath = (function() {
    'use strict';

    // =========================================
    // ESTADO DO COMPONENTE
    // =========================================
    let state = {
        currentLevel: 'cidadao',
        completedModules: JSON.parse(localStorage.getItem('learningPath_completed') || '[]'),
        quizScores: JSON.parse(localStorage.getItem('learningPath_scores') || '{}'),
        totalPoints: parseInt(localStorage.getItem('learningPath_points') || '0'),
        badges: JSON.parse(localStorage.getItem('learningPath_badges') || '[]')
    };

    // =========================================
    // NÍVEIS E CONTEÚDO
    // =========================================
    const LEVELS = {
        cidadao: {
            id: 'cidadao',
            nome: 'Cidadão',
            descricao: 'Entenda como a reforma afeta seu dia a dia',
            icone: 'fa-user',
            cor: '#48bb78',
            corLight: '#c6f6d5',
            pontos: 100,
            badge: 'Cidadão Informado',
            modulos: [
                {
                    id: 'cashback',
                    titulo: 'Cashback Tributário',
                    descricao: 'Devolução de impostos para famílias de baixa renda',
                    icone: 'fa-hand-holding-usd',
                    duracao: '5 min',
                    pontos: 25,
                    conteudo: {
                        titulo: 'O que é o Cashback Tributário?',
                        texto: `
                            <p>O <strong>Cashback Tributário</strong> é um mecanismo inovador da reforma tributária brasileira que devolve parte dos impostos pagos por famílias de baixa renda.</p>
                            
                            <h4><i class="fas fa-users"></i> Quem tem direito?</h4>
                            <ul>
                                <li>Famílias inscritas no <strong>CadÚnico</strong> (Cadastro Único)</li>
                                <li>Renda familiar per capita de até meio salário mínimo</li>
                                <li>Beneficiários do Bolsa Família</li>
                            </ul>
                            
                            <h4><i class="fas fa-percentage"></i> Quanto é devolvido?</h4>
                            <div class="info-box">
                                <div class="info-item">
                                    <span class="info-label">CBS (Federal)</span>
                                    <span class="info-value">100% devolvido</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">IBS (Subnacional)</span>
                                    <span class="info-value">20% devolvido</span>
                                </div>
                            </div>
                            
                            <h4><i class="fas fa-list"></i> Para quais itens?</h4>
                            <ul class="item-list">
                                <li><i class="fas fa-bolt"></i> Energia elétrica</li>
                                <li><i class="fas fa-fire"></i> Gás de cozinha (GLP)</li>
                                <li><i class="fas fa-wifi"></i> Telecomunicações</li>
                                <li><i class="fas fa-tint"></i> Água e esgoto</li>
                            </ul>
                            
                            <h4><i class="fas fa-cog"></i> Como funciona?</h4>
                            <ol>
                                <li>Você faz uma compra normalmente</li>
                                <li>O sistema identifica seu CPF no CadÚnico</li>
                                <li>O valor do cashback é calculado automaticamente</li>
                                <li>A devolução é creditada em até 30 dias</li>
                            </ol>
                            
                            <div class="destaque-box success">
                                <i class="fas fa-lightbulb"></i>
                                <p><strong>Impacto Estimado:</strong> Aproximadamente 73 milhões de brasileiros poderão ser beneficiados pelo programa de cashback.</p>
                            </div>
                        `,
                        quiz: [
                            {
                                pergunta: 'Qual é a porcentagem de CBS devolvida no Cashback?',
                                opcoes: ['50%', '75%', '100%', '20%'],
                                correta: 2
                            },
                            {
                                pergunta: 'Quem tem direito ao Cashback?',
                                opcoes: ['Todos os brasileiros', 'Apenas aposentados', 'Famílias inscritas no CadÚnico', 'Empresários'],
                                correta: 2
                            }
                        ]
                    }
                },
                {
                    id: 'cesta-basica',
                    titulo: 'Cesta Básica Nacional',
                    descricao: 'Alimentos essenciais com alíquota zero',
                    icone: 'fa-shopping-basket',
                    duracao: '4 min',
                    pontos: 25,
                    conteudo: {
                        titulo: 'Cesta Básica Nacional: Alíquota Zero',
                        texto: `
                            <p>A <strong>Cesta Básica Nacional</strong> define os alimentos essenciais que terão <strong>alíquota zero</strong> de CBS e IBS, garantindo que produtos básicos fiquem mais acessíveis.</p>
                            
                            <h4><i class="fas fa-percentage"></i> Alíquota</h4>
                            <div class="destaque-box primary">
                                <span class="big-number">0%</span>
                                <p>CBS + IBS = Alíquota Zero</p>
                            </div>
                            
                            <h4><i class="fas fa-carrot"></i> Itens da Cesta Básica</h4>
                            <div class="grid-items">
                                <div class="item"><i class="fas fa-seedling"></i> Arroz</div>
                                <div class="item"><i class="fas fa-circle"></i> Feijão</div>
                                <div class="item"><i class="fas fa-drumstick-bite"></i> Carnes</div>
                                <div class="item"><i class="fas fa-fish"></i> Peixes</div>
                                <div class="item"><i class="fas fa-glass-whiskey"></i> Leite</div>
                                <div class="item"><i class="fas fa-cheese"></i> Manteiga/Margarina</div>
                                <div class="item"><i class="fas fa-wine-bottle"></i> Óleo de soja</div>
                                <div class="item"><i class="fas fa-coffee"></i> Café</div>
                                <div class="item"><i class="fas fa-cookie"></i> Açúcar</div>
                                <div class="item"><i class="fas fa-bread-slice"></i> Farinha de trigo</div>
                                <div class="item"><i class="fas fa-bread-slice"></i> Pão francês</div>
                                <div class="item"><i class="fas fa-apple-alt"></i> Frutas</div>
                                <div class="item"><i class="fas fa-carrot"></i> Legumes e verduras</div>
                                <div class="item"><i class="fas fa-egg"></i> Ovos</div>
                                <div class="item"><i class="fas fa-leaf"></i> Raízes e tubérculos</div>
                            </div>
                            
                            <h4><i class="fas fa-calculator"></i> Impacto no Orçamento Familiar</h4>
                            <p>Com a isenção, uma família pode economizar em média <strong>R$ 150 a R$ 300 por mês</strong> em produtos básicos.</p>
                            
                            <div class="destaque-box warning">
                                <i class="fas fa-exclamation-triangle"></i>
                                <p><strong>Atenção:</strong> Produtos industrializados, mesmo que à base de itens da cesta básica, podem ter alíquotas diferenciadas.</p>
                            </div>
                        `,
                        quiz: [
                            {
                                pergunta: 'Qual é a alíquota para itens da Cesta Básica Nacional?',
                                opcoes: ['5%', '10%', '26,5%', '0%'],
                                correta: 3
                            },
                            {
                                pergunta: 'O pão francês faz parte da Cesta Básica Nacional?',
                                opcoes: ['Sim', 'Não', 'Apenas pão integral', 'Apenas pão de forma'],
                                correta: 0
                            }
                        ]
                    }
                },
                {
                    id: 'imposto-seletivo',
                    titulo: 'Imposto Seletivo (IS)',
                    descricao: 'O "Imposto do Pecado" sobre produtos nocivos',
                    icone: 'fa-ban',
                    duracao: '4 min',
                    pontos: 25,
                    conteudo: {
                        titulo: 'Imposto Seletivo: Desestímulo ao Consumo',
                        texto: `
                            <p>O <strong>Imposto Seletivo (IS)</strong>, conhecido como "Imposto do Pecado", incide sobre produtos considerados prejudiciais à saúde ou ao meio ambiente.</p>
                            
                            <h4><i class="fas fa-bullseye"></i> Objetivo</h4>
                            <p>Desestimular o consumo de produtos que causam <strong>externalidades negativas</strong> à sociedade, como problemas de saúde pública e ambientais.</p>
                            
                            <h4><i class="fas fa-list"></i> Produtos Tributados</h4>
                            <div class="product-list">
                                <div class="product-item danger">
                                    <i class="fas fa-smoking"></i>
                                    <span>Cigarros e derivados do tabaco</span>
                                    <small>Alíquota específica por unidade</small>
                                </div>
                                <div class="product-item warning">
                                    <i class="fas fa-wine-glass-alt"></i>
                                    <span>Bebidas alcoólicas</span>
                                    <small>Alíquota ad valorem + específica</small>
                                </div>
                                <div class="product-item warning">
                                    <i class="fas fa-glass-whiskey"></i>
                                    <span>Bebidas açucaradas</span>
                                    <small>Alíquota específica</small>
                                </div>
                                <div class="product-item info">
                                    <i class="fas fa-car"></i>
                                    <span>Veículos poluentes</span>
                                    <small>1% a 4%</small>
                                </div>
                                <div class="product-item info">
                                    <i class="fas fa-plane"></i>
                                    <span>Embarcações e aeronaves</span>
                                    <small>3,5%</small>
                                </div>
                                <div class="product-item info">
                                    <i class="fas fa-gem"></i>
                                    <span>Extração de minerais</span>
                                    <small>0,25% a 1%</small>
                                </div>
                            </div>
                            
                            <div class="destaque-box info">
                                <i class="fas fa-info-circle"></i>
                                <p><strong>Saiba mais:</strong> O Imposto Seletivo é de competência federal e não será partilhado com estados e municípios.</p>
                            </div>
                        `,
                        quiz: [
                            {
                                pergunta: 'Qual o objetivo principal do Imposto Seletivo?',
                                opcoes: ['Aumentar arrecadação', 'Desestimular consumo de produtos nocivos', 'Substituir o ICMS', 'Financiar a saúde'],
                                correta: 1
                            }
                        ]
                    }
                }
            ]
        },
        empresario: {
            id: 'empresario',
            nome: 'Empresário',
            descricao: 'Prepare sua empresa para as mudanças',
            icone: 'fa-briefcase',
            cor: '#4299e1',
            corLight: '#bee3f8',
            pontos: 200,
            badge: 'Empresário Preparado',
            modulos: [
                {
                    id: 'nao-cumulatividade',
                    titulo: 'Fim da Cumulatividade',
                    descricao: 'Como funciona o crédito amplo do IVA',
                    icone: 'fa-sync-alt',
                    duracao: '6 min',
                    pontos: 40,
                    conteudo: {
                        titulo: 'Não-Cumulatividade Plena',
                        texto: `
                            <p>A <strong>não-cumulatividade plena</strong> é uma das maiores conquistas da reforma tributária. Significa que todo imposto pago nas etapas anteriores pode ser creditado.</p>
                            
                            <h4><i class="fas fa-ban"></i> Sistema Atual (Cumulativo)</h4>
                            <div class="comparativo-box problema">
                                <p>Hoje, nem todos os impostos pagos geram créditos:</p>
                                <ul>
                                    <li>PIS/COFINS cumulativo: sem créditos</li>
                                    <li>ICMS: crédito limitado a mercadorias</li>
                                    <li>ISS: não permite créditos</li>
                                    <li>Imposto se acumula em cada etapa</li>
                                </ul>
                            </div>
                            
                            <h4><i class="fas fa-check"></i> Sistema Novo (IVA Dual)</h4>
                            <div class="comparativo-box solucao">
                                <p>Com o CBS e IBS:</p>
                                <ul>
                                    <li>Todo imposto pago vira crédito</li>
                                    <li>Crédito de bens E serviços</li>
                                    <li>Crédito de bens de uso e consumo</li>
                                    <li>Crédito de ativo imobilizado</li>
                                </ul>
                            </div>
                            
                            <h4><i class="fas fa-calculator"></i> Simulador Simplificado</h4>
                            <div class="simulador-simple" id="simuladorCumulatividade">
                                <div class="input-group">
                                    <label>Compras com imposto (R$):</label>
                                    <input type="number" id="valorCompras" value="10000" onchange="LearningPath.simularCumulatividade()">
                                </div>
                                <div class="input-group">
                                    <label>Vendas com imposto (R$):</label>
                                    <input type="number" id="valorVendas" value="15000" onchange="LearningPath.simularCumulatividade()">
                                </div>
                                <div class="resultado-simulador">
                                    <div class="resultado-item">
                                        <span class="label">Sistema Atual (sem crédito total)</span>
                                        <span class="valor" id="resultadoAtual">R$ 3.975,00</span>
                                    </div>
                                    <div class="resultado-item destaque">
                                        <span class="label">IVA Dual (crédito pleno)</span>
                                        <span class="valor" id="resultadoNovo">R$ 1.325,00</span>
                                    </div>
                                    <div class="resultado-economia">
                                        <span>Economia: <strong id="economiaSimulador">R$ 2.650,00</strong></span>
                                    </div>
                                </div>
                            </div>
                        `,
                        quiz: [
                            {
                                pergunta: 'No IVA Dual, serviços geram crédito tributário?',
                                opcoes: ['Não, apenas mercadorias', 'Sim, crédito pleno', 'Parcialmente', 'Depende do estado'],
                                correta: 1
                            }
                        ]
                    }
                },
                {
                    id: 'credito-financeiro',
                    titulo: 'Crédito Financeiro Amplo',
                    descricao: 'Creditamento de todas as aquisições',
                    icone: 'fa-credit-card',
                    duracao: '5 min',
                    pontos: 40,
                    conteudo: {
                        titulo: 'Crédito Financeiro: Tudo Gera Crédito',
                        texto: `
                            <p>O sistema de <strong>crédito financeiro amplo</strong> permite que praticamente todas as aquisições da empresa gerem créditos de CBS e IBS.</p>
                            
                            <h4><i class="fas fa-check-circle"></i> O que gera crédito?</h4>
                            <div class="grid-creditos">
                                <div class="credito-item">
                                    <i class="fas fa-box"></i>
                                    <span>Matéria-prima</span>
                                </div>
                                <div class="credito-item">
                                    <i class="fas fa-building"></i>
                                    <span>Imóveis</span>
                                </div>
                                <div class="credito-item">
                                    <i class="fas fa-truck"></i>
                                    <span>Transporte</span>
                                </div>
                                <div class="credito-item">
                                    <i class="fas fa-bolt"></i>
                                    <span>Energia</span>
                                </div>
                                <div class="credito-item">
                                    <i class="fas fa-wifi"></i>
                                    <span>Telecom</span>
                                </div>
                                <div class="credito-item">
                                    <i class="fas fa-laptop"></i>
                                    <span>Equipamentos</span>
                                </div>
                                <div class="credito-item">
                                    <i class="fas fa-user-tie"></i>
                                    <span>Serviços</span>
                                </div>
                                <div class="credito-item">
                                    <i class="fas fa-receipt"></i>
                                    <span>Publicidade</span>
                                </div>
                            </div>
                            
                            <h4><i class="fas fa-clock"></i> Prazo para Creditamento</h4>
                            <ul>
                                <li><strong>Bens de uso e consumo:</strong> Imediato</li>
                                <li><strong>Ativo imobilizado:</strong> Imediato (antes era 48 meses)</li>
                                <li><strong>Serviços:</strong> Imediato</li>
                            </ul>
                            
                            <div class="destaque-box success">
                                <i class="fas fa-piggy-bank"></i>
                                <p><strong>Benefício:</strong> Empresas poderão ter economia de 2% a 5% nos custos tributários com o crédito amplo.</p>
                            </div>
                        `,
                        quiz: [
                            {
                                pergunta: 'No novo sistema, ativo imobilizado gera crédito:',
                                opcoes: ['Em 48 parcelas', 'Em 12 parcelas', 'Imediatamente', 'Não gera crédito'],
                                correta: 2
                            }
                        ]
                    }
                },
                {
                    id: 'split-payment',
                    titulo: 'Split Payment',
                    descricao: 'Pagamento automático do imposto',
                    icone: 'fa-code-branch',
                    duracao: '5 min',
                    pontos: 50,
                    conteudo: {
                        titulo: 'Split Payment: Revolução na Arrecadação',
                        texto: `
                            <p>O <strong>Split Payment</strong> é um sistema automático onde o imposto é separado e recolhido no momento do pagamento.</p>
                            
                            <h4><i class="fas fa-cogs"></i> Como funciona?</h4>
                            <div class="fluxo-visual">
                                <div class="fluxo-step">
                                    <div class="step-number">1</div>
                                    <span>Cliente faz pagamento</span>
                                </div>
                                <div class="fluxo-arrow"><i class="fas fa-arrow-right"></i></div>
                                <div class="fluxo-step">
                                    <div class="step-number">2</div>
                                    <span>Sistema identifica o imposto</span>
                                </div>
                                <div class="fluxo-arrow"><i class="fas fa-arrow-right"></i></div>
                                <div class="fluxo-step">
                                    <div class="step-number">3</div>
                                    <span>Valor é dividido automaticamente</span>
                                </div>
                                <div class="fluxo-arrow"><i class="fas fa-arrow-right"></i></div>
                                <div class="fluxo-step highlight">
                                    <div class="step-number">4</div>
                                    <span>Imposto vai direto para o governo</span>
                                </div>
                            </div>
                            
                            <h4><i class="fas fa-plus"></i> Benefícios</h4>
                            <div class="beneficios-grid">
                                <div class="beneficio-card">
                                    <i class="fas fa-ban"></i>
                                    <h5>Fim da Sonegação</h5>
                                    <p>Imposto recolhido automaticamente</p>
                                </div>
                                <div class="beneficio-card">
                                    <i class="fas fa-file-invoice"></i>
                                    <h5>Menos Burocracia</h5>
                                    <p>Sem guias de recolhimento</p>
                                </div>
                                <div class="beneficio-card">
                                    <i class="fas fa-chart-line"></i>
                                    <h5>Fluxo de Caixa</h5>
                                    <p>Empresa só recebe o líquido</p>
                                </div>
                                <div class="beneficio-card">
                                    <i class="fas fa-balance-scale"></i>
                                    <h5>Concorrência Justa</h5>
                                    <p>Todos pagam igualmente</p>
                                </div>
                            </div>
                            
                            <div class="destaque-box warning">
                                <i class="fas fa-exclamation-triangle"></i>
                                <p><strong>Atenção:</strong> Prepare seu sistema de gestão para integração com o Split Payment até 2026.</p>
                            </div>
                        `,
                        quiz: [
                            {
                                pergunta: 'No Split Payment, quando o imposto é recolhido?',
                                opcoes: ['No fim do mês', 'No momento do pagamento', 'Trimestralmente', 'Anualmente'],
                                correta: 1
                            }
                        ]
                    }
                }
            ]
        },
        gestor: {
            id: 'gestor',
            nome: 'Gestor Público',
            descricao: 'Gerencie a transição no seu ente federativo',
            icone: 'fa-landmark',
            cor: '#9f7aea',
            corLight: '#e9d8fd',
            pontos: 300,
            badge: 'Gestor Especialista',
            modulos: [
                {
                    id: 'comite-gestor',
                    titulo: 'Comitê Gestor do IBS',
                    descricao: 'Estrutura e funcionamento do órgão',
                    icone: 'fa-users-cog',
                    duracao: '7 min',
                    pontos: 60,
                    conteudo: {
                        titulo: 'Comitê Gestor do IBS: Governança Subnacional',
                        texto: `
                            <p>O <strong>Comitê Gestor do IBS</strong> é um órgão colegiado responsável por administrar o Imposto sobre Bens e Serviços de competência dos estados e municípios.</p>
                            
                            <h4><i class="fas fa-sitemap"></i> Estrutura</h4>
                            <div class="estrutura-organograma">
                                <div class="org-item principal">
                                    <i class="fas fa-building"></i>
                                    <span>Comitê Gestor do IBS</span>
                                </div>
                                <div class="org-linha"></div>
                                <div class="org-subniveis">
                                    <div class="org-item">
                                        <i class="fas fa-map"></i>
                                        <span>Representação Estados (27)</span>
                                        <small>Secretários de Fazenda</small>
                                    </div>
                                    <div class="org-item">
                                        <i class="fas fa-city"></i>
                                        <span>Representação Municípios</span>
                                        <small>27 representantes regionais</small>
                                    </div>
                                </div>
                            </div>
                            
                            <h4><i class="fas fa-tasks"></i> Competências</h4>
                            <ul class="competencias-list">
                                <li><i class="fas fa-check"></i> Editar regulamento único do IBS</li>
                                <li><i class="fas fa-check"></i> Uniformizar interpretação da legislação</li>
                                <li><i class="fas fa-check"></i> Gerir a arrecadação e distribuição</li>
                                <li><i class="fas fa-check"></i> Administrar contencioso administrativo</li>
                                <li><i class="fas fa-check"></i> Definir procedimentos de fiscalização</li>
                                <li><i class="fas fa-check"></i> Coordenar o Split Payment</li>
                            </ul>
                            
                            <h4><i class="fas fa-vote-yea"></i> Decisões</h4>
                            <div class="destaque-box info">
                                <p><strong>Quórum especial:</strong> Decisões importantes exigem maioria absoluta dos estados E maioria absoluta dos municípios.</p>
                            </div>
                        `,
                        quiz: [
                            {
                                pergunta: 'O Comitê Gestor do IBS é formado por:',
                                opcoes: ['Apenas estados', 'Apenas municípios', 'União e estados', 'Estados e municípios'],
                                correta: 3
                            }
                        ]
                    }
                },
                {
                    id: 'distribuicao-receitas',
                    titulo: 'Distribuição de Receitas',
                    descricao: 'Como o IBS será partilhado',
                    icone: 'fa-chart-pie',
                    duracao: '8 min',
                    pontos: 70,
                    conteudo: {
                        titulo: 'Distribuição do IBS: Destino Tributário',
                        texto: `
                            <p>Uma das maiores inovações da reforma é o princípio do <strong>destino</strong>: o imposto vai para onde o bem ou serviço é consumido, não onde é produzido.</p>
                            
                            <h4><i class="fas fa-map-marker-alt"></i> Princípio do Destino</h4>
                            <div class="comparativo-destino">
                                <div class="modelo-box atual">
                                    <h5><i class="fas fa-times-circle"></i> Modelo Atual (Origem)</h5>
                                    <p>Imposto vai para onde o produto é fabricado</p>
                                    <small>Causa guerra fiscal entre estados</small>
                                </div>
                                <div class="modelo-box novo">
                                    <h5><i class="fas fa-check-circle"></i> Modelo Novo (Destino)</h5>
                                    <p>Imposto vai para onde o produto é consumido</p>
                                    <small>Elimina guerra fiscal</small>
                                </div>
                            </div>
                            
                            <h4><i class="fas fa-percentage"></i> Partilha do IBS</h4>
                            <div class="partilha-visual">
                                <div class="partilha-item estados">
                                    <span class="partilha-percent">~50%</span>
                                    <span class="partilha-label">Estados</span>
                                </div>
                                <div class="partilha-item municipios">
                                    <span class="partilha-percent">~50%</span>
                                    <span class="partilha-label">Municípios</span>
                                </div>
                            </div>
                            
                            <h4><i class="fas fa-shield-alt"></i> Fundo de Compensação</h4>
                            <p>Durante a transição (2029-2077), estados e municípios que perderem receita serão compensados pelo Fundo de Compensação.</p>
                            
                            <h4><i class="fas fa-hand-holding-usd"></i> Fundo de Desenvolvimento Regional</h4>
                            <table class="tabela-fundos">
                                <tr>
                                    <th>Ano</th>
                                    <th>Valor (R$ bilhões)</th>
                                </tr>
                                <tr><td>2029</td><td>8</td></tr>
                                <tr><td>2030</td><td>16</td></tr>
                                <tr><td>2031</td><td>24</td></tr>
                                <tr><td>2032</td><td>32</td></tr>
                                <tr><td>2033+</td><td>40</td></tr>
                            </table>
                        `,
                        quiz: [
                            {
                                pergunta: 'No novo sistema, o IBS vai para:',
                                opcoes: ['Onde o produto é fabricado', 'Onde o produto é consumido', 'Para a União', 'Para o estado mais rico'],
                                correta: 1
                            }
                        ]
                    }
                },
                {
                    id: 'transicao-receitas',
                    titulo: 'Gestão da Transição',
                    descricao: 'Planejamento para o período 2026-2033',
                    icone: 'fa-route',
                    duracao: '10 min',
                    pontos: 80,
                    conteudo: {
                        titulo: 'Gestão da Transição: Preparação do Ente',
                        texto: `
                            <p>O período de transição (2026-2033) exige <strong>planejamento detalhado</strong> para garantir a sustentabilidade fiscal do seu ente.</p>
                            
                            <h4><i class="fas fa-tasks"></i> Checklist de Preparação</h4>
                            <div class="checklist-transicao">
                                <div class="check-item">
                                    <input type="checkbox" id="check1">
                                    <label for="check1">Diagnóstico da receita atual (ICMS/ISS)</label>
                                </div>
                                <div class="check-item">
                                    <input type="checkbox" id="check2">
                                    <label for="check2">Projeção de impacto da reforma</label>
                                </div>
                                <div class="check-item">
                                    <input type="checkbox" id="check3">
                                    <label for="check3">Capacitação da equipe fiscal</label>
                                </div>
                                <div class="check-item">
                                    <input type="checkbox" id="check4">
                                    <label for="check4">Atualização dos sistemas de TI</label>
                                </div>
                                <div class="check-item">
                                    <input type="checkbox" id="check5">
                                    <label for="check5">Plano de contingência fiscal</label>
                                </div>
                                <div class="check-item">
                                    <input type="checkbox" id="check6">
                                    <label for="check6">Articulação com Comitê Gestor</label>
                                </div>
                            </div>
                            
                            <h4><i class="fas fa-calendar-alt"></i> Cronograma Recomendado</h4>
                            <div class="cronograma-gestor">
                                <div class="crono-item">
                                    <span class="crono-ano">2025</span>
                                    <span class="crono-desc">Diagnóstico e planejamento</span>
                                </div>
                                <div class="crono-item">
                                    <span class="crono-ano">2026</span>
                                    <span class="crono-desc">Adaptação de sistemas para teste</span>
                                </div>
                                <div class="crono-item">
                                    <span class="crono-ano">2027</span>
                                    <span class="crono-desc">Avaliação de impactos do teste</span>
                                </div>
                                <div class="crono-item">
                                    <span class="crono-ano">2028</span>
                                    <span class="crono-desc">Preparação para transição IBS</span>
                                </div>
                                <div class="crono-item">
                                    <span class="crono-ano">2029-2032</span>
                                    <span class="crono-desc">Gestão ativa da transição</span>
                                </div>
                                <div class="crono-item">
                                    <span class="crono-ano">2033</span>
                                    <span class="crono-desc">Operação plena do IVA Dual</span>
                                </div>
                            </div>
                            
                            <div class="destaque-box danger">
                                <i class="fas fa-exclamation-circle"></i>
                                <p><strong>Alerta:</strong> Entes que não se prepararem adequadamente podem enfrentar dificuldades financeiras durante a transição.</p>
                            </div>
                        `,
                        quiz: [
                            {
                                pergunta: 'O período de transição do IBS vai de:',
                                opcoes: ['2024 a 2030', '2026 a 2033', '2025 a 2035', '2027 a 2032'],
                                correta: 1
                            }
                        ]
                    }
                }
            ]
        }
    };

    // =========================================
    // BADGES E CONQUISTAS
    // =========================================
    const BADGES = {
        'primeiro-modulo': { nome: 'Primeiro Passo', icone: 'fa-shoe-prints', descricao: 'Completou o primeiro módulo' },
        'cidadao-completo': { nome: 'Cidadão Informado', icone: 'fa-user-check', descricao: 'Completou todos os módulos de Cidadão' },
        'empresario-completo': { nome: 'Empresário Preparado', icone: 'fa-briefcase', descricao: 'Completou todos os módulos de Empresário' },
        'gestor-completo': { nome: 'Gestor Especialista', icone: 'fa-landmark', descricao: 'Completou todos os módulos de Gestor' },
        'quiz-perfeito': { nome: 'Nota Máxima', icone: 'fa-star', descricao: 'Acertou todas as perguntas de um quiz' },
        'trilha-completa': { nome: 'Mestre da Reforma', icone: 'fa-trophy', descricao: 'Completou toda a trilha' }
    };

    // =========================================
    // FUNÇÕES DE RENDERIZAÇÃO
    // =========================================

    function renderLearningPath(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let html = `
            <div class="learning-path-container" role="region" aria-label="Trilha de Aprendizagem">
                <!-- Cabeçalho com Progresso -->
                <div class="lp-header">
                    <div class="lp-title">
                        <h3><i class="fas fa-graduation-cap"></i> Trilha de Aprendizagem</h3>
                        <p>Aprenda sobre a Reforma Tributária de forma interativa</p>
                    </div>
                    <div class="lp-stats">
                        <div class="lp-stat">
                            <i class="fas fa-star"></i>
                            <span class="stat-value" id="totalPoints">${state.totalPoints}</span>
                            <span class="stat-label">Pontos</span>
                        </div>
                        <div class="lp-stat">
                            <i class="fas fa-check-circle"></i>
                            <span class="stat-value" id="completedModules">${state.completedModules.length}</span>
                            <span class="stat-label">Módulos</span>
                        </div>
                        <div class="lp-stat">
                            <i class="fas fa-medal"></i>
                            <span class="stat-value" id="badgesCount">${state.badges.length}</span>
                            <span class="stat-label">Badges</span>
                        </div>
                    </div>
                </div>

                <!-- Badges Conquistados -->
                ${renderBadgesSection()}

                <!-- Seletor de Nível -->
                <div class="lp-levels" role="tablist">
                    ${Object.values(LEVELS).map(level => `
                        <button class="lp-level-btn ${state.currentLevel === level.id ? 'active' : ''}" 
                                data-level="${level.id}"
                                role="tab"
                                aria-selected="${state.currentLevel === level.id}"
                                aria-controls="level-content-${level.id}"
                                onclick="LearningPath.setLevel('${level.id}')"
                                style="--level-color: ${level.cor}; --level-color-light: ${level.corLight}">
                            <i class="fas ${level.icone}"></i>
                            <span class="level-name">${level.nome}</span>
                            <span class="level-points">${level.pontos} pts</span>
                            ${isLevelCompleted(level.id) ? '<i class="fas fa-check-circle level-complete"></i>' : ''}
                        </button>
                    `).join('')}
                </div>

                <!-- Conteúdo do Nível -->
                <div class="lp-content" id="lpContent">
                    ${renderLevelContent(state.currentLevel)}
                </div>

                <!-- Modal de Módulo -->
                <div class="lp-modal" id="lpModal" role="dialog" aria-hidden="true">
                    <div class="lp-modal-content">
                        <button class="lp-modal-close" onclick="LearningPath.closeModal()" aria-label="Fechar">
                            <i class="fas fa-times"></i>
                        </button>
                        <div class="lp-modal-body" id="lpModalBody"></div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    function renderBadgesSection() {
        if (state.badges.length === 0) return '';
        
        return `
            <div class="lp-badges-earned">
                <h4><i class="fas fa-medal"></i> Conquistas</h4>
                <div class="badges-list">
                    ${state.badges.map(badgeId => {
                        const badge = BADGES[badgeId];
                        return `
                            <div class="badge-item" title="${badge.descricao}">
                                <i class="fas ${badge.icone}"></i>
                                <span>${badge.nome}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    function renderLevelContent(levelId) {
        const level = LEVELS[levelId];
        if (!level) return '';

        return `
            <div class="level-header" style="--level-color: ${level.cor}">
                <div class="level-icon">
                    <i class="fas ${level.icone}"></i>
                </div>
                <div class="level-info">
                    <h4>${level.nome}</h4>
                    <p>${level.descricao}</p>
                </div>
                <div class="level-progress">
                    <div class="progress-ring">
                        <span>${calcularProgressoLevel(levelId)}%</span>
                    </div>
                </div>
            </div>
            
            <div class="modules-grid">
                ${level.modulos.map((modulo, index) => {
                    const isCompleted = state.completedModules.includes(modulo.id);
                    const isLocked = index > 0 && !state.completedModules.includes(level.modulos[index - 1].id);
                    
                    return `
                        <div class="module-card ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}"
                             onclick="${!isLocked ? `LearningPath.openModule('${levelId}', '${modulo.id}')` : ''}"
                             role="button"
                             tabindex="${isLocked ? -1 : 0}"
                             aria-disabled="${isLocked}">
                            <div class="module-status">
                                ${isCompleted ? '<i class="fas fa-check-circle"></i>' : (isLocked ? '<i class="fas fa-lock"></i>' : `<span class="module-number">${index + 1}</span>`)}
                            </div>
                            <div class="module-icon" style="background: ${level.corLight}; color: ${level.cor}">
                                <i class="fas ${modulo.icone}"></i>
                            </div>
                            <h5>${modulo.titulo}</h5>
                            <p>${modulo.descricao}</p>
                            <div class="module-meta">
                                <span><i class="fas fa-clock"></i> ${modulo.duracao}</span>
                                <span><i class="fas fa-star"></i> ${modulo.pontos} pts</span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    function renderModuleContent(levelId, moduloId) {
        const level = LEVELS[levelId];
        const modulo = level.modulos.find(m => m.id === moduloId);
        if (!modulo) return '';

        return `
            <div class="module-content">
                <div class="module-header" style="--level-color: ${level.cor}">
                    <div class="module-title">
                        <i class="fas ${modulo.icone}"></i>
                        <h3>${modulo.conteudo.titulo}</h3>
                    </div>
                    <div class="module-points">
                        <i class="fas fa-star"></i> ${modulo.pontos} pontos
                    </div>
                </div>
                
                <div class="module-text">
                    ${modulo.conteudo.texto}
                </div>
                
                ${modulo.conteudo.quiz ? `
                    <div class="module-quiz" id="moduleQuiz">
                        <h4><i class="fas fa-question-circle"></i> Quiz</h4>
                        ${renderQuiz(modulo.conteudo.quiz, levelId, moduloId)}
                    </div>
                ` : `
                    <button class="btn-complete-module" onclick="LearningPath.completeModule('${levelId}', '${moduloId}')">
                        <i class="fas fa-check"></i> Marcar como Concluído
                    </button>
                `}
            </div>
        `;
    }

    function renderQuiz(quiz, levelId, moduloId) {
        return `
            <div class="quiz-questions">
                ${quiz.map((q, index) => `
                    <div class="quiz-question" data-index="${index}">
                        <p class="question-text">${index + 1}. ${q.pergunta}</p>
                        <div class="question-options">
                            ${q.opcoes.map((opcao, optIndex) => `
                                <label class="option-label">
                                    <input type="radio" name="q${index}" value="${optIndex}" 
                                           onchange="LearningPath.checkAnswer(${index}, ${optIndex}, ${q.correta})">
                                    <span class="option-text">${opcao}</span>
                                    <span class="option-indicator"></span>
                                </label>
                            `).join('')}
                        </div>
                        <div class="question-feedback" id="feedback${index}"></div>
                    </div>
                `).join('')}
            </div>
            <button class="btn-complete-quiz" id="btnCompleteQuiz" style="display: none;" 
                    onclick="LearningPath.completeModule('${levelId}', '${moduloId}')">
                <i class="fas fa-trophy"></i> Concluir Módulo
            </button>
        `;
    }

    // =========================================
    // FUNÇÕES DE INTERAÇÃO
    // =========================================

    function setLevel(levelId) {
        state.currentLevel = levelId;
        
        // Atualizar botões
        document.querySelectorAll('.lp-level-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.level === levelId);
            btn.setAttribute('aria-selected', btn.dataset.level === levelId);
        });
        
        // Atualizar conteúdo
        const content = document.getElementById('lpContent');
        if (content) {
            content.innerHTML = renderLevelContent(levelId);
        }
    }

    function openModule(levelId, moduloId) {
        const modal = document.getElementById('lpModal');
        const modalBody = document.getElementById('lpModalBody');
        
        if (modal && modalBody) {
            modalBody.innerHTML = renderModuleContent(levelId, moduloId);
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        const modal = document.getElementById('lpModal');
        if (modal) {
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    let quizAnswers = {};
    let currentQuizLength = 0;

    function checkAnswer(questionIndex, selectedIndex, correctIndex) {
        const isCorrect = selectedIndex === correctIndex;
        quizAnswers[questionIndex] = isCorrect;
        
        const feedback = document.getElementById(`feedback${questionIndex}`);
        const options = document.querySelectorAll(`input[name="q${questionIndex}"]`);
        
        options.forEach((opt, idx) => {
            const label = opt.parentElement;
            label.classList.remove('correct', 'incorrect');
            if (idx === correctIndex) {
                label.classList.add('correct');
            } else if (idx === selectedIndex && !isCorrect) {
                label.classList.add('incorrect');
            }
            opt.disabled = true;
        });
        
        feedback.innerHTML = isCorrect 
            ? '<i class="fas fa-check-circle"></i> Correto!' 
            : '<i class="fas fa-times-circle"></i> Incorreto. Veja a resposta correta acima.';
        feedback.className = `question-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        
        // Verificar se todas as perguntas foram respondidas
        const allQuestions = document.querySelectorAll('.quiz-question');
        if (Object.keys(quizAnswers).length >= allQuestions.length) {
            document.getElementById('btnCompleteQuiz').style.display = 'block';
        }
    }

    function completeModule(levelId, moduloId) {
        if (!state.completedModules.includes(moduloId)) {
            state.completedModules.push(moduloId);
            
            // Calcular pontos
            const level = LEVELS[levelId];
            const modulo = level.modulos.find(m => m.id === moduloId);
            
            // Bonus por quiz perfeito
            const allCorrect = Object.values(quizAnswers).every(v => v === true) && Object.keys(quizAnswers).length > 0;
            const bonus = allCorrect ? Math.round(modulo.pontos * 0.5) : 0;
            
            state.totalPoints += modulo.pontos + bonus;
            
            // Verificar badges
            checkBadges(levelId, moduloId, allCorrect);
            
            // Salvar estado
            saveState();
            
            // Atualizar UI
            closeModal();
            setLevel(levelId);
            updateStats();
            
            // Reset quiz answers
            quizAnswers = {};
            
            // Mostrar notificação
            showNotification(`+${modulo.pontos + bonus} pontos! ${allCorrect ? '🌟 Bônus de quiz perfeito!' : ''}`, 'success');
        }
    }

    function checkBadges(levelId, moduloId, quizPerfeito) {
        // Primeiro módulo
        if (state.completedModules.length === 1 && !state.badges.includes('primeiro-modulo')) {
            state.badges.push('primeiro-modulo');
            showNotification('🏅 Nova conquista: Primeiro Passo!', 'badge');
        }
        
        // Quiz perfeito
        if (quizPerfeito && !state.badges.includes('quiz-perfeito')) {
            state.badges.push('quiz-perfeito');
            showNotification('🌟 Nova conquista: Nota Máxima!', 'badge');
        }
        
        // Nível completo
        const level = LEVELS[levelId];
        const levelComplete = level.modulos.every(m => state.completedModules.includes(m.id));
        
        if (levelComplete) {
            const badgeId = `${levelId}-completo`;
            if (!state.badges.includes(badgeId)) {
                state.badges.push(badgeId);
                showNotification(`🎉 Nova conquista: ${level.badge}!`, 'badge');
            }
        }
        
        // Trilha completa
        const allComplete = Object.values(LEVELS).every(l => 
            l.modulos.every(m => state.completedModules.includes(m.id))
        );
        
        if (allComplete && !state.badges.includes('trilha-completa')) {
            state.badges.push('trilha-completa');
            showNotification('🏆 Parabéns! Você completou toda a trilha!', 'badge');
        }
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `lp-notification ${type}`;
        notification.innerHTML = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    function updateStats() {
        const totalPointsEl = document.getElementById('totalPoints');
        const completedModulesEl = document.getElementById('completedModules');
        const badgesCountEl = document.getElementById('badgesCount');
        
        if (totalPointsEl) totalPointsEl.textContent = state.totalPoints;
        if (completedModulesEl) completedModulesEl.textContent = state.completedModules.length;
        if (badgesCountEl) badgesCountEl.textContent = state.badges.length;
    }

    function calcularProgressoLevel(levelId) {
        const level = LEVELS[levelId];
        const completed = level.modulos.filter(m => state.completedModules.includes(m.id)).length;
        return Math.round((completed / level.modulos.length) * 100);
    }

    function isLevelCompleted(levelId) {
        const level = LEVELS[levelId];
        return level.modulos.every(m => state.completedModules.includes(m.id));
    }

    function saveState() {
        localStorage.setItem('learningPath_completed', JSON.stringify(state.completedModules));
        localStorage.setItem('learningPath_scores', JSON.stringify(state.quizScores));
        localStorage.setItem('learningPath_points', state.totalPoints.toString());
        localStorage.setItem('learningPath_badges', JSON.stringify(state.badges));
    }

    function resetProgress() {
        if (confirm('Deseja realmente resetar todo o seu progresso?')) {
            state.completedModules = [];
            state.quizScores = {};
            state.totalPoints = 0;
            state.badges = [];
            saveState();
            location.reload();
        }
    }

    // Simulador de não-cumulatividade
    function simularCumulatividade() {
        const compras = parseFloat(document.getElementById('valorCompras')?.value || 10000);
        const vendas = parseFloat(document.getElementById('valorVendas')?.value || 15000);
        
        // Sistema atual (sem crédito total - estimativa)
        const impostoAtualCompras = compras * 0.265;  // ~26,5% carga tributária
        const impostoAtualVendas = vendas * 0.265;
        const creditoAtual = impostoAtualCompras * 0.5;  // ~50% creditável no sistema atual
        const pagarAtual = impostoAtualVendas - creditoAtual;
        
        // Sistema novo (crédito pleno)
        const impostoNovoCompras = compras * 0.265;
        const impostoNovoVendas = vendas * 0.265;
        const pagarNovo = impostoNovoVendas - impostoNovoCompras;  // Crédito pleno
        
        const economia = pagarAtual - pagarNovo;
        
        const resultadoAtual = document.getElementById('resultadoAtual');
        const resultadoNovo = document.getElementById('resultadoNovo');
        const economiaEl = document.getElementById('economiaSimulador');
        
        if (resultadoAtual) resultadoAtual.textContent = `R$ ${pagarAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        if (resultadoNovo) resultadoNovo.textContent = `R$ ${pagarNovo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        if (economiaEl) economiaEl.textContent = `R$ ${economia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    }

    // =========================================
    // INICIALIZAÇÃO
    // =========================================

    function init(containerId = 'learningPath') {
        renderLearningPath(containerId);
        console.log('📚 LearningPath inicializado');
    }

    // =========================================
    // INTERFACE PÚBLICA
    // =========================================
    return {
        init,
        setLevel,
        openModule,
        closeModal,
        checkAnswer,
        completeModule,
        resetProgress,
        simularCumulatividade,
        
        // Estado
        getState: () => ({ ...state }),
        LEVELS,
        BADGES
    };
})();

// Exportar para uso global
window.LearningPath = LearningPath;

console.log('📚 LearningPath carregado');
