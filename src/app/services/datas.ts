/** Datas de calendário locais (yyyy-MM-dd), sem conversão para UTC. */
export function chaveDia(data = new Date()): string {
  const m = String(data.getMonth() + 1).padStart(2, '0');
  const d = String(data.getDate()).padStart(2, '0');
  return `${data.getFullYear()}-${m}-${d}`;
}

export function somarDias(data: Date, dias: number): Date {
  const nova = new Date(data);
  nova.setDate(nova.getDate() + dias);
  return nova;
}

/** Segunda-feira a domingo da semana atual. */
export function semanaAtual(hoje = new Date()): Date[] {
  const inicio = somarDias(hoje, -((hoje.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => somarDias(inicio, i));
}

export function ultimosDias(qtd: number, hoje = new Date()): Date[] {
  return Array.from({ length: qtd }, (_, i) => somarDias(hoje, i - qtd + 1));
}
