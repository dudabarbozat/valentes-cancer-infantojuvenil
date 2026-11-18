"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { buscarResposta, type Resposta } from "@/lib/assistente";
import { DUVIDAS } from "@/lib/dados";
import { AvisoEquipe } from "../comum";
import { Icone } from "../Icone";
import s from "./familia.module.css";

const SUGESTOES = ["O que é mielograma?", "Como organizar os documentos?", "O que significa fase de indução?", "Posso adicionar compromissos na agenda?"];

interface Troca { pergunta: string; resposta: Resposta }

export function Duvidas() {
  const [pergunta, setPergunta] = useState("");
  const [erroCampo, setErroCampo] = useState("");
  const [trocas, setTrocas] = useState<Troca[]>([]);

  function perguntar(texto: string) {
    const q = texto.trim();
    if (q.length < 4) { setErroCampo("Escreva a dúvida com um pouco mais de detalhe."); return; }
    setErroCampo("");
    const nova: Troca = { pergunta: q, resposta: buscarResposta(q) };
    setTrocas((t) => [nova, ...t].slice(0, 6));
    setPergunta("");
  }

  const enviar = (e: FormEvent) => { e.preventDefault(); perguntar(pergunta); };

  return (
    <div className="pagina pagina--estreita">
      <header className="pagina__cabeca">
        <div>
          <p className="sobretitulo">Família</p>
          <h1>Dúvidas</h1>
          <p className="pagina__sub">Busca no glossário e nas perguntas frequentes. Não responde sobre o caso da criança.</p>
        </div>
      </header>
      <AvisoEquipe className={s.avisoTopo} />

      <form className={s.pergunta} onSubmit={enviar} noValidate role="search">
        <label htmlFor="pergunta">Qual é a sua dúvida?</label>
        <div className={s.perguntaLinha}>
          <input id="pergunta" value={pergunta} maxLength={300} autoComplete="off" placeholder="Ex.: o que é punção lombar?"
            aria-invalid={Boolean(erroCampo)} aria-describedby="pergunta-erro"
            onChange={(e) => { setPergunta(e.target.value); if (erroCampo) setErroCampo(""); }} />
          <button type="submit" className="botao"><Icone nome="busca" />Buscar</button>
        </div>
        <p id="pergunta-erro" className="campo__erro" role="alert">{erroCampo}</p>
        {trocas.length === 0 && (
          <div className={s.sugestoes}>
            <span>Experimente:</span>
            {SUGESTOES.map((t) => <button key={t} type="button" className={s.sugestao} onClick={() => perguntar(t)}>{t}</button>)}
          </div>
        )}
      </form>

      <div aria-live="polite">
        {trocas.map((t, i) => (
          <article key={`${t.pergunta}-${i}`} className={`${s.resposta} ${t.resposta.tipo === "urgencia" ? s.urgencia : ""}`}>
            <p className={s.rPergunta}>{t.pergunta}</p>
            <p className={s.rTexto}>{t.resposta.tipo === "urgencia" && <Icone nome="alerta" />}{t.resposta.texto}</p>
            {t.resposta.termos.length > 0 && (
              <dl className={s.rTermos}>
                {t.resposta.termos.map((g) => <div key={g.termo}><dt>{g.termo}</dt><dd>{g.texto}</dd></div>)}
              </dl>
            )}
            {t.resposta.faq.map((f) => (
              <details key={f.pergunta} className={s.duvida}><summary>{f.pergunta}</summary><p>{f.resposta}</p></details>
            ))}
            {t.resposta.termos.length > 0 && <p className={s.rFonte}><Link href="/familia/glossario/">Ver glossário completo</Link></p>}
          </article>
        ))}
      </div>

      <h2 className={s.tituloFaq}>Perguntas frequentes</h2>
      <div className={s.duvidas}>
        {DUVIDAS.map((d) => <details key={d.pergunta} className={s.duvida}><summary>{d.pergunta}</summary><p>{d.resposta}</p></details>)}
      </div>
    </div>
  );
}
