# NFL Playoff Machine 2026

Uma máquina de playoffs da NFL interativa para a temporada 2026-2027, inspirada no [sticktothemodel.com](https://sticktothemodel.com/playoff-machine), construída com React, TypeScript e Tailwind CSS.

## 🏈 Funcionalidades

### The Field (O Campo)
- **Seleção de jogos por semana**: Escolha o vencedor de cada jogo da temporada
- **Cenários pré-definidos**: 
  - Chalk (favoritos de Vegas)
  - Chaos (zebras)
  - Better record wins (melhor campanha vence)
  - Home teams (mandantes vencem)
- **Simulação de semana/temporada**: Simule jogos aleatórios com base nas probabilidades
- **Bracket interativo**: Clique nos times do playoff para escolher os vencedores
- **Classificações de divisão**: Veja os standings atualizados em tempo real

### Your Team (Seu Time)
- **Acompanhe um time específico**: Veja a campanha e jogos restantes
- **Probabilidades de playoff**: Execute simulações Monte Carlo (1000x) para ver as chances
- **Estatísticas detalhadas**: Chance de fazer playoff, vencer divisão, #1 seed, Super Bowl

### Draft Order (Ordem do Draft)
- **Ordem do draft dinâmica**: Atualiza com base nos seus picks
- **Ranges de pick**: Mostra o range possível para cada time

## 🎯 Critérios de Desempate

O motor implementa todos os critérios oficiais da NFL:

1. **Head-to-head** (confronto direto)
2. **Division record** (para disputas de divisão)
3. **Common opponents** (mínimo 4 jogos)
4. **Conference record**
5. **Strength of victory** (força das vitórias)
6. **Strength of schedule** (força da agenda)
7. **Net points** (pontos marcados - pontos sofridos)

## 🚀 Como Usar

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

### Build para Produção

```bash
npm run build
```

## 🏗️ Arquitetura

### Engine (`src/engine/playoff-engine.ts`)
Motor TypeScript completo que implementa:
- Cálculo de standings com todos os critérios de desempate
- Sistema de tiebreakers multi-time
- Seeding de conferência (seeds 1-7)
- Resolução de playoffs (Wild Card, Divisional, Championship, Super Bowl)
- Simulação Monte Carlo
- Ordem do draft

### Dados (`src/data/nfl-data.ts`)
- Divisões da NFL (AFC/NFC)
- Nomes e cores dos times
- Logotipos (via ESPN CDN)
- Ratings de poder dos times
- Schedule da temporada 2026-2027

### Componentes
- **FieldView**: Interface principal com seleção de jogos e bracket
- **TeamView**: Acompanhamento de time específico
- **DraftView**: Ordem do draft

## 🎨 Design

Interface limpa e moderna inspirada no sticktothemodel.com:
- Logotipos reais dos times via ESPN CDN
- Layout responsivo
- Feedback visual para picks do usuário
- Cores dos times integradas

## 📊 Simulação Monte Carlo

A simulação executa 1000 temporadas completas:
- Jogos não escolhidos são simulados com base nas probabilidades
- Cada simulação calcula standings, seeds, bracket e draft
- Resultados agregados mostram probabilidades de playoff, divisão, Super Bowl, etc.

## 🔧 Tecnologias

- **React 18** com TypeScript
- **Tailwind CSS** para estilização
- **Vite** para build
- **Motor TypeScript** portado do JavaScript original

## 📝 Notas

- Os logotipos são carregados do CDN do ESPN (a.espncdn.com)
- As probabilidades de jogo são baseadas em ratings de poder dos times
- O motor implementa os mesmos critérios de desempate da NFL oficial
- A simulação Monte Carlo usa o mesmo algoritmo do site de referência

## 🎮 Como Jogar

1. **Escolha os vencedores**: Clique nos times para escolher quem vence cada jogo
2. **Use cenários**: Aplique cenários pré-definidos para preencher jogos rapidamente
3. **Simule**: Use "Sim season" para simular toda a temporada
4. **Bracket**: Clique nos times do playoff para escolher os campeões
5. **Seu time**: Selecione um time para ver suas chances detalhadas
6. **Draft**: Veja como suas escolhas afetam a ordem do draft

## 🏆 Licença

Este projeto é apenas para fins educacionais e de entretenimento.

NFL e todos os nomes de times são marcas registradas da National Football League.
