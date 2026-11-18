import type { Metadata } from "next";
import { Dicas } from "@/components/familia/GlossarioDicas";

export const metadata: Metadata = { title: "Dicas" };
export default function Pagina() { return <Dicas />; }
