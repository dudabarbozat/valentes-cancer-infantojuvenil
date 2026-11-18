import type { Metadata } from "next";
import { Agenda } from "@/components/familia/Agenda";

export const metadata: Metadata = { title: "Agenda" };
export default function Pagina() { return <Agenda />; }
