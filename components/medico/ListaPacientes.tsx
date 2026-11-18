"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { GRUPOS, HOSPITAIS, type Paciente } from "@/lib/dados";
import { useEstado } from "@/lib/estado";
import { dataCurta, diasAte, hospital, relativo, semAcento, tempoDoenca } from "@/lib/util";
import { Carregando, FaixaFicticia } from "../comum";
import { Icone } from "../Icone";
import s from "./medico.module.css";

type Filtros = { busca: string; grupo: string; hospital: string; status: string };
const VAZIO: Filtros = { busca: "", grupo: "", hospital: "", status: "" };
let memoria: Filtros = VAZIO; // mantém os filtros ao voltar da ficha

export function proximo(p: Paciente) {
  return p.procedimentos.filter((x) => !x.realizado && diasAte(x.data) >= 0).sort((a, b) => a.data.localeCompare(b.data))[0];
}
export const pendencias = (p: Paciente) =>
  p.exames.filter((e) => e.resultado === "Aguardando laudo").length + p.procedimentos.filter((x) => !x.realizado && diasAte(x.data) < 0).length;

export function ListaPacientes() {
  const { estado } = useEstado();
  const [f, setF] = useState<Filtros>(memoria);
  const mudar = (parcial: Partial<Filtros>) => { const n = { ...f, ...parcial }; memoria = n; setF(n); };

  const lista = useMemo(() => {
    if (!estado) return [];
    const termo = semAcento(f.busca.trim());
    return estado.pacientes
      .filter((p) => (!f.grupo || p.grupo === f.grupo) && (!f.hospital || p.hospital === f.hospital) && (!f.status || p.status === f.status))
      .filter((p) => !termo || semAcento([p.codigo, p.iniciais, p.diagnostico, p.grupo, hospital(p.hospital).nome].join(" ")).includes(termo))
      .sort((a, b) => (proximo(a)?.data ?? "9999").localeCompare(proximo(b)?.data ?? "9999"));
  }, [estado, f]);

  if (!estado) return <Carregando />;
  const total = estado.pacientes.length;
  const emTrat = estado.pacientes.filter((p) => p.status === "Em tratamento").length;
  const comPend = estado.pacientes.filter((p) => pendencias(p) > 0).length;
  const filtrando = f.busca || f.grupo || f.hospital || f.status;

  return (
    <div className="pagina">
      <header className="pagina__cabeca">
        <div>
          <p className="sobretitulo">Equipe médica</p>
          <h1>Pacientes</h1>
          <p className="pagina__sub">{total} pacientes · {emTrat} em tratamento · {comPend} com pendências</p>
        </div>
      </header>
      <FaixaFicticia>Pacientes identificados apenas por código e iniciais inventadas.</FaixaFicticia>

      <form className={s.filtros} role="search" onSubmit={(e) => e.preventDefault()}>
        <div className={`campo ${s.busca}`}>
          <label htmlFor="f-busca">Buscar</label>
          <div className="campo__busca">
            <Icone nome="busca" />
            <input id="f-busca" type="search" placeholder="Código, iniciais, diagnóstico ou hospital" value={f.busca} autoComplete="off"
              onChange={(e) => mudar({ busca: e.target.value })} />
          </div>
        </div>
        <div className="campo">
          <label htmlFor="f-grupo">Diagnóstico</label>
          <select id="f-grupo" value={f.grupo} onChange={(e) => mudar({ grupo: e.target.value })}>
            <option value="">Todos</option>
            {GRUPOS.map((g) => <option key={g}>{g}</option>)}
          </select>
        </div>
        <div className="campo">
          <label htmlFor="f-hospital">Local de tratamento</label>
          <select id="f-hospital" value={f.hospital} onChange={(e) => mudar({ hospital: e.target.value })}>
            <option value="">Todos</option>
            {HOSPITAIS.map((h) => <option key={h.id} value={h.id}>{h.nome} ({h.uf})</option>)}
          </select>
        </div>
        <div className="campo">
          <label htmlFor="f-status">Situação</label>
          <select id="f-status" value={f.status} onChange={(e) => mudar({ status: e.target.value })}>
            <option value="">Todas</option>
            <option>Em tratamento</option>
            <option>Acompanhamento</option>
          </select>
        </div>
      </form>

      <div className={s.listaTopo}>
        <p className="contagem" aria-live="polite">{filtrando ? `${lista.length} de ${total} pacientes` : "Ordenados pelo próximo procedimento"}</p>
        {filtrando && <button type="button" className="botao-texto" onClick={() => mudar(VAZIO)}>Limpar filtros</button>}
      </div>
      <div className={s.cabecaLista} aria-hidden="true"><span>Paciente</span><span>Diagnóstico</span><span>Tempo de doença</span><span>Local de tratamento</span><span>Próximo</span><span /></div>
      {lista.length ? (
        <ul className={s.pacientes}>
          {lista.map((p) => {
            const h = hospital(p.hospital);
            const prox = proximo(p);
            const pend = pendencias(p);
            return (
              <li key={p.codigo}>
                <Link className={s.paciente} href={`/medico/${p.codigo}/`}>
                  <span className={s.id}>
                    <span className="codigo">{p.codigo}</span>
                    <span className={s.iniciais}>{p.iniciais}</span>
                    <span className={s.meta}>{p.idade} anos · {p.sexo === "F" ? "feminino" : "masculino"}</span>
                    {pend > 0 && <span className="selo selo--pendente">{pend} {pend === 1 ? "pendência" : "pendências"}</span>}
                  </span>
                  <span><span className={s.rotuloMovel}>Diagnóstico</span>{p.diagnostico}<span className={s.meta}>{p.fase}</span></span>
                  <span><span className={s.rotuloMovel}>Tempo de doença</span>{tempoDoenca(p.dataDiagnostico)}</span>
                  <span className={s.largo}><span className={s.rotuloMovel}>Local de tratamento</span>{h.nome}<span className={s.meta}>{h.cidade}/{h.uf}</span></span>
                  <span className={s.largo}><span className={s.rotuloMovel}>Próximo</span>
                    {prox ? <>{prox.tipo}<span className={s.meta}>{relativo(prox.data)} · {dataCurta(prox.data)}</span></> : <span className={s.meta}>Nada agendado</span>}
                  </span>
                  <span className={s.seta}><Icone nome="seta" /></span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="vazio vazio--caixa">
          <strong>Nenhum paciente com esses filtros.</strong>{" "}
          <button type="button" className="botao-texto" onClick={() => mudar(VAZIO)}>Limpar filtros</button>
        </div>
      )}
    </div>
  );
}
