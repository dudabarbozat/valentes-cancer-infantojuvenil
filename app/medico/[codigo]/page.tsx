import type { Metadata } from "next";
import { FichaPaciente } from "@/components/medico/FichaPaciente";
import { CODIGOS } from "@/lib/dados";

export const dynamicParams = false;
export function generateStaticParams() { return CODIGOS.map((codigo) => ({ codigo })); }

type Props = { params: Promise<{ codigo: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { codigo } = await params;
  return { title: `Ficha ${codigo}` };
}
export default async function Pagina({ params }: Props) {
  const { codigo } = await params;
  return <FichaPaciente codigo={codigo} />;
}
