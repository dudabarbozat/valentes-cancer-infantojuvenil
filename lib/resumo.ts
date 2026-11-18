"use client";

/* Resumo da ficha para a equipe médica.
   Regras fixas: só reorganiza o que já está registrado; não sugere conduta. */

import type { Paciente } from "./dados";
import { data, diasAte, hospital, relativo, tempoDoenca } from "./util";

export interface Resumo { sintese: string; pendencias: string[]; proximos: string[] }

export function resumoDaFicha(p: Paciente): Resumo {
  const h = hospital(p.hospital);
  const pend = p.exames.filter((e) => e.resultado === "Aguardando laudo");
  const atrasados = p.procedimentos.filter((x) => !x.realizado && diasAte(x.data) < 0);
  const futuros = p.procedimentos.filter((x) => !x.realizado && diasAte(x.data) >= 0).sort((a, b) => a.data.localeCompare(b.data));
  const emUso = p.medicamentos.filter((m) => m.situacao === "Em uso").length;
  const ultimaNota = [...p.anotacoes].sort((a, b) => b.data.localeCompare(a.data))[0];
  const sintese =
    `Paciente ${p.iniciais}, ${p.idade} anos, com ${p.diagnostico.toLowerCase()} registrado há ${tempoDoenca(p.dataDiagnostico)}, ` +
    `em ${p.fase.toLowerCase()} no ${h.nome}. ${p.exames.length} exames na linha do tempo, ${emUso} medicamento(s) em uso` +
    (ultimaNota ? `. Última anotação da equipe em ${data(ultimaNota.data)}.` : ".");
  const pendencias = [
    ...pend.map((e) => `${e.tipo} de ${data(e.data)} aguardando laudo`),
    ...atrasados.map((x) => `${x.tipo} de ${data(x.data)} sem marcação de realizado`),
  ];
  const proximos = futuros.slice(0, 3).map((x) => `${x.tipo}, ${data(x.data)} às ${x.hora} (${relativo(x.data)})`);
  return { sintese, pendencias, proximos };
}
