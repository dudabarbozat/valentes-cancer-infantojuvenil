import type { Metadata, Viewport } from "next";
import { League_Spartan, Nunito } from "next/font/google";
import "@fontsource/gidole/400.css";
import "./globals.css";
import { Cabecalho, Rodape } from "@/components/Cabecalho";
import { Toast } from "@/components/comum";
import FaixaProjeto from "@/components/FaixaProjeto";
import { ProvedorEstado } from "@/lib/estado";

const titulo = League_Spartan({ subsets: ["latin"], weight: "700", variable: "--fonte-titulo", display: "swap" });
const texto = Nunito({ subsets: ["latin"], weight: ["400", "600", "700", "800"], variable: "--fonte-texto", display: "swap" });
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: { default: "Valentes · base de câncer infantojuvenil", template: "%s · Valentes" },
  description: "Protótipo: base centralizada de câncer infantojuvenil com visões para equipe médica, família e instituições. Dados fictícios.",
  icons: { icon: `${base}/img/favicon.png` },
};

export const viewport: Viewport = { themeColor: "#F18B0E", width: "device-width", initialScale: 1 };

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${titulo.variable} ${texto.variable}`}>
      <body>
        <ProvedorEstado>
          <a className="pular" href="#conteudo">Pular para o conteúdo</a>
          <FaixaProjeto />
          <Cabecalho />
          <main id="conteudo" className="conteudo" tabIndex={-1}>{children}</main>
          <Rodape />
          <Toast />
        </ProvedorEstado>
      </body>
    </html>
  );
}
