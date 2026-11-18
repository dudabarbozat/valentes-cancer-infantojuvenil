import type { Metadata } from "next";
import { ListaPacientes } from "@/components/medico/ListaPacientes";

export const metadata: Metadata = { title: "Pacientes" };
export default function Pagina() { return <ListaPacientes />; }
