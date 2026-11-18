import { HOSPITAIS, iso, type Hospital } from "./dados";

export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const asset = (caminho: string) => `${BASE}${caminho}`;

export const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
export const MESES_LONGOS = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
export const SEMANA = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

export const paraData = (d: string) => new Date(`${d}T12:00:00`);
export const hojeIso = () => iso(new Date(), 0);

export function data(d: string) {
  const x = paraData(d);
  return `${String(x.getDate()).padStart(2, "0")}/${String(x.getMonth() + 1).padStart(2, "0")}/${x.getFullYear()}`;
}
export const dataCurta = (d: string) => { const x = paraData(d); return `${x.getDate()} ${MESES[x.getMonth()]}`; };
export const diaSemana = (d: string) => SEMANA[paraData(d).getDay()] ?? "";
export const diasAte = (d: string) => Math.round((paraData(d).getTime() - paraData(hojeIso()).getTime()) / 86400000);

export function relativo(d: string) {
  const n = diasAte(d);
  if (n === 0) return "hoje";
  if (n === 1) return "amanhã";
  if (n === -1) return "ontem";
  return n > 1 ? `em ${n} dias` : `há ${-n} dias`;
}

export function tempoDoenca(d: string) {
  const dias = -diasAte(d);
  if (dias < 31) return `${dias} ${dias === 1 ? "dia" : "dias"}`;
  const meses = Math.floor(dias / 30.4);
  if (meses < 24) return `${meses} ${meses === 1 ? "mês" : "meses"}`;
  const anos = Math.floor(meses / 12);
  const resto = meses % 12;
  return `${anos} anos${resto ? ` e ${resto} ${resto === 1 ? "mês" : "meses"}` : ""}`;
}

export const hospital = (id: string): Hospital => HOSPITAIS.find((h) => h.id === id) ?? { id, nome: "—", cidade: "", uf: "" };
export const semAcento = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
export const novoId = (p: string) => `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
export const fmt = (n: number) => n.toLocaleString("pt-BR");

export function ler(chave: string): string | null {
  try { return window.localStorage.getItem(chave); } catch { return null; }
}
export function gravar(chave: string, valor: string | null) {
  try {
    if (valor === null) window.localStorage.removeItem(chave);
    else window.localStorage.setItem(chave, valor);
  } catch { /* armazenamento bloqueado: a demo segue em memória */ }
}

/** Gera um arquivo no navegador e dispara o download. */
export function baixar(nome: string, conteudo: string, tipo: string) {
  const blob = new Blob([conteudo], { type: tipo });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
