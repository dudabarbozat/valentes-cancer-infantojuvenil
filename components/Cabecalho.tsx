"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { asset } from "@/lib/util";
import { useEstado } from "@/lib/estado";
import { Icone, type NomeIcone } from "./Icone";

type Perfil = "medico" | "familia" | "instituicao";
const PERFIS: Record<Perfil, { nome: string; icone: NomeIcone; itens: [string, string, NomeIcone][] }> = {
  medico: { nome: "Equipe médica", icone: "estetoscopio", itens: [["/medico/", "Pacientes", "estetoscopio"]] },
  familia: {
    nome: "Família", icone: "familia",
    itens: [["/familia/", "Agenda", "calendario"], ["/familia/duvidas/", "Dúvidas", "duvida"], ["/familia/glossario/", "Glossário", "livro"], ["/familia/dicas/", "Dicas", "folha"]],
  },
  instituicao: { nome: "Instituição", icone: "instituicao", itens: [["/instituicao/", "Painel", "painel"]] },
};

const norm = (p: string) => (p.endsWith("/") ? p : `${p}/`);

export function Cabecalho() {
  const caminho = norm(usePathname() || "/");
  const perfil = (caminho.split("/")[1] ?? "") as Perfil;
  const p = PERFIS[perfil];

  return (
    <header className="topo">
      <div className="topo__interno">
        <Link className="marca" href="/" aria-label="Valentes, início">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/img/logo-valentes.png")} width={461} height={361} alt="" />
        </Link>
        {p && (
          <nav className="topo__nav" aria-label={`Seções de ${p.nome}`}>
            {p.itens.map(([href, nome, ic]) => {
              const ativo = caminho === href || (href === "/medico/" && caminho.startsWith("/medico/"));
              return (
                <Link key={href} href={href} aria-current={ativo ? "page" : undefined}>
                  <Icone nome={ic} /><span>{nome}</span>
                </Link>
              );
            })}
          </nav>
        )}
        <div className="topo__acoes">
          {p && (
            <Link className="topo__perfil" href="/" aria-label={`Perfil atual: ${p.nome}. Trocar perfil`}>
              <Icone nome={p.icone} /><span className="topo__rotulo">{p.nome}</span><span className="topo__perfil-troca">Trocar</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export function Rodape() {
  const { restaurar } = useEstado();
  return (
    <footer className="rodape">
      <div className="rodape__interno">
        <p>Protótipo de portfólio. Todos os dados de pacientes, hospitais e indicadores são fictícios. Nada aqui é orientação médica.</p>
        <button type="button" className="botao-texto" onClick={restaurar}>Restaurar dados de exemplo</button>
      </div>
    </footer>
  );
}
