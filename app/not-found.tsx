import Link from "next/link";

export default function NaoEncontrada() {
  return (
    <section className="vazio-pagina">
      <h1>Página não encontrada</h1>
      <p>O endereço não corresponde a nenhuma tela.</p>
      <Link className="botao" href="/">Voltar ao início</Link>
    </section>
  );
}
