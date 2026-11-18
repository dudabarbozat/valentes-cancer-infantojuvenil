"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import type { Paciente } from "@/lib/dados";
import { useEstado } from "@/lib/estado";
import { resumoDaFicha } from "@/lib/resumo";
import { data, dataCurta, diasAte, diaSemana, hojeIso, hospital, MESES_LONGOS, novoId, relativo, SEMANA, tempoDoenca } from "@/lib/util";
import { Carregando, FaixaFicticia } from "../comum";
import { Icone, type NomeIcone } from "../Icone";
import s from "./medico.module.css";

interface Evento { data: string; icone: NomeIcone; classe: string; titulo: string; detalhe: string; pendente?: boolean }

function linhaDoTempo(p: Paciente): Evento[] {
  const ev: Evento[] = [
    ...p.exames.map((x) => ({ data: x.data, icone: "exame" as const, classe: s.evExame ?? "", titulo: x.tipo, detalhe: x.resultado, pendente: x.resultado === "Aguardando laudo" })),
    ...p.anotacoes.map((a) => ({ data: a.data, icone: "nota" as const, classe: s.evNota ?? "", titulo: "Anotação da equipe", detalhe: a.texto })),
    ...p.procedimentos.filter((x) => x.realizado).map((x) => ({ data: x.dataRealizado ?? x.data, icone: "calendario" as const, classe: s.evProc ?? "", titulo: x.tipo, detalhe: "Procedimento marcado como realizado" })),
    { data: p.dataDiagnostico, icone: "marco", classe: s.evMarco ?? "", titulo: "Diagnóstico registrado", detalhe: p.diagnostico },
  ];
  return ev.sort((a, b) => b.data.localeCompare(a.data));
}

function Calendario({ p }: { p: Paciente }) {
  const h = new Date();
  const [mes, setMes] = useState({ ano: h.getFullYear(), mes: h.getMonth() });
  const primeiro = new Date(mes.ano, mes.mes, 1, 12).getDay();
  const dias = new Date(mes.ano, mes.mes + 1, 0, 12).getDate();
  const hoje = hojeIso();
  const mover = (n: number) => setMes((m) => { const t = m.mes + n; return { ano: m.ano + Math.floor(t / 12), mes: ((t % 12) + 12) % 12 }; });
  return (
    <div className={s.cal}>
      <div className={s.calTopo}>
        <button type="button" className="botao-icone" onClick={() => mover(-1)} aria-label="Mês anterior"><Icone nome="voltar" /></button>
        <strong aria-live="polite">{MESES_LONGOS[mes.mes]} {mes.ano}</strong>
        <button type="button" className="botao-icone" onClick={() => mover(1)} aria-label="Próximo mês"><Icone nome="seta" /></button>
      </div>
      <div className={s.calGrade} aria-hidden="true">{SEMANA.map((d) => <span key={d} className={s.calSem}>{d.charAt(0).toUpperCase()}</span>)}</div>
      <div className={s.calGrade}>
        {Array.from({ length: primeiro }, (_, i) => <span key={`v${i}`} />)}
        {Array.from({ length: dias }, (_, i) => {
          const d = `${mes.ano}-${String(mes.mes + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
          const itens = p.procedimentos.filter((x) => x.data === d);
          const feito = itens.length > 0 && itens.every((x) => x.realizado);
          const cls = [s.calDia, d === hoje ? s.calHoje : "", itens.length ? (feito ? s.calFeito : s.calMarcado) : ""].join(" ");
          const rot = `${i + 1} de ${MESES_LONGOS[mes.mes]}${itens.length ? `: ${itens.map((x) => x.tipo).join(", ")}` : ""}${d === hoje ? " (hoje)" : ""}`;
          return itens.length || d === hoje
            ? <span key={d} className={cls} role="img" aria-label={rot}>{i + 1}</span>
            : <span key={d} className={cls} aria-hidden="true">{i + 1}</span>;
        })}
      </div>
      <p className={s.calLegenda}><span className={s.ponto} /> agendado <span className={`${s.ponto} ${s.pontoFeito}`} /> realizado</p>
    </div>
  );
}

function ResumoFicha({ p }: { p: Paciente }) {
  // Recalculado a cada alteração da ficha (anotação, procedimento realizado).
  const resumo = resumoDaFicha(p);
  return (
    <section className={s.resumoIa} aria-labelledby="t-resumo">
      <div className={s.resumoTopo}>
        <h2 id="t-resumo">Resumo da ficha</h2>
        {resumo.pendencias.length > 0 && <span className="selo selo--pendente">{resumo.pendencias.length} {resumo.pendencias.length === 1 ? "pendência" : "pendências"}</span>}
      </div>
      <div className={s.resumoCorpo}>
        <p>{resumo.sintese}</p>
        <div className={s.resumoListas}>
          <div>
            <h3>Pendências</h3>
            {resumo.pendencias.length ? <ul className="lista-quadrada">{resumo.pendencias.map((t) => <li key={t}>{t}</li>)}</ul> : <p className={s.resumoVazio}>Nenhuma pendência registrada.</p>}
          </div>
          <div>
            <h3>Próximos</h3>
            {resumo.proximos.length ? <ul className="lista-quadrada">{resumo.proximos.map((t) => <li key={t}>{t}</li>)}</ul> : <p className={s.resumoVazio}>Nada agendado.</p>}
          </div>
        </div>
        <p className={s.resumoAviso}><Icone nome="alerta" />Montado a partir dos registros desta ficha: laudos aguardando, procedimentos sem marcação e próxima agenda. Apoio à leitura, não substitui avaliação clínica.</p>
      </div>
    </section>
  );
}

export function FichaPaciente({ codigo }: { codigo: string }) {
  const { estado, alterar, avisar } = useEstado();
  const [nota, setNota] = useState("");
  const [erroNota, setErroNota] = useState("");

  if (!estado) return <Carregando texto="Carregando ficha" />;
  const p = estado.pacientes.find((x) => x.codigo === codigo);
  if (!p) {
    return (
      <section className="vazio-pagina">
        <h1>Paciente não encontrado</h1>
        <p>Não há paciente com o código {codigo} nesta demonstração.</p>
        <Link className="botao" href="/medico/">Ver lista de pacientes</Link>
      </section>
    );
  }
  const h = hospital(p.hospital);
  const procs = [...p.procedimentos].sort((a, b) => a.data.localeCompare(b.data));

  function registrar(e: FormEvent) {
    e.preventDefault();
    const t = nota.trim();
    if (t.length < 3) { setErroNota("Escreva a anotação antes de registrar."); return; }
    alterar((r) => { r.pacientes.find((x) => x.codigo === codigo)?.anotacoes.push({ id: novoId("an"), data: hojeIso(), texto: t }); });
    setNota(""); setErroNota("");
    avisar("Anotação registrada.");
  }

  function alternar(id: string) {
    let feito = false;
    alterar((r) => {
      const x = r.pacientes.find((y) => y.codigo === codigo)?.procedimentos.find((y) => y.id === id);
      if (!x) return;
      x.realizado = !x.realizado;
      feito = x.realizado;
      x.dataRealizado = x.realizado ? (diasAte(x.data) > 0 ? hojeIso() : x.data) : undefined;
    });
    setTimeout(() => avisar(feito ? "Procedimento marcado como realizado." : "Marcação desfeita."), 0);
  }

  return (
    <div className="pagina">
      <Link className="voltar" href="/medico/"><Icone nome="voltar" />Pacientes</Link>
      <header className={s.fichaCabeca}>
        <div>
          <span className="codigo codigo--grande">{p.codigo}</span>
          <h1>Paciente {p.iniciais}</h1>
          <p className="pagina__sub">{p.idade} anos · {p.sexo === "F" ? "feminino" : "masculino"}</p>
        </div>
        <span className={`selo ${p.status === "Em tratamento" ? "selo--ativo" : "selo--neutro"}`}>{p.status}</span>
      </header>
      <FaixaFicticia>Ficha inventada para mostrar o fluxo da equipe médica.</FaixaFicticia>
      <dl className={s.resumo}>
        <div><dt>Diagnóstico</dt><dd>{p.diagnostico}</dd></div>
        <div><dt>Fase atual</dt><dd>{p.fase}</dd></div>
        <div><dt>Tempo de doença</dt><dd>{tempoDoenca(p.dataDiagnostico)}<small>desde {data(p.dataDiagnostico)}</small></dd></div>
        <div><dt>Local de tratamento</dt><dd>{h.nome}<small>{h.cidade}/{h.uf}</small></dd></div>
      </dl>

      <ResumoFicha p={p} />

      <div className={s.grade}>
        <section className="bloco" aria-labelledby="t-linha">
          <h2 id="t-linha">Linha do tempo</h2>
          <form className={s.novaNota} onSubmit={registrar} noValidate>
            <label htmlFor="nota-texto">Nova anotação</label>
            <textarea id="nota-texto" rows={2} maxLength={400} value={nota} placeholder="Registro para a equipe. Fica salvo neste navegador."
              aria-invalid={Boolean(erroNota)} aria-describedby="nota-erro"
              onChange={(e) => { setNota(e.target.value); if (erroNota) setErroNota(""); }} />
            <div className={s.notaRodape}>
              <p id="nota-erro" className="campo__erro" role="alert">{erroNota}</p>
              <span className={s.contador}>{nota.length}/400</span>
              <button className="botao botao--pequeno" type="submit"><Icone nome="mais" />Registrar</button>
            </div>
          </form>
          <ol className={s.linhaTempo}>
            {linhaDoTempo(p).map((e, i) => (
              <li key={`${e.data}-${i}`} className={`${s.evento} ${e.classe}`}>
                <span className={s.evIcone}><Icone nome={e.icone} /></span>
                <div className={s.evCorpo}>
                  <time dateTime={e.data}>{data(e.data)}</time>
                  <strong>{e.titulo}</strong>
                  <span className={s.evDetalhe}>{e.detalhe} {e.pendente && <span className="selo selo--pendente">pendente</span>}</span>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className={s.lateral}>
          <section className="bloco" aria-labelledby="t-cal">
            <h2 id="t-cal">Calendário de procedimentos</h2>
            <Calendario p={p} />
            <ul className={s.procs}>
              {procs.map((x) => (
                <li key={x.id} className={x.realizado ? s.procFeito : ""}>
                  <div className={s.procData}><span>{diaSemana(x.data)}</span><strong>{dataCurta(x.data)}</strong></div>
                  <div className={s.procInfo}><strong>{x.tipo}</strong><span>{x.hora} · {x.realizado ? "realizado" : relativo(x.data)}</span></div>
                  {x.realizado
                    ? <button type="button" className="botao-icone botao-icone--feito" onClick={() => alternar(x.id)} aria-label={`Desmarcar ${x.tipo} de ${data(x.data)}`}><Icone nome="check" /></button>
                    : <button type="button" className="botao botao--contorno botao--pequeno" onClick={() => alternar(x.id)} aria-label={`Marcar ${x.tipo} de ${data(x.data)} como realizado`}>Realizado</button>}
                </li>
              ))}
            </ul>
          </section>
          <section className="bloco" aria-labelledby="t-med">
            <h2 id="t-med">Medicamentos</h2>
            <ul className={s.meds}>
              {p.medicamentos.map((m) => (
                <li key={m.id}>
                  <span className={s.medIcone}><Icone nome="remedio" /></span>
                  <div><strong>{m.nome}</strong><span>desde {data(m.desde)}</span></div>
                  <span className={`selo ${m.situacao === "Em uso" ? "selo--ativo" : m.situacao === "Suspenso" ? "selo--pendente" : "selo--neutro"}`}>{m.situacao}</span>
                </li>
              ))}
            </ul>
            <p className="nota-rodape">Nomes genéricos e sem dose: a prescrição real fica no prontuário do hospital.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
