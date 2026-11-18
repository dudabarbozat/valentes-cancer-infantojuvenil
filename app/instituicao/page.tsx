import type { Metadata } from "next";
import { Painel } from "@/components/instituicao/Painel";

export const metadata: Metadata = { title: "Painel de casos" };
export default function Pagina() { return <Painel />; }
