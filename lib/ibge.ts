"use client";

/* APIs públicas do IBGE (sem chave, com CORS liberado).
   Malha: https://servicodados.ibge.gov.br/api/docs/malhas?versao=3
   Localidades: https://servicodados.ibge.gov.br/api/docs/localidades */

const MALHA = "https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?intrarregiao=UF&formato=application/vnd.geo+json&qualidade=minima";
const ESTADOS = "https://servicodados.ibge.gov.br/api/v1/localidades/estados";

type Anel = [number, number][];
export interface FeicaoUF { codigo: string; poligonos: Anel[][] }
export interface EstadoIBGE { id: number; sigla: string; nome: string; regiao: { id: number; sigla: string; nome: string } }

async function buscar<T>(url: string, ms = 12000): Promise<T> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const r = await fetch(url, { signal: ctrl.signal });
    if (!r.ok) throw new Error(`IBGE respondeu ${r.status}`);
    return (await r.json()) as T;
  } finally {
    clearTimeout(t);
  }
}

const cache = new Map<string, Promise<unknown>>();
function memo<T>(chave: string, fn: () => Promise<T>): Promise<T> {
  const atual = cache.get(chave) as Promise<T> | undefined;
  if (atual) return atual;
  const p = fn().catch((e: unknown) => { cache.delete(chave); throw e; });
  cache.set(chave, p);
  return p;
}

interface GeoJson { features: { properties: { codarea?: string }; geometry: { type: string; coordinates: unknown } }[] }

export function carregarMalha(): Promise<FeicaoUF[]> {
  return memo("malha", async () => {
    const g = await buscar<GeoJson>(MALHA);
    return g.features.map((f) => {
      const c = f.geometry.coordinates;
      const poligonos = (f.geometry.type === "Polygon" ? [c] : c) as Anel[][];
      return { codigo: String(f.properties.codarea ?? ""), poligonos };
    });
  });
}

export const carregarEstados = () => memo("estados", () => buscar<EstadoIBGE[]>(ESTADOS));

/** Projeção equiretangular corrigida pela latitude média do Brasil; devolve paths SVG e o viewBox. */
export function projetar(feicoes: FeicaoUF[], largura = 600) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  const k = Math.cos((-14 * Math.PI) / 180);
  for (const f of feicoes) for (const p of f.poligonos) for (const anel of p) for (const [x, y] of anel) {
    const px = x * k;
    if (px < minX) minX = px; if (px > maxX) maxX = px;
    if (-y < minY) minY = -y; if (-y > maxY) maxY = -y;
  }
  const escala = largura / (maxX - minX);
  const altura = Math.round((maxY - minY) * escala);
  const paths = feicoes.map((f) => ({
    codigo: f.codigo,
    d: f.poligonos.map((p) => p.map((anel) => "M" + anel.map(([x, y]) => `${((x * k - minX) * escala).toFixed(1)},${((-y - minY) * escala).toFixed(1)}`).join("L") + "Z").join("")).join(""),
  }));
  return { paths, viewBox: `0 0 ${largura} ${altura}` };
}
