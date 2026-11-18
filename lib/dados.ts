/* Dados 100% fictícios para demonstração.
   Pacientes identificados só por código e iniciais; hospitais e unidades são inventados.
   As datas são geradas no navegador, a partir do dia em que a demo é aberta. */

export type Grupo = "Leucemias" | "Linfomas" | "Sistema nervoso central" | "Tumores sólidos";
export type Situacao = "Em tratamento" | "Acompanhamento";
export type Regiao = "Norte" | "Nordeste" | "Centro-Oeste" | "Sudeste" | "Sul";

export interface Hospital { id: string; nome: string; cidade: string; uf: string }
export interface Exame { id: string; data: string; tipo: string; resultado: string }
export interface Medicamento { id: string; nome: string; desde: string; situacao: "Em uso" | "Suspenso" | "Concluído" }
export interface Procedimento { id: string; data: string; hora: string; tipo: string; realizado: boolean; dataRealizado?: string }
export interface Anotacao { id: string; data: string; texto: string }
export interface Paciente {
  codigo: string; iniciais: string; idade: number; sexo: "F" | "M";
  diagnostico: string; grupo: Grupo; dataDiagnostico: string; hospital: string;
  fase: string; status: Situacao;
  exames: Exame[]; medicamentos: Medicamento[]; procedimentos: Procedimento[]; anotacoes: Anotacao[];
}
export interface Compromisso {
  id: string; data: string; hora: string; titulo: string; local: string; nota: string;
  feito: boolean; criadoPelaFamilia?: boolean;
}
export interface EstadoDemo { versao: 2; geradoEm: string; pacientes: Paciente[]; agenda: Compromisso[] }

export const HOSPITAIS: Hospital[] = [
  { id: "ipe", nome: "Hospital Infantil Ipê", cidade: "Campinas", uf: "SP" },
  { id: "aroeira", nome: "Centro Pediátrico Aroeira", cidade: "Recife", uf: "PE" },
  { id: "jacaranda", nome: "Hospital Jacarandá", cidade: "Porto Alegre", uf: "RS" },
  { id: "buriti", nome: "Instituto Buriti", cidade: "Goiânia", uf: "GO" },
  { id: "sumauma", nome: "Hospital Sumaúma", cidade: "Belém", uf: "PA" },
];

export const GRUPOS: Grupo[] = ["Leucemias", "Linfomas", "Sistema nervoso central", "Tumores sólidos"];

type Linha = [string, string, number, "F" | "M", string, Grupo, number, string, string, Situacao];
const BASE: Linha[] = [
  ["VT-0231", "A.C.S.", 7, "F", "Leucemia linfoide aguda", "Leucemias", 142, "ipe", "Consolidação", "Em tratamento"],
  ["VT-0244", "R.P.L.", 15, "M", "Linfoma de Hodgkin", "Linfomas", 61, "aroeira", "Quimioterapia", "Em tratamento"],
  ["VT-0259", "J.M.O.", 4, "M", "Meduloblastoma", "Sistema nervoso central", 203, "jacaranda", "Radioterapia", "Em tratamento"],
  ["VT-0262", "L.M.", 9, "F", "Leucemia linfoide aguda", "Leucemias", 38, "ipe", "Indução", "Em tratamento"],
  ["VT-0278", "T.A.B.", 2, "M", "Neuroblastoma", "Tumores sólidos", 95, "buriti", "Quimioterapia", "Em tratamento"],
  ["VT-0281", "G.S.F.", 12, "F", "Osteossarcoma", "Tumores sólidos", 176, "jacaranda", "Pós-cirúrgico", "Em tratamento"],
  ["VT-0293", "M.E.C.", 5, "F", "Tumor de Wilms", "Tumores sólidos", 412, "aroeira", "Acompanhamento", "Acompanhamento"],
  ["VT-0305", "D.R.N.", 17, "M", "Linfoma não Hodgkin", "Linfomas", 23, "sumauma", "Estadiamento", "Em tratamento"],
  ["VT-0317", "B.L.T.", 3, "F", "Retinoblastoma", "Tumores sólidos", 130, "ipe", "Quimioterapia", "Em tratamento"],
  ["VT-0322", "C.H.A.", 11, "M", "Leucemia mieloide aguda", "Leucemias", 74, "buriti", "Indução", "Em tratamento"],
  ["VT-0336", "I.V.P.", 8, "F", "Astrocitoma", "Sistema nervoso central", 560, "sumauma", "Acompanhamento", "Acompanhamento"],
  ["VT-0341", "P.G.D.", 14, "M", "Leucemia linfoide aguda", "Leucemias", 318, "jacaranda", "Manutenção", "Em tratamento"],
  ["VT-0358", "E.F.M.", 6, "F", "Rabdomiossarcoma", "Tumores sólidos", 49, "aroeira", "Quimioterapia", "Em tratamento"],
  ["VT-0362", "H.S.Q.", 16, "M", "Linfoma de Hodgkin", "Linfomas", 690, "ipe", "Acompanhamento", "Acompanhamento"],
];

/** Usado pelo generateStaticParams: as fichas são páginas estáticas. */
export const CODIGOS = BASE.map((l) => l[0]);
export const CRIANCA_FAMILIA = "VT-0262";

const EXAMES: Record<Grupo, string[]> = {
  "Leucemias": ["Hemograma completo", "Mielograma", "Punção lombar (líquor)", "Bioquímica sanguínea", "Imunofenotipagem"],
  "Linfomas": ["Hemograma completo", "PET-CT", "Biópsia de linfonodo", "Tomografia de tórax", "Bioquímica sanguínea"],
  "Sistema nervoso central": ["Ressonância de crânio", "Avaliação neurológica", "Hemograma completo", "Ressonância de coluna", "Avaliação oftalmológica"],
  "Tumores sólidos": ["Tomografia", "Ultrassonografia", "Biópsia", "Hemograma completo", "Cintilografia"],
};
const MEDICAMENTOS: Record<Grupo, string[]> = {
  "Leucemias": ["Quimioterapia, protocolo da fase atual", "Corticoide, conforme protocolo", "Antiemético", "Antimicrobiano profilático"],
  "Linfomas": ["Quimioterapia, ciclos programados", "Antiemético", "Protetor gástrico"],
  "Sistema nervoso central": ["Quimioterapia concomitante", "Anticonvulsivante", "Corticoide, conforme prescrição"],
  "Tumores sólidos": ["Quimioterapia, ciclos programados", "Antiemético", "Analgesia, conforme prescrição"],
};
const PROCEDIMENTOS: Record<Grupo, string[]> = {
  "Leucemias": ["Sessão de quimioterapia", "Coleta de exames", "Consulta de retorno", "Punção lombar"],
  "Linfomas": ["Sessão de quimioterapia", "PET-CT de reavaliação", "Consulta de retorno", "Coleta de exames"],
  "Sistema nervoso central": ["Sessão de radioterapia", "Ressonância de controle", "Consulta com neurocirurgia", "Coleta de exames"],
  "Tumores sólidos": ["Sessão de quimioterapia", "Tomografia de controle", "Consulta com cirurgia pediátrica", "Coleta de exames"],
};
const RESULTADOS = ["Laudo registrado", "Laudo registrado", "Sem intercorrências registradas", "Laudo registrado"];
const HORAS = ["07:30", "09:00", "10:30", "13:30", "15:00"];

export function iso(hoje: Date, deslocamento: number): string {
  const d = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + deslocamento, 12);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function pega<T>(lista: T[], i: number): T {
  return lista[((i % lista.length) + lista.length) % lista.length] as T;
}

function gerarPaciente(l: Linha, i: number, hoje: Date): Paciente {
  const [codigo, iniciais, idade, sexo, diagnostico, grupo, dias, hospital, fase, status] = l;
  const acompanhamento = status === "Acompanhamento";
  const passo = Math.max(6, Math.floor(dias / 6));
  const exames: Exame[] = [];
  for (let e = 0; e < 5; e++) {
    let desl = -dias + e * passo + (i % 3);
    if (desl > -1) desl = -1 - e;
    const pendente = e === 4 && !acompanhamento;
    if (pendente) desl = -1 - (i % 4);
    exames.push({
      id: `${codigo}-ex${e}`, data: iso(hoje, desl), tipo: pega(EXAMES[grupo], e),
      resultado: pendente ? "Aguardando laudo" : pega(RESULTADOS, e + i),
    });
  }
  const medicamentos: Medicamento[] = MEDICAMENTOS[grupo].map((nome, m) => ({
    id: `${codigo}-md${m}`, nome, desde: iso(hoje, -dias + m * 4),
    situacao: acompanhamento ? "Concluído" : m === 3 ? "Suspenso" : "Em uso",
  }));
  const desloc = acompanhamento ? [18, 47, 90] : [1 + (i % 4), 6 + (i % 3), 13 + (i % 5), 21, 29 + (i % 2)];
  const tiposAcomp = ["Consulta de retorno", "Coleta de exames", "Exame de imagem de controle"];
  const procedimentos: Procedimento[] = desloc.map((d, p) => ({
    id: `${codigo}-pr${p}`, data: iso(hoje, d), hora: pega(HORAS, p + i),
    tipo: acompanhamento ? pega(tiposAcomp, p) : pega(PROCEDIMENTOS[grupo], p), realizado: false,
  }));
  return {
    codigo, iniciais, idade, sexo, diagnostico, grupo, dataDiagnostico: iso(hoje, -dias), hospital, fase, status,
    exames, medicamentos, procedimentos,
    anotacoes: i === 0 ? [{ id: "an-0", data: iso(hoje, -3), texto: "Família informada sobre o calendário da próxima fase." }] : [],
  };
}

function gerarAgenda(hoje: Date): Compromisso[] {
  return [
    { id: "ag-1", data: iso(hoje, 1), hora: "07:30", titulo: "Coleta de sangue", local: "Hospital Infantil Ipê · Laboratório, térreo", nota: "Levar a carteirinha do hospital.", feito: false },
    { id: "ag-2", data: iso(hoje, 3), hora: "09:00", titulo: "Sessão no hospital-dia", local: "Hospital Infantil Ipê · Ala B, 2º andar", nota: "Duração prevista informada pela equipe: manhã toda.", feito: false },
    { id: "ag-3", data: iso(hoje, 6), hora: "14:00", titulo: "Conversa com o serviço social", local: "Hospital Infantil Ipê · Sala 12", nota: "Levar documentos para o pedido de transporte.", feito: false },
    { id: "ag-4", data: iso(hoje, 10), hora: "10:30", titulo: "Consulta de retorno", local: "Hospital Infantil Ipê · Ambulatório de oncologia", nota: "Anotar as dúvidas da semana antes de ir.", feito: false },
    { id: "ag-5", data: iso(hoje, 17), hora: "08:00", titulo: "Atendimento com a nutrição", local: "Hospital Infantil Ipê · Ambulatório", nota: "", feito: false },
    { id: "ag-0", data: iso(hoje, -2), hora: "09:00", titulo: "Consulta de retorno", local: "Hospital Infantil Ipê · Ambulatório de oncologia", nota: "", feito: true },
  ];
}

export function gerarEstado(hoje = new Date()): EstadoDemo {
  return { versao: 2, geradoEm: iso(hoje, 0), pacientes: BASE.map((l, i) => gerarPaciente(l, i, hoje)), agenda: gerarAgenda(hoje) };
}

export interface Termo { termo: string; texto: string }
export const GLOSSARIO: Termo[] = [
  { termo: "Oncologia pediátrica", texto: "Área da medicina que cuida de crianças e adolescentes com câncer. A equipe costuma reunir médicos, enfermagem, psicologia, nutrição e serviço social." },
  { termo: "Leucemia", texto: "Câncer que começa na medula óssea, o lugar dentro dos ossos onde o sangue é produzido. É o tipo mais comum na infância." },
  { termo: "Linfoma", texto: "Câncer que começa no sistema linfático, a rede de gânglios e vasos que ajuda o corpo a se defender." },
  { termo: "Tumor sólido", texto: "Nome usado para cânceres que formam uma massa em um órgão ou tecido, como rins, ossos ou olhos." },
  { termo: "Medula óssea", texto: "Tecido macio dentro dos ossos que fabrica as células do sangue: glóbulos vermelhos, glóbulos brancos e plaquetas." },
  { termo: "Hemograma", texto: "Exame de sangue que conta as células do sangue. A equipe usa o resultado para acompanhar o tratamento." },
  { termo: "Plaquetas", texto: "Células do sangue que ajudam a parar sangramentos. O número delas aparece no hemograma." },
  { termo: "Neutrófilos", texto: "Um tipo de glóbulo branco que defende o corpo contra infecções. Quando estão baixos, a equipe pode orientar cuidados extras." },
  { termo: "Imunidade baixa", texto: "Momento em que o corpo tem menos defesas. Algumas fases do tratamento causam isso de forma esperada." },
  { termo: "Quimioterapia", texto: "Tratamento com medicamentos que combatem as células do câncer. Pode ser feito por veia, por boca ou de outras formas, em ciclos." },
  { termo: "Radioterapia", texto: "Tratamento que usa radiação direcionada a uma área específica do corpo. As sessões costumam ser curtas e em dias seguidos." },
  { termo: "Protocolo", texto: "Plano de tratamento organizado em fases, com medicamentos, exames e prazos definidos pela equipe." },
  { termo: "Fase de indução", texto: "Primeira fase do tratamento de algumas leucemias. Costuma ser a mais intensa e exige mais idas ao hospital." },
  { termo: "Manutenção", texto: "Fase mais longa e geralmente mais leve de alguns tratamentos, quando a rotina tende a se aproximar do normal." },
  { termo: "Mielograma", texto: "Exame que retira uma pequena amostra da medula óssea para análise. É feito com anestesia ou sedação, conforme a equipe decidir." },
  { termo: "Punção lombar", texto: "Procedimento que coleta um pouco do líquido que envolve a medula espinhal, nas costas. Também pode ser usado para aplicar medicamento." },
  { termo: "Biópsia", texto: "Retirada de um pequeno pedaço de tecido para análise em laboratório. Ajuda a confirmar o diagnóstico." },
  { termo: "Estadiamento", texto: "Conjunto de exames que mostra o tamanho e a extensão da doença. Ajuda a equipe a escolher o tratamento." },
  { termo: "Cateter", texto: "Tubo fino colocado em uma veia para receber medicamentos e coletar sangue sem precisar furar a criança a cada vez." },
  { termo: "Remissão", texto: "Quando os exames não mostram mais sinais da doença. O acompanhamento continua por um bom tempo depois disso." },
  { termo: "Recidiva", texto: "Quando a doença volta depois de um período de remissão. A equipe explica os próximos passos em cada caso." },
  { termo: "Hospital-dia", texto: "Atendimento em que a criança recebe o tratamento e volta para casa no mesmo dia." },
  { termo: "Equipe multiprofissional", texto: "Profissionais de várias áreas que acompanham a criança juntos: medicina, enfermagem, psicologia, nutrição, fisioterapia e serviço social." },
  { termo: "Cuidados paliativos", texto: "Cuidados que aliviam sintomas e dão conforto em qualquer fase do tratamento, não só no fim. Podem caminhar junto com o tratamento da doença." },
];

export const DICAS = [
  { titulo: "Uma pasta para tudo", texto: "Guarde laudos, receitas e documentos numa pasta só, em ordem de data. Facilita consultas e pedidos de benefício.", tema: "Organização" },
  { titulo: "Dúvidas por escrito", texto: "Anote as perguntas que surgem durante a semana e leve a lista para a consulta. Na hora, é comum esquecer.", tema: "Consultas" },
  { titulo: "Rotina possível", texto: "Manter horários de sono, refeição e brincadeira, dentro do que o tratamento permite, ajuda a criança a se sentir segura.", tema: "Rotina" },
  { titulo: "Explicar com verdade", texto: "Crianças percebem quando algo muda. A psicologia do hospital pode ajudar a escolher palavras adequadas para cada idade.", tema: "Conversa" },
  { titulo: "Escola por perto", texto: "Muitos hospitais têm classe hospitalar. Pergunte à equipe como manter o vínculo com a escola durante o tratamento.", tema: "Escola" },
  { titulo: "Seus direitos", texto: "O serviço social do hospital orienta sobre transporte, benefícios e afastamento do trabalho. Vale procurar logo no início.", tema: "Direitos" },
  { titulo: "Irmãos também sentem", texto: "Incluir os irmãos na rotina, com tarefas e tempo a sós, ajuda a família inteira a atravessar o período.", tema: "Família" },
  { titulo: "Quem cuida precisa de cuidado", texto: "Dividir tarefas, aceitar ajuda e ter um momento para si não é egoísmo. É o que permite seguir cuidando.", tema: "Cuidador" },
];

export const DUVIDAS = [
  { pergunta: "Onde encontro as informações do tratamento do meu filho?", resposta: "Na Agenda ficam os compromissos que a equipe registrou. Detalhes do tratamento, como medicamentos e resultados de exames, devem ser conversados diretamente com a equipe que acompanha a criança." },
  { pergunta: "Posso adicionar compromissos na agenda?", resposta: "Sim. Use \"Novo compromisso\" para anotar consultas, exames ou lembretes. Nesta demonstração, esses registros ficam só no seu aparelho. Dá para enviar tudo para o calendário do celular com \"Adicionar ao calendário\"." },
  { pergunta: "O que significa uma palavra que ouvi na consulta?", resposta: "Procure no Glossário. Ele explica termos comuns em linguagem simples, mas não substitui a explicação da equipe sobre o caso da criança." },
  { pergunta: "A criança está com febre ou um sintoma novo. O que faço?", resposta: "O Valentes não avalia sintomas. Siga as orientações que a equipe deu para esse tipo de situação e entre em contato com o hospital pelo canal informado por eles. Em emergência, ligue 192 (SAMU)." },
  { pergunta: "Posso mudar a dose ou o horário de um remédio?", resposta: "Não faça mudanças por conta própria. Qualquer ajuste em medicamentos precisa ser combinado com a equipe que acompanha a criança." },
  { pergunta: "Como converso com outras famílias?", resposta: "A conexão entre famílias faz parte da proposta, mas não está ativa nesta demonstração. Enquanto isso, o serviço social do hospital costuma conhecer grupos de apoio da região." },
  { pergunta: "Quem vê os dados da criança?", resposta: "Na proposta, a equipe médica acessa o prontuário e a família acessa a agenda e as informações gerais. Órgãos públicos receberiam apenas dados agregados, sem identificação." },
];

/* ---------- Painel institucional (agregados fictícios) ---------- */
export const REGIOES: Regiao[] = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"];

/** Casos ativos fictícios por UF (sigla, código IBGE, região, casos). */
export const CASOS_UF: { sigla: string; codigo: string; regiao: Regiao; casos: number }[] = [
  { sigla: "RO", codigo: "11", regiao: "Norte", casos: 14 }, { sigla: "AC", codigo: "12", regiao: "Norte", casos: 9 },
  { sigla: "AM", codigo: "13", regiao: "Norte", casos: 41 }, { sigla: "RR", codigo: "14", regiao: "Norte", casos: 6 },
  { sigla: "PA", codigo: "15", regiao: "Norte", casos: 52 }, { sigla: "AP", codigo: "16", regiao: "Norte", casos: 8 },
  { sigla: "TO", codigo: "17", regiao: "Norte", casos: 25 },
  { sigla: "MA", codigo: "21", regiao: "Nordeste", casos: 54 }, { sigla: "PI", codigo: "22", regiao: "Nordeste", casos: 29 },
  { sigla: "CE", codigo: "23", regiao: "Nordeste", casos: 86 }, { sigla: "RN", codigo: "24", regiao: "Nordeste", casos: 40 },
  { sigla: "PB", codigo: "25", regiao: "Nordeste", casos: 37 }, { sigla: "PE", codigo: "26", regiao: "Nordeste", casos: 104 },
  { sigla: "AL", codigo: "27", regiao: "Nordeste", casos: 31 }, { sigla: "SE", codigo: "28", regiao: "Nordeste", casos: 22 },
  { sigla: "BA", codigo: "29", regiao: "Nordeste", casos: 118 },
  { sigla: "MG", codigo: "31", regiao: "Sudeste", casos: 189 }, { sigla: "ES", codigo: "32", regiao: "Sudeste", casos: 26 },
  { sigla: "RJ", codigo: "33", regiao: "Sudeste", casos: 142 }, { sigla: "SP", codigo: "35", regiao: "Sudeste", casos: 331 },
  { sigla: "PR", codigo: "41", regiao: "Sul", casos: 89 }, { sigla: "SC", codigo: "42", regiao: "Sul", casos: 56 },
  { sigla: "RS", codigo: "43", regiao: "Sul", casos: 102 },
  { sigla: "MS", codigo: "50", regiao: "Centro-Oeste", casos: 32 }, { sigla: "MT", codigo: "51", regiao: "Centro-Oeste", casos: 41 },
  { sigla: "GO", codigo: "52", regiao: "Centro-Oeste", casos: 63 }, { sigla: "DF", codigo: "53", regiao: "Centro-Oeste", casos: 47 },
];

/** Por região: novos casos/mês (12 meses), curados, estágio na chegada (%) e participação por grupo (%). */
export const PAINEL: Record<Regiao, { novos: number[]; curados: number; estagio: number[]; grupos: number[] }> = {
  "Norte":        { novos: [9, 11, 8, 12, 10, 13, 11, 9, 12, 14, 10, 12], curados: 74, estagio: [22, 31, 41, 6], grupos: [41, 16, 18, 25] },
  "Nordeste":     { novos: [31, 28, 34, 30, 36, 33, 29, 35, 38, 32, 34, 37], curados: 296, estagio: [29, 34, 31, 6], grupos: [40, 17, 17, 26] },
  "Centro-Oeste": { novos: [12, 14, 11, 13, 15, 12, 16, 14, 13, 15, 17, 14], curados: 118, estagio: [33, 35, 27, 5], grupos: [38, 18, 17, 27] },
  "Sudeste":      { novos: [52, 49, 55, 58, 51, 54, 60, 57, 53, 59, 56, 61], curados: 612, estagio: [38, 34, 24, 4], grupos: [38, 17, 18, 27] },
  "Sul":          { novos: [19, 21, 18, 22, 20, 23, 21, 19, 24, 22, 20, 23], curados: 231, estagio: [40, 33, 23, 4], grupos: [38, 17, 18, 27] },
};
export const ESTAGIOS = ["Inicial", "Intermediário", "Avançado", "Sem informação"];

export const ENCAMINHAMENTOS: { unidade: string; tipo: string; regiao: Regiao; total: number }[] = [
  { unidade: "UBS Vila Esperança", tipo: "Atenção básica", regiao: "Sudeste", total: 34 },
  { unidade: "UPA Jardim das Flores", tipo: "Urgência", regiao: "Sudeste", total: 27 },
  { unidade: "Policlínica Mangueiral", tipo: "Ambulatório de especialidades", regiao: "Nordeste", total: 22 },
  { unidade: "UBS Rio Claro", tipo: "Atenção básica", regiao: "Sul", total: 19 },
  { unidade: "Hospital Regional do Cerrado", tipo: "Hospital geral", regiao: "Centro-Oeste", total: 17 },
  { unidade: "UBS Beira-Rio", tipo: "Atenção básica", regiao: "Norte", total: 14 },
  { unidade: "Clínica pediátrica particular", tipo: "Rede privada", regiao: "Sudeste", total: 12 },
  { unidade: "UPA Maré Alta", tipo: "Urgência", regiao: "Nordeste", total: 11 },
];

/** Referência real citada no pitch: INCA, RHC 2012-2017. Tempo médio em dias. */
export const INCA = [
  { grupo: "Leucemias", consultaDiagnostico: "4,97", diagnosticoTratamento: "5,33", consultaTratamento: "10" },
  { grupo: "Linfomas", consultaDiagnostico: "13,8", diagnosticoTratamento: "17,23", consultaTratamento: "31" },
  { grupo: "SNC", consultaDiagnostico: "20", diagnosticoTratamento: "10", consultaTratamento: "29" },
  { grupo: "Tumores sólidos", consultaDiagnostico: "15,88", diagnosticoTratamento: "11,59", consultaTratamento: "27,5" },
];
