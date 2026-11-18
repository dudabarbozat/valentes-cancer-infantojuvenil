"use client";

/* Busca de dúvidas da família: glossário + perguntas frequentes.
   Travas fixas para sintoma, emergência, dose e prognóstico. Nunca orientação clínica. */

import { DUVIDAS, GLOSSARIO, type Termo } from "./dados";
import { semAcento } from "./util";

export type Tipo = "explicacao" | "fora_do_escopo" | "urgencia";
export interface Resposta { tipo: Tipo; texto: string; termos: Termo[]; faq: { pergunta: string; resposta: string }[] }

/* Palavras que indicam sintoma, piora ou mudança de remédio: resposta fixa, sem chamar a IA. */
const ALERTA = [
  "febre", "sangra", "sangue no", "convuls", "desmai", "falta de ar", "respir", "vomit", "vômit", "dor forte", "dor muito",
  "manch", "inchad", "nao acorda", "não acorda", "piorou", "piora", "emergenc", "urgenc", "overdose", "engoliu",
];
const CONDUTA = ["dose", "dosagem", "posso dar", "posso tomar", "parar o remedio", "parar o remédio", "trocar o remedio", "aumentar", "diminuir", "vai sobreviver", "chance de cura", "vai morrer", "prognostic", "quanto tempo de vida"];

export const MSG_URGENCIA =
  "O Valentes não avalia sintomas. Siga as orientações que a equipe deu para esse tipo de situação e fale agora com o hospital pelo canal que eles indicaram. Em emergência, ligue 192 (SAMU).";
export const MSG_CONDUTA =
  "Essa é uma decisão que só a equipe que acompanha a criança pode tomar. Anote a dúvida e leve para a equipe, ou ligue para o hospital se for urgente.";

export function triagem(pergunta: string): Resposta | null {
  const p = semAcento(pergunta);
  if (ALERTA.some((a) => p.includes(semAcento(a)))) return { tipo: "urgencia", texto: MSG_URGENCIA, termos: [], faq: [] };
  if (CONDUTA.some((a) => p.includes(semAcento(a)))) return { tipo: "fora_do_escopo", texto: MSG_CONDUTA, termos: [], faq: [] };
  return null;
}

function termosCitados(pergunta: string): Termo[] {
  const p = semAcento(pergunta);
  return GLOSSARIO.filter((g) => {
    const t = semAcento(g.termo);
    const raiz = t.split(" ")[0] ?? t;
    return p.includes(t) || (raiz.length > 4 && p.includes(raiz.slice(0, Math.max(5, raiz.length - 2))));
  });
}

/** Busca a pergunta no glossário e nas perguntas frequentes. */
export function buscarResposta(pergunta: string): Resposta {
  const fixa = triagem(pergunta);
  if (fixa) return fixa;
  const termos = termosCitados(pergunta).slice(0, 3);
  const palavras = semAcento(pergunta).split(/\s+/).filter((w) => w.length > 3);
  const faq = DUVIDAS.filter((d) => palavras.some((w) => semAcento(d.pergunta + " " + d.resposta).includes(w))).slice(0, 3);
  if (!termos.length && !faq.length)
    return { tipo: "fora_do_escopo", texto: "Não encontramos uma resposta pronta. Para perguntas sobre o caso da criança, procure a equipe que acompanha a criança.", termos: [], faq: [] };
  return { tipo: "explicacao", texto: termos.length ? "Encontramos estes termos no glossário:" : "Estas perguntas frequentes podem ajudar:", termos, faq };
}
