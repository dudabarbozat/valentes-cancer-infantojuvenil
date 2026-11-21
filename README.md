# Valentes — câncer infantojuvenil

Base centralizada de dados de câncer infantojuvenil com três visões: equipe médica, família e instituições.

**Demo:** https://dudabarbozat.github.io/valentes-cancer-infantojuvenil/

Projeto do pitch "Desafio Câncer Infantil", criado entre 2020 e 2023 e reconstruído em 2026 como protótipo navegável. Todos os dados de pacientes são fictícios.

## Para quem

Médicos que precisam do histórico do paciente, famílias que precisam entender o tratamento em linguagem simples e instituições que acompanham os casos por região.

## Funcionalidades

- **Equipe médica:** lista de pacientes com filtros e ficha com resumo, pendências, linha do tempo, calendário de procedimentos e medicamentos.
- **Família:** agenda com exportação `.ics`, glossário em linguagem simples, dicas e busca de dúvidas com travas de segurança (sintoma, emergência, dose e prognóstico sempre levam à equipe ou ao 192).
- **Instituições:** painel com indicadores, mapa por estado, novos casos, estágio na chegada, tempos de referência do INCA e exportação CSV.

Pacientes aparecem só por código e iniciais, sem fotos de crianças e sem doses de medicamentos.

## Stack

Next.js 15 (exportação estática) · React 19 · TypeScript · Chart.js

| Fonte | Uso |
|-------|-----|
| [IBGE Malhas v3 e Localidades](https://servicodados.ibge.gov.br/api/docs) | Mapa e nomes dos estados |
| INCA, RHC 2012-2017 | Tempo médio entre consulta, diagnóstico e tratamento |

Sem backend e sem chaves de API.

## Como rodar

```bash
npm ci
npm run dev
```

## Limitações do protótipo

Pacientes, hospitais e números do painel são inventados; são reais a malha do IBGE e a tabela do INCA. Não há nuvem nem autenticação. Ficaram fora a IA de apoio ao médico, o chatbot e a conexão entre famílias, previstos no roadmap.

## Equipe

- Eduarda Barboza — UX/UI
- Juliana Talita — UX/design
- Bianca Medeiros — mobile e front-end
- Josias Furtado — fullstack
- Rodrigo de Araújo — desenvolvimento e negócios
- Jhennifer Pimentel — marketing

## Licença

Código sob [MIT](LICENSE).
