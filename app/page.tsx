import Link from "next/link";
import { Icone } from "@/components/Icone";
import { Ilustracao } from "@/components/Ilustracao";
import { Orientacao } from "@/components/Orientacao";
import { asset } from "@/lib/util";
import s from "./inicio.module.css";

const FRENTES = [
  { id: "medico", titulo: "Equipe médica", texto: "Lista de pacientes com idade, diagnóstico, tempo de doença e local de tratamento. Na ficha, linha do tempo, medicamentos, calendário de procedimentos e um resumo das pendências.", acao: "Entrar como equipe médica" },
  { id: "familia", titulo: "Paciente e família", texto: "Próximos compromissos que vão direto para o calendário do celular, termos do diagnóstico em linguagem simples, dicas para o dia a dia e busca de dúvidas.", acao: "Entrar como família" },
  { id: "instituicao", titulo: "Instituições de combate ao câncer", texto: "Novos casos, crianças em tratamento e curadas, mapa de casos ativos por estado, estágio na chegada e unidades que encaminharam. Exporta os indicadores em CSV.", acao: "Entrar como instituição" },
] as const;

export default function Inicio() {
  return (
    <>
      <section className={s.capa}>
        <h1 className="sr-only">Valentes</h1>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={s.logo} src={asset("/img/logo-valentes.png")} width={461} height={361} alt="" />
        <p className={s.lead}>
          Uma base de dados de câncer infantojuvenil <strong className="realce">compartilhada</strong>, <strong className="realce">confiável</strong> e{" "}
          <strong className="realce">atualizada</strong>, com uma visão para cada pessoa que cuida da criança.
        </p>
      </section>
      <Orientacao />
      <h2 className={s.rotulo} id="rotulo-perfis">Escolha como entrar</h2>
      <ul className={s.frentes} aria-labelledby="rotulo-perfis">
        {FRENTES.map((f, i) => (
          <li key={f.id} className={`${s.frente} ${i === 1 ? s.faixa : ""}`}>
            <div className={s.ilus}><Ilustracao nome={f.id} /></div>
            <div className={s.texto}>
              <h3>{f.titulo}</h3>
              <p>{f.texto}</p>
              <Link className="botao" href={`/${f.id}/`}>{f.acao}<Icone nome="seta" /></Link>
            </div>
          </li>
        ))}
      </ul>
      <p className={s.nota}>Protótipo sem login: o perfil escolhido só muda a visão. Todos os pacientes e números são fictícios.</p>
    </>
  );
}
