# valentes-cancer-infantojuvenil

Protótipo do Valentes, uma base centralizada de dados de câncer infantojuvenil com três visões: equipe médica, família e instituições. Proposta apresentada no pitch do "Desafio Câncer Infantil". Todos os dados de pacientes são fictícios.

Demo: https://dudabarbozat.github.io/valentes-cancer-infantojuvenil/

Portfólio pessoal. Projeto criado entre 2020 e 2023 e reimplementado em 2026 com Next.js e APIs públicas.

## Contexto

**Desafio:** Desafio Câncer Infantil.

**Equipe:**

- Eduarda Barboza (UX/UI)
- Juliana Talita (UX/design)
- Bianca Medeiros (desenvolvimento mobile e front-end)
- Josias Furtado (desenvolvimento fullstack)
- Rodrigo de Araújo (desenvolvimento e negócios)
- Jhennifer Pimentel (marketing)

**Problema:** não existe uma base de dados de câncer infantojuvenil íntegra, confiável e atualizada. O diagnóstico atrasa, o médico não tem o histórico do paciente e a família fica perdida com os termos técnicos.

**Proposta original:** base centralizada na nuvem com três frentes:

- Equipe médica (app): lista de pacientes com idade, diagnóstico, tempo de doença e local de tratamento; exames, medicamentos e calendário de procedimentos.
- Família (PWA): agenda, informações sobre o diagnóstico em linguagem simples, dicas de qualidade de vida, histórias de superação, conexão com outros pais, médicos e hospitais.
- Instituições (painel): novos casos, em tratamento, curados, onde são tratados, unidades que encaminharam, estágio na chegada, casos ativos por região.

Dados não sensíveis seriam compartilhados com órgãos públicos. O roadmap previa IA de apoio ao médico e um chatbot de dúvidas. Stack original: ReactJS, React Native e NodeJS.

**Números do pitch** (fonte citada: INCA, RHC 2012-2017):

- O câncer é a 1ª causa de morte por doença entre 1 e 19 anos no Brasil.
- Tempo médio, em dias:

| Grupo | 1ª consulta → diagnóstico | Diagnóstico → tratamento | 1ª consulta → tratamento |
|---|---|---|---|
| Leucemias | 4,97 | 5,33 | 10 |
| Linfomas | 13,8 | 17,23 | 31 |
| SNC | 20 | 10 | 29 |
| Tumores sólidos | 15,88 | 11,59 | 27,5 |

## O protótipo

Site estático em Next.js (exportação estática), sem backend. O perfil é escolhido na tela inicial, sem login. O estado da demo (anotações, procedimentos realizados, compromissos) fica no `localStorage`, e o rodapé tem "Restaurar dados de exemplo".

Rotas:

- `/` seletor de perfil, com orientação curta na primeira visita.
- `/medico/` lista de pacientes com busca, filtros por grupo de diagnóstico, local de tratamento e situação, e contagem de pendências.
- `/medico/<codigo>/` ficha: resumo da ficha (síntese, pendências e próximos procedimentos, recalculado a cada alteração), linha do tempo, nova anotação com validação, calendário mensal de procedimentos com marcação de realizado, medicamentos.
- `/familia/` agenda: próximo compromisso, novo compromisso com validação inline, marcação de feito e exportação `.ics` (todos os próximos ou um por vez).
- `/familia/duvidas/` busca de dúvidas no glossário e nas perguntas frequentes, com travas para sintoma, emergência, dose e prognóstico.
- `/familia/glossario/` glossário em linguagem simples, com busca sem acento.
- `/familia/dicas/` dicas de rotina.
- `/instituicao/` painel: indicadores, mapa por UF, novos casos por mês, casos por região, estágio na chegada, casos por grupo, tabela por estado, unidades que encaminharam, tempos de referência do INCA e exportação CSV. Filtro por região.

Cuidados de conteúdo: toda tela com pacientes ou números tem a faixa "Dados fictícios para demonstração"; pacientes aparecem só por código e iniciais; não há fotos de crianças; medicamentos aparecem com nome genérico e sem dose; as telas da família repetem que dúvidas sobre o tratamento vão para a equipe que acompanha a criança, com o 192 para emergência.

## APIs

| API | Uso |
|---|---|
| [IBGE, malhas v3](https://servicodados.ibge.gov.br/api/docs/malhas?versao=3) | Malha do Brasil por UF (GeoJSON, qualidade mínima), desenhada como SVG no mapa do painel |
| [IBGE, localidades v1](https://servicodados.ibge.gov.br/api/docs/localidades) | Nomes oficiais dos estados e das regiões no mapa e na tabela |

As duas são públicas, sem chave, respondem com CORS liberado e são chamadas direto do navegador, com tempo limite, tela de carregamento e erro com "Tentar de novo". Se a de localidades falhar, o painel mostra siglas. Se a de malhas falhar, a tabela por estado continua com os mesmos números.

## Regras fixas

- **Resumo da ficha:** monta a síntese a partir dos registros da ficha e lista como pendências os laudos aguardando e os procedimentos passados sem marcação de realizado, mais os três próximos procedimentos. Não sugere conduta. A tela diz que é apoio à leitura e não substitui avaliação clínica.
- **Busca de dúvidas:** procura a pergunta no glossário e nas perguntas frequentes. Mensagens com sintoma, piora ou emergência recebem resposta fixa (falar com a equipe que acompanha a criança e ligar 192). Perguntas sobre dose, troca de remédio ou prognóstico também recebem resposta fixa. Sem resultado, orienta procurar a equipe.
- **Arquivos gerados no navegador:** agenda em `.ics` (RFC 5545, com lembrete 2 h antes) e indicadores em CSV (separador `;`, UTF-8 com BOM).

## O que é simulado

- Pacientes, hospitais, unidades, contagens por UF e percentuais do painel são inventados. São reais: a malha e os nomes do IBGE e a tabela de tempos do INCA.
- Não há backend, nuvem nem autenticação. Os perfis são visões diferentes dos mesmos dados locais.
- Datas de exames, procedimentos e compromissos são geradas a partir do dia em que a demo é aberta. Depois de 21 dias o estado salvo é regenerado.
- Fora do protótipo: a IA de apoio ao médico e o chatbot do roadmap original, histórias de superação, conexão entre famílias, envio de dados a órgãos públicos e PWA instalável.

## Stack

- Next.js 15.5 (App Router, `output: "export"`), React 19.1, TypeScript estrito.
- CSS Modules e `app/globals.css` com os tokens da identidade do pitch.
- Chart.js 4.5 com `react-chartjs-2` nos gráficos; mapa em SVG próprio a partir do GeoJSON do IBGE.
- Fontes: League Spartan e Nunito via `next/font/google`; Gidole via `@fontsource/gidole`.

Identidade: creme `#F2ECDF`, laranja `#F18B0E`, amarelo `#F1B440` e `#F6BF59`, texto `#1B2529`, marinho `#2D3D56`, neutros `#BDB4A3` e `#E8DDCA`. O logo em `public/img/` foi extraído do PDF do pitch. Para manter contraste AA, texto pequeno em laranja usa `#A35500` e títulos usam `#C86F00`.

## Como rodar

```
npm ci
npm run dev
```

Acesse http://localhost:3000/. Para gerar o site estático:

```
npm run build
```

A saída fica em `out/`. Para testar com o mesmo caminho do GitHub Pages, gere com `NEXT_PUBLIC_BASE_PATH=/valentes-cancer-infantojuvenil`, copie `out/` para `teste/valentes-cancer-infantojuvenil/` e sirva `teste/` com `python -m http.server`.

## Publicação

`.github/workflows/pages.yml` roda a cada push na `main`: instala com `npm ci`, gera o build com `NEXT_PUBLIC_BASE_PATH=/valentes-cancer-infantojuvenil` e publica `out/` no GitHub Pages. No repositório, em Settings > Pages, a origem deve ser "GitHub Actions".

## Estrutura

```
app/                      rotas (App Router), layout, globals.css
  medico/[codigo]/        fichas geradas por generateStaticParams
  familia/                agenda, duvidas, glossario, dicas
  instituicao/            painel
components/               cabeçalho, ilustrações, peças comuns
  medico/ familia/ instituicao/   telas e CSS Modules
lib/
  dados.ts                dados fictícios e tabela do INCA
  estado.tsx              estado da demo em localStorage
  resumo.ts               resumo da ficha por regras fixas
  assistente.ts           busca de dúvidas e travas de segurança
  ibge.ts                 malha e localidades do IBGE, projeção SVG
  ics.ts                  geração de arquivo iCalendar
public/img/               logo e favicon
.github/workflows/        publicação no Pages
```

## Licença

MIT. Veja [LICENSE](LICENSE).
