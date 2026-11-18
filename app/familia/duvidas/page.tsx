import type { Metadata } from "next";
import { Duvidas } from "@/components/familia/Duvidas";

export const metadata: Metadata = { title: "Dúvidas" };
export default function Pagina() { return <Duvidas />; }
