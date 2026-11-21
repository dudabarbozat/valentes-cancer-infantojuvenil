"use client";

import { useEffect, useState } from "react";
import s from "./FaixaProjeto.module.css";

const CHAVE = "valentes-faixa-fechada";

/* Apresentação do protótipo para quem chega pelo portfólio: o que é, contexto e link do código. */
export default function FaixaProjeto() {
  const [aberta, setAberta] = useState(true);

  useEffect(() => {
    try {
      if (localStorage.getItem(CHAVE) === "1") setAberta(false);
    } catch {}
  }, []);

  if (!aberta) return null;

  function fechar() {
    setAberta(false);
    try {
      localStorage.setItem(CHAVE, "1");
    } catch {}
  }

  return (
    <aside className={s.faixa} aria-label="Sobre o protótipo">
      <div className={s.interno}>
        <p className={s.texto}>
          <b>Valentes</b> <span>Base de dados de câncer infantojuvenil com visões para equipe médica, família e instituições.</span> <small>Pitch Desafio Câncer Infantil · reconstruído em 2026 · dados fictícios</small>
        </p>
        <a className={s.botao} href="https://github.com/dudabarbozat/valentes-cancer-infantojuvenil" target="_blank" rel="noreferrer">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor">
            <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z" />
          </svg>
          Ver o código no GitHub
        </a>
        <button className={s.fechar} type="button" onClick={fechar} aria-label="Fechar apresentação do protótipo">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
