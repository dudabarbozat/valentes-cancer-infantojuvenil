"use client";

import { usePreferencia } from "./comum";
import { Icone } from "./Icone";

/** Orientação curta na primeira visita; some depois de "Entendi". */
export function Orientacao() {
  const [visto, setVisto] = usePreferencia("valentes:orientacao-vista");
  if (visto) return null;
  return (
    <section className="orientacao" aria-labelledby="orientacao-titulo">
      <h2 id="orientacao-titulo">Primeira vez aqui</h2>
      <ol>
        <li><strong>Escolha um perfil.</strong> Cada um mostra a parte da base que lhe cabe.</li>
        <li><strong>Mexa à vontade.</strong> Anotações e compromissos ficam salvos só neste navegador.</li>
        <li><strong>Tudo é fictício.</strong> Pacientes e números são inventados, e nada aqui é orientação médica.</li>
      </ol>
      <button type="button" className="botao botao--pequeno botao--escuro" onClick={() => setVisto(true)}><Icone nome="check" />Entendi</button>
    </section>
  );
}
