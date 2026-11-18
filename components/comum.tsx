"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useEstado } from "@/lib/estado";
import { Icone } from "./Icone";

export function FaixaFicticia({ children }: { children?: ReactNode }) {
  return (
    <div className="faixa-ficticia" role="note">
      <Icone nome="alerta" />
      <span><strong>Dados fictícios para demonstração.</strong> {children ?? "Nenhum paciente, hospital ou número desta tela é real."}</span>
    </div>
  );
}

export function AvisoEquipe({ className }: { className?: string }) {
  return (
    <aside className={`aviso-equipe${className ? ` ${className}` : ""}`}>
      <Icone nome="estetoscopio" />
      <p><strong>Sobre o tratamento, procure a equipe que acompanha a criança.</strong> Este espaço organiza a rotina e explica termos. Ele não avalia sintomas nem substitui orientação médica. Em emergência, ligue 192.</p>
    </aside>
  );
}

export function Esqueleto({ linhas = 3, altura = 18 }: { linhas?: number; altura?: number }) {
  return (
    <div className="esqueleto" aria-hidden="true">
      {Array.from({ length: linhas }, (_, i) => <span key={i} style={{ height: altura, width: `${92 - i * 13}%` }} />)}
    </div>
  );
}

export function Carregando({ texto = "Carregando dados de exemplo" }: { texto?: string }) {
  return (
    <div className="pagina" aria-busy="true">
      <p className="sr-only" role="status">{texto}</p>
      <Esqueleto linhas={1} altura={44} />
      <div style={{ height: 20 }} />
      <Esqueleto linhas={6} altura={56} />
    </div>
  );
}

export function Toast() {
  const { aviso } = useEstado();
  return <div className={`aviso-toast${aviso ? " visivel" : ""}`} role="status" aria-live="polite">{aviso}</div>;
}

/** Lê uma preferência booleana do localStorage depois da hidratação. */
export function usePreferencia(chave: string): [boolean, (v: boolean) => void] {
  const [v, setV] = useState(false);
  useEffect(() => {
    try { setV(window.localStorage.getItem(chave) === "1"); } catch { /* sem armazenamento */ }
  }, [chave]);
  const definir = (n: boolean) => {
    setV(n);
    try { window.localStorage.setItem(chave, n ? "1" : "0"); } catch { /* sem armazenamento */ }
  };
  return [v, definir];
}
