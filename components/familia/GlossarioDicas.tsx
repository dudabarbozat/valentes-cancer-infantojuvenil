"use client";

import { useState } from "react";
import { DICAS, GLOSSARIO } from "@/lib/dados";
import { semAcento } from "@/lib/util";
import { Icone } from "../Icone";
import s from "./familia.module.css";

export function Glossario() {
  const [termo, setTermo] = useState("");
  const lista = [...GLOSSARIO].sort((a, b) => a.termo.localeCompare(b.termo, "pt-BR"));
  const t = semAcento(termo.trim());
  const res = lista.filter((g) => !t || semAcento(`${g.termo} ${g.texto}`).includes(t));
  return (
    <div className="pagina pagina--estreita">
      <header className="pagina__cabeca">
        <div>
          <p className="sobretitulo">Família</p>
          <h1>Glossário</h1>
          <p className="pagina__sub">Palavras que aparecem nas consultas, explicadas sem jargão.</p>
        </div>
      </header>
      <div className="campo campo--destaque">
        <label htmlFor="g-busca">Procurar um termo</label>
        <div className="campo__busca"><Icone nome="busca" />
          <input id="g-busca" type="search" placeholder="Ex.: plaquetas, biópsia" autoComplete="off" value={termo} onChange={(e) => setTermo(e.target.value)} />
        </div>
      </div>
      <p className="contagem" aria-live="polite">{t ? `${res.length} ${res.length === 1 ? "termo encontrado" : "termos encontrados"}` : `${lista.length} termos`}</p>
      {res.length ? (
        <dl className={s.glossario}>
          {res.map((g) => <div key={g.termo} className={s.gItem}><dt>{g.termo}</dt><dd>{g.texto}</dd></div>)}
        </dl>
      ) : (
        <div className="vazio vazio--caixa">Esse termo ainda não está no glossário. Vale perguntar à equipe na próxima consulta.
          {" "}<button type="button" className="botao-texto" onClick={() => setTermo("")}>Limpar busca</button></div>
      )}
      <p className="nota-rodape">Explicações gerais, para ajudar a entender a conversa com a equipe. Cada caso tem particularidades que só a equipe pode explicar.</p>
    </div>
  );
}

export function Dicas() {
  return (
    <div className="pagina">
      <header className="pagina__cabeca">
        <div>
          <p className="sobretitulo">Família</p>
          <h1>Dicas para o dia a dia</h1>
          <p className="pagina__sub">Cuidados práticos com a rotina da família. Nada aqui trata da doença em si.</p>
        </div>
      </header>
      <ul className={s.dicas}>
        {DICAS.map((d, i) => (
          <li key={d.titulo} className={s.dica}>
            <span className={s.dicaNum} aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            <span className="etiqueta">{d.tema}</span>
            <h2>{d.titulo}</h2>
            <p>{d.texto}</p>
          </li>
        ))}
      </ul>
      <aside className={s.futuro}>
        <h2>Previsto na proposta</h2>
        <p>Histórias de superação contadas pelas famílias e um espaço para conversar com outros pais, médicos e hospitais. Não fazem parte deste protótipo.</p>
      </aside>
    </div>
  );
}
