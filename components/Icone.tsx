const PATHS = {
  busca: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
  voltar: '<path d="M15 5l-7 7 7 7"/>',
  seta: '<path d="M9 5l7 7-7 7"/>',
  calendario: '<rect x="3.5" y="5" width="17" height="15.5" rx="1"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  exame: '<path d="M9 3h6M10 3v6.5L5.5 18a2 2 0 0 0 1.8 3h9.4a2 2 0 0 0 1.8-3L14 9.5V3"/><path d="M7.5 15h9"/>',
  remedio: '<rect x="6" y="3" width="12" height="4" rx="1"/><path d="M7 7h10v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z"/><path d="M9.5 13.5h5M12 11v5"/>',
  marco: '<path d="M5 21V4M5 4h12l-2.5 4L17 12H5"/>',
  nota: '<path d="M5 4h10l4 4v12H5z"/><path d="M15 4v4h4M8.5 12.5h7M8.5 16h5"/>',
  estetoscopio: '<path d="M6 3v5a4 4 0 0 0 8 0V3"/><path d="M10 12v2.5a5 5 0 0 0 10 0V13"/><circle cx="20" cy="11" r="2"/>',
  familia: '<circle cx="8" cy="7" r="3"/><circle cx="17" cy="9.5" r="2.3"/><path d="M2.5 20c.5-4 2.6-6.5 5.5-6.5s5 2.5 5.5 6.5M13.5 20c.3-2.8 1.6-4.6 3.5-4.6s3.2 1.8 3.5 4.6"/>',
  instituicao: '<path d="M3 21h18M5 21V10M19 21V10M9.5 21v-6h5v6M2.5 10L12 4l9.5 6"/>',
  livro: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>',
  folha: '<path d="M5 19c0-8 5-13 15-14-1 10-6 15-14 15"/><path d="M5 19l7-7"/>',
  duvida: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.3a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.8"/><circle cx="12" cy="17.2" r=".6" fill="currentColor"/>',
  mais: '<path d="M12 5v14M5 12h14"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  painel: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  relogio: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  local: '<path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21z"/><circle cx="12" cy="10" r="2.3"/>',
  alerta: '<path d="M12 3.5L2.5 20h19z"/><path d="M12 10v4.5"/><circle cx="12" cy="17.3" r=".6" fill="currentColor"/>',
  fechar: '<path d="M6 6l12 12M18 6L6 18"/>',
  baixar: '<path d="M12 4v11M7 10.5l5 5 5-5M4 20h16"/>',
  chave: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3M14 9l2 2"/>',
  faisca: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
  enviar: '<path d="M4 12l16-8-6 16-2.5-6.5z"/>',
  recarregar: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
  mapa: '<path d="M9 4L3 6.5v13.5L9 17.5l6 2.5 6-2.5V4l-6 2.5z"/><path d="M9 4v13.5M15 6.5V20"/>',
} as const;

export type NomeIcone = keyof typeof PATHS;

export function Icone({ nome, className }: { nome: NomeIcone; className?: string }) {
  return (
    <svg className={`ico${className ? ` ${className}` : ""}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false"
      dangerouslySetInnerHTML={{ __html: PATHS[nome] }} />
  );
}
