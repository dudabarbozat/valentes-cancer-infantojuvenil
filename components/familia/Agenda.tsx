"use client";

import { useRef, useState, type FormEvent } from "react";
import { CRIANCA_FAMILIA, type Compromisso } from "@/lib/dados";
import { useEstado } from "@/lib/estado";
import { gerarIcs } from "@/lib/ics";
import { baixar, dataCurta, diaSemana, hojeIso, hospital, MESES, novoId, paraData, relativo } from "@/lib/util";
import { AvisoEquipe, Carregando, FaixaFicticia } from "../comum";
import { Icone } from "../Icone";
import s from "./familia.module.css";

type Campos = { titulo: string; data: string; hora: string; local: string; nota: string };
type Erros = Partial<Record<keyof Campos, string>>;

function validar(c: Campos): Erros {
  const e: Erros = {};
  if (c.titulo.trim().length < 3) e.titulo = "Diga o que é o compromisso (mínimo 3 letras).";
  if (!c.data) e.data = "Escolha a data.";
  else if (c.data < hojeIso()) e.data = "A data já passou. Escolha hoje ou um dia seguinte.";
  if (c.hora && !/^([01]\d|2[0-3]):[0-5]\d$/.test(c.hora)) e.hora = "Use o formato 00:00.";
  return e;
}

function exportar(itens: Compromisso[], nome: string) {
  baixar(nome, gerarIcs(itens), "text/calendar;charset=utf-8");
}

function Item({ a, aoAlternar, aoRemover }: { a: Compromisso; aoAlternar: () => void; aoRemover: () => void }) {
  const d = paraData(a.data);
  return (
    <li className={`${s.compromisso}${a.feito ? ` ${s.feito}` : ""}`}>
      <div className={s.cData}><span>{diaSemana(a.data)}</span><strong>{d.getDate()}</strong><span>{MESES[d.getMonth()]}</span></div>
      <div className={s.cInfo}>
        <strong>{a.titulo}</strong>
        <span><Icone nome="relogio" />{a.hora ? `${a.hora} · ` : ""}{relativo(a.data)}</span>
        {a.local && <span><Icone nome="local" />{a.local}</span>}
        {a.nota && <span className={s.cNota}>{a.nota}</span>}
      </div>
      <div className={s.cAcoes}>
        <label className={s.marcar}><input type="checkbox" checked={a.feito} onChange={aoAlternar} /><span>Feito</span></label>
        {!a.feito && (
          <button type="button" className="botao-icone" onClick={() => exportar([a], `valentes-${a.data}.ics`)} aria-label={`Adicionar ${a.titulo} ao calendário`} title="Adicionar ao calendário">
            <Icone nome="calendario" />
          </button>
        )}
        {a.criadoPelaFamilia && (
          <button type="button" className="botao-icone" onClick={aoRemover} aria-label={`Remover ${a.titulo}`} title="Remover"><Icone nome="fechar" /></button>
        )}
      </div>
    </li>
  );
}

export function Agenda() {
  const { estado, alterar, avisar } = useEstado();
  const [aberto, setAberto] = useState(false);
  const [c, setC] = useState<Campos>({ titulo: "", data: "", hora: "", local: "", nota: "" });
  const [erros, setErros] = useState<Erros>({});
  const [tentou, setTentou] = useState(false);
  const botaoNovo = useRef<HTMLButtonElement>(null);
  const titulo = useRef<HTMLInputElement>(null);

  if (!estado) return <Carregando texto="Carregando agenda" />;
  const crianca = estado.pacientes.find((p) => p.codigo === CRIANCA_FAMILIA);
  const h = hospital(crianca?.hospital ?? "ipe");
  const hoje = hojeIso();
  const ordem = [...estado.agenda].sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));
  const proximos = ordem.filter((a) => a.data >= hoje && !a.feito);
  const anteriores = ordem.filter((a) => a.data < hoje || a.feito).reverse();
  const destaque = proximos[0];

  const mudar = (k: keyof Campos, v: string) => {
    const n = { ...c, [k]: v };
    setC(n);
    if (tentou) setErros(validar(n));
  };

  function abrir() {
    setAberto(true);
    setC({ titulo: "", data: hoje, hora: "", local: "", nota: "" });
    setErros({}); setTentou(false);
    setTimeout(() => titulo.current?.focus(), 0);
  }
  function fechar() { setAberto(false); botaoNovo.current?.focus(); }

  function salvar(e: FormEvent) {
    e.preventDefault();
    setTentou(true);
    const er = validar(c);
    setErros(er);
    if (Object.keys(er).length) {
      const primeiro = Object.keys(er)[0];
      document.getElementById(`c-${primeiro}`)?.focus();
      return;
    }
    alterar((r) => { r.agenda.push({ id: novoId("ag"), data: c.data, hora: c.hora, titulo: c.titulo.trim(), local: c.local.trim(), nota: c.nota.trim(), feito: false, criadoPelaFamilia: true }); });
    avisar("Compromisso salvo.");
    fechar();
  }

  const alternar = (id: string) => {
    let feito = false;
    alterar((r) => { const a = r.agenda.find((x) => x.id === id); if (a) { a.feito = !a.feito; feito = a.feito; } });
    setTimeout(() => avisar(feito ? "Marcado como feito." : "Voltou para os próximos."), 0);
  };
  const remover = (id: string) => { alterar((r) => { r.agenda = r.agenda.filter((x) => x.id !== id); }); avisar("Compromisso removido."); };

  const campo = (k: keyof Campos, rotulo: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, largo = false) => (
    <div className={`campo${largo ? ` ${s.largo}` : ""}`}>
      <label htmlFor={`c-${k}`}>{rotulo}</label>
      <input id={`c-${k}`} ref={k === "titulo" ? titulo : undefined} value={c[k]} onChange={(e) => mudar(k, e.target.value)}
        aria-invalid={Boolean(erros[k])} aria-describedby={erros[k] ? `e-${k}` : undefined} {...props} />
      {erros[k] && <p id={`e-${k}`} className="campo__erro">{erros[k]}</p>}
    </div>
  );

  return (
    <div className="pagina pagina--estreita">
      <header className="pagina__cabeca">
        <div>
          <p className="sobretitulo">Família</p>
          <h1>Agenda</h1>
          <p className="pagina__sub">Acompanhando a criança {crianca?.iniciais} ({CRIANCA_FAMILIA}) · {h.nome}</p>
        </div>
      </header>
      <FaixaFicticia>A criança, a família e os compromissos são inventados.</FaixaFicticia>

      {destaque && (
        <section className={s.destaque} aria-labelledby="t-prox">
          <p className="sobretitulo" id="t-prox">Próximo compromisso</p>
          <p className={s.dQuando}>{relativo(destaque.data).replace(/^./, (x) => x.toUpperCase())}, {diaSemana(destaque.data)} {dataCurta(destaque.data)}{destaque.hora ? ` às ${destaque.hora}` : ""}</p>
          <p className={s.dTitulo}>{destaque.titulo}</p>
          {destaque.local && <p className={s.dLocal}><Icone nome="local" />{destaque.local}</p>}
          {destaque.nota && <p className={s.dNota}>{destaque.nota}</p>}
        </section>
      )}

      <div className={s.secaoTopo}>
        <h2>Próximos</h2>
        <div className={s.secaoAcoes}>
          {proximos.length > 0 && (
            <button type="button" className="botao botao--contorno botao--pequeno" onClick={() => { exportar(proximos, "valentes-agenda.ics"); avisar("Arquivo de calendário gerado."); }}>
              <Icone nome="baixar" />Adicionar ao calendário
            </button>
          )}
          <button ref={botaoNovo} type="button" className="botao botao--pequeno" aria-expanded={aberto} aria-controls="form-compromisso" onClick={() => (aberto ? fechar() : abrir())}>
            <Icone nome="mais" />Novo compromisso
          </button>
        </div>
      </div>
      <p className={s.dicaIcs}>O arquivo .ics abre no calendário do celular ou do computador e cria lembretes duas horas antes.</p>

      {aberto && (
        <form id="form-compromisso" className={s.form} onSubmit={salvar} noValidate aria-label="Novo compromisso">
          {campo("titulo", "O quê", { maxLength: 80, placeholder: "Ex.: Retorno na fisioterapia", required: true }, true)}
          {campo("data", "Data", { type: "date", min: hoje, required: true })}
          {campo("hora", "Hora (opcional)", { type: "time" })}
          {campo("local", "Onde (opcional)", { maxLength: 100 }, true)}
          {campo("nota", "Lembrete (opcional)", { maxLength: 140, placeholder: "Ex.: levar exames anteriores" }, true)}
          <div className={s.formAcoes}>
            <button type="button" className="botao-texto" onClick={fechar}>Cancelar</button>
            <button type="submit" className="botao">Salvar compromisso</button>
          </div>
        </form>
      )}

      {proximos.length ? (
        <ul className={s.lista}>{proximos.map((a) => <Item key={a.id} a={a} aoAlternar={() => alternar(a.id)} aoRemover={() => remover(a.id)} />)}</ul>
      ) : (
        <div className="vazio vazio--caixa"><strong>Nenhum compromisso pela frente.</strong> Use “Novo compromisso” para anotar o próximo.</div>
      )}
      {anteriores.length > 0 && (
        <details className={s.anteriores}>
          <summary>Concluídos e anteriores ({anteriores.length})</summary>
          <ul className={s.lista}>{anteriores.map((a) => <Item key={a.id} a={a} aoAlternar={() => alternar(a.id)} aoRemover={() => remover(a.id)} />)}</ul>
        </details>
      )}
      <AvisoEquipe />
    </div>
  );
}
