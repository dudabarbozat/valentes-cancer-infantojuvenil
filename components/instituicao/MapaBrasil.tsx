"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CASOS_UF, type Regiao } from "@/lib/dados";
import { carregarMalha, projetar } from "@/lib/ibge";
import { fmt } from "@/lib/util";
import { Esqueleto } from "../comum";
import { Icone } from "../Icone";
import s from "./instituicao.module.css";

const FAIXAS = [
  { ate: 15, cor: "#F3E3C3", rotulo: "até 15" },
  { ate: 40, cor: "#F6BF59", rotulo: "16 a 40" },
  { ate: 80, cor: "#F18B0E", rotulo: "41 a 80" },
  { ate: 150, cor: "#C86F00", rotulo: "81 a 150" },
  { ate: Infinity, cor: "#7A4300", rotulo: "mais de 150" },
];
const cor = (n: number) => (FAIXAS.find((f) => n <= f.ate) ?? FAIXAS[FAIXAS.length - 1])!.cor;

type Desenho = ReturnType<typeof projetar>;

export function MapaBrasil({ regiao, nomes, regioes }: { regiao: Regiao | ""; nomes: Record<string, string>; regioes: Record<string, string> }) {
  const [desenho, setDesenho] = useState<Desenho | null>(null);
  const [erro, setErro] = useState(false);
  const [sel, setSel] = useState<string>("35");

  const carregar = useCallback(() => {
    setErro(false); setDesenho(null);
    carregarMalha().then((f) => setDesenho(projetar(f))).catch(() => setErro(true));
  }, []);
  useEffect(() => { carregar(); }, [carregar]);
  useEffect(() => {
    // ao filtrar uma região, destaca o estado com mais casos dentro dela
    const maior = CASOS_UF.filter((u) => !regiao || u.regiao === regiao).sort((a, b) => b.casos - a.casos)[0];
    if (maior) setSel(maior.codigo);
  }, [regiao]);

  const porCodigo = useMemo(() => Object.fromEntries(CASOS_UF.map((u) => [u.codigo, u])), []);
  const atual = porCodigo[sel];

  return (
    <div className={s.mapaGrade}>
      <div className={s.mapaArea}>
        {!desenho && !erro && (
          <div role="status" aria-label="Carregando a malha de estados do IBGE"><Esqueleto linhas={5} altura={44} /></div>
        )}
        {erro && (
          <div className="erro-caixa" role="alert">
            <p>Não foi possível carregar o mapa do IBGE agora. A tabela ao lado mostra os mesmos números.</p>
            <button type="button" className="botao botao--contorno botao--pequeno" onClick={carregar}><Icone nome="recarregar" />Tentar de novo</button>
          </div>
        )}
        {desenho && (
          <svg viewBox={desenho.viewBox} className={s.mapa} role="group" aria-label="Mapa do Brasil por estado, colorido pelo número de casos ativos fictícios">
            {desenho.paths.map((p) => {
              const u = porCodigo[p.codigo];
              if (!u) return null;
              const fora = regiao !== "" && u.regiao !== regiao;
              const nome = nomes[u.sigla] ?? u.sigla;
              return (
                <path key={p.codigo} d={p.d} fill={cor(u.casos)} tabIndex={fora ? -1 : 0}
                  className={`${s.uf}${fora ? ` ${s.ufFora}` : ""}${sel === p.codigo ? ` ${s.ufSel}` : ""}`}
                  aria-label={`${nome}: ${fmt(u.casos)} casos ativos`}
                  onMouseEnter={() => setSel(p.codigo)} onFocus={() => setSel(p.codigo)} onClick={() => setSel(p.codigo)}>
                  <title>{`${nome}: ${fmt(u.casos)} casos ativos`}</title>
                </path>
              );
            })}
          </svg>
        )}
      </div>
      <div className={s.mapaLado}>
        {atual && (
          <div className={s.mapaInfo} aria-live="polite">
            <span className="etiqueta">{regioes[atual.sigla] ?? atual.regiao}</span>
            <strong>{nomes[atual.sigla] ?? atual.sigla}</strong>
            <span className={s.mapaNum}>{fmt(atual.casos)}</span>
            <span>casos ativos</span>
          </div>
        )}
        <ul className={s.legenda} aria-label="Legenda do mapa">
          {FAIXAS.map((f) => <li key={f.rotulo}><span style={{ background: f.cor }} />{f.rotulo}</li>)}
        </ul>
        <p className={s.mapaFonte}>Malha: IBGE, API de malhas v3. Casos: fictícios.</p>
      </div>
    </div>
  );
}
