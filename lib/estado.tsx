"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { gerarEstado, type EstadoDemo } from "./dados";
import { gravar, ler } from "./util";

const CHAVE = "valentes:estado:v2";
const VALIDADE_DIAS = 21;

function carregar(): EstadoDemo {
  const bruto = ler(CHAVE);
  if (bruto) {
    try {
      const salvo = JSON.parse(bruto) as EstadoDemo;
      const idade = (Date.now() - new Date(`${salvo.geradoEm}T12:00:00`).getTime()) / 86400000;
      // Depois de algumas semanas a agenda ficaria no passado; regeneramos.
      if (salvo.versao === 2 && Array.isArray(salvo.pacientes) && Array.isArray(salvo.agenda) && idade <= VALIDADE_DIAS) return salvo;
    } catch { /* ignora e regenera */ }
  }
  const novo = gerarEstado();
  gravar(CHAVE, JSON.stringify(novo));
  return novo;
}

interface Ctx {
  estado: EstadoDemo | null;
  /** Aplica uma alteração (mutável sobre uma cópia) e persiste. */
  alterar: (fn: (rascunho: EstadoDemo) => void) => void;
  restaurar: () => void;
  aviso: string;
  avisar: (msg: string) => void;
}

const Contexto = createContext<Ctx | null>(null);

export function ProvedorEstado({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<EstadoDemo | null>(null);
  const [aviso, setAviso] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setEstado(carregar()); }, []);

  const avisar = useCallback((msg: string) => {
    setAviso(msg);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAviso(""), 2800);
  }, []);

  const alterar = useCallback((fn: (r: EstadoDemo) => void) => {
    setEstado((atual) => {
      if (!atual) return atual;
      const copia = structuredClone(atual);
      fn(copia);
      gravar(CHAVE, JSON.stringify(copia));
      return copia;
    });
  }, []);

  const restaurar = useCallback(() => {
    const novo = gerarEstado();
    gravar(CHAVE, JSON.stringify(novo));
    setEstado(novo);
    avisar("Dados de exemplo restaurados.");
  }, [avisar]);

  const valor = useMemo(() => ({ estado, alterar, restaurar, aviso, avisar }), [estado, alterar, restaurar, aviso, avisar]);
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useEstado(): Ctx {
  const c = useContext(Contexto);
  if (!c) throw new Error("useEstado fora do ProvedorEstado");
  return c;
}
