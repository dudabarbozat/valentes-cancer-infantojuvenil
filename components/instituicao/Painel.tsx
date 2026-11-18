"use client";

import { ArcElement, BarElement, CategoryScale, Chart, Legend, LinearScale, Tooltip, type ChartOptions } from "chart.js";
import { useEffect, useMemo, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { CASOS_UF, ENCAMINHAMENTOS, ESTAGIOS, GRUPOS, INCA, PAINEL, REGIOES, type Regiao } from "@/lib/dados";
import { carregarEstados } from "@/lib/ibge";
import { baixar, fmt, MESES } from "@/lib/util";
import { FaixaFicticia } from "../comum";
import { Icone } from "../Icone";
import { MapaBrasil } from "./MapaBrasil";
import s from "./instituicao.module.css";

Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);
Chart.defaults.color = "#1B2529";

const COR = { laranja: "#F18B0E", amarelo: "#F1B440", marinho: "#2D3D56", cinza: "#BDB4A3", grade: "#E8DDCA" };
const soma = (a: number[]) => a.reduce((x, y) => x + y, 0);

function agregado(r: Regiao | "") {
  const regs = r ? [r] : REGIOES;
  const novos = Array<number>(12).fill(0);
  let curados = 0, peso = 0;
  const estagio = [0, 0, 0, 0];
  const grupos = [0, 0, 0, 0];
  let tratamento = 0;
  for (const nome of regs) {
    const p = PAINEL[nome];
    const ativos = soma(CASOS_UF.filter((u) => u.regiao === nome).map((u) => u.casos));
    const w = soma(p.novos);
    peso += w; tratamento += ativos; curados += p.curados;
    p.novos.forEach((n, i) => { novos[i] = (novos[i] ?? 0) + n; });
    p.estagio.forEach((n, i) => { estagio[i] = (estagio[i] ?? 0) + n * w; });
    p.grupos.forEach((n, i) => { grupos[i] = (grupos[i] ?? 0) + Math.round((n * ativos) / 100); });
  }
  return { novos, curados, tratamento, estagio: estagio.map((n) => Math.round(n / peso)), grupos };
}

function rotulosMeses() {
  const h = new Date();
  return Array.from({ length: 12 }, (_, k) => {
    const d = new Date(h.getFullYear(), h.getMonth() - (11 - k), 1);
    return `${MESES[d.getMonth()]}${d.getMonth() === 0 || k === 0 ? `/${String(d.getFullYear()).slice(2)}` : ""}`;
  });
}

function exportarCsv(nomes: Record<string, string>) {
  const linhas: (string | number)[][] = [["nivel", "nome", "regiao", "casos_ativos", "novos_12_meses", "curados", "estagio_avancado_pct", "origem"]];
  for (const r of REGIOES) {
    const a = agregado(r);
    linhas.push(["regiao", r, r, a.tratamento, soma(a.novos), a.curados, a.estagio[2] ?? 0, "ficticio"]);
  }
  for (const u of CASOS_UF) linhas.push(["uf", nomes[u.sigla] ?? u.sigla, u.regiao, u.casos, "", "", "", "ficticio"]);
  const csv = "﻿" + linhas.map((l) => l.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";")).join("\r\n");
  baixar("valentes-indicadores-ficticios.csv", csv, "text/csv;charset=utf-8");
}

export function Painel() {
  const [regiao, setRegiao] = useState<Regiao | "">("");
  const [nomes, setNomes] = useState<Record<string, string>>({});
  const [regs, setRegs] = useState<Record<string, string>>({});
  const [ibge, setIbge] = useState<"carregando" | "ok" | "erro">("carregando");
  const [exportado, setExportado] = useState(false);
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
    setMontado(true);
    carregarEstados()
      .then((lista) => {
        setNomes(Object.fromEntries(lista.map((e) => [e.sigla, e.nome])));
        setRegs(Object.fromEntries(lista.map((e) => [e.sigla, e.regiao.nome])));
        setIbge("ok");
      })
      .catch(() => setIbge("erro"));
  }, []);

  const a = useMemo(() => agregado(regiao), [regiao]);
  const nomeRegiao = regiao || "Brasil";
  const ativosRegiao = REGIOES.map((r) => soma(CASOS_UF.filter((u) => u.regiao === r).map((u) => u.casos)));
  const ufs = CASOS_UF.filter((u) => !regiao || u.regiao === regiao).sort((x, y) => y.casos - x.casos);
  const enc = ENCAMINHAMENTOS.filter((u) => !regiao || u.regiao === regiao);

  const eixos: ChartOptions<"bar">["scales"] = {
    x: { grid: { display: false }, border: { color: COR.grade } },
    y: { beginAtZero: true, grid: { color: COR.grade }, border: { display: false }, ticks: { precision: 0 } },
  };
  const base = { responsive: true, maintainAspectRatio: false, animation: { duration: 250 }, plugins: { legend: { display: false } } } as const;

  return (
    <div className="pagina">
      <header className="pagina__cabeca">
        <div>
          <p className="sobretitulo">Instituição</p>
          <h1>Painel de casos</h1>
          <p className="pagina__sub">Dados agregados, sem identificação de pacientes. Últimos 12 meses.</p>
        </div>
        <div className={s.acoes}>
          <div className="campo">
            <label htmlFor="i-regiao">Região</label>
            <select id="i-regiao" value={regiao} onChange={(e) => setRegiao(e.target.value as Regiao | "")}>
              <option value="">Brasil, todas</option>
              {REGIOES.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <button type="button" className="botao" onClick={() => { exportarCsv(nomes); setExportado(true); setTimeout(() => setExportado(false), 2500); }}>
            <Icone nome={exportado ? "check" : "baixar"} />{exportado ? "CSV gerado" : "Exportar CSV"}
          </button>
        </div>
      </header>
      <FaixaFicticia>Indicadores, unidades e contagens inventados. Só a malha do mapa, os nomes dos estados (IBGE) e a tabela do INCA são reais.</FaixaFicticia>

      <dl className={s.kpis}>
        <div className={s.kpi}><dt>Novos casos</dt><dd><strong>{fmt(soma(a.novos))}</strong><span>em 12 meses · {nomeRegiao}</span></dd></div>
        <div className={s.kpi}><dt>Em tratamento</dt><dd><strong>{fmt(a.tratamento)}</strong><span>casos ativos hoje</span></dd></div>
        <div className={s.kpi}><dt>Curados</dt><dd><strong>{fmt(a.curados)}</strong><span>fora de tratamento, em acompanhamento</span></dd></div>
        <div className={`${s.kpi} ${s.kpiAlerta}`}><dt>Chegam em estágio avançado</dt><dd><strong>{a.estagio[2]}%</strong><span>dos casos novos</span></dd></div>
      </dl>

      <section className={`bloco ${s.blocoMapa}`} aria-labelledby="t-mapa">
        <div className={s.blocoTopo}>
          <h2 id="t-mapa">Casos ativos por estado</h2>
          {ibge === "erro" && <span className="selo selo--pendente">Nomes dos estados indisponíveis no IBGE agora; mostrando siglas</span>}
        </div>
        <MapaBrasil regiao={regiao} nomes={nomes} regioes={regs} />
      </section>

      <div className={s.paineis}>
        <section className={`bloco ${s.largo}`} aria-labelledby="g1-t">
          <h2 id="g1-t">Novos casos por mês</h2>
          <div className={s.grafico} role="img" aria-label={`Novos casos por mês, ${nomeRegiao}: ${a.novos.join(", ")}`}>
            {montado && <Bar data={{ labels: rotulosMeses(), datasets: [{ label: "Novos casos", data: a.novos, backgroundColor: COR.laranja, maxBarThickness: 34 }] }} options={{ ...base, scales: eixos }} />}
          </div>
        </section>
        <section className="bloco" aria-labelledby="g2-t">
          <h2 id="g2-t">Casos ativos por região</h2>
          <div className={s.grafico} role="img" aria-label={`Casos em tratamento por região: ${REGIOES.map((r, i) => `${r} ${ativosRegiao[i]}`).join(", ")}`}>
            {montado && <Bar data={{ labels: REGIOES, datasets: [{ label: "Em tratamento", data: ativosRegiao, maxBarThickness: 22, backgroundColor: REGIOES.map((r) => (!regiao || r === regiao ? COR.laranja : COR.cinza)) }] }}
              options={{ ...base, indexAxis: "y", scales: { x: { beginAtZero: true, grid: { color: COR.grade }, border: { display: false } }, y: { grid: { display: false } } } }} />}
          </div>
        </section>
        <section className="bloco" aria-labelledby="g3-t">
          <h2 id="g3-t">Estágio na chegada</h2>
          <div className={s.grafico} role="img" aria-label={`Estágio na chegada, ${nomeRegiao}: ${ESTAGIOS.map((e, i) => `${e} ${a.estagio[i]}%`).join(", ")}`}>
            {montado && <Doughnut data={{ labels: ESTAGIOS, datasets: [{ data: a.estagio, backgroundColor: [COR.marinho, COR.amarelo, COR.laranja, COR.cinza], borderColor: "#F8F5EF", borderWidth: 2 }] }}
              options={{ responsive: true, maintainAspectRatio: false, cutout: "62%", animation: { duration: 250 },
                plugins: { legend: { position: "bottom", labels: { boxWidth: 10, boxHeight: 10, padding: 10 } }, tooltip: { callbacks: { label: (c) => ` ${c.label}: ${c.parsed}%` } } } }} />}
          </div>
        </section>
        <section className="bloco" aria-labelledby="g4-t">
          <h2 id="g4-t">Em tratamento por grupo</h2>
          <div className={s.grafico} role="img" aria-label={`Casos em tratamento por grupo, ${nomeRegiao}: ${GRUPOS.map((g, i) => `${g} ${a.grupos[i]}`).join(", ")}`}>
            {montado && <Bar data={{ labels: ["Leucemias", "Linfomas", "SNC", "Sólidos"], datasets: [{ label: "Em tratamento", data: a.grupos, backgroundColor: COR.amarelo, maxBarThickness: 40 }] }} options={{ ...base, scales: eixos }} />}
          </div>
        </section>
        <section className="bloco" aria-labelledby="t-uf">
          <h2 id="t-uf">Onde são tratados</h2>
          <div className={s.tabelaRolagem}>
            <table className="tabela">
              <thead><tr><th scope="col">Estado</th><th scope="col">Região</th><th scope="col" className="num">Casos ativos</th></tr></thead>
              <tbody>{ufs.map((u) => <tr key={u.sigla}><th scope="row">{nomes[u.sigla] ?? u.sigla}</th><td>{regs[u.sigla] ?? u.regiao}</td><td className="num">{fmt(u.casos)}</td></tr>)}</tbody>
            </table>
          </div>
        </section>
        <section className={`bloco ${s.largo}`} aria-labelledby="t-enc">
          <h2 id="t-enc">Unidades que mais encaminharam</h2>
          {enc.length ? (
            <div className={s.tabelaRolagem}>
              <table className="tabela">
                <thead><tr><th scope="col">Unidade</th><th scope="col">Tipo</th><th scope="col">Região</th><th scope="col" className="num">Encaminhamentos</th></tr></thead>
                <tbody>{enc.map((u) => <tr key={u.unidade}><th scope="row">{u.unidade}</th><td>{u.tipo}</td><td>{u.regiao}</td><td className="num">{u.total}</td></tr>)}</tbody>
              </table>
            </div>
          ) : <p className="vazio">Sem encaminhamentos registrados nesta região.</p>}
        </section>
      </div>

      <section className={s.referencia} aria-labelledby="t-inca">
        <div className={s.refCabeca}>
          <p className="sobretitulo">Referência real</p>
          <h2 id="t-inca">O atraso no diagnóstico e no tratamento</h2>
          <p>Tempo entre a 1ª consulta e o tratamento, em dias, por grupo de diagnóstico. É o atraso que uma base compartilhada pretende encurtar.</p>
        </div>
        <div className={s.linhaInca} aria-hidden="true"><span>1ª consulta</span><span>Diagnóstico</span><span>Tratamento</span></div>
        <div className={s.inca}>
          {([
            ["consultaDiagnostico", "Tempo médio entre a 1ª consulta e o diagnóstico (dias)"],
            ["diagnosticoTratamento", "Tempo médio entre o diagnóstico e o tratamento (dias)"],
            ["consultaTratamento", "Tempo médio entre a 1ª consulta e o tratamento (dias)"],
          ] as const).map(([k, t], i) => (
            <div key={k} className={i === 2 ? s.incaTotal : ""}>
              <h3>{t}</h3>
              <dl>{INCA.map((r) => <div key={r.grupo}><dt>{r.grupo}</dt><dd>{r[k]}</dd></div>)}</dl>
            </div>
          ))}
        </div>
        <p className={s.fonte}>Fonte: INCA, Registros Hospitalares de Câncer (RHC), 2012-2017, conforme citado no pitch original.</p>
      </section>
    </div>
  );
}
