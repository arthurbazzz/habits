export type Categoria = 'Saúde' | 'Fitness' | 'Estudo' | 'Bem-estar' | 'Finanças';
export type Frequencia = 'Diário' | 'Semanal' | 'Personalizado';

export interface IHabito {
  id: string;
  nome: string;
  icone: string;
  categoria: Categoria;
  frequencia: Frequencia;
  meta: number;
  unidade: string;
  horario: string;
  criadoEm: string;
  /** Email do dono do hábito no Firestore. */
  usuario?: string;
  /** Progresso por dia, chave no formato yyyy-MM-dd. */
  checkins: Record<string, number>;
}

export interface IUsuario {
  nome: string;
  email: string;
  senhaHash: string;
}

export const CATEGORIAS: Categoria[] = ['Saúde', 'Fitness', 'Estudo', 'Bem-estar', 'Finanças'];
export const FREQUENCIAS: Frequencia[] = ['Diário', 'Semanal', 'Personalizado'];
export const ICONES = Array.from({ length: 8 }, (_, i) => `assets/habits/opcao-${i + 1}.png`);

export function createIHabito(): IHabito {
  return {
    id: '', nome: '', icone: ICONES[0], categoria: 'Saúde', frequencia: 'Diário',
    meta: 1, unidade: 'vez', horario: '09:00', criadoEm: '', checkins: {},
  };
}
