# Observatório da Reforma Tributária Brasileira

[![14º Prêmio SOF](https://img.shields.io/badge/14%C2%BA%20Pr%C3%AAmio%20SOF-Solu%C3%A7%C3%B5es%20em%20Dados-blue)](https://www.gov.br/economia/pt-br/assuntos/planejamento-e-orcamento/orcamento)
[![EC 132/2023](https://img.shields.io/badge/Base%20Legal-EC%20132%2F2023-green)](https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc132.htm)
[![LC 214/2025](https://img.shields.io/badge/Regulamenta%C3%A7%C3%A3o-LC%20214%2F2025-orange)](https://www.planalto.gov.br/ccivil_03/leis/lcp/Lcp214.htm)

Plataforma digital de transparência fiscal para monitoramento dos impactos da reforma tributária brasileira (EC 132/2023) nos estados e municípios, com foco nos novos tributos: **IBS**, **CBS** e **IS**.

## 🌐 URLs de Acesso

| Recurso | URL |
|---------|-----|
| **Dashboard Principal** | https://hvztvkww.gensparkspace.com/ |
| **Apresentação (PDF)** | https://hvztvkww.gensparkspace.com/apresentacao.html |
| **Instruções de Acesso** | https://hvztvkww.gensparkspace.com/INSTRUCOES_ACESSO.html |
| **Proposta Completa** | https://hvztvkww.gensparkspace.com/PROPOSTA_PREMIO_SOF.md |

## 📍 Navegação e Seções

| Seção | Descrição | URI |
|-------|-----------|-----|
| **Visão Geral** | Landing page com relevância, novos tributos, atualidades RFB, navegação para seções | `#section-visao-geral` |
| **Reforma em Números** | Dashboard com Big Numbers, comparativo sistema atual vs IVA Dual | `#section-reforma-numeros` |
| **Impacto na Arrecadação** | Projeções por UF, gráficos de impacto e proporção ganhadores/perdedores | `#section-impacto-arrecadacao` |
| **Riscos Fiscais** | Matriz de riscos com legenda, indicadores e alertas | `#section-riscos-fiscais` |
| **Trilha de Aprendizagem** | Estudos gov.br, vídeos ENAP/EVG, cursos, trilha gamificada | `#section-trilha-aprendizagem` |
| **Timeline da Transição** | Cronograma 2023-2033, projeções IBS/CBS com cenários | `#section-timeline-transicao` |
| **Dados Abertos** | Downloads CSV, fontes oficiais, tabela completa | `#section-dados-abertos` |
| **Assistente IA** | Chat inteligente sobre IBS, CBS, Split Payment, Cashback | `#section-assistente-ia` |

## ✅ Funcionalidades Implementadas

### FASE 1: Saneamento Crítico (Refatoração)

#### 1.1 Conexão com Dados Reais (`GovernmentDataService.js`)
- [x] Serviço de dados governamentais com fallback para cache estático
- [x] Dados oficiais de: STN, RFB, CONFAZ, Portal da Transparência
- [x] Parâmetros da Reforma Tributária (EC 132/2023 + LC 214/2025)
- [x] Efeitos redistributivos por UF (fonte: Ministério da Fazenda)
- [x] Timeline de transição (2026-2033)

#### 1.2 Correção Semântica e Legal
- [x] Terminologia atualizada: IBS, CBS, IS (Imposto Seletivo)
- [x] Referências explícitas à EC 132/2023 e LC 214/2025
- [x] Menção ao Comitê Gestor do IBS
- [x] Alíquotas de referência: CBS 8,8% + IBS 17,7% = 26,5%

#### 1.3 Correção de UX/UI
- [x] Modal de Metodologia funcional (links corrigidos)
- [x] Modal de Documentação da API
- [x] Links do header funcionando corretamente
- [x] Links do footer atualizados
- [x] Filtros globais visíveis apenas em seções filtrantes (Visão Geral, Impacto na Arrecadação)

#### 1.4 Acessibilidade (a11y)
- [x] Skip link para conteúdo principal
- [x] Atributos `aria-label` em todos os elementos interativos
- [x] Roles semânticos (`role="navigation"`, `role="main"`, etc.)
- [x] Screen reader support (`.sr-only` classes)
- [x] Navegação por teclado

### FASE 2: Novas Funcionalidades

#### 2.1 Visão Geral - Reorganização
- [x] **Tabela de UF no topo**: Abaixo dos filtros para análise imediata
- [x] **KPIs e alertas na parte inferior**: Informações contextuais
- [x] **Filtros simplificados**: Apenas Região e UF (removido filtro de ano sem função)

#### 2.2 Seção "Reforma em Números" (`TaxReformDashboard.js`)
- [x] **Widget de Impacto Orçamentário**: Big Number Cards com dados de RCL e arrecadação
- [x] **Comparativo de Carga Tributária**: Gráfico de barras empilhadas (Sistema Atual vs IVA Dual)
- [x] **Gráfico de Arrecadação por Tributo**: Pizza com dados da RFB (2024)
- [x] **Cards Informativos**: CBS, IBS e IS com alíquotas e características

#### 2.3 Seção "Impacto na Arrecadação"
- [x] **Filtro por visualização**: Estados ou Municípios
- [x] **Cards de arrecadação**: ICMS→IBS, ISS→IBS, Transferências FPE/FPM
- [x] **Gráfico de projeção por UF**: Top 10 estados
- [x] **Gráfico de evolução**: Transição ICMS/ISS → IBS (2024-2033)
- [x] **Tabela de projeções**: ICMS/ISS atual vs IBS projetado

#### 2.4 Seção "Riscos Fiscais"
- [x] **Indicadores de risco**: Crítico, Alto, Médio, Baixo
- [x] **Matriz de Risco visual**: Gráfico ECharts
- [x] **Legenda da matriz**: Explicação clara dos critérios IRF
- [x] **Alertas detalhados**: UFs críticas, pontos de atenção, recomendações FMI

#### 2.5 Seção "Trilha de Aprendizagem"
- [x] **Estudos Oficiais**: Links para estudos do MF sobre alíquotas, impacto redistributivo, cesta básica, cashback
- [x] **Vídeos Explicativos**: Lazy-loading com thumbnails (TV Senado, Câmara dos Deputados)
- [x] **Carregamento sob demanda**: Melhor performance - vídeos carregam apenas ao clicar
- [x] **Cursos de Capacitação**: Cards com cursos ENAP e EVG (links oficiais)
- [x] **Trilha Gamificada**: Sistema de níveis (Cidadão 100pts, Empresário 200pts, Gestor Público 300pts)

##### Recursos Gamificados (`LearningPath.js`)
- [x] Sistema de pontuação
- [x] Badges e conquistas
- [x] Quiz interativo em cada módulo
- [x] Progresso salvo em localStorage
- [x] Simulador de não-cumulatividade

#### 2.6 Seção "Timeline da Transição" — Redesenhada
- [x] **Barra de progresso**: Indicador visual de 20% concluído com marcadores interativos
- [x] **Timeline em grid compacta**: 7 fases sem barra de rolagem
- [x] **Gráfico Evolução das Alíquotas**: CBS, IBS e Total IVA de 2024-2033
- [x] **Gráfico Transição ICMS/ISS→IBS**: Barras empilhadas mostrando substituição gradual
- [x] **Cards informativos**: CBS (Federal), IBS (Subnacional), IVA Dual Total
- [x] **Perspectivas Evolutivas**: 4 cards (Simplificação, Guerra Fiscal, Cashback, Split Payment)
- [x] **Projeções e Cenários movidas**: Agora na página "Impacto na Arrecadação"

#### 2.7 Seção "Assistente IA"
- [x] **Chat inteligente**: Respostas sobre IBS, CBS, Split Payment, Cashback, Transição
- [x] **Perguntas frequentes expandidas**: 10+ sugestões de perguntas
- [x] **Respostas sobre a reforma**: EC 132/2023, LC 214/2025, Comitê Gestor, Alíquotas
- [x] **Respostas sobre dados**: Por UF, região, comparações, rankings
- [x] **Formatação rica**: Tabelas, listas, links

## 📁 Estrutura de Arquivos

```
observatorio/
├── index.html                    # Dashboard principal (refatorado)
├── apresentacao.html             # Apresentação para exportar PDF
├── INSTRUCOES_ACESSO.html        # Instruções de acesso (PDF)
├── PROPOSTA_PREMIO_SOF.md        # Proposta completa para o prêmio
├── RELATORIO_AUDITORIA_QA.md     # Relatório de auditoria
├── README.md                     # Este arquivo
├── css/
│   ├── style.css                 # Estilos principais (45KB)
│   ├── components.css            # Estilos dos novos componentes (44KB)
│   ├── trilha-govbr.css          # Design System gov.br para Trilha (20KB)
│   ├── visao-geral.css           # Estilos da nova Visão Geral (10KB)
│   └── timeline-novo.css         # Estilos da nova Timeline (8KB)
└── js/
    ├── data.js                   # Dados base (efeitos redistributivos)
    ├── charts.js                 # Configuração de gráficos ECharts
    ├── main.js                   # Lógica principal + Assistente IA
    ├── GovernmentDataService.js  # Serviço de dados governamentais
    ├── TaxReformDashboard.js     # Componente "Reforma em Números"
    └── LearningPath.js           # Componente "Trilha de Aprendizagem"
```

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
|------------|-----|
| HTML5 | Estrutura semântica |
| CSS3 | Design responsivo, variáveis CSS, grid/flexbox |
| JavaScript ES6+ | Módulos, async/await, LocalStorage |
| ECharts 5.x | Visualização de dados (gráficos) |
| Font Awesome 6.x | Ícones |
| Google Fonts | Tipografia (Source Sans Pro, Rawline) |

## 📊 Fontes de Dados Oficiais

| Fonte | Dados |
|-------|-------|
| **STN** | Receita Corrente Líquida, RREO |
| **RFB** | Arrecadação tributária federal |
| **CONFAZ** | ICMS por estado |
| **Portal da Transparência** | FPE/FPM |
| **Ministério da Fazenda** | Notas Técnicas da Reforma, Efeito Redistributivo |
| **IBGE** | PIB municipal, estatísticas |

## 📈 Metodologia

### Índice de Risco Fiscal (IRF)

| Nível | IRF | Critério |
|-------|-----|----------|
| Crítico | ≥ 0.75 | +30% municípios perdedores E razão perda/ganho > 2 |
| Alto | 0.50-0.74 | 20-30% perdedores OU razão > 1.5 |
| Médio | 0.25-0.49 | 10-20% perdedores |
| Baixo | < 0.25 | Menos de 10% perdedores |

### Classificação por Nível de Renda

| Nível | PIBpc |
|-------|-------|
| Baixa | < R$ 25.000 |
| Média | R$ 25.000 - R$ 45.000 |
| Alta | > R$ 45.000 |

### Alíquotas de Referência (Estimativa MF)

| Tributo | Alíquota | Esfera |
|---------|----------|--------|
| CBS | 8,8% | Federal |
| IBS | 17,7% | Subnacional |
| IS | Variável | Federal (seletivo) |
| **IVA Dual Total** | **26,5%** | - |

## 🗓️ Timeline da Transição (EC 132/2023)

| Ano | Marco |
|-----|-------|
| 2023 | Aprovação da EC 132/2023 |
| Jan/2025 | LC 214/2025 (Regulamentação) |
| 2025 | Criação do Comitê Gestor do IBS |
| 2026-2027 | Período de Teste (CBS 0,9% + IBS 0,1%) |
| 2028 | CBS substitui PIS/COFINS, IPI zerado* |
| 2029-2032 | Transição gradual IBS (10%/ano) |
| 2033+ | IVA Dual em plena vigência |

## 🔄 Última Atualização (15/12/2025)

### Correções Implementadas

#### 1. Página "Reforma em Números"
- ✅ **Gráfico "Comparativo: Sistema Atual vs IVA Dual"**: Corrigida inicialização quando a seção se torna visível
- ✅ **Gráfico "Arrecadação Federal por Tributo (2024)"**: Corrigida inicialização e redimensionamento automático
- ✅ **Função `reinicializarGraficosReforma()`**: Implementado dispose/recreate de gráficos ECharts

#### 2. Página "Impacto na Arrecadação"
- ✅ **Gráfico de Impacto por Região**: Nova função `criarGraficoImpactoRegiao()` com dados agregados
- ✅ **Tabela de Impacto por UF**: Nova função `preencherTabelaImpactoUF()` com dados ordenados
- ✅ **Cards de resumo**: Ganhos (R$ 51,9 bi), Perdas (R$ 50,6 bi), Saldo (+R$ 1,3 bi)
- ✅ **Gráfico Impacto por UF - IBS/CBS**: Barras com ganhos/perdas por estado (movido da Visão Geral)
- ✅ **Gráfico Proporção Ganhadores vs Perdedores**: Pizza com 82% vs 18% (movido da Visão Geral)
- ✅ **Dropboxes removidos**: Filtros de Região e UF removidos (não tinham função)

#### 3. Página "Trilha de Aprendizagem" — Redesign Completo (estilo gov.br)
- ✅ **Design Inspirado em gov.br**: Novo visual profissional baseado nos portais gov.br/receitafederal e gov.br/cnen
- ✅ **Hero Banner**: Banner destacado com gradiente institucional e ícone de graduação
- ✅ **Sistema de Abas**: 5 abas navegáveis (Visão Geral, Trilhas de Estudo, Materiais, Cursos, Trilha Interativa)
- ✅ **Cards de Destaque**: CBS (8,8%), IBS (17,7%) e IS com design institucional
- ✅ **Links Oficiais**: Links para Receita Federal, Ministério da Fazenda, EC 132/2023, LC 214/2025
- ✅ **Trilhas por Perfil**: 3 trilhas (Cidadão, Empresário, Gestor Público) com módulos específicos
- ✅ **Documentos e Estudos**: Lista de documentos oficiais com ícones PDF
- ✅ **Vídeos Explicativos**: Cards de vídeo com link para YouTube (sem embed problemático)
- ✅ **Cursos ENAP/EVG**: Cards de cursos com badges, duração e nível
- ✅ **Trilha Gamificada**: Integrada como aba separada com LearningPath.js
- ✅ **CSS Dedicado**: Novo arquivo `css/trilha-govbr.css` com design system gov.br
- ✅ **Acessibilidade**: Focus states, ARIA labels, navegação por teclado
- ✅ **Responsividade**: Adaptação completa para dispositivos móveis

#### 4. UI Global
- ✅ **Botão Flutuante "Painel SIOP"**: Acesso rápido ao Painel do Orçamento Federal
  - Link: https://www1.siop.planejamento.gov.br/qlikview/index.htm
  - Posição fixa no canto inferior direito
  - Animação de pulso para destaque
  - Responsivo em dispositivos móveis

#### 5. Página "Visão Geral" — Redesign Completo (Landing Page)
- ✅ **Hero de Apresentação**: Novo banner com identidade visual institucional
- ✅ **Seção de Relevância**: Descrição do valor da solução para gestão orçamentária
- ✅ **Novos Tributos**: Cards visuais para CBS (8,8%), IBS (17,7%) e IS com alíquota total (26,5%)
- ✅ **Atualidades Receita Federal**: Informações sobre orientações 2026 com link oficial
- ✅ **Navegação por Botões**: 6 cards clicáveis para acesso direto às seções
- ✅ **Fontes de Dados**: Rodapé com logos das fontes oficiais (STN, RFB, CONFAZ, MF, IBGE)
- ✅ **CSS Dedicado**: Novo arquivo `css/visao-geral.css`
- ✅ **Gráficos Movidos**: "Impacto por UF" e "Proporção Ganhadores vs Perdedores" movidos para seção "Impacto na Arrecadação"
- ✅ **Filtro de Região Removido**: Removido filtro global que não tinha funcionalidade

## 🔜 Próximos Passos (Roadmap)

### Curto Prazo (Q1 2025)
- [ ] Integração real com APIs do SIOP (quando disponível via CORS)
- [ ] Mapa do Brasil interativo com SVG/GeoJSON
- [ ] Export PDF direto do dashboard

### Médio Prazo (Q2-Q3 2025)
- [ ] Machine Learning para previsão de riscos fiscais
- [ ] API REST pública com endpoints documentados
- [ ] Integração com sistema de notificações

### Longo Prazo (2026+)
- [ ] Dados em tempo real do Split Payment
- [ ] Dashboard de acompanhamento do Comitê Gestor
- [ ] Integração com Portal da Transparência v2

## 👥 Contato

**Observatório da Reforma Tributária Brasileira**
- Plataforma desenvolvida para o 14º Prêmio SOF de Monografias
- Categoria: Soluções em Dados Orçamentários

## 📄 Licença

MIT License - Código aberto para fins educacionais e de transparência fiscal.

---

© 2025 Observatório da Reforma Tributária Brasileira | Inspirado no Fiscal Transparency Code (FMI)
