import type { Metadata } from "next";
import { Glossario } from "@/components/familia/GlossarioDicas";

export const metadata: Metadata = { title: "Glossário" };
export default function Pagina() { return <Glossario />; }
