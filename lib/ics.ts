/* Exportação de compromissos no formato iCalendar (RFC 5545). */

import type { Compromisso } from "./dados";

const escapar = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

/* Linhas com mais de 75 octetos são dobradas com CRLF + espaço. */
function dobrar(linha: string): string {
  const enc = new TextEncoder();
  if (enc.encode(linha).length <= 75) return linha;
  const partes: string[] = [];
  let atual = "";
  for (const ch of linha) {
    if (enc.encode(atual + ch).length > (partes.length ? 74 : 75)) { partes.push(atual); atual = ""; }
    atual += ch;
  }
  partes.push(atual);
  return partes.join("\r\n ");
}

const carimbo = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

function somarMinutos(dataIso: string, hora: string, min: number) {
  const [h, m] = hora.split(":").map(Number);
  const d = new Date(`${dataIso}T00:00:00`);
  d.setHours(h ?? 0, (m ?? 0) + min, 0, 0);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T${p(d.getHours())}${p(d.getMinutes())}00`;
}

export function gerarIcs(itens: Compromisso[], tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Sao_Paulo"): string {
  const agora = carimbo(new Date());
  const linhas = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Valentes//Agenda da familia//PT-BR", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "X-WR-CALNAME:Valentes (demonstração)"];
  for (const c of itens) {
    linhas.push("BEGIN:VEVENT", `UID:${c.id}@valentes.demo`, `DTSTAMP:${agora}`);
    if (c.hora) {
      linhas.push(`DTSTART;TZID=${tz}:${somarMinutos(c.data, c.hora, 0)}`, `DTEND;TZID=${tz}:${somarMinutos(c.data, c.hora, 60)}`);
    } else {
      const d = c.data.replace(/-/g, "");
      const fim = new Date(`${c.data}T12:00:00`); fim.setDate(fim.getDate() + 1);
      const f = `${fim.getFullYear()}${String(fim.getMonth() + 1).padStart(2, "0")}${String(fim.getDate()).padStart(2, "0")}`;
      linhas.push(`DTSTART;VALUE=DATE:${d}`, `DTEND;VALUE=DATE:${f}`);
    }
    linhas.push(`SUMMARY:${escapar(c.titulo)}`);
    if (c.local) linhas.push(`LOCATION:${escapar(c.local)}`);
    linhas.push(`DESCRIPTION:${escapar([c.nota, "Compromisso de demonstração do Valentes (dados fictícios)."].filter(Boolean).join("\n"))}`);
    if (c.hora) linhas.push("BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${escapar(c.titulo)}`, "TRIGGER:-PT2H", "END:VALARM");
    linhas.push("END:VEVENT");
  }
  linhas.push("END:VCALENDAR");
  return linhas.map(dobrar).join("\r\n") + "\r\n";
}
